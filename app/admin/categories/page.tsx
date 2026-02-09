'use client';

import { useState, useEffect } from 'react';
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '@/amplify/data/resource';
import { fetchAuthSession } from 'aws-amplify/auth';
import AdminLayout from '../components/AdminLayout/AdminLayout';
import LoadingSpin from '@/app/components/LoadingSpin/LoadingSpin';
import AdminButtonSubmit from '../components/AdminButtonSubmit/AdminButtonSumit';
import AdminInputText from '../components/AdminInputText/AdminInputText';
import AdminTable from '../components/AdminTable/AdminTable';
import AdminInputTextArea from '../components/AdminInputTextArea/AdminInputTextArea';

const client = generateClient<Schema>();

interface Category {
  id: string;
  category: string;
  url: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

const CategoriesPage = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [notification, setNotification] = useState<{type: 'success' | 'error', message: string} | null>(null);
  const [formData, setFormData] = useState({
    category: '',
    url: '',
    description: ''
  });

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!formData.category) newErrors.category = 'Category name is required';
    if (!formData.url) newErrors.url = 'URL is required';
    if (formData.category && formData.category.length > 100) {
      newErrors.category = 'Category name must be under 100 characters';
    }
    
    const existingCategory = categories.find(cat => 
      cat.url === formData.url && (!editingCategory || cat.id !== editingCategory.id)
    );
    if (existingCategory) newErrors.url = 'A category with this URL already exists';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Auto-generate URL from category name
  const handleCategoryChange = (categoryName: string) => {
    setFormData(prev => ({
      ...prev,
      category: categoryName,
      url: categoryName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
    }));
    setErrors(prev => ({ ...prev, category: '' }));
  };

  useEffect(() => {
    checkUserRole();
    fetchCategories();
  }, []);

  const checkUserRole = async () => {
    setIsLoading(true);
    try {
      const session = await fetchAuthSession();
      const groups = (session.tokens?.accessToken?.payload['cognito:groups'] as string[]) || [];
      setIsAdmin(groups.includes('ADMINS'));
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.error('Error checking user role:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const { data } = await client.models.Category.list();
      const sortedData = (data as Category[]).sort((a, b) => 
        a.category.localeCompare(b.category)
      );
      setCategories(sortedData);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleSave = async () => {
    if (!validateForm()) return;
    
    setIsSaving(true);
    setErrors({});
    
    const categoryData = {
      category: formData.category,
      url: formData.url,
      description: formData.description || undefined
    };
    
    try {
      if (editingCategory) {
        await client.models.Category.update({
          id: editingCategory.id,
          ...categoryData,
        });
        showNotification('success', 'Category updated successfully!');
      } else {
        await client.models.Category.create(categoryData);
        showNotification('success', 'Category created successfully!');
      }
      
      fetchCategories();
      closeForm();
    } catch (error) {
      console.error('Error saving category:', error);
      showNotification('error', 'Error saving category. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleSave();
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this category? This may affect associated articles.')) {
      try {
        await client.models.Category.delete({ id });
        fetchCategories();
        showNotification('success', 'Category deleted successfully!');
      } catch (error) {
        console.error('Error deleting category:', error);
        showNotification('error', 'Error deleting category. It may be in use by articles.');
      }
    }
  };

  const openForm = (category?: Category) => {
    if (category) {
      setEditingCategory(category);
      setFormData({
        category: category.category,
        url: category.url,
        description: category.description || ''
      });
    } else {
      setEditingCategory(null);
      setFormData({
        category: '',
        url: '',
        description: ''
      });
    }
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingCategory(null);
    setErrors({});
    setNotification(null);
    setFormData({
      category: '',
      url: '',
      description: ''
    });
  };

  const columns = [
    {
      key: 'category',
      label: 'Category',
      render: (category: Category) => (
        <div>
          <div className="font-medium">{category.category}</div>
          {category.description && (
            <div className="text-gray-500 text-xs mt-1">{category.description}</div>
          )}
        </div>
      ),
      className: "px-6 py-4 text-sm text-gray-900"
    },
    {
      key: 'url',
      label: 'URL',
      render: (category: Category) => (
        <span className="text-blue-600 font-mono text-sm">{category.url}</span>
      ),
      className: "px-6 py-4 text-sm text-gray-900"
    },
    {
      key: 'createdAt',
      label: 'Created',
      render: (category: Category) => (
        category?.createdAt ? new Date(category.createdAt).toLocaleDateString() : '-'
      ),
      className: "px-6 py-4 whitespace-nowrap text-sm text-gray-500"
    }
  ];

  if (isLoading) {
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
          <p>You don&apos;t have permission to access category management.</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <Notification notification={notification} />
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Category Management</h2>
          <AdminButtonSubmit
            onClick={() => openForm()}
            content="Add Category"
            type="button"
          />
        </div>

        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold">
                  {editingCategory ? 'Edit Category' : 'Add New Category'}
                </h3>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <AdminInputText
                    id="category"
                    name="category"
                    label={`Category Name (${formData.category.length}/100)`}
                    value={formData.category}
                    onChange={(e) => handleCategoryChange(e.target.value)}
                    error={!!errors.category}
                    errorMessage={errors.category}
                    placeholder="e.g., Technology, Travel, Food"
                    required
                  />
                </div>

                <div className="mb-4">
                  <AdminInputText
                    id="url"
                    name="url"
                    label="URL Slug"
                    value={formData.url}
                    onChange={(e) => {
                      setFormData({...formData, url: e.target.value});
                      setErrors(prev => ({ ...prev, url: '' }));
                    }}
                    error={!!errors.url}
                    errorMessage={errors.url}
                    placeholder="category-url-slug"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Auto-generated from category name, but you can customize it
                  </p>
                </div>

                <div className="mb-4">
                  <AdminInputTextArea
                    id="description"
                    name="description"
                    label="Description (Optional)"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    placeholder="Brief description of this category..."
                    rows={3}
                  />
                </div>

                <div className="flex gap-2">
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
                  >
                    {isSaving ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Saving...
                      </>
                    ) : (
                      editingCategory ? 'Update' : 'Create'
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={closeForm}
                    disabled={isSaving}
                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md disabled:opacity-50"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <AdminTable
          data={categories}
          columns={columns}
          searchFields={['category', 'description', 'url']}
          searchPlaceholder="Search by category name, description, or URL..."
          itemName="categories"
          onEdit={openForm}
          onDelete={(category) => handleDelete(category.id)}
          getItemId={(category) => category.id}
        />
      </div>
    </AdminLayout>
  );
};

// Notification Component
const Notification = ({ notification }: { notification: {type: 'success' | 'error', message: string} | null }) => {
  if (!notification) return null;
  
  return (
    <div className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 ${
      notification.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
    }`}>
      {notification.message}
    </div>
  );
};

export default CategoriesPage;
