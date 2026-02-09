"use client";

import React from "react";
import { ImageSequenceProvider } from "@/context/ImageSequenceContext";
import Preloader from "@/components/Preloader";
import Hero from "@/components/Hero/Hero";
import Navbar from "@/components/Navbar";

import FeaturesSection from "@/components/Marketing/FeaturesSection";
import SignatureLines from "@/components/Marketing/SignatureLines";
import ProcessStrip from "@/components/Marketing/ProcessStrip";
import SocialProof from "@/components/Marketing/SocialProof";
import FinalCTA from "@/components/Marketing/FinalCTA";

export default function Home() {
  return (
    <ImageSequenceProvider>
      <Preloader />
      <div className="relative z-50">
        <Navbar />
      </div>
      <main className="min-h-screen text-zinc-900">
        <Hero />
        <div className="relative z-10">
          <FeaturesSection />
          <SignatureLines />
          <ProcessStrip />
          <SocialProof />
          <FinalCTA />
        </div>
      </main>
    </ImageSequenceProvider>
  );
}
