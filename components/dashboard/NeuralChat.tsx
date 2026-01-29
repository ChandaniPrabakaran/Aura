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
    const [isListening, setIsListening] = useState(false);
    const recognitionRef = useRef<any>(null);

    useEffect(() => {
        const saved = localStorage.getItem('aura_chat_history_v5');
        if (saved) setMessages(JSON.parse(saved));

        if (typeof window !== 'undefined' && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
            const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = false;
            recognitionRef.current.interimResults = false;

            recognitionRef.current.onresult = (event: any) => {
                const transcript = event.results[0][0].transcript;
                setInput(transcript);
                setIsListening(false);
            };

            recognitionRef.current.onerror = () => setIsListening(false);
            recognitionRef.current.onend = () => setIsListening(false);
        }
    }, []);

    useEffect(() => {
        if (messages.length > 0) {
            localStorage.setItem('aura_chat_history_v5', JSON.stringify(messages));
        }
    }, [messages]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const toggleListening = () => {
        if (!recognitionRef.current) return;
        if (isListening) {
            recognitionRef.current.stop();
        } else {
            recognitionRef.current.start();
            setIsListening(true);
        }
    };

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
            setMessages(prev => [...prev, { role: 'assistant', content: "Something went wrong. Please try again." }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex-1 flex flex-col h-full relative w-full overflow-visible max-w-[800px] mx-auto pb-40 px-2 lg:px-0">

            {/* Conversation Flow */}
            <div className="flex-1 space-y-12 pt-8 overflow-visible">
                <AnimatePresence initial={false}>
                    {messages.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="min-h-[40vh] flex flex-col items-center justify-center text-center px-4"
                        >
                            <div className="w-16 h-16 rounded-[28px] bg-white border border-black/[0.05] flex items-center justify-center shadow-lg mb-8">
                                <Sparkles size={24} className="text-aura-gold" />
                            </div>
                            <h2 className="font-serif text-4xl md:text-5xl italic text-aura-charcoal mb-4">Hello. How can I help?</h2>
                            <p className="text-aura-charcoal/40 text-sm md:text-[17px] font-medium max-w-sm leading-relaxed mb-10">
                                I can manage your tasks, goals, ideas, and schedule.
                            </p>

                            <div className="flex flex-wrap items-center justify-center gap-2 md:gap-4">
                                {[
                                    { icon: Zap, label: "Add Task", cmd: "Add a task to buy milk today" },
                                    { icon: Target, label: "Set Goal", cmd: "My goal is to learn Next.js" },
                                    { icon: Brain, label: "Save Idea", cmd: "Save an idea: AI-powered butler" }
                                ].map((suggest) => (
                                    <button
                                        key={suggest.label}
                                        onClick={() => setInput(suggest.cmd)}
                                        className="px-4 py-2 rounded-xl bg-white border border-black/[0.05] hover:bg-black/[0.02] transform hover:scale-105 active:scale-95 transition-all shadow-sm text-[10px] font-black uppercase tracking-widest text-aura-charcoal/40 hover:text-aura-charcoal flex items-center gap-2"
                                    >
                                        <suggest.icon size={12} className="text-aura-gold" />
                                        {suggest.label}
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    ) : (
                        messages.map((msg, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, scale: 0.98 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className={cn(
                                    "flex flex-col w-full",
                                    msg.role === 'user' ? "items-end" : "items-start"
                                )}
                            >
                                {msg.role === 'user' ? (
                                    <div className="bg-aura-charcoal text-[#FAF9F6] px-6 py-4 rounded-[28px] rounded-tr-none shadow-sm max-w-[85%]">
                                        <span className="text-[16px] font-bold leading-snug">{msg.content}</span>
                                    </div>
                                ) : (
                                    <div className="flex flex-col gap-1 w-full text-left max-w-[90%]">
                                        <div className="flex items-center gap-2 mb-2 opacity-30">
                                            <Sparkles size={12} className="text-aura-gold" />
                                            <span className="text-[8px] font-black uppercase tracking-[0.4em] text-aura-charcoal">AURA</span>
                                        </div>
                                        <div className="bg-white px-6 py-4 rounded-[28px] rounded-tl-none text-[16px] font-medium leading-relaxed italic shadow-sm border border-black/[0.02]">
                                            {msg.content}
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        ))
                    )}
                </AnimatePresence>

                {isLoading && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-1.5 py-4 opacity-10">
                        <div className="w-1.5 h-1.5 rounded-full bg-aura-charcoal animate-bounce" />
                        <div className="w-1.5 h-1.5 rounded-full bg-aura-charcoal animate-bounce [animation-delay:0.2s]" />
                        <div className="w-1.5 h-1.5 rounded-full bg-aura-charcoal animate-bounce [animation-delay:0.4s]" />
                    </motion.div>
                )}

                <div ref={messagesEndRef} className="h-10" />
            </div>

            {/* Sticky Minimal Search/Input */}
            <div className="fixed bottom-24 lg:bottom-12 left-0 lg:left-[300px] right-0 flex justify-center pb-6 pt-12 bg-gradient-to-t from-[#FAF9F6] via-[#FAF9F6] to-transparent z-[110]">
                <div className="max-w-[800px] w-full px-4 lg:px-10">
                    <div className="relative group">
                        <div className={cn(
                            "relative flex items-center bg-white border border-black/[0.08] rounded-[32px] px-6 py-4 shadow-xl transition-all group-focus-within:border-aura-gold/30",
                            isListening && "border-aura-gold shadow-aura-gold/10"
                        )}>
                            <input
                                autoFocus
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => { if (e.key === 'Enter') handleSend(); }}
                                placeholder={isListening ? "Listening..." : "What's up?"}
                                className="flex-1 bg-transparent border-none py-1 text-[16px] font-bold placeholder:text-aura-charcoal/20 focus:outline-none text-aura-charcoal tracking-tight"
                            />

                            <div className="flex items-center gap-4 pl-4 border-l border-black/[0.05]">
                                <button
                                    onClick={toggleListening}
                                    className={cn(
                                        "w-10 h-10 rounded-full flex items-center justify-center transition-all",
                                        isListening ? "bg-aura-gold text-white animate-pulse" : "text-aura-charcoal/20 hover:text-aura-gold"
                                    )}
                                >
                                    <Mic size={20} />
                                </button>
                                <button
                                    onClick={handleSend}
                                    className={cn(
                                        "w-10 h-10 rounded-full flex items-center justify-center transition-all",
                                        input.trim().length > 0
                                            ? "bg-aura-charcoal text-[#FAF9F6] shadow-lg"
                                            : "bg-black/[0.02] text-black/10"
                                    )}
                                >
                                    <Send size={18} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
