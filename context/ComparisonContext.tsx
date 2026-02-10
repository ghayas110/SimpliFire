"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface ComparisonItem {
  id: string;
  title: string;
  price: number;
  image: string;
  rating: number;
  [key: string]: any; // Allow other properties for comparison
}

interface ComparisonContextType {
  comparisonList: ComparisonItem[];
  addToCompare: (product: ComparisonItem) => void;
  removeFromCompare: (id: string) => void;
  isInComparison: (id: string) => boolean;
  clearComparison: () => void;
}

const ComparisonContext = createContext<ComparisonContextType | undefined>(
  undefined
);

export function ComparisonProvider({ children }: { children: React.ReactNode }) {
  const [comparisonList, setComparisonList] = useState<ComparisonItem[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load from local storage
  useEffect(() => {
    const saved = localStorage.getItem("simplifire_compare");
    if (saved) {
      try {
        setComparisonList(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse comparison list", e);
      }
    }
    setIsInitialized(true);
  }, []);

  // Save to local storage
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem("simplifire_compare", JSON.stringify(comparisonList));
    }
  }, [comparisonList, isInitialized]);

  const addToCompare = (product: ComparisonItem) => {
    setComparisonList((prev) => {
      if (prev.find((item) => item.id === product.id)) return prev;
      if (prev.length >= 4) {
        // Optional: Alert user or replace oldest
        // For now, simple limit check
         alert("You can only compare up to 4 items.");
         return prev;
      }
      return [...prev, product];
    });
  };

  const removeFromCompare = (id: string) => {
    setComparisonList((prev) => prev.filter((item) => item.id !== id));
  };

  const isInComparison = (id: string) => {
    return comparisonList.some((item) => item.id === id);
  };

  const clearComparison = () => {
    setComparisonList([]);
  };

  return (
    <ComparisonContext.Provider
      value={{
        comparisonList,
        addToCompare,
        removeFromCompare,
        isInComparison,
        clearComparison,
      }}
    >
      {children}
    </ComparisonContext.Provider>
  );
}

export function useComparison() {
  const context = useContext(ComparisonContext);
  if (context === undefined) {
    throw new Error("useComparison must be used within a ComparisonProvider");
  }
  return context;
}
