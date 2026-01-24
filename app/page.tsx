"use client";

import { motion } from "framer-motion";
import { Brain, Calendar, CheckCircle2, Lightbulb, MessageSquare, ArrowRight, Sparkles, Wand2, Stars, Zap } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";

const FeatureCard = ({ icon: Icon, title, description, color }: any) => (
  <motion.div
    whileHover={{ y: -8, scale: 1.02 }}
    className="p-10 rounded-[40px] glass-card group cursor-default relative overflow-hidden"
  >
    <div className={`absolute top-0 right-0 w-32 h-32 bg-${color}/10 blur-3xl rounded-full -mr-10 -mt-10 group-hover:scale-150 transition-transform duration-700`} />
    <div className={`w-16 h-16 rounded-3xl bg-white/5 flex items-center justify-center mb-8 border border-white/10 group-hover:border-${color}/50 group-hover:rotate-6 transition-all`}>
      <Icon size={32} className={`text-white group-hover:text-aura-primary transition-colors`} />
    </div>
    <h3 className="text-2xl font-bold text-white mb-4 font-display leading-tight">{title}</h3>
    <p className="text-white/50 text-base leading-relaxed font-medium">{description}</p>
  </motion.div>
);

export default function Home() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-aura-bg text-aura-charcoal selection:bg-aura-indigo/10 selection:text-aura-indigo bg-mesh-light">
      {/* Decorative Orbs */}
      <div className="fixed top-[-10%] right-[-5%] w-[600px] h-[600px] bg-aura-indigo/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="fixed bottom-[-10%] left-[-5%] w-[600px] h-[600px] bg-aura-emerald/5 blur-[120px] rounded-full pointer-events-none" />

      {/* Nav */}
      <nav className="fixed top-0 w-full z-50 py-8 px-6 md:px-10">
        <div className="max-w-7xl mx-auto flex items-center justify-between glass-card-light py-4 px-8 rounded-[32px] border-black/[0.04] shadow-xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-tr from-aura-indigo to-aura-accent rounded-xl flex items-center justify-center shadow-lg transform -rotate-3">
              <Stars className="text-white" size={20} />
            </div>
            <span className="text-2xl font-black tracking-tighter font-display aura-text-gradient">AURA.</span>
          </div>
          <div className="hidden md:flex items-center gap-10 text-[11px] font-black uppercase tracking-[0.2em] text-aura-gray">
            <a href="#features" className="hover:text-aura-indigo transition-colors">Abilities</a>
            <a href="#about" className="hover:text-aura-indigo transition-colors">Privacy</a>
            <Link href="/login" className="hover:text-aura-indigo transition-colors font-bold">Portal</Link>
          </div>
          <Link href="/login" className="px-8 py-3 rounded-full bg-aura-charcoal text-white font-black text-xs uppercase tracking-widest hover:bg-aura-indigo transition-all shadow-xl hover:scale-105 active:scale-95">
            Initialize
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-64 pb-32 px-10 overflow-hidden">
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-3 px-6 py-2.5 rounded-full bg-aura-indigo/5 border border-aura-indigo/10 text-aura-indigo text-[10px] font-black uppercase tracking-[0.4em] mb-12 backdrop-blur-md"
          >
            <Sparkles size={16} />
            Intelligence Defined
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-7xl md:text-[120px] font-black tracking-tighter font-display leading-[0.85] mb-16 text-aura-charcoal"
          >
            BEAUTIFULLY <br />
            <span className="bg-gradient-to-r from-aura-indigo via-aura-accent to-aura-indigo bg-clip-text text-transparent">ORDERED.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="max-w-3xl mx-auto text-aura-gray text-xl md:text-2xl font-medium mb-16 leading-relaxed"
          >
            Aura isn’t just an assistant—it’s your digital shadow.
            It captures your thoughts, organizes your destiny, and recalls every detail with crystalline clarity.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-8"
          >
            <Link href="/login" className="group h-20 px-14 rounded-[32px] bg-aura-charcoal text-white font-black uppercase text-sm tracking-[0.2em] flex items-center gap-4 hover:bg-aura-indigo hover:shadow-2xl transition-all hover:scale-105 shadow-xl">
              Get Started <ArrowRight className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <a href="#features" className="text-aura-gray hover:text-aura-indigo font-black uppercase text-xs tracking-widest transition-colors flex items-center gap-2">
              Explore Abilities <Stars size={16} />
            </a>
          </motion.div>
        </div>

        {/* Abstract Shapes */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-black/[0.03] rounded-full opacity-60 pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1100px] h-[1100px] border border-black/[0.01] rounded-full opacity-60 pointer-events-none" />
      </section>

      {/* Stats/Social Proof */}
      <section className="py-24 px-10 border-y border-black/[0.03] bg-aura-surface">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
          {[
            { label: 'Latency', val: '0.1s' },
            { label: 'Privacy', val: '100%' },
            { label: 'Memory', val: '∞' },
            { label: 'The Core', val: 'GPT-4o' }
          ].map(stat => (
            <div key={stat.label} className="group">
              <div className="text-4xl font-black mb-2 text-aura-charcoal group-hover:text-aura-indigo transition-colors">{stat.val}</div>
              <div className="text-[10px] uppercase tracking-[0.3em] font-black text-aura-gray opacity-60">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-48 px-10 relative z-10 bg-white/50">
        <div className="max-w-7xl mx-auto">
          <div className="mb-32 flex flex-col md:flex-row md:items-end justify-between gap-10">
            <div className="max-w-2xl">
              <h2 className="text-5xl md:text-8xl font-black tracking-tighter font-display mb-10 text-aura-charcoal">ELEVATED <br /> CAPABILITIES.</h2>
              <p className="text-aura-gray text-xl md:text-2xl font-medium leading-relaxed max-w-xl">Everything you need to master your digital existence, organized into a single, cohesive experience.</p>
            </div>
            <div className="h-24 w-24 rounded-full border border-aura-indigo/10 flex items-center justify-center text-aura-indigo/20 animate-spin-slow">
              <Stars size={48} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { icon: Brain, title: "Crystal Recall", desc: "Aura doesn’t just store data; it relates memories. Ask about an idea from months ago with perfect accuracy.", color: "indigo" },
              { icon: Calendar, title: "Sovereign Calendar", desc: "Direct Google API integration for ultimate privacy. Manage your life with pure natural language.", color: "emerald" },
              { icon: Lightbulb, title: "Abstract Logic", desc: "Turn messy brainstorms into structured projects. Aura recognizes patterns in your chaotic brilliance.", color: "accent" }
            ].map(f => (
              <motion.div
                key={f.title}
                whileHover={{ y: -10 }}
                className="p-12 rounded-[48px] bg-white border border-black/[0.04] shadow-sm hover:shadow-2xl hover:border-aura-indigo/10 transition-all group"
              >
                <div className={`w-16 h-16 rounded-2xl bg-aura-${f.color}/5 flex items-center justify-center mb-10 group-hover:bg-aura-${f.color} group-hover:text-white transition-all`}>
                  <f.icon size={30} className={`text-aura-${f.color} group-hover:text-white transition-colors`} />
                </div>
                <h3 className="text-2xl font-black text-aura-charcoal mb-4 tracking-tight">{f.title}</h3>
                <p className="text-aura-gray font-medium leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Footer */}
      <footer className="py-56 relative overflow-hidden bg-aura-charcoal text-white">
        <div className="absolute inset-0 bg-mesh-light opacity-5" />
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <Zap className="mx-auto mb-12 text-aura-indigo" size={56} fill="currentColor" />
          <h2 className="text-6xl md:text-[120px] font-black tracking-tighter font-display leading-[0.85] mb-20 px-4">BEGIN YOUR <br /> EVOLUTION.</h2>
          <Link href="/login" className="inline-block px-14 py-6 rounded-full bg-white text-aura-charcoal font-black uppercase text-sm tracking-[0.3em] hover:bg-aura-indigo hover:text-white transition-all hover:scale-110 shadow-3xl">
            Initialize Account
          </Link>
        </div>
      </footer>
    </div>
  );
}
