"use client";

import Sidebar from "@/components/dashboard/Sidebar";
import { motion } from "framer-motion";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen w-full bg-[#FAF9F6] text-[#1A1A1A] font-body relative">

            {/* Ambient Warm Gradients */}
            <div className="fixed inset-0 pointer-events-none opacity-40 z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-aura-gold/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-aura-indigo/5 rounded-full blur-[120px]" />
            </div>

            {/* Persistence Layer Column 1: Minimalist Sidebar */}
            <Sidebar />

            {/* Persistence Layer Column 2: Main Content (Native Scrollable) */}
            <main className="flex-1 flex flex-col relative z-10 w-full min-h-screen min-w-0">
                <div className="container max-w-[1200px] mx-auto px-10 py-10 flex-col flex h-full">
                    {children}
                </div>
            </main>

            {/* Subtle System Status (Floating) */}
            <div className="fixed top-8 right-12 z-[100]">
                <div className="px-4 py-2 rounded-full bg-white/40 backdrop-blur-3xl border border-black/[0.03] flex items-center gap-2 shadow-sm">
                    <div className="w-1.5 h-1.5 rounded-full bg-aura-gold animate-pulse" />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-aura-charcoal/40">Neural Sync Active</span>
                </div>
            </div>

            {/* Portal for dynamic overlays */}
            <div id="notification-portal" className="fixed top-24 right-12 z-[200] space-y-4" />
        </div>
    );
}
