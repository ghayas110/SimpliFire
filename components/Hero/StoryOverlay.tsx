"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";

interface StoryOverlayProps {
  scrollProgress: number; // 0 to 1
}

// Define stages based on scroll percentage ranges
const stages = [
  {
    id: "establish",
    range: [0, 0.12],
    heading: "From Spark to Centerpiece",
    subtext: "Redefining the heart of the home with Hearth & Home Technologies.",
    position: "left",
  },
  {
    id: "glow",
    range: [0.13, 0.25],
    heading: "Ignite the Atmosphere",
    subtext: "Intense glow. Digital realism. A multitude of lighting themes at your command.",
    position: "right",
  },
  {
    id: "connection",
    range: [0.26, 0.38],
    heading: "Gather Round",
    subtext: "Cozy conversations and elevated experiences, without the need for gas lines or venting.",
    position: "left",
  },
  {
    id: "control",
    range: [0.39, 0.52],
    heading: "Effortless Control",
    subtext: "Adjust heat and hue instantly with the Intuitive Remote or Smart App.",
    position: "right",
  },
  {
    id: "inception",
    range: [0.53, 0.66],
    heading: "The Inception Difference",
    subtext: "Digital Fire aesthetics that merge modern design with authentic ambiance.",
    position: "left",
  },
  {
    id: "safety",
    range: [0.67, 0.82],
    heading: "Safe. Silent. Serene.",
    subtext: "Whisper-quiet warmth that is safe for paws and perfect for peace of mind.",
    position: "right",
  },
  {
    id: "brand",
    range: [0.83, 1.0],
    heading: "SimpliFire Your Space",
    subtext: "Modern design. Timeless comfort.",
    cta: "Discover the Collection",
    position: "left",
  },
];

export default function StoryOverlay({ scrollProgress }: StoryOverlayProps) {
  // Find active stage
  const activeStage = stages.find(
    (stage) => scrollProgress >= stage.range[0] && scrollProgress <= stage.range[1]
  );

  return (
    <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center p-8 md:p-20">
      <AnimatePresence mode="wait">
        {activeStage && (
          <motion.div
            key={activeStage.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className={`flex w-full max-w-7xl ${
              activeStage.position === "center"
                ? "justify-center text-center"
                : activeStage.position === "left"
                ? "justify-start text-left"
                : "justify-end text-right"
            }`}
          >
            <div className={`max-w-2xl space-y-4 ${
               activeStage.position !== "center" 
                 ? "bg-white/60 backdrop-blur-xl p-10 rounded-3xl border border-white/20 shadow-2xl" 
                 : "bg-white/50 backdrop-blur-xl p-10 rounded-3xl border border-white/20 shadow-2xl"
            }`}>
              <h1 
                className="text-3xl font-light leading-tight md:text-4xl lg:text-5xl" 
                style={{ color: "#582F0E" }}
              >
                {activeStage.heading}
              </h1>
              
              <p 
                className="text-base font-medium leading-relaxed md:text-lg lg:text-xl" 
                style={{ color: "#432818" }}
              >
                {activeStage.subtext}
              </p>

              {activeStage.cta && (
                <div className="pointer-events-auto pt-6">
                  <button className="rounded-full bg-[#582F0E] px-8 py-4 text-sm font-medium tracking-wide text-white transition-transform hover:scale-105 active:scale-95 shadow-lg">
                    {activeStage.cta}
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Scroll Indicator */}
      {scrollProgress < 0.95 && (
        <motion.div 
          className="absolute bottom-10 left-1/2 -translate-x-1/2 text-xs uppercase tracking-widest"
          style={{ color: "#582F0E" }}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          Scroll to Explore
        </motion.div>
      )}
    </div>
  );
}
