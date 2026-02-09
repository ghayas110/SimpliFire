"use client";

import React from "react";

const testimonials = [
  {
    quote: "The built-in look completely transformed our living room. It feels so premium.",
    author: "Jessica M.",
    role: "Scion Owner",
  },
  {
    quote: "I love that I can change the flame colors to match my mood. The heating is a bonus!",
    author: "David R.",
    role: "Allusion Platinum User",
  },
  {
    quote: "Finally, a fireplace that's safe for our curious toddler and pets. Total peace of mind.",
    author: "The Harper Family",
    role: "Inception Owner",
  },
];

export default function SocialProof() {
  return (
    <section className="px-6 py-24 md:px-12">
      <div className="mx-auto max-w-7xl">
        <h2 className="mb-16 text-center text-3xl font-light text-[#582F0E]">Stories from the Hearth</h2>
        
        <div className="grid gap-8 md:grid-cols-3">
          {testimonials.map((t, index) => (
            <div key={index} className="flex flex-col justify-between rounded-2xl border border-white/40 bg-white/40 p-8 backdrop-blur-md hover:bg-white/60 transition-colors shadow-lg">
              <p className="mb-6 text-xl italic text-[#432818]/80 font-light leading-relaxed">"{t.quote}"</p>
              <div>
                <p className="font-semibold text-[#582F0E] tracking-wide">{t.author}</p>
                <p className="text-sm text-[#432818]/60">{t.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
