"use client";

import React from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useComparison } from "@/context/ComparisonContext";
import { X, ArrowRight } from "lucide-react";

export default function ComparisonBar() {
  const { comparisonList, removeFromCompare, clearComparison } = useComparison();

  return (
    <AnimatePresence>
      {comparisonList.length > 0 && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-0 left-0 right-0 z-40 border-t border-neutral-200 bg-white/90 shadow-lg backdrop-blur-md"
        >
          <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
            <div className="flex items-center gap-6">
              <div className="flex -space-x-4">
                {comparisonList.map((item) => (
                  <div
                    key={item.id}
                    className="relative h-12 w-12 overflow-hidden rounded-full border-2 border-white bg-neutral-100"
                  >
                    {/* Tiny X to remove specific item */}
                    <button 
                        onClick={() => removeFromCompare(item.id)}
                        className="absolute inset-0 z-10 hidden items-center justify-center bg-black/50 text-white hover:bg-black/70 group-hover:flex"
                    >
                        <X size={12} />
                    </button>
                    {/* Actual Image */}
                    {item.image && (
                         <img src={item.image} alt={item.title} className="h-full w-full object-cover" />
                    )}
                  </div>
                ))}
              </div>
              <div className="text-sm">
                <span className="font-bold text-neutral-900">
                  {comparisonList.length}
                </span>{" "}
                {comparisonList.length === 1 ? "Product" : "Products"} Selected
              </div>
              <button
                onClick={clearComparison}
                className="text-xs text-neutral-500 hover:text-neutral-900 underline"
              >
                Clear All
              </button>
            </div>

            <Link
              href="/compare"
              className={`flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-bold text-white transition-all ${
                comparisonList.length > 1
                  ? "bg-neutral-900 hover:bg-neutral-800"
                  : "cursor-not-allowed bg-neutral-300"
              }`}
              onClick={(e) => {
                 if (comparisonList.length < 2) e.preventDefault();
              }}
            >
              Compare Now <ArrowRight size={16} />
            </Link>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
