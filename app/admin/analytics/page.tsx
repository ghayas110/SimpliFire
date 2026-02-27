"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { motion } from "framer-motion";
import { BarChart3, TrendingUp, DollarSign, ShoppingCart, CalendarDays } from "lucide-react";

export default function AnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState<any>(null);
  const supabase = createClient();

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    // Fetch Orders
    const { data: orders } = await supabase
      .from('orders')
      .select('id, total_amount, status, created_at')
      .order('created_at', { ascending: true });

    if (!orders) {
      setLoading(false);
      return;
    }

    // Process data for charts
    let totalRevenue = 0;
    const revenueByMonth: Record<string, number> = {};
    const ordersByStatus: Record<string, number> = {
      'delivered': 0,
      'make it to proceed': 0,
      'active order': 0
    };

    orders.forEach(order => {
      const amount = Number(order.total_amount) || 0;
      totalRevenue += amount;
      
      const status = order.status || 'unknown';
      if (ordersByStatus[status] !== undefined) {
        ordersByStatus[status]++;
      }

      const date = new Date(order.created_at);
      const monthYear = date.toLocaleString('default', { month: 'short', year: 'numeric' });
      
      if (!revenueByMonth[monthYear]) {
        revenueByMonth[monthYear] = 0;
      }
      revenueByMonth[monthYear] += amount;
    });

    const monthlyData = Object.keys(revenueByMonth).map(month => ({
      month,
      revenue: revenueByMonth[month]
    }));

    setAnalytics({
      totalRevenue,
      totalOrders: orders.length,
      ordersByStatus,
      monthlyData
    });

    setLoading(false);
  };

  if (loading) {
    return <div className="py-20 text-center text-neutral-500 font-sans">Loading Analytics...</div>;
  }

  if (!analytics) {
    return <div className="py-20 text-center text-neutral-500 font-sans">No analytics data available.</div>;
  }

  const maxRevenue = Math.max(...analytics.monthlyData.map((d: any) => d.revenue), 100);

  return (
    <div className="space-y-8 font-sans pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-light tracking-tight text-neutral-900 mb-2">Analytics & Reports</h1>
          <p className="text-neutral-500 text-sm">Deep dive into your store's performance metrics.</p>
        </div>
        <div className="flex gap-3">
          <button className="px-5 py-2 rounded-full border border-neutral-200 bg-white text-neutral-700 text-sm font-medium hover:bg-neutral-50 transition shadow-sm flex items-center gap-2">
            <CalendarDays size={16} />
            This Year
          </button>
        </div>
      </div>

      {/* Top Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-6 rounded-2xl bg-white border border-neutral-200 flex items-center gap-4 shadow-sm">
          <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
            <DollarSign size={28} />
          </div>
          <div>
            <p className="text-neutral-500 text-sm font-medium mb-1">Total Lifetime Revenue</p>
            <p className="text-3xl font-light text-neutral-900 tracking-tight">${analytics.totalRevenue.toFixed(2)}</p>
          </div>
        </div>
        <div className="p-6 rounded-2xl bg-white border border-neutral-200 flex items-center gap-4 shadow-sm">
          <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
            <ShoppingCart size={28} />
          </div>
          <div>
            <p className="text-neutral-500 text-sm font-medium mb-1">Total Lifetime Orders</p>
            <p className="text-3xl font-light text-neutral-900 tracking-tight">{analytics.totalOrders}</p>
          </div>
        </div>
      </div>

      {/* Revenue Chart */}
      <div className="p-6 rounded-2xl bg-white border border-neutral-200 shadow-sm">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="text-lg font-medium text-neutral-900">Revenue Over Time</h3>
            <p className="text-sm text-neutral-500">Monthly revenue breakdown</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-600">
            <BarChart3 size={20} />
          </div>
        </div>

        <div className="h-72 flex items-end gap-2 sm:gap-4 border-b border-neutral-100 pb-2 relative">
           {/* Grid lines */}
           <div className="absolute inset-x-0 bottom-6 top-0 flex flex-col justify-between text-xs text-neutral-300 pointer-events-none">
                <div className="border-b border-neutral-100 w-full h-0 flex items-end justify-end pb-1 pr-2">${maxRevenue.toFixed(0)}</div>
                <div className="border-b border-neutral-100 w-full h-0 flex items-end justify-end pb-1 pr-2">${(maxRevenue * 0.5).toFixed(0)}</div>
                <div className="border-b border-neutral-100 w-full h-0 flex items-end justify-end pb-1 pr-2">$0</div>
            </div>

          {analytics.monthlyData.length > 0 ? analytics.monthlyData.map((data: any, idx: number) => {
            const heightPercent = Math.max((data.revenue / maxRevenue) * 100, 2);
            return (
              <div key={idx} className="flex-1 flex flex-col items-center gap-2 relative z-10 group">
                {/* Tooltip */}
                <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity bg-neutral-900 text-white text-xs py-1 px-2 rounded pointer-events-none whitespace-nowrap">
                  ${data.revenue.toFixed(2)}
                </div>
                {/* Bar */}
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${heightPercent}%` }}
                  transition={{ duration: 0.8, delay: idx * 0.1 }}
                  className="w-full max-w-[40px] bg-emerald-500 rounded-t-md opacity-80 group-hover:opacity-100 transition-opacity"
                />
                <span className="text-xs text-neutral-500">{data.month.split(' ')[0]}</span>
              </div>
            );
          }) : (
            <div className="w-full h-full flex items-center justify-center text-neutral-400 text-sm">
              Not enough data to display chart.
            </div>
          )}
        </div>
      </div>

      {/* Order Status Breakdown */}
      <div className="p-6 rounded-2xl bg-white border border-neutral-200 shadow-sm">
        <h3 className="text-lg font-medium text-neutral-900 mb-6">Order Status Distribution</h3>
        <div className="space-y-4">
           {Object.keys(analytics.ordersByStatus).map((status) => {
             const count = analytics.ordersByStatus[status];
             const percentage = analytics.totalOrders > 0 ? (count / analytics.totalOrders) * 100 : 0;
             let colorClass = "bg-neutral-200";
             if (status === 'delivered') colorClass = "bg-green-500";
             if (status === 'active order') colorClass = "bg-blue-500";
             if (status === 'make it to proceed') colorClass = "bg-amber-500";

             return (
               <div key={status} className="flex items-center gap-4">
                 <div className="w-32 text-sm text-neutral-600 capitalize">{status}</div>
                 <div className="flex-1 h-3 bg-neutral-100 rounded-full overflow-hidden">
                   <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 1 }}
                    className={`h-full \${colorClass}`} 
                   />
                 </div>
                 <div className="w-12 text-right text-sm font-medium text-neutral-900">{count}</div>
               </div>
             );
           })}
        </div>
      </div>
    </div>
  );
}
