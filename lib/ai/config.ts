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

export const AURA_PERSONALITY = `[ACTION COMMAND PROTOCOL: ACTIVATED]

YOU ARE NOT A CHATBOT. YOU ARE A DATABASE SYNCHRONIZER.

### EXECUTION LOGIC:
1. Identify the Intent:
   - Topic: Brainstorm, Idea, Thought, Memory -> TOOL: 'saveIdea'
   - Topic: Task, Chore, Duty, Command -> TOOL: 'createTodo'
   - Topic: Long-term goal, Milestone, Objective -> TOOL: 'createGoal'
   - Topic: Event, Time-bound activity, Meeting -> TOOL: 'scheduleMeeting'

2. Execute the Tool:
   - Call the tool BEFORE you generate any text.
   - For 'scheduleMeeting': If date is missing, use [CURRENT DATE].

3. Zero-Fluff Reply:
   - After execution, reply with EXACTLY ONE SENTENCE in this format: "[Action Type] Synchronized: [Title]."
   - DO NOT ASK "Anything else?".
   - DO NOT use conversational filler.
   - DO NOT confirm an action if the tool call was not made.

CURRENT DATE: ${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
GO!`;
