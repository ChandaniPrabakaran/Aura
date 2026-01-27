"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lightbulb, Tag, Search, Plus, Trash2, Stars, Sparkles, Brain, ArrowUpRight } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface Idea {
    id: string;
    title: string;
    content: string;
    tags: string[];
    created_at: string;
}

export default function IdeasPage() {
    const [ideas, setIdeas] = useState<Idea[]>([]);
    const [search, setSearch] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const supabase = createClient();

    useEffect(() => {
        fetchIdeas();

        const channel = supabase
            .channel('ideas-sync')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'ideas' }, () => fetchIdeas())
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    async function fetchIdeas() {
        try {
            const { data: { user }, error: authError } = await supabase.auth.getUser();
            if (authError) throw authError;
            if (!user) return;

            const { data, error } = await supabase
                .from('ideas')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false });

            if (error) throw error;
            if (data) setIdeas(data);
        } catch (err) {
            console.error("Fetch Ideas Error:", err);
        } finally {
            setIsLoading(false);
        }
    }

    const filteredIdeas = ideas.filter(idea =>
        idea.title.toLowerCase().includes(search.toLowerCase()) ||
        idea.content.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="max-w-[1400px] mx-auto py-20 px-8">
            {/* Header with Search Hub */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-12 mb-24 relative">
                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-6">
                        <Brain className="text-aura-indigo" size={20} />
                        <span className="text-[11px] font-black uppercase tracking-[.4em] text-aura-gray/40">Memory Repository</span>
                    </div>
                    <h1 className="text-5xl md:text-8xl font-black font-display tracking-tighter text-aura-charcoal mb-4 uppercase">THE VAULT.</h1>
                    <p className="text-aura-gray text-lg font-medium italic">"{ideas.length} neural signatures crystallized in Aura memory"</p>
                </div>

                <div className="flex items-center gap-4 bg-white border border-black/[0.03] p-3 rounded-[32px] shadow-sm relative z-10 min-w-0 md:min-w-[400px]">
                    <Search className="ml-4 text-aura-gray/40" size={20} />
                    <input
                        type="text"
                        placeholder="Search for a memory..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="flex-1 bg-transparent border-none py-3 text-sm focus:outline-none font-bold text-aura-charcoal placeholder:text-aura-gray/20"
                    />
                    <button className="h-14 w-14 bg-aura-charcoal text-white rounded-2xl flex items-center justify-center hover:bg-aura-indigo transition-all shadow-xl active:scale-95 group">
                        <Plus size={24} className="group-hover:rotate-90 transition-transform duration-500" />
                    </button>
                </div>
            </div>

            {/* Neural Analytics Surface */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-24">
                {[
                    { label: 'Neural Nodes', val: ideas.length, color: 'indigo' },
                    { label: 'Unique Vectors', val: Array.from(new Set(ideas.flatMap(i => i.tags))).length, color: 'emerald' },
                    { label: 'Recall Rate', val: '100%', color: 'accent' },
                    { label: 'Aura Sync', val: 'Established', color: 'indigo' }
                ].map(stat => (
                    <div key={stat.label} className="p-8 pb-10 rounded-[40px] bg-white border border-black/[0.04] flex flex-col items-center text-center shadow-sm group hover:shadow-lg transition-all">
                        <div className={`text-4xl font-black text-aura-charcoal mb-3 group-hover:text-aura-${stat.color} transition-colors tracking-tighter`}>{stat.val}</div>
                        <div className="text-[10px] font-black uppercase tracking-[0.2em] text-aura-gray/40">{stat.label}</div>
                    </div>
                ))}
            </div>

            {isLoading ? (
                <div className="flex flex-col items-center justify-center py-40 gap-6">
                    <div className="w-12 h-12 border-4 border-aura-indigo/20 border-t-aura-indigo rounded-full animate-spin" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-aura-indigo animate-pulse">Scanning Neural Stream</span>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    <AnimatePresence mode="popLayout">
                        {filteredIdeas.map((idea, i) => (
                            <motion.div
                                key={idea.id}
                                layout
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                                whileHover={{ y: -12 }}
                                className="group p-12 rounded-[56px] bg-white border border-black/[0.04] relative overflow-hidden h-full flex flex-col shadow-sm hover:shadow-2xl hover:border-aura-indigo/10 transition-all"
                            >
                                <div className="absolute top-0 right-0 p-10 opacity-0 group-hover:opacity-100 transition-all">
                                    <button className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-500 hover:bg-rose-500 hover:text-white transition-all shadow-sm">
                                        <Trash2 size={20} />
                                    </button>
                                </div>

                                <div className="w-16 h-16 rounded-3xl bg-aura-indigo/5 border border-aura-indigo/10 flex items-center justify-center text-aura-indigo mb-10 group-hover:scale-110 transition-transform cursor-pointer relative">
                                    <Lightbulb size={28} />
                                    <ArrowUpRight size={14} className="absolute -top-1 -right-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>

                                <h3 className="text-2xl font-black mb-6 tracking-tighter leading-tight text-aura-charcoal">{idea.title}</h3>
                                <p className="text-aura-gray font-medium text-base leading-relaxed mb-12 flex-1 tracking-tight line-clamp-4">{idea.content}</p>

                                <div className="flex flex-wrap gap-2.5 mt-auto">
                                    {idea.tags.map(tag => (
                                        <span key={tag} className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-aura-indigo-soft text-[10px] font-black uppercase tracking-widest text-aura-indigo border border-aura-indigo/10">
                                            <Sparkles size={11} />
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>

                    {filteredIdeas.length === 0 && (
                        <div className="col-span-full py-48 text-center opacity-30 group flex flex-col items-center">
                            <Stars size={80} className="text-aura-gray/20 group-hover:text-aura-indigo group-hover:rotate-12 transition-all duration-1000 mb-10" />
                            <p className="text-2xl font-black uppercase tracking-[0.5em] text-aura-charcoal opacity-40">The Vault is Silent</p>
                            <button className="mt-8 px-10 py-4 bg-aura-indigo/10 text-aura-indigo rounded-full font-black text-xs uppercase tracking-widest hover:bg-aura-indigo hover:text-white transition-all">
                                Initialize New Concept
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
