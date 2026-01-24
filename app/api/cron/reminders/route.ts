import { createClient } from '@/lib/supabase/server';
import { sendEmailReminder } from '@/lib/email';
import { NextResponse } from 'next/server';

/**
 * Worker route to process reminders. 
 * Can be triggered by a Cron job (Vercel Cron, GitHub Actions, etc.)
 */
export async function GET(request: Request) {
    // Optional: Add a secret key check to prevent public abuse
    // const authHeader = request.headers.get('authorization');
    // if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) return new Response('Unauthorized', { status: 401 });

    const supabase = await createClient();
    const now = new Date().toISOString();

    // 1. Get due reminders
    const { data: dueReminders, error: fetchError } = await supabase
        .from('reminders')
        .select('*, profiles(email)')
        .eq('sent', false)
        .lte('remind_at', now);

    if (fetchError) return NextResponse.json({ error: fetchError.message }, { status: 500 });
    if (!dueReminders || dueReminders.length === 0) return NextResponse.json({ status: 'No reminders due' });

    const results = [];

    for (const reminder of dueReminders) {
        try {
            const { email } = (reminder.profiles as any) || {};

            if (email && reminder.notification_type.includes('email')) {
                await sendEmailReminder(email, `Reminder: ${reminder.type}`, reminder.message);
            }

            // 2. Mark as sent
            await supabase
                .from('reminders')
                .update({ sent: true })
                .eq('id', reminder.id);

            results.push({ id: reminder.id, status: 'sent' });
        } catch (err: any) {
            results.push({ id: reminder.id, status: 'failed', error: err.message });
        }
    }

    return NextResponse.json({ processed: results.length, details: results });
}
