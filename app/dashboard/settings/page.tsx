"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { motion } from "framer-motion";
import { Settings, Shield, Key, Save, CheckCircle2, Globe, Zap, Terminal, LogOut } from "lucide-react";

export default function SettingsPage() {
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [saved, setSaved] = useState(false);
    const [prefs, setPrefs] = useState({
        ai_personality: "casual",
        timezone: "UTC",
        google_client_id: "",
        google_client_secret: ""
    });

    const supabase = createClient();

    useEffect(() => {
        fetchPrefs();
    }, []);

    async function fetchPrefs() {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data, error } = await supabase
            .from('user_preferences')
            .select('*')
            .eq('user_id', user.id)
            .maybeSingle();

        if (error) {
            console.error("Fetch Prefs Error:", error);
            return;
        }

        if (data) {
            setPrefs({
                ai_personality: data.ai_personality || "casual",
                timezone: data.timezone || "UTC",
                google_client_id: data.notification_preferences?.google_client_id || "",
                google_client_secret: data.notification_preferences?.google_client_secret || ""
            });
        }
    }

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setSaved(false);
        setError(null);

        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error("Authentication link lost. Please log in again.");

            const { error: upsertError } = await supabase
                .from('user_preferences')
                .upsert({
                    user_id: user.id,
                    ai_personality: prefs.ai_personality,
                    timezone: prefs.timezone,
                    notification_preferences: {
                        google_client_id: prefs.google_client_id,
                        google_client_secret: prefs.google_client_secret,
                        email: true,
                        in_app: true
                    },
                    updated_at: new Date().toISOString()
                }, {
                    onConflict: 'user_id'
                });

            if (upsertError) throw upsertError;

            setSaved(true);
            setTimeout(() => setSaved(false), 3000);
        } catch (err: any) {
            console.error("Save Settings Error:", err);
            setError(err.message || "Failed to save parameters to the neural core.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex-1 flex flex-col pt-12">

            <header className="mb-20 px-2">
                <div className="flex items-center gap-2 mb-6 opacity-30">
                    <Terminal size={16} className="text-aura-gold" />
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-aura-charcoal">Neural Configuration</span>
                </div>
                <h1 className="text-8xl font-serif italic tracking-tighter text-aura-charcoal leading-none">
                    Control Center<span className="text-aura-gold">.</span>
                </h1>
                <p className="mt-8 text-aura-charcoal/40 font-medium max-w-lg leading-relaxed text-[17px] italic">
                    "Calibrate the behavior, sovereignty, and chronological anchors of your private AURA instance."
                </p>
            </header>

            <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-12 gap-12 pb-32">
                <div className="lg:col-span-8 space-y-12">

                    {/* Neural Persona Section */}
                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-12 rounded-[56px] bg-white border border-black/[0.03] shadow-sm relative overflow-hidden group"
                    >
                        <div className="absolute top-10 right-10 opacity-[0.03] group-hover:opacity-10 transition-opacity">
                            <Shield size={120} className="text-aura-charcoal" />
                        </div>

                        <div className="flex items-center gap-6 mb-14">
                            <div className="w-16 h-16 rounded-[28px] bg-white border border-black/[0.05] flex items-center justify-center text-aura-gold shadow-lg shadow-black/[0.02]">
                                <Zap size={28} />
                            </div>
                            <div>
                                <h2 className="text-3xl font-serif font-black italic text-aura-charcoal tracking-tight">Neural Persona</h2>
                                <p className="text-[11px] font-black uppercase tracking-widest text-aura-charcoal/20">AI Logic Modeling</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 relative z-10">
                            <div className="space-y-6">
                                <label className="text-[11px] font-black uppercase tracking-widest text-aura-charcoal/30 ml-1">Logic Model</label>
                                <select
                                    value={prefs.ai_personality}
                                    onChange={(e) => setPrefs({ ...prefs, ai_personality: e.target.value })}
                                    className="w-full h-20 bg-aura-accent-soft border border-black/[0.03] rounded-[32px] px-10 text-sm font-bold text-aura-charcoal focus:outline-none focus:border-aura-gold/40 transition-all appearance-none cursor-pointer shadow-inner"
                                >
                                    <option value="casual">Casual & Friendly</option>
                                    <option value="professional">Professional & Sharp</option>
                                    <option value="minimalist">Minimalist & Precise</option>
                                    <option value="creative">Creative & Chaotic</option>
                                </select>
                            </div>
                            <div className="space-y-6">
                                <label className="text-[11px] font-black uppercase tracking-widest text-aura-charcoal/30 ml-1">Temporal Anchor</label>
                                <select
                                    value={prefs.timezone}
                                    onChange={(e) => setPrefs({ ...prefs, timezone: e.target.value })}
                                    className="w-full h-20 bg-aura-accent-soft border border-black/[0.03] rounded-[32px] px-10 text-sm font-bold text-aura-charcoal focus:outline-none focus:border-aura-gold/40 transition-all appearance-none cursor-pointer shadow-inner"
                                >
                                    <option value="UTC">UTC (Universal)</option>
                                    <option value="EST">Eastern Standard Time</option>
                                    <option value="PST">Pacific Standard Time</option>
                                    <option value="IST">India Standard Time</option>
                                </select>
                            </div>
                        </div>
                    </motion.section>

                    {/* Sovereignty Section */}
                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="p-12 rounded-[56px] bg-white border border-black/[0.03] shadow-sm relative overflow-hidden group"
                    >
                        <div className="flex items-center gap-6 mb-14">
                            <div className="w-16 h-16 rounded-[28px] bg-white border border-black/[0.05] flex items-center justify-center text-aura-gold shadow-lg shadow-black/[0.02]">
                                <Key size={28} />
                            </div>
                            <div>
                                <h2 className="text-3xl font-serif font-black italic text-aura-charcoal tracking-tight">Sovereignty</h2>
                                <p className="text-[11px] font-black uppercase tracking-widest text-aura-charcoal/20">Private Credential Hub</p>
                            </div>
                        </div>

                        <p className="text-aura-charcoal/40 text-[16px] font-medium leading-relaxed mb-12 max-w-xl italic">
                            Provide your own Google Cloud credentials for absolute data sovereignty. AURA will bypass system-standard pathways and utilize your personal infrastructure.
                        </p>

                        <div className="space-y-10">
                            <div className="space-y-6">
                                <label className="text-[11px] font-black uppercase tracking-widest text-aura-charcoal/30 ml-1">Google Client ID</label>
                                <input
                                    type="text"
                                    placeholder="00000000-xxxxx.apps.googleusercontent.com"
                                    value={prefs.google_client_id}
                                    onChange={(e) => setPrefs({ ...prefs, google_client_id: e.target.value })}
                                    className="w-full h-20 bg-aura-accent-soft border border-black/[0.02] rounded-[32px] px-10 text-sm font-bold text-aura-charcoal focus:outline-none focus:border-aura-gold/40 transition-all placeholder:text-aura-charcoal/10 shadow-inner"
                                />
                            </div>
                            <div className="space-y-6">
                                <label className="text-[11px] font-black uppercase tracking-widest text-aura-charcoal/30 ml-1">Google Client Secret</label>
                                <input
                                    type="password"
                                    placeholder="••••••••••••••••"
                                    value={prefs.google_client_secret}
                                    onChange={(e) => setPrefs({ ...prefs, google_client_secret: e.target.value })}
                                    className="w-full h-20 bg-aura-accent-soft border border-black/[0.02] rounded-[32px] px-10 text-sm font-bold text-aura-charcoal focus:outline-none focus:border-aura-gold/40 transition-all placeholder:text-aura-charcoal/10 shadow-inner"
                                />
                            </div>
                        </div>
                    </motion.section>
                </div>

                {/* Tactical Actions Sidebar */}
                <div className="lg:col-span-4 space-y-10">
                    <div className="p-12 rounded-[56px] bg-aura-charcoal text-[#FAF9F6] relative overflow-hidden shadow-2xl group">
                        <div className="flex items-center gap-4 mb-10 opacity-30">
                            <Globe size={20} className="text-aura-gold" />
                            <h4 className="text-[11px] font-black uppercase tracking-widest text-[#FAF9F6]">Secure Mesh</h4>
                        </div>
                        <div className="text-7xl font-serif italic tracking-tighter text-[#FAF9F6] mb-4">AES</div>
                        <div className="flex items-center gap-3 text-sm font-bold italic text-aura-gold">
                            <Shield size={18} />
                            Hybird Cryptography Active
                        </div>
                    </div>

                    <div className="flex flex-col gap-6">
                        {error && (
                            <div className="p-8 rounded-[32px] bg-rose-50 border border-rose-100 text-rose-500 text-[11px] font-black uppercase tracking-widest text-center shadow-sm">
                                Protocol Failure: {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full h-24 bg-aura-charcoal text-[#FAF9F6] rounded-[44px] font-black uppercase text-sm tracking-[.4em] flex items-center justify-center gap-6 hover:bg-aura-gold transition-all shadow-2xl active:scale-95 disabled:opacity-30 group"
                        >
                            {saved ? (
                                <>Logic Applied <CheckCircle2 size={24} className="text-aura-gold" /></>
                            ) : (
                                <>Update Core <Save size={24} className="group-hover:rotate-12 transition-transform" /></>
                            )}
                        </button>

                        <button
                            type="button"
                            onClick={async () => {
                                await supabase.auth.signOut();
                                window.location.href = '/login';
                            }}
                            className="w-full h-20 bg-white border border-black/[0.05] text-aura-charcoal/40 rounded-[36px] font-black uppercase text-[11px] tracking-widest flex items-center justify-center gap-5 hover:bg-rose-500 hover:text-white hover:border-rose-500 transition-all shadow-sm group"
                        >
                            <LogOut size={18} /> Terminate
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}
