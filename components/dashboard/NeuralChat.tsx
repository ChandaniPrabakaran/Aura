"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Sparkles, Plus, Mic, ArrowRight, Brain, User } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface Message { role: 'user' | 'assistant'; content: string; type?: 'thought' | 'action'; }

interface NeuralChatProps {
    userData: {
        tasks: any[];
        goals: any[];
        ideas: any[];
        events: any[];
    };
    onRefresh?: () => void;
}

export default function NeuralChat({ userData, onRefresh }: NeuralChatProps) {
    const [messages, setMessages] = useState<Message[]>([]);

    // Load initial messages
    useEffect(() => {
        const saved = localStorage.getItem('aura_chat_history');
        if (saved) {
            setMessages(JSON.parse(saved));
        } else {
            setMessages([{ role: 'assistant', content: "Welcome back, Chandani. I've finished scanning your manifestation trajectory for the day. You're remarkably close to reaching your Weekly Milestone. Should we review the remaining steps together?" }]);
        }
    }, []);

    // Save messages whenever they change
    useEffect(() => {
        if (messages.length > 0) {
            localStorage.setItem('aura_chat_history', JSON.stringify(messages));
        }
    }, [messages]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;
        const userMsg = input.trim();
        setInput("");
        setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
        setIsLoading(true);

        try {
            const context = {
                recent_ideas: userData.ideas.map(i => i.title),
                active_goals: userData.goals.map(g => g.title),
                upcoming_events: userData.events.map(e => e.title),
                pending_tasks: userData.tasks.map(t => t.title),
            };

            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: userMsg,
                    history: messages,
                    context: context
                })
            });
            const data = await response.json();
            setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);

            if (data.actionTaken && onRefresh) {
                onRefresh();
            }
        } catch (error) {
            setMessages(prev => [...prev, { role: 'assistant', content: "My thought process was briefly interrupted. One moment while I re-synchronize." }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex-1 flex flex-col h-full bg-transparent relative max-w-5xl mx-auto w-full">

            {/* Conversations Canvas */}
            <div className="flex-1 overflow-y-auto pt-16 pb-40 px-12 no-scrollbar">
                <AnimatePresence initial={false}>
                    {messages.map((msg, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                            className={cn(
                                "mb-16 flex items-start gap-8 group",
                                msg.role === 'user' ? "flex-row-reverse" : "flex-row"
                            )}
                        >
                            {/* Entity Avatar */}
                            <div className={cn(
                                "w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 border",
                                msg.role === 'user'
                                    ? "bg-white border-black/[0.04] text-aura-gray"
                                    : "bg-aura-indigo border-aura-indigo/20 text-white shadow-lg shadow-aura-indigo/20"
                            )}>
                                {msg.role === 'user' ? <User size={18} /> : <Brain size={18} />}
                            </div>

                            <div className={cn(
                                "flex flex-col max-w-2xl",
                                msg.role === 'user' ? "items-end text-right" : "items-start text-left"
                            )}>
                                <div className={cn(
                                    "px-1 mb-2 text-[10px] font-black uppercase tracking-[0.2em]",
                                    msg.role === 'user' ? "text-aura-gray" : "text-aura-indigo"
                                )}>
                                    {msg.role === 'user' ? 'Direct Entry' : 'Aura Synthesis'}
                                </div>
                                <div className={cn(
                                    "text-lg leading-relaxed font-medium antialiased tracking-tight",
                                    msg.role === 'user' ? "text-aura-gray" : "text-aura-charcoal"
                                )}>
                                    {msg.content}
                                </div>

                                {msg.role === 'assistant' && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.4 }}
                                        className="mt-8 flex flex-wrap gap-3"
                                    >
                                        <button
                                            onClick={() => setInput("Generate a step-by-step plan for ")}
                                            className="px-5 py-2.5 rounded-2xl bg-white border border-black/[0.04] text-[13px] font-bold text-aura-charcoal shadow-sm hover:shadow-md hover:border-aura-indigo/20 transition-all flex items-center gap-2 group/btn">
                                            <span>Formulate Plan</span>
                                            <ArrowRight size={14} className="text-aura-indigo group-hover/btn:translate-x-1 transition-transform" />
                                        </button>
                                        <button
                                            onClick={() => setInput("Search your deep memory for ")}
                                            className="px-5 py-2.5 rounded-2xl bg-aura-indigo-soft text-[13px] font-bold text-aura-indigo hover:bg-aura-indigo hover:text-white transition-all">
                                            Deep Memory Recall
                                        </button>
                                    </motion.div>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {isLoading && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex gap-2 py-8"
                    >
                        {[0, 0.2, 0.4].map((delay) => (
                            <div key={delay} className="w-1.5 h-1.5 rounded-full bg-aura-indigo/40 animate-pulse" style={{ animationDelay: `${delay}s` }} />
                        ))}
                    </motion.div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* AI Command Bar: The Interactive Anchor */}
            <div className="absolute bottom-10 left-0 right-0 px-12 z-20">
                <div className="max-w-3xl mx-auto relative">
                    {/* Suggested Shortcuts - Floating Glass */}
                    <div className="flex gap-2 mb-6 justify-center overflow-x-auto no-scrollbar pb-2">
                        {[
                            { label: "Crystallize Idea", prefix: "Crystallize this: " },
                            { label: "Add Goal", prefix: "Add Goal: " },
                            { label: "New Command", prefix: "Execute command: " },
                            { label: "Temporal Map", prefix: "Map my day: " }
                        ].map((suggestion) => (
                            <button
                                key={suggestion.label}
                                onClick={() => setInput(suggestion.prefix)}
                                className="px-4 py-2 text-[12px] font-bold whitespace-nowrap bg-white/60 backdrop-blur-xl border border-black/[0.04] rounded-2xl text-aura-gray hover:text-aura-indigo hover:bg-white hover:shadow-lg hover:shadow-aura-indigo/5 transition-all outline-none"
                            >
                                {suggestion.label}
                            </button>
                        ))}
                    </div>

                    <div className="relative group glass-card-light rounded-[32px] overflow-hidden focus-within:ring-4 ring-aura-indigo/5 transition-all">
                        <div className="absolute left-8 top-1/2 -translate-y-1/2 text-aura-gray group-focus-within:text-aura-indigo transition-colors">
                            <Sparkles size={20} />
                        </div>
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => { if (e.key === 'Enter') handleSend(); }}
                            placeholder="State your directive..."
                            className="w-full bg-transparent border-none pl-16 pr-36 py-7 text-[16px] font-bold placeholder:text-aura-gray/30 focus:outline-none text-aura-charcoal"
                        />
                        <div className="absolute right-6 top-1/2 -translate-y-1/2 flex items-center gap-3">
                            <button className="w-10 h-10 flex items-center justify-center text-aura-gray hover:text-aura-charcoal bg-black/[0.02] hover:bg-black/[0.05] rounded-xl transition-all">
                                <Mic size={20} />
                            </button>
                            <button
                                onClick={handleSend}
                                className="w-12 h-12 bg-aura-charcoal text-white rounded-2xl flex items-center justify-center hover:bg-aura-indigo shadow-xl shadow-aura-charcoal/10 hover:shadow-aura-indigo/20 transition-all active:scale-95 disabled:opacity-30 disabled:pointer-events-none"
                                disabled={!input.trim() || isLoading}
                            >
                                <Send size={18} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
