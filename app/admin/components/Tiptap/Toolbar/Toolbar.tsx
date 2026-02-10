'use client';

import { type Editor } from '@tiptap/react';
import { useState } from 'react';
import { 
  LuBold, LuItalic, LuStrikethrough, LuCode, 
  LuHeading2, LuHeading3, LuList, LuListOrdered, 
  LuQuote, LuMinus, LuUndo, LuRedo, 
  LuLink, LuImage, LuX 
} from "react-icons/lu";

type Props = {
  editor: Editor | null;
  onImageClick: () => void; // New prop to trigger the picker
};

const Toolbar = ({ editor, onImageClick }: Props) => {
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [linkType, setLinkType] = useState<'external' | 'internal'>('external');
  const [linkUrl, setLinkUrl] = useState('');

  if (!editor) return null;

  const handleLinkSubmit = () => {
    if (!linkUrl.trim()) {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
    } else {
      const finalUrl = linkType === 'internal' && !linkUrl.startsWith('/') ? `/${linkUrl}` : linkUrl;
      editor.chain().focus().extendMarkRange('link').setLink({ href: finalUrl }).run();
    }
    setShowLinkModal(false);
    setLinkUrl('');
  };

  const openLinkModal = () => {
    const previousUrl = editor.getAttributes('link').href || '';
    setLinkUrl(previousUrl);
    setLinkType(previousUrl.startsWith('http') ? 'external' : 'internal');
    setShowLinkModal(true);
  };

  return (
    <div className="border-b border-gray-300 bg-gray-50 p-2 flex flex-wrap gap-1 items-center rounded-t-md sticky top-0 z-10">
      
      {/* History */}
      <div className="flex items-center border-r border-gray-300 pr-2 mr-2 space-x-1">
        <button onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()} className="p-2 hover:bg-gray-200 rounded text-gray-600 disabled:opacity-30"><LuUndo className="w-4 h-4"/></button>
        <button onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()} className="p-2 hover:bg-gray-200 rounded text-gray-600 disabled:opacity-30"><LuRedo className="w-4 h-4"/></button>
      </div>

      {/* Formatting */}
      <Toggle pressed={editor.isActive('bold')} onClick={() => editor.chain().focus().toggleBold().run()} icon={<LuBold className="w-4 h-4"/>} />
      <Toggle pressed={editor.isActive('italic')} onClick={() => editor.chain().focus().toggleItalic().run()} icon={<LuItalic className="w-4 h-4"/>} />
      <Toggle pressed={editor.isActive('strike')} onClick={() => editor.chain().focus().toggleStrike().run()} icon={<LuStrikethrough className="w-4 h-4"/>} />
      
      {/* Headings */}
      <div className="w-px h-6 bg-gray-300 mx-1"></div>
      <Toggle pressed={editor.isActive('heading', { level: 2 })} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} icon={<LuHeading2 className="w-4 h-4"/>} />
      <Toggle pressed={editor.isActive('heading', { level: 3 })} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} icon={<LuHeading3 className="w-4 h-4"/>} />

      {/* Lists */}
      <div className="w-px h-6 bg-gray-300 mx-1"></div>
      <Toggle pressed={editor.isActive('bulletList')} onClick={() => editor.chain().focus().toggleBulletList().run()} icon={<LuList className="w-4 h-4"/>} />
      <Toggle pressed={editor.isActive('orderedList')} onClick={() => editor.chain().focus().toggleOrderedList().run()} icon={<LuListOrdered className="w-4 h-4"/>} />

      {/* Inserts (Link & Image) */}
      <div className="w-px h-6 bg-gray-300 mx-1"></div>
      
      <button
        type="button"
        onClick={openLinkModal}
        className={`p-2 rounded transition-colors ${editor.isActive('link') ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-200'}`}
        title="Add Link"
      >
        <LuLink className="w-4 h-4" />
      </button>

      <button
        type="button"
        onClick={onImageClick}
        className="p-2 rounded text-gray-600 hover:bg-gray-200 transition-colors"
        title="Add Image"
      >
        <LuImage className="w-4 h-4" />
      </button>

      {showLinkModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 max-w-[90vw]">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Add Link</h3>
              <button onClick={() => setShowLinkModal(false)} className="text-gray-400 hover:text-gray-600">
                <LuX className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="flex gap-4">
                <label className="flex items-center">
                  <input 
                    type="radio" 
                    checked={linkType === 'external'} 
                    onChange={() => setLinkType('external')}
                    className="mr-2"
                  />
                  External Link
                </label>
                <label className="flex items-center">
                  <input 
                    type="radio" 
                    checked={linkType === 'internal'} 
                    onChange={() => setLinkType('internal')}
                    className="mr-2"
                  />
                  Internal Link
                </label>
              </div>
              
              <input
                type="text"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                placeholder={linkType === 'external' ? 'https://example.com' : '/page-path'}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                autoFocus
              />
              
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowLinkModal(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md"
                >
                  Cancel
                </button>
                <button
                  onClick={handleLinkSubmit}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  {linkUrl.trim() ? 'Add Link' : 'Remove Link'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

const Toggle = ({ pressed, onClick, icon }: any) => (
  <button
    type="button"
    onClick={(e) => { e.preventDefault(); onClick(); }}
    className={`p-2 rounded transition-colors ${pressed ? 'bg-[#00456B] text-white' : 'text-gray-600 hover:bg-gray-200'}`}
  >
    {icon}
  </button>
);

export default Toolbar;