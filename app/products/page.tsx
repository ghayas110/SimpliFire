import React from "react";
import Navbar from "@/components/Navbar";
import FilterBar from "@/components/Collection/FilterBar";
import SortDropdown from "@/components/Collection/SortDropdown";
import ProductCard from "@/components/Collection/ProductCard";
import { createClient } from "@/utils/supabase/server";
import { Product } from "@/data/collectionData";

export default async function AllProductsPage() {
  const supabase = await createClient();

  // Fetch all products
  const { data: productsData } = await supabase
    .from("products")
    .select("*");

  const displayTitle = "All Products";
  const numProducts = productsData?.length || 0;

  // Map DB products to the UI format
  const mappedProducts: Product[] = (productsData || []).map((p: any) => ({
    id: p.id,
    title: p.name,
    tagline: p.description || "",
    price: p.price,
    image: p.image_url || "/placeholder.jpg",
    specs: p.specifications || {},
    features: [],
    badges: ["Top Pick"],
    isFreeShipping: true,
    sku: p.sku || p.id.split('-')[0].toUpperCase(),
    brand: "SimpliFire",
    rating: 5,
    reviewCount: 42,
  }));

  return (
    <main className="min-h-screen bg-neutral-50 selection:bg-orange-500/30">
      <Navbar />

      <div className="mx-auto max-w-7xl px-4 pt-32 pb-16 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
            <h1 className="mb-4 text-4xl font-light text-neutral-900">{displayTitle}</h1>
            <div className="flex items-center gap-2 text-sm font-medium uppercase tracking-wider text-orange-600">
                <span>&lt; FIREPLACE</span>
            </div>
        </div>

        {/* Info Banner */}
        <div className="mb-8 flex items-center gap-4 rounded-xl bg-orange-50 p-4 text-neutral-700">
             <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-orange-500"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
             <span className="font-medium">Browse our complete collection of fireplaces</span>
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
                 <span className="text-sm font-bold text-neutral-900">Products ({numProducts})</span>
            </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {mappedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
            ))}
        </div>
        
        {mappedProducts.length === 0 && (
          <div className="py-20 text-center text-neutral-500">
            No products available yet. An Admin needs to create some!
          </div>
        )}
      </div>
    </main>
  );
}
