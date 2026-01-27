import { adminClient } from '@/lib/supabase/admin';
import { createEvent, listEvents } from '@/lib/calendar/google-calendar';
import { generateEmbedding } from './embeddings';

/**
 * Tools available for the AURA AI Assistant.
 * All tools are user-scoped to ensure privacy and per-user data isolation.
 */

export const auraTools = {
    // --- TODO TOOLS ---
    async createTodo(userId: string, title: string, description?: string, dueDate?: string, priority = 'medium') {
        const supabase = adminClient;

        let isoDate = null;
        if (dueDate) {
            try { isoDate = new Date(dueDate).toISOString(); } catch (e) { isoDate = null; }
        }

        const { error } = await supabase
            .from('todos')
            .insert([{
                user_id: userId,
                title,
                description,
                due_date: isoDate,
                priority,
                status: 'pending'
            }]);

        if (error) {
            console.error("Create Todo Error:", error);
            throw new Error(`Failed to create command: ${error.message}`);
        }
        return `Successfully initialized command: ${title}`;
    },

    async listTodos(userId: string, status = 'pending') {
        const supabase = adminClient;
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
    async saveIdea(userId: string, title: string, content: string, tags: any = []) {
        const supabase = adminClient;

        // Ensure tags is an array
        const finalTags = Array.isArray(tags) ? tags : [tags].filter(Boolean);

        const embedding = await generateEmbedding(`${title} ${content}`);

        const { error } = await supabase
            .from('ideas')
            .insert([{
                user_id: userId,
                title,
                content,
                tags: finalTags,
                embedding
            }]);

        if (error) {
            console.error("Save Idea Error:", error);
            throw new Error(`Failed to crystalline memory: ${error.message}`);
        }
        return `Neural signature for "${title}" has been crystallized in The Vault.`;
    },

    // --- GOAL TOOLS ---
    async createGoal(userId: string, title: string, description?: string, targetDate?: string, type: string = 'long_term') {
        const supabase = adminClient;

        let isoDate = null;
        if (targetDate) {
            try { isoDate = new Date(targetDate).toISOString(); } catch (e) { isoDate = null; }
        }

        // Validate type against database ENUM constraint
        const allowedTypes = ['daily', 'weekly', 'monthly', 'long_term'];
        const finalType = allowedTypes.includes(type) ? type : 'long_term';

        const { error } = await supabase
            .from('goals')
            .insert([{
                user_id: userId,
                title,
                description: description || "",
                target_date: isoDate,
                status: 'active',
                progress: 0,
                type: finalType
            }]);

        if (error) {
            console.error("Create Goal Error:", error);
            throw new Error(`Failed to establish trajectory: ${error.message}`);
        }
        return `New Objective set: "${title}" (${finalType}). Trajectory is now active.`;
    },

    async listGoals(userId: string) {
        const supabase = adminClient;
        const { data, error } = await supabase
            .from('goals')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });
        if (error) throw error;
        return data;
    },

    async updateGoalProgress(userId: string, goalId: string, progress: number) {
        const supabase = adminClient;
        const { data, error } = await supabase
            .from('goals')
            .update({ progress, updated_at: new Date().toISOString() })
            .eq('id', goalId)
            .eq('user_id', userId)
            .select()
            .single();
        if (error) throw error;
        return `Updated progress for "${data.title}" to ${progress}%!`;
    },

    async updateGoal(userId: string, goalId: string, updates: { title?: string, description?: string, targetDate?: string, type?: string, progress?: number }) {
        const supabase = adminClient;

        const payload: any = { updated_at: new Date().toISOString() };
        if (updates.title) payload.title = updates.title;
        if (updates.description) payload.description = updates.description;
        if (updates.progress !== undefined) payload.progress = updates.progress;
        if (updates.targetDate) {
            try { payload.target_date = new Date(updates.targetDate).toISOString(); } catch (e) { }
        }
        if (updates.type) {
            const allowedTypes = ['daily', 'weekly', 'monthly', 'long_term'];
            payload.type = allowedTypes.includes(updates.type) ? updates.type : 'long_term';
        }

        const { data, error } = await supabase
            .from('goals')
            .update(payload)
            .eq('id', goalId)
            .eq('user_id', userId)
            .select()
            .single();

        if (error) throw error;
        return `Successfully updated Objective: "${data.title}".`;
    },

    // --- CALENDAR TOOLS (In-App Manifest) ---
    async scheduleMeeting(userId: string, summary: string, start: string, end: string, description?: string) {
        const supabase = adminClient;

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

            const { error } = await supabase
                .from('calendar_events')
                .insert([{
                    user_id: userId,
                    title: summary,
                    description,
                    start_time: start,
                    end_time: end,
                }]);

            if (error) throw error;
            return `Aura Manifest: Scheduled "${summary}" for ${new Date(start).toLocaleString()}. Your 2026 timeline is synchronized.`;
        } catch (err: any) {
            return `Signal Logic Failure: ${err.message}`;
        }
    },

    async checkAvailability(userId: string, day: string) {
        const supabase = adminClient;
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
