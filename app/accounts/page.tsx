"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Copy, Package, CheckCircle2, Search, ArrowRight, User } from "lucide-react";
import Link from "next/link";
import clsx from "clsx";
import { createClient } from "@/utils/supabase/client";
import Navbar from "@/components/Navbar";

export default function CustomerAccountsPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [sessionUser, setSessionUser] = useState<any>(null);
  
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      router.push('/login');
      return;
    }
    setSessionUser(user);

    // Fetch Profile
    const { data: profileData } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();
    
    setProfile(profileData);

    // Fetch Orders + Items + Products mapping
    const { data: ordersData, error } = await supabase
      .from('orders')
      .select(`
        id, created_at, status, total_amount,
        order_items (
          quantity, price_at_purchase, selected_variation,
          products ( name )
        )
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (ordersData) {
      // Map it neatly for UI
      const mappedOrders = ordersData.map((o: any) => ({
        id: o.id.split('-')[0], // just take first chunk
        fullId: o.id,
        date: o.created_at,
        status: o.status,
        total: o.total_amount,
        items: o.order_items?.map((item: any) => ({
          name: item.products?.name || 'Unknown Product',
          qty: item.quantity,
          price: item.price_at_purchase
        })) || []
      }));
      setOrders(mappedOrders);
    }
    
    setLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  }

  if (loading) return (
    <div className="min-h-screen bg-neutral-50 font-sans text-neutral-900 flex items-center justify-center">
      <Navbar />
      Loading Account...
    </div>
  );

  return (
    <div className="min-h-screen bg-neutral-50 font-sans text-neutral-900 pt-32 pb-12 px-6">
      <Navbar />
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Header / Profile section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-8 border-b border-neutral-200"
        >
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-full bg-white border border-neutral-200 shadow-sm flex items-center justify-center p-1">
              <div className="w-full h-full rounded-full bg-gradient-to-br from-orange-100 to-orange-50 flex items-center justify-center">
                <User size={32} className="text-orange-600" />
              </div>
            </div>
            <div>
              <h1 className="text-4xl font-light tracking-tight mb-2">My Account</h1>
              <p className="text-neutral-500 text-sm tracking-wide">Welcome, {profile?.full_name || sessionUser?.email}. Here are your details.</p>
            </div>
          </div>
          <div className="flex gap-4">
            <Link href="/" className="px-6 py-2 rounded-full border border-neutral-200 bg-white text-sm hover:bg-neutral-100 transition-colors duration-300">
              Return Home
            </Link>
            <button onClick={handleLogout} className="px-6 py-2 rounded-full border border-red-200 bg-red-50 text-sm text-red-600 hover:bg-red-500 hover:text-white transition-colors duration-300">
              Logout
            </button>
          </div>
        </motion.div>

        {/* Orders Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-6"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-medium tracking-tight">Active Orders ({orders.length})</h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <input 
                type="text" 
                placeholder="Search orders..." 
                className="pl-10 pr-4 py-2 bg-white border border-neutral-200 rounded-full text-sm focus:outline-none focus:ring-1 focus:ring-neutral-300 transition-all w-64 text-neutral-900"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {orders.map((order, idx) => (
              <motion.div 
                key={order.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * idx }}
                className="bg-white border border-neutral-200 rounded-2xl p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                  {/* Order info */}
                  <div className="flex items-center gap-6 w-full md:w-auto">
                    <div className={clsx(
                      "w-12 h-12 rounded-xl flex items-center justify-center border",
                      order.status === 'delivered' ? "bg-green-50 border-green-200 text-green-600" :
                      order.status === 'active order' ? "bg-blue-50 border-blue-200 text-blue-600" :
                      "bg-yellow-50 border-yellow-200 text-yellow-600"
                    )}>
                      {order.status === 'delivered' ? <CheckCircle2 size={24} /> : <Package size={24} />}
                    </div>
                    <div>
                      <div className="flex items-center gap-3">
                        <span className="text-lg font-medium text-neutral-900">#{order.id.toUpperCase()}</span>
                        <span className={clsx(
                          "px-2.5 py-0.5 rounded-full text-[10px] uppercase tracking-wider font-semibold",
                          order.status === 'delivered' ? "bg-green-100 text-green-700" :
                          order.status === 'active order' ? "bg-blue-100 text-blue-700" :
                          "bg-yellow-100 text-yellow-700"
                        )}>
                          {order.status}
                        </span>
                      </div>
                      <p className="text-neutral-500 text-sm mt-1">Placed on {new Date(order.date).toLocaleDateString()}</p>
                    </div>
                  </div>

                  {/* Items summary */}
                  <div className="w-full md:w-auto flex-1 px-0 md:px-12 border-t md:border-t-0 md:border-l border-neutral-200 pt-4 md:pt-0">
                    <p className="text-sm text-neutral-600 mb-2 truncate max-w-sm">
                      {order.items.map((i: any) => `${i.qty}x ${i.name}`).join(', ')}
                    </p>
                    <p className="text-2xl font-light text-neutral-900">${Number(order.total).toFixed(2)}</p>
                  </div>

                  {/* Actions */}
                  <div className="w-full md:w-auto flex items-center justify-end">
                    <button className="flex items-center gap-2 px-4 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-900 rounded-full text-sm transition-colors group">
                      View Details
                      <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}

            {orders.length === 0 && (
              <div className="text-center py-20 bg-white border border-neutral-200 rounded-2xl">
                <Package className="w-12 h-12 text-neutral-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-neutral-900">No active orders</h3>
                <p className="text-neutral-500 text-sm mt-2">When you place an order, it will appear here.</p>
                <Link href="/products" className="inline-block mt-6 px-6 py-2 bg-orange-600 text-white rounded-full text-sm font-medium hover:bg-orange-700 transition-colors">
                  Browse Products
                </Link>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
