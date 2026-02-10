"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useComparison } from "@/context/ComparisonContext";
import { useCart } from "@/context/CartContext";
import Navbar from "@/components/Navbar";

export default function ComparisonPage() {
  const { comparisonList, removeFromCompare } = useComparison();
  const { addToCart } = useCart();

  if (comparisonList.length === 0) {
    return (
      <div className="min-h-screen bg-neutral-50 px-4 pt-32 text-center text-neutral-900">
        <Navbar />
        <div className="mx-auto max-w-2xl">
          <h1 className="mb-4 text-3xl font-light text-neutral-900">No products selected</h1>
          <p className="mb-8 text-neutral-500">
            Select products from the collection page to compare them side by side.
          </p>
          <Link
            href="/collections/quick-ship"
            className="rounded-full bg-neutral-900 px-8 py-3 font-medium text-white transition-transform hover:scale-105"
          >
            Browse Collections
          </Link>
        </div>
      </div>
    );
  }

  // Define comparison rows
  // In a real app, these details would come from the product object
  const comparisonRows = [
    { label: "Price", key: "price", type: "price" },
    { label: "Rating", key: "rating", type: "rating" },
    { label: "BTU Output", key: "btu", value: "5,000" }, // Mock data
    { label: "Heating Area", key: "area", value: "400 sq. ft." },
    { label: "Warranty", key: "warranty", value: "2 Year Limited" },
    { label: "Installation", key: "install", value: "DIY Friendly" },
  ];

  return (
    <div className="min-h-screen bg-neutral-50">
      <Navbar />

      <div className="mx-auto max-w-7xl px-6 pt-32 pb-16 md:px-12">
        <div className="mb-12 text-center">
            <h1 className="text-3xl font-light text-neutral-900 md:text-5xl">Compare Products</h1>
            <Link href="/collections/quick-ship" className="mt-4 inline-block text-sm text-neutral-500 hover:text-orange-600">
                &larr; Back to Collection
            </Link>
        </div>

        {/* Comparison Table */}
        <div className="overflow-x-auto rounded-2xl bg-white shadow-xl">
          <table className="w-full min-w-[800px] table-fixed text-left border-collapse">
            <thead>
              <tr className="border-b border-neutral-100">
                <th className="w-48 bg-neutral-50 p-6 text-sm font-bold text-neutral-500 uppercase tracking-wider">Feature</th>
                {comparisonList.map((product) => (
                  <th key={product.id} className="relative p-6 align-top">
                    <button
                        onClick={() => removeFromCompare(product.id)}
                        className="absolute right-4 top-4 text-neutral-300 hover:text-red-500"
                    >
                       <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                    </button>
                    <div className="relative mb-4 aspect-[4/3] w-full overflow-hidden rounded-lg bg-neutral-100">
                         {product.image && (
                            <Image src={product.image} alt={product.title} fill className="object-cover" />
                         )}
                    </div>
                    <Link href={`/product/${product.id}`} className="mb-2 block text-lg font-bold text-neutral-900 hover:text-orange-600">
                        {product.title}
                    </Link>
                    <button 
                        onClick={() => addToCart(product)}
                        className="w-full rounded-full border border-neutral-200 py-2 text-sm font-medium text-neutral-900 transition-colors hover:bg-neutral-900 hover:text-white"
                    >
                        Add to Cart
                    </button>
                  </th>
                ))}
                {/* Empty columns to maintain grid if fewer than 4 items? optional */}
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
               {comparisonRows.map((row) => (
                   <tr key={row.label} className="group hover:bg-neutral-50/50">
                       <td className="bg-neutral-50 p-6 text-sm font-medium text-neutral-500">{row.label}</td>
                       {comparisonList.map((product) => (
                           <td key={product.id} className="p-6 text-neutral-900 font-medium">
                               {row.type === 'price' ? (
                                   `$${product.price.toFixed(2)}`
                               ) : row.type === 'rating' ? (
                                   <div className="flex text-orange-400">
                                      {[...Array(5)].map((_, i) => (
                                          <svg key={i} xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill={i < Math.floor(product.rating) ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={i < Math.floor(product.rating) ? "" : "text-neutral-300"}>
                                             <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                                          </svg>
                                      ))}
                                   </div>
                               ) : (
                                   // Mock values based on product ID parity for variety
                                   product.id.length % 2 === 0 ? row.value : (row.value === "5,000" ? "4,500" : row.value)
                               )}
                           </td>
                       ))}
                   </tr>
               ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
