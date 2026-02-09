'use client';

import { useState, useEffect } from 'react';
import type { Schema } from '@/amplify/data/resource';
import { uploadData, getUrl, remove } from 'aws-amplify/storage';
import { generateClient } from 'aws-amplify/data';
import { fetchAuthSession } from 'aws-amplify/auth';
import AdminButtonSubmit from '../components/AdminButtonSubmit/AdminButtonSumit';
import AdminInputText from '../components/AdminInputText/AdminInputText';
import AdminInputTextArea from '../components/AdminInputTextArea/AdminInputTextArea';
import AdminLayout from "../components/AdminLayout/AdminLayout";
import AdminInputSearch from '../components/AdminInputSearch/AdminInputSearch';
import AdminButtonCancel from '../components/AdminButtonCancel/AdminButtonCancel';
import LoadingSpin from '../../components/LoadingSpin/LoadingSpin';

const client = generateClient<Schema>();

const ImagePage = () => {
  const [images, setImages] = useState<any[]>([]);
  const [filteredImages, setFilteredImages] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingImage, setEditingImage] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [isAdmin, setIsAdmin] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    url: '',
    caption: '',
    description: ''
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imageUrls, setImageUrls] = useState<{[key: string]: string}>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkUserRole();
    fetchImages();
  }, []);

  const checkUserRole = async () => {
    try {
      const session = await fetchAuthSession();
      const groups = (session.tokens?.accessToken?.payload['cognito:groups'] as string[]) || [];
      setIsAdmin(groups.includes('ADMINS'));
    } catch (error) {
      console.error('Error checking user role:', error);
    }
  };

  const fetchImages = async () => {
    try {
      setLoading(true);
      const result = await client.models.Image.list();
      setImages(result.data);
      setFilteredImages(result.data);
      
      // Generate URLs for all images
      const urls: {[key: string]: string} = {};
      for (const image of result.data) {
        if (image.url && !image.url.startsWith('http')) {
          try {
            const urlResult = await getUrl({ path: image.url });
            urls[image.id] = urlResult.url.toString();
          } catch (error) {
            console.error('Error generating URL for image:', image.id, error);
          }
        }
      }
      setImageUrls(urls);
    } catch (error) {
      console.error('Error fetching images:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (file: File) => {
    // File size validation (500MB limit)
    const maxSize = 500 * 1024 * 1024; // 500MB in bytes
    if (file.size > maxSize) {
      throw new Error(`File size (${(file.size / 1024 / 1024).toFixed(1)}MB) exceeds the 500MB limit`);
    }

    try {
      const imagePath = `public/images/${Date.now()}-${file.name}`;
      const result = await uploadData({
        path: imagePath,
        data: file,
        options: {
          onProgress: ({ transferredBytes, totalBytes }) => {
            if (totalBytes) {
              console.log(`Upload progress: ${Math.round((transferredBytes / totalBytes) * 100)}%`);
            }
          }
        }
      }).result;

      return imagePath;
    } catch (error) {
      console.error('Upload failed:', error);
      throw error;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);
    setError(null);

    try {
      let imageUrl = formData.url;
      
      if (selectedFile) {
        imageUrl = await handleFileUpload(selectedFile);
      }

      const imageData = { ...formData, url: imageUrl };

      if (editingImage) {
        await client.models.Image.update({
          id: editingImage.id,
          ...imageData
        });
      } else {
        await client.models.Image.create(imageData);
      }

      fetchImages();
      closeModal();
    } catch (error) {
      console.error('Error saving image:', error);
      setError(error instanceof Error ? error.message : 'Error saving image');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this image?')) {
      try {
        // Find the image to get its URL/path
        const imageToDelete = images.find(img => img.id === id);
        
        // Delete from database first
        await client.models.Image.delete({ id });

        // Delete from S3 if the image has a file path (not external URL)
        if (imageToDelete?.url && !imageToDelete.url.startsWith('http')) {
          try {
            await remove({ path: imageToDelete.url });
            console.log('File deleted from S3:', imageToDelete.url);
          } catch (s3Error) {
            console.error('Error deleting file from S3:', s3Error);
          }
        }

        fetchImages();
      } catch (error) {
        console.error('Error deleting image:', error);
      }
    }
  };

  const openModal = (image?: any) => {
    if (image) {
      setEditingImage(image);
      setFormData({
        name: image.name,
        url: image.url,
        caption: image.caption || '',
        description: image.description || ''
      });
    } else {
      setEditingImage(null);
      setFormData({ name: '', url: '', caption: '', description: '' });
    }
    setSelectedFile(null);
    setIsModalOpen(true);
  };

  // Search functionality
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    setCurrentPage(1);

    if (!term) {
      setFilteredImages(images);
    } else {
      const filtered = images.filter(image => 
        image.name?.toLowerCase().includes(term)
      );
      setFilteredImages(filtered);
    }
  };

  // Pagination logic
  const totalPages = Math.ceil(filteredImages.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentImages = filteredImages.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingImage(null);
    setFormData({ name: '', url: '', caption: '', description: '' });
    setSelectedFile(null);
    setError(null);
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className='flex flex-col items-center p-20'>
          <LoadingSpin message="Loading..." />
        </div>
      </AdminLayout>
    );
  }

  if (!isAdmin) {
    return (
      <AdminLayout>
        <div className="p-6">
          <h2 className="text-2xl font-bold text-red-600">Access Denied</h2>
          <p>You don&apos;t have permission to access image management.</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Images</h1>
          <AdminButtonSubmit 
            onClick={() => openModal()}
            content="Add Image"
            type="button"
          />
        </div>

        <div className="mb-4">
          <AdminInputSearch
            id="search"
            name="search"
            label="Search Images"
            value={searchTerm}
            onChange={handleSearch}
            placeholder="Search by image name..."
          />
        </div>

        <div className="mb-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-700">Show</span>
            <select 
              value={itemsPerPage} 
              onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
              className="border rounded px-2 py-1 text-sm"
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
            <span className="text-sm text-gray-700">images per page</span>
          </div>
          <div className="text-sm text-gray-700">
            Showing {startIndex + 1} to {Math.min(endIndex, filteredImages.length)} of {filteredImages.length} images
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {currentImages.map((image) => (
            <div key={image.id} className="border rounded-lg p-4 bg-white shadow">
              <img 
                src={imageUrls[image.id] || image.url} 
                alt={image.caption || image.name}
                className="w-full h-48 object-cover rounded mb-3"
                onError={(e) => {
                  console.error('Image failed to load:', image.url);
                  e.currentTarget.style.display = 'none';
                }}
              />
              <h3 className="font-semibold mb-2">{image.name}</h3>
              {image.caption && (
                <p className="text-gray-700 text-sm mb-2 italic">{image.caption}</p>
              )}
              {image.description && (
                <p className="text-gray-600 text-sm mb-3">{image.description}</p>
              )}
              <div className="flex gap-2">
                <AdminButtonSubmit
                  onClick={() => openModal(image)}
                  content="Edit"
                  type="button"
                />
                <AdminButtonCancel
                  onClick={() => handleDelete(image.id)}
                  content="Delete"
                  type="button"
                />
                <a
                  href={imageUrls[image.id] || image.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-blue-800 rounded text-sm transition-colors"
                >
                  View
                </a>
              </div>
            </div>
          ))}
        </div>

        {totalPages > 1 && (
          <div className="mt-6 flex justify-center items-center gap-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1 border rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Previous
            </button>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`px-3 py-1 border rounded text-sm ${
                  currentPage === page 
                    ? 'bg-blue-500 text-white border-blue-500' 
                    : 'hover:bg-gray-50'
                }`}
              >
                {page}
              </button>
            ))}
            
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-1 border rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Next
            </button>
          </div>
        )}

        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg w-full max-w-md">
              <h2 className="text-xl font-bold mb-4">
                {editingImage ? 'Edit Image' : 'Add Image'}
              </h2>

              {error && (
                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <AdminInputText
                    id="name"
                    name="name"
                    label="Name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>

                {!editingImage && (
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">
                      Image File <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                      className="w-full border rounded px-3 py-2"
                      required={!editingImage}
                    />
                    <p className="text-xs text-gray-500 mt-1">Maximum file size: 500MB</p>
                  </div>
                )}

                {editingImage && (
                  <div className="mb-4 p-3 bg-gray-100 rounded">
                    <p className="text-sm text-gray-600">
                      <strong>Current image:</strong> {editingImage.name}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      To change the image file, please delete this image and create a new one.
                    </p>
                  </div>
                )}

                <div className="mb-4">
                  <AdminInputText
                    id="caption"
                    name="caption"
                    label="Caption"
                    value={formData.caption || ''}
                    onChange={(e) => setFormData({ ...formData, caption: e.target.value })}
                  />
                </div>

                <div className="mb-4">
                  <AdminInputTextArea
                    id="description"
                    name="description"
                    label="Description"
                    value={formData.description || ''}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                  />
                </div>

                <div className="flex gap-2">
                  <AdminButtonSubmit
                    content={uploading ? 'Uploading...' : editingImage ? 'Update' : 'Create'}
                    disabled={uploading}
                    type="submit"
                  />
                  <AdminButtonCancel
                    onClick={closeModal}
                    content="Cancel"
                    type="button"
                  />
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default ImagePage;
