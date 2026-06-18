import { MetadataRoute } from 'next';
import { getArticles } from './lib/articles';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://marcovaleri.net';
  
  // Fetch all published articles
  const articles = await getArticles();
  
  // Generate article URLs
  const articleUrls = articles.map((article) => ({
    url: `${baseUrl}/articles/${article.url}`,
    lastModified: article.updated || article.createdAt || new Date().toISOString(),
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date().toISOString(),
    },
    {
      url: `${baseUrl}/articles`,
      lastModified: new Date().toISOString(),
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date().toISOString(),
    },
    {
      url: `${baseUrl}/contatti`,
      lastModified: new Date().toISOString(),
    },
    ...articleUrls,
  ];
}
