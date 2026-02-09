'use client';
import { useState } from 'react';
import { LuSearch, LuX } from 'react-icons/lu';

type Image = {
    id: string;
    url: string;
    name: string;
};

type Props = {
    images: Image[];
    onSelect: (image: Image) => void;
    onClose: () => void;
};

const ImagePicker = ({ images, onSelect, onClose }: Props) => {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredImages = images.filter(img => 
        img.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-60">
            <div className="bg-white p-6 rounded-lg w-150 max-h-[80vh] flex flex-col">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold">Select Image</h3>
                    <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
                        <LuX className="w-5 h-5" />
                    </button>
                </div>
                
                <div className="relative mb-4">
                    <LuSearch className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
                    <input
                        type="text"
                        placeholder="Search images..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-9 p-2 border rounded"
                    />
                </div>
                
                <div className="grid grid-cols-3 gap-3 overflow-y-auto p-1">
                    {filteredImages.map(image => (
                        <div
                            key={image.id}
                            onClick={() => onSelect(image)}
                            className="cursor-pointer border-2 border-transparent hover:border-blue-500 rounded overflow-hidden group relative"
                        >
                            <img
                                src={image.url}
                                alt={image.name}
                                className="w-full h-24 object-cover"
                            />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                            <p className="text-xs p-1 truncate text-center">{image.name}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ImagePicker;