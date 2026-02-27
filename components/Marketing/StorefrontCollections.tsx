"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Package } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { motion } from "framer-motion";

export default function StorefrontCollections() {
  const [collections, setCollections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    fetchCollections();
  }, []);

  const fetchCollections = async () => {
    // Fetch collections and a count of products in each
    const { data: collectionsData, error } = await supabase
      .from('collections')
      .select(`
        *,
        products (count)
      `)
      .order('created_at', { ascending: false });

    if (collectionsData) {
      setCollections(collectionsData);
    }
    setLoading(false);
  };

  if (loading) return null; // Or a skeleton loader
  if (collections.length === 0) return null;

  return (
    <section className="py-24 bg-[#050505] text-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-sm font-semibold tracking-widest text-emerald-400 uppercase mb-3">Shop By Category</h2>
            <h3 className="text-3xl md:text-5xl font-light tracking-tight">Our Collections</h3>
          </div>
          <Link href="/products" className="hidden md:flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors pb-2">
            View All Products <ArrowRight size={16} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {collections.map((collection, i) => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              key={collection.id}
            >
              <Link 
                href={`/products?collection=${collection.id}`}
                className="group block relative h-80 rounded-2xl overflow-hidden bg-white/5 border border-white/10 hover:border-white/30 transition-all"
              >
                {/* Abstract Background Placeholder for Collection */}
                <div className="absolute inset-0 bg-gradient-to-br from-black/80 to-transparent z-10" />
                <div 
                  className="absolute inset-0 bg-cover bg-center opacity-40 group-hover:scale-105 transition-transform duration-700" 
                  style={{
                    backgroundImage: `url('${collection.image_url || "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=2600&auto=format&fit=crop"}')`
                  }}
                />
                
                <div className="absolute inset-0 z-20 p-8 flex flex-col justify-end">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
                      <Package size={14} />
                    </span>
                    <span className="text-xs font-medium tracking-wider uppercase text-white/70">
                      {collection.products[0]?.count || 0} Products
                    </span>
                  </div>
                  <h4 className="text-3xl font-light text-white mb-2">{collection.name}</h4>
                  {collection.description && (
                    <p className="text-white/60 text-sm line-clamp-2">{collection.description}</p>
                  )}
                  
                  <div className="mt-6 flex items-center text-sm font-medium text-emerald-400 opacity-0 transform translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                    Explore Collection <ArrowRight size={16} className="ml-2" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
