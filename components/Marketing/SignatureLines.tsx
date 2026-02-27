"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { createClient } from "@/utils/supabase/client";

interface Collection {
  id: string;
  name: string;
  description: string;
  image_url: string | null;
}

const colors = [
  "bg-zinc-200", 
  "bg-zinc-300", 
  "bg-zinc-200",
  "bg-zinc-300",
  "bg-zinc-200",
  "bg-zinc-300",
];

export default function SignatureLines() {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function fetchCollections() {
      try {
        const { data, error } = await supabase
          .from("collections")
          .select("*")
          .order("created_at", { ascending: true }); // Keep a stable order

        if (error) throw error;
        if (data) setCollections(data);
      } catch (err) {
        console.error("Error fetching collections:", err);
      } finally {
        setLoading(false);
      }
    }
    
    fetchCollections();
  }, []);

  return (
    <section className="px-6 py-24 md:px-12">
      <div className="mx-auto max-w-7xl space-y-16">
        <div className="text-center">
          <h2 className="text-3xl font-light text-[#582F0E] md:text-5xl">Signature Collections</h2>
          <p className="mt-4 text-[#432818]/70 text-lg max-w-2xl mx-auto">
            Choose from the most popular lines of the Simplifire Brand.
          </p>
        </div>

        {loading ? (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="aspect-[4/5] w-full animate-pulse rounded-2xl bg-zinc-200" />
            ))}
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {collections.map((collection, index) => {
              const bgClass = colors[index % colors.length];
              const imageUrl = collection.image_url || "/placeholder.jpg";

              return (
                <motion.div
                  key={collection.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="group relative cursor-pointer"
                >
                  <Link href={`/collections/${collection.id}`} className="block h-full w-full">
                    <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl shadow-xl hover:shadow-2xl transition-shadow duration-500">
                      {/* Image */}
                      <img 
                        src={imageUrl} 
                        alt={collection.name}
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          e.currentTarget.nextElementSibling?.classList.remove('hidden');
                        }}
                      />
                      
                      {/* Fallback Placeholder */}
                      <div className={`absolute inset-0 ${bgClass} -z-10 bg-gradient-to-br from-stone-200 to-stone-300 hidden`} />

                      {/* Overlay Gradient */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-80" />

                      {/* Content Overlay */}
                      <div className="absolute inset-0 flex flex-col justify-end p-8">
                        <h3 className="text-2xl font-light text-white mb-2 translate-y-4 transition-transform duration-300 group-hover:translate-y-0">
                          {collection.name}
                        </h3>
                        <p className="text-sm text-zinc-200 mb-6 opacity-0 translate-y-4 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0 delay-75 font-medium">
                          {collection.description}
                        </p>
                        
                        <button className="w-max rounded-full bg-white/20 backdrop-blur-md border border-white/30 px-6 py-2 text-xs font-medium text-white transition-all hover:bg-white hover:text-black opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 delay-100 shadow-lg">
                          View Details
                        </button>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
