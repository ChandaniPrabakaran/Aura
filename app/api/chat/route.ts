import { createClient } from '@/lib/supabase/server';
import { chatWithAura } from '@/lib/ai/chat';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const supabase = await createClient();

        // 1. Get current session
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // 2. Parse request
        const { message, history, context } = await request.json();

        if (!message) {
            return NextResponse.json({ error: 'Message is required' }, { status: 400 });
        }

        // 3. Process with AURA's brain
        const reply = await chatWithAura(user.id, message, history || [], context);

        // 4. Store the interaction in history (with embeddings for memory)
        // In a production app, we'd do this via a background task or right here
        // For now, let's keep it simple and return the reply

        return NextResponse.json({ reply });
    } catch (error: any) {
        console.error('Chat API Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
