"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark";
type FontSize = "sm" | "base" | "lg";

interface ThemeContextType {
  theme: Theme;
  fontSize: FontSize;
  setTheme: (theme: Theme) => void;
  setFontSize: (size: FontSize) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("light");
  const [fontSize, setFontSize] = useState<FontSize>("base");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Load persisted settings
    const savedTheme = localStorage.getItem("admin-theme") as Theme;
    const savedFontSize = localStorage.getItem("admin-font-size") as FontSize;

    if (savedTheme) setTheme(savedTheme);
    if (savedFontSize) setFontSize(savedFontSize);
    
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    
    // Apply theme and font size to document
    const root = window.document.documentElement;
    root.setAttribute("data-theme", theme);
    
    // Manage class for Tailwind if needed (though we use data-theme in globals.css)
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }

    // Apply font size class
    root.classList.remove("text-sm", "text-base", "text-lg");
    root.classList.add(`text-\${fontSize}`);

    localStorage.setItem("admin-theme", theme);
    localStorage.setItem("admin-font-size", fontSize);
  }, [theme, fontSize, mounted]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <ThemeContext.Provider value={{ theme, fontSize, setTheme, setFontSize, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
