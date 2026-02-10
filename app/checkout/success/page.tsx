"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function CheckoutSuccessPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-neutral-50 px-4 py-16 text-center">
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-green-100 text-green-600"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="48"
          height="48"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </motion.div>

      <motion.h1
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="mb-4 text-3xl font-light text-neutral-900 md:text-5xl"
      >
        Order Confirmed!
      </motion.h1>

      <motion.p
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mb-8 max-w-md text-lg text-neutral-500"
      >
        Thank you for your purchase. We've received your order and are processing it. You will receive an email confirmation shortly.
      </motion.p>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="mb-12 rounded-lg border border-neutral-200 bg-white p-6 shadow-sm"
      >
        <p className="text-sm text-neutral-500">Order Number</p>
        <p className="font-mono text-xl font-bold text-neutral-900">
          #SF-{Math.floor(100000 + Math.random() * 900000)}
        </p>
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <Link
          href="/"
          className="rounded-full bg-neutral-900 px-8 py-3 font-medium text-white transition-transform hover:scale-105"
        >
          Return to Home
        </Link>
      </motion.div>
    </div>
  );
}
