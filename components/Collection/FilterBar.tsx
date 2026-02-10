"use client";

import React from "react";
import { motion } from "framer-motion";

const filters = [
  "On Sale",
  "Brand",
  "Price",
  "Type",
  "Style",
  "Fuel Type",
  "Efficiency",
  "Certification",
];

export default function FilterBar() {
  return (
    <div className="flex w-full items-center gap-4 py-4">
      <div className="flex-1 overflow-x-auto">
        <div className="flex min-w-max gap-3 pb-2">
          {filters.map((filter) => (
            <button
              key={filter}
              className="flex items-center gap-2 rounded-lg border border-neutral-200 bg-white px-4 py-2 text-sm font-medium text-neutral-700 transition-all hover:border-neutral-300 hover:bg-neutral-50 active:scale-95"
            >
              {filter}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="opacity-50"
              >
                <path d="m6 9 6 6 6-6" />
              </svg>
            </button>
          ))}
        </div>
      </div>
      
      <button className="flex flex-shrink-0 items-center gap-2 rounded-full border border-neutral-200 bg-white px-6 py-2 text-sm font-medium text-neutral-700 shadow-sm transition-all hover:bg-neutral-50 hover:shadow-md active:scale-95">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="4" x2="20" y1="12" y2="12" />
          <line x1="4" x2="20" y1="6" y2="6" />
          <line x1="4" x2="20" y1="18" y2="18" />
        </svg>
        All Filters
      </button>
    </div>
  );
}
