"use client";

import React from "react";

export default function SortDropdown() {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-bold uppercase tracking-wider text-neutral-500">
        Sort Products By:
      </span>
      <div className="relative">
        <select className="appearance-none rounded-lg border border-neutral-200 bg-white py-2 pl-4 pr-10 text-sm font-medium text-neutral-900 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500">
          <option>Recommended</option>
          <option>Price: Low to High</option>
          <option>Price: High to Low</option>
          <option>Newest Arrivals</option>
          <option>Best Selling</option>
        </select>
        <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
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
            className="text-neutral-500"
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
        </div>
      </div>
    </div>
  );
}
