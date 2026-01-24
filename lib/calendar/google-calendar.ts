import { google } from 'googleapis';
import { setClientCredentials } from './google-auth';
import { createClient } from '@/lib/supabase/server';

/**
 * Gets a fresh, valid access token for a specific user.
 * Dynamically handles both user-provided and system-default Google API keys.
 */
async function getValidUserTokens(userId: string) {
    const supabase = await createClient();
    const { data: connection, error } = await supabase
        .from('calendar_connections')
        .select('*')
        .eq('user_id', userId)
        .single();

    if (error || !connection) throw new Error('Calendar not connected');

    const expiryDate = new Date(connection.token_expiry);
    const now = new Date();

    // If token is expired or about to expire in 5 minutes
    if (expiryDate.getTime() - now.getTime() < 300000) {
        // Note: setClientCredentials now dynamically fetches the correct ClientID/Secret for this user
        const auth = await setClientCredentials({
            access_token: connection.access_token,
            refresh_token: connection.refresh_token,
        }, userId);

        try {
            const { credentials } = await auth.refreshAccessToken();

            await supabase.from('calendar_connections').update({
                access_token: credentials.access_token,
                token_expiry: credentials.expiry_date ? new Date(credentials.expiry_date).toISOString() : new Date(Date.now() + 3600000).toISOString(),
                updated_at: new Date().toISOString()
            }).eq('user_id', userId);

            return credentials;
        } catch (refreshErr) {
            console.error('Failed to refresh Google token:', refreshErr);
            throw new Error('AUTH_EXPIRED: Re-connection to Google Calendar required');
        }
    }

    return connection;
}

export async function listEvents(userId: string, timeMin = new Date().toISOString()) {
    const tokens = await getValidUserTokens(userId);
    const auth = await setClientCredentials(tokens, userId);
    const calendar = google.calendar({ version: 'v3', auth });

    const response = await calendar.events.list({
        calendarId: 'primary',
        timeMin,
        maxResults: 10,
        singleEvents: true,
        orderBy: 'startTime',
    });

    return response.data.items || [];
}

export async function createEvent(userId: string, eventData: any) {
    const tokens = await getValidUserTokens(userId);
    const auth = await setClientCredentials(tokens, userId);
    const calendar = google.calendar({ version: 'v3', auth });

    const result = await calendar.events.insert({
        calendarId: 'primary',
        requestBody: eventData,
    });

    return result.data;
}

export async function deleteEvent(userId: string, eventId: string) {
    const tokens = await getValidUserTokens(userId);
    const auth = await setClientCredentials(tokens, userId);
    const calendar = google.calendar({ version: 'v3', auth });

    await calendar.events.delete({
        calendarId: 'primary',
        eventId,
    });
}
