'use client';

import { useState, useEffect } from 'react';
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '@/amplify/data/resource';
import { fetchAuthSession } from 'aws-amplify/auth';
import AdminLayout from '../components/AdminLayout/AdminLayout';
import LoadingSpin from '@/app/components/LoadingSpin/LoadingSpin';
import AdminButtonSubmit from '../components/AdminButtonSubmit/AdminButtonSumit';
import AdminInputText from '../components/AdminInputText/AdminInputText';
import AdminInputSelect from '../components/AdminInputSelect/AdminInputSelect';
import AdminTable from '../components/AdminTable/AdminTable';
import AdminInputCheckbox from '../components/AdminInputCheckbox/AdminInputCheckbox';
import AdminInputTextArea from '../components/AdminInputTextArea/AdminInputTextArea';
import TiptapEditor from '../components/Tiptap/TiptapEditor/TiptapEditor';
import ImagePicker from '../components/Tiptap/ImagePicker/ImagePicker';
import { getUrl } from 'aws-amplify/storage';

const client = generateClient<Schema>();

interface Article {
  id: string;
  title: string;
  description?: string;
  url?: string;
  content?: string;
  category?: {
    id: string;
    category: string;
    url: string;
    description?: string;
  };
  articleTags?: {
    id: string;
    tag?: {
      id: string;
      tag: string;
      url: string;
      description?: string;
    };
  }[];
  published: boolean;
  updated?: string;
  createdAt?: string;
  featuredImageId?: string;
}

const ArticlesPage = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [tags, setTags] = useState<any[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [availableImages, setAvailableImages] = useState<any[]>([]);
  const [showImagePicker, setShowImagePicker] = useState(false);
  const [selectedImage, setSelectedImage] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [notification, setNotification] = useState<{type: 'success' | 'error', message: string} | null>(null);
  const [autoSaveTimer, setAutoSaveTimer] = useState<NodeJS.Timeout | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    url: '',
    content: '',
    categoryId: '',
    published: false,
    featuredImageId: '',
    updated: ''
  });

  // --- HELPER FUNCTIONS FOR IMAGE URL HANDLING ---
  // 1. CLEANING (Before Save): "https://...s3.../public/images/dog.jpg?token=..." -> "public/images/dog.jpg"
  const prepareContentForSave = (htmlContent: string) => {
    if (!htmlContent) return '';
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, 'text/html');
    const images = doc.getElementsByTagName('img');
    
    for (let i = 0; i < images.length; i++) {
      const img = images[i];
      const src = img.getAttribute('src');
      
      // Check if it is a signed S3 URL
      if (src && src.includes('amazonaws.com') && src.includes('/public/')) {
        try {
          const urlObj = new URL(src);
          // pathname is "/public/...", substring(1) makes it "public/..."
          const cleanPath = urlObj.pathname.substring(1);
          const decodedPath = decodeURIComponent(cleanPath);
          img.setAttribute('src', decodedPath);
        } catch (e) {
          console.error('Error cleaning image URL', e);
        }
      }
    }
    return doc.body.innerHTML;
  };

  // 2. SIGNING (Before Edit): "public/images/dog.jpg" -> "https://...s3.../public/images/dog.jpg?token=..."
  const prepareContentForEdit = async (htmlContent: string) => {
    if (!htmlContent) return '';
    let processedContent = htmlContent;
    
    // Match src="public/..." (non-http links)
    const imgRegex = /<img[^>]+src="([^"]+)"[^>]*>/g;
    const matches = [...htmlContent.matchAll(imgRegex)];
    
    for (const match of matches) {
      const imgSrc = match[1];
      
      // If it looks like a relative storage key (not http)
      if (imgSrc && !imgSrc.startsWith('http')) {
        try {
          const urlResult = await getUrl({ path: imgSrc });
          processedContent = processedContent.replace(
            `src="${imgSrc}"`,
            `src="${urlResult.url.toString()}"`
          );
        } catch (error) {
          console.error('Failed to sign image:', imgSrc);
        }
      }
    }
    return processedContent;
  };
  // --- END HELPER FUNCTIONS ---

  const getArticleStatus = (article: Article) => {
    if (!article.published) {
      return { text: 'Draft', color: 'bg-yellow-100 text-yellow-800' };
    }
    const now = new Date();
    const updatedDate = new Date(article.updated || article.createdAt || now);
    if (updatedDate > now) {
      return { text: 'Scheduled', color: 'bg-blue-100 text-blue-800' };
    } else {
      return { text: 'Published', color: 'bg-green-100 text-green-800' };
    }
  };

  const getProgress = () => {
    const fields = [
      { key: 'title', label: 'Title', completed: !!formData.title },
      { key: 'description', label: 'Description', completed: !!formData.description },
      { key: 'url', label: 'URL', completed: !!formData.url },
      { key: 'content', label: 'Content', completed: !!formData.content },
      { key: 'featuredImage', label: 'Featured Image', completed: !!selectedImage }
    ];
    const completed = fields.filter(f => f.completed).length;
    return { 
      fields, 
      completed, 
      total: fields.length, 
      percentage: Math.round((completed / fields.length) * 100) 
    };
  };

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!formData.title) newErrors.title = 'Title is required';
    if (!formData.url) newErrors.url = 'URL is required';
    if (formData.title && formData.title.length > 100) newErrors.title = 'Title must be under 100 characters';
    if (formData.description && formData.description.length > 160) newErrors.description = 'Description must be under 160 characters';
    
    const existingArticle = articles.find(article => 
      article.url === formData.url && (!editingArticle || article.id !== editingArticle.id)
    );
    if (existingArticle) newErrors.url = 'An article with this URL already exists';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  useEffect(() => {
    checkUserRole();
    fetchArticles();
    fetchCategories();
    fetchTags();
  }, []);

  // Auto-save effect
  useEffect(() => {
    if (showForm && (formData.title || formData.content) && !isSaving) {
      if (autoSaveTimer) clearTimeout(autoSaveTimer);
      
      const timer = setTimeout(() => {
        if (formData.title && formData.url) {
          handleSave(false); // Save as draft
        }
      }, 30000);
      
      setAutoSaveTimer(timer);
    }
    
    return () => {
      if (autoSaveTimer) clearTimeout(autoSaveTimer);
    };
  }, [formData, showForm, isSaving]);

  // Auto-generate URL from title
  const handleTitleChange = (title: string) => {
    setFormData(prev => ({
      ...prev,
      title
    }));
    setErrors(prev => ({ ...prev, title: '' }));
  };

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

  const fetchArticles = async () => {
    try {
      const { data } = await client.models.Article.list({
        selectionSet: [
          'id', 
          'title', 
          'description', 
          'url', 
          'content', 
          'published', 
          'updated', 
          'createdAt', 
          'featuredImageId', 
          'category.*', 
          'articleTags.id', 
          'articleTags.tag.*'
        ]
      });
      
      const sortedData = (data as Article[]).sort((a, b) => {
        const dateA = new Date(a.updated || a.createdAt || 0).getTime();
        const dateB = new Date(b.updated || b.createdAt || 0).getTime();
        return dateB - dateA;
      });
      
      setArticles(sortedData);
    } catch (error) {
      console.error('Error fetching articles:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const { data } = await client.models.Category.list();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchTags = async () => {
    try {
      const { data } = await client.models.Tag.list();
      setTags(data);
    } catch (error) {
      console.error('Error fetching tags:', error);
    }
  };

  const handleSave = async (publish: boolean) => {
    if (!validateForm()) return;
    
    setIsSaving(true);
    setErrors({});
    
    // 1. CLEAN CONTENT BEFORE SAVING
    const cleanContent = prepareContentForSave(formData.content);
    
    const articleData = {
      title: formData.title,
      description: formData.description || '',
      url: formData.url,
      content: cleanContent || '',
      categoryId: formData.categoryId || undefined,
      published: publish,
      featuredImageId: formData.featuredImageId || undefined,
      updated: formData.updated && formData.updated.trim() 
        ? new Date(formData.updated).toISOString() 
        : new Date().toISOString()
    };
    
    try {
      let savedArticle;
      if (editingArticle) {
        savedArticle = await client.models.Article.update({
          id: editingArticle.id,
          ...articleData,
        });
      } else {
        savedArticle = await client.models.Article.create(articleData);
      }
      
      // Handle tags separately
      if (savedArticle.data) {
        const articleId = savedArticle.data.id;
        
        if (editingArticle) {
          const existingArticleTags = await client.models.ArticleTag.list({
            filter: { articleId: { eq: articleId } }
          });
          for (const articleTag of existingArticleTags.data) {
            await client.models.ArticleTag.delete({ id: articleTag.id });
          }
        }
        
        for (const tagId of selectedTags) {
          await client.models.ArticleTag.create({
            articleId,
            tagId
          });
        }
      }
      
      fetchArticles();
      showNotification('success', publish ? 'Article published successfully!' : 'Article saved successfully!');
      closeForm();
    } catch (error) {
      console.error('Error saving article:', error);
      showNotification('error', 'Error saving article. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleSave(formData.published);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this article?')) {
      try {
        await client.models.Article.delete({ id });
        fetchArticles();
        showNotification('success', 'Article deleted successfully!');
      } catch (error) {
        console.error('Error deleting article:', error);
        showNotification('error', 'Error deleting article.');
      }
    }
  };

  const openForm = async (article?: Article) => {
    await loadImages();
    
    if (article) {
      setEditingArticle(article);
      
      // 1. SIGN CONTENT BEFORE EDITING
      let editableContent = article.content || '';
      if (article.content) {
        editableContent = await prepareContentForEdit(article.content);
      }
      
      setFormData({
        title: article.title,
        description: article.description || '',
        url: article.url || '',
        content: editableContent,
        categoryId: article.category?.id || '',
        published: article.published,
        featuredImageId: article.featuredImageId || '',
        updated: article.updated ? new Date(article.updated).toISOString().slice(0, 16) : ''
      });
      
      setSelectedTags(
        article.articleTags?.map(at => at.tag?.id).filter((id): id is string => id !== undefined) || []
      );
      
      // Handle featured image
      if (article.featuredImageId) {
        const featuredId = article.featuredImageId;
        setTimeout(() => {
          const imageData = availableImages.find(img => img.id === featuredId);
          if (imageData) {
            setSelectedImage(imageData);
          } else {
            loadSpecificImage(featuredId);
          }
        }, 100);
      } else {
        setSelectedImage(null);
      }
    } else {
      setEditingArticle(null);
      setSelectedImage(null);
      setSelectedTags([]);
      setFormData({
        title: '',
        description: '',
        url: '',
        content: '',
        categoryId: '',
        published: false,
        featuredImageId: '',
        updated: ''
      });
    }
    
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingArticle(null);
    setSelectedImage(null);
    setErrors({});
    setNotification(null);
    setSelectedTags([]);
    if (autoSaveTimer) clearTimeout(autoSaveTimer);
    setFormData({
      title: '',
      description: '',
      url: '',
      content: '',
      categoryId: '',
      published: false,
      featuredImageId: '',
      updated: ''
    });
  };

  const loadImages = async () => {
    try {
      const { data } = await client.models.Image.list();
      const imagesWithUrls = await Promise.all(
        data.map(async (img) => {
          if (!img.url) return null;
          try {
            const urlResult = await getUrl({ path: img.url });
            return { id: img.id, name: img.name, url: urlResult.url.toString() };
          } catch (e) { 
            return null; 
          }
        })
      );
      setAvailableImages(imagesWithUrls.filter(Boolean));
    } catch (error) {
      console.error("Error loading images", error);
    }
  };

  const loadSpecificImage = async (imageId: string) => {
    try {
      const { data } = await client.models.Image.get({ id: imageId });
      if (data && data.url) {
        const urlResult = await getUrl({ path: data.url });
        const imageData = {
          id: data.id,
          name: data.name,
          url: urlResult.url.toString()
        };
        setSelectedImage(imageData);
        
        setAvailableImages(prev => {
          const exists = prev.find(img => img.id === imageId);
          if (!exists) {
            return [...prev, imageData];
          }
          return prev;
        });
      }
    } catch (error) {
      console.error("Error loading specific image:", error);
      setSelectedImage(null);
    }
  };

  const handleImageSelect = (image: any) => {
    setSelectedImage(image);
    setFormData(prev => ({
      ...prev, 
      featuredImageId: image.id
    }));
    setShowImagePicker(false);
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    setFormData(prev => ({
      ...prev, 
      featuredImageId: ''
    }));
  };

  const columns = [
    {
      key: 'title',
      label: 'Title',
      render: (article: Article) => (
        <div className="max-w-xs">
          <div className="font-medium truncate">{article?.title || 'N/A'}</div>
          {article?.description && (
            <div className="text-gray-500 text-xs truncate mt-1">{article.description}</div>
          )}
        </div>
      ),
      className: "px-6 py-4 text-sm text-gray-900"
    },
    {
      key: 'category',
      label: 'Category',
      render: (article: Article) => (
        article?.category ? (
          <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
            {article.category.category}
          </span>
        ) : (
          <span className="text-gray-400">-</span>
        )
      ),
      className: "px-6 py-4 whitespace-nowrap text-sm text-gray-900"
    },
    {
      key: 'tags',
      label: 'Tags',
      render: (article: Article) => (
        article?.articleTags && article.articleTags.length > 0 ? (
          <div className="flex flex-wrap gap-1">
            {article.articleTags.slice(0, 2).map((articleTag, i) => (
              <span key={i} className="px-1 py-0.5 text-xs bg-gray-100 text-gray-700 rounded">
                {articleTag.tag?.tag}
              </span>
            ))}
            {article.articleTags.length > 2 && (
              <span className="text-xs text-gray-500">+{article.articleTags.length - 2}</span>
            )}
          </div>
        ) : (
          <span className="text-gray-400">-</span>
        )
      ),
      className: "px-6 py-4 text-sm text-gray-900 max-w-xs"
    },
    {
      key: 'status',
      label: 'Status',
      render: (article: Article) => {
        const status = getArticleStatus(article);
        return (
          <span className={`px-2 py-1 text-xs rounded-full ${status.color}`}>
            {status.text}
          </span>
        );
      },
      className: "px-6 py-4 whitespace-nowrap"
    },
    {
      key: 'updated',
      label: 'Updated',
      render: (article: Article) => (
        article?.updated ? new Date(article.updated).toLocaleDateString() : '-'
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
          <p>You don&apos;t have permission to access article management.</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <Notification notification={notification} />
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Article Management</h2>
          <AdminButtonSubmit
            onClick={() => openForm()}
            content="Add Article"
            type="button"
          />
        </div>

        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg w-200 max-h-[90vh] overflow-y-auto">
              {/* Header with Progress */}
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold">
                  {editingArticle ? 'Edit Article' : 'Add New Article'}
                </h3>
                <div className="text-sm text-gray-600">
                  Progress: {getProgress().completed}/{getProgress().total} ({getProgress().percentage}%)
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                  style={{ width: `${getProgress().percentage}%` }}
                ></div>
              </div>

              {/* Progress Checklist */}
              <div className="flex gap-2 mb-4 text-xs">
                {getProgress().fields.map(field => (
                  <span 
                    key={field.key} 
                    className={`px-2 py-1 rounded ${
                      field.completed ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {field.completed ? '✓' : '○'} {field.label}
                  </span>
                ))}
              </div>

              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <AdminInputText
                    id="title"
                    name="title"
                    label={`Title (${formData.title.length}/100)`}
                    value={formData.title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    error={!!errors.title}
                    errorMessage={errors.title}
                    required
                  />
                </div>

                <div className="mb-4">
                  <AdminInputTextArea
                    id="description"
                    name="description"
                    label={`Description (${formData.description.length}/160)`}
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    error={!!errors.description}
                    errorMessage={errors.description}
                    placeholder="Brief description for SEO..."
                    rows={3}
                  />
                  
                  {/* SEO Preview */}
                  {formData.title && formData.description && (
                    <div className="mt-2 p-3 bg-gray-50 rounded border">
                      <p className="text-xs text-gray-600 mb-1">SEO Preview:</p>
                      <div className="text-blue-600 text-sm font-medium truncate">{formData.title}</div>
                      <div className="text-green-600 text-xs">yoursite.com/{formData.url}</div>
                      <div className="text-gray-600 text-sm">{formData.description}</div>
                    </div>
                  )}
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Featured Image
                  </label>
                  {selectedImage ? (
                    <div className="flex items-center gap-4 p-3 border rounded-lg bg-gray-50">
                      <img 
                        src={selectedImage.url} 
                        alt={selectedImage.name}
                        className="w-16 h-16 object-cover rounded"
                      />
                      <div className="flex-1">
                        <p className="font-medium text-sm">{selectedImage.name}</p>
                      </div>
                      <button
                        type="button"
                        onClick={handleRemoveImage}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setShowImagePicker(true)}
                      className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-gray-400 hover:text-gray-700"
                    >
                      Click to select featured image
                    </button>
                  )}
                </div>

                <div className="mb-4">
                  <AdminInputText
                    id="url"
                    name="url"
                    label="URL"
                    value={formData.url}
                    onChange={(e) => {
                      setFormData({...formData, url: e.target.value});
                      setErrors(prev => ({ ...prev, url: '' }));
                    }}
                    error={!!errors.url}
                    errorMessage={errors.url}
                    placeholder="article-url-slug"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Content
                  </label>
                  <TiptapEditor
                    content={formData.content}
                    onChange={(content) => setFormData({...formData, content})}
                    placeholder="Write your article content here..."
                  />
                </div>

                <div className="mb-4">
                  <AdminInputSelect
                    id="categoryId"
                    name="categoryId"
                    label="Category"
                    value={formData.categoryId}
                    onChange={(e) => setFormData({...formData, categoryId: e.target.value})}
                    options={[
                      { value: "", label: "No category" },
                      ...categories.map(category => ({
                        value: category.id,
                        label: category.category
                      }))
                    ]}
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tags
                  </label>
                  <div className="space-y-2 max-h-32 overflow-y-auto border rounded p-2">
                    {tags.map(tag => (
                      <label key={tag.id} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={selectedTags.includes(tag.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedTags([...selectedTags, tag.id]);
                            } else {
                              setSelectedTags(selectedTags.filter(id => id !== tag.id));
                            }
                          }}
                          className="mr-2"
                        />
                        <span className="text-sm">{tag.tag}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="mb-4">
                  <AdminInputCheckbox
                    id="published"
                    name="published"
                    label="Published"
                    checked={formData.published}
                    onChange={(e) => setFormData({...formData, published: e.target.checked})}
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Schedule Date (Optional)
                  </label>
                  <input
                    type="datetime-local"
                    value={formData.updated}
                    onChange={(e) => setFormData({...formData, updated: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">Leave empty to use current date/time</p>
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
                      editingArticle ? 'Update' : 'Save'
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

        {showImagePicker && (
          <ImagePicker 
            images={availableImages}
            onSelect={handleImageSelect}
            onClose={() => setShowImagePicker(false)}
          />
        )}

        <AdminTable
          data={articles}
          columns={columns}
          searchFields={['title', 'description']}
          searchPlaceholder="Search by title, description, or category..."
          itemName="articles"
          onEdit={openForm}
          onDelete={(article) => handleDelete(article.id)}
          getItemId={(article) => article.id}
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

export default ArticlesPage;
