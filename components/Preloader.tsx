"use client";

import React, { useEffect, useState } from "react";
import { useImageSequence } from "@/context/ImageSequenceContext";
import { motion, AnimatePresence } from "framer-motion";

export default function Preloader() {
  const { progress, isLoaded } = useImageSequence();
  const [show, setShow] = useState(true);

  useEffect(() => {
    if (isLoaded) {
      // Delay hiding to allow 100% to be seen briefly
      const timer = setTimeout(() => setShow(false), 500);
      return () => clearTimeout(timer);
    }
  }, [isLoaded]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[linear-gradient(135deg,#FDFCF8_0%,#FFF8F0_50%,#F5EFE6_100%)] text-[#582F0E]"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.8, ease: "easeInOut" } }}
        >
          <div className="w-64 space-y-4">
            <div className="flex justify-between text-sm uppercase tracking-widest text-[#582F0E]/70">
              <motion.img 
                src="/logo.png" 
                alt="SimpliFire" 
                className="h-8 w-auto object-contain"
                initial={{ opacity: 0, y: 10, filter: "blur(10px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              />
              <span>{progress}%</span>
            </div>
            
            <div className="relative h-[2px] w-full bg-[#582F0E]/10 overflow-hidden">
              <motion.div
                className="absolute left-0 top-0 h-full bg-[#582F0E]"
                initial={{ width: "0%" }}
                animate={{ width: `${progress}%` }}
                transition={{ ease: "linear", duration: 0.1 }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
