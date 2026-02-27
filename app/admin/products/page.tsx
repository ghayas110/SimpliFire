"use client";

import { useState, useEffect } from "react";
import { Plus, Package, Search, Edit, Trash2, Folder, AlertTriangle, X, CheckCircle2, AlertCircle } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminProductsList() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [productToDelete, setProductToDelete] = useState<any>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  const supabase = createClient();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    // Fetch products along with their collection details via foreign key join
    const { data, error } = await supabase
      .from('products')
      .select('*, collections(name)')
      .order('created_at', { ascending: false });

    if (data) setProducts(data);
    setLoading(false);
  };

  const confirmDelete = async () => {
    if (!productToDelete) return;
    setIsDeleting(true);
    
    // Note: Due to RLS rules or foreign key constraints (like order_items), 
    // real deletion might fail if it's already purchased. 
    // In production, soft-deletes (archiving) are safer. For demo purposes:
    const { error } = await supabase.from('products').delete().eq('id', productToDelete.id);
    
    setIsDeleting(false);
    
    if (error) {
      setNotification({ type: 'error', message: "Failed to delete product: " + error.message });
    } else {
      setNotification({ type: 'success', message: "Product deleted successfully" });
      setProducts(products.filter(p => p.id !== productToDelete.id));
      setProductToDelete(null);
    }
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8 relative font-sans">
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-4 right-4 z-[60] p-4 rounded-xl shadow-lg flex items-center gap-3 \${
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
          <h1 className="text-3xl font-light tracking-tight text-neutral-900 mb-2">My Products</h1>
          <p className="text-neutral-500 text-sm">Manage your created products, prices, collections, and variations.</p>
        </div>
        <div className="flex gap-3">
          <Link href="/admin/products/new" className="flex items-center gap-2 bg-neutral-900 text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-neutral-800 transition shadow-sm">
            <Plus size={16} />
            Add New Product
          </Link>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <input 
            type="text" 
            placeholder="Search products by name..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white border border-neutral-200 rounded-full text-sm text-neutral-900 focus:outline-none focus:border-neutral-300 transition-all shadow-sm"
          />
        </div>
      </div>

      {/* Products Grid / List */}
      <div className="bg-white border border-neutral-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-neutral-50 border-b border-neutral-200 text-neutral-500 text-sm font-medium">
                <th className="py-4 px-6 font-medium w-16">Image</th>
                <th className="py-4 px-6 font-medium">Product Name</th>
                <th className="py-4 px-6 font-medium">Collection</th>
                <th className="py-4 px-6 font-medium">Price</th>
                <th className="py-4 px-6 font-medium">Variations</th>
                <th className="py-4 px-6 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-neutral-500">Loading products...</td>
                </tr>
              ) : filteredProducts.map(product => (
                <tr key={product.id} className="border-b border-neutral-100 hover:bg-neutral-50 transition-colors">
                  <td className="py-4 px-6">
                    <div className="w-12 h-12 rounded-lg bg-neutral-100 overflow-hidden border border-neutral-200">
                      {product.image_url ? (
                        <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package size={20} className="text-neutral-400" />
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <p className="font-medium text-neutral-900">{product.name}</p>
                    <p className="text-xs text-neutral-400 truncate max-w-[200px] mt-1">{product.description}</p>
                  </td>
                  <td className="py-4 px-6">
                    {product.collections?.name ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-blue-50 text-blue-600 border border-blue-200 rounded-lg text-xs font-medium">
                        <Folder size={12} />
                        {product.collections.name}
                      </span>
                    ) : (
                      <span className="text-neutral-400 text-xs italic">Uncategorized</span>
                    )}
                  </td>
                  <td className="py-4 px-6 font-medium text-neutral-900">${Number(product.price).toFixed(2)}</td>
                  <td className="py-4 px-6">
                    {product.variations && product.variations.length > 0 ? (
                      <span className="px-2 py-1 bg-purple-50 text-purple-600 border border-purple-200 rounded-lg text-xs font-medium">
                        {product.variations.length} options
                      </span>
                    ) : (
                      <span className="text-neutral-400 text-sm">None</span>
                    )}
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                       {/* Link to Edit Page */}
                      <Link href={`/admin/products/${product.id}/edit`} className="p-2 text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition" title="Edit">
                        <Edit size={16} />
                      </Link>
                      <button onClick={() => setProductToDelete(product)} className="p-2 text-neutral-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition" title="Delete">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              
              {!loading && filteredProducts.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-20 text-center">
                    <Package className="w-12 h-12 text-neutral-300 mx-auto mb-4" />
                    <p className="text-neutral-500 text-base mb-4">No products found in the database.</p>
                    <Link href="/admin/products/new" className="inline-flex items-center gap-2 bg-neutral-100 text-neutral-900 px-5 py-2 rounded-full text-sm font-medium hover:bg-neutral-200 transition">
                      Create Your First Product
                    </Link>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>


      <AnimatePresence>
        {productToDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white border border-neutral-200 p-6 rounded-2xl w-full max-w-md shadow-2xl relative"
            >
              <button 
                onClick={() => setProductToDelete(null)}
                className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-900 transition-colors"
                disabled={isDeleting}
              >
                <X size={20} />
              </button>
              
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center">
                  <AlertTriangle size={32} />
                </div>
                
                <h2 className="text-2xl font-light text-neutral-900">Delete Product?</h2>
                
                <p className="text-neutral-500 text-sm">
                  Are you sure you want to delete <span className="text-neutral-900 font-medium">{productToDelete.name}</span>? 
                  This action cannot be undone.
                </p>
                
                <div className="w-full grid grid-cols-2 gap-3 mt-6">
                  <button 
                    onClick={() => setProductToDelete(null)}
                    disabled={isDeleting}
                    className="py-3 px-4 bg-white hover:bg-neutral-50 border border-neutral-200 text-neutral-700 rounded-xl text-sm font-medium transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={confirmDelete}
                    disabled={isDeleting}
                    className="py-3 px-4 bg-red-500 hover:bg-red-600 text-white rounded-xl text-sm font-medium transition-colors disabled:opacity-50"
                  >
                    {isDeleting ? "Deleting..." : "Yes, Delete Product"}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
