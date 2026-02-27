"use client";

import React from "react";
import { useTheme } from "@/context/ThemeContext";
import { Moon, Sun, Type, Palette, Monitor } from "lucide-react";
import { motion } from "framer-motion";
import clsx from "clsx";

export default function AdminSettingsPage() {
  const { theme, fontSize, setTheme, setFontSize, toggleTheme } = useTheme();

  const themes: { id: "light" | "dark"; icon: any; label: string }[] = [
    { id: "light", icon: Sun, label: "Light Mode" },
    { id: "dark", icon: Moon, label: "Dark Mode" },
  ];

  const fontSizes: { id: "sm" | "base" | "lg"; label: string; px: string }[] = [
    { id: "sm", label: "Small", px: "14px" },
    { id: "base", label: "Default", px: "16px" },
    { id: "lg", label: "Large", px: "18px" },
  ];

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-12">
      <div>
        <h1 className="text-4xl font-light tracking-tight mb-2">Portal Settings</h1>
        <p className="text-muted">Personalize your admin dashboard experience and appearance.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Appearance Section */}
        <section className="space-y-6">
          <div className="flex items-center gap-3 mb-2">
            <Palette className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-medium">Appearance</h2>
          </div>
          
          <div className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-4">
            <p className="text-sm font-medium">Dashboard Theme</p>
            <div className="grid grid-cols-2 gap-3">
              {themes.map((t) => {
                const Icon = t.icon;
                const isActive = theme === t.id;
                
                return (
                  <button
                    key={t.id}
                    onClick={() => setTheme(t.id)}
                    className={clsx(
                      "flex flex-col items-center gap-3 p-4 rounded-xl border transition-all duration-300",
                      isActive 
                        ? "border-primary bg-primary/5 text-primary ring-1 ring-primary/20" 
                        : "border-border hover:border-neutral-300 bg-neutral-50/50"
                    )}
                  >
                    <Icon className="w-6 h-6" />
                    <span className="text-xs font-medium">{t.label}</span>
                  </button>
                );
              })}
            </div>
            
            <div className="pt-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Auto Switch</p>
                <p className="text-xs text-muted">Sync with system preferences</p>
              </div>
              <div className="w-12 h-6 bg-neutral-200 dark:bg-neutral-800 rounded-full cursor-not-allowed opacity-50 relative">
                <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm" />
              </div>
            </div>
          </div>
        </section>

        {/* Typography Section */}
        <section className="space-y-6">
          <div className="flex items-center gap-3 mb-2">
            <Type className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-medium">Typography</h2>
          </div>
          
          <div className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-6">
            <div>
              <p className="text-sm font-medium mb-4">Base Font Size</p>
              <div className="flex items-center justify-between gap-2 p-1 bg-neutral-100/50 dark:bg-neutral-800/50 rounded-xl border border-border">
                {fontSizes.map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setFontSize(f.id)}
                    className={clsx(
                      "flex-1 py-2 px-3 rounded-lg text-xs font-medium transition-all duration-300",
                      fontSize === f.id 
                        ? "bg-white dark:bg-neutral-700 shadow-sm text-foreground border border-border" 
                        : "text-muted hover:text-foreground"
                    )}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-4 bg-neutral-50 dark:bg-neutral-900/50 rounded-xl border border-border">
              <p className="text-xs text-muted mb-2 uppercase tracking-widest font-bold">Preview</p>
              <p className={clsx(
                "font-sans transition-all duration-300",
                fontSize === 'sm' ? "text-sm" : fontSize === 'base' ? "text-base" : "text-lg"
              )}>
                The quick brown fox jumps over the lazy dog. 
                <span className="block mt-1 text-primary">SimpliFire Premium Interface.</span>
              </p>
            </div>
          </div>
        </section>
      </div>

      {/* Advanced / System Info */}
      <section className="pt-12 border-t border-border">
        <div className="flex items-center gap-4 text-muted">
          <Monitor className="w-5 h-5" />
          <div className="text-xs">
            <p>System Version: 2.4.0 (Electric)</p>
            <p className="mt-0.5">Device Persistence: Enabled (LocalStorage)</p>
          </div>
        </div>
      </section>
    </div>
  );
}
