"use client";

import React, { useState, useEffect } from "react";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const { scrollY } = useScroll();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 50);
  });

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-[#FDFCF8]/90 backdrop-blur-md border-b border-[#582F0E]/10 py-4 shadow-sm"
          : "bg-transparent py-6"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
        {/* Logo */}
        <div className={`text-2xl font-light tracking-wider transition-colors ${isScrolled ? "text-[#582F0E]" : "text-white"}`}>
          SIMPLI<span className="font-bold">FIRE</span>
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center space-x-8">
          {["Collections", "Technology", "Inspiration", "Support"].map((item) => (
            <a
              key={item}
              href="#"
              className={`text-sm font-medium transition-colors ${
                isScrolled 
                  ? "text-[#432818]/80 hover:text-[#582F0E]" 
                  : "text-zinc-300 hover:text-white"
              }`}
            >
              {item}
            </a>
          ))}
        </div>

        {/* CTA Button */}
        <div className="hidden md:block">
          <button className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all ${
            isScrolled
              ? "bg-[#582F0E] text-white hover:bg-[#432818]"
              : "bg-white text-black hover:bg-zinc-200"
          }`}>
            Get Started
          </button>
        </div>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`p-2 transition-colors ${isScrolled ? "text-[#582F0E]" : "text-white"}`}
          >
            {isMobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="md:hidden bg-[#FDFCF8]/95 backdrop-blur-xl border-t border-[#582F0E]/10"
        >
          <div className="flex flex-col p-6 space-y-4">
            {["Collections", "Technology", "Inspiration", "Support"].map(
              (item) => (
                <a
                  key={item}
                  href="#"
                  className="text-lg font-medium text-[#432818] hover:text-[#582F0E]"
                >
                  {item}
                </a>
              )
            )}
            <button className="mt-4 w-full px-6 py-3 rounded-full bg-[#582F0E] text-white font-semibold">
              Get Started
            </button>
          </div>
        </motion.div>
      )}
    </motion.nav>
  );
}
