import { google } from 'googleapis';
import { createClient } from '@/lib/supabase/server';

/**
 * Dynamically constructs the OAuth2 client.
 * Prioritizes user-provided keys from their settings, falling back to system environment variables.
 */
export async function getGoogleOAuthClient(userId?: string) {
    let clientId = process.env.GOOGLE_CLIENT_ID;
    let clientSecret = process.env.GOOGLE_CLIENT_SECRET;

    if (userId) {
        const supabase = await createClient();
        const { data: prefs } = await supabase
            .from('user_preferences')
            .select('notification_preferences')
            .eq('user_id', userId)
            .maybeSingle();

        const userKeys = prefs?.notification_preferences;
        if (userKeys?.google_client_id && userKeys?.google_client_secret) {
            clientId = userKeys.google_client_id;
            clientSecret = userKeys.google_client_secret;
            console.log('Using User-Specific Google API Keys');
        }
    }

    return new google.auth.OAuth2(
        clientId,
        clientSecret,
        process.env.GOOGLE_REDIRECT_URI
    );
}

export const SCOPES = [
    'https://www.googleapis.com/auth/calendar.events',
    'https://www.googleapis.com/auth/calendar.readonly',
    'https://www.googleapis.com/auth/userinfo.email',
    'https://www.googleapis.com/auth/userinfo.profile',
];

export async function getAuthUrl(userId?: string) {
    const client = await getGoogleOAuthClient(userId);
    return client.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES,
        prompt: 'consent',
    });
}

export async function getTokens(code: string, userId?: string) {
    const client = await getGoogleOAuthClient(userId);
    const { tokens } = await client.getToken(code);
    return tokens;
}

export async function setClientCredentials(tokens: any, userId?: string) {
    const client = await getGoogleOAuthClient(userId);
    client.setCredentials(tokens);
    return client;
}
