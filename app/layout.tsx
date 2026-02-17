import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import { CartProvider } from "@/context/CartContext";
import { ComparisonProvider } from "@/context/ComparisonContext";
import ComparisonBar from "@/components/Comparison/ComparisonBar";
import ChatWidget from "@/components/Marketing/ChatWidget";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SimpliFire | Electric Fireplaces",
  description: "Redefining the heart of the home with digital fire technology.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <CartProvider>
          <ComparisonProvider>
            <SmoothScroll />
            {children}
            <ComparisonBar />
            <ChatWidget />
          </ComparisonProvider>
        </CartProvider>
      </body>
    </html>
  );
}
