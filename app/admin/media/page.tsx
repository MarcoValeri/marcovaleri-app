'use client';

import { useState, useEffect } from 'react';
import { uploadData, remove, getUrl } from 'aws-amplify/storage';
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '@/amplify/data/resource';

const client = generateClient<Schema>();

// Helper for filenames
function slugify(text: string): string {
  return text.toString().toLowerCase().trim()
    .replace(/\s+/g, '-').replace(/&/g, '-and-')
    .replace(/[^\w\-]+/g, '').replace(/\-\-+/g, '-');
}

export default function MediaManagerPage() {
  const [mediaItems, setMediaItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Form State
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [altText, setAltText] = useState('');
  const [caption, setCaption] = useState('');
  
  // Logic State
  const [isUploading, setIsUploading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // --- 1. Fetch Media ---
  const fetchMedia = async () => {
    setLoading(true);
    try {
      console.log("Fetching media...");
      // FIX: Explicitly use 'userPool' so we see what Admins see
      const { data: dbItems } = await client.models.Media.list({
        authMode: 'userPool'
      });
      
      console.log("DB Items found:", dbItems.length);

      const fullItems = await Promise.all(
        dbItems.map(async (item) => {
          const urlResult = await getUrl({ path: item.path });
          return { ...item, url: urlResult.url.toString() };
        })
      );
      
      setMediaItems(fullItems.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      ));
    } catch (e) { 
      console.error("Fetch error:", e); 
    } finally { 
      setLoading(false); 
    }
  };

  useEffect(() => { fetchMedia(); }, []);

  // --- 2. Load Item for Editing ---
  const handleEditClick = (item: any) => {
    setEditingId(item.id);
    setTitle(item.title || '');
    setAltText(item.altText || '');
    setCaption(item.caption || '');
    setFile(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // --- 3. Cancel Edit ---
  const resetForm = () => {
    setEditingId(null);
    setFile(null);
    setTitle('');
    setAltText('');
    setCaption('');
  };

  // --- 4. Handle Save (Create OR Update) ---
  const handleSave = async () => {
    if (!editingId && !file) return alert("Please select a file first");
    
    setIsUploading(true);
    try {
      // === UPDATE EXISTING ===
      if (editingId) {
        // FIX: Use authMode: 'userPool'
        await client.models.Media.update({
          id: editingId,
          title,
          altText,
          caption,
        }, { authMode: 'userPool' });
        
        alert("Image details updated!");
      } 
      // === CREATE NEW ===
      else if (file) {
        const assetTitle = title || file.name.split('.')[0]; 
        const fileExtension = file.name.split('.').pop();
        const safeSlug = slugify(assetTitle);
        const uniqueId = Math.random().toString(36).substring(2, 5);
        const filename = `posts/${safeSlug}-${uniqueId}.${fileExtension}`;

        // A. Upload to S3
        await uploadData({ path: filename, data: file }).result;

        // B. Save to Database
        // FIX: Use authMode: 'userPool' to prove we are Admin
        await client.models.Media.create({
          path: filename,
          title: assetTitle,
          altText: altText || assetTitle,
          caption: caption,
          description: "", 
        }, { authMode: 'userPool' });
      }

      resetForm();
      await fetchMedia(); // Refresh list immediately
    } catch (e) {
      console.error("Save error:", e);
      alert("Action failed. Check console.");
    } finally {
      setIsUploading(false);
    }
  };

  // --- 5. Handle Delete ---
  const handleDelete = async (id: string, path: string) => {
    if (!confirm("Are you sure? This cannot be undone.")) return;
    try {
      // FIX: Use authMode: 'userPool'
      await client.models.Media.delete({ id }, { authMode: 'userPool' });
      await remove({ path });
      
      if (editingId === id) resetForm();
      fetchMedia();
    } catch (e) { 
      console.error("Delete error:", e);
      alert("Delete failed"); 
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-10 px-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Media Manager</h1>
        {editingId && (
           <span className="bg-yellow-100 text-yellow-800 text-xs font-bold px-3 py-1 rounded-full animate-pulse">
             EDITING MODE
           </span>
        )}
      </div>

      {/* --- Form --- */}
      <div className={`p-6 rounded-xl border mb-10 shadow-sm transition-colors ${editingId ? 'bg-yellow-50 border-yellow-200' : 'bg-gray-50 border-gray-200'}`}>
        
        <div className="mb-4">
          <h2 className="font-bold text-lg">{editingId ? '✏️ Edit Details' : '☁️ Upload New'}</h2>
          {editingId && <p className="text-sm text-gray-500">You are updating the text details. To replace the image itself, please delete and re-upload.</p>}
        </div>

        <div className="flex flex-col gap-6">
          {!editingId && (
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Select Image</label>
              <input 
                type="file" 
                accept="image/*"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-black file:text-white hover:file:bg-gray-800 cursor-pointer"
              />
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Title</label>
              <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full p-2 border border-gray-300 rounded focus:border-black outline-none bg-white"/>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Alt Text</label>
              <input type="text" value={altText} onChange={(e) => setAltText(e.target.value)} className="w-full p-2 border border-gray-300 rounded focus:border-black outline-none bg-white"/>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Caption</label>
              <input type="text" value={caption} onChange={(e) => setCaption(e.target.value)} className="w-full p-2 border border-gray-300 rounded focus:border-black outline-none bg-white"/>
            </div>
          </div>

          <div className="flex gap-3 justify-end">
            {editingId && (
              <button onClick={resetForm} className="px-6 py-3 rounded-lg font-bold text-gray-600 hover:bg-gray-200">Cancel</button>
            )}
            <button 
              onClick={handleSave}
              disabled={(!file && !editingId) || isUploading}
              className={`px-8 py-3 rounded-lg font-bold text-white shadow-md transition-all ${(!file && !editingId) || isUploading ? 'bg-gray-300 cursor-not-allowed' : 'bg-black hover:bg-gray-800'}`}
            >
              {isUploading ? 'Saving...' : (editingId ? 'Update Details' : 'Save Asset')}
            </button>
          </div>
        </div>
      </div>

      {/* --- Grid --- */}
      {loading && <div className="text-center py-20">Loading...</div>}
      
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {mediaItems.map((item) => (
          <div key={item.id} className={`group relative bg-white border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all ${editingId === item.id ? 'ring-4 ring-yellow-400' : ''}`}>
            <div className="aspect-square bg-gray-100 relative overflow-hidden">
               <img src={item.url} alt={item.altText} className="w-full h-full object-cover" />
               <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition flex flex-col items-center justify-center gap-2 p-4">
                 <button onClick={() => handleEditClick(item)} className="bg-yellow-400 text-black hover:bg-yellow-300 text-xs font-bold px-4 py-2 rounded-full w-full">✏️ Edit</button>
                 <button onClick={() => handleDelete(item.id, item.path)} className="bg-red-600 hover:bg-red-500 text-white text-xs font-bold px-4 py-2 rounded-full w-full">🗑️ Delete</button>
                 <button onClick={() => { navigator.clipboard.writeText(item.url); alert("Copied!"); }} className="bg-white text-black text-xs font-bold px-4 py-2 rounded-full w-full">🔗 Copy URL</button>
               </div>
            </div>
            <div className="p-3 bg-white">
              <p className="font-bold text-sm truncate">{item.title}</p>
              {item.caption && <p className="text-[10px] text-gray-500 truncate mt-1 italic">{item.caption}</p>}
            </div>
          </div>
        ))}
      </div>

      {!loading && mediaItems.length === 0 && (
        <div className="text-center py-20 bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl mt-10">
          <p className="text-xl font-bold text-gray-400">Library is Empty</p>
          <p className="text-gray-500 mt-2">Upload a new image above to create your first database record!</p>
        </div>
      )}
    </div>
  );
}