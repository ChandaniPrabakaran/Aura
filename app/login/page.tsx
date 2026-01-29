"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Mail, Lock, ArrowRight, Github, Chrome, ShieldCheck, Zap, Globe, Cpu } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function LoginPage() {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const supabase = createClient();

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const { error: authError } = isLogin
            ? await supabase.auth.signInWithPassword({ email, password })
            : await supabase.auth.signUp({
                email,
                password,
                options: { emailRedirectTo: `${window.location.origin}/auth/callback` }
            });

        if (authError) {
            setError(authError.message);
            setLoading(false);
        } else {
            router.push("/dashboard");
        }
    };

    return (
        <div className="min-h-screen w-full bg-[#FAF9F6] flex overflow-hidden relative">

            {/* Left Side: Cinematic Immersive Visual */}
            <div className="hidden lg:flex w-7/12 relative overflow-hidden bg-aura-charcoal">
                <motion.div
                    initial={{ scale: 1.1, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 2, ease: "easeOut" }}
                    className="absolute inset-0"
                >
                    <Image
                        src="/login-bg.png"
                        alt="Cinematic Background"
                        fill
                        className="object-cover opacity-80"
                        priority
                    />
                    {/* Dynamic Overlays */}
                    <div className="absolute inset-0 bg-gradient-to-r from-aura-charcoal/40 via-transparent to-aura-charcoal/20" />
                    <div className="absolute inset-0 backdrop-blur-[2px]" />
                </motion.div>

                {/* Floating Executive Insights */}
                <div className="absolute inset-0 flex flex-col justify-between p-20 z-10">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="flex items-center gap-3"
                    >
                        <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-3xl border border-white/10 overflow-hidden shadow-2xl">
                            <img src="/aura-logo.png" alt="Aura Logo" className="w-full h-full object-cover" />
                        </div>
                        <span className="text-white font-serif italic text-2xl tracking-tighter">Aura Manifest.</span>
                    </motion.div>

                    <div className="space-y-12">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.8 }}
                            className="max-w-md"
                        >
                            <h1 className="text-7xl font-serif italic text-white leading-[0.9] tracking-tighter mb-8 bg-gradient-to-br from-white via-white to-white/40 bg-clip-text text-transparent">
                                Synchronize Your Existence.
                            </h1>
                            <p className="text-white/40 text-lg font-medium leading-relaxed">
                                Join the elite collective. A world-class executive environment designed for those who orchestrate reality.
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1.2 }}
                            className="flex gap-8"
                        >
                            {[
                                { icon: Globe, label: "Temporal sync" },
                                { icon: Cpu, label: "Neural logic" },
                                { icon: ShieldCheck, label: "Encrypted" }
                            ].map((item, i) => (
                                <div key={i} className="flex items-center gap-2 group cursor-help">
                                    <item.icon size={14} className="text-aura-gold transition-transform group-hover:scale-125" />
                                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30 group-hover:text-white/60 transition-colors">{item.label}</span>
                                </div>
                            ))}
                        </motion.div>
                    </div>
                </div>

                {/* Animated Light Streaks */}
                <motion.div
                    animate={{ x: ['100%', '-100%'], opacity: [0, 0.5, 0] }}
                    transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                    className="absolute top-1/4 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-aura-gold/50 to-transparent rotate-[-15deg]"
                />
            </div>

            {/* Right Side: Sophisticated Interaction Form */}
            <div className="flex-1 flex flex-col items-center justify-center px-8 lg:px-20 relative z-20">
                <div className="w-full max-w-[420px]">
                    <div className="mb-16">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-aura-gold/5 border border-aura-gold/10 mb-6">
                            <div className="w-1.5 h-1.5 rounded-full bg-aura-gold animate-pulse" />
                            <span className="text-[9px] font-black uppercase tracking-widest text-aura-gold/60">System Ready for Identification</span>
                        </div>
                        <h2 className="text-5xl font-serif italic text-aura-charcoal tracking-tighter">
                            {isLogin ? "Welcome Back." : "Create Identity."}
                        </h2>
                    </div>

                    <form onSubmit={handleAuth} className="space-y-6">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={isLogin ? "login" : "signup"}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.3 }}
                                className="space-y-4"
                            >
                                <div className="space-y-1.5">
                                    <label className="text-[11px] font-black uppercase tracking-widest text-aura-charcoal/30 ml-1">Universal Address</label>
                                    <div className="relative group">
                                        <Mail size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-aura-charcoal/20 group-focus-within:text-aura-gold transition-colors" />
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="you@domain.com"
                                            required
                                            className="w-full pl-14 pr-8 py-5 rounded-[24px] bg-white border border-black/[0.05] focus:border-aura-gold/30 focus:outline-none transition-all shadow-sm hover:shadow-md text-[15px] font-bold text-aura-charcoal placeholder:text-black/5"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-[11px] font-black uppercase tracking-widest text-aura-charcoal/30 ml-1">Access Protocol</label>
                                    <div className="relative group">
                                        <Lock size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-aura-charcoal/20 group-focus-within:text-aura-gold transition-colors" />
                                        <input
                                            type="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            placeholder="••••••••"
                                            required
                                            className="w-full pl-14 pr-8 py-5 rounded-[24px] bg-white border border-black/[0.05] focus:border-aura-gold/30 focus:outline-none transition-all shadow-sm hover:shadow-md text-[15px] font-bold text-aura-charcoal placeholder:text-black/5"
                                        />
                                    </div>
                                </div>

                                {error && (
                                    <motion.p
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="text-[11px] font-bold text-red-500 bg-red-500/5 py-3 px-5 rounded-2xl border border-red-500/10"
                                    >
                                        {error}
                                    </motion.p>
                                )}

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-aura-charcoal text-[#FAF9F6] py-5 rounded-[24px] font-black text-[13px] uppercase tracking-[0.2em] shadow-2xl hover:bg-black/80 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3 group overflow-hidden relative"
                                >
                                    <span className="relative z-10">{loading ? "Synchronizing..." : (isLogin ? "Authenticate" : "Manifest Identity")}</span>
                                    <ArrowRight size={18} className="relative z-10 transition-transform group-hover:translate-x-2" />

                                    {/* Hover Shine Effect */}
                                    <motion.div
                                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"
                                    />
                                </button>
                            </motion.div>
                        </AnimatePresence>
                    </form>

                    <div className="mt-12 text-center">
                        <button
                            onClick={() => setIsLogin(!isLogin)}
                            className="text-[11px] font-black uppercase tracking-[0.3em] text-aura-charcoal/30 hover:text-aura-charcoal transition-colors underline-offset-8 hover:underline"
                        >
                            {isLogin ? "Request Access to Collective (Sign Up)" : "Existing Identity Found (Sign In)"}
                        </button>
                    </div>

                    <div className="mt-20 pt-10 border-t border-black/[0.03] space-y-6">
                        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-aura-charcoal/10 text-center">Neural Gateway Shortcuts</p>
                        <div className="flex gap-4">
                            <button className="flex-1 py-4 rounded-2xl border border-black/[0.05] hover:bg-black/[0.02] transition-all flex items-center justify-center gap-2 group">
                                <Chrome size={16} className="text-aura-charcoal/20 group-hover:text-aura-charcoal transition-colors" />
                                <span className="text-[9px] font-black uppercase tracking-widest text-aura-charcoal/40">OpenID</span>
                            </button>
                            <button className="flex-1 py-4 rounded-2xl border border-black/[0.05] hover:bg-black/[0.02] transition-all flex items-center justify-center gap-2 group">
                                <Github size={16} className="text-aura-charcoal/20 group-hover:text-aura-charcoal transition-colors" />
                                <span className="text-[9px] font-black uppercase tracking-widest text-aura-charcoal/40">SecureGit</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Ambient System Gradients */}
            <div className="fixed top-0 right-0 w-[30%] h-[30%] bg-aura-gold/5 rounded-full blur-[120px] pointer-events-none" />
            <div className="fixed bottom-0 left-0 w-[20%] h-[20%] bg-aura-charcoal/5 rounded-full blur-[100px] pointer-events-none" />
        </div>
    );
}
