"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from "framer-motion";
import { Menu, X, ShoppingBag, User } from "lucide-react";
import { useCart } from "@/context/CartContext";
import CartDrawer from "./Cart/CartDrawer";
import { createClient } from "@/utils/supabase/client";

const navItems = [
  { name: "Collections", href: "/products" },
  { name: "Technology", href: "/technology" },
  { name: "Inspiration", href: "/inspiration" },
  { name: "Support", href: "/support" },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const { scrollY } = useScroll();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { openCart, cartCount } = useCart();
  const pathname = usePathname();
  const isHome = pathname === "/";
  const useDarkText = !isHome || isScrolled;
  const [session, setSession] = useState<any>(null);
  
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 50);
  });

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          isScrolled
            ? "bg-[#FDFCF8]/90 backdrop-blur-md border-b border-[#582F0E]/10 py-4 shadow-sm"
            : "bg-transparent py-6"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
          {/* Logo */}
          {/* Logo */}
          <Link href="/" className="relative block h-8 w-32 md:h-10 md:w-40">
             <Image
               src="/logo.png"
               alt="SimpliFire"
               fill
               className="object-contain object-left"
               priority
             />
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`text-sm font-medium transition-colors ${
                  useDarkText 
                    ? "text-[#432818]/80 hover:text-[#582F0E]" 
                    : "text-zinc-300 hover:text-white"
                }`}
              >
                {item.name}
              </Link>
            ))}
            {session && (
              <Link
                href="/accounts"
                className={`text-sm font-medium transition-colors ${
                  useDarkText 
                    ? "text-[#432818]/80 hover:text-[#582F0E]" 
                    : "text-zinc-300 hover:text-white"
                }`}
              >
                Accounts
              </Link>
            )}
          </div>

          {/* Actions */}
          <div className="hidden md:flex items-center gap-4">
            <button 
              onClick={openCart}
              className={`relative p-2 transition-colors hover:opacity-80 ${useDarkText ? "text-[#582F0E]" : "text-white"}`}
            >
              <ShoppingBag width={20} height={20} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-orange-600 text-[10px] font-bold text-white">
                  {cartCount}
                </span>
              )}
            </button>
            {session ? (
              <Link 
                href="/accounts"
                className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-semibold transition-all ${
                  useDarkText
                    ? "bg-[#582F0E] text-white hover:bg-[#432818]"
                    : "bg-white text-black hover:bg-zinc-200"
                }`}
              >
                <User size={16} />
                Profile
              </Link>
            ) : (
              <Link 
                href="/login"
                className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all ${
                  useDarkText
                    ? "bg-[#582F0E] text-white hover:bg-[#432818]"
                    : "bg-white text-black hover:bg-zinc-200"
                }`}
              >
                Get Started
              </Link>
            )}
          </div>

          {/* Mobile Menu & Cart Toggle */}
          <div className="flex items-center gap-4 md:hidden">
            <button 
                onClick={openCart}
                className={`relative p-2 transition-colors ${useDarkText ? "text-[#582F0E]" : "text-white"}`}
              >
                <ShoppingBag width={20} height={20} />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-orange-600 text-[10px] font-bold text-white">
                    {cartCount}
                  </span>
                )}
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`p-2 transition-colors ${useDarkText ? "text-[#582F0E]" : "text-white"}`}
            >
              {isMobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-[#FDFCF8]/95 backdrop-blur-xl border-t border-[#582F0E]/10 overflow-hidden"
            >
              <div className="flex flex-col p-6 space-y-4">
                {navItems.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="text-lg font-medium text-[#432818] hover:text-[#582F0E]"
                    >
                      {item.name}
                    </Link>
                  )
                )}
                {session && (
                  <Link
                    href="/accounts"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-lg font-medium text-[#432818] hover:text-[#582F0E]"
                  >
                    Accounts
                  </Link>
                )}
                {session ? (
                  <Link 
                    href="/accounts"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="mt-4 flex items-center justify-center gap-2 w-full px-6 py-3 rounded-full bg-[#582F0E] text-white font-semibold"
                  >
                    <User size={18} />
                    Profile
                  </Link>
                ) : (
                  <Link 
                    href="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="mt-4 flex items-center justify-center w-full px-6 py-3 rounded-full bg-[#582F0E] text-white font-semibold"
                  >
                    Sign In
                  </Link>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
      <CartDrawer />
    </>
  );
}
