"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { ShoppingCart, ArrowLeft, Check, PackageOpen } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import { motion } from "framer-motion";

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [simulating, setSimulating] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    const { data, error } = await supabase
      .from('products')
      .select('*, collections(name)')
      .eq('id', id)
      .single();

    if (data) setProduct(data);
    setLoading(false);
  };

  const simulateCheckout = async () => {
    setSimulating(true);
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      alert("Please sign in to purchase!");
      router.push('/login');
      return;
    }

    // Insert Order
    const { data: orderData, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: user.id,
        total_amount: product.price,
        status: 'make it to proceed'
      })
      .select()
      .single();

    if (orderError) {
      alert("Error: " + orderError.message);
      setSimulating(false);
      return;
    }

    // Insert Item
    const { error: itemError } = await supabase
      .from('order_items')
      .insert({
        order_id: orderData.id,
        product_id: product.id,
        quantity: 1,
        price_at_purchase: product.price,
      });

    if (itemError) {
      alert("Error: " + itemError.message);
      setSimulating(false);
      return;
    }

    alert('Purchase Successful! Redirecting to Accounts Panel.');
    router.push('/accounts');
  };

  if (loading) return (
    <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center">
      <div className="animate-pulse flex flex-col items-center gap-4">
        <PackageOpen size={40} className="text-white/20" />
        <p className="text-white/50 text-sm">Loading Product details...</p>
      </div>
    </div>
  );

  if (!product) return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center gap-4">
      <p className="text-white/50 text-xl">Product not found.</p>
      <Link href="/products" className="text-emerald-400 hover:text-emerald-300">Return to Storefront</Link>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#050505] text-white pt-24 pb-24 px-6">
      <div className="max-w-6xl mx-auto">
        <Link href="/products" className="inline-flex items-center gap-2 text-white/50 hover:text-white mb-8 text-sm transition-colors">
          <ArrowLeft size={16} /> Back to Catalog
        </Link>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Image Gallery */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="rounded-3xl overflow-hidden border border-white/10 bg-white/5 relative aspect-square"
          >
            {product.image_url ? (
              <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-white/5">
                <PackageOpen size={64} className="text-white/20" />
              </div>
            )}
            {product.collections?.name && (
              <div className="absolute top-6 left-6 px-4 py-2 bg-black/60 backdrop-blur-md rounded-full border border-white/10 text-xs font-semibold tracking-wider uppercase text-emerald-400">
                {product.collections.name}
              </div>
            )}
          </motion.div>

          {/* Product Info */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="flex flex-col justify-center"
          >
            <h1 className="text-4xl md:text-5xl font-light tracking-tight mb-4">{product.name}</h1>
            <p className="text-3xl font-light text-emerald-400 mb-8">${Number(product.price).toFixed(2)}</p>
            
            <div className="space-y-6 mb-12">
              <h3 className="text-sm font-semibold tracking-widest uppercase text-white/40">Description</h3>
              <p className="text-white/70 leading-relaxed max-w-xl">
                {product.description || "No specific description has been provided for this product yet. Rest assured, it meets our highest quality standards."}
              </p>
            </div>

            {product.sku && (
              <div className="flex items-center gap-2 mb-8 text-sm text-white/40">
                <span>SKU:</span>
                <span className="font-mono bg-white/5 px-2 py-1 rounded">{product.sku}</span>
              </div>
            )}

            {product.variations && product.variations.length > 0 && (
              <div className="mb-12">
                <h3 className="text-sm font-semibold tracking-widest uppercase text-white/40 mb-4">Available Options</h3>
                <div className="flex flex-wrap gap-3">
                  {product.variations.map((v: any, i: number) => (
                    <div key={i} className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm hover:border-white/30 transition-colors cursor-pointer">
                      <span className="font-medium text-white block mb-1">{v.name}</span>
                      <span className="text-white/50 text-xs">{v.price_modifier ? `+$${v.price_modifier}` : 'Included'}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-4">
              <button 
                onClick={simulateCheckout}
                disabled={simulating}
                className="w-full md:w-auto flex items-center justify-center gap-3 bg-white text-black px-12 py-4 rounded-full font-semibold text-lg hover:bg-white/90 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ShoppingCart size={20} />
                {simulating ? "Processing..." : "Buy Now"}
              </button>
              
              <div className="flex items-center gap-6 text-sm text-white/40 pt-4">
                <span className="flex items-center gap-2"><Check size={16} className="text-emerald-400" /> In Stock</span>
                <span className="flex items-center gap-2"><Check size={16} className="text-emerald-400" /> Quick Dispatch</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
