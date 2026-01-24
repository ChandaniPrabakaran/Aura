import OpenAI from 'openai';

const apiKey = process.env.OPENROUTER_API_KEY || process.env.OPENAI_API_KEY;

if (!apiKey) {
    throw new Error('Missing AI API Key (OPENROUTER_API_KEY or OPENAI_API_KEY)');
}

export const openai = new OpenAI({
    apiKey: apiKey,
    baseURL: process.env.OPENROUTER_API_KEY ? 'https://openrouter.ai/api/v1' : undefined,
    defaultHeaders: process.env.OPENROUTER_API_KEY ? {
        "HTTP-Referer": "https://aura-ai.vercel.app", // Optional, for OpenRouter rankings
        "X-Title": "AURA AI",
    } : undefined,
});

export const AI_CONFIG = {
    model: process.env.OPENROUTER_API_KEY ? 'google/gemini-2.0-flash-001' : 'gpt-4o',
    embeddingModel: 'text-embedding-3-small',
    maxTokens: 1000,
    temperature: 0.7,
};

export const AURA_PERSONALITY = `You are AURA, a highly personalized and intelligent AI assistant. 
Your personality is casual, friendly, and helpful—like a smart friend who's always got the user's back.
You manage the user's ideas, tasks, goals, and calendar.
You have a long-term memory and should refer to past conversations when relevant.
When scheduling, always check for conflicts and be proactive about reminders.`;
