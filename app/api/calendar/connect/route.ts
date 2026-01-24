import { createClient } from '@/lib/supabase/server';
import { getTokens } from '@/lib/calendar/google-auth';
import { NextResponse } from 'next/server';

/**
 * Handle the Google OAuth callback.
 * Exchanges the code for user-specific tokens and saves them to Supabase.
 */
export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    const error = searchParams.get('error');

    if (error) {
        return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/dashboard/calendar?error=auth_denied`);
    }

    if (!code) {
        return NextResponse.json({ error: 'Missing code' }, { status: 400 });
    }

    try {
        const supabase = await createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized. Please login again.' }, { status: 401 });
        }

        // Exchange code for user tokens
        const tokens = await getTokens(code, user.id);

        // Save tokens in the user's specific calendar_connections table
        const { error: dbError } = await supabase
            .from('calendar_connections')
            .upsert({
                user_id: user.id,
                provider: 'google',
                access_token: tokens.access_token,
                refresh_token: tokens.refresh_token,
                token_expiry: tokens.expiry_date ? new Date(tokens.expiry_date).toISOString() : new Date(Date.now() + 3600000).toISOString(),
                updated_at: new Date().toISOString()
            });

        if (dbError) throw dbError;

        // Redirect back to calendar dashboard
        return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/dashboard/calendar?success=connected`);
    } catch (err: any) {
        console.error('Callback Error:', err);
        return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/dashboard/calendar?error=server_error`);
    }
}
