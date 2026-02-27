"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Package, 
  ShoppingCart, 
  DollarSign, 
  TrendingUp, 
  Box, 
  Clock, 
  CheckCircle,
  CalendarDays
} from "lucide-react";
import clsx from "clsx";
import { createClient } from "@/utils/supabase/client";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const supabase = createClient();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    // Fetch Products count
    const { count: productsCount } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true });

    // Fetch Orders
    const { data: orders } = await supabase
      .from('orders')
      .select('id, total_amount, status, created_at')
      .order('created_at', { ascending: false });

    // Compute Metrics
    let totalRevenue = 0;
    let pendingCount = 0;
    let deliveredCount = 0;
    let todayOrdersCount = 0;
    let thisMonthOrdersCount = 0;
    
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const safeOrders = orders || [];
    
    safeOrders.forEach(order => {
      totalRevenue += Number(order.total_amount) || 0;
      
      if (order.status === 'make it to proceed' || order.status === 'active order') {
        pendingCount++;
      } else if (order.status === 'delivered') {
        deliveredCount++;
      }
      
      const orderDate = new Date(order.created_at);
      if (orderDate >= startOfToday) {
        todayOrdersCount++;
      }
      if (orderDate >= startOfMonth) {
        thisMonthOrdersCount++;
      }
    });

    setStats({
      totalRevenue,
      totalProducts: productsCount || 0,
      totalOrders: safeOrders.length,
      pendingOrders: pendingCount,
      deliveredOrders: deliveredCount,
      todayOrders: todayOrdersCount,
      thisMonthOrders: thisMonthOrdersCount
    });

    setRecentOrders(safeOrders.slice(0, 5));
    setLoading(false);
  };

  if (loading) return <div className="py-20 text-center text-neutral-500">Loading Dashboard...</div>;

  const STATS_CARDS = [
    { label: "Total Revenue", value: `$${stats.totalRevenue.toFixed(2)}`, icon: DollarSign, trend: "All time", color: "text-emerald-600", bg: "bg-emerald-100" },
    { label: "Total Products", value: stats.totalProducts.toString(), icon: Package, trend: "Active catalog", color: "text-blue-600", bg: "bg-blue-100" },
    { label: "Total Orders", value: stats.totalOrders.toString(), icon: ShoppingCart, trend: "All time", color: "text-cyan-600", bg: "bg-cyan-100" },
    { label: "Orders Pending", value: stats.pendingOrders.toString(), icon: Clock, trend: "Requires action", color: "text-amber-600", bg: "bg-amber-100" },
    { label: "Orders Delivered", value: stats.deliveredOrders.toString(), icon: CheckCircle, trend: "Completed", color: "text-green-600", bg: "bg-green-100" },
    { label: "Orders Today", value: stats.todayOrders.toString(), icon: TrendingUp, trend: "Today", color: "text-rose-600", bg: "bg-rose-100" },
    { label: "Orders This Month", value: stats.thisMonthOrders.toString(), icon: CalendarDays, trend: "This month", color: "text-indigo-600", bg: "bg-indigo-100" },
  ];

  return (
    <div className="space-y-8 font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-light tracking-tight text-neutral-900 mb-2">Dashboard Overview</h1>
          <p className="text-neutral-500 text-sm">Welcome back, Admin. Here's your real-time performance.</p>
        </div>
        <div className="flex gap-3">
          <button className="px-5 py-2 rounded-full border border-neutral-200 bg-white text-neutral-700 text-sm font-medium hover:bg-neutral-50 transition shadow-sm">
            Export Report
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {STATS_CARDS.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="relative p-6 rounded-2xl bg-white border border-neutral-200 overflow-hidden group hover:shadow-lg transition-shadow"
            >
              <div className="flex justify-between items-start mb-4 relative z-10">
                <div className={clsx("w-12 h-12 rounded-xl flex items-center justify-center", stat.bg, stat.color)}>
                  <Icon size={24} />
                </div>
              </div>
              
              <div className="relative z-10">
                <h3 className="text-neutral-500 text-sm font-medium mb-1">{stat.label}</h3>
                <p className="text-3xl font-light text-neutral-900 tracking-tight mb-2">{stat.value}</p>
                <div className="flex items-center gap-1.5 text-xs text-neutral-400">
                  <TrendingUp size={12} className={stat.color} />
                  <span>{stat.trend}</span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 p-6 rounded-2xl bg-white border border-neutral-200 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-medium text-neutral-900">Revenue Snapshot</h3>
            <span className="text-sm font-medium text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">Active</span>
          </div>
          <div className="h-64 flex items-end justify-center gap-2 pb-4 border-b border-neutral-100 mt-8 relative">
            <div className="absolute inset-x-0 bottom-4 top-0 flex flex-col justify-between text-xs text-neutral-300 pointer-events-none">
                <div className="border-b border-neutral-100 w-full h-0"></div>
                <div className="border-b border-neutral-100 w-full h-0"></div>
                <div className="border-b border-neutral-100 w-full h-0"></div>
            </div>
            {/* Visual Bars based on recent order history logic placeholder */}
            {[40, 70, 45, 90, 65, 85, 100].map((h, i) => (
              <motion.div 
                key={i}
                initial={{ height: 0 }}
                animate={{ height: `${h}%` }}
                transition={{ duration: 1, delay: i * 0.1 }}
                className="w-1/12 bg-gradient-to-t from-orange-500 to-orange-300 rounded-t-md relative z-10"
              ></motion.div>
            ))}
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-neutral-200 shadow-sm">
          <h3 className="text-lg font-medium text-neutral-900 mb-6">Recent Pending</h3>
          <div className="space-y-4">
            {recentOrders.filter(o => o.status !== 'delivered').slice(0, 4).map((order) => (
               <div key={order.id} className="flex items-center gap-4 pb-4 border-b border-neutral-100 last:border-0">
                 <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
                   <Clock size={16} />
                 </div>
                 <div className="flex-1 min-w-0">
                   <p className="text-sm font-medium text-neutral-900 truncate">#ORD-{order.id.split('-')[0].toUpperCase()}</p>
                   <p className="text-xs text-neutral-500 capitalize">{order.status}</p>
                 </div>
                 <div className="text-sm font-semibold text-neutral-900">
                   ${Number(order.total_amount).toFixed(2)}
                 </div>
               </div>
            ))}
            {recentOrders.filter(o => o.status !== 'delivered').length === 0 && (
                <div className="text-sm text-neutral-500 text-center py-4">No pending orders.</div>
            )}
          </div>
          <a href="/admin/orders" className="block text-center w-full mt-4 py-2 border border-neutral-200 rounded-lg text-sm text-neutral-600 font-medium hover:bg-neutral-50 transition">
            View All Orders
          </a>
        </div>
      </div>
    </div>
  );
}
