"use client";

import { motion } from "framer-motion";
import { Brain, Calendar, CheckCircle2, Lightbulb, MessageSquare, ArrowRight, Sparkles, Wand2, Stars, Zap, Shield, Target } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function Home() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#1A1A1A] font-body selection:bg-aura-gold/10 selection:text-aura-charcoal overflow-x-hidden">

      {/* Elegant Background Elements */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-aura-gold/5 rounded-full blur-[150px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-aura-indigo/5 rounded-full blur-[150px]" />
      </div>

      {/* Premium Nav */}
      <nav className="fixed top-0 w-full z-50 py-10 px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between bg-white/40 backdrop-blur-3xl border border-black/[0.03] py-5 px-10 rounded-[36px] shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-white border border-black/[0.05] rounded-xl flex items-center justify-center shadow-md transform -rotate-3 hover:rotate-0 transition-transform">
              <Sparkles className="text-aura-gold" size={20} />
            </div>
            <span className="font-serif text-3xl italic tracking-tighter text-aura-charcoal">Aura.</span>
          </div>

          <div className="hidden md:flex items-center gap-12">
            {['Abilities', 'Intelligence', 'Sovereignty'].map((link) => (
              <a
                key={link}
                href={`#${link.toLowerCase()}`}
                className="text-[10px] font-black uppercase tracking-[.4em] text-aura-charcoal/30 hover:text-aura-gold transition-colors"
              >
                {link}
              </a>
            ))}
          </div>

          <Link href="/login" className="px-10 py-4 rounded-2xl bg-aura-charcoal text-[#FAF9F6] font-black text-[10px] uppercase tracking-[0.3em] hover:bg-aura-gold transition-all shadow-xl hover:scale-105 active:scale-95">
            Portal access
          </Link>
        </div>
      </nav>

      {/* Hero: Intellectual Grandeur */}
      <section className="relative pt-64 pb-48 px-10">
        <div className="max-w-6xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-4 px-8 py-3 rounded-full bg-white border border-black/[0.03] text-aura-gold text-[10px] font-black uppercase tracking-[0.4em] mb-16 shadow-sm"
          >
            <Stars size={18} />
            Intelligence Reimagined
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-8xl md:text-[160px] font-serif italic tracking-tighter text-aura-charcoal leading-[0.8] mb-20"
          >
            Masterfully <br />
            <span className="text-aura-charcoal/20">Articulated.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="max-w-3xl mx-auto text-aura-charcoal/40 text-xl md:text-2xl font-medium mb-20 leading-relaxed italic"
          >
            "Aura isn’t just an assistant—it’s your digital shadow.
            It captures your thoughts, organizes your destiny, and recalls every detail with crystalline clarity."
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-10"
          >
            <Link href="/login" className="group h-24 px-16 rounded-[40px] bg-aura-charcoal text-[#FAF9F6] font-black uppercase text-xs tracking-[0.4em] flex items-center gap-6 hover:bg-aura-gold hover:shadow-2xl transition-all hover:scale-105 shadow-xl">
              Initialize Sequence <ArrowRight className="group-hover:translate-x-2 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Capabilities (Features) Grid */}
      <section id="abilities" className="py-48 px-10 bg-white border-y border-black/[0.02]">
        <div className="max-w-7xl mx-auto">
          <div className="mb-32 flex flex-col md:flex-row md:items-end justify-between gap-12">
            <div className="max-w-2xl">
              <span className="text-[10px] font-black uppercase tracking-[0.5em] text-aura-gold mb-6 block">Capabilities</span>
              <h2 className="text-6xl md:text-9xl font-serif italic tracking-tighter text-aura-charcoal leading-[0.85]">ELEVATED <br /> ABILITIES.</h2>
            </div>
            <p className="text-aura-charcoal/40 text-xl md:text-2xl font-medium leading-relaxed max-w-md italic">"A single, cohesive stream for your digital existence."</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { icon: Brain, title: "Crystal Recall", desc: "Aura doesn’t just store data; it relates memories. Ask about an idea from months ago with perfect accuracy.", color: "aura-gold" },
              { icon: Calendar, title: "Chronological Stasis", desc: "Direct Google API integration for ultimate privacy. Manage your temporal flow with pure, natural language.", color: "aura-indigo" },
              { icon: Target, title: "Strategic Logic", desc: "Turn messy brainstorms into structured projects. Aura recognizes patterns in your chaotic brilliance.", color: "aura-charcoal" }
            ].map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="p-16 rounded-[64px] bg-[#FAF9F6] border border-black/[0.03] shadow-sm hover:shadow-2xl transition-all group flex flex-col h-full"
              >
                <div className={`w-20 h-20 rounded-[32px] bg-white border border-black/[0.05] flex items-center justify-center mb-16 shadow-lg group-hover:scale-110 transition-transform group-hover:bg-aura-charcoal group-hover:text-white transition-all`}>
                  <f.icon size={36} className="transition-colors" />
                </div>
                <h3 className="text-3xl font-serif font-black italic text-aura-charcoal mb-6 tracking-tight">{f.title}</h3>
                <p className="text-aura-charcoal/40 font-medium text-lg leading-relaxed flex-1 italic">"{f.desc}"</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <footer className="py-72 bg-aura-charcoal text-[#FAF9F6] text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[1200px] border border-white/[0.05] rounded-full" />
        </div>

        <div className="relative z-10 px-10">
          <Zap size={64} className="text-aura-gold mx-auto mb-16" />
          <h2 className="text-7xl md:text-[140px] font-serif italic tracking-tighter leading-[0.8] mb-20 px-4">
            Begin your <br /> <span className="text-white/20">Evolution.</span>
          </h2>
          <Link href="/login" className="inline-block px-20 py-8 rounded-[40px] bg-[#FAF9F6] text-aura-charcoal font-black uppercase text-xs tracking-[0.5em] hover:bg-aura-gold transition-all hover:scale-110 shadow-3xl">
            portal initialized
          </Link>
        </div>
      </footer>
    </div>
  );
}
