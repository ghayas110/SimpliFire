"use client";

import React from "react";
import { motion } from "framer-motion";
import { useCart } from "@/context/CartContext";
import { useComparison } from "@/context/ComparisonContext";

interface ProductInfoProps {
  id: string;
  image: string;
  title: string;
  price: number;
  description: string;
  features: string[];
}

export default function ProductInfo({
  id,
  image,
  title,
  price,
  description,
  features,
}: ProductInfoProps) {
  const { addToCart } = useCart();
  const { addToCompare, removeFromCompare, isInComparison } = useComparison();
  const isComparing = isInComparison(id);

  return (
    <div className="flex flex-col gap-8">
      {/* Title & Price */}
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-light text-neutral-900 md:text-4xl"
          >
            {title}
          </motion.h1>
          
          <button 
            onClick={() => isComparing ? removeFromCompare(id) : addToCompare({ id, title, price, image, rating: 0, reviewCount: 0, badges: [], isFreeShipping: true, sku: "", brand: "SimpliFire" })} // mock missing data
            className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full border transition-all ${
              isComparing 
                ? "border-orange-500 bg-orange-500 text-white" 
                : "border-neutral-200 text-neutral-400 hover:border-orange-500 hover:text-orange-500"
            }`}
            title={isComparing ? "Remove from comparison" : "Add to comparison"}
          >
             <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m7 15 5 5 5-5"/><path d="m7 9 5-5 5 5"/></svg>
          </button>
        </div>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-2xl font-light text-orange-600"
        >
          ${price.toFixed(2)}
        </motion.p>
      </div>

      {/* Description */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="prose prose-neutral max-w-none text-neutral-600"
      >
        <p>{description}</p>
      </motion.div>

      {/* Features */}
      <motion.ul 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="space-y-2"
      >
        {features.map((feature, index) => (
          <li key={index} className="flex items-start gap-3 text-neutral-600">
            <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-orange-500" />
            <span>{feature}</span>
          </li>
        ))}
      </motion.ul>

      {/* Actions */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="flex flex-col gap-4 pt-4 sm:flex-row"
      >
        <button 
          onClick={() => addToCart({ id, title, price, image })}
          className="flex-1 rounded-full bg-gradient-to-r from-orange-600 to-red-600 px-8 py-4 font-medium text-white shadow-lg shadow-orange-500/30 transition-all hover:scale-105 hover:shadow-orange-500/50 active:scale-95"
        >
          Add to Cart
        </button>
        <button className="flex-1 rounded-full border border-neutral-200 bg-white px-8 py-4 font-medium text-neutral-900 transition-all hover:border-neutral-300 hover:bg-neutral-50 active:scale-95">
          Contact Support
        </button>
      </motion.div>
    </div>
  );
}
