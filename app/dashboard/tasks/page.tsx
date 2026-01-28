"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Plus, Zap, ListTodo, Sparkles, Wand2, Terminal, Search, Trash2, Filter, ArrowUpRight, Clock, Target } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export default function TasksPage() {
    const [todos, setTodos] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');
    const [isCreating, setIsCreating] = useState(false);
    const [newTodo, setNewTodo] = useState({ title: "", description: "", priority: "medium" });

    const supabase = createClient();

    useEffect(() => {
        async function fetchTodos() {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;
            const { data } = await supabase.from('todos').select('*').eq('user_id', user.id).order('created_at', { ascending: false });
            if (data) setTodos(data);
            setIsLoading(false);
        }
        fetchTodos();
    }, []);

    async function toggleTodo(id: string, currentStatus: string) {
        const newStatus = currentStatus === 'completed' ? 'pending' : 'completed';
        const { error } = await supabase.from('todos').update({ status: newStatus }).eq('id', id);
        if (!error) {
            setTodos(prev => prev.map(t => t.id === id ? { ...t, status: newStatus } : t));
        }
    }

    async function handleAddTodo(e: React.FormEvent) {
        e.preventDefault();
        if (!newTodo.title.trim()) return;

        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data, error } = await supabase.from('todos').insert({
            user_id: user.id,
            title: newTodo.title.trim(),
            description: newTodo.description.trim(),
            priority: newTodo.priority,
            status: 'pending'
        }).select().single();

        if (!error && data) {
            setTodos([data, ...todos]);
            setNewTodo({ title: "", description: "", priority: "medium" });
            setIsCreating(false);
        }
    }

    async function deleteTodo(id: string) {
        const { error } = await supabase.from('todos').delete().eq('id', id);
        if (!error) {
            setTodos(prev => prev.filter(t => t.id !== id));
        }
    }

    const filteredTodos = todos.filter(t => {
        if (filter === 'pending') return t.status === 'pending';
        if (filter === 'completed') return t.status === 'completed';
        return true;
    });

    return (
        <div className="flex-1 flex flex-col space-y-16 py-12">

            {/* Immersive Cinematic Header */}
            <header className="relative flex flex-col md:flex-row md:items-end justify-between gap-12 px-2">
                <div className="space-y-6">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-white border border-black/[0.05] flex items-center justify-center shadow-lg">
                            <Zap size={22} className="text-aura-gold fill-aura-gold/20" />
                        </div>
                        <div className="space-y-1">
                            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-aura-charcoal/20">Operational Protocol</span>
                            <div className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-aura-gold animate-pulse" />
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-aura-gold/60">Live Manifest Stream</span>
                            </div>
                        </div>
                    </div>

                    <h1 className="text-8xl font-serif italic tracking-tighter text-aura-charcoal leading-[0.85]">
                        Commands<span className="text-aura-gold">.</span>
                    </h1>
                </div>

                <div className="flex flex-col items-end gap-6">
                    <button
                        onClick={() => setIsCreating(true)}
                        className="px-10 py-5 rounded-[24px] bg-aura-charcoal text-[#FAF9F6] font-black text-[13px] uppercase tracking-[0.2em] shadow-2xl hover:scale-105 transition-all flex items-center gap-3 group"
                    >
                        <Plus size={18} className="group-hover:rotate-90 transition-transform" />
                        New Directive
                    </button>
                    <div className="flex gap-2 p-1.5 bg-white border border-black/[0.05] rounded-[20px] shadow-sm">
                        {['all', 'pending', 'completed'].map((f: any) => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={cn(
                                    "px-6 py-2 rounded-[14px] text-[10px] font-black uppercase tracking-widest transition-all",
                                    filter === f ? "bg-aura-charcoal text-white shadow-xl" : "text-aura-charcoal/30 hover:text-aura-charcoal"
                                )}
                            >
                                {f}
                            </button>
                        ))}
                    </div>
                </div>
            </header>

            {/* Quick Stats Block */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-2">
                <div className="p-10 rounded-[48px] bg-white border border-black/[0.03] shadow-sm flex flex-col justify-between group">
                    <ListTodo size={16} className="text-aura-gold mb-8 opacity-20" />
                    <div>
                        <div className="text-6xl font-serif italic font-black text-aura-charcoal tracking-tighter">{todos.filter(t => t.status === 'pending').length}</div>
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-aura-charcoal/20">Unfulfilled Nodes</span>
                    </div>
                </div>
                <div className="p-10 rounded-[48px] bg-white border border-black/[0.03] shadow-sm flex flex-col justify-between group">
                    <CheckCircle2 size={16} className="text-aura-gold mb-8 opacity-20" />
                    <div>
                        <div className="text-6xl font-serif italic font-black text-aura-charcoal tracking-tighter">{todos.filter(t => t.status === 'completed').length}</div>
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-aura-charcoal/20">Manifested Reality</span>
                    </div>
                </div>
                <div className="p-10 rounded-[48px] bg-aura-gold text-white shadow-2xl flex flex-col justify-between group relative overflow-hidden">
                    <Target size={16} className="text-white mb-8 opacity-40" />
                    <div className="relative z-10">
                        <div className="text-6xl font-serif italic font-black text-white tracking-tighter">
                            {todos.length > 0 ? Math.round((todos.filter(t => t.status === 'completed').length / todos.length) * 100) : 0}%
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/60">Success Index</span>
                    </div>
                    <div className="absolute -right-8 -bottom-8 w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000" />
                </div>
            </div>

            {/* Action Stream: High-Fidelity List */}
            <section className="px-2 pb-40">
                <div className="space-y-4">
                    <AnimatePresence mode="popLayout">
                        {isCreating && (
                            <motion.div
                                initial={{ opacity: 0, y: -20, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                                className="p-10 rounded-[40px] bg-white border-2 border-aura-gold/20 shadow-2xl mb-12"
                            >
                                <form onSubmit={handleAddTodo} className="space-y-8">
                                    <div className="space-y-2">
                                        <input
                                            autoFocus
                                            type="text"
                                            placeholder="Direct Intent Title..."
                                            value={newTodo.title}
                                            onChange={(e) => setNewTodo({ ...newTodo, title: e.target.value })}
                                            className="w-full text-4xl font-serif italic font-black bg-transparent border-none focus:outline-none placeholder:text-black/5 text-aura-charcoal"
                                        />
                                        <textarea
                                            placeholder="Detailed scope of manifestation..."
                                            value={newTodo.description}
                                            onChange={(e) => setNewTodo({ ...newTodo, description: e.target.value })}
                                            className="w-full text-lg font-medium bg-transparent border-none focus:outline-none placeholder:text-black/5 text-aura-charcoal/60 min-h-[100px] resize-none"
                                        />
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="flex gap-4">
                                            {['low', 'medium', 'high'].map(p => (
                                                <button
                                                    key={p}
                                                    type="button"
                                                    onClick={() => setNewTodo({ ...newTodo, priority: p })}
                                                    className={cn(
                                                        "px-6 py-2 rounded-full text-[9px] font-black uppercase tracking-[0.2em] transition-all",
                                                        newTodo.priority === p ? "bg-aura-gold text-white" : "bg-black/[0.03] text-aura-charcoal/30 hover:text-aura-charcoal"
                                                    )}
                                                >
                                                    {p} Priority
                                                </button>
                                            ))}
                                        </div>
                                        <div className="flex gap-4">
                                            <button
                                                type="button"
                                                onClick={() => setIsCreating(false)}
                                                className="px-8 py-3 text-[11px] font-black uppercase tracking-widest text-aura-charcoal/30 hover:text-aura-charcoal"
                                            >
                                                Abort
                                            </button>
                                            <button
                                                type="submit"
                                                className="px-10 py-3 rounded-2xl bg-aura-charcoal text-white font-black text-[11px] uppercase tracking-[0.2em] shadow-xl hover:scale-105 transition-all"
                                            >
                                                Initialize
                                            </button>
                                        </div>
                                    </div>
                                </form>
                            </motion.div>
                        )}

                        {filteredTodos.map((todo) => (
                            <motion.div
                                layout
                                key={todo.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                whileHover={{ scale: 1.01 }}
                                className={cn(
                                    "p-8 rounded-[36px] bg-white border border-black/[0.03] shadow-sm hover:shadow-xl transition-all group flex items-start gap-8 relative overflow-hidden",
                                    todo.status === 'completed' && "opacity-60 grayscale-[0.8]"
                                )}
                            >
                                <button
                                    onClick={() => toggleTodo(todo.id, todo.status)}
                                    className={cn(
                                        "w-12 h-12 rounded-2xl border-2 flex items-center justify-center transition-all mt-1",
                                        todo.status === 'completed'
                                            ? "bg-aura-charcoal border-aura-charcoal text-white"
                                            : "border-black/[0.05] hover:border-aura-gold/50 group-hover:scale-110"
                                    )}
                                >
                                    {todo.status === 'completed' ? <CheckCircle2 size={24} /> : <div className="w-2 h-2 rounded-full bg-aura-gold opacity-0 group-hover:opacity-100 animate-pulse" />}
                                </button>

                                <div className="flex-1 space-y-2">
                                    <div className="flex items-center gap-4">
                                        <h3 className={cn(
                                            "text-2xl font-serif italic font-black text-aura-charcoal tracking-tight",
                                            todo.status === 'completed' && "line-through opacity-40"
                                        )}>
                                            {todo.title}
                                        </h3>
                                        {todo.priority === 'high' && (
                                            <span className="px-3 py-1 bg-red-500/10 text-red-500 text-[8px] font-black uppercase tracking-[0.3em] rounded-full">Vital Focus</span>
                                        )}
                                    </div>
                                    <p className="text-sm font-medium text-aura-charcoal/40 leading-relaxed max-w-2xl">
                                        {todo.description || "No tactical details specified for this directive."}
                                    </p>
                                </div>

                                <div className="flex items-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={() => deleteTodo(todo.id)}
                                        className="p-4 rounded-2xl hover:bg-red-50 text-red-400 transition-colors"
                                    >
                                        <Trash2 size={20} />
                                    </button>
                                </div>

                                {/* Decorative kinetic element */}
                                {todo.status === 'pending' && (
                                    <div className="absolute right-0 top-0 p-6 opacity-0 group-hover:opacity-10 transition-opacity">
                                        <Zap size={100} className="text-aura-gold -rotate-12" />
                                    </div>
                                )}
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            </section>

            {/* Ambient Gradients */}
            <div className="fixed top-0 left-0 w-[30%] h-[30%] bg-aura-gold/5 rounded-full blur-[140px] pointer-events-none -z-10" />
            <div className="fixed bottom-0 right-0 w-[20%] h-[20%] bg-aura-charcoal/5 rounded-full blur-[100px] pointer-events-none -z-10" />
        </div>
    );
}
