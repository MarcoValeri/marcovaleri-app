import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import ArticleTemplate from '@/app/components/ArticleTemplate/ArticleTemplate';
import type { Article } from '@/app/lib/articles';

// Mock Next.js Image
vi.mock('next/image', () => ({
  default: ({ src, alt }: any) => <img src={src} alt={alt} data-testid="featured-image" />,
}));

// Mock ArticleCard
vi.mock('@/app/components/ArticleCard/ArticleCard', () => ({
  default: ({ title }: { title: string }) => <div data-testid="related-article">{title}</div>,
}));

const mockArticle: Article = {
  id: '1',
  title: 'Test Article',
  description: 'Test description',
  url: 'test-article',
  content: '<p>Test content</p>',
  published: true,
  updated: '2024-01-01',
  category: {
    id: 'cat-1',
    category: 'Technology',
    url: 'technology',
  },
  featuredImage: {
    id: 'img-1',
    name: 'test.jpg',
    url: 'https://example.com/test.jpg',
  },
  articleTags: [
    {
      id: 'at-1',
      tag: {
        id: 'tag-1',
        tag: 'React',
        url: 'react',
      },
    },
  ],
};

describe('ArticleTemplate', () => {
  describe('Rendering', () => {
    it('should render article title', () => {
      render(<ArticleTemplate article={mockArticle} />);
      expect(screen.getByText('Test Article')).toBeInTheDocument();
    });

    it('should render article description', () => {
      render(<ArticleTemplate article={mockArticle} />);
      expect(screen.getByText('Test description')).toBeInTheDocument();
    });

    it('should render article content', () => {
      render(<ArticleTemplate article={mockArticle} />);
      expect(screen.getByText('Test content')).toBeInTheDocument();
    });

    it('should render category badge', () => {
      render(<ArticleTemplate article={mockArticle} />);
      expect(screen.getByText('Technology')).toBeInTheDocument();
    });

    it('should render featured image', () => {
      render(<ArticleTemplate article={mockArticle} />);
      const image = screen.getByTestId('featured-image');
      expect(image).toHaveAttribute('src', 'https://example.com/test.jpg');
    });

    it('should render tags', () => {
      render(<ArticleTemplate article={mockArticle} />);
      expect(screen.getByText('React')).toBeInTheDocument();
    });

    it('should format and display date', () => {
      render(<ArticleTemplate article={mockArticle} />);
      expect(screen.getByText(/January 1, 2024/i)).toBeInTheDocument();
    });
  });

  describe('Optional Fields', () => {
    it('should not render description when not provided', () => {
      const articleWithoutDescription = { ...mockArticle, description: undefined };
      render(<ArticleTemplate article={articleWithoutDescription} />);
      expect(screen.queryByText('Test description')).not.toBeInTheDocument();
    });

    it('should not render category when not provided', () => {
      const articleWithoutCategory = { ...mockArticle, category: undefined };
      render(<ArticleTemplate article={articleWithoutCategory} />);
      expect(screen.queryByText('TECHNOLOGY')).not.toBeInTheDocument();
    });

    it('should not render featured image when not provided', () => {
      const articleWithoutImage = { ...mockArticle, featuredImage: undefined };
      render(<ArticleTemplate article={articleWithoutImage} />);
      expect(screen.queryByTestId('featured-image')).not.toBeInTheDocument();
    });

    it('should not render tags section when no tags', () => {
      const articleWithoutTags = { ...mockArticle, articleTags: [] };
      render(<ArticleTemplate article={articleWithoutTags} />);
      expect(screen.queryByText('React')).not.toBeInTheDocument();
    });
  });

  describe('Related Articles', () => {
    const relatedArticles: Article[] = [
      {
        id: '2',
        title: 'Related Article 1',
        url: 'related-1',
        published: true,
      },
      {
        id: '3',
        title: 'Related Article 2',
        url: 'related-2',
        published: true,
      },
    ];

    it('should render related articles section when provided', () => {
      render(<ArticleTemplate article={mockArticle} relatedArticles={relatedArticles} />);
      expect(screen.getByText('Read more articles')).toBeInTheDocument();
    });

    it('should render all related articles', () => {
      render(<ArticleTemplate article={mockArticle} relatedArticles={relatedArticles} />);
      expect(screen.getByText('Related Article 1')).toBeInTheDocument();
      expect(screen.getByText('Related Article 2')).toBeInTheDocument();
    });

    it('should not render related articles section when empty', () => {
      render(<ArticleTemplate article={mockArticle} relatedArticles={[]} />);
      expect(screen.queryByText('Read more articles')).not.toBeInTheDocument();
    });

    it('should not render related articles section when not provided', () => {
      render(<ArticleTemplate article={mockArticle} />);
      expect(screen.queryByText('Read more articles')).not.toBeInTheDocument();
    });
  });

  describe('Content Rendering', () => {
    it('should render HTML content safely', () => {
      const articleWithHTML = {
        ...mockArticle,
        content: '<h2>Heading</h2><p>Paragraph</p>',
      };
      render(<ArticleTemplate article={articleWithHTML} />);
      expect(screen.getByText('Heading')).toBeInTheDocument();
      expect(screen.getByText('Paragraph')).toBeInTheDocument();
    });

    it('should handle empty content', () => {
      const articleWithoutContent = { ...mockArticle, content: '' };
      const { container } = render(<ArticleTemplate article={articleWithoutContent} />);
      const proseDiv = container.querySelector('.prose');
      expect(proseDiv).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper semantic HTML structure', () => {
      render(<ArticleTemplate article={mockArticle} />);
      expect(screen.getByRole('article')).toBeInTheDocument();
    });

    it('should have proper heading hierarchy', () => {
      render(<ArticleTemplate article={mockArticle} />);
      const mainHeading = screen.getByRole('heading', { level: 1 });
      expect(mainHeading).toHaveTextContent('Test Article');
    });
  });
});
