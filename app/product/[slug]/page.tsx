import React from "react";
import Navbar from "@/components/Navbar";
import ProductGallery from "@/components/Product/ProductGallery";
import ProductInfo from "@/components/Product/ProductInfo";
import ProductSpecs from "@/components/Product/ProductSpecs";
import { products } from "@/data/productData";

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  // Fetch product data based on params.slug
  const { slug } = await params;
  const product = products[slug];

  if (!product) {
    return (
      <main className="min-h-screen bg-neutral-50 selection:bg-orange-500/30">
        <Navbar />
        <div className="flex h-screen items-center justify-center">
            <h1 className="text-2xl font-light text-neutral-500">Product not found</h1>
        </div>
      </main>
    );
  }

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
              id={product.id}
              image={product.images[0]}
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
