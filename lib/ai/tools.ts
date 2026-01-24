import { createClient } from '@/lib/supabase/server';
import { createEvent, listEvents } from '@/lib/calendar/google-calendar';
import { generateEmbedding } from './embeddings';

/**
 * Tools available for the AURA AI Assistant.
 * All tools are user-scoped to ensure privacy and per-user data isolation.
 */

export const auraTools = {
    // --- TODO TOOLS ---
    async createTodo(userId: string, title: string, description?: string, dueDate?: string, priority = 'medium') {
        const supabase = await createClient();
        const { data, error } = await supabase
            .from('todos')
            .insert([{ user_id: userId, title, description, due_date: dueDate, priority }])
            .select()
            .single();
        if (error) throw error;
        return `Created todo: ${data.title}`;
    },

    async listTodos(userId: string, status = 'pending') {
        const supabase = await createClient();
        const { data, error } = await supabase
            .from('todos')
            .select('*')
            .eq('user_id', userId)
            .eq('status', status)
            .order('due_date', { ascending: true });
        if (error) throw error;
        return data;
    },

    // --- IDEA TOOLS ---
    async saveIdea(userId: string, title: string, content: string, tags: string[] = []) {
        const supabase = await createClient();
        const embedding = await generateEmbedding(`${title} ${content}`);
        const { data, error } = await supabase
            .from('ideas')
            .insert([{ user_id: userId, title, content, tags, embedding }])
            .select()
            .single();
        if (error) throw error;
        return `Saved idea: ${data.title}`;
    },

    // --- GOAL TOOLS ---
    async createGoal(userId: string, title: string, description?: string, targetDate?: string) {
        const supabase = await createClient();
        const { data, error } = await supabase
            .from('goals')
            .insert([{ user_id: userId, title, description, target_date: targetDate, status: 'active', progress: 0 }])
            .select()
            .single();
        if (error) throw error;
        return `New Goal set: "${data.title}". I'll keep an eye on your progress!`;
    },

    async listGoals(userId: string) {
        const supabase = await createClient();
        const { data, error } = await supabase
            .from('goals')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });
        if (error) throw error;
        return data;
    },

    async updateGoalProgress(userId: string, goalId: string, progress: number) {
        const supabase = await createClient();
        const { data, error } = await supabase
            .from('goals')
            .update({ progress })
            .eq('id', goalId)
            .eq('user_id', userId)
            .select()
            .single();
        if (error) throw error;
        return `Updated progress for "${data.title}" to ${progress}%!`;
    },

    // --- CALENDAR TOOLS (In-App Manifest) ---
    async scheduleMeeting(userId: string, summary: string, start: string, end: string, description?: string) {
        const supabase = await createClient();

        try {
            // Check for local conflicts
            const { data: conflicts } = await supabase
                .from('calendar_events')
                .select('*')
                .eq('user_id', userId)
                .gte('start_time', start)
                .lte('start_time', end);

            if (conflicts && conflicts.length > 0) {
                return `Aura Alert: Your timeline already has a manifestation at ${new Date(conflicts[0].start_time).toLocaleTimeString()} ("${conflicts[0].title}"). Should I optimize and find a different slot or overwrite it?`;
            }

            const { data, error } = await supabase
                .from('calendar_events')
                .insert([{
                    user_id: userId,
                    title: summary,
                    description,
                    start_time: start,
                    end_time: end,
                }])
                .select()
                .single();

            if (error) throw error;
            return `Aura Manifest: Scheduled "${data.title}" for ${new Date(start).toLocaleString()}. Your 2026 timeline is synchronized.`;
        } catch (err: any) {
            return `Signal Logic Failure: ${err.message}`;
        }
    },

    async checkAvailability(userId: string, day: string) {
        const supabase = await createClient();
        try {
            const startOfDay = new Date(day);
            startOfDay.setHours(0, 0, 0, 0);
            const endOfDay = new Date(day);
            endOfDay.setHours(23, 59, 59, 999);

            const { data: events, error } = await supabase
                .from('calendar_events')
                .select('*')
                .eq('user_id', userId)
                .gte('start_time', startOfDay.toISOString())
                .lte('start_time', endOfDay.toISOString())
                .order('start_time', { ascending: true });

            if (error) throw error;

            if (!events || events.length === 0) return "Your 2026 trajectory is currently clear for that day.";

            const eventList = events.map((e: any) => `- ${e.title} (${new Date(e.start_time).toLocaleTimeString()})`).join('\n');
            return `Scanning current timeline for ${new Date(day).toDateString()}:\n${eventList}`;
        } catch (err: any) {
            return `Temporal Scanning Error: ${err.message}`;
        }
    }
};
