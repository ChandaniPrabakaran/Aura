"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
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
    LogOut,
    X
} from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/lib/supabase/client";

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

interface SidebarProps {
    isOpen?: boolean;
    onClose?: () => void;
}

export default function DashboardSidebar({ isOpen, onClose }: SidebarProps) {
    const pathname = usePathname();
    const router = useRouter();
    const supabase = createClient();

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push('/login');
        router.refresh();
    };

    const sidebarContent = (
        <div className="flex flex-col h-full py-12 px-8">
            {/* Branding: Warm Intellectual */}
            <div className="flex items-center justify-between mb-20 px-2">
                <div className="flex items-center gap-4 group cursor-pointer">
                    <div className="relative w-12 h-12 rounded-2xl overflow-hidden bg-aura-charcoal shadow-xl group-hover:scale-110 transition-transform duration-500">
                        <img
                            src="/aura-logo.png"
                            alt="Aura Logo"
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div className="flex flex-col">
                        <span className="font-serif text-3xl italic tracking-tighter text-aura-charcoal leading-none">Aura.</span>
                        <span className="text-[8px] font-black uppercase tracking-[0.4em] text-aura-charcoal/30 mt-1">Intelligence</span>
                    </div>
                </div>
                {/* Close Button Only on Mobile */}
                <button
                    onClick={onClose}
                    className="lg:hidden p-3 rounded-2xl bg-black/[0.03] text-aura-charcoal/40"
                >
                    <X size={20} />
                </button>
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
                                    onClick={onClose}
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
                                    onClick={onClose}
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
                    onClick={handleLogout}
                    className="w-full mt-6 py-3 px-6 flex items-center gap-3 text-aura-charcoal/40 hover:text-aura-charcoal transition-all text-xs font-black uppercase tracking-widest"
                >
                    <LogOut size={16} />
                    Log Out
                </button>
            </div>
        </div>
    );

    return (
        <>
            {/* Desktop Sidebar */}
            <aside className="hidden lg:flex w-[300px] h-screen sticky top-0 bg-[#FAF9F6] border-r border-black/[0.03] flex-col z-[100] flex-shrink-0">
                {sidebarContent}
            </aside>

            {/* Mobile Sidebar (Drawer) */}
            <AnimatePresence>
                {isOpen && (
                    <div className="fixed inset-0 z-[200] lg:hidden">
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={onClose}
                            className="absolute inset-0 bg-aura-charcoal/20 backdrop-blur-sm"
                        />
                        {/* Drawer */}
                        <motion.aside
                            initial={{ x: "-100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "-100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="absolute left-0 top-0 bottom-0 w-[85%] max-w-[320px] bg-[#FAF9F6] shadow-2xl overflow-y-auto"
                        >
                            {sidebarContent}
                        </motion.aside>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
}
