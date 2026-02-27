import React from "react";
import Navbar from "@/components/Navbar";
import Image from "next/image";

export default function TechnologyPage() {
  const steps = [
    {
      title: "Vision & Conceptualization",
      description: "Every SimpliFire fireplace begins with a vision of blending modern aesthetics with unparalleled heating efficiency. Our designers sketch profiles that fit seamlessly into contemporary architecture.",
    },
    {
      title: "Precision Engineering",
      description: "Our engineering team translates sketches into precision blueprints. We utilize advanced CAD modeling to ensure every component aligns perfectly, guaranteeing safety and optimal airflow.",
    },
    {
      title: "Premium Material Selection",
      description: "We source only the highest grade materials. From heat-resistant templated glass to ultra-durable steel casings, every part is chosen to withstand the test of time.",
    },
    {
      title: "Assembly & Quality Assurance",
      description: "Each unit is meticulously assembled by skilled technicians. Before leaving our facility, every fireplace undergoes a rigorous 50-point quality assurance check, including thermal testing and electrical safety verifications.",
    }
  ];

  return (
    <main className="min-h-screen bg-neutral-50 selection:bg-orange-500/30 font-sans">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 lg:px-8 bg-neutral-900 text-white overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-40">
           <Image 
             src="/assets/images/The Scion.jpg" 
             alt="Technology Behind SimpliFire" 
             fill 
             className="object-cover object-center"
           />
           <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-neutral-900/80 to-transparent" />
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto text-center mt-12 mb-8">
          <span className="text-orange-500 font-bold tracking-widest text-sm uppercase mb-4 block">Innovation at its Core</span>
          <h1 className="text-5xl md:text-7xl font-light mb-6">How Our Products<br />Are Developed</h1>
          <p className="text-lg text-neutral-300 max-w-2xl mx-auto font-light">
            Discover the rigorous process, cutting-edge technology, and passionate craftsmanship that goes into bringing the warmth of a SimpliFire fireplace into your home.
          </p>
        </div>
      </section>

      {/* Development Process */}
      <section className="py-24 px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-light text-neutral-900 mb-4">The Making of Excellence</h2>
          <div className="w-24 h-1 bg-orange-500 mx-auto rounded-full" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {steps.map((step, idx) => (
            <div key={idx} className="bg-white p-10 rounded-3xl shadow-sm border border-neutral-100 hover:shadow-xl transition-shadow duration-500 relative overflow-hidden group">
               <div className="absolute top-0 right-0 w-32 h-32 bg-orange-50 rounded-bl-full -z-10 transition-transform group-hover:scale-110" />
               <span className="text-6xl font-black text-neutral-100 absolute top-6 right-8 pointer-events-none">
                 0{idx + 1}
               </span>
               <h3 className="text-2xl font-medium text-neutral-900 mb-4 relative z-10">{step.title}</h3>
               <p className="text-neutral-600 leading-relaxed relative z-10">
                 {step.description}
               </p>
            </div>
          ))}
        </div>
      </section>
      
      {/* Footer Call to Action */}
      <section className="bg-orange-50 py-20 px-6 text-center">
        <h2 className="text-3xl font-light text-neutral-900 mb-6">Experience the Engineering.</h2>
        <a href="/products" className="inline-block bg-orange-600 text-white px-8 py-4 rounded-full font-medium shadow-lg shadow-orange-500/30 hover:scale-105 transition-transform">
          Shop the Collection
        </a>
      </section>
    </main>
  );
}
