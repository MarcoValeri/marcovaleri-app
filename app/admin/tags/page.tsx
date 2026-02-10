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

interface Tag {
  id: string;
  tag: string;
  url: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

const TagsPage = () => {
  const [tags, setTags] = useState<Tag[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingTag, setEditingTag] = useState<Tag | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [notification, setNotification] = useState<{type: 'success' | 'error', message: string} | null>(null);
  const [formData, setFormData] = useState({
    tag: '',
    url: '',
    description: ''
  });

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!formData.tag) newErrors.tag = 'Tag name is required';
    if (!formData.url) newErrors.url = 'URL is required';
    if (formData.tag && formData.tag.length > 50) {
      newErrors.tag = 'Tag name must be under 50 characters';
    }
    
    const existingTag = tags.find(t => 
      t.url === formData.url && (!editingTag || t.id !== editingTag.id)
    );
    if (existingTag) newErrors.url = 'A tag with this URL already exists';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Auto-generate URL from tag name
  const handleTagChange = (tagName: string) => {
    setFormData(prev => ({
      ...prev,
      tag: tagName,
      url: tagName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
    }));
    setErrors(prev => ({ ...prev, tag: '' }));
  };

  useEffect(() => {
    checkUserRole();
    fetchTags();
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

  const fetchTags = async () => {
    try {
      const { data } = await client.models.Tag.list();
      const sortedData = (data as Tag[]).sort((a, b) => 
        a.tag.localeCompare(b.tag)
      );
      setTags(sortedData);
    } catch (error) {
      console.error('Error fetching tags:', error);
    }
  };

  const handleSave = async () => {
    if (!validateForm()) return;
    
    setIsSaving(true);
    setErrors({});
    
    const tagData = {
      tag: formData.tag,
      url: formData.url,
      description: formData.description || undefined
    };
    
    try {
      if (editingTag) {
        await client.models.Tag.update({
          id: editingTag.id,
          ...tagData,
        });
        showNotification('success', 'Tag updated successfully!');
      } else {
        await client.models.Tag.create(tagData);
        showNotification('success', 'Tag created successfully!');
      }
      
      fetchTags();
      closeForm();
    } catch (error) {
      console.error('Error saving tag:', error);
      showNotification('error', 'Error saving tag. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleSave();
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this tag? This may affect associated articles.')) {
      try {
        await client.models.Tag.delete({ id });
        fetchTags();
        showNotification('success', 'Tag deleted successfully!');
      } catch (error) {
        console.error('Error deleting tag:', error);
        showNotification('error', 'Error deleting tag. It may be in use by articles.');
      }
    }
  };

  const openForm = (tag?: Tag) => {
    if (tag) {
      setEditingTag(tag);
      setFormData({
        tag: tag.tag,
        url: tag.url,
        description: tag.description || ''
      });
    } else {
      setEditingTag(null);
      setFormData({
        tag: '',
        url: '',
        description: ''
      });
    }
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingTag(null);
    setErrors({});
    setNotification(null);
    setFormData({
      tag: '',
      url: '',
      description: ''
    });
  };

  const columns = [
    {
      key: 'tag',
      label: 'Tag',
      render: (tag: Tag) => (
        <div>
          <div className="font-medium">
            <span className="px-2 py-1 text-sm bg-gray-100 text-gray-700 rounded">
              {tag.tag}
            </span>
          </div>
          {tag.description && (
            <div className="text-gray-500 text-xs mt-1">{tag.description}</div>
          )}
        </div>
      ),
      className: "px-6 py-4 text-sm text-gray-900"
    },
    {
      key: 'url',
      label: 'URL',
      render: (tag: Tag) => (
        <span className="text-blue-600 font-mono text-sm">{tag.url}</span>
      ),
      className: "px-6 py-4 text-sm text-gray-900"
    },
    {
      key: 'createdAt',
      label: 'Created',
      render: (tag: Tag) => (
        tag?.createdAt ? new Date(tag.createdAt).toLocaleDateString() : '-'
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
          <p>You don&apos;t have permission to access tag management.</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <Notification notification={notification} />
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Tag Management</h2>
          <AdminButtonSubmit
            onClick={() => openForm()}
            content="Add Tag"
            type="button"
          />
        </div>

        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold">
                  {editingTag ? 'Edit Tag' : 'Add New Tag'}
                </h3>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <AdminInputText
                    id="tag"
                    name="tag"
                    label={`Tag Name (${formData.tag.length}/50)`}
                    value={formData.tag}
                    onChange={(e) => handleTagChange(e.target.value)}
                    error={!!errors.tag}
                    errorMessage={errors.tag}
                    placeholder="e.g., JavaScript, React, AWS"
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
                    placeholder="tag-url-slug"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Auto-generated from tag name, but you can customize it
                  </p>
                </div>

                <div className="mb-4">
                  <AdminInputTextArea
                    id="description"
                    name="description"
                    label="Description (Optional)"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    placeholder="Brief description of this tag..."
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
                      editingTag ? 'Update' : 'Create'
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
          data={tags}
          columns={columns}
          searchFields={['tag', 'description', 'url']}
          searchPlaceholder="Search by tag name, description, or URL..."
          itemName="tags"
          onEdit={openForm}
          onDelete={(tag) => handleDelete(tag.id)}
          getItemId={(tag) => tag.id}
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

export default TagsPage;
