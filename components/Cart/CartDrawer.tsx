"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/context/CartContext";

export default function CartDrawer() {
  const { cart, isOpen, closeCart, removeFromCart, updateQuantity, cartTotal } = useCart();

  // Prevent body scroll when cart is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed bottom-0 right-0 top-0 z-50 flex w-full max-w-md flex-col bg-white shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-neutral-100 p-6">
              <h2 className="text-xl font-light text-neutral-900">Your Cart</h2>
              <button
                onClick={closeCart}
                className="rounded-full p-2 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-900"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-6">
              {cart.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center text-center">
                  <div className="mb-4 rounded-full bg-neutral-100 p-6 text-neutral-300">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="48"
                      height="48"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="8" cy="21" r="1" />
                      <circle cx="19" cy="21" r="1" />
                      <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
                    </svg>
                  </div>
                  <p className="text-lg font-medium text-neutral-900">Your cart is empty</p>
                  <p className="mt-1 text-sm text-neutral-500">
                    Looks like you haven't added anything yet.
                  </p>
                  <button
                    onClick={closeCart}
                    className="mt-6 rounded-full bg-neutral-900 px-8 py-3 text-sm font-medium text-white transition-transform hover:scale-105"
                  >
                    Start Shopping
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  {cart.map((item) => (
                    <div key={item.id} className="flex gap-4">
                      {/* Image */}
                      <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg bg-neutral-100 border border-neutral-200">
                        {item.image ? (
                           <Image
                              src={item.image}
                              alt={item.title}
                              fill
                              className="object-cover"
                           />
                        ) : (
                           <div className="flex h-full w-full items-center justify-center text-xs text-neutral-400">No Image</div>
                        )}
                      </div>

                      {/* Details */}
                      <div className="flex flex-1 flex-col justify-between py-1">
                        <div>
                          <div className="flex justify-between items-start gap-2">
                             <Link href={`/product/${item.id}`} onClick={closeCart} className="font-medium text-neutral-900 line-clamp-2 hover:text-orange-600 transition-colors">
                               {item.title}
                             </Link>
                             <button
                               onClick={() => removeFromCart(item.id)}
                               className="text-neutral-400 hover:text-red-500 transition-colors"
                             >
                               <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                             </button>
                          </div>
                          <p className="text-sm text-neutral-500 mt-1">${item.price.toFixed(2)}</p>
                        </div>

                        {/* Quantity */}
                        <div className="flex items-center gap-3">
                          <div className="flex items-center rounded-full border border-neutral-200">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="px-2 py-1 text-neutral-500 hover:text-neutral-900"
                              disabled={item.quantity <= 1}
                            >
                              -
                            </button>
                            <span className="w-4 text-center text-xs font-medium text-neutral-900">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="px-2 py-1 text-neutral-500 hover:text-neutral-900"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {cart.length > 0 && (
              <div className="border-t border-neutral-100 bg-neutral-50 p-6">
                <div className="mb-4 flex items-center justify-between">
                  <span className="text-neutral-500">Subtotal</span>
                  <span className="text-xl font-bold text-neutral-900">
                    ${cartTotal.toFixed(2)}
                  </span>
                </div>
                <p className="mb-6 text-xs text-neutral-400">
                  Shipping and taxes calculated at checkout.
                </p>
                <Link
                  href="/checkout"
                  onClick={closeCart}
                  className="block w-full rounded-full bg-gradient-to-r from-orange-600 to-red-600 py-4 text-center font-medium text-white shadow-lg shadow-orange-500/30 transition-transform hover:scale-[1.02] hover:shadow-orange-500/50 active:scale-[0.98]"
                >
                  Checkout
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
