"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Product } from "@/data/collectionData";
import { useComparison } from "@/context/ComparisonContext";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCompare, removeFromCompare, isInComparison } = useComparison();
  const isComparing = isInComparison(product.id);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group relative flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm transition-all hover:shadow-xl hover:shadow-orange-500/10"
    >
      {/* Image Area */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-neutral-100">
        <Link href={`/product/${product.id}`} className="block h-full w-full">
          <Image
            src={product.image} // Will use placeholder if image not found
            alt={product.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </Link>
        
        {/* Badges */}
        <div className="pointer-events-none absolute left-4 top-4 flex flex-col gap-2">
          {product.badges.map((badge) => (
            <span
              key={badge}
              className={`rounded px-3 py-1 text-xs font-bold uppercase tracking-wider text-white shadow-sm ${
                badge === "Free Fire Glass"
                  ? "bg-green-600"
                  : badge === "Top Pick"
                  ? "bg-orange-500"
                  : "bg-neutral-900"
              }`}
            >
              {badge}
            </span>
          ))}
        </div>

        {/* Compare Button */}
        <button 
          onClick={(e) => {
             e.preventDefault(); 
             isComparing ? removeFromCompare(product.id) : addToCompare(product);
          }}
          className={`absolute right-14 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-full backdrop-blur-sm transition-all ${
            isComparing ? "bg-orange-600 text-white" : "bg-white/80 text-neutral-600 hover:bg-white hover:text-orange-500"
          }`}
          title={isComparing ? "Remove from comparison" : "Add to comparison"}
        >
           <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m7 15 5 5 5-5"/><path d="m7 9 5-5 5 5"/></svg>
        </button>

        {/* Wishlist Button */}
        <button className="absolute right-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/80 text-neutral-600 backdrop-blur-sm transition-all hover:bg-white hover:text-red-500">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
          </svg>
        </button>

        {/* Customization Options Banner */}
        <Link href={`/product/${product.id}`} className="absolute bottom-0 left-0 right-0 bg-neutral-900/80 py-2 text-center backdrop-blur-sm transition-colors hover:bg-neutral-900">
           <span className="flex items-center justify-center gap-2 text-xs font-medium text-white">
             <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
             Customization Options
           </span>
        </Link>
      </div>

      {/* Content Area */}
      <div className="flex flex-1 flex-col p-4">
        <Link 
          href={`/product/${product.id}`}
          className="mb-4 block w-full rounded border border-green-600 py-2 text-center text-sm font-bold text-green-600 transition-colors hover:bg-green-50"
        >
          Customize To Purchase
        </Link>

        <div className="mb-2">
            <span className="text-xs font-semibold uppercase text-neutral-400">Starting at</span>
            <div className="text-xl font-bold text-green-700">
                ${product.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
        </div>

        <Link href={`/product/${product.id}`} className="group mb-1 block">
             <h3 className="font-medium text-neutral-900 group-hover:text-orange-600">
                {product.title}
             </h3>
        </Link>
        <p className="mb-3 text-sm italic text-neutral-500">by {product.brand}</p>

        {/* Rating */}
        <div className="mb-3 flex items-center gap-1">
             <div className="flex text-orange-400">
                 {[...Array(5)].map((_, i) => (
                     <svg key={i} xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill={i < Math.floor(product.rating) ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={i < Math.floor(product.rating) ? "" : "text-neutral-300"}>
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                     </svg>
                 ))}
             </div>
             <span className="text-xs text-neutral-400">({product.reviewCount})</span>
        </div>

        <div className="mt-auto border-t border-neutral-100 pt-3">
             <p className="text-xs text-neutral-400">ITEM #{product.sku}</p>
             {product.isFreeShipping && (
                 <div className="mt-2 flex items-center gap-2 text-sm font-bold text-neutral-700">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600"><path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/><path d="M15 18H9"/><path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14"/><circle cx="17" cy="18" r="2"/><circle cx="7" cy="18" r="2"/></svg>
                      <span className="text-green-600">FREE</span> Shipping
                 </div>
             )}
        </div>
      </div>
    </motion.div>
  );
}
