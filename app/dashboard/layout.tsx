"use client";

import Sidebar from "@/components/dashboard/Sidebar";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-aura-bg text-aura-charcoal selection:bg-aura-indigo/10 relative flex overflow-hidden">
            {/* Global Foundation - Mesh & Texture */}
            <div className="fixed inset-0 bg-aura-bg z-0" />
            <div className="fixed inset-0 bg-mesh-light z-[1] opacity-100" />
            <div className="fixed inset-0 opacity-[0.015] pointer-events-none z-[2]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3%3Cfilter id='noiseFilter'%3%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3%3C/filter%3%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3%3C/svg%3")` }} />

            <Sidebar />

            <main className="flex-1 relative z-10 w-full h-screen overflow-y-auto no-scrollbar">
                {children}

                {/* Global Notification Portal */}
                <div id="notification-portal" className="fixed top-8 right-8 z-[200] space-y-4" />
            </main>
        </div>
    );
}
