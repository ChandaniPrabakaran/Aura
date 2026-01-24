"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar as CalendarIcon, Clock, MapPin, Zap, AlertCircle, Stars, Sparkles, Wand2, ChevronLeft, ChevronRight, Plus, MessageSquare, Shield } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface Event {
    id: string;
    title: string;
    description: string;
    start_time: string;
    end_time: string;
    location?: string;
}

export default function TimelinePage() {
    const [events, setEvents] = useState<Event[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [currentDate, setCurrentDate] = useState(new Date(2026, 0, 1));
    const [selectedDate, setSelectedDate] = useState<Date | null>(new Date(2026, 0, 1));
    const supabase = createClient();

    useEffect(() => {
        fetchEvents();
    }, []);

    async function fetchEvents() {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data: eventData } = await supabase
            .from('calendar_events')
            .select('*')
            .eq('user_id', user.id)
            .order('start_time', { ascending: true });

        if (eventData) setEvents(eventData);
        setIsLoading(false);
    }

    const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

    const monthName = currentDate.toLocaleString('default', { month: 'long' });
    const year = currentDate.getFullYear();

    const prevMonth = () => {
        setCurrentDate(new Date(year, currentDate.getMonth() - 1, 1));
    };

    const nextMonth = () => {
        setCurrentDate(new Date(year, currentDate.getMonth() + 1, 1));
    };

    const calendarDays = [];
    const totalDays = daysInMonth(year, currentDate.getMonth());
    const offset = firstDayOfMonth(year, currentDate.getMonth());

    for (let i = 0; i < offset; i++) calendarDays.push(null);
    for (let i = 1; i <= totalDays; i++) calendarDays.push(new Date(year, currentDate.getMonth(), i));

    const selectedDayEvents = events.filter(e => {
        if (!selectedDate) return false;
        const eventDate = new Date(e.start_time);
        return eventDate.getDate() === selectedDate.getDate() &&
            eventDate.getMonth() === selectedDate.getMonth() &&
            eventDate.getFullYear() === selectedDate.getFullYear();
    });

    return (
        <div className="max-w-[1700px] mx-auto p-12 flex flex-col min-h-full">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-10 mb-16 relative">
                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-6">
                        <Stars className="text-aura-indigo" size={18} />
                        <span className="text-[11px] font-black uppercase tracking-[.4em] text-aura-gray/40 italic">Temporal Engine / v4.2</span>
                    </div>
                    <h1 className="text-5xl md:text-8xl font-black font-display tracking-tighter text-aura-charcoal mb-4 leading-none uppercase">TIMELINE.</h1>
                    <p className="text-aura-gray text-lg md:text-xl font-medium max-w-lg">Your chronological manifestation path, synchronized with Aura Memory.</p>
                </div>

                <div className="flex items-center gap-2 bg-white border border-black/[0.03] p-2 rounded-[32px] shadow-sm relative z-10">
                    <button onClick={prevMonth} className="w-12 h-12 rounded-full flex items-center justify-center text-aura-gray hover:text-aura-indigo hover:bg-aura-indigo/5 transition-all">
                        <ChevronLeft size={24} />
                    </button>
                    <span className="text-sm font-black uppercase tracking-[0.3em] px-8 text-aura-charcoal">{monthName} {year}</span>
                    <button onClick={nextMonth} className="w-12 h-12 rounded-full flex items-center justify-center text-aura-gray hover:text-aura-indigo hover:bg-aura-indigo/5 transition-all">
                        <ChevronRight size={24} />
                    </button>
                </div>
            </div>

            <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Calendar Grid */}
                <div className="lg:col-span-8 bg-white border border-black/[0.04] rounded-[56px] p-12 flex flex-col shadow-lg relative overflow-hidden group">
                    <div className="absolute inset-0 bg-mesh-light opacity-50 pointer-events-none group-hover:opacity-100 transition-opacity duration-1000" />

                    <div className="grid grid-cols-7 gap-4 mb-10 relative z-10">
                        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                            <div key={day} className="text-center text-[11px] font-black uppercase tracking-[.3em] text-aura-gray/40">
                                {day}
                            </div>
                        ))}
                    </div>

                    <div className="flex-1 grid grid-cols-7 grid-rows-6 gap-3 relative z-10">
                        {calendarDays.map((day, i) => {
                            if (!day) return <div key={`empty-${i}`} className="opacity-0" />;

                            const isSelected = selectedDate?.toDateString() === day.toDateString();
                            const hasEvents = events.some(e => new Date(e.start_time).toDateString() === day.toDateString());
                            const isToday = new Date().toDateString() === day.toDateString();

                            return (
                                <motion.button
                                    key={i}
                                    whileHover={{ y: -4 }}
                                    onClick={() => setSelectedDate(day)}
                                    className={`relative p-8 rounded-[32px] border transition-all flex flex-col items-center justify-center gap-2 group ${isSelected
                                        ? 'bg-aura-charcoal text-white border-aura-charcoal shadow-2xl scale-[1.05] z-20'
                                        : 'bg-aura-surface/40 border-black/[0.02] hover:bg-white hover:border-aura-indigo/20 text-aura-gray hover:text-aura-charcoal'
                                        }`}
                                >
                                    {isToday && (
                                        <div className={`absolute top-4 right-4 w-2 h-2 rounded-full ${isSelected ? 'bg-aura-emerald' : 'bg-aura-emerald shadow-[0_0_10px_#10B981]'}`} />
                                    )}
                                    <span className={`text-[22px] font-black font-display tracking-tighter ${isSelected ? 'text-white' : 'text-aura-charcoal'}`}>
                                        {day.getDate()}
                                    </span>
                                    {hasEvents && !isSelected && (
                                        <div className="flex gap-1.5 mt-1">
                                            <div className="w-1.5 h-1.5 rounded-full bg-aura-indigo" />
                                            {events.filter(e => new Date(e.start_time).toDateString() === day.toDateString()).length > 1 && (
                                                <div className="w-1.5 h-1.5 rounded-full bg-aura-indigo/30" />
                                            )}
                                        </div>
                                    )}
                                </motion.button>
                            );
                        })}
                    </div>
                </div>

                {/* Day Details Sidebar */}
                <div className="lg:col-span-4 flex flex-col gap-8">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={selectedDate?.toDateString()}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex-1 bg-white border border-black/[0.04] rounded-[56px] p-12 flex flex-col shadow-lg relative overflow-hidden"
                        >
                            <div className="absolute top-[-10%] right-[-10%] w-60 h-60 bg-aura-indigo/5 blur-[80px] rounded-full" />

                            <div className="mb-12 relative z-10 flex justify-between items-start">
                                <div>
                                    <h3 className="text-[11px] font-black uppercase tracking-[.4em] text-aura-gray/40 mb-3">Trajectories</h3>
                                    <h2 className="text-4xl font-black font-display text-aura-charcoal italic tracking-tighter uppercase transition-all duration-700">
                                        {selectedDate?.toLocaleDateString([], { day: 'numeric', month: 'short' })}
                                    </h2>
                                </div>
                                <div className="p-4 rounded-3xl bg-aura-indigo/5 border border-aura-indigo/10 text-aura-indigo">
                                    <Clock size={20} />
                                </div>
                            </div>

                            <div className="flex-1 overflow-y-auto no-scrollbar space-y-5 relative z-10 pr-2">
                                {selectedDayEvents.length > 0 ? (
                                    selectedDayEvents.map((event, i) => (
                                        <div key={event.id} className="p-8 rounded-[40px] bg-aura-surface/40 hover:bg-white border border-black/[0.02] hover:border-aura-indigo/10 transition-all group relative overflow-hidden shadow-sm hover:shadow-md">
                                            <div className="flex justify-between items-start mb-4">
                                                <span className="text-[11px] font-bold text-aura-indigo uppercase tracking-[.2em]">
                                                    {new Date(event.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                                <Zap size={16} className="text-aura-gray/20 group-hover:text-aura-indigo transition-colors" />
                                            </div>
                                            <h4 className="text-lg font-black text-aura-charcoal mb-4 leading-snug">{event.title}</h4>

                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-xl bg-white border border-black/[0.04] flex items-center justify-center">
                                                    <MessageSquare size={12} className="text-aura-indigo" />
                                                </div>
                                                <span className="text-[10px] font-black uppercase tracking-[.15em] text-aura-gray/40">Neural Guard ON</span>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="py-24 text-center opacity-30 flex flex-col items-center group">
                                        <Sparkles size={64} className="text-aura-gray/20 group-hover:text-aura-indigo group-hover:scale-110 transition-all duration-700 mb-8" />
                                        <p className="text-[11px] font-black uppercase tracking-[.4em] text-aura-gray leading-none">Temporal Void</p>
                                    </div>
                                )}
                            </div>

                            <button className="mt-10 h-20 w-full rounded-[32px] bg-aura-charcoal text-white font-black uppercase text-[11px] tracking-[.3em] flex items-center justify-center gap-4 hover:bg-aura-indigo transition-all shadow-xl active:scale-95 group">
                                <Plus size={20} className="group-hover:rotate-90 transition-transform duration-500" /> New Directive
                            </button>
                        </motion.div>
                    </AnimatePresence>

                    {/* Proactive Guard Deck */}
                    <div className="p-12 rounded-[56px] bg-aura-charcoal text-white relative overflow-hidden group shadow-2xl">
                        <div className="absolute -top-10 -right-10 w-48 h-48 bg-aura-indigo/20 rounded-full blur-[80px] pointer-events-none group-hover:scale-125 transition-transform duration-1000" />
                        <div className="flex items-center gap-4 mb-8 relative z-10">
                            <Shield size={20} className="text-aura-indigo" />
                            <h4 className="text-[11px] font-black uppercase tracking-[.4em] text-white/40">Core Guardian</h4>
                        </div>
                        <p className="text-base font-medium leading-relaxed italic opacity-80 mb-10 relative z-10">
                            "Aura balances your temporal paths with a 60-min neural buffer. Alerts will manifest via Workspace Hub."
                        </p>
                        <div className="flex items-center justify-between relative z-10">
                            <div className="text-5xl font-black italic tracking-tighter">{(events.length / 31 * 100).toFixed(1)}%</div>
                            <div className="px-6 py-2.5 rounded-full bg-white/10 border border-white/10 text-[10px] font-black uppercase tracking-[.2em] text-aura-indigo">Protected</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
