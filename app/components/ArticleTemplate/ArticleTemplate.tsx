'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Article } from '@/app/lib/articles';
import ArticleCard from '../ArticleCard/ArticleCard';

interface ArticleTemplateProps {
  article: Article;
  relatedArticles?: Article[];
}

const ArticleTemplate = ({ article, relatedArticles = [] }: ArticleTemplateProps) => {
  const [imageError, setImageError] = useState(false);

  return (
    <div className="px-8 lg:px-20 py-12 lg:py-20">
      {/* Article Content Container */}
      <article className="max-w-4xl mx-auto">
        {/* Category Badge */}
        {article.category?.category && (
          <div className="mb-6">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-black">
              <p className="font-['Inter'] text-sm uppercase font-medium text-white">
                {article.category.category}
              </p>
            </div>
          </div>
        )}

        {/* Title */}
        <h1 className="text-5xl lg:text-7xl font-bold leading-tight text-black mb-6">
          {article.title}
        </h1>

        {/* Date Posted */}
        {article.updated && (
          <p className="font-['Inter'] text-sm uppercase text-black opacity-60 mb-8">
            {new Date(article.updated).toLocaleDateString('en-US', { 
              month: 'long', 
              day: 'numeric', 
              year: 'numeric' 
            })}
          </p>
        )}

        {/* Description */}
        {article.description && (
          <h2 className="text-2xl lg:text-3xl leading-relaxed text-black mb-12">
            {article.description}
          </h2>
        )}

        {/* Featured Image */}
        {article.featuredImage?.url && !imageError && (
          <div className="relative w-full h-[400px] lg:h-[600px] rounded-lg overflow-hidden mb-12">
            <Image
              src={article.featuredImage.url}
              alt={article.featuredImage.caption || article.title}
              fill
              className="object-cover"
              priority
              unoptimized
              onError={() => setImageError(true)}
            />
          </div>
        )}

        {/* Article Content */}
        <div 
          className="prose prose-lg max-w-none mb-16
            prose-headings:text-black prose-headings:font-bold
            prose-p:text-black prose-p:text-lg prose-p:leading-relaxed prose-p:mb-6
            prose-a:text-accent prose-a:no-underline hover:prose-a:underline prose-a:transition-all
            prose-strong:text-black prose-strong:font-semibold
            prose-ul:text-black prose-ul:text-lg
            prose-ol:text-black prose-ol:text-lg
            prose-li:mb-2
            prose-img:rounded-lg prose-img:shadow-lg
            prose-blockquote:border-l-4 prose-blockquote:border-accent prose-blockquote:pl-6 prose-blockquote:italic
            prose-code:text-accent prose-code:bg-black prose-code:bg-opacity-5 prose-code:px-2 prose-code:py-1 prose-code:rounded"
          dangerouslySetInnerHTML={{ __html: article.content || '' }} 
        />

        {/* Newsletter Banner */}
        <div className="my-16 bg-black text-white rounded-lg p-8 lg:p-12">
          <h3 className="text-3xl lg:text-4xl font-bold mb-4">
            Restiamo in contatto
          </h3>
          <p className="text-lg leading-relaxed mb-6 opacity-90">
            Ti è piaciuto questo articolo? Iscriviti alla mia newsletter per non perderti 
            le prossime riflessioni. È uno spazio tranquillo, lontano dal rumore dei social, 
            dove rispondo personalmente a ogni email.
          </p>
          <a
            href="https://mailchi.mp/marcovaleri/marco-valeri-newsletter"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-white text-black px-8 py-4 rounded-lg font-semibold hover:bg-accent hover:text-white transition-all duration-300"
          >
            Iscriviti alla Newsletter
          </a>
        </div>

        {/* Tags */}
        {article.articleTags && article.articleTags.length > 0 && (
          <div className="flex flex-wrap gap-3 mb-16 pb-16 border-b border-black border-opacity-10">
            {article.articleTags.map((articleTag) => (
              articleTag.tag && (
                <span
                  key={articleTag.id}
                  className="px-4 py-2 bg-black text-white rounded-full font-['Inter'] text-sm hover:bg-accent transition-colors duration-300 cursor-pointer"
                >
                  {articleTag.tag.tag}
                </span>
              )
            ))}
          </div>
        )}
      </article>

      {/* Related Articles */}
      {relatedArticles.length > 0 && (
        <div className="max-w-7xl mx-auto mt-20">
          <h2 className="text-4xl lg:text-5xl font-bold text-black mb-12">
            Read more articles
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {relatedArticles.map((relatedArticle) => (
              <ArticleCard
                key={relatedArticle.id}
                title={relatedArticle.title}
                description={relatedArticle.description || ''}
                category={relatedArticle.category?.category}
                imageUrl={relatedArticle.featuredImage?.url}
                articleUrl={`/articles/${relatedArticle.url}`}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ArticleTemplate;
