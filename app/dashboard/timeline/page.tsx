"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Clock, Plus, Sparkles, MapPin, ChevronLeft, ChevronRight, Zap, Target, ArrowRight, Activity, Globe } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export default function TimelinePage() {
    const [events, setEvents] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [currentDate, setCurrentDate] = useState(new Date());

    const supabase = createClient();

    useEffect(() => {
        async function fetchEvents() {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;
            const { data } = await supabase.from('calendar_events').select('*').eq('user_id', user.id).order('start_time', { ascending: true });
            if (data) setEvents(data);
            setIsLoading(false);
        }
        fetchEvents();
    }, []);

    const monthName = currentDate.toLocaleString('default', { month: 'long' });
    const year = currentDate.getFullYear();

    // Calendar Generation Logic
    const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
    const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

    const days = [];
    const daysInMonth = getDaysInMonth(year, currentDate.getMonth());
    const firstDay = getFirstDayOfMonth(year, currentDate.getMonth());

    for (let i = 0; i < firstDay; i++) days.push(null);
    for (let i = 1; i <= daysInMonth; i++) days.push(i);

    const selectedDayEvents = events.filter(e => {
        const eventDate = new Date(e.start_time);
        return eventDate.toDateString() === currentDate.toDateString();
    });

    const hasEventsOnDay = (day: number) => {
        if (!day) return false;
        const checkDate = new Date(year, currentDate.getMonth(), day);
        return events.some(e => new Date(e.start_time).toDateString() === checkDate.toDateString());
    };

    return (
        <div className="flex-1 flex flex-col space-y-20 py-12 pb-40 relative">

            {/* Immersive Cinematic Header */}
            <header className="relative flex flex-col md:flex-row md:items-end justify-between gap-12 px-2">
                <div className="space-y-6">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-white border border-black/[0.05] flex items-center justify-center shadow-lg">
                            <Calendar size={22} className="text-aura-gold fill-aura-gold/10" />
                        </div>
                        <div className="space-y-1">
                            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-aura-charcoal/20">Temporal Stream</span>
                            <div className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-aura-gold animate-pulse" />
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-aura-gold/60">Live Trajectory Sync</span>
                            </div>
                        </div>
                    </div>

                    <h1 className="text-8xl font-serif italic tracking-tighter text-aura-charcoal leading-[0.85]">
                        Timeline<span className="text-aura-gold">.</span>
                    </h1>
                </div>

                <div className="flex items-center gap-6">
                    <div className="px-8 py-4 bg-white border border-black/[0.03] rounded-[24px] shadow-sm flex items-center gap-4">
                        <Activity size={14} className="text-aura-gold" />
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-aura-charcoal/30">Total Manifests: {events.length} Units</span>
                    </div>
                </div>
            </header>

            {/* Trajectory Stream: Cinematic Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 px-2 relative">

                {/* Column 1: High-Fidelity Tactical Calendar */}
                <div className="lg:col-span-5 space-y-12">
                    <div className="p-12 rounded-[56px] bg-white border border-black/[0.03] shadow-2xl relative overflow-hidden group">
                        <div className="flex items-center justify-between mb-12">
                            <h2 className="text-3xl font-serif italic font-black text-aura-charcoal tracking-tighter">{monthName} <span className="text-aura-charcoal/20 text-xl not-italic ml-2">{year}</span></h2>
                            <div className="flex gap-4">
                                <button
                                    onClick={() => setCurrentDate(new Date(year, currentDate.getMonth() - 1, 1))}
                                    className="w-12 h-12 rounded-2xl bg-black/[0.02] hover:bg-black/[0.05] flex items-center justify-center transition-all"
                                >
                                    <ChevronLeft size={18} />
                                </button>
                                <button
                                    onClick={() => setCurrentDate(new Date(year, currentDate.getMonth() + 1, 1))}
                                    className="w-12 h-12 rounded-2xl bg-black/[0.02] hover:bg-black/[0.05] flex items-center justify-center transition-all"
                                >
                                    <ChevronRight size={18} />
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-7 gap-y-6 text-center mb-8">
                            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
                                <span key={`${d}-${i}`} className="text-[10px] font-black text-aura-charcoal/20 uppercase tracking-widest">{d}</span>
                            ))}
                        </div>

                        <div className="grid grid-cols-7 gap-3">
                            {days.map((day, i) => {
                                const isSelected = day === currentDate.getDate();
                                const hasEvent = day ? hasEventsOnDay(day) : false;

                                return (
                                    <button
                                        key={i}
                                        disabled={!day}
                                        onClick={() => day && setCurrentDate(new Date(year, currentDate.getMonth(), day))}
                                        className={cn(
                                            "aspect-square rounded-[20px] flex flex-col items-center justify-center text-[15px] font-bold transition-all relative group/day",
                                            !day && "opacity-0 pointer-events-none",
                                            isSelected
                                                ? "bg-aura-charcoal text-white shadow-2xl scale-110 z-10"
                                                : "text-aura-charcoal hover:bg-black/[0.03]"
                                        )}
                                    >
                                        {day}
                                        {hasEvent && (
                                            <motion.div
                                                layoutId="active-dot"
                                                className={cn(
                                                    "w-1.5 h-1.5 rounded-full absolute bottom-3 transition-colors",
                                                    isSelected ? "bg-aura-gold shadow-[0_0_10px_rgba(212,175,55,0.8)]" : "bg-aura-gold/40"
                                                )}
                                            />
                                        )}
                                    </button>
                                );
                            })}
                        </div>

                        {/* Decorative Asset */}
                        <div className="absolute -left-12 -bottom-12 w-48 h-48 bg-aura-gold/5 rounded-full blur-[80px]" />
                    </div>

                    <div className="p-10 rounded-[48px] bg-aura-charcoal text-[#FAF9F6] relative overflow-hidden shadow-2xl group">
                        <Globe size={16} className="text-aura-gold mb-8 opacity-40" />
                        <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-white/20 mb-4">Temporal Resolution</h3>
                        <div className="text-3xl font-serif italic font-black text-white leading-tight">Trajectory synchronized with UTC-8 Manifest Hub.</div>
                        <p className="text-[10px] font-medium text-white/40 mt-6 leading-relaxed italic">All manifestations are calibrated to your immediate local context.</p>
                        <Zap size={100} className="absolute -right-8 -bottom-8 text-white/5 opacity-50 group-hover:rotate-12 transition-transform duration-1000" />
                    </div>
                </div>

                {/* Column 2: The Chronological Manifest Flow */}
                <div className="lg:col-span-7 pb-20">
                    <div className="flex items-center gap-6 mb-16">
                        <div className="w-1 h-12 bg-gradient-to-t from-aura-gold to-transparent" />
                        <div>
                            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-aura-charcoal/20">Chronological Stream</span>
                            <h2 className="text-4xl font-serif italic font-black text-aura-charcoal tracking-tight">Today's Manifestations.</h2>
                        </div>
                    </div>

                    <div className="relative pl-12 space-y-12">
                        {/* The Stream Line */}
                        <div className="absolute left-0 top-4 bottom-0 w-px bg-gradient-to-b from-aura-gold via-aura-gold/10 to-transparent" />

                        <AnimatePresence mode="popLayout">
                            {selectedDayEvents.length > 0 ? (
                                selectedDayEvents.map((event, i) => (
                                    <motion.div
                                        key={event.id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.1 }}
                                        className="relative group pr-4"
                                    >
                                        {/* Trajectory Marker */}
                                        <div className="absolute -left-12 top-6 w-3 h-3 rounded-full bg-white border-2 border-aura-gold shadow-lg group-hover:scale-150 transition-transform" />
                                        <div className="absolute -left-[45.5px] top-[26.5px] w-1.5 h-1.5 rounded-full bg-aura-gold animate-ping opacity-20" />

                                        <div className="p-10 rounded-[48px] bg-white border border-black/[0.03] shadow-lg hover:shadow-2xl transition-all duration-500 group relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-12">
                                            <div className="space-y-4">
                                                <div className="flex items-center gap-4">
                                                    <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-aura-gold/5 border border-aura-gold/10">
                                                        <Clock size={12} className="text-aura-gold" />
                                                        <span className="text-[9px] font-black uppercase tracking-widest text-aura-gold">
                                                            {new Date(event.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                        </span>
                                                    </div>
                                                </div>
                                                <h3 className="text-3xl font-serif italic font-black text-aura-charcoal tracking-tight leading-tight group-hover:text-aura-gold transition-colors">{event.title}</h3>
                                                <p className="text-sm font-medium text-aura-charcoal/40 leading-relaxed italic line-clamp-2 max-w-md">
                                                    {event.description || "The scope of this manifestation is being refined in real-time."}
                                                </p>
                                            </div>

                                            <div className="shrink-0">
                                                <button className="w-16 h-16 rounded-[24px] bg-black/[0.02] group-hover:bg-aura-charcoal group-hover:text-white flex items-center justify-center transition-all">
                                                    <ArrowRight size={24} className="group-hover:translate-x-1 transition-transform" />
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))
                            ) : (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="py-32 flex flex-col items-center text-center px-12 opacity-20"
                                >
                                    <div className="w-20 h-20 rounded-[32px] border border-aura-charcoal/20 flex items-center justify-center mb-10">
                                        <Target size={32} />
                                    </div>
                                    <h3 className="text-4xl font-serif italic text-aura-charcoal mb-4">No Temporal Anchors.</h3>
                                    <p className="text-lg font-medium leading-relaxed max-w-sm italic">You have no manifestations recorded for this day in your current trajectory.</p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>

            {/* Ambient System Gradients */}
            <div className="fixed top-0 right-0 w-[40%] h-[40%] bg-aura-gold/5 rounded-full blur-[160px] pointer-events-none -z-10" />
            <div className="fixed bottom-0 left-0 w-[30%] h-[30%] bg-aura-charcoal/5 rounded-full blur-[140px] pointer-events-none -z-10" />
        </div>
    );
}
