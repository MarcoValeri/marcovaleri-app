'use client';

import React, { useEffect, useRef } from 'react';
import EditorJS, { OutputData } from '@editorjs/editorjs';
// @ts-ignore
import Header from '@editorjs/header'; 
// @ts-ignore
import List from '@editorjs/list';
// @ts-ignore
import ImageTool from '@editorjs/image';
import { uploadData, getUrl } from 'aws-amplify/storage';

interface EditorProps {
  data?: OutputData;
  editorRef: React.MutableRefObject<EditorJS | null>;
}

export default function Editor({ data, editorRef }: EditorProps) {
  const holderId = 'editorjs-container';

  // --- IMAGE UPLOADER ---
  const uploadToAmplify = async (file: File) => {
    try {
      const filename = `posts/${Date.now()}-${file.name}`;
      
      // 1. Upload to S3 (No options needed for default access)
      await uploadData({
        path: filename,
        data: file,
      }).result;

      // 2. Get the URL
      const urlResult = await getUrl({
        path: filename,
      });

      return {
        success: 1,
        file: {
          url: urlResult.url.toString(),
        }
      };
    } catch (error) {
      console.error("Upload failed:", error);
      return { success: 0 };
    }
  };

  // --- INITIALIZE EDITOR ---
  useEffect(() => {
    if (!editorRef.current) {
      const editor = new EditorJS({
        holder: holderId,
        data: data,
        placeholder: 'Start writing your story...',
        tools: { 
          // FIX: Cast these classes to 'any' to stop the TypeScript mismatch error
          header: {
            class: Header as any,
            inlineToolbar: true,
            config: { placeholder: 'Header' }
          }, 
          list: {
            class: List as any,
            inlineToolbar: true
          }, 
          image: {
            class: ImageTool as any,
            config: {
              uploader: {
                uploadByFile: uploadToAmplify,
              }
            }
          }
        },
      });
      editorRef.current = editor;
    }

    // Cleanup
    return () => {
      if (editorRef.current && editorRef.current.destroy) {
        editorRef.current.destroy();
        editorRef.current = null;
      }
    };
  }, []);

  return (
    <div 
      id={holderId} 
      className="prose max-w-none border border-gray-200 rounded-lg p-4 bg-white min-h-[300px]"
    />
  );
}