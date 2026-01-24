import { getAuthUrl } from '@/lib/calendar/google-auth';
import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

/**
 * Generates the specific Google OAuth URL for the user to connect their calendar.
 * Checks for user-level API key overrides first.
 */
export async function GET() {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        // Even if user isn't logged in, we try a default, but specifically for AURA we want logged in users
        const url = await getAuthUrl(user?.id);
        return NextResponse.json({ url });
    } catch (error: any) {
        console.error('Auth Link Error:', error);
        return NextResponse.json({ error: 'Failed to generate auth URL' }, { status: 500 });
    }
}
