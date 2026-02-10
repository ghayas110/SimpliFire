import React from "react";
import Navbar from "@/components/Navbar";
import FilterBar from "@/components/Collection/FilterBar";
import SortDropdown from "@/components/Collection/SortDropdown";
import ProductCard from "@/components/Collection/ProductCard";
import { collectionData } from "@/data/collectionData";

export default function CollectionPage() {
  return (
    <main className="min-h-screen bg-neutral-50 selection:bg-orange-500/30">
      <Navbar />

      <div className="mx-auto max-w-7xl px-4 pt-32 pb-16 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
            <h1 className="mb-4 text-4xl font-light text-neutral-900">Quick Ship Fireplaces</h1>
            <div className="flex items-center gap-2 text-sm font-medium uppercase tracking-wider text-orange-600">
                <span>&lt; FIREPLACE</span>
            </div>
        </div>

        {/* Info Banner */}
        <div className="mb-8 flex items-center gap-4 rounded-xl bg-orange-50 p-4 text-neutral-700">
             <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-orange-500"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
             <span className="font-medium">What are Quick Ship Fireplaces?</span>
        </div>

        {/* Controls */}
        <div className="mb-6 flex flex-col justify-between gap-4 border-b border-neutral-200 pb-4 md:flex-row md:items-end">
            <div className="flex-1">
                <p className="mb-4 text-xs font-bold uppercase tracking-wider text-neutral-500">
                    Filter Products By:
                </p>
                <FilterBar />
            </div>
            <div className="flex flex-col items-end gap-2">
                 <SortDropdown />
                 <span className="text-sm font-bold text-neutral-900">Products ({collectionData.length})</span>
            </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {collectionData.map((product) => (
                <ProductCard key={product.id} product={product} />
            ))}
        </div>
      </div>
    </main>
  );
}
