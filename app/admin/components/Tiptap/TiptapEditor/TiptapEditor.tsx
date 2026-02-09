'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Toolbar from '../Toolbar/Toolbar';
import ImagePicker from '../ImagePicker/ImagePicker';
import { useEffect, useState } from 'react';
import { generateClient } from 'aws-amplify/data';
import { getUrl } from 'aws-amplify/storage';
import type { Schema } from '@/amplify/data/resource';

const client = generateClient<Schema>();

type Props = {
  content: string;
  onChange: (richText: string) => void;
  placeholder?: string;
};

const TiptapEditor = ({ content, onChange, placeholder }: Props) => {
  const [showImagePicker, setShowImagePicker] = useState(false);
  const [availableImages, setAvailableImages] = useState<any[]>([]);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: placeholder || 'Start writing...',
        emptyEditorClass: 'is-editor-empty before:content-[attr(data-placeholder)] before:text-gray-400 before:absolute before:pointer-events-none',
      }),
      Link.configure({
        openOnClick: false, // Don't open links while editing
        HTMLAttributes: {
          class: 'text-blue-600 underline cursor-pointer',
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'rounded-lg max-w-full my-4 border border-gray-200',
        },
      }),
    ],
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose-base max-w-none focus:outline-none min-h-[300px] px-4 py-3 text-[#171C32] [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:mt-8 [&_h2]:mb-4 [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:mt-6 [&_h3]:mb-3 [&_p]:text-base [&_p]:leading-relaxed [&_p]:mb-4 [&_img]:mx-auto [&_img]:max-w-[80%] [&_img]:h-auto [&_img]:block [&_ul]:list-disc [&_ul]:ml-6 [&_ul]:mb-4 [&_ol]:list-decimal [&_ol]:ml-6 [&_ol]:mb-4 [&_li]:mb-1',
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    immediatelyRender: false,
  });

  // Sync content updates
  useEffect(() => {
    if (editor && content && editor.getHTML() !== content) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  // Function to load images from Amplify when picker opens
  const handleOpenImagePicker = async () => {
    try {
        // 1. Fetch Image records
        const { data } = await client.models.Image.list();
        
        // 2. Generate signed URLs for all of them
        const imagesWithUrls = await Promise.all(data.map(async (img) => {
            if (!img.url) return null;
            try {
                const urlResult = await getUrl({ path: img.url });
                return { 
                    id: img.id, 
                    name: img.name, 
                    url: urlResult.url.toString() 
                };
            } catch (e) { return null; }
        }));
        
        setAvailableImages(imagesWithUrls.filter(Boolean));
        setShowImagePicker(true);
    } catch (error) {
        console.error("Error loading images", error);
    }
  };

  const handleInsertImage = (image: any) => {
    if (editor) {
      editor.chain().focus().setImage({ src: image.url, alt: image.name }).run();
    }
    setShowImagePicker(false);
  };

  if (!editor) return null;

  return (
    <div className="w-full border rounded-md border-gray-300 bg-white shadow-sm flex flex-col relative">
      <Toolbar editor={editor} onImageClick={handleOpenImagePicker} />
      
      <div className="flex-1 cursor-text" onClick={() => editor.chain().focus().run()}>
        <EditorContent editor={editor} />
      </div>

      {showImagePicker && (
        <ImagePicker 
            images={availableImages}
            onSelect={handleInsertImage}
            onClose={() => setShowImagePicker(false)}
        />
      )}
    </div>
  );
};

export default TiptapEditor;