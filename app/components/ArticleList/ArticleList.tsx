'use client';

import { useState } from 'react';
import ArticleCard from '../ArticleCard/ArticleCard';
import type { Article } from '@/app/lib/articles';

interface ArticleListProps {
  articles: Article[];
  itemsPerPage?: number;
}

const ArticleList = ({ articles, itemsPerPage = 9 }: ArticleListProps) => {
  const [currentPage, setCurrentPage] = useState(1);

  // Calculate pagination
  const totalPages = Math.ceil(articles.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentArticles = articles.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div>
      {/* Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
        {currentArticles.map((article) => (
          <ArticleCard
            key={article.id}
            title={article.title}
            description={article.description || ''}
            category={article.category?.category}
            imageUrl={article.featuredImage?.url}
            articleUrl={`/articles/${article.url}`}
          />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 pb-20">
          {/* Previous Button */}
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 rounded-lg border border-black text-black 
                     hover:bg-black hover:text-white transition-all duration-300
                     disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent 
                     disabled:hover:text-black"
          >
            Previous
          </button>

          {/* Page Numbers */}
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`px-4 py-2 rounded-lg border transition-all duration-300 ${
                currentPage === page
                  ? 'bg-accent text-white border-accent'
                  : 'border-black text-black hover:bg-black hover:text-white'
              }`}
            >
              {page}
            </button>
          ))}

          {/* Next Button */}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-4 py-2 rounded-lg border border-black text-black 
                     hover:bg-black hover:text-white transition-all duration-300
                     disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent 
                     disabled:hover:text-black"
          >
            Next
          </button>
        </div>
      )}

      {/* No Articles Message */}
      {articles.length === 0 && (
        <div className="text-center py-20">
          <p className="text-2xl text-black">No articles found.</p>
        </div>
      )}
    </div>
  );
};

export default ArticleList;
