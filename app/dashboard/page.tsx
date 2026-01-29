"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import NeuralChat from "@/components/dashboard/NeuralChat";
import { Sparkles, Calendar, Target, CheckCircle2, Zap, LayoutDashboard, Search, Activity, ArrowUpRight, TrendingUp, Cpu, Globe, Brain, Clock } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function DashboardPage() {
    const [stats, setStats] = useState({ tasks: 0, goals: 0, events: 0, ideas: 0 });
    const [userData, setUserData] = useState<{ tasks: any[]; goals: any[]; ideas: any[]; events: any[] }>({ tasks: [], goals: [], ideas: [], events: [] });
    const [currentTime, setCurrentTime] = useState(new Date());
    const supabase = createClient();

    useEffect(() => {
        async function fetchDashboardData() {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const [tasks, goals, events, ideas] = await Promise.all([
                supabase.from('todos').select('*').eq('user_id', user.id).eq('status', 'pending'),
                supabase.from('goals').select('*').eq('user_id', user.id).eq('status', 'active'),
                supabase.from('calendar_events').select('*').eq('user_id', user.id).gte('start_time', new Date().toISOString()).order('start_time', { ascending: true }),
                supabase.from('ideas').select('*').eq('user_id', user.id).order('created_at', { ascending: false })
            ]);

            setStats({
                tasks: tasks.data?.length || 0,
                goals: goals.data?.length || 0,
                events: events.data?.length || 0,
                ideas: ideas.data?.length || 0
            });

            setUserData({
                tasks: tasks.data || [],
                goals: goals.data || [],
                events: events.data || [],
                ideas: ideas.data || []
            });
        }

        fetchDashboardData();
        const interval = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="flex-1 flex flex-col space-y-16 md:space-y-24 relative font-body pb-32">

            {/* Cinematic Hero: Neural Sync Header */}
            <header className="relative py-12 md:py-24 rounded-[32px] md:rounded-[64px] overflow-hidden bg-aura-charcoal group mx-2">
                {/* Immersive Background Asset */}
                <motion.div
                    initial={{ scale: 1.1, opacity: 0 }}
                    animate={{ scale: 1, opacity: 0.6 }}
                    transition={{ duration: 2 }}
                    className="absolute inset-0 pointer-events-none"
                >
                    <Image
                        src="/dashboard-bg.png"
                        alt="Neural Sync Asset"
                        fill
                        className="object-cover"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-aura-charcoal via-aura-charcoal/60 to-transparent" />
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/asfalt-dark.png')] opacity-20" />
                </motion.div>

                <div className="relative z-10 px-6 md:px-16 flex flex-col lg:flex-row lg:items-end justify-between gap-8 lg:gap-20">
                    <div className="space-y-6 md:space-y-8 max-w-xl">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/10 backdrop-blur-3xl border border-white/10"
                        >
                            <Brain size={12} className="text-aura-gold animate-pulse" />
                            <span className="text-[8px] font-black uppercase tracking-[0.4em] text-white/60">Neural Node</span>
                        </motion.div>

                        <div className="space-y-1 md:space-y-2">
                            <motion.h1
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.2 }}
                                className="text-3xl md:text-7xl font-serif italic text-white tracking-tighter leading-[0.85]"
                            >
                                Status: <span className="bg-gradient-to-r from-white to-white/40 bg-clip-text text-transparent italic">Optimal.</span>
                            </motion.h1>
                            <p className="text-white/40 text-base md:text-xl font-medium italic max-w-md">
                                Your trajectory is synchronized.
                            </p>
                        </div>
                    </div>

                    <div className="flex gap-8 md:gap-16 md:mb-4 border-l border-white/10 pl-8">
                        <div className="space-y-1 md:space-y-2">
                            <span className="text-[8px] font-black uppercase tracking-[0.4em] text-white/20">Time Anchor</span>
                            <div className="text-xl md:text-4xl font-serif italic text-white/80 tabular-nums">
                                {currentTime.toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit' })}
                            </div>
                        </div>
                        <div className="space-y-1 md:space-y-2">
                            <span className="text-[8px] font-black uppercase tracking-[0.4em] text-white/20">Active Units</span>
                            <div className="text-xl md:text-4xl font-serif italic text-aura-gold tabular-nums">
                                {stats.tasks + stats.goals + stats.events + stats.ideas}
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Strategic Trajectory Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-8 px-2">
                {[
                    { label: "Manifests", val: stats.tasks, icon: CheckCircle2, path: "/dashboard/tasks", color: "aura-gold" },
                    { label: "Objectives", val: stats.goals, icon: Target, path: "/dashboard/goals", color: "aura-charcoal" },
                    { label: "Temporal", val: stats.events, icon: Calendar, path: "/dashboard/timeline", color: "aura-gold" },
                    { label: "Memories", val: stats.ideas, icon: Brain, path: "/dashboard/ideas", color: "aura-charcoal" }
                ].map((item, i) => (
                    <Link key={i} href={item.path}>
                        <motion.div
                            whileHover={{ y: -4, scale: 1.01 }}
                            whileTap={{ scale: 0.98 }}
                            className="p-6 md:p-10 rounded-[32px] md:rounded-[56px] bg-white border border-black/[0.03] shadow-sm hover:shadow-xl transition-all duration-500 group relative overflow-hidden"
                        >
                            <item.icon size={14} className={`text-${item.color} mb-4 md:mb-10 opacity-20 group-hover:opacity-100 transition-opacity`} />
                            <div className="text-3xl md:text-6xl font-serif italic font-black text-aura-charcoal mb-1 tracking-tighter">
                                {item.val}
                            </div>
                            <span className="text-[8px] md:text-[9px] font-black uppercase tracking-[0.4em] text-aura-charcoal/20 group-hover:text-aura-gold transition-colors">
                                {item.label}
                            </span>

                            {/* Kinetic Decoration */}
                            <div className="absolute top-0 right-0 p-6 transform translate-x-4 -translate-y-4 opacity-0 group-hover:translate-x-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                                <ArrowUpRight size={16} className="text-aura-gold" />
                            </div>
                        </motion.div>
                    </Link>
                ))}
            </div>

            {/* Tactical Manifestation Node */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 px-2">
                <div className="p-8 md:p-12 rounded-[40px] md:rounded-[64px] bg-aura-charcoal text-[#FAF9F6] relative overflow-hidden group shadow-xl flex flex-col justify-between min-h-[220px] md:min-h-[350px]">
                    <TrendingUp size={14} className="text-aura-gold mb-6" />
                    <div>
                        <h3 className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.4em] text-white/20 mb-2">Momentum</h3>
                        <div className="text-5xl md:text-7xl font-serif italic font-black tracking-tighter text-white mb-2">
                            {stats.events > 0 ? `${Math.round((userData.events.filter(e => new Date(e.start_time) < new Date()).length / (stats.events || 1)) * 100)}%` : "0%"}
                        </div>
                        <p className="text-[10px] md:text-sm font-medium text-white/40 leading-relaxed italic max-w-[160px]">
                            Operational sync efficiency.
                        </p>
                    </div>

                    <div className="absolute -right-8 -bottom-8 w-40 h-40 bg-aura-gold/5 rounded-full blur-[60px]" />
                    <Globe size={140} className="absolute -right-8 -bottom-8 text-white/5 opacity-40 group-hover:rotate-45 transition-transform duration-[2000ms]" />
                </div>

                <div className="p-8 md:p-12 rounded-[40px] md:rounded-[64px] bg-white border border-black/[0.03] relative overflow-hidden group shadow-lg flex flex-col justify-between min-h-[220px] md:min-h-[350px]">
                    <div className="flex items-center justify-between mb-6">
                        <Calendar size={14} className="text-aura-gold" />
                        <Clock size={12} className="text-aura-charcoal/20" />
                    </div>
                    <div>
                        <h3 className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.4em] text-aura-charcoal/20 mb-2">Next Target</h3>
                        <div className="text-2xl md:text-4xl font-serif italic font-black text-aura-charcoal line-clamp-1 mb-2 leading-tight">
                            {userData.events[0]?.title || "Clear."}
                        </div>
                        <p className="text-[10px] font-medium text-aura-charcoal/40">
                            At <span className="text-aura-charcoal font-bold">{userData.events[0] ? new Date(userData.events[0].start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '---'}</span>.
                        </p>
                    </div>
                </div>

                <div className="p-8 md:p-12 rounded-[40px] md:rounded-[64px] bg-white border border-black/[0.03] relative overflow-hidden group shadow-lg flex flex-col justify-between min-h-[220px] md:min-h-[350px]">
                    <Activity size={14} className="text-aura-gold mb-6" />
                    <div>
                        <h3 className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.4em] text-aura-charcoal/20 mb-2">Horizon</h3>
                        <div className="flex items-end gap-3 mb-2">
                            <div className="text-5xl md:text-7xl font-serif italic font-black tracking-tighter text-aura-charcoal tabular-nums">
                                {userData.events.length}
                            </div>
                            <div className="flex gap-1 mb-1.5">
                                {[1, 2, 3].map(i => (
                                    <motion.div
                                        key={i}
                                        className={`w-1 h-6 rounded-full ${i <= (userData.events.length || 0) ? 'bg-aura-gold' : 'bg-black/[0.05]'}`}
                                    />
                                ))}
                            </div>
                        </div>
                        <p className="text-[10px] font-medium text-aura-charcoal/40">Entities in view.</p>
                    </div>
                </div>
            </div>

            {/* Immersive Neural Chat Node */}
            <div className="pt-16">
                <div className="flex flex-col items-center mb-12 text-center space-y-4">
                    <div className="w-px h-16 bg-gradient-to-t from-aura-gold via-aura-gold/20 to-transparent" />
                    <h2 className="text-3xl md:text-6xl font-serif italic text-aura-charcoal tracking-tighter">Manifest Intentions<span className="text-aura-gold">.</span></h2>
                    <p className="text-aura-charcoal/40 text-sm md:text-lg font-medium italic">Speak to AURA.</p>
                </div>
                <NeuralChat userData={userData} />
            </div>

            {/* Ambient System Gradients */}
            <div className="fixed top-0 right-0 w-[40%] h-[40%] bg-aura-gold/5 rounded-full blur-[160px] pointer-events-none -z-10" />
            <div className="fixed bottom-0 left-0 w-[30%] h-[30%] bg-aura-charcoal/5 rounded-full blur-[140px] pointer-events-none -z-10" />
        </div>
    );
}
