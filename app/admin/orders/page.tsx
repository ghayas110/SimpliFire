"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, MoreVertical, Package, CheckCircle2, CircleDashed, Clock, Eye, AlertCircle, X } from "lucide-react";
import clsx from "clsx";
import { createClient } from "@/utils/supabase/client";

type OrderStatus = "make it to proceed" | "active order" | "delivered";

interface Order {
  id: string;
  fullId: string;
  customer: string;
  date: string;
  status: OrderStatus;
  amount: number;
  items: string[];
}

export default function AdminOrdersPanel() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filter, setFilter] = useState<OrderStatus | "All">("All");
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  const supabase = createClient();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        id, created_at, status, total_amount,
        profiles ( full_name, id ),
        order_items (
          products ( name )
        )
      `)
      .order('created_at', { ascending: false });

    if (data) {
      const mapped = data.map((o: any) => ({
        id: `#ORD-${o.id.split('-')[0].toUpperCase()}`,
        fullId: o.id,
        customer: o.profiles?.full_name || 'Anonymous User',
        date: o.created_at,
        status: o.status as OrderStatus,
        amount: Number(o.total_amount),
        items: o.order_items?.map((i: any) => i.products?.name) || []
      }));
      setOrders(mapped);
    }
    setLoading(false);
  };

  const updateStatus = async (fullId: string, newStatus: OrderStatus) => {
    setActiveMenu(null);
    
    // Optistic UI update
    setOrders(orders.map(o => o.fullId === fullId ? { ...o, status: newStatus } : o));

    const { error } = await supabase
      .from('orders')
      .update({ status: newStatus })
      .eq('id', fullId);

    if (error) {
      setNotification({ type: 'error', message: "Failed to update status: " + error.message });
      fetchOrders(); // Revert on fail
    } else {
      setNotification({ type: 'success', message: "Order status updated successfully!" });
    }
  };

  const filteredOrders = filter === "All" ? orders : orders.filter(o => o.status === filter);

  const getStatusBadge = (status: OrderStatus) => {
    switch(status) {
      case "delivered": return "bg-green-500/10 text-green-400 border border-green-500/20";
      case "active order": return "bg-blue-500/10 text-blue-400 border border-blue-500/20";
      case "make it to proceed": return "bg-amber-500/10 text-amber-400 border border-amber-500/20";
    }
  };

  if (loading) return <div className="p-12 text-center text-white/50">Loading Orders...</div>;

  return (
    <div className="space-y-8 relative font-sans">
      {/* Toast Notification */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-4 right-4 z-[100] p-4 rounded-xl shadow-lg flex items-center gap-3 \${
              notification.type === 'success' ? 'bg-emerald-50 border border-emerald-200 text-emerald-700' : 'bg-red-50 border border-red-200 text-red-700'
            }`}
          >
            {notification.type === 'success' ? <CheckCircle2 size={20} className="text-emerald-500" /> : <AlertCircle size={20} className="text-red-500" />}
            <p className="font-medium text-sm">{notification.message}</p>
            <button onClick={() => setNotification(null)} className="ml-4 opacity-50 hover:opacity-100"><X size={16} /></button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex flex-col md:flex-row items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-light tracking-tight text-neutral-900 mb-2">Orders Management</h1>
          <p className="text-neutral-500 text-sm">Review incoming orders and update their status.</p>
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input 
              type="text" 
              placeholder="Search orders..." 
              className="pl-10 pr-4 py-2 bg-white border border-neutral-200 rounded-full text-sm text-neutral-900 focus:outline-none focus:border-neutral-300 transition-all w-64 md:w-80 shadow-sm"
            />
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-neutral-200 pb-4 overflow-x-auto snap-x">
        {["All", "make it to proceed", "active order", "delivered"].map(f => (
          <button 
            key={f}
            onClick={() => setFilter(f as any)}
            className={clsx(
              "px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap snap-start transition",
              filter === f ? "bg-neutral-900 text-white" : "text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100"
            )}
          >
            {f === "All" ? "All Orders" : f.replace("make it", "").trim().replace(/\b\w/g, l => l.toUpperCase()) || "Make It To Proceed"}
          </button>
        ))}
      </div>

      {/* Orders List */}
      <div className="bg-white border border-neutral-200 rounded-2xl overflow-visible min-h-[350px] shadow-sm">
        <div className="overflow-visible">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-neutral-50 border-b border-neutral-200 text-neutral-500 text-sm font-medium">
                <th className="py-4 px-6 font-medium">Order ID</th>
                <th className="py-4 px-6 font-medium">Customer</th>
                <th className="py-4 px-6 font-medium">Date / Items</th>
                <th className="py-4 px-6 font-medium">Amount</th>
                <th className="py-4 px-6 font-medium">Status</th>
                <th className="py-4 px-6 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map(order => (
                <tr key={order.fullId} className={clsx("border-b border-neutral-100 hover:bg-neutral-50 transition-colors relative", activeMenu === order.fullId ? "z-50" : "z-0")}>
                  <td className="py-4 px-6 font-medium text-neutral-900">{order.id}</td>
                  <td className="py-4 px-6 flex items-center gap-3 text-neutral-800">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-100 to-blue-100 flex items-center justify-center text-xs font-bold text-purple-700">
                      {order.customer.charAt(0).toUpperCase()}
                    </div>
                    {order.customer}
                  </td>
                  <td className="py-4 px-6">
                    <p className="text-sm text-neutral-800">{new Date(order.date).toLocaleDateString()}</p>
                    <p className="text-xs text-neutral-400 truncate max-w-[150px]">{order.items.join(', ')}</p>
                  </td>
                  <td className="py-4 px-6 font-medium text-neutral-900">${order.amount.toFixed(2)}</td>
                  <td className="py-4 px-6">
                    <span className={clsx("px-3 py-1 rounded-full text-xs font-medium inline-flex items-center gap-1.5", getStatusBadge(order.status))}>
                      {order.status === 'delivered' && <CheckCircle2 size={12} />}
                      {order.status === 'active order' && <CircleDashed size={12} className="animate-[spin_4s_linear_infinite]" />}
                      {order.status === 'make it to proceed' && <Clock size={12} />}
                      <span className="capitalize">{order.status}</span>
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right relative">
                    <div className="flex justify-end pr-2">
                       <button 
                        onClick={() => setActiveMenu(activeMenu === order.fullId ? null : order.fullId)}
                        className="p-2 text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition"
                      >
                         <MoreVertical size={18} />
                       </button>

                      {/* Dropdown Menu */}
                      <AnimatePresence>
                        {activeMenu === order.fullId && (
                           <motion.div 
                            initial={{ opacity: 0, scale: 0.95, y: -10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: -10 }}
                            className="absolute right-12 top-10 w-48 bg-white border border-neutral-200 rounded-xl shadow-xl overflow-hidden z-50 py-1"
                          >
                             <div className="px-3 py-2 text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1 text-left">
                              Update Status
                             </div>
                             <button 
                              onClick={() => updateStatus(order.fullId, 'make it to proceed')}
                              className="w-full text-left px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50 hover:text-neutral-900 transition flex items-center gap-2"
                            >
                               <Clock size={14} className="text-amber-500" />
                              Make it to Proceed
                             </button>
                             <button 
                              onClick={() => updateStatus(order.fullId, 'active order')}
                              className="w-full text-left px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50 hover:text-neutral-900 transition flex items-center gap-2"
                            >
                               <CircleDashed size={14} className="text-blue-500" />
                              Make to Active Order
                             </button>
                             <button 
                              onClick={() => updateStatus(order.fullId, 'delivered')}
                              className="w-full text-left px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50 hover:text-neutral-900 transition flex items-center gap-2"
                            >
                               <CheckCircle2 size={14} className="text-green-500" />
                              Make to Delivered
                             </button>
                           </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {filteredOrders.length === 0 && (
            <div className="text-center py-20">
              <Package className="w-12 h-12 text-neutral-300 mx-auto mb-4" />
              <p className="text-neutral-500 text-base">No orders found matching your criteria.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
