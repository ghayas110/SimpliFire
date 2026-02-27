"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { motion } from "framer-motion";
import { createClient } from "@/utils/supabase/client";

export default function CheckoutPage() {
  const { cart, cartTotal, shippingCost, totalWithShipping, clearCart } = useCart();
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const supabase = createClient();

  // Simple form state
  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    cardNumber: "",
    expiry: "",
    cvc: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      // 1. Get authenticated user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error("You must be logged in to complete checkout.");
      }

      // 2. Create Order
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          total_amount: totalWithShipping,
          status: 'make it to proceed'
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // 3. Create Order Items
      const orderItems = cart.map(item => ({
        order_id: order.id,
        product_id: item.id,
        quantity: item.quantity,
        price_at_purchase: item.price
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;

      // 4. Success handling
      setIsSuccess(true);
      clearCart();
      router.push("/checkout/success");
    } catch (error: any) {
      console.error("Checkout failed:", error);
      alert(error.message || "Checkout failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (cart.length === 0 && !isSuccess) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-neutral-50 px-4">
        <div className="text-center">
          <h1 className="mb-4 text-3xl font-light text-neutral-900">
            Your cart is empty
          </h1>
          <Link
            href="/"
            className="inline-block rounded-full bg-neutral-900 px-8 py-3 font-medium text-white transition-transform hover:scale-105"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 lg:flex">
      {/* Left Column: Form */}
      <div className="flex-1 px-6 py-12 lg:px-12 lg:pt-24">
        <div className="mx-auto max-w-lg">
          <Link
            href="/"
            className="mb-8 inline-flex items-center text-sm text-neutral-500 hover:text-neutral-900"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mr-2"
            >
              <path d="m15 18-6-6 6-6" />
            </svg>
            Back to store
          </Link>

          <form onSubmit={handleSubmit} className="space-y-8">
            <section>
              <h2 className="mb-4 text-xl font-light text-neutral-900">
                Contact Information
              </h2>
              <div className="space-y-4">
                <input
                  required
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full rounded-md border border-neutral-200 bg-white px-4 py-3 text-sm outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                />
              </div>
            </section>

            <section>
              <h2 className="mb-4 text-xl font-light text-neutral-900">
                Shipping Address
              </h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <input
                  required
                  type="text"
                  name="firstName"
                  placeholder="First name"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full rounded-md border border-neutral-200 bg-white px-4 py-3 text-sm outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                />
                <input
                  required
                  type="text"
                  name="lastName"
                  placeholder="Last name"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full rounded-md border border-neutral-200 bg-white px-4 py-3 text-sm outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                />
                <input
                  required
                  type="text"
                  name="address"
                  placeholder="Address"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full rounded-md border border-neutral-200 bg-white px-4 py-3 text-sm outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 sm:col-span-2"
                />
                <input
                  required
                  type="text"
                  name="city"
                  placeholder="City"
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full rounded-md border border-neutral-200 bg-white px-4 py-3 text-sm outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                />
                <input
                  required
                  type="text"
                  name="state"
                  placeholder="State"
                  value={formData.state}
                  onChange={handleChange}
                  className="w-full rounded-md border border-neutral-200 bg-white px-4 py-3 text-sm outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                />
                <input
                  required
                  type="text"
                  name="zip"
                  placeholder="ZIP Code"
                  value={formData.zip}
                  onChange={handleChange}
                  className="w-full rounded-md border border-neutral-200 bg-white px-4 py-3 text-sm outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 sm:col-span-2"
                />
              </div>
            </section>

            <section>
              <h2 className="mb-4 text-xl font-light text-neutral-900">
                Payment
              </h2>
              <div className="rounded-md border border-neutral-200 bg-white p-4">
                <div className="mb-4 flex items-center gap-2">
                   {/* Secure Icon */}
                   <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                   <span className="text-xs font-medium text-neutral-500">Secure SSL Connection</span>
                </div>
                <div className="space-y-4">
                  <input
                    required
                    type="text"
                    name="cardNumber"
                    placeholder="Card number"
                    value={formData.cardNumber}
                    onChange={handleChange}
                    className="w-full rounded-md border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      required
                      type="text"
                      name="expiry"
                      placeholder="Expiration (MM/YY)"
                      value={formData.expiry}
                      onChange={handleChange}
                      className="w-full rounded-md border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                    />
                    <input
                      required
                      type="text"
                      name="cvc"
                      placeholder="CVC"
                      value={formData.cvc}
                      onChange={handleChange}
                      className="w-full rounded-md border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                    />
                  </div>
                </div>
              </div>
            </section>

            <button
              type="submit"
              disabled={isProcessing}
              className="w-full rounded-full bg-orange-600 py-4 font-bold text-white shadow-lg shadow-orange-500/30 transition-all hover:bg-orange-700 hover:shadow-orange-500/50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isProcessing ? "Processing..." : `Pay $${totalWithShipping.toFixed(2)}`}
            </button>
          </form>
        </div>
      </div>

      {/* Right Column: Order Summary */}
      <div className="flex-1 bg-neutral-100 px-6 py-12 lg:px-12 lg:pt-24">
        <div className="mx-auto max-w-lg lg:sticky lg:top-24">
          <h2 className="mb-6 text-xl font-light text-neutral-900">
            Order Summary
          </h2>
          <div className="mb-6 space-y-4">
            {cart.map((item) => (
              <div key={item.id} className="flex items-center gap-4">
                <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border border-neutral-200 bg-white">
                    {item.image ? (
                        <Image
                            src={item.image}
                            alt={item.title}
                            fill
                            className="object-cover"
                        />
                    ) : (
                        <div className="flex h-full w-full items-center justify-center bg-neutral-100 text-xs text-neutral-400">
                            No Img
                        </div>
                    )}
                  <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-neutral-500 text-xs font-bold text-white">
                    {item.quantity}
                  </span>
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-neutral-900">
                    {item.title}
                  </h3>
                </div>
                <p className="text-sm font-medium text-neutral-900">
                  ${(item.price * item.quantity).toFixed(2)}
                </p>
              </div>
            ))}
          </div>

          <div className="space-y-4 border-t border-neutral-200 pt-6">
            <div className="flex justify-between text-sm text-neutral-600">
              <span>Subtotal</span>
              <span>${cartTotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm text-neutral-600">
              <span>Shipping</span>
              <span className={shippingCost === 0 ? "font-medium text-green-600" : "font-medium text-neutral-900"}>
                {shippingCost === 0 ? "Free" : `$${shippingCost.toFixed(2)}`}
              </span>
            </div>
            <div className="flex justify-between text-sm text-neutral-600">
              <span>Taxes (Estimated)</span>
              <span>$0.00</span>
            </div>
          </div>

          <div className="mt-6 flex justify-between border-t border-neutral-200 pt-6 text-lg font-bold text-neutral-900">
            <span>Total</span>
            <span>
              <span className="mr-1 text-xs font-normal text-neutral-500">
                USD
              </span>
              ${totalWithShipping.toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
