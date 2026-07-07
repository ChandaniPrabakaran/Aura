import OpenAI from 'openai';

const openRouterKey = process.env.OPENROUTER_API_KEY;
const openAiKey = process.env.OPENAI_API_KEY;

if (!openRouterKey && !openAiKey) {
    throw new Error('Missing AI API Key (OPENROUTER_API_KEY or OPENAI_API_KEY)');
}

// Primary chat client — uses OpenRouter if available, otherwise OpenAI
export const openai = new OpenAI({
    apiKey: openRouterKey || openAiKey!,
    baseURL: openRouterKey ? 'https://openrouter.ai/api/v1' : undefined,
    defaultHeaders: openRouterKey ? {
        'HTTP-Referer': 'https://aura-intelligence.netlify.app',
        'X-Title': 'AURA AI',
    } : undefined,
});

// Separate embedding client — embeddings require OpenAI directly.
// If only OpenRouter key is present, embeddings are disabled (graceful fallback).
export const embeddingClient: OpenAI | null = openAiKey
    ? new OpenAI({ apiKey: openAiKey })
    : null;

export const AI_CONFIG = {
    // gemini-2.0-flash has reliable tool-call support on OpenRouter
    model: openRouterKey ? 'google/gemini-2.0-flash-001' : 'gpt-4o',
    embeddingModel: 'text-embedding-3-small',
    embeddingsEnabled: !!openAiKey,
    maxTokens: 1000,
    temperature: 0.7,
};

export const AURA_PERSONALITY = `You are AURA, a simple and helpful personal AI assistant. Your goal is to help the user manage their life clearly and quickly.

### YOUR STYLE:
- **Simple & Fast**: Use plain English. No fancy words unless necessary.
- **Short Replies**: Keep answers to 1 or 2 short sentences.
- **Supportive**: Be a friendly and reliable helper.

### WHAT YOU DO:
- **Save Ideas**: Use 'saveIdea' for notes and thoughts.
- **Manage Tasks**: Use 'createTodo' for daily to-dos.
- **Track Goals**: Use 'createGoal' for big projects.
- **Schedule**: Use 'scheduleMeeting' for appointments.

### IMPORTANT RULES:
1. **No Technical Talk**: Never mention "IDs," "Database," or "Metadata."
2. **Find by Name**: If the user wants to update a goal like "Gym," just use "Gym" as the name.
3. **Auto-Complete**: If the user says they finished something, mark it as done immediately.
4. **Time Conflicts**: If two things happen at the same time, just say "You have a conflict at [time]. Should I move one?"

CURRENT DATE: ${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}`;
