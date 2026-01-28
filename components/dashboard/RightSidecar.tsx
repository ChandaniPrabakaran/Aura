"use client";

import { motion } from "framer-motion";
import { Plus, ArrowRight, ShieldCheck, Sparkles } from "lucide-react";

export default function RightSidecar() {
    return (
        <aside className="w-[480px] hidden xl:flex flex-col bg-[#000000] p-12 gap-10 overflow-y-auto no-scrollbar flex-shrink-0">

            {/* Temporal Void Card */}
            <div className="flex-1 rounded-[80px] bg-white flex flex-col items-center justify-between p-12 relative overflow-hidden shadow-2xl">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.03]">
                    <Sparkles size={250} />
                </div>

                <div className="w-full flex justify-center pt-8">
                    <span className="text-[10px] font-black uppercase tracking-[0.5em] text-aura-text-gray/50">Temporal Void</span>
                </div>

                <div className="w-full">
                    <button className="w-full py-10 px-12 bg-[#F8F9FB] rounded-[50px] border border-aura-border text-[12px] font-black uppercase tracking-[0.2em] text-aura-charcoal flex items-center justify-center gap-4 hover:bg-white hover:shadow-xl transition-all group">
                        <Plus size={20} className="text-aura-text-gray/40 group-hover:text-aura-indigo transition-colors" />
                        <span>New Directive</span>
                    </button>
                </div>
            </div>

            {/* Core Guardian Card */}
            <div className="h-[480px] rounded-[80px] bg-white p-16 flex flex-col justify-between group shadow-2xl relative overflow-hidden flex-shrink-0">
                <div className="flex items-center gap-4 text-aura-indigo">
                    <ShieldCheck size={28} className="opacity-80" />
                    <span className="text-[11px] font-black uppercase tracking-[0.3em]">Core Guardian</span>
                </div>

                <p className="text-[26px] font-medium leading-[1.5] text-aura-text-gray/30 italic pr-6 group-hover:text-aura-charcoal transition-colors duration-500">
                    "Aura balances your temporal paths with a 60-min neural buffer. Alerts will manifest via Workspace Hub."
                </p>

                <div className="flex items-end justify-between">
                    <div className="flex flex-col">
                        <span className="text-8xl font-black tracking-tighter text-aura-indigo/10 group-hover:text-aura-indigo/20 transition-all">16.1%</span>
                        <span className="text-[12px] font-black uppercase tracking-[0.3em] text-[#5C5CFF] ml-1">Protected</span>
                    </div>
                    <motion.div
                        whileHover={{ x: 10 }}
                        className="w-16 h-16 rounded-full border border-aura-border flex items-center justify-center text-aura-text-gray/30 group-hover:text-aura-indigo group-hover:border-aura-indigo transition-all cursor-pointer"
                    >
                        <ArrowRight size={28} />
                    </motion.div>
                </div>
            </div>
        </aside>
    );
}
