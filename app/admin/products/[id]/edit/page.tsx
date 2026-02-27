"use client";

import { useState, useEffect, useRef, use } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, Plus, Trash2, Tag, Info, Image as ImageIcon, X, FolderPlus, ArrowLeft, CheckCircle2, AlertCircle } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";

export default function AdminEditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [sku, setSku] = useState("");
  
  const [variations, setVariations] = useState<{ id: number, name: string, priceModifier: number }[]>([]);
  const [hasVariations, setHasVariations] = useState(false);
  
  const [specifications, setSpecifications] = useState<{ id: number, key: string, value: string }[]>([]);
  const [hasSpecifications, setHasSpecifications] = useState(false);
  
  const [collections, setCollections] = useState<any[]>([]);
  const [selectedCollection, setSelectedCollection] = useState("");
  const [isCollectionModalOpen, setIsCollectionModalOpen] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState("");
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error', message: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    fetchCollections();
    fetchProduct();
  }, [id]);

  const fetchCollections = async () => {
    const res = await fetch('/api/collections');
    if (res.ok) {
      const { data } = await res.json();
      setCollections(data || []);
    }
  };

  const fetchProduct = async () => {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();

    if (data) {
      setName(data.name || "");
      setDescription(data.description || "");
      setPrice(data.price?.toString() || "");
      setImageUrl(data.image_url || "");
      setSku(data.sku || "");
      setSelectedCollection(data.collection_id || "");
      if (data.variations && data.variations.length > 0) {
        setHasVariations(true);
        setVariations(data.variations.map((v: any, i: number) => ({
          id: i,
          name: v.name,
          priceModifier: v.price_modifier
        })));
      }
      
      if (data.specifications && Object.keys(data.specifications).length > 0) {
        setHasSpecifications(true);
        const specsArray = Object.entries(data.specifications).map(([key, value], i) => ({
          id: i,
          key: key,
          value: value as string
        }));
        setSpecifications(specsArray);
      }
    }
    setLoading(false);
  };

  const handleCreateCollection = () => {
    router.push('/admin/collections');
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });
      
      const data = await res.json();
      if (res.ok) {
        setImageUrl(data.publicUrl);
        setNotification({ type: 'success', message: 'Image uploaded successfully' });
      } else {
        setNotification({ type: 'error', message: "Upload failed: " + data.error });
      }
    } catch (err) {
      setNotification({ type: 'error', message: "Error uploading file" });
    } finally {
      setUploading(false);
    }
  };

  const addVariation = () => {
    setVariations([...variations, { id: Date.now(), name: "", priceModifier: 0 }]);
  };

  const removeVariation = (id: number) => {
    setVariations(variations.filter(v => v.id !== id));
  };

  const handleUpdateVariation = (id: number, field: string, value: string | number) => {
    setVariations(variations.map(v => v.id === id ? { ...v, [field]: value } : v));
  };

  const addSpecification = () => {
    setSpecifications([...specifications, { id: Date.now(), key: "", value: "" }]);
  };

  const removeSpecification = (id: number) => {
    setSpecifications(specifications.filter(s => s.id !== id));
  };

  const handleUpdateSpecification = (id: number, field: string, value: string) => {
    setSpecifications(specifications.map(s => s.id === id ? { ...s, [field]: value } : s));
  };

  const handleSave = async () => {
    if (!name || !price) {
      setNotification({ type: 'error', message: "Name and price are required" });
      return;
    }
    setSaving(true);

    const productData = {
      name,
      description,
      price: parseFloat(price),
      image_url: imageUrl || 'https://via.placeholder.com/400',
      sku,
      collection_id: selectedCollection || null,
      variations: hasVariations ? variations.map(v => ({ name: v.name, price_modifier: v.priceModifier })) : null,
      specifications: hasSpecifications ? specifications.reduce((acc, curr) => {
        if (curr.key) acc[curr.key] = curr.value;
        return acc;
      }, {} as Record<string, string>) : null
    };

    const { error } = await supabase
      .from('products')
      .update(productData)
      .eq('id', id);

    setSaving(false);

    if (error) {
      setNotification({ type: 'error', message: "Error updating product: " + error.message });
    } else {
      setNotification({ type: 'success', message: "Product Updated Successfully!" });
      setTimeout(() => {
        router.push('/admin/products');
      }, 1500);
    }
  };

  if (loading) return <div className="p-8 text-white/50 text-center">Loading product data...</div>;

  return (
    <div className="space-y-8 relative font-sans">
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-4 right-4 z-50 p-4 rounded-xl shadow-lg flex items-center gap-3 \${
              notification.type === 'success' ? 'bg-emerald-50 border border-emerald-200 text-emerald-700' : 'bg-red-50 border border-red-200 text-red-700'
            }`}
          >
            {notification.type === 'success' ? <CheckCircle2 size={20} className="text-emerald-500" /> : <AlertCircle size={20} className="text-red-500" />}
            <p className="font-medium text-sm">{notification.message}</p>
            <button onClick={() => setNotification(null)} className="ml-4 opacity-50 hover:opacity-100"><X size={16} /></button>
          </motion.div>
        )}
      </AnimatePresence>

      <Link href="/admin/products" className="inline-flex items-center gap-2 text-neutral-500 hover:text-neutral-900 mb-2 text-sm transition-colors">
        <ArrowLeft size={16} /> Back to Products
      </Link>
      <div>
        <h1 className="text-3xl font-light tracking-tight text-neutral-900 mb-2">Edit Product</h1>
        <p className="text-neutral-500 text-sm">Update product details, pricing, and variations.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Form Fields */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-sm">
            <h2 className="text-xl font-medium mb-6 flex items-center gap-2 text-neutral-900">
              <Info className="w-5 h-5 text-blue-500" />
              Basic Details
            </h2>
            
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">Product Name</label>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Premium Business Soft Landing" 
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 text-sm text-neutral-900 focus:outline-none focus:border-neutral-300 focus:bg-white transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">Collection</label>
                <div className="flex gap-2">
                  <select 
                    value={selectedCollection}
                    onChange={(e) => setSelectedCollection(e.target.value)}
                    className="flex-1 bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 text-sm text-neutral-900 focus:outline-none focus:border-neutral-300 focus:bg-white transition-colors appearance-none"
                  >
                    <option value="" disabled>Select a collection</option>
                    {collections.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                  <button 
                    onClick={handleCreateCollection}
                    className="px-4 py-3 bg-neutral-100 hover:bg-neutral-200 border border-neutral-200 text-neutral-700 rounded-xl text-sm transition-colors flex items-center gap-2"
                  >
                    <FolderPlus size={16} />
                    Manage
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">Description</label>
                <textarea 
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Detailed description of the product or service..." 
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 text-sm text-neutral-900 focus:outline-none focus:border-neutral-300 focus:bg-white transition-colors resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">Base Price ($)</label>
                  <input 
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="0.00" 
                    className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 text-sm text-neutral-900 focus:outline-none focus:border-neutral-300 focus:bg-white transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">SKU / Code</label>
                  <input 
                    type="text"
                    value={sku}
                    onChange={(e) => setSku(e.target.value)}
                    placeholder="PRD-001" 
                    className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 text-sm text-neutral-900 focus:outline-none focus:border-neutral-300 focus:bg-white transition-colors"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Variations Section */}
          <div className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-medium flex items-center gap-2 text-neutral-900">
                <Tag className="w-5 h-5 text-purple-500" />
                Variations (Optional)
              </h2>
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={hasVariations} 
                  onChange={(e) => setHasVariations(e.target.checked)}
                  className="w-4 h-4 rounded bg-neutral-100 border-neutral-300 text-purple-600 focus:ring-purple-500" 
                />
                <span className="text-sm text-neutral-700">Enable Variations</span>
              </label>
            </div>

            {hasVariations && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="space-y-4"
              >
                {variations.length === 0 && (
                  <p className="text-sm text-neutral-400 text-center py-4">No variations added yet.</p>
                )}

                {variations.map((variation, index) => (
                  <div key={variation.id} className="flex items-center gap-4 bg-neutral-50 p-4 border border-neutral-200 rounded-xl">
                    <div className="flex-1">
                      <input 
                        type="text" 
                        value={variation.name}
                        onChange={(e) => handleUpdateVariation(variation.id, 'name', e.target.value)}
                        placeholder="e.g. Color: Red, Size: Large" 
                        className="w-full bg-transparent border-b border-neutral-300 px-2 py-1 text-sm text-neutral-900 focus:outline-none focus:border-neutral-400 placeholder-neutral-400"
                      />
                    </div>
                    <div className="w-32">
                      <input 
                        type="number" 
                        value={variation.priceModifier}
                        onChange={(e) => handleUpdateVariation(variation.id, 'priceModifier', parseFloat(e.target.value))}
                        placeholder="Price Mod" 
                        className="w-full bg-transparent border-b border-neutral-300 px-2 py-1 text-sm text-neutral-900 focus:outline-none focus:border-neutral-400 placeholder-neutral-400"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => {
                          setNotification({ type: 'success', message: `Variation "\${variation.name || 'New'}" confirmed.` });
                        }}
                        className="p-2 text-emerald-600/50 hover:text-emerald-600 transition-colors rounded-lg hover:bg-emerald-50"
                        title="Confirm Variation Details"
                      >
                        <CheckCircle2 size={18} />
                      </button>
                      <button 
                        onClick={() => removeVariation(variation.id)}
                        className="p-2 text-neutral-400 hover:text-red-500 transition-colors rounded-lg hover:bg-red-50"
                        title="Remove Variation"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))}

                <button 
                  onClick={addVariation}
                  className="flex items-center gap-2 px-4 py-2 mt-4 text-sm font-medium text-neutral-600 hover:text-neutral-900 bg-neutral-50 hover:bg-neutral-100 rounded-lg transition-colors border border-neutral-200 border-dashed w-full justify-center"
                >
                  <Plus size={16} />
                  Add New Variation
                </button>
              </motion.div>
            )}
          </div>

          {/* Specifications Section */}
          <div className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-medium flex items-center gap-2 text-neutral-900">
                <Info className="w-5 h-5 text-indigo-500" />
                Specifications (Optional)
              </h2>
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={hasSpecifications} 
                  onChange={(e) => setHasSpecifications(e.target.checked)}
                  className="w-4 h-4 rounded bg-neutral-100 border-neutral-300 text-indigo-600 focus:ring-indigo-500" 
                />
                <span className="text-sm text-neutral-700">Enable Specifications</span>
              </label>
            </div>

            {hasSpecifications && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="space-y-4"
              >
                {specifications.length === 0 && (
                  <p className="text-sm text-neutral-400 text-center py-4">No specifications added yet.</p>
                )}

                {specifications.map((spec) => (
                  <div key={spec.id} className="flex items-center gap-4 bg-neutral-50 p-4 border border-neutral-200 rounded-xl">
                    <div className="w-1/3">
                      <input 
                        type="text" 
                        value={spec.key}
                        onChange={(e) => handleUpdateSpecification(spec.id, 'key', e.target.value)}
                        placeholder="e.g. Dimensions" 
                        className="w-full bg-transparent border-b border-neutral-300 px-2 py-1 text-sm text-neutral-900 focus:outline-none focus:border-neutral-400 placeholder-neutral-400"
                      />
                    </div>
                    <div className="flex-1">
                      <input 
                        type="text" 
                        value={spec.value}
                        onChange={(e) => handleUpdateSpecification(spec.id, 'value', e.target.value)}
                        placeholder="e.g. 50cm x 100cm" 
                        className="w-full bg-transparent border-b border-neutral-300 px-2 py-1 text-sm text-neutral-900 focus:outline-none focus:border-neutral-400 placeholder-neutral-400"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                       <button 
                        onClick={() => removeSpecification(spec.id)}
                        className="p-2 text-neutral-400 hover:text-red-500 transition-colors rounded-lg hover:bg-red-50"
                        title="Remove Specification"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))}

                <button 
                  onClick={addSpecification}
                  className="flex items-center gap-2 px-4 py-2 mt-4 text-sm font-medium text-neutral-600 hover:text-neutral-900 bg-neutral-50 hover:bg-neutral-100 rounded-lg transition-colors border border-neutral-200 border-dashed w-full justify-center"
                >
                  <Plus size={16} />
                  Add Specification
                </button>
              </motion.div>
            )}
          </div>
        </div>

        {/* Sidebar Fields (Image & Publish) */}
        <div className="space-y-6">
          <div className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-sm">
            <h2 className="text-xl font-medium mb-6 flex items-center gap-2 text-neutral-900">
              <ImageIcon className="w-5 h-5 text-emerald-500" />
              Product Image
            </h2>
            
            <input 
              type="file" 
              accept="image/*" 
              className="hidden" 
              ref={fileInputRef}
              onChange={handleFileUpload}
            />

            {imageUrl ? (
              <div className="relative rounded-xl overflow-hidden border border-neutral-200 group">
                <img src={imageUrl} alt="Preview" className="w-full h-48 object-cover" />
                <button 
                  onClick={() => setImageUrl("")}
                  className="absolute top-2 right-2 p-1 bg-white/80 backdrop-blur-sm text-neutral-900 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500 hover:text-white"
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-neutral-200 rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:border-neutral-300 hover:bg-neutral-50 transition-colors group h-48"
              >
                <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Upload className="w-8 h-8 text-neutral-400 group-hover:text-emerald-500 transition-colors" />
                </div>
                <p className="text-sm font-medium text-neutral-700 mb-1">
                  {uploading ? "Uploading..." : "Click to upload image"}
                </p>
                <p className="text-xs text-neutral-400">SVG, PNG, JPG or WEBP (max. 5MB)</p>
              </div>
            )}
            
            <div className="mt-4">
               <label className="block text-xs font-medium text-neutral-500 mb-2 uppercase tracking-wide">Or Paste URL</label>
               <input 
                  type="text" 
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://example.com/image.png" 
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-2 text-sm text-neutral-900 focus:outline-none focus:border-neutral-300 focus:bg-white transition-colors placeholder-neutral-400"
                />
            </div>
          </div>

          <div className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-sm">
            <h2 className="text-xl font-medium mb-6 text-neutral-900">Status</h2>
            
            <select className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 text-sm text-neutral-900 focus:outline-none focus:border-neutral-300 focus:bg-white transition-colors mb-6 appearance-none">
              <option>Active</option>
              <option>Draft</option>
              <option>Archived</option>
            </select>

            <button 
              onClick={handleSave}
              disabled={saving}
              className="w-full py-3 bg-neutral-900 text-white font-medium rounded-xl hover:bg-neutral-800 transition-colors shadow-sm"
            >
              {saving ? "Updating..." : "Update Product"}
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}
