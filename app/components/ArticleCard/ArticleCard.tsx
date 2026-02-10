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
        className={`flex flex-col gap-[30px] p-5 rounded-[10px] transition-all duration-300 ease-in-out
          shadow-[0px_0px_50px_0px_rgba(0,69,107,0.15)]
          ${isHovered ? 'bg-[#00456B]' : 'bg-[#FCFAF6]'}`}
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
            <div className="w-full h-full bg-gradient-to-br from-[#00456B] to-[#F8AD41] flex items-center justify-center">
              <span className="text-[#FCFAF6] text-6xl font-bold opacity-20">
                {title.charAt(0)}
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex flex-col gap-5">
          {/* Title */}
          <h2
            className={`font-['Silka'] text-[42px] leading-[1.1] font-medium transition-colors duration-300
              ${isHovered ? 'text-[#FCFAF6]' : 'text-[#171C32]'}`}
          >
            {title}
          </h2>

          {/* Category Badge */}
          {category && (
            <div
              className={`inline-flex items-center px-[15px] py-[10px] rounded-[30px] w-fit transition-colors duration-300
                ${isHovered ? 'bg-[#F8AD41]' : 'bg-[#00456B]'}`}
            >
              <p
                className={`font-['Inter'] text-[14px] leading-[1.16] uppercase font-medium transition-colors duration-300
                  ${isHovered ? 'text-[#171C32]' : 'text-[#FCFAF6]'}`}
              >
                {category}
              </p>
            </div>
          )}

          {/* Description */}
          <p
            className={`font-['Inter'] font-light text-[18px] leading-[26px] transition-colors duration-300
              ${isHovered ? 'text-[#FCFAF6]' : 'text-[#171C32]'}`}
          >
            {description}
          </p>
        </div>

        {/* Button */}
        <div
          className={`flex items-center gap-[10px] px-[15px] h-[55px] rounded-[10px] border border-solid w-[200px]
            transition-colors duration-300
            ${isHovered ? 'border-[#FCFAF6]' : 'border-[#00456B]'}`}
        >
          <span
            className={`font-['Silka'] text-[18px] leading-[30px] font-medium transition-colors duration-300
              ${isHovered ? 'text-[#FCFAF6]' : 'text-[#00456B]'}`}
          >
            Read more
          </span>
          <svg
            width="26"
            height="13"
            viewBox="0 0 26 13"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="shrink-0"
          >
            <path
              d="M25.5303 7.03033C25.8232 6.73744 25.8232 6.26256 25.5303 5.96967L20.7574 1.1967C20.4645 0.903806 19.9896 0.903806 19.6967 1.1967C19.4038 1.48959 19.4038 1.96447 19.6967 2.25736L23.9393 6.5L19.6967 10.7426C19.4038 11.0355 19.4038 11.5104 19.6967 11.8033C19.9896 12.0962 20.4645 12.0962 20.7574 11.8033L25.5303 7.03033ZM0 7.25H25V5.75H0V7.25Z"
              className={`transition-colors duration-300 ${
                isHovered ? 'fill-[#FCFAF6]' : 'fill-[#00456B]'
              }`}
            />
          </svg>
        </div>
      </article>
    </Link>
  );
};

export default ArticleCard;
