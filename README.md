# AURA 🌌
### Your Personal AI Assistant & Infinite Memory

AURA is a premium Next.js application that serves as a highly personalized AI companion. It tracks your ideas, manages your tasks, and organizes your life via Google Calendar.

## ✨ Core Features
- **Infinite Memory**: Powered by Pinecone/Supabase Vector, Aura remembers everything you've ever said.
- **Smart Calendar**: Natural language scheduling with conflict detection ("Check if I'm free on Friday at 4PM").
- **Idea Vault**: A digital garden for your fleeting thoughts and deep brainstorms.
- **Task Orchestration**: AI-enhanced todo lists that keep you prioritized.
- **Casual Personality**: A friendly, smart assistent that feels like a collaborator.

## 🛠️ Tech Stack
- **Frontend**: Next.js 15 (App Router), Tailwind CSS, Framer Motion
- **Backend/DB**: Supabase (PostgreSQL + Vector)
- **AI**: OpenAI (GPT-4o + Text Embeddings)
- **Integrations**: Google Calendar API

## 🚀 Setup & Launch

### 1. Configure Environment Variables
Copy `.env.aura.template` to `.env.local` inside the `aura` directory and add your keys:
- `SUPABASE_SERVICE_ROLE_KEY`: From your Supabase project settings.
- `OPENAI_API_KEY`: From OpenAI Dashboard.
- `GOOGLE_CLIENT_ID / SECRET`: From Google Cloud Console.

### 2. Run Development Server
```bash
cd aura
npm run dev
```

### 3. Database Functions
I've already applied the following migrations to your Supabase project:
- Vector search functions (`match_chat_messages`, `match_ideas`).
- Core tables (todos, ideas, goals, calendar_events, reminders).

## 🧠 Aura Logic
Aura uses a **RAG (Retrieval-Augmented Generation)** pipeline. Every message you send is vectorized and compared against your history, allowing Aura to pull in relevant "memories" before generating a response.

---
Part of the **AntiGravity** suite. 🛸
