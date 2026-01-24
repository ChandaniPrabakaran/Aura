import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ success: false, error: "No user found in session" }, { status: 401 });
        }

        console.log("TEST-DB: Upserting for user", user.id);

        const { data, error } = await supabase
            .from('user_preferences')
            .upsert({
                user_id: user.id,
                ai_personality: 'casual',
                timezone: 'UTC',
                notification_preferences: { test: true }
            })
            .select();

        if (error) throw error;

        return NextResponse.json({ success: true, data });
    } catch (error: any) {
        console.error("TEST-DB Error:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
