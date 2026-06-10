'use client';

import { useState } from 'react';
import ArticleList from '../ArticleList/ArticleList';
import type { Article } from '@/app/lib/articles';

interface ArticleListWithFilterProps {
  articles: Article[];
}

const ArticleListWithFilter = ({ articles }: ArticleListWithFilterProps) => {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  // Extract unique categories from articles
  const categories = Array.from(
    new Map(
      articles
        .filter(article => article.category?.id && article.category?.category)
        .map(article => [article.category!.id, article.category!.category])
    ).entries()
  ).map(([id, name]) => ({ id, name }));

  // Filter articles based on selected category
  const filteredArticles = activeCategory
    ? articles.filter(article => article.category?.id === activeCategory)
    : articles;

  return (
    <div>
      {/* Category Filter Buttons */}
      {categories.length > 0 && (
        <div className="flex flex-wrap gap-3 mb-10">
          <button
            onClick={() => setActiveCategory(null)}
            className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
              activeCategory === null
                ? 'bg-black text-white'
                : 'bg-gray-100 text-black hover:bg-gray-200'
            }`}
          >
            Tutti
          </button>
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                activeCategory === category.id
                  ? 'bg-black text-white'
                  : 'bg-gray-100 text-black hover:bg-gray-200'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      )}

      {/* Articles List with Pagination */}
      <ArticleList articles={filteredArticles} />
    </div>
  );
};

export default ArticleListWithFilter;
