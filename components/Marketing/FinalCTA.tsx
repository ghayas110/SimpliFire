"use client";

import React from "react";
import Link from "next/link";

export default function FinalCTA() {
  return (
    <section className="flex min-h-[50vh] flex-col items-center justify-center px-6 text-center bg-transparent">
      <h2 className="mb-4 text-4xl font-light text-[#582F0E] md:text-6xl">
        Make It the Centerpiece.
      </h2>
      <p className="mb-10 text-lg text-[#432818]/70">Join the Hearth & Home family today.</p>
      <Link href="/products">
        <button className="rounded-full bg-[#582F0E] px-8 py-4 text-sm font-medium tracking-wide text-white transition-transform hover:scale-105 active:scale-95 shadow-xl hover:shadow-2xl">
          Shop SimpliFire
        </button>
      </Link>
    </section>
  );
}
