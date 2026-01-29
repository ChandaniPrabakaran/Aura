"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    Clock,
    Brain,
    CheckCircle2,
    Target,
    Sparkles
} from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

const navItems = [
    { icon: LayoutDashboard, label: "Feed", href: "/dashboard" },
    { icon: Clock, label: "Time", href: "/dashboard/timeline" },
    { icon: CheckCircle2, label: "Tasks", href: "/dashboard/tasks" },
    { icon: Target, label: "Goals", href: "/dashboard/goals" },
    { icon: Brain, label: "Vault", href: "/dashboard/ideas" },
];

export default function MobileNav() {
    const pathname = usePathname();

    return (
        <nav className="lg:hidden fixed bottom-0 left-0 w-full bg-white/80 backdrop-blur-2xl border-t border-black/[0.03] px-6 py-4 z-[100] safe-area-bottom">
            <div className="flex items-center justify-between max-w-md mx-auto">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex flex-col items-center gap-1.5 transition-all relative px-2",
                                isActive ? "text-aura-charcoal" : "text-aura-charcoal/30"
                            )}
                        >
                            <div className={cn(
                                "w-10 h-10 rounded-2xl flex items-center justify-center transition-all",
                                isActive ? "bg-aura-charcoal text-white shadow-lg scale-110" : "bg-transparent"
                            )}>
                                <item.icon size={20} />
                            </div>
                            <span className={cn(
                                "text-[9px] font-black uppercase tracking-widest transition-opacity",
                                isActive ? "opacity-100" : "opacity-0 h-0"
                            )}>
                                {item.label}
                            </span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}
