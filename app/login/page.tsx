"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { motion } from "framer-motion";
import { Stars, Mail, Lock, ArrowRight, Github, Sparkles } from "lucide-react";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [isSignUp, setIsSignUp] = useState(false);
    const [message, setMessage] = useState("");
    const supabase = createClient();

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");

        try {
            localStorage.removeItem('aura_chat_history'); // Clear chat on new login attempt
            if (isSignUp) {
                const { error } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        emailRedirectTo: `${window.location.origin}/auth/callback`,
                    },
                });
                if (error) throw error;
                setMessage("Check your email for the confirmation link!");
            } else {
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });
                if (error) throw error;
                window.location.href = "/dashboard";
            }
        } catch (error: any) {
            setMessage(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        localStorage.removeItem('aura_chat_history'); // Clear chat on new login attempt
        await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${window.location.origin}/auth/callback`,
            },
        });
    };

    return (
        <div className="min-h-screen bg-aura-bg flex items-center justify-center p-8 bg-mesh-light relative overflow-hidden">
            {/* Massive Background Orb */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-aura-indigo/5 blur-[150px] rounded-full pointer-events-none animate-pulse" />

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-xl p-12 md:p-16 rounded-[60px] glass-card-light border-black/[0.03] shadow-3xl relative z-10"
            >
                <div className="text-center mb-16">
                    <div className="w-20 h-20 bg-gradient-to-tr from-aura-indigo to-aura-accent rounded-[32px] flex items-center justify-center shadow-3xl mx-auto mb-10 transform -rotate-6">
                        <Stars className="text-white" size={40} />
                    </div>
                    <h1 className="text-5xl font-black font-display tracking-tighter text-aura-charcoal mb-4">
                        {isSignUp ? "Step into the Light" : "Resume Connectivity"}
                    </h1>
                    <p className="text-aura-gray text-[10px] font-black uppercase tracking-[0.4em] italic opacity-60">
                        Aura Neural Network Access
                    </p>
                </div>

                <form onSubmit={handleAuth} className="space-y-6">
                    <div className="relative group">
                        <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-aura-gray/40 group-focus-within:text-aura-indigo transition-colors" size={22} />
                        <input
                            type="email"
                            placeholder="Email identity"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-black/[0.02] border border-black/[0.04] rounded-[28px] py-6 pl-16 pr-8 text-lg font-medium focus:outline-none focus:border-aura-indigo/40 transition-all text-aura-charcoal placeholder:text-aura-gray/30"
                            required
                        />
                    </div>

                    <div className="relative group">
                        <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-aura-gray/40 group-focus-within:text-aura-indigo transition-colors" size={22} />
                        <input
                            type="password"
                            placeholder="Secure pattern"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-black/[0.02] border border-black/[0.04] rounded-[28px] py-6 pl-16 pr-8 text-lg font-medium focus:outline-none focus:border-aura-indigo/40 transition-all text-aura-charcoal placeholder:text-aura-gray/30"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full h-20 bg-aura-charcoal text-white rounded-[32px] font-black uppercase text-sm tracking-[0.2em] hover:bg-aura-indigo transition-all shadow-3xl flex items-center justify-center gap-4 active:scale-95 disabled:opacity-30"
                    >
                        {loading ? "Synchronizing..." : (isSignUp ? "Finalize Entry" : "Establish Link")}
                        <ArrowRight size={20} />
                    </button>
                </form>

                <div className="mt-12 pt-12 border-t border-black/[0.03] text-center">
                    <button
                        onClick={handleGoogleLogin}
                        className="w-full h-20 glass-card-light rounded-[32px] flex items-center justify-center gap-4 text-aura-charcoal font-black text-xs uppercase tracking-widest hover:border-aura-indigo/20 transition-all shadow-lg active:scale-95 border-black/[0.04]"
                    >
                        <svg className="w-6 h-6" viewBox="0 0 24 24">
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                            <path fill="#34A853" d="M12 23c3.11 0 5.71-1.03 7.61-2.79l-3.57-2.77c-.99.66-2.25 1.05-4.04 1.05-3.11 0-5.74-2.1-6.68-4.92H1.64v2.85C3.59 20.25 7.55 23 12 23z" />
                            <path fill="#FBBC05" d="M5.32 13.57c-.24-.7-.37-1.44-.37-2.22s.13-1.52.37-2.22V6.28H1.64C.6 8.39 0 10.7 0 12.5s.6 4.11 1.64 6.22l3.68-2.65z" />
                            <path fill="#EA4335" d="M12 4.1c1.69 0 3.21.58 4.41 1.72l3.31-3.31C17.7 1.05 15.11 0 12 0 7.55 0 3.59 2.75 1.64 6.28L5.32 9.13C6.26 6.31 8.89 4.1 12 4.1z" />
                        </svg>
                        Authorize with Google
                    </button>
                </div>

                {message && (
                    <div className="mt-8 p-6 rounded-3xl bg-aura-indigo/5 border border-aura-indigo/10 text-aura-indigo text-xs font-black text-center uppercase tracking-widest flex items-center justify-center gap-3">
                        <Sparkles size={16} /> {message}
                    </div>
                )}

                <div className="mt-12 text-center">
                    <button
                        onClick={() => setIsSignUp(!isSignUp)}
                        className="text-aura-gray/40 text-[10px] font-black uppercase tracking-[0.3em] hover:text-aura-indigo transition-colors flex items-center justify-center gap-2 mx-auto"
                    >
                        {isSignUp ? "Reconnect with existing ID" : "Initialize new neural link"} <Stars size={14} />
                    </button>
                </div>
            </motion.div>
        </div>
    );
}
