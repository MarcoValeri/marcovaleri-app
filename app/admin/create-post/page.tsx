'use client';

import { useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '@/amplify/data/resource'; 
import { useRouter } from 'next/navigation';

// 1. Dynamic Import is CRITICAL 
const Editor = dynamic(() => import('../components/Editor'), { ssr: false });

const client = generateClient<Schema>();

export default function CreatePostPage() {
  const editorRef = useRef<any>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();

  const handleSave = async () => {
    if (!title) return alert("Please enter a title");
    setIsSaving(true);

    try {
      // 1. Ask Editor.js for the data (Returns a JSON object of blocks)
      const contentBlocks = await editorRef.current.save();

      // 2. Save everything to DynamoDB
      await client.models.Article.create({
        title: title,
        description: description,
        content: contentBlocks, // <--- Saving the JSON directly!
        publishedAt: new Date().toISOString(),
        tags: ["General"], // You can add a real tag input later
      });

      alert('Article published successfully!');
      router.push('/admin'); 
    } catch (error) {
      console.error('Error creating post:', error);
      alert('Failed to save. Check the console for details.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-10 px-5">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Write New Article</h1>
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className={`px-6 py-3 rounded-lg font-bold text-white transition-all
            ${isSaving ? 'bg-gray-400 cursor-not-allowed' : 'bg-black hover:bg-gray-800 shadow-md'}
          `}
        >
          {isSaving ? 'Publishing...' : 'Publish Article'}
        </button>
      </div>

      <div className="flex flex-col gap-8">
        
        {/* Title Input */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-bold text-gray-500 uppercase tracking-wider">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter an eye-catching title..."
            className="w-full p-4 text-2xl font-bold border-b-2 border-gray-200 focus:border-black outline-none transition-colors placeholder-gray-300"
          />
        </div>

        {/* Short Description */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-bold text-gray-500 uppercase tracking-wider">SEO Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What is this article about?"
            rows={2}
            className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-200 outline-none resize-none text-gray-600"
          />
        </div>

        {/* The Block Editor */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-bold text-gray-500 uppercase tracking-wider">Content</label>
          <div className="prose max-w-none border border-gray-200 rounded-xl p-2 bg-white shadow-sm min-h-[500px]">
            {/* passing the ref allows us to call .save() from the parent */}
            <Editor editorRef={editorRef} />
          </div>
        </div>

      </div>
    </div>
  );
}