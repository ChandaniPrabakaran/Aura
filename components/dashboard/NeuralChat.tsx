"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Sparkles, Mic, CornerDownLeft, Zap, Target, Brain, Shield, Info, Calendar } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface Message { role: 'user' | 'assistant'; content: string; }

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
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const saved = localStorage.getItem('aura_chat_history_serene_v4');
        if (saved) setMessages(JSON.parse(saved));
    }, []);

    useEffect(() => {
        if (messages.length > 0) {
            localStorage.setItem('aura_chat_history_serene_v4', JSON.stringify(messages));
        }
    }, [messages]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;
        const userMsg = input.trim();
        setInput("");
        setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
        setIsLoading(true);

        try {
            const context = {
                recent_ideas: userData.ideas.slice(0, 5).map(i => i.title),
                active_goals: userData.goals.slice(0, 5).map(g => g.title),
                upcoming_events: userData.events.slice(0, 10).map(e => ({
                    title: e.title,
                    time: new Date(e.start_time).toLocaleString()
                })),
                pending_tasks: userData.tasks.slice(0, 10).map(t => t.title),
            };

            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: userMsg,
                    history: messages.slice(-10),
                    context: context
                })
            });
            const data = await response.json();
            setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);

            if (data.actionTaken && onRefresh) onRefresh();
        } catch (error) {
            setMessages(prev => [...prev, { role: 'assistant', content: "Signal mismatch. I lost connection for a moment. Please speak again." }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-full relative w-full overflow-visible max-w-[800px] mx-auto pb-40">

            {/* Conversation Flow */}
            <div className="flex-1 space-y-16 pt-8 overflow-visible">
                <AnimatePresence initial={false}>
                    {messages.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="min-h-[50vh] flex flex-col items-center justify-center text-center px-10"
                        >
                            <div className="w-20 h-20 rounded-[32px] bg-white border border-black/[0.05] flex items-center justify-center shadow-lg mb-10">
                                <Sparkles size={32} className="text-aura-gold" />
                            </div>
                            <h2 className="font-serif text-5xl italic text-aura-charcoal mb-6">How can I support you today?</h2>
                            <p className="text-aura-charcoal/40 text-[17px] font-medium max-w-sm leading-relaxed mb-12">
                                I'm Aura, your intellectual companion. We can map out your goals, capture ideas, or simply explore your thoughts.
                            </p>

                            <div className="flex flex-wrap items-center justify-center gap-4">
                                {[
                                    { icon: Zap, label: "Schedule Manifestation", cmd: "I want to schedule a new manifestation for tomorrow at 2 PM" },
                                    { icon: Calendar, label: "Review Timeline", cmd: "Show me my upcoming manifestations for this week" },
                                    { icon: Sparkles, label: "Temporal Context", cmd: "Is my timeline clear for a deep work session this Friday?" }
                                ].map((suggest) => (
                                    <button
                                        key={suggest.label}
                                        onClick={() => setInput(suggest.cmd)}
                                        suppressHydrationWarning
                                        className="px-6 py-3 rounded-2xl bg-white border border-black/[0.05] hover:bg-black/[0.02] transform hover:scale-105 active:scale-95 transition-all shadow-sm text-[12px] font-black uppercase tracking-widest text-aura-charcoal/40 hover:text-aura-charcoal flex items-center gap-3"
                                    >
                                        <suggest.icon size={14} className="text-aura-gold" />
                                        {suggest.label}
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    ) : (
                        messages.map((msg, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                                className={cn(
                                    "flex flex-col w-full",
                                    msg.role === 'user' ? "items-end" : "items-start"
                                )}
                            >
                                {msg.role === 'user' ? (
                                    <div className="pi-user-msg shadow-sm">
                                        <span className="text-[17px] font-bold text-aura-charcoal leading-snug">{msg.content}</span>
                                    </div>
                                ) : (
                                    <div className="flex flex-col gap-1 w-full text-left">
                                        <div className="flex items-center gap-3 mb-4 opacity-30">
                                            <Sparkles size={14} className="text-aura-gold" />
                                            <span className="text-[9px] font-black uppercase tracking-[0.4em] text-aura-charcoal">AURA MANIFEST</span>
                                        </div>
                                        <div className="pi-ai-msg pl-4 border-l-2 border-aura-gold/10">
                                            {msg.content}
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        ))
                    )}
                </AnimatePresence>

                {isLoading && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-2 py-8 opacity-20">
                        <div className="w-1.5 h-1.5 rounded-full bg-aura-charcoal animate-pulse" />
                        <div className="w-1.5 h-1.5 rounded-full bg-aura-charcoal animate-pulse [animation-delay:-0.2s]" />
                        <div className="w-1.5 h-1.5 rounded-full bg-aura-charcoal animate-pulse [animation-delay:-0.4s]" />
                    </motion.div>
                )}

                {userData.events.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex items-center gap-3 px-6 py-3 rounded-2xl bg-white border border-black/[0.03] shadow-sm w-fit mt-8"
                    >
                        <div className="w-1.5 h-1.5 rounded-full bg-aura-gold animate-pulse" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-aura-charcoal/30">
                            Temporal Sync: {userData.events.length} Manifestations Identified
                        </span>
                    </motion.div>
                )}

                <div ref={messagesEndRef} className="h-20" />
            </div>

            {/* Sticky Minimal Search/Input */}
            <div className="fixed bottom-0 left-[300px] right-0 flex justify-center pb-12 pt-12 bg-gradient-to-t from-[#FAF9F6] via-[#FAF9F6]/90 to-transparent z-[110]">
                <div className="max-w-[800px] w-full px-10">
                    <div className="relative group">
                        <div className="relative flex items-center bg-white border border-black/[0.08] rounded-[36px] px-10 py-6 shadow-2xl transition-all group-focus-within:border-aura-gold/30 group-focus-within:shadow-aura-gold/5">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => { if (e.key === 'Enter') handleSend(); }}
                                placeholder="What's on your mind?"
                                suppressHydrationWarning
                                className="flex-1 bg-transparent border-none py-2 text-[18px] font-bold placeholder:text-aura-charcoal/10 focus:outline-none text-aura-charcoal tracking-tight"
                            />

                            <div className="flex items-center gap-6 pl-6 border-l border-black/[0.05]">
                                <button suppressHydrationWarning className="text-aura-charcoal/20 hover:text-aura-gold transition-colors">
                                    <Mic size={22} />
                                </button>
                                <button
                                    onClick={handleSend}
                                    suppressHydrationWarning
                                    className={cn(
                                        "w-12 h-12 rounded-2xl flex items-center justify-center transition-all",
                                        input.trim().length > 0
                                            ? "bg-aura-charcoal text-[#FAF9F6] scale-100 shadow-xl"
                                            : "bg-black/[0.02] text-black/10 scale-95"
                                    )}
                                >
                                    <CornerDownLeft size={22} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
