import React from "react";
import Navbar from "@/components/Navbar";
import ProductGallery from "@/components/Product/ProductGallery";
import ProductInfo from "@/components/Product/ProductInfo";
import ProductSpecs from "@/components/Product/ProductSpecs";
import { productData } from "@/data/productData";

export default function ProductDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  // In a real app, we would fetch product data based on params.slug
  // For now, we use the static mock data
  const product = productData;

  return (
    <main className="min-h-screen bg-neutral-50 selection:bg-orange-500/30">
      <Navbar />
      
      <div className="mx-auto max-w-7xl px-4 pt-32 pb-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-2">
          {/* Left Column: Gallery */}
          <div className="lg:sticky lg:top-32 lg:self-start">
            <ProductGallery images={product.images} />
          </div>

          {/* Right Column: Info */}
          <div>
            <ProductInfo
              title={product.title}
              price={product.price}
              description={product.description}
              features={product.features}
            />
            
            <div className="mt-12 border-t border-neutral-200 pt-12">
              <ProductSpecs 
                specifications={product.specifications} 
                downloads={product.downloads}
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
