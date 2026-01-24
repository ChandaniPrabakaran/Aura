"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Activity, Target, Lightbulb, CheckCircle2,
    Calendar, ArrowRight, Sparkles, Brain, Clock, Zap, ChevronRight
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import NeuralChat from "@/components/dashboard/NeuralChat";

interface Goal { id: string; title: string; progress: number; }
interface Todo { id: string; title: string; status: string; }
interface Idea { id: string; title: string; created_at: string; }
interface Event { id: string; title: string; start_time: string; }

export default function DashboardHap() {
    const [stats, setStats] = useState({ tasks: 0, goals: 0, ideas: 0 });
    const [recentTasks, setRecentTasks] = useState<Todo[]>([]);
    const [activeGoals, setActiveGoals] = useState<Goal[]>([]);
    const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
    const [recentIdeas, setRecentIdeas] = useState<Idea[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const supabase = createClient();

    useEffect(() => {
        fetchAllData();
    }, []);

    async function fetchAllData() {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const [tasksResp, goalsResp, ideasResp, eventsResp] = await Promise.all([
            supabase.from('todos').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).limit(3),
            supabase.from('goals').select('*').eq('user_id', user.id).eq('status', 'active').limit(2),
            supabase.from('ideas').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).limit(2),
            supabase.from('calendar_events').select('*').eq('user_id', user.id).gte('start_time', new Date().toISOString()).order('start_time', { ascending: true }).limit(3)
        ]);

        if (tasksResp.data) setRecentTasks(tasksResp.data);
        if (goalsResp.data) setActiveGoals(goalsResp.data);
        if (ideasResp.data) setRecentIdeas(ideasResp.data);
        if (eventsResp.data) setUpcomingEvents(eventsResp.data);

        const [tCount, gCount, iCount] = await Promise.all([
            supabase.from('todos').select('id', { count: 'exact' }).eq('user_id', user.id).eq('status', 'pending'),
            supabase.from('goals').select('id', { count: 'exact' }).eq('user_id', user.id).eq('status', 'active'),
            supabase.from('ideas').select('id', { count: 'exact' }).eq('user_id', user.id)
        ]);

        setStats({
            tasks: tCount.count || 0,
            goals: gCount.count || 0,
            ideas: iCount.count || 0
        });
        setIsLoading(false);
    }

    return (
        <div className="flex h-screen overflow-hidden">
            {/* Main Conversational Workspace */}
            <main className="flex-1 flex flex-col relative h-full">
                {/* Supportive Dynamic Header */}
                <header className="h-24 flex items-center justify-between px-12 bg-white/40 backdrop-blur-3xl sticky top-0 z-50 border-b border-black/[0.02]">
                    <div className="flex items-center gap-6">
                        <div className="flex -space-x-3">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="w-8 h-8 rounded-2xl bg-white border-2 border-aura-bg flex items-center justify-center shadow-sm">
                                    <div className="w-1.5 h-1.5 rounded-full bg-aura-indigo animate-pulse" style={{ animationDelay: `${i * 0.2}s` }} />
                                </div>
                            ))}
                        </div>
                        <div>
                            <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-aura-gray/60 mb-1">State: Active</h2>
                            <span className="text-base font-bold text-aura-charcoal">Chandani's Executive Core</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-8">
                        <div className="hidden md:flex flex-col items-end">
                            <div className="flex items-center gap-2 text-aura-emerald font-black text-[10px] uppercase tracking-widest">
                                <div className="w-1.5 h-1.5 rounded-full bg-aura-emerald shadow-[0_0_8px_#10B981]" />
                                AURA Sync: Optimal
                            </div>
                        </div>
                        <div className="w-[1px] h-6 bg-black/[0.06]" />
                        <button className="px-5 py-2.5 bg-white border border-black/[0.04] rounded-2xl text-xs font-bold text-aura-indigo shadow-sm hover:shadow-md transition-all active:scale-95">
                            Command Map
                        </button>
                    </div>
                </header>

                {/* The Conversational Brain */}
                <div className="flex-1 min-h-0 bg-transparent">
                    <NeuralChat userData={{ tasks: recentTasks, goals: activeGoals, ideas: recentIdeas, events: upcomingEvents }} />
                </div>
            </main>

            {/* Living Context Sidecar (Right) */}
            <aside className="w-[440px] border-l border-black/[0.03] bg-white/40 backdrop-blur-2xl p-10 overflow-y-auto no-scrollbar relative">
                <div className="absolute top-0 right-0 w-64 h-64 bg-aura-indigo/5 rounded-full blur-3xl -z-10" />

                <div className="space-y-14">

                    {/* Trajectories: Progress Focus */}
                    <section>
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h3 className="text-xs font-black uppercase tracking-widest text-aura-gray/60 mb-1 leading-none">Trajectories</h3>
                                <p className="text-[10px] font-bold text-aura-indigo">2 Primary Vectors Active</p>
                            </div>
                            <div className="p-3 bg-aura-indigo/[0.03] rounded-2xl border border-aura-indigo/10">
                                <Target size={18} className="text-aura-indigo" />
                            </div>
                        </div>
                        <div className="space-y-5">
                            {activeGoals.map(goal => (
                                <div key={goal.id} className="p-6 bg-white border border-black/[0.06] rounded-3xl shadow-sm group hover:border-aura-indigo/20 transition-all cursor-pointer">
                                    <div className="flex justify-between items-start mb-4">
                                        <h4 className="font-bold text-sm text-aura-charcoal leading-snug pr-6">{goal.title}</h4>
                                        <span className="text-[11px] font-black text-aura-indigo">{goal.progress}%</span>
                                    </div>
                                    <div className="h-2 w-full bg-aura-soft-gray rounded-full overflow-hidden p-[2px]">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${goal.progress}%` }}
                                            transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                                            className="h-full bg-gradient-to-r from-aura-indigo to-aura-accent rounded-full shadow-[0_0_10px_rgba(99,102,241,0.2)]"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Timeline Peek: Temporal View */}
                    <section>
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-xs font-black uppercase tracking-widest text-aura-gray/60 leading-none">Temporal Map</h3>
                            <ChevronRight size={14} className="text-aura-gray/40" />
                        </div>
                        <div className="space-y-4 relative">
                            <div className="absolute left-4 top-2 bottom-2 w-0.5 bg-aura-indigo/5" />
                            {upcomingEvents.map(e => (
                                <div key={e.id} className="pl-12 relative py-2 group cursor-pointer hover:translate-x-1 transition-transform">
                                    <div className="absolute left-[11px] top-4 w-3 h-3 rounded-full bg-white border-2 border-aura-indigo/20 group-hover:border-aura-indigo transition-colors" />
                                    <div className="text-[10px] font-black text-aura-indigo/40 mb-1 uppercase tracking-tight">
                                        {new Date(e.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                    <div className="text-sm font-bold text-aura-charcoal group-hover:text-aura-indigo transition-colors">{e.title}</div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Proactive Core: AI Pattern Logic */}
                    <section className="p-8 bg-gradient-to-br from-aura-charcoal to-[#1e293b] text-white rounded-[40px] shadow-2xl shadow-aura-charcoal/20 relative overflow-hidden group border border-white/10">
                        <div className="absolute -top-10 -right-10 w-40 h-40 bg-aura-indigo/20 rounded-full blur-3xl animate-pulse" />
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center">
                                <Sparkles size={16} className="text-aura-indigo" />
                            </div>
                            <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-white/50">Core Instincts</h3>
                        </div>
                        <p className="text-base font-medium leading-relaxed italic opacity-90">
                            "You've been remarkably consistent with your 'Life Milestone' goal this week. I've prepared a summary of what's next."
                        </p>
                        <button className="mt-8 py-3 w-full bg-white text-aura-charcoal rounded-2xl text-[13px] font-bold hover:bg-aura-indigo hover:text-white transition-all shadow-lg active:scale-95">
                            Reveal Trajectory
                        </button>
                    </section>

                    {/* Neural Vault: Memory Surfaces */}
                    <section>
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-xs font-black uppercase tracking-widest text-aura-gray/60 leading-none">Neural Vault</h3>
                            <Brain size={16} className="text-aura-indigo/40" />
                        </div>
                        <div className="grid grid-cols-1 gap-4">
                            {recentIdeas.map(idea => (
                                <div key={idea.id} className="p-5 bg-white border border-black/[0.04] rounded-2xl hover:border-aura-indigo/30 transition-all cursor-pointer shadow-sm">
                                    <p className="text-sm font-bold text-aura-charcoal mb-2">{idea.title}</p>
                                    <div className="flex items-center gap-2">
                                        <div className="w-1 h-1 rounded-full bg-aura-indigo" />
                                        <span className="text-[10px] text-aura-gray font-black uppercase tracking-widest">Thought Node</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>
            </aside>
        </div>
    );
}
