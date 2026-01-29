"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, Plus, Sparkles, Wand2, Archive, Search, Trash2, Tag, ArrowUpRight, Globe, Cpu, Shield } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export default function IdeasPage() {
    const [ideas, setIdeas] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isCreating, setIsCreating] = useState(false);
    const [newIdea, setNewIdea] = useState({ title: "", content: "", tags: "" });

    const supabase = createClient();

    useEffect(() => {
        async function fetchIdeas() {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;
            const { data } = await supabase.from('ideas').select('*').eq('user_id', user.id).order('created_at', { ascending: false });
            if (data) setIdeas(data);
            setIsLoading(false);
        }
        fetchIdeas();
    }, []);

    async function handleAddIdea(e: React.FormEvent) {
        e.preventDefault();
        if (!newIdea.title.trim()) return;

        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const tagsArray = newIdea.tags.split(',').map(t => t.trim()).filter(t => t);

        const { data, error } = await supabase.from('ideas').insert({
            user_id: user.id,
            title: newIdea.title.trim(),
            content: newIdea.content.trim(),
            tags: tagsArray
        }).select().single();

        if (!error && data) {
            setIdeas([data, ...ideas]);
            setNewIdea({ title: "", content: "", tags: "" });
            setIsCreating(false);
        }
    }

    async function deleteIdea(id: string) {
        const { error } = await supabase.from('ideas').delete().eq('id', id);
        if (!error) {
            setIdeas(prev => prev.filter(i => i.id !== id));
        }
    }

    return (
        <div className="flex-1 flex flex-col space-y-20 py-12 pb-40 relative">

            {/* Immersive Cinematic Header */}
            <header className="relative flex flex-col md:flex-row md:items-end justify-between gap-8 px-2">
                <div className="space-y-4 md:space-y-6">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-white border border-black/[0.05] flex items-center justify-center shadow-lg">
                            <Brain size={20} className="text-aura-gold fill-aura-gold/10" />
                        </div>
                        <div className="space-y-0.5 md:space-y-1">
                            <span className="text-[9px] font-black uppercase tracking-[0.3em] text-aura-charcoal/20">Memory Vault</span>
                            <div className="flex items-center gap-1.5 md:gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-aura-gold animate-pulse" />
                                <span className="text-[9px] font-black uppercase tracking-[0.2em] text-aura-gold/60">Crystalline Archive</span>
                            </div>
                        </div>
                    </div>

                    <h1 className="text-5xl md:text-8xl font-serif italic tracking-tighter text-aura-charcoal leading-[0.85]">
                        The Vault<span className="text-aura-gold">.</span>
                    </h1>
                </div>

                <button
                    onClick={() => setIsCreating(true)}
                    className="px-8 md:px-10 py-4 md:py-5 rounded-2xl md:rounded-[24px] bg-aura-charcoal text-[#FAF9F6] font-black text-[12px] md:text-[13px] uppercase tracking-[0.2em] shadow-xl hover:scale-105 transition-all flex items-center justify-center gap-3 group"
                >
                    <Plus size={18} className="group-hover:rotate-90 transition-transform" />
                    Seed Memory
                </button>
            </header>

            {/* Vault Metrics Block */}
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-8 px-2">
                <div className="p-6 md:p-10 rounded-[32px] md:rounded-[48px] bg-white border border-black/[0.03] shadow-sm flex flex-col justify-between group">
                    <Archive size={14} className="text-aura-gold mb-6 md:mb-8 opacity-20" />
                    <div>
                        <div className="text-4xl md:text-6xl font-serif italic font-black text-aura-charcoal tracking-tighter tabular-nums">{ideas.length}</div>
                        <span className="text-[9px] font-black uppercase tracking-[0.3em] text-aura-charcoal/20">Impulses</span>
                    </div>
                </div>
                <div className="p-6 md:p-10 rounded-[32px] md:rounded-[48px] bg-aura-charcoal text-white shadow-2xl flex flex-col justify-between group relative overflow-hidden">
                    <Shield size={14} className="text-aura-gold mb-6 md:mb-8 opacity-40" />
                    <div className="relative z-10">
                        <div className="text-3xl md:text-5xl font-serif italic font-black tracking-tighter">Secure</div>
                        <span className="text-[9px] font-black uppercase tracking-[0.3em] text-white/20">Encryption</span>
                    </div>
                </div>
                <div className="hidden lg:flex p-10 rounded-[48px] bg-white border border-black/[0.03] shadow-sm flex-col justify-between group">
                    <Sparkles size={16} className="text-aura-gold mb-8 opacity-20" />
                    <div>
                        <div className="text-6xl font-serif italic font-black text-aura-charcoal tracking-tighter tabular-nums">{ideas.reduce((acc, curr) => acc + (curr.tags?.length || 0), 0)}</div>
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-aura-charcoal/20">Engrams</span>
                    </div>
                </div>
            </div>

            {/* Memory Matrix: High-Fidelity Cards */}
            <section className="px-2">
                <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
                    <AnimatePresence mode="popLayout">
                        {ideas.map((idea) => (
                            <motion.div
                                layout
                                key={idea.id}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                whileHover={{ y: -8 }}
                                className="break-inside-avoid p-10 rounded-[48px] bg-white border border-black/[0.03] shadow-xl hover:shadow-2xl transition-all duration-500 relative group flex flex-col gap-6"
                            >
                                <div className="flex items-start justify-between">
                                    <div className="w-10 h-10 rounded-2xl bg-black/[0.02] flex items-center justify-center text-aura-gold">
                                        <Wand2 size={18} />
                                    </div>
                                    <button
                                        onClick={() => deleteIdea(idea.id)}
                                        className="p-3 rounded-xl hover:bg-red-50 text-red-200 opacity-0 group-hover:opacity-100 transition-all"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>

                                <h3 className="text-3xl font-serif italic font-black text-aura-charcoal tracking-tight leading-tight">
                                    {idea.title}
                                </h3>

                                <div className="text-aura-charcoal/40 text-[15px] font-medium leading-relaxed italic line-clamp-6">
                                    {idea.content || "An unarticulated impulsive thought captured for refinement."}
                                </div>

                                {idea.tags && idea.tags.length > 0 && (
                                    <div className="flex flex-wrap gap-2 pt-4">
                                        {idea.tags.map((tag: string, i: number) => (
                                            <span key={i} className="px-4 py-1.5 rounded-full bg-aura-gold/5 border border-aura-gold/10 text-[9px] font-black uppercase tracking-widest text-aura-gold/60">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                )}

                                <div className="absolute top-0 right-0 p-8 opacity-0 group-hover:opacity-5 transition-opacity translate-x-4 -translate-y-4 group-hover:translate-x-0 group-hover:translate-y-0">
                                    <ArrowUpRight size={24} className="text-aura-gold" />
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            </section>

            {/* Seed Memory Protocol Modal */}
            <AnimatePresence>
                {isCreating && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-8">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsCreating(false)}
                            className="absolute inset-0 bg-[#FAF9F6]/80 backdrop-blur-3xl"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative w-full max-w-2xl bg-white rounded-[40px] md:rounded-[64px] shadow-2xl border border-black/[0.03] p-8 md:p-16 overflow-hidden"
                        >
                            <form onSubmit={handleAddIdea} className="space-y-8 md:space-y-12">
                                <div className="space-y-4 md:space-y-6">
                                    <div className="flex items-center gap-3 opacity-30">
                                        <Brain size={16} className="text-aura-gold" />
                                        <span className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.4em] text-aura-charcoal">Neural Seed Intake</span>
                                    </div>
                                    <input
                                        autoFocus
                                        type="text"
                                        placeholder="Identification..."
                                        value={newIdea.title}
                                        onChange={(e) => setNewIdea({ ...newIdea, title: e.target.value })}
                                        className="w-full text-3xl md:text-5xl font-serif italic font-black bg-transparent border-none focus:outline-none placeholder:text-black/5 text-aura-charcoal"
                                    />
                                    <textarea
                                        placeholder="Crystalline thoughts..."
                                        value={newIdea.content}
                                        onChange={(e) => setNewIdea({ ...newIdea, content: e.target.value })}
                                        className="w-full text-lg md:text-xl font-medium bg-transparent border-none focus:outline-none placeholder:text-black/5 text-aura-charcoal/60 min-h-[120px] md:min-h-[160px] resize-none"
                                    />
                                    <div className="relative group">
                                        <Tag size={14} className="absolute left-0 top-1/2 -translate-y-1/2 text-aura-gold/20" />
                                        <input
                                            type="text"
                                            placeholder="Engrams (comma separated)..."
                                            value={newIdea.tags}
                                            onChange={(e) => setNewIdea({ ...newIdea, tags: e.target.value })}
                                            className="w-full pl-6 py-4 text-[10px] font-black uppercase tracking-widest bg-transparent border-none focus:outline-none placeholder:text-black/5 text-aura-gold/60"
                                        />
                                    </div>
                                </div>

                                <div className="flex gap-4 md:gap-6 justify-end items-center">
                                    <button
                                        type="button"
                                        onClick={() => setIsCreating(false)}
                                        className="px-6 md:px-10 py-4 text-[10px] md:text-[11px] font-black uppercase tracking-[0.2em] text-aura-charcoal/30 hover:text-aura-charcoal"
                                    >
                                        Abort
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-8 md:px-16 py-4 md:py-5 rounded-2xl md:rounded-[24px] bg-aura-charcoal text-white font-black text-[11px] md:text-[13px] uppercase tracking-[0.2em] shadow-xl hover:scale-105 transition-all"
                                    >
                                        Seal Memory
                                    </button>
                                </div>
                            </form>
                        </motion.div>

                    </div>
                )}
            </AnimatePresence>

            {/* Ambient System Gradients */}
            <div className="fixed top-0 left-0 w-[40%] h-[40%] bg-aura-gold/5 rounded-full blur-[160px] pointer-events-none -z-10" />
            <div className="fixed bottom-0 right-0 w-[30%] h-[30%] bg-aura-charcoal/5 rounded-full blur-[140px] pointer-events-none -z-10" />
        </div>
    );
}
