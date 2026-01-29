"use client";

import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { Sparkles, ArrowRight, Shield, Zap, Globe, Cpu, Brain, Target, Calendar, ChevronDown } from "lucide-react";
import Image from "next/image";
import { useRef } from "react";

export default function LandingPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const heroScale = useTransform(scrollYProgress, [0, 0.5], [1, 1.1]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const heroTextY = useTransform(scrollYProgress, [0, 0.5], [0, 100]);

  return (
    <div ref={containerRef} className="min-h-screen bg-[#FAF9F6] selection:bg-aura-gold selection:text-white overflow-x-hidden font-body">

      {/* Immersive Navigation */}
      <nav className="fixed top-0 w-full z-50 px-10 py-8 flex items-center justify-between backdrop-blur-sm bg-[#FAF9F6]/10">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-3"
        >
          <div className="w-10 h-10 rounded-xl bg-aura-charcoal shadow-2xl overflow-hidden">
            <img src="/aura-logo.png" alt="Aura Logo" className="w-full h-full object-cover" />
          </div>
          <span className="text-2xl font-serif italic tracking-tighter text-aura-charcoal">Aura.</span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-12"
        >
          <div className="hidden md:flex gap-10">
            {['Strategy', 'Logic', 'Intelligence'].map((item) => (
              <a key={item} href={`#${item.toLowerCase()}`} className="text-[10px] font-black uppercase tracking-[0.4em] text-aura-charcoal/40 hover:text-aura-charcoal transition-colors">
                {item}
              </a>
            ))}
          </div>
          <Link href="/login" className="px-8 py-4 rounded-2xl bg-aura-charcoal text-white text-[11px] font-black uppercase tracking-[0.2em] shadow-2xl hover:scale-105 transition-all active:scale-95">
            Identify
          </Link>
        </motion.div>
      </nav>

      {/* Cinematic Hero Section */}
      <section className="relative h-screen flex items-center justify-center px-10 overflow-hidden">
        <motion.div
          style={{ scale: heroScale, opacity: heroOpacity }}
          className="absolute inset-0 z-0"
        >
          <Image
            src="/landing-hero.png"
            alt="Aura Cinematic Hero"
            fill
            className="object-cover opacity-90"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#FAF9F6]/20 to-[#FAF9F6]" />
        </motion.div>

        <motion.div
          style={{ y: heroTextY }}
          className="relative z-10 text-center max-w-5xl space-y-12"
        >
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-white/10 backdrop-blur-3xl border border-white/20 shadow-2xl"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-aura-gold animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-aura-charcoal/60">Neural Synchronization Active</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-[120px] md:text-[180px] font-serif italic text-aura-charcoal leading-[0.8] tracking-tighter"
          >
            Aura<span className="text-aura-gold">.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="text-2xl md:text-3xl font-serif italic text-aura-charcoal/60 max-w-2xl mx-auto"
          >
            Experience the world's most sophisticated executive environment. Orchestrate your reality with crystalline logic.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="flex flex-col md:flex-row items-center justify-center gap-8 pt-12"
          >
            <Link href="/login" className="px-12 py-6 rounded-[32px] bg-aura-charcoal text-white text-[13px] font-black uppercase tracking-[0.3em] shadow-2xl hover:scale-105 transition-all group overflow-hidden relative">
              <span className="relative z-10">Request Access</span>
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"
              />
            </Link>
            <div className="flex items-center gap-3">
              <span className="text-[11px] font-black uppercase tracking-[0.3em] text-aura-charcoal/30">Protocol v1.0.4</span>
              <div className="w-12 h-px bg-aura-charcoal/10" />
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 text-aura-charcoal/20"
        >
          <ChevronDown size={32} />
        </motion.div>
      </section>

      {/* Philosophy Section */}
      <section className="py-60 px-10 relative">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-32 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-12"
          >
            <h2 className="text-8xl font-serif italic text-aura-charcoal tracking-tighter leading-tight">
              Crystalline <br /> Logic<span className="text-aura-gold">.</span>
            </h2>
            <p className="text-xl font-medium text-aura-charcoal/50 leading-relaxed max-w-lg italic">
              Aura is not an application. It is a neural extension. Designed for those whose time is the currency of reality, we provide the ultimate strategic vault for manifestations.
            </p>
            <div className="grid grid-cols-2 gap-12 pt-8">
              {[
                { label: "Temporal Accuracy", val: "99.9%" },
                { label: "Neural Latency", val: "<2ms" }
              ].map((stat, i) => (
                <div key={i} className="space-y-2">
                  <div className="text-4xl font-serif italic font-black text-aura-gold">{stat.val}</div>
                  <div className="text-[10px] font-black uppercase tracking-[0.3em] text-aura-charcoal/20">{stat.label}</div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative aspect-square rounded-[80px] overflow-hidden shadow-2xl rotate-3"
          >
            <Image
              src="/login-bg.png"
              alt="Architecture"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-aura-charcoal/10 backdrop-blur-[2px]" />
          </motion.div>
        </div>
      </section>

      {/* Core Vectors Grid */}
      <section className="py-60 bg-aura-charcoal text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <Image src="/dashboard-bg.png" alt="Grid" fill className="object-cover" />
        </div>

        <div className="max-w-7xl mx-auto px-10 relative z-10">
          <header className="mb-32 text-center space-y-8">
            <h2 className="text-7xl font-serif italic tracking-tighter leading-tight">Elite Orchestration.</h2>
            <p className="text-white/40 text-xl max-w-xl mx-auto italic">Discrete, powerful, and impeccably designed for the modern intellectual.</p>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              { icon: Target, title: "Objectives", desc: "Define trajectories. Calibrate long-term manifestations with precision." },
              { icon: Calendar, title: "Temporal", desc: "Chronological synchronization across all your life dimensions." },
              { icon: Brain, title: "The Vault", desc: "A secure sanctuary for engrams, impulses, and visionary logic." }
            ].map((vector, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -20 }}
                className="p-16 rounded-[64px] bg-white/5 border border-white/10 backdrop-blur-3xl hover:bg-white/10 transition-all group"
              >
                <vector.icon size={24} className="text-aura-gold mb-12 group-hover:scale-125 transition-transform" />
                <h3 className="text-3xl font-serif italic font-black mb-6 tracking-tight">{vector.title}</h3>
                <p className="text-white/40 text-sm font-medium leading-relaxed italic">{vector.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="py-60 px-10 text-center relative">
        <div className="max-w-4xl mx-auto space-y-16">
          <div className="w-px h-32 bg-gradient-to-t from-aura-gold to-transparent mx-auto" />
          <h2 className="text-[100px] md:text-[140px] font-serif italic text-aura-charcoal leading-[0.8] tracking-tighter">
            Manifest<br />Reality<span className="text-aura-gold">.</span>
          </h2>
          <p className="text-2xl font-serif italic text-aura-charcoal/40 max-w-2xl mx-auto">The trajectory of your future begins with a single synchronization. Step into the Aura.</p>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link href="/login" className="inline-block px-20 py-8 rounded-[40px] bg-aura-charcoal text-white text-[15px] font-black uppercase tracking-[0.4em] shadow-2xl">
              Initialize System
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 border-t border-black/[0.03] px-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12">
          <div className="flex items-center gap-3">
            <Sparkles className="text-aura-gold" size={16} />
            <span className="text-lg font-serif italic text-aura-charcoal">Aura Executive</span>
          </div>
          <div className="flex gap-12">
            {['Privacy', 'Legal', 'Infrastructure'].map(item => (
              <span key={item} className="text-[9px] font-black uppercase tracking-[0.3em] text-aura-charcoal/20 hover:text-aura-charcoal cursor-pointer transition-colors">
                {item}
              </span>
            ))}
          </div>
          <p className="text-[9px] font-black uppercase tracking-[0.3em] text-aura-charcoal/10">© 2026 Collective Intelligence</p>
        </div>
      </footer>

      {/* Global Ambient System Gradients */}
      <div className="fixed top-0 right-0 w-[50%] h-[50%] bg-aura-gold/5 rounded-full blur-[200px] pointer-events-none -z-10" />
      <div className="fixed bottom-0 left-0 w-[40%] h-[40%] bg-aura-charcoal/5 rounded-full blur-[180px] pointer-events-none -z-10" />
    </div>
  );
}
