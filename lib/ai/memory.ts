import { createClient } from '@/lib/supabase/server';
import { openai, AI_CONFIG } from './config';
import { generateEmbedding } from './embeddings';

/**
 * Zep-like Memory System for AURA
 * 1. Persistent Storage (Vector DB)
 * 2. Session Summarization (keeps the context concise)
 * 3. Semantic Retrieval (RAG)
 */

interface SessionSummary {
    summary: string;
    timestamp: string;
}

export async function saveMessageWithMemory(userId: string, role: string, content: string) {
    const supabase = await createClient();
    const embedding = await generateEmbedding(content);

    const { error } = await supabase
        .from('chat_messages')
        .insert({
            user_id: userId,
            role,
            content,
            embedding
        });

    if (error) console.error('Error saving message memory:', error);
}

/**
 * Summarizes the last N messages to keep the context window clean.
 * This emulates Zep's summarization.
 */
export async function summarizeRecentHistory(userId: string, messages: any[]) {
    if (messages.length < 10) return null;

    const contentToSummarize = messages.map(m => `${m.role}: ${m.content}`).join('\n');

    const response = await openai.chat.completions.create({
        model: AI_CONFIG.model,
        messages: [
            { role: 'system', content: 'Summarize the following conversation history concisely while keeping all important facts, goals, and user plans. This summary will be used as long-term memory.' },
            { role: 'user', content: contentToSummarize }
        ]
    });

    return response.choices[0].message.content;
}

/**
 * Retrieves the most relevant past memories (ideas + chats)
 * and combines them into an 'Aura Brain' context.
 */
export async function getAuraMemoryContext(userId: string, query: string) {
    const supabase = await createClient();
    const embedding = await generateEmbedding(query);

    // 1. Semantic Search on messages
    const { data: pastChats, error: chatError } = await supabase.rpc('match_chat_messages', {
        query_embedding: embedding,
        match_threshold: 0.4,
        match_count: 5,
        p_user_id: userId
    });

    // 2. Semantic Search on ideas
    const { data: relatedIdeas, error: ideaError } = await supabase.rpc('match_ideas', {
        query_embedding: embedding,
        match_threshold: 0.4,
        match_count: 5,
        p_user_id: userId
    });

    let context = "\n[AURA_MEMORY_RECALL]\n";

    if (relatedIdeas && relatedIdeas.length > 0) {
        context += "Past ideas that might be relevant:\n";
        relatedIdeas.forEach((idea: any) => {
            context += `- ${idea.title}: ${idea.content} (Captured: ${new Date(idea.created_at).toLocaleDateString()})\n`;
        });
    }

    if (pastChats && pastChats.length > 0) {
        context += "Relevant past discussion insights:\n";
        pastChats.forEach((chat: any) => {
            if (chat.role === 'user') {
                context += `- User once said: "${chat.content}"\n`;
            }
        });
    }

    return context === "\n[AURA_MEMORY_RECALL]\n" ? "" : context;
}
