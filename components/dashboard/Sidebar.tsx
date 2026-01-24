"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    MessageSquare,
    Lightbulb,
    CheckCircle2,
    Calendar,
    Settings,
    Plus,
    Clock,
    Search,
    Brain,
    Target,
    Sparkles
} from "lucide-react";
import { motion } from "framer-motion";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

const mainNav = [
    { icon: MessageSquare, label: "Chat", href: "/dashboard" },
    { icon: Clock, label: "Timeline", href: "/dashboard/timeline" },
    { icon: Brain, label: "Memory", href: "/dashboard/ideas" },
];

const workspaceNav = [
    { icon: CheckCircle2, label: "Commands", href: "/dashboard/tasks" },
    { icon: Target, label: "Objectives", href: "/dashboard/goals" },
];

export default function DashboardSidebar() {
    const pathname = usePathname();

    return (
        <aside className="w-[300px] h-screen bg-white/40 backdrop-blur-3xl border-r border-black/[0.03] flex flex-col p-8 z-[100] relative overflow-hidden">
            {/* Soft Ambient Light */}
            <div className="absolute -top-24 -left-24 w-48 h-48 bg-aura-indigo/5 rounded-full blur-3xl pointer-events-none" />

            {/* Header: Brand & Search */}
            <div className="flex items-center justify-between mb-10 px-2 relative z-10">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-aura-indigo to-aura-accent flex items-center justify-center shadow-lg shadow-aura-indigo/20">
                        <Sparkles className="text-white" size={18} />
                    </div>
                    <span className="font-display font-black text-xl tracking-tighter aura-text-gradient">Aura.</span>
                </div>
                <button className="w-9 h-9 flex items-center justify-center hover:bg-aura-indigo-soft rounded-xl transition-all group">
                    <Search size={18} className="text-aura-gray group-hover:text-aura-indigo transition-colors" />
                </button>
            </div>

            {/* Core Action */}
            <button className="flex items-center gap-3 px-5 py-4 bg-aura-indigo text-white shadow-xl shadow-aura-indigo/15 rounded-3xl mb-10 group hover:scale-[1.02] active:scale-[0.98] transition-all relative overflow-hidden">
                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                <Plus size={18} className="font-bold" />
                <span className="text-sm font-bold tracking-tight">Generate Insight</span>
            </button>

            {/* Navigation Sections */}
            <div className="flex-1 space-y-10 relative z-10">
                <div className="space-y-4">
                    <h3 className="px-5 text-[11px] font-black uppercase tracking-[0.2em] text-aura-gray/60 leading-none">Neural Nodes</h3>
                    <nav className="space-y-1">
                        {mainNav.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={cn(
                                        "flex items-center gap-4 px-5 py-3 rounded-2xl text-[13px] font-bold transition-all group relative",
                                        isActive
                                            ? "text-aura-indigo bg-aura-indigo/5"
                                            : "text-aura-gray hover:text-aura-indigo"
                                    )}
                                >
                                    {isActive && <motion.div layoutId="nav-pill" className="absolute inset-0 border border-aura-indigo/10 rounded-2xl" />}
                                    <item.icon size={18} className={cn("transition-colors", isActive ? "text-aura-indigo" : "text-aura-gray group-hover:text-aura-indigo")} />
                                    <span className="relative z-10">{item.label}</span>
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                <div className="space-y-4">
                    <h3 className="px-5 text-[11px] font-black uppercase tracking-[0.2em] text-aura-gray/60 leading-none">Workspaces</h3>
                    <nav className="space-y-1">
                        {workspaceNav.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={cn(
                                        "flex items-center gap-4 px-5 py-3 rounded-2xl text-[13px] font-bold transition-all group relative",
                                        isActive
                                            ? "text-aura-indigo bg-aura-indigo/5"
                                            : "text-aura-gray hover:text-aura-indigo"
                                    )}
                                >
                                    {isActive && <motion.div layoutId="nav-pill" className="absolute inset-0 border border-aura-indigo/10 rounded-2xl" />}
                                    <item.icon size={18} className={cn("transition-colors", isActive ? "text-aura-indigo" : "text-aura-gray group-hover:text-aura-indigo")} />
                                    <span className="relative z-10">{item.label}</span>
                                </Link>
                            );
                        })}
                    </nav>
                </div>
            </div>

            {/* Profile & Settings Hook */}
            <div className="mt-auto pt-8 border-t border-black/[0.03] relative z-10">
                <div className="flex items-center gap-3 px-3 py-4 bg-aura-indigo/5 rounded-3xl border border-aura-indigo/10 mb-6 group cursor-pointer hover:bg-aura-indigo/10 transition-colors">
                    <div className="w-10 h-10 rounded-2xl bg-white shadow-sm flex items-center justify-center font-black text-xs text-aura-indigo border border-aura-indigo/5">CP</div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-black text-aura-charcoal truncate tracking-tight">Chandani P.</p>
                        <p className="text-[10px] font-bold text-aura-indigo uppercase tracking-wider">Premium Access</p>
                    </div>
                </div>

                <Link
                    href="/dashboard/settings"
                    className={cn(
                        "w-full flex items-center justify-between px-5 py-3 rounded-2xl text-aura-gray hover:text-aura-charcoal hover:bg-black/[0.02] transition-all",
                        pathname === "/dashboard/settings" && "text-aura-indigo bg-aura-indigo/5"
                    )}
                >
                    <div className="flex items-center gap-3">
                        <Settings size={18} />
                        <span className="text-sm font-bold">Preferences</span>
                    </div>
                    <div className="w-1.5 h-1.5 bg-aura-indigo rounded-full animate-pulse" />
                </Link>
            </div>
        </aside>
    );
}
