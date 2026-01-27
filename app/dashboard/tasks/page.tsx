"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Circle, Clock, AlertCircle, Plus, Filter, Stars, Sparkles, Target, Zap } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface Todo {
    id: string;
    title: string;
    description: string;
    status: 'pending' | 'in_progress' | 'completed';
    priority: 'low' | 'medium' | 'high';
    due_date: string;
}

const PriorityBadge = ({ priority }: { priority: string }) => {
    const colors: any = {
        low: "text-aura-gray bg-aura-gray/5 border-black/[0.04]",
        medium: "text-aura-indigo bg-aura-indigo/5 border-aura-indigo/10",
        high: "text-aura-emerald bg-aura-emerald/5 border-aura-emerald/10",
    };
    return (
        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border ${colors[priority]}`}>
            {priority}
        </span>
    );
};

export default function TasksPage() {
    const [todos, setTodos] = useState<Todo[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const supabase = createClient();

    useEffect(() => {
        fetchTodos();

        const channel = supabase
            .channel('tasks-sync')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'todos' }, () => fetchTodos())
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    async function fetchTodos() {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data, error } = await supabase
            .from('todos')
            .select('*')
            .eq('user_id', user.id)
            .order('due_date', { ascending: true });

        if (data) setTodos(data);
        setIsLoading(false);
    }

    async function toggleStatus(id: string, currentStatus: string) {
        const nextStatus = currentStatus === 'completed' ? 'pending' : 'completed';
        const { error } = await supabase
            .from('todos')
            .update({ status: nextStatus })
            .eq('id', id);

        if (!error) {
            setTodos(prev => prev.map(t => t.id === id ? { ...t, status: nextStatus as any } : t));
        }
    }

    return (
        <div className="max-w-[1200px] mx-auto py-24 px-8 flex flex-col min-h-full">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-12 mb-20 relative">
                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-6">
                        <Target className="text-aura-indigo" size={22} />
                        <span className="text-[11px] font-black uppercase tracking-[.4em] text-aura-gray/40">Execution Manifest</span>
                    </div>
                    <h1 className="text-5xl md:text-8xl font-black font-display tracking-tighter text-aura-charcoal mb-4 uppercase">COMMANDS.</h1>
                    <p className="text-aura-gray text-xl font-medium max-w-lg">
                        You have <span className="text-aura-indigo font-black">{todos.filter(t => t.status !== 'completed').length} active directives</span> awaiting synchronization.
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-6 relative z-10">
                    <button className="h-20 px-10 bg-white border border-black/[0.04] rounded-[32px] flex items-center gap-4 text-aura-gray hover:text-aura-indigo hover:shadow-lg hover:shadow-aura-indigo/5 transition-all font-bold">
                        <Filter size={20} className="text-aura-indigo" />
                        <span className="text-[11px] uppercase tracking-widest leading-none">Filter Protocol</span>
                    </button>
                    <button className="h-20 px-12 bg-aura-charcoal text-white rounded-[32px] flex items-center gap-4 font-black uppercase text-xs tracking-[.25em] hover:bg-aura-indigo transition-all shadow-2xl active:scale-95 group">
                        <Plus size={22} className="group-hover:rotate-90 transition-transform duration-500" />
                        Add Directive
                    </button>
                </div>
            </div>

            <div className="space-y-6 flex-1">
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-40 gap-6">
                        <div className="w-12 h-12 border-4 border-aura-indigo/20 border-t-aura-indigo rounded-full animate-spin" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-aura-indigo animate-pulse">Syncing Ops Stream</span>
                    </div>
                ) : (
                    <AnimatePresence mode="popLayout">
                        {todos.map((todo, i) => (
                            <motion.div
                                key={todo.id}
                                layout
                                initial={{ opacity: 0, scale: 0.98, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                                className={`group p-10 rounded-[56px] border transition-all relative overflow-hidden flex items-center gap-10 ${todo.status === 'completed'
                                    ? 'bg-aura-surface/50 border-black/[0.02] opacity-50'
                                    : 'bg-white border-black/[0.04] shadow-sm hover:shadow-2xl hover:border-aura-indigo/10'
                                    }`}
                            >
                                <button
                                    onClick={() => toggleStatus(todo.id, todo.status)}
                                    className={`w-16 h-16 rounded-[28px] shrink-0 flex items-center justify-center transition-all duration-700 transform ${todo.status === 'completed'
                                        ? 'bg-aura-indigo text-white rotate-[360deg]'
                                        : 'bg-aura-surface border border-black/[0.05] text-aura-gray/20 hover:text-aura-indigo hover:border-aura-indigo hover:scale-110'
                                        }`}
                                >
                                    {todo.status === 'completed' ? <CheckCircle2 size={30} /> : <Circle size={30} />}
                                </button>

                                <div className="flex-1 min-w-0">
                                    <div className="flex flex-wrap items-center gap-6 mb-3">
                                        <h3 className={`text-2xl font-black tracking-tighter text-aura-charcoal ${todo.status === 'completed' ? 'line-through decoration-aura-indigo/40' : ''}`}>
                                            {todo.title}
                                        </h3>
                                        <PriorityBadge priority={todo.priority} />
                                    </div>
                                    {todo.description && (
                                        <p className="text-aura-gray text-base font-medium max-w-2xl line-clamp-1">{todo.description}</p>
                                    )}
                                </div>

                                <div className="hidden lg:flex flex-col items-end gap-3 text-right shrink-0">
                                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-aura-gray/40">
                                        <Clock size={16} className="text-aura-indigo/60" />
                                        {todo.due_date ? new Date(todo.due_date).toLocaleDateString() : 'Continuous'}
                                    </div>
                                    {todo.priority === 'high' && !todo.status.includes('completed') && (
                                        <div className="flex items-center gap-2 text-aura-emerald text-[9px] font-black uppercase tracking-[0.3em] bg-aura-emerald/5 px-4 py-1.5 rounded-full shadow-sm animate-pulse">
                                            <Zap size={14} className="fill-current" />
                                            High Intensity
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                )}

                {!isLoading && todos.length === 0 && (
                    <div className="py-64 text-center border-4 border-dashed border-black/[0.02] rounded-[80px] group">
                        <CheckCircle2 size={96} className="mx-auto mb-10 text-aura-indigo/20 group-hover:text-aura-indigo transition-colors duration-1000" />
                        <p className="text-3xl font-black uppercase tracking-[0.5em] text-aura-charcoal opacity-40 leading-none">Horizon Clear</p>
                        <p className="mt-6 text-sm font-medium text-aura-gray tracking-widest">Awaiting next strategic directive...</p>
                    </div>
                )}
            </div>
        </div>
    );
}
