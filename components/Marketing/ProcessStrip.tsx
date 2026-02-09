"use client";

import React from "react";
import { motion } from "framer-motion";
import { MousePointerClick, Wrench, Plug, Flame } from "lucide-react";

const steps = [
  { icon: <MousePointerClick />, title: "Select", desc: "Choose your model." },
  { icon: <Wrench />, title: "Install", desc: "Mount or recess." },
  { icon: <Plug />, title: "Plug In", desc: "Standard 120V outlet." },
  { icon: <Flame />, title: "Experience", desc: "Instant ambiance." },
];

export default function ProcessStrip() {
  return (
    <section className="px-6 py-24 md:py-32">
      <div className="mx-auto max-w-7xl">
        <div className="mb-16 text-center">
          <h2 className="text-sm uppercase tracking-widest text-[#582F0E]/70 font-semibold">The SimpliFire Way</h2>
          <p className="mt-2 text-3xl font-light text-[#582F0E]">4 Steps to Comfort</p>
        </div>

        <div className="relative flex flex-col justify-between gap-8 md:flex-row">
          {/* Connecting Line (Desktop) */}
          <div className="absolute top-8 hidden h-0.5 w-full bg-[#582F0E]/20 md:block" />
          
          {steps.map((step, index) => (
            <div key={index} className="relative z-10 flex flex-1 flex-col items-center text-center">
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2, duration: 0.5 }}
                className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-white text-[#582F0E] shadow-xl ring-8 ring-[#FDFCF8]"
              >
                {step.icon}
              </motion.div>
              <h3 className="mb-2 text-lg font-medium text-[#582F0E]">{step.title}</h3>
              <p className="text-sm text-[#432818]/70">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
