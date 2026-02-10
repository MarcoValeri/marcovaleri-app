import { generateClient } from 'aws-amplify/data';
import type { Schema } from '@/amplify/data/resource';
import { getUrl } from 'aws-amplify/storage';

const client = generateClient<Schema>();

export interface Article {
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
  featuredImage?: {
    id: string;
    name: string;
    url: string;
    caption?: string;
    description?: string;
  };
  published: boolean;
  updated?: string;
  createdAt?: string;
}

// Helper function to sign image URLs in content
const signContentImages = async (htmlContent: string): Promise<string> => {
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

// Helper function to sign featured image URL
const signFeaturedImage = async (imageUrl?: string) => {
  if (!imageUrl || imageUrl.startsWith('http')) return imageUrl;
  
  try {
    const urlResult = await getUrl({ path: imageUrl });
    return urlResult.url.toString();
  } catch (error) {
    console.error('Failed to sign featured image:', imageUrl);
    return imageUrl;
  }
};

/**
 * Fetch all published articles
 * @param limit - Optional limit for number of articles to fetch
 * @returns Array of published articles sorted by updated date (newest first)
 */
export async function getArticles(limit?: number): Promise<Article[]> {
  try {
    const { data } = await client.models.Article.list({
      filter: { published: { eq: true } },
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
        'articleTags.tag.*',
        'featuredImage.*'
      ]
    });

    // Sort by updated date (newest first)
    const sortedArticles = (data as Article[]).sort((a, b) => {
      const dateA = new Date(a.updated || a.createdAt || 0).getTime();
      const dateB = new Date(b.updated || b.createdAt || 0).getTime();
      return dateB - dateA;
    });

    // Apply limit if specified
    const articles = limit ? sortedArticles.slice(0, limit) : sortedArticles;

    // Sign featured image URLs
    const articlesWithSignedImages = await Promise.all(
      articles.map(async (article) => {
        if (article.featuredImage?.url) {
          const signedUrl = await signFeaturedImage(article.featuredImage.url);
          return {
            ...article,
            featuredImage: {
              ...article.featuredImage,
              url: signedUrl || article.featuredImage.url
            }
          };
        }
        return article;
      })
    );

    return articlesWithSignedImages;
  } catch (error) {
    console.error('Error fetching articles:', error);
    return [];
  }
}

/**
 * Fetch a single article by URL slug
 * @param urlSlug - The URL slug of the article
 * @returns Single article or null if not found
 */
export async function getArticleByUrl(urlSlug: string): Promise<Article | null> {
  try {
    const { data } = await client.models.Article.list({
      filter: {
        url: { eq: urlSlug },
        published: { eq: true }
      },
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
        'articleTags.tag.*',
        'featuredImage.*'
      ]
    });

    if (!data || data.length === 0) {
      return null;
    }

    const article = data[0] as Article;

    // Sign images in content
    if (article.content) {
      article.content = await signContentImages(article.content);
    }

    // Sign featured image URL
    if (article.featuredImage?.url) {
      const signedUrl = await signFeaturedImage(article.featuredImage.url);
      article.featuredImage.url = signedUrl || article.featuredImage.url;
    }

    return article;
  } catch (error) {
    console.error('Error fetching article by URL:', error);
    return null;
  }
}

/**
 * Fetch articles by category URL
 * @param categoryUrl - The URL slug of the category
 * @param limit - Optional limit for number of articles to fetch
 * @returns Array of published articles in the category
 */
export async function getArticlesByCategory(categoryUrl: string, limit?: number): Promise<Article[]> {
  try {
    // First, get the category by URL
    const { data: categories } = await client.models.Category.list({
      filter: { url: { eq: categoryUrl } }
    });

    if (!categories || categories.length === 0) {
      return [];
    }

    const categoryId = categories[0].id;

    // Then get articles for that category
    const { data } = await client.models.Article.list({
      filter: {
        categoryId: { eq: categoryId },
        published: { eq: true }
      },
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
        'articleTags.tag.*',
        'featuredImage.*'
      ]
    });

    // Sort by updated date (newest first)
    const sortedArticles = (data as Article[]).sort((a, b) => {
      const dateA = new Date(a.updated || a.createdAt || 0).getTime();
      const dateB = new Date(b.updated || b.createdAt || 0).getTime();
      return dateB - dateA;
    });

    // Apply limit if specified
    const articles = limit ? sortedArticles.slice(0, limit) : sortedArticles;

    // Sign featured image URLs
    const articlesWithSignedImages = await Promise.all(
      articles.map(async (article) => {
        if (article.featuredImage?.url) {
          const signedUrl = await signFeaturedImage(article.featuredImage.url);
          return {
            ...article,
            featuredImage: {
              ...article.featuredImage,
              url: signedUrl || article.featuredImage.url
            }
          };
        }
        return article;
      })
    );

    return articlesWithSignedImages;
  } catch (error) {
    console.error('Error fetching articles by category:', error);
    return [];
  }
}

/**
 * Fetch articles by tag URL
 * @param tagUrl - The URL slug of the tag
 * @param limit - Optional limit for number of articles to fetch
 * @returns Array of published articles with the tag
 */
export async function getArticlesByTag(tagUrl: string, limit?: number): Promise<Article[]> {
  try {
    // First, get the tag by URL
    const { data: tags } = await client.models.Tag.list({
      filter: { url: { eq: tagUrl } }
    });

    if (!tags || tags.length === 0) {
      return [];
    }

    const tagId = tags[0].id;

    // Get ArticleTag relationships
    const { data: articleTags } = await client.models.ArticleTag.list({
      filter: { tagId: { eq: tagId } }
    });

    if (!articleTags || articleTags.length === 0) {
      return [];
    }

    const articleIds = articleTags.map(at => at.articleId);

    // Fetch all articles with these IDs
    const articlesPromises = articleIds.map(id =>
      client.models.Article.get({ id })
    );

    const articlesResults = await Promise.all(articlesPromises);
    const articles = articlesResults
      .map(result => result.data)
      .filter(article => article && article.published);

    // Sort by updated date (newest first)
    const sortedArticles = articles.sort((a, b) => {
      if (!a || !b) return 0;
      const dateA = new Date(a.updated || a.createdAt || 0).getTime();
      const dateB = new Date(b.updated || b.createdAt || 0).getTime();
      return dateB - dateA;
    });

    // Apply limit if specified
    const limitedArticles = limit ? sortedArticles.slice(0, limit) : sortedArticles;

    // Sign featured image URLs
    const articlesWithSignedImages = await Promise.all(
      limitedArticles.map(async (article) => {
        if (!article) return null;
        
        // Get featured image if exists
        let featuredImageUrl = undefined;
        if (article.featuredImageId) {
          try {
            const { data: imageData } = await client.models.Image.get({ 
              id: article.featuredImageId 
            });
            if (imageData?.url) {
              featuredImageUrl = await signFeaturedImage(imageData.url);
            }
          } catch (error) {
            console.error('Error fetching featured image:', error);
          }
        }

        return {
          id: article.id,
          title: article.title,
          description: article.description,
          url: article.url,
          content: article.content,
          published: article.published,
          updated: article.updated,
          createdAt: article.createdAt,
          featuredImage: featuredImageUrl ? {
            id: article.featuredImageId || '',
            name: '',
            url: featuredImageUrl
          } : undefined
        } as Article;
      })
    );

    return articlesWithSignedImages.filter(a => a !== null) as Article[];
  } catch (error) {
    console.error('Error fetching articles by tag:', error);
    return [];
  }
}
