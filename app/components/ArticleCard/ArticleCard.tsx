'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';

interface ArticleCardProps {
  title: string;
  description: string;
  category?: string;
  imageUrl?: string;
  articleUrl: string;
  className?: string;
}

const ArticleCard = ({
  title,
  description,
  category,
  imageUrl,
  articleUrl,
  className = ''
}: ArticleCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [imageError, setImageError] = useState(false);

  return (
    <Link
      href={articleUrl}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`block ${className}`}
    >
      <article
        className={`flex flex-col gap-[30px] p-5 rounded-[10px] transition-all duration-500 ease-in-out
          shadow-[0px_0px_50px_0px_rgba(0,0,0,0.1)]
          ${isHovered ? 'bg-black shadow-[0px_10px_60px_0px_rgba(0,0,0,0.3)] -translate-y-2' : 'bg-white'}`}
      >
        {/* Image */}
        <div className="relative w-full h-[351px] rounded-[10px] overflow-hidden">
          {imageUrl && !imageError ? (
            <Image
              src={imageUrl}
              alt={title}
              fill
              className="object-cover"
              unoptimized
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-black to-accent flex items-center justify-center">
              <span className="text-white text-6xl font-bold opacity-20">
                {title.charAt(0)}
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex flex-col gap-5">
          {/* Title */}
          <h2
            className={`text-[42px] leading-[1.1] font-medium transition-colors duration-500 ease-in-out
              ${isHovered ? 'text-white' : 'text-black'}`}
          >
            {title}
          </h2>

          {/* Category Badge */}
          {category && (
            <div
              className={`inline-flex items-center px-[15px] py-[10px] rounded-[30px] w-fit transition-all duration-500 ease-in-out
                ${isHovered ? 'bg-accent scale-105' : 'bg-black'}`}
            >
              <p className="font-['Inter'] text-[14px] leading-[1.16] uppercase font-medium text-white">
                {category}
              </p>
            </div>
          )}

          {/* Description */}
          <p
            className={`font-['Inter'] font-light text-[18px] leading-[26px] transition-colors duration-500 ease-in-out
              ${isHovered ? 'text-white' : 'text-black'}`}
          >
            {description}
          </p>
        </div>
      </article>
    </Link>
  );
};

export default ArticleCard;
