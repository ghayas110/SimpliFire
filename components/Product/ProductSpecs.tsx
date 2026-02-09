"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ProductSpecsProps {
  specifications: Record<string, string>;
  downloads: { name: string; url: string }[];
}

export default function ProductSpecs({ specifications, downloads }: ProductSpecsProps) {
  const [activeTab, setActiveTab] = useState<"specs" | "downloads">("specs");

  return (
    <div className="w-full space-y-8 rounded-3xl border border-neutral-200 bg-white/50 p-6 backdrop-blur-xl md:p-8">
      {/* Tabs */}
      <div className="flex gap-8 border-b border-neutral-200 pb-4">
        <button
          onClick={() => setActiveTab("specs")}
          className={`relative pb-4 text-sm font-medium transition-colors ${
            activeTab === "specs" ? "text-neutral-900" : "text-neutral-500 hover:text-neutral-700"
          }`}
        >
          Specifications
          {activeTab === "specs" && (
            <motion.div
              layoutId="activeTab"
              className="absolute bottom-[-17px] left-0 right-0 h-0.5 bg-neutral-900"
            />
          )}
        </button>
        <button
          onClick={() => setActiveTab("downloads")}
          className={`relative pb-4 text-sm font-medium transition-colors ${
            activeTab === "downloads" ? "text-neutral-900" : "text-neutral-500 hover:text-neutral-700"
          }`}
        >
          Downloads & Manuals
          {activeTab === "downloads" && (
            <motion.div
              layoutId="activeTab"
              className="absolute bottom-[-17px] left-0 right-0 h-0.5 bg-neutral-900"
            />
          )}
        </button>
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        {activeTab === "specs" ? (
          <motion.div
            key="specs"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid gap-x-12 gap-y-6 sm:grid-cols-2 md:grid-cols-3"
          >
            {Object.entries(specifications).map(([key, value]) => (
              <div key={key} className="space-y-1">
                <dt className="text-xs font-medium uppercase tracking-wider text-neutral-500">
                  {key.replace(/([A-Z])/g, " $1").trim()}
                </dt>
                <dd className="text-sm font-medium text-neutral-900">{value}</dd>
              </div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="downloads"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid gap-4 sm:grid-cols-2 md:grid-cols-3"
          >
            {downloads.map((item, index) => (
              <a
                key={index}
                href={item.url}
                className="group flex items-center justify-between rounded-xl border border-neutral-200 bg-white p-4 transition-all hover:border-orange-500/30 hover:shadow-lg hover:shadow-orange-500/10"
              >
                <span className="font-medium text-neutral-900">{item.name}</span>
                <span className="text-neutral-400 transition-colors group-hover:text-orange-500">
                  ↓
                </span>
              </a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
