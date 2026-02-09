"use client";

import React from "react";
import { Zap, Monitor, Sun } from "lucide-react";
import { motion } from "framer-motion";

const features = [
  {
    icon: <Zap className="h-8 w-8" />,
    title: "No Venting Required",
    description: "Plug-and-play installation eliminates gas lines and construction headaches.",
  },
  {
    icon: <Monitor className="h-8 w-8" />,
    title: "Digital Artistry",
    description: "Inception line reflex technology creates depth and realism unmatched by competitors.",
  },
  {
    icon: <Sun className="h-8 w-8" />,
    title: "Year-Round Ambiance",
    description: "Operate the mesmerizing flames with or without heat for enjoyment in any season.",
  },
];

export default function FeaturesSection() {
  return (
    <section className="px-6 py-24 md:px-12 md:py-32">
      <div className="mx-auto max-w-7xl">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-20 text-center max-w-4xl mx-auto"
        >
          <h2 className="text-3xl md:text-5xl font-light text-[#582F0E] mb-6 leading-tight">
            Use the Quick and Easy way to Add Fire to your Favorite room.
          </h2>
          <p className="text-lg md:text-xl text-[#432818]/80 leading-relaxed">
            SimpliFire Electric Fireplaces provide the warmth and coziness of a fireplace without the need for gas lines or venting. Elevated style shines through with the sleek and modern design, multitude of flame and ember bed lighting themes.
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid gap-8 md:grid-cols-3"
        >
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative overflow-hidden rounded-2xl border border-white/40 bg-white/40 p-10 transition-all duration-500 hover:border-white/60 hover:bg-white/70 backdrop-blur-xl hover:shadow-xl hover:-translate-y-1"
            >
              <div className="mb-6 flex items-center justify-center rounded-full bg-[#582F0E]/10 p-4 transition-transform group-hover:scale-110 group-hover:bg-[#582F0E]/20 text-[#582F0E]">
                {feature.icon}
              </div>
              <h3 className="mb-3 text-2xl font-light text-[#582F0E]">{feature.title}</h3>
              <p className="text-[#432818]/70 group-hover:text-[#432818] transition-colors leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
