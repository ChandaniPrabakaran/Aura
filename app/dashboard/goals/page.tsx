"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Target, TrendingUp, Calendar, CheckCircle2, ChevronRight, Plus, MoreHorizontal, Stars, Sparkles, Zap, Brain } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface Goal {
    id: string;
    title: string;
    description: string;
    target_date: string;
    status: 'active' | 'completed' | 'abandoned';
    progress: number;
}

export default function GoalsPage() {
    const [goals, setGoals] = useState<Goal[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const supabase = createClient();

    useEffect(() => {
        fetchGoals();

        const channel = supabase
            .channel('goals-sync')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'goals' }, () => fetchGoals())
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    async function fetchGoals() {
        try {
            const { data: { user }, error: authError } = await supabase.auth.getUser();
            if (authError) throw authError;
            if (!user) return;

            const { data, error } = await supabase
                .from('goals')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false });

            if (error) throw error;
            if (data) setGoals(data);
        } catch (err) {
            console.error("Fetch Goals Error:", err);
        } finally {
            setIsLoading(false);
        }
    }

    const activeGoals = goals.filter(g => g.status === 'active');
    const completedGoals = goals.filter(g => g.status === 'completed');

    return (
        <div className="max-w-[1400px] mx-auto py-24 px-8 flex flex-col min-h-full">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-12 mb-20 relative">
                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-6">
                        <Stars className="text-aura-indigo" size={22} />
                        <span className="text-[11px] font-black uppercase tracking-[.4em] text-aura-gray/40">Strategic Trajectories</span>
                    </div>
                    <h1 className="text-5xl md:text-8xl font-black font-display tracking-tighter text-aura-charcoal mb-4 uppercase">OBJECTIVES.</h1>
                    <p className="text-aura-gray text-xl font-medium max-w-lg">
                        You are currently pursuing <span className="text-aura-indigo font-black">{activeGoals.length} high-level manifestations</span> in the current orbital cycle.
                    </p>
                </div>

                <button className="h-20 px-12 bg-aura-charcoal text-white rounded-[32px] flex items-center gap-4 font-black uppercase text-xs tracking-[.25em] hover:bg-aura-indigo transition-all shadow-2xl active:scale-95 group relative z-10">
                    <Plus size={22} className="group-hover:rotate-90 transition-transform duration-500" />
                    New Trajectory
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                {/* Main Goals Surface */}
                <div className="lg:col-span-8 space-y-10">
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center py-48 gap-6">
                            <div className="w-12 h-12 border-4 border-aura-indigo/20 border-t-aura-indigo rounded-full animate-spin" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-aura-indigo animate-pulse">Scanning Orbital Map</span>
                        </div>
                    ) : (
                        <AnimatePresence mode="popLayout">
                            {activeGoals.map((goal, i) => (
                                <motion.div
                                    key={goal.id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.98, y: 30 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: i * 0.1 }}
                                    whileHover={{ y: -10 }}
                                    className="group p-12 rounded-[56px] bg-white border border-black/[0.04] relative overflow-hidden shadow-sm hover:shadow-2xl hover:border-aura-indigo/10 transition-all"
                                >
                                    <div className="absolute top-0 right-0 p-10">
                                        <button className="text-aura-gray/20 hover:text-aura-indigo transition-colors">
                                            <MoreHorizontal size={24} />
                                        </button>
                                    </div>

                                    <div className="flex flex-col md:flex-row items-start gap-10">
                                        <div className="w-20 h-20 rounded-[32px] bg-aura-indigo/5 border border-aura-indigo/10 flex items-center justify-center text-aura-indigo shrink-0 shadow-sm group-hover:bg-aura-indigo group-hover:text-white transition-all duration-700">
                                            <Target size={36} className="group-hover:scale-110 transition-transform duration-700" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex flex-wrap items-center gap-4 mb-4">
                                                <h3 className="text-3xl font-black tracking-tighter text-aura-charcoal uppercase leading-none">{goal.title}</h3>
                                                {goal.progress >= 90 && (
                                                    <span className="px-4 py-1.5 rounded-full bg-aura-emerald/5 text-aura-emerald text-[9px] font-black uppercase tracking-[0.2em] animate-pulse border border-aura-emerald/10 shadow-sm">Convergence Immminent</span>
                                                )}
                                            </div>
                                            <p className="text-aura-gray text-lg font-medium leading-relaxed mb-12 max-w-2xl line-clamp-2">{goal.description}</p>

                                            {/* Progress Engine */}
                                            <div className="space-y-6">
                                                <div className="flex justify-between items-end">
                                                    <span className="text-[11px] font-black uppercase tracking-[0.3em] text-aura-gray/40">Neural Momentum</span>
                                                    <span className="text-3xl font-black italic tracking-tighter text-aura-indigo">{goal.progress}%</span>
                                                </div>
                                                <div className="h-4 w-full bg-aura-surface rounded-full overflow-hidden p-[3px] border border-black/[0.02] shadow-inner">
                                                    <motion.div
                                                        initial={{ width: 0 }}
                                                        animate={{ width: `${goal.progress}%` }}
                                                        transition={{ duration: 2, ease: [0.16, 1, 0.3, 1] }}
                                                        className="h-full bg-gradient-to-r from-aura-indigo via-aura-accent to-aura-indigo rounded-full shadow-[0_0_20px_rgba(99,102,241,0.2)]"
                                                    />
                                                </div>
                                            </div>

                                            <div className="flex flex-wrap gap-10 mt-12">
                                                <div className="flex items-center gap-3 text-[11px] font-black uppercase tracking-[0.25em] text-aura-gray/40">
                                                    <Calendar size={18} className="text-aura-indigo/30" />
                                                    Manifesting {goal.target_date ? new Date(goal.target_date).toLocaleDateString() : 'Continuous'}
                                                </div>
                                                <div className="flex items-center gap-3 text-[11px] font-black uppercase tracking-[0.25em] text-aura-gray/40">
                                                    <TrendingUp size={18} className="text-aura-emerald/30" />
                                                    Velocity: {goal.progress > 50 ? 'Accelerated' : 'Nominal'}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    )}

                    {!activeGoals.length && !isLoading && (
                        <div className="py-64 text-center border-4 border-dashed border-black/[0.02] rounded-[80px] group">
                            <Target size={96} className="mx-auto mb-10 text-aura-gray/10 group-hover:text-aura-indigo transition-colors duration-1000" />
                            <p className="text-3xl font-black uppercase tracking-[0.5em] text-aura-charcoal opacity-40">No active trajectories</p>
                        </div>
                    )}
                </div>

                {/* Status Sidebar Surface */}
                <div className="lg:col-span-4 space-y-10">
                    <div className="p-12 rounded-[56px] bg-aura-charcoal text-white relative overflow-hidden shadow-2xl group">
                        <div className="absolute top-[-10%] right-[-10%] w-64 h-64 bg-aura-indigo/10 blur-[90px] rounded-full group-hover:scale-125 transition-transform duration-1000" />
                        <h4 className="text-[11px] font-black uppercase tracking-[.4em] mb-12 text-white/40">Synchronized Orbits</h4>
                        <div className="text-[110px] font-black italic tracking-tighter mb-8 text-white leading-none -ml-2">{completedGoals.length}</div>
                        <div className="flex items-center gap-3 text-base font-bold italic text-aura-indigo/80">
                            <Zap size={20} className="fill-current" />
                            Stable Trajectories Detected
                        </div>
                    </div>

                    <div className="p-12 rounded-[56px] bg-white border border-black/[0.04] shadow-sm relative overflow-hidden group">
                        <div className="absolute top-[-20%] right-[-20%] w-48 h-48 bg-aura-indigo/5 blur-[80px] rounded-full" />
                        <div className="flex items-center gap-4 mb-10">
                            <div className="w-10 h-10 rounded-2xl bg-aura-indigo/5 flex items-center justify-center text-aura-indigo border border-aura-indigo/10">
                                <Brain size={20} />
                            </div>
                            <h4 className="text-[11px] font-black uppercase tracking-[.4em] text-aura-gray/40 leading-none">Aura Advisory</h4>
                        </div>
                        <p className="text-lg font-medium italic leading-relaxed text-aura-charcoal/80 mb-12 opacity-80">
                            "Spectral analysis shows high concentration of target convergence. Re-allocating neural power to maintain velocity."
                        </p>
                        <button className="w-full h-18 rounded-[32px] bg-aura-surface border border-black/[0.03] text-[11px] font-black uppercase tracking-[.25em] text-aura-indigo hover:bg-aura-indigo hover:text-white transition-all flex items-center justify-center gap-3 group shadow-sm">
                            Full Simulation <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
