import React from "react";
import Navbar from "@/components/Navbar";
import { Mail, Phone, MessageSquare, FileText } from "lucide-react";

export default function SupportPage() {
  const faqs = [
    {
      q: "How do I clean my electric fireplace glass?",
      a: "Use a clean, dry micro-fiber cloth. For tougher spots, a slightly damp cloth with mild soap can be used. Never use abrasive cleaners or glass cleaners containing ammonia.",
    },
    {
      q: "Does the fireplace require professional installation?",
      a: "Many of our wall-mount and plug-in models are designed for easy DIY installation. However, built-in and hardwired models should be installed by a licensed professional to ensure safety.",
    },
    {
      q: "What is the warranty period?",
      a: "All SimpliFire fireplaces come with a standard 1-year limited warranty covering parts and labor for manufacturing defects.",
    },
    {
      q: "Can I operate the flames without the heat?",
      a: "Yes! All of our models feature independent flame and heat controls, allowing you to enjoy the ambiance of the fire year-round without turning on the heating element.",
    }
  ];

  return (
    <main className="min-h-screen bg-neutral-50 selection:bg-orange-500/30 font-sans">
      <Navbar />

      <section className="pt-40 pb-16 px-6 lg:px-8 max-w-7xl mx-auto text-center">
        <span className="text-orange-600 font-bold tracking-widest text-sm uppercase mb-4 block">We're here to help</span>
        <h1 className="text-5xl font-light text-neutral-900 mb-6">Customer Support</h1>
        <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
          Whether you need help with installation, troubleshooting, or just want to learn more about your new fireplace, our experts are ready to assist you.
        </p>
      </section>

      {/* Support Channels */}
      <section className="px-6 lg:px-8 max-w-5xl mx-auto pb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-8 rounded-3xl border border-neutral-200 text-center hover:shadow-lg transition-shadow">
            <Phone className="w-8 h-8 mx-auto text-orange-500 mb-4" />
            <h3 className="font-medium text-neutral-900 mb-2">Call Us</h3>
            <p className="text-sm text-neutral-500 mb-4">Mon-Fri, 8am-5pm EST</p>
            <a href="tel:1-800-555-FIRE" className="text-orange-600 font-semibold">1-800-555-FIRE</a>
          </div>
          <div className="bg-white p-8 rounded-3xl border border-neutral-200 text-center hover:shadow-lg transition-shadow">
            <Mail className="w-8 h-8 mx-auto text-orange-500 mb-4" />
            <h3 className="font-medium text-neutral-900 mb-2">Email Us</h3>
            <p className="text-sm text-neutral-500 mb-4">We reply within 24 hours.</p>
            <a href="mailto:support@simplifire.com" className="text-orange-600 font-semibold">support@simplifire.com</a>
          </div>
          <div className="bg-white p-8 rounded-3xl border border-neutral-200 text-center hover:shadow-lg transition-shadow">
            <MessageSquare className="w-8 h-8 mx-auto text-orange-500 mb-4" />
            <h3 className="font-medium text-neutral-900 mb-2">Live Chat</h3>
            <p className="text-sm text-neutral-500 mb-4">Available during business hours.</p>
            <button className="text-orange-600 font-semibold">Start Chat</button>
          </div>
          <div className="bg-white p-8 rounded-3xl border border-neutral-200 text-center hover:shadow-lg transition-shadow">
            <FileText className="w-8 h-8 mx-auto text-orange-500 mb-4" />
            <h3 className="font-medium text-neutral-900 mb-2">Manuals</h3>
            <p className="text-sm text-neutral-500 mb-4">Download PDF guides.</p>
            <button className="text-orange-600 font-semibold">Browse Library</button>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="bg-white py-24 px-6 lg:px-8 border-t border-neutral-200">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-light text-neutral-900 mb-12 text-center">Frequently Asked Questions</h2>
          <div className="space-y-8">
            {faqs.map((faq, idx) => (
              <div key={idx} className="border-b border-neutral-100 pb-8 last:border-0 last:pb-0">
                <h3 className="text-lg font-medium text-neutral-900 mb-3">{faq.q}</h3>
                <p className="text-neutral-600 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
