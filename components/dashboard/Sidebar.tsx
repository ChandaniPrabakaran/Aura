"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    Clock,
    Brain,
    CheckCircle2,
    Target,
    Settings,
    Sparkles,
    ChevronRight,
    Activity,
    Shield,
    LogOut
} from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { motion } from "framer-motion";

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

const mainNav = [
    { icon: LayoutDashboard, label: "Overview", href: "/dashboard" },
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
        <aside className="w-[300px] h-screen sticky top-0 bg-[#FAF9F6] border-r border-black/[0.03] flex flex-col py-12 px-8 z-[100] flex-shrink-0">

            {/* Branding: Warm Intellectual */}
            <div className="flex items-center gap-4 mb-20 px-2 group cursor-pointer">
                <div className="w-10 h-10 rounded-2xl bg-white border border-black/[0.05] flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                    <Sparkles size={20} className="text-aura-gold" />
                </div>
                <div className="flex flex-col">
                    <span className="font-serif text-3xl italic tracking-tighter text-aura-charcoal leading-none">Aura.</span>
                    <span className="text-[8px] font-black uppercase tracking-[0.4em] text-aura-charcoal/30 mt-1">Intelligence</span>
                </div>
            </div>

            {/* Navigation Sections */}
            <div className="flex-1 space-y-14">
                <section>
                    <h3 className="px-5 text-[9px] font-black uppercase tracking-[0.4em] text-aura-charcoal/20 mb-6">Exploration</h3>
                    <nav className="space-y-3">
                        {mainNav.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={cn(
                                        "flex items-center gap-4 px-5 py-3 rounded-2xl text-[14px] font-bold transition-all group relative",
                                        isActive
                                            ? "text-aura-charcoal bg-white border border-black/[0.05] shadow-sm"
                                            : "text-aura-charcoal/40 hover:text-aura-charcoal hover:bg-black/[0.02]"
                                    )}
                                >
                                    <item.icon size={18} className={cn("transition-colors", isActive ? "text-aura-gold" : "text-aura-charcoal/20 group-hover:text-aura-charcoal")} />
                                    <span className="flex-1">{item.label}</span>
                                    {isActive && <div className="w-1.5 h-1.5 rounded-full bg-aura-gold shadow-[0_0_8px_rgba(212,175,55,0.4)]" />}
                                </Link>
                            );
                        })}
                    </nav>
                </section>

                <section>
                    <h3 className="px-5 text-[9px] font-black uppercase tracking-[0.4em] text-aura-charcoal/20 mb-6">Directives</h3>
                    <nav className="space-y-3">
                        {workspaceNav.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={cn(
                                        "flex items-center gap-4 px-5 py-3 rounded-2xl text-[14px] font-bold transition-all group relative",
                                        isActive
                                            ? "text-aura-charcoal bg-white border border-black/[0.05] shadow-sm"
                                            : "text-aura-charcoal/40 hover:text-aura-charcoal hover:bg-black/[0.02]"
                                    )}
                                >
                                    <item.icon size={18} className={cn("transition-colors", isActive ? "text-aura-gold" : "text-aura-charcoal/20 group-hover:text-aura-charcoal")} />
                                    <span className="flex-1">{item.label}</span>
                                    {isActive && <div className="w-1.5 h-1.5 rounded-full bg-aura-gold shadow-[0_0_8px_rgba(212,175,55,0.4)]" />}
                                </Link>
                            );
                        })}
                    </nav>
                </section>
            </div>

            {/* Profile Summary */}
            <div className="mt-auto pt-10 border-t border-black/[0.03]">
                <div className="flex items-center gap-4 px-4 py-4 rounded-3xl bg-white border border-black/[0.03] group shadow-sm">
                    <div className="w-10 h-10 rounded-2xl bg-aura-accent-soft flex items-center justify-center text-xs font-black text-aura-charcoal shadow-inner">CP</div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-aura-charcoal truncate">Chandani P.</p>
                        <p className="text-[9px] font-black text-aura-charcoal/30 uppercase tracking-[0.1em]">Strategy Access</p>
                    </div>
                </div>

                <button
                    onClick={async () => {
                        window.location.href = '/login';
                    }}
                    className="w-full mt-6 py-3 px-6 flex items-center gap-3 text-aura-charcoal/40 hover:text-aura-charcoal transition-all text-xs font-black uppercase tracking-widest"
                >
                    <LogOut size={16} />
                    Log Out
                </button>
            </div>
        </aside>
    );
}
