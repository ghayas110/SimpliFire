import React from "react";
import Navbar from "@/components/Navbar";
import Image from "next/image";
import Link from "next/link";

export default function InspirationPage() {
  const galleries = [
    { src: "/assets/images/Allusion Platinum.jpg", title: "Modern Living Spaces" },
    { src: "/assets/images/Forum.jpg", title: "Outdoor Gatherings" },
    { src: "/assets/images/Inception Insert.jpg", title: "Cozy Bedroom Retreats" },
    { src: "/assets/images/Format Wall Mount.jpg", title: "Minimalist Studios" },
    { src: "/assets/products/Social_Landscape-SFE_Boyd-2B_2336x1314.jpg", title: "Entertainment Centers" },
    { src: "/assets/images/The Scion.jpg", title: "Luxury Foyers" },
  ];

  return (
    <main className="min-h-screen bg-neutral-50 selection:bg-orange-500/30 font-sans">
      <Navbar />

      <section className="pt-40 pb-16 px-6 lg:px-8 max-w-7xl mx-auto text-center">
        <h1 className="text-5xl font-light text-neutral-900 mb-6">Inspiration Gallery</h1>
        <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
          Explore how our customers and top interior designers are integrating SimpliFire fireplaces into stunning spaces. Find the perfect spark for your next room makeover.
        </p>
      </section>

      <section className="px-6 lg:px-8 max-w-[1400px] mx-auto pb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {galleries.map((img, idx) => (
            <div key={idx} className="group relative aspect-square overflow-hidden rounded-2xl bg-neutral-200 cursor-pointer">
              <Image 
                src={img.src}
                alt={img.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-8">
                <span className="text-orange-500 text-sm font-bold tracking-widest uppercase mb-2 block transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">Style Idea</span>
                <h3 className="text-2xl text-white font-light transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-75">{img.title}</h3>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-neutral-900 py-24 text-center text-white px-6">
        <h2 className="text-3xl font-light mb-6">Ready to transform your space?</h2>
        <Link href="/products" className="inline-block bg-white text-neutral-900 px-8 py-4 rounded-full font-medium hover:bg-neutral-200 transition-colors">
          Find Your Fireplace
        </Link>
      </section>
    </main>
  );
}
