"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { motion } from "framer-motion";
import { Settings, Shield, Key, Save, CheckCircle2, Globe, Sparkles, Stars, Zap, Layout, Terminal } from "lucide-react";

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
        <div className="max-w-[1200px] mx-auto py-24 px-8 flex flex-col min-h-full">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-12 mb-20 relative">
                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-6">
                        <Terminal className="text-aura-indigo" size={22} />
                        <span className="text-[11px] font-black uppercase tracking-[.4em] text-aura-gray/40">Neural Configuration</span>
                    </div>
                    <h1 className="text-5xl md:text-8xl font-black font-display tracking-tighter text-aura-charcoal mb-4 uppercase">CONTROL.</h1>
                    <p className="text-aura-gray text-xl font-medium max-w-lg">Calibrate the behavior and sovereignty of your AURA instance.</p>
                </div>
            </div>

            <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                <div className="lg:col-span-8 space-y-12">
                    {/* Personality & Logic Section */}
                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-12 rounded-[56px] bg-white border border-black/[0.04] shadow-sm relative overflow-hidden group hover:shadow-2xl transition-all"
                    >
                        <div className="absolute top-[-10%] right-[-10%] w-64 h-64 bg-aura-indigo/5 blur-[80px] rounded-full" />

                        <div className="flex items-center gap-5 mb-14 relative z-10">
                            <div className="w-16 h-16 rounded-[28px] bg-aura-indigo/5 flex items-center justify-center text-aura-indigo border border-aura-indigo/10 shadow-sm transition-all group-hover:bg-aura-indigo group-hover:text-white">
                                <Shield size={32} />
                            </div>
                            <div>
                                <h2 className="text-3xl font-black tracking-tighter text-aura-charcoal uppercase leading-none mb-2">Neural Persona</h2>
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-aura-gray/60 italic">AI Logic Modeling</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 relative z-10">
                            <div>
                                <label className="block text-[11px] font-black uppercase tracking-[0.3em] text-aura-gray/40 mb-6 ml-1">Logic Model</label>
                                <select
                                    value={prefs.ai_personality}
                                    onChange={(e) => setPrefs({ ...prefs, ai_personality: e.target.value })}
                                    className="w-full h-20 bg-aura-surface border border-black/[0.03] rounded-[32px] px-10 text-sm font-bold focus:outline-none focus:border-aura-indigo/40 transition-all text-aura-charcoal appearance-none cursor-pointer"
                                >
                                    <option value="casual">Casual & Friendly</option>
                                    <option value="professional">Professional & Sharp</option>
                                    <option value="minimalist">Minimalist & Precise</option>
                                    <option value="creative">Creative & Chaotic</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-[11px] font-black uppercase tracking-[0.3em] text-aura-gray/40 mb-6 ml-1">Temporal Anchor</label>
                                <select
                                    value={prefs.timezone}
                                    onChange={(e) => setPrefs({ ...prefs, timezone: e.target.value })}
                                    className="w-full h-20 bg-aura-surface border border-black/[0.03] rounded-[32px] px-10 text-sm font-bold focus:outline-none focus:border-aura-indigo/40 transition-all text-aura-charcoal appearance-none cursor-pointer"
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
                        className="p-12 rounded-[56px] bg-white border border-black/[0.04] shadow-sm relative overflow-hidden group hover:shadow-2xl transition-all"
                    >
                        <div className="absolute top-[-10%] left-[-10%] w-64 h-64 bg-aura-emerald/5 blur-[80px] rounded-full" />

                        <div className="flex items-center gap-5 mb-10 relative z-10">
                            <div className="w-16 h-16 rounded-[28px] bg-aura-emerald/5 flex items-center justify-center text-aura-emerald border border-aura-emerald/10 shadow-sm transition-all group-hover:bg-aura-emerald group-hover:text-white">
                                <Key size={32} />
                            </div>
                            <div>
                                <h2 className="text-3xl font-black tracking-tighter text-aura-charcoal uppercase leading-none mb-2">Sovereignty</h2>
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-aura-gray/60 italic">Private Credential Hub</p>
                            </div>
                        </div>

                        <p className="text-aura-gray text-base font-medium italic mb-14 max-w-2xl leading-relaxed opacity-80 relative z-10">
                            Provide your own Google Cloud credentials for absolute data sovereignty. AURA will bypass system-standard pathways and utilize your personal infrastructure.
                        </p>

                        <div className="space-y-10 relative z-10">
                            <div>
                                <label className="block text-[11px] font-black uppercase tracking-[0.3em] text-aura-gray/40 mb-6 ml-1">Google Client ID</label>
                                <input
                                    type="text"
                                    placeholder="00000000-xxxxx.apps.googleusercontent.com"
                                    value={prefs.google_client_id}
                                    onChange={(e) => setPrefs({ ...prefs, google_client_id: e.target.value })}
                                    className="w-full h-20 bg-aura-surface border border-black/[0.03] rounded-[32px] px-10 text-sm font-bold focus:outline-none focus:border-aura-indigo/40 transition-all text-aura-charcoal placeholder:text-aura-gray/20"
                                />
                            </div>
                            <div>
                                <label className="block text-[11px] font-black uppercase tracking-[0.3em] text-aura-gray/40 mb-6 ml-1">Google Client Secret</label>
                                <input
                                    type="password"
                                    placeholder="••••••••••••••••"
                                    value={prefs.google_client_secret}
                                    onChange={(e) => setPrefs({ ...prefs, google_client_secret: e.target.value })}
                                    className="w-full h-20 bg-aura-surface border border-black/[0.03] rounded-[32px] px-10 text-sm font-bold focus:outline-none focus:border-aura-indigo/40 transition-all text-aura-charcoal placeholder:text-aura-gray/20"
                                />
                            </div>
                        </div>
                    </motion.section>
                </div>

                {/* Sidebar Controls */}
                <div className="lg:col-span-4 space-y-10">
                    <div className="p-12 rounded-[56px] bg-aura-charcoal text-white relative overflow-hidden shadow-2xl group">
                        <div className="absolute -top-10 -right-10 w-48 h-48 bg-aura-emerald/20 rounded-full blur-[80px] pointer-events-none group-hover:scale-125 transition-transform duration-1000" />
                        <div className="flex items-center gap-4 mb-10 relative z-10">
                            <Globe size={20} className="text-aura-emerald" />
                            <h4 className="text-[11px] font-black uppercase tracking-[.4em] text-white/40">Network Status</h4>
                        </div>
                        <div className="text-[80px] font-black italic tracking-tighter mb-4 text-white leading-none">AES</div>
                        <div className="flex items-center gap-3 text-sm font-bold italic text-aura-emerald">
                            <Zap size={18} className="fill-current" />
                            256-bit Hybrid Guard Active
                        </div>
                    </div>

                    <div className="flex flex-col gap-6 pt-10">
                        {error && (
                            <div className="p-8 rounded-[32px] bg-rose-50 border border-rose-100 text-rose-500 text-[10px] font-black uppercase tracking-widest text-center shadow-sm">
                                Protocol Failure: {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full h-24 bg-aura-charcoal text-white rounded-[40px] font-black uppercase text-sm tracking-[.3em] flex items-center justify-center gap-5 hover:bg-aura-indigo transition-all shadow-2xl active:scale-95 disabled:opacity-30 group"
                        >
                            {saved ? (
                                <>Aura Updated <CheckCircle2 size={24} className="text-aura-emerald" /></>
                            ) : (
                                <>Apply Core Logic <Save size={24} className="group-hover:scale-110 transition-transform" /></>
                            )}
                        </button>

                        <div className="text-center">
                            <span className="text-[10px] font-black uppercase tracking-widest text-aura-gray/40">Aura Build v4.2.0-Alpha</span>
                        </div>

                        <button
                            type="button"
                            onClick={async () => {
                                localStorage.removeItem('aura_chat_history');
                                await supabase.auth.signOut();
                                window.location.href = '/login';
                            }}
                            className="w-full py-4 text-aura-gray hover:text-rose-500 font-bold text-xs uppercase tracking-widest transition-colors"
                        >
                            Terminate Session
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}
