"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Copy, PlusSquare, LayoutDashboard, ShoppingBag, BarChart3, Settings, LogOut } from "lucide-react";
import clsx from "clsx";
import { createClient } from "@/utils/supabase/client";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  const NAV_ITEMS = [
    { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    { label: "My Products", href: "/admin/products", icon: ShoppingBag },
    { label: "Collections", href: "/admin/collections", icon: LayoutDashboard },
    { label: "Add Product", href: "/admin/products/new", icon: PlusSquare },
    { label: "Orders Panel", href: "/admin/orders", icon: ShoppingBag },
    { label: "Analytics", href: "/admin/analytics", icon: BarChart3 },
    { label: "Settings", href: "/admin/settings", icon: Settings },
  ];

  return (
    <div className="flex min-h-screen bg-background text-foreground font-sans transition-colors duration-300" suppressHydrationWarning>
      {/* Sidebar */}
      <aside className="w-64 bg-card border-r border-border flex flex-col pt-24 pb-6 shadow-sm z-10 transition-colors duration-300">
        <div className="px-6 mb-8">
          <h2 className="text-xl font-bold tracking-tighter text-foreground">Admin Portal</h2>
          <p className="text-muted text-xs mt-1 uppercase tracking-widest font-bold">SimpliFire</p>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            
            return (
              <Link 
                key={item.href} 
                href={item.href}
                className={clsx(
                  "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300",
                  isActive 
                    ? "bg-foreground text-background shadow-md shadow-neutral-200/50" 
                    : "text-muted hover:text-foreground hover:bg-neutral-100/10"
                )}
              >
                <Icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="px-4 mt-auto">
          <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 hover:text-red-600 transition-colors">
            <LogOut size={18} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto pt-24 pb-12 px-8">
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
