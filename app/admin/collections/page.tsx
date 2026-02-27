"use client";

import { useState, useEffect, useRef } from "react";
import { Plus, FolderPlus, Search, Edit, Trash2, AlertTriangle, X, Image as ImageIcon, Upload, CheckCircle2, AlertCircle } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminCollectionsPage() {
  const [collections, setCollections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentCollectionId, setCurrentCollectionId] = useState<string | null>(null);
  
  // Form State
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [saving, setSaving] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  // Delete State
  const [collectionToDelete, setCollectionToDelete] = useState<any>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 30;

  const supabase = createClient();

  useEffect(() => {
    fetchCollections();
  }, []);

  const fetchCollections = async () => {
    setLoading(true);
    // Fetch collections and a count of how many products they have
    const { data, error } = await supabase
      .from('collections')
      .select('*, products(count)')
      .order('created_at', { ascending: false });

    if (data) setCollections(data);
    setLoading(false);
  };

  const handleOpenNewModal = () => {
    setIsEditMode(false);
    setCurrentCollectionId(null);
    setName("");
    setDescription("");
    setImageUrl("");
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (collection: any) => {
    setIsEditMode(true);
    setCurrentCollectionId(collection.id);
    setName(collection.name);
    setDescription(collection.description || "");
    setImageUrl(collection.image_url || "");
    setIsModalOpen(true);
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

  const handleSaveCollection = async () => {
    if (!name.trim()) {
      setNotification({ type: 'error', message: "Collection name is required" });
      return;
    }
    
    setSaving(true);
    
    const collectionData = {
      name,
      description,
      image_url: imageUrl || null
    };

    let error;

    if (isEditMode && currentCollectionId) {
      // Update
      const res = await supabase
        .from('collections')
        .update(collectionData)
        .eq('id', currentCollectionId);
      error = res.error;
    } else {
      // Create - Hit API to bypass RLS if needed, or hit direct if logged in.
      const res = await fetch('/api/collections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(collectionData)
      });
      if (!res.ok) {
        error = new Error("Failed to create collection via API");
      }
    }

    setSaving(false);

    if (error) {
      setNotification({ type: 'error', message: "Error saving collection: " + error.message });
    } else {
      setNotification({ type: 'success', message: "Collection saved successfully!" });
      setIsModalOpen(false);
      fetchCollections();
    }
  };

  const confirmDelete = async () => {
    if (!collectionToDelete) return;
    setIsDeleting(true);
    
    const { error } = await supabase.from('collections').delete().eq('id', collectionToDelete.id);
    
    setIsDeleting(false);
    
    if (error) {
      setNotification({ type: 'error', message: "Failed to delete collection. It might have products tied to it. " + error.message });
    } else {
      setNotification({ type: 'success', message: "Collection deleted successfully" });
      setCollections(collections.filter(c => c.id !== collectionToDelete.id));
      setCollectionToDelete(null);
    }
  };

  // Pagination & Filtering Logic
  const filteredCollections = collections.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase())
  );
  
  const totalPages = Math.ceil(filteredCollections.length / itemsPerPage);
  const paginatedCollections = filteredCollections.slice(
    (currentPage - 1) * itemsPerPage, 
    currentPage * itemsPerPage
  );

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
          <h1 className="text-3xl font-light tracking-tight text-neutral-900 mb-2">Collections</h1>
          <p className="text-neutral-500 text-sm">Manage product categories, update banners and descriptions.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={handleOpenNewModal}
            className="flex items-center gap-2 bg-neutral-900 text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-neutral-800 transition shadow-sm"
          >
            <FolderPlus size={16} />
            Add Collection
          </button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <input 
            type="text" 
            placeholder="Search collections..." 
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1); // Reset pagination on search
            }}
            className="w-full pl-10 pr-4 py-2 bg-white border border-neutral-200 rounded-full text-sm text-neutral-900 focus:outline-none focus:border-neutral-300 transition-all shadow-sm"
          />
        </div>
      </div>

      {/* Collections Table */}
      <div className="bg-white border border-neutral-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-neutral-50 border-b border-neutral-200 text-neutral-500 text-sm font-medium">
                <th className="py-4 px-6 font-medium w-24">Image</th>
                <th className="py-4 px-6 font-medium">Collection Name</th>
                <th className="py-4 px-6 font-medium">Description</th>
                <th className="py-4 px-6 font-medium">Products</th>
                <th className="py-4 px-6 font-medium">Date Created</th>
                <th className="py-4 px-6 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-neutral-500">Loading collections...</td>
                </tr>
              ) : paginatedCollections.map(collection => (
                <tr key={collection.id} className="border-b border-neutral-100 hover:bg-neutral-50 transition-colors">
                  <td className="py-4 px-4 w-24">
                    <div className="w-16 h-12 rounded-lg bg-neutral-100 overflow-hidden border border-neutral-200 relative">
                      {collection.image_url ? (
                        <img src={collection.image_url} alt={collection.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ImageIcon size={16} className="text-neutral-400" />
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <p className="font-medium text-neutral-900">{collection.name}</p>
                  </td>
                  <td className="py-4 px-6">
                     <p className="text-sm text-neutral-500 truncate max-w-[250px]">
                       {collection.description || <span className="italic">No description</span>}
                     </p>
                  </td>
                  <td className="py-4 px-6">
                    <span className="inline-flex items-center justify-center px-2.5 py-1 bg-neutral-100 border border-neutral-200 rounded-lg text-xs font-medium text-neutral-700 min-w-[32px]">
                      {collection.products?.[0]?.count || 0}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-sm text-neutral-500">
                    {new Date(collection.created_at).toLocaleDateString()}
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => handleOpenEditModal(collection)}
                        className="p-2 text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition" 
                        title="Edit"
                      >
                        <Edit size={16} />
                      </button>
                      <button 
                        onClick={() => setCollectionToDelete(collection)}
                        className="p-2 text-neutral-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition" 
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              
              {!loading && filteredCollections.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-20 text-center">
                    <FolderPlus className="w-12 h-12 text-neutral-300 mx-auto mb-4" />
                    <p className="text-neutral-500 text-base mb-4">No collections found.</p>
                    <button 
                      onClick={handleOpenNewModal}
                      className="inline-flex items-center gap-2 bg-neutral-100 text-neutral-900 px-5 py-2 rounded-full text-sm font-medium hover:bg-neutral-200 transition"
                    >
                      Create First Collection
                    </button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination Controls */}
        {!loading && totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 bg-neutral-50 border-t border-neutral-200">
            <p className="text-sm text-neutral-500">
              Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredCollections.length)} of {filteredCollections.length} entries
            </p>
            <div className="flex gap-2">
              <button 
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 bg-white border border-neutral-200 text-neutral-700 rounded text-sm disabled:opacity-50 hover:bg-neutral-100 transition-colors"
              >
                Previous
              </button>
              <button 
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 bg-white border border-neutral-200 text-neutral-700 rounded text-sm disabled:opacity-50 hover:bg-neutral-100 transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Add / Edit Form Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm overflow-y-auto">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white border border-neutral-200 p-8 rounded-3xl w-full max-w-xl shadow-2xl relative my-8"
            >
              <button 
                onClick={() => setIsModalOpen(false)}
                className="absolute top-6 right-6 text-neutral-400 hover:text-neutral-900 transition-colors"
              >
                <X size={24} />
              </button>
              
              <h2 className="text-2xl font-light tracking-tight text-neutral-900 mb-8">
                {isEditMode ? "Edit Collection" : "Add New Collection"}
              </h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">Collection Name *</label>
                  <input 
                    type="text" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Summer Release" 
                    className="w-full bg-neutral-50 text-neutral-900 border border-neutral-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-neutral-400 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">Banner Image</label>
                  
                  <input 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                  />

                  {imageUrl ? (
                    <div className="relative rounded-xl overflow-hidden border border-neutral-200 group h-32">
                      <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
                      <button 
                        onClick={() => setImageUrl("")}
                        className="absolute top-2 right-2 p-1 bg-white/80 text-neutral-900 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-100 hover:text-red-500 shadow-sm"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ) : (
                    <div 
                      onClick={() => fileInputRef.current?.click()}
                      className="border-2 border-dashed border-neutral-200 rounded-xl flex flex-col items-center justify-center text-center cursor-pointer hover:border-neutral-300 hover:bg-neutral-50 transition-colors group h-32"
                    >
                      <Upload className="w-6 h-6 text-neutral-400 group-hover:text-orange-500 transition-colors mb-2" />
                      <p className="text-sm font-medium text-neutral-600">
                        {uploading ? "Uploading..." : "Upload Cover Image"}
                      </p>
                    </div>
                  )}
                  
                  <div className="mt-3">
                     <input 
                        type="text" 
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                        placeholder="Or paste URL here..." 
                        className="w-full bg-neutral-50 text-neutral-900 border border-neutral-200 rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-neutral-400 transition-colors"
                      />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">Description</label>
                  <textarea 
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Brief description of this collection..." 
                    className="w-full bg-neutral-50 text-neutral-900 border border-neutral-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-neutral-400 transition-colors resize-none"
                  />
                </div>
                
                <div className="pt-4 border-t border-neutral-100 flex justify-end gap-3">
                  <button 
                    onClick={() => setIsModalOpen(false)}
                    className="px-6 py-3 bg-white hover:bg-neutral-50 border border-neutral-200 text-neutral-700 rounded-xl text-sm font-medium transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleSaveCollection}
                    disabled={saving}
                    className="px-8 py-3 bg-neutral-900 text-white rounded-xl text-sm font-medium hover:bg-neutral-800 transition-colors disabled:opacity-50"
                  >
                    {saving ? "Saving..." : "Save Collection"}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>


      <AnimatePresence>
        {collectionToDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white border border-neutral-200 p-6 rounded-2xl w-full max-w-sm shadow-2xl relative text-center"
            >
              <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                 <AlertTriangle size={32} />
              </div>
              <h2 className="text-xl font-medium text-neutral-900 mb-2">Delete Collection?</h2>
              <p className="text-neutral-500 text-sm mb-6">
                Are you sure you want to delete <span className="text-neutral-900 font-medium">"{collectionToDelete.name}"</span>? 
                Products inside will lose this category.
              </p>
              
              <div className="grid grid-cols-2 gap-3">
                <button 
                  onClick={() => setCollectionToDelete(null)}
                  disabled={isDeleting}
                  className="py-3 bg-white hover:bg-neutral-50 border border-neutral-200 text-neutral-700 rounded-xl text-sm transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={confirmDelete}
                  disabled={isDeleting}
                  className="py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl text-sm font-medium transition-colors"
                >
                  {isDeleting ? "Deleting..." : "Delete"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
