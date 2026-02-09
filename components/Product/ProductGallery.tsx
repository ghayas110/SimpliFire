"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

interface ProductGalleryProps {
  images: string[];
}

export default function ProductGallery({ images }: ProductGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(0);

  // Fallback if no images provided
  const displayImages = images.length > 0 ? images : ["/placeholder-fireplace.jpg"];

  return (
    <div className="flex flex-col gap-4">
      <div className="relative aspect-square w-full overflow-hidden rounded-2xl border border-white/20 bg-white/5 shadow-2xl backdrop-blur-sm">
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedImage}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="relative h-full w-full"
          >
            {/* Using a placeholder for now as we don't have actual images in the public folder yet */}
            <div className="absolute inset-0 flex items-center justify-center bg-neutral-900/50 text-white/50">
               <span className="text-lg">Image {selectedImage + 1} Placeholder</span>
               {/* 
               <Image 
                 src={displayImages[selectedImage]} 
                 alt={`Product View ${selectedImage + 1}`}
                 fill
                 className="object-cover"
                 priority
               />
               */}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-2">
        {displayImages.map((img, index) => (
          <button
            key={index}
            onClick={() => setSelectedImage(index)}
            className={`relative aspect-square w-20 flex-shrink-0 overflow-hidden rounded-xl border transition-all duration-300 ${
              selectedImage === index
                ? "border-orange-500 ring-2 ring-orange-500/20"
                : "border-white/10 opacity-60 hover:opacity-100"
            }`}
          >
             <div className="absolute inset-0 flex items-center justify-center bg-neutral-800 text-xs text-white/30">
              Thumb {index + 1}
              {/*
              <Image 
                src={img} 
                alt={`Thumbnail ${index + 1}`}
                fill
                className="object-cover"
              />
              */}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
