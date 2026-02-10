import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ArticleCard from '@/app/components/ArticleCard/ArticleCard';

// Mock Next.js Image component
vi.mock('next/image', () => ({
  default: ({ src, alt, onError }: any) => (
    <img src={src} alt={alt} onError={onError} data-testid="article-image" />
  ),
}));

// Mock Next.js Link component
vi.mock('next/link', () => ({
  default: ({ href, children, ...props }: any) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

describe('ArticleCard', () => {
  const defaultProps = {
    title: 'Test Article Title',
    description: 'Test article description',
    articleUrl: '/articles/test-article',
  };

  describe('Rendering', () => {
    it('should render article title', () => {
      render(<ArticleCard {...defaultProps} />);
      expect(screen.getByText('Test Article Title')).toBeInTheDocument();
    });

    it('should render article description', () => {
      render(<ArticleCard {...defaultProps} />);
      expect(screen.getByText('Test article description')).toBeInTheDocument();
    });

    it('should render as a link with correct href', () => {
      render(<ArticleCard {...defaultProps} />);
      const link = screen.getByRole('link');
      expect(link).toHaveAttribute('href', '/articles/test-article');
    });

    it('should render category badge when category is provided', () => {
      render(<ArticleCard {...defaultProps} category="Technology" />);
      expect(screen.getByText('Technology')).toBeInTheDocument();
    });

    it('should not render category badge when category is not provided', () => {
      render(<ArticleCard {...defaultProps} />);
      expect(screen.queryByText(/technology/i)).not.toBeInTheDocument();
    });

    it('should apply custom className', () => {
      render(<ArticleCard {...defaultProps} className="custom-class" />);
      const link = screen.getByRole('link');
      expect(link).toHaveClass('custom-class');
    });
  });

  describe('Image Handling', () => {
    it('should render image when imageUrl is provided', () => {
      render(<ArticleCard {...defaultProps} imageUrl="https://example.com/image.jpg" />);
      const image = screen.getByTestId('article-image');
      expect(image).toHaveAttribute('src', 'https://example.com/image.jpg');
      expect(image).toHaveAttribute('alt', 'Test Article Title');
    });

    it('should render fallback with first letter when no imageUrl', () => {
      render(<ArticleCard {...defaultProps} />);
      expect(screen.getByText('T')).toBeInTheDocument(); // First letter of title
    });

    it('should render fallback when image fails to load', () => {
      render(<ArticleCard {...defaultProps} imageUrl="https://example.com/broken.jpg" />);
      const image = screen.getByTestId('article-image');
      
      // Simulate image error
      fireEvent.error(image);
      
      expect(screen.getByText('T')).toBeInTheDocument();
    });
  });

  describe('Hover Effects', () => {
    it('should apply hover styles on mouse enter', () => {
      render(<ArticleCard {...defaultProps} />);
      const link = screen.getByRole('link');
      const article = link.querySelector('article');
      
      fireEvent.mouseEnter(link);
      
      expect(article).toHaveClass('bg-black');
    });

    it('should remove hover styles on mouse leave', () => {
      render(<ArticleCard {...defaultProps} />);
      const link = screen.getByRole('link');
      const article = link.querySelector('article');
      
      fireEvent.mouseEnter(link);
      fireEvent.mouseLeave(link);
      
      expect(article).toHaveClass('bg-white');
    });

    it('should change category badge color on hover', () => {
      render(<ArticleCard {...defaultProps} category="Technology" />);
      const link = screen.getByRole('link');
      const badge = screen.getByText('Technology').parentElement;
      
      fireEvent.mouseEnter(link);
      
      expect(badge).toHaveClass('bg-accent');
    });
  });

  describe('Accessibility', () => {
    it('should have proper semantic HTML structure', () => {
      render(<ArticleCard {...defaultProps} />);
      expect(screen.getByRole('article')).toBeInTheDocument();
      expect(screen.getByRole('link')).toBeInTheDocument();
    });

    it('should have proper heading hierarchy', () => {
      render(<ArticleCard {...defaultProps} />);
      const heading = screen.getByRole('heading', { level: 2 });
      expect(heading).toHaveTextContent('Test Article Title');
    });
  });
});
