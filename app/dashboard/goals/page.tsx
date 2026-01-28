"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Target, Plus, Sparkles, TrendingUp, Calendar, Trash2, ArrowUpRight, Trophy, Flag, Globe, Brain } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export default function GoalsPage() {
    const [goals, setGoals] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isCreating, setIsCreating] = useState(false);
    const [newGoal, setNewGoal] = useState({ title: "", description: "", targetDate: "", type: "long_term" });

    const supabase = createClient();

    useEffect(() => {
        async function fetchGoals() {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;
            const { data } = await supabase.from('goals').select('*').eq('user_id', user.id).order('created_at', { ascending: false });
            if (data) setGoals(data);
            setIsLoading(false);
        }
        fetchGoals();
    }, []);

    async function handleAddGoal(e: React.FormEvent) {
        e.preventDefault();
        if (!newGoal.title.trim()) return;

        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data, error } = await supabase.from('goals').insert({
            user_id: user.id,
            title: newGoal.title.trim(),
            description: newGoal.description.trim(),
            target_date: newGoal.targetDate || null,
            status: 'active',
            progress: 0,
            type: newGoal.type
        }).select().single();

        if (!error && data) {
            setGoals([data, ...goals]);
            setNewGoal({ title: "", description: "", targetDate: "", type: "long_term" });
            setIsCreating(false);
        }
    }

    async function deleteGoal(id: string) {
        const { error } = await supabase.from('goals').delete().eq('id', id);
        if (!error) {
            setGoals(prev => prev.filter(g => g.id !== id));
        }
    }

    return (
        <div className="flex-1 flex flex-col space-y-20 py-12 pb-40 relative">

            {/* Immersive Cinematic Header */}
            <header className="relative flex flex-col md:flex-row md:items-end justify-between gap-12 px-2">
                <div className="space-y-6">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-white border border-black/[0.05] flex items-center justify-center shadow-lg">
                            <Target size={22} className="text-aura-gold" />
                        </div>
                        <div className="space-y-1">
                            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-aura-charcoal/20">Strategic Trajectory</span>
                            <div className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-aura-gold animate-pulse" />
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-aura-gold/60">Long-term Calibrations</span>
                            </div>
                        </div>
                    </div>

                    <h1 className="text-8xl font-serif italic tracking-tighter text-aura-charcoal leading-[0.85]">
                        Objectives<span className="text-aura-gold">.</span>
                    </h1>
                </div>

                <button
                    onClick={() => setIsCreating(true)}
                    className="px-10 py-5 rounded-[24px] bg-aura-charcoal text-[#FAF9F6] font-black text-[13px] uppercase tracking-[0.2em] shadow-2xl hover:scale-105 transition-all flex items-center gap-3 group"
                >
                    <Plus size={18} className="group-hover:rotate-90 transition-transform" />
                    Set New Objective
                </button>
            </header>

            {/* Trajectory Insights Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-2">
                <div className="p-12 rounded-[56px] bg-aura-charcoal text-white relative overflow-hidden group shadow-2xl">
                    <TrendingUp size={16} className="text-aura-gold mb-10" />
                    <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-white/20 mb-4">Trajectory Status</h3>
                    <div className="text-6xl font-serif italic font-black tracking-tighter text-white mb-4">
                        {goals.filter(g => g.status === 'completed').length > 0 ? 'Exalted' : 'Developing'}
                    </div>
                    <p className="text-[12px] font-medium text-white/40 leading-relaxed max-w-[200px]">Strategic alignment is currently optimized for long-term growth.</p>
                    <Globe size={160} className="absolute -right-16 -bottom-16 text-white/5 animate-spin-slow" />
                </div>

                <div className="p-12 rounded-[56px] bg-white border border-black/[0.03] shadow-xl relative overflow-hidden group">
                    <Trophy size={16} className="text-aura-gold mb-10" />
                    <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-aura-charcoal/20 mb-4">Fulfilled Vector</h3>
                    <div className="text-6xl font-serif italic font-black tracking-tighter text-aura-charcoal mb-4">
                        {goals.filter(g => g.status === 'completed').length}
                    </div>
                    <p className="text-[11px] font-medium text-aura-charcoal/40 leading-relaxed italic">Successful manifestations recorded in your legacy vault.</p>
                </div>

                <div className="p-12 rounded-[56px] bg-white border border-black/[0.03] shadow-xl relative overflow-hidden group">
                    <Sparkles size={16} className="text-aura-gold mb-10" />
                    <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-aura-charcoal/20 mb-4">Active Potential</h3>
                    <div className="text-6xl font-serif italic font-black tracking-tighter text-aura-charcoal mb-4">
                        {goals.filter(g => g.status === 'active').length}
                    </div>
                    <p className="text-[11px] font-medium text-aura-charcoal/40 leading-relaxed italic">Objectives currently synchronized for immediate focused execution.</p>
                </div>
            </div>

            {/* Trajectory Manifest: High-Fidelity Cards */}
            <section className="px-2">
                <AnimatePresence mode="popLayout">
                    {isCreating && (
                        <motion.div
                            initial={{ opacity: 0, y: -20, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -20, scale: 0.95 }}
                            className="p-12 rounded-[56px] bg-white border-2 border-aura-gold/20 shadow-2xl mb-20"
                        >
                            <form onSubmit={handleAddGoal} className="space-y-12">
                                <div className="space-y-4">
                                    <input
                                        autoFocus
                                        type="text"
                                        placeholder="Objective Vision Title..."
                                        value={newGoal.title}
                                        onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
                                        className="w-full text-5xl font-serif italic font-black bg-transparent border-none focus:outline-none placeholder:text-black/5 text-aura-charcoal"
                                    />
                                    <textarea
                                        placeholder="Strategic detail & crystalline scope..."
                                        value={newGoal.description}
                                        onChange={(e) => setNewGoal({ ...newGoal, description: e.target.value })}
                                        className="w-full text-xl font-medium bg-transparent border-none focus:outline-none placeholder:text-black/5 text-aura-charcoal/60 min-h-[120px] resize-none"
                                    />
                                </div>
                                <div className="flex flex-col md:flex-row gap-12 justify-between items-center bg-black/[0.02] p-8 rounded-[40px]">
                                    <div className="flex gap-4">
                                        {['daily', 'weekly', 'monthly', 'long_term'].map(t => (
                                            <button
                                                key={t}
                                                type="button"
                                                onClick={() => setNewGoal({ ...newGoal, type: t })}
                                                className={cn(
                                                    "px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all",
                                                    newGoal.type === t ? "bg-aura-gold text-white shadow-lg" : "bg-white text-aura-charcoal/30 hover:text-aura-charcoal shadow-sm"
                                                )}
                                            >
                                                {t.replace('_', ' ')}
                                            </button>
                                        ))}
                                    </div>
                                    <div className="flex gap-6">
                                        <button
                                            type="button"
                                            onClick={() => setIsCreating(false)}
                                            className="px-10 py-4 text-[11px] font-black uppercase tracking-[0.2em] text-aura-charcoal/30 hover:text-aura-charcoal"
                                        >
                                            Abort Set
                                        </button>
                                        <button
                                            type="submit"
                                            className="px-12 py-4 rounded-2xl bg-aura-charcoal text-white font-black text-[11px] uppercase tracking-[0.2em] shadow-xl hover:scale-105 transition-all"
                                        >
                                            Launch Objective
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    <AnimatePresence mode="popLayout">
                        {goals.map((goal) => (
                            <motion.div
                                layout
                                key={goal.id}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                whileHover={{ y: -10 }}
                                className="group p-12 rounded-[56px] bg-white border border-black/[0.03] shadow-xl transition-all duration-500 relative overflow-hidden flex flex-col justify-between min-h-[400px]"
                            >
                                <div className="relative z-10">
                                    <div className="flex items-start justify-between mb-8">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-2xl bg-aura-gold/10 flex items-center justify-center text-aura-gold">
                                                <Flag size={20} />
                                            </div>
                                            <div className="space-y-1">
                                                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-aura-charcoal/20">Vector Type</span>
                                                <div className="text-[11px] font-black uppercase tracking-widest text-aura-gold">{goal.type?.replace('_', ' ')}</div>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => deleteGoal(goal.id)}
                                            className="p-4 rounded-2xl hover:bg-red-50 text-red-300 opacity-0 group-hover:opacity-100 transition-all"
                                        >
                                            <Trash2 size={20} />
                                        </button>
                                    </div>

                                    <h3 className="text-4xl font-serif italic font-black text-aura-charcoal tracking-tight leading-tight mb-6">
                                        {goal.title}
                                    </h3>
                                    <p className="text-[15px] font-medium text-aura-charcoal/40 leading-relaxed line-clamp-3 mb-12">
                                        {goal.description || "The strategic details of this objective are unfolding as you manifest your trajectory."}
                                    </p>
                                </div>

                                <div className="relative z-10 space-y-6">
                                    <div className="flex items-end justify-between">
                                        <div className="space-y-1">
                                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-aura-charcoal/20">Trajectory Progress</span>
                                            <div className="text-3xl font-serif italic font-black text-aura-charcoal">{goal.progress || 0}%</div>
                                        </div>
                                        {goal.target_date && (
                                            <div className="text-right">
                                                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-aura-charcoal/20">Target Horizon</span>
                                                <div className="text-sm font-black text-aura-gold tracking-widest">{new Date(goal.target_date).toLocaleDateString()}</div>
                                            </div>
                                        )}
                                    </div>
                                    <div className="w-full h-3 bg-black/[0.02] rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${goal.progress || 0}%` }}
                                            transition={{ duration: 1.5, ease: "easeOut" }}
                                            className="h-full bg-gradient-to-r from-aura-gold to-aura-gold/40 shadow-[0_0_20px_rgba(212,175,55,0.3)]"
                                        />
                                    </div>
                                </div>

                                {/* Kinetic Bloom Decoration */}
                                <div className="absolute top-0 right-0 p-12 opacity-0 group-hover:opacity-5 transition-opacity translate-x-10 -translate-y-10 group-hover:translate-x-0 group-hover:translate-y-0 duration-700">
                                    <Target size={260} className="text-aura-gold" />
                                </div>
                                <div className="absolute left-1/2 bottom-0 w-64 h-2 bg-aura-gold/20 blur-2xl transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            </section>

            {/* Ambient System Gradients */}
            <div className="fixed top-20 right-0 w-[40%] h-[40%] bg-aura-gold/5 rounded-full blur-[160px] pointer-events-none -z-10" />
            <div className="fixed bottom-0 left-0 w-[30%] h-[30%] bg-aura-charcoal/5 rounded-full blur-[140px] pointer-events-none -z-10" />
        </div>
    );
}
