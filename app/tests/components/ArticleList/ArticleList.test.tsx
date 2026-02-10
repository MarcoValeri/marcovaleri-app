import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ArticleList from '@/app/components/ArticleList/ArticleList';
import type { Article } from '@/app/lib/articles';

// Mock ArticleCard component
vi.mock('@/app/components/ArticleCard/ArticleCard', () => ({
  default: ({ title, articleUrl }: { title: string; articleUrl: string }) => (
    <div data-testid="article-card">
      <a href={articleUrl}>{title}</a>
    </div>
  ),
}));

// Mock window.scrollTo
beforeEach(() => {
  window.scrollTo = vi.fn();
});

// Helper function to create mock articles
const createMockArticles = (count: number): Article[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: `article-${i + 1}`,
    title: `Article ${i + 1}`,
    description: `Description for article ${i + 1}`,
    url: `article-${i + 1}`,
    content: `Content for article ${i + 1}`,
    published: true,
    category: {
      id: 'cat-1',
      category: 'Technology',
      url: 'technology',
    },
    featuredImage: {
      id: 'img-1',
      name: 'image.jpg',
      url: 'https://example.com/image.jpg',
    },
  }));
};

describe('ArticleList', () => {
  describe('Rendering', () => {
    it('should render articles in a grid', () => {
      const articles = createMockArticles(3);
      render(<ArticleList articles={articles} />);

      const articleCards = screen.getAllByTestId('article-card');
      expect(articleCards).toHaveLength(3);
    });

    it('should display "No articles found" when articles array is empty', () => {
      render(<ArticleList articles={[]} />);

      expect(screen.getByText('No articles found.')).toBeInTheDocument();
    });

    it('should not render pagination when there is only one page', () => {
      const articles = createMockArticles(5); // Less than default itemsPerPage (9)
      render(<ArticleList articles={articles} />);

      expect(screen.queryByText('Previous')).not.toBeInTheDocument();
      expect(screen.queryByText('Next')).not.toBeInTheDocument();
    });

    it('should render pagination when there are multiple pages', () => {
      const articles = createMockArticles(20); // More than default itemsPerPage (9)
      render(<ArticleList articles={articles} />);

      expect(screen.getByText('Previous')).toBeInTheDocument();
      expect(screen.getByText('Next')).toBeInTheDocument();
    });
  });

  describe('Pagination', () => {
    it('should display correct number of articles per page', () => {
      const articles = createMockArticles(20);
      render(<ArticleList articles={articles} itemsPerPage={5} />);

      const articleCards = screen.getAllByTestId('article-card');
      expect(articleCards).toHaveLength(5);
    });

    it('should display correct number of page buttons', () => {
      const articles = createMockArticles(20);
      render(<ArticleList articles={articles} itemsPerPage={5} />);

      // 20 articles / 5 per page = 4 pages
      expect(screen.getByText('1')).toBeInTheDocument();
      expect(screen.getByText('2')).toBeInTheDocument();
      expect(screen.getByText('3')).toBeInTheDocument();
      expect(screen.getByText('4')).toBeInTheDocument();
    });

    it('should disable Previous button on first page', () => {
      const articles = createMockArticles(20);
      render(<ArticleList articles={articles} />);

      const previousButton = screen.getByText('Previous');
      expect(previousButton).toBeDisabled();
    });

    it('should enable Previous button when not on first page', () => {
      const articles = createMockArticles(20);
      render(<ArticleList articles={articles} />);

      const nextButton = screen.getByText('Next');
      fireEvent.click(nextButton);

      const previousButton = screen.getByText('Previous');
      expect(previousButton).not.toBeDisabled();
    });

    it('should disable Next button on last page', () => {
      const articles = createMockArticles(10);
      render(<ArticleList articles={articles} itemsPerPage={5} />);

      // Navigate to last page
      const page2Button = screen.getByText('2');
      fireEvent.click(page2Button);

      const nextButton = screen.getByText('Next');
      expect(nextButton).toBeDisabled();
    });

    it('should change page when clicking page number', () => {
      const articles = createMockArticles(20);
      render(<ArticleList articles={articles} itemsPerPage={5} />);

      const page2Button = screen.getByText('2');
      fireEvent.click(page2Button);

      // Check that page 2 button has active styling
      expect(page2Button).toHaveClass('bg-accent');
    });

    it('should change page when clicking Next button', () => {
      const articles = createMockArticles(20);
      render(<ArticleList articles={articles} itemsPerPage={5} />);

      const nextButton = screen.getByText('Next');
      fireEvent.click(nextButton);

      const page2Button = screen.getByText('2');
      expect(page2Button).toHaveClass('bg-accent');
    });

    it('should change page when clicking Previous button', () => {
      const articles = createMockArticles(20);
      render(<ArticleList articles={articles} itemsPerPage={5} />);

      // Go to page 2
      const nextButton = screen.getByText('Next');
      fireEvent.click(nextButton);

      // Go back to page 1
      const previousButton = screen.getByText('Previous');
      fireEvent.click(previousButton);

      const page1Button = screen.getByText('1');
      expect(page1Button).toHaveClass('bg-accent');
    });

    it('should scroll to top when changing pages', () => {
      const articles = createMockArticles(20);
      render(<ArticleList articles={articles} />);

      const nextButton = screen.getByText('Next');
      fireEvent.click(nextButton);

      expect(window.scrollTo).toHaveBeenCalledWith({
        top: 0,
        behavior: 'smooth',
      });
    });

    it('should display correct articles for current page', () => {
      const articles = createMockArticles(15);
      render(<ArticleList articles={articles} itemsPerPage={5} />);

      // Page 1 should show articles 1-5
      expect(screen.getByText('Article 1')).toBeInTheDocument();
      expect(screen.getByText('Article 5')).toBeInTheDocument();
      expect(screen.queryByText('Article 6')).not.toBeInTheDocument();

      // Go to page 2
      const page2Button = screen.getByText('2');
      fireEvent.click(page2Button);

      // Page 2 should show articles 6-10
      expect(screen.queryByText('Article 1')).not.toBeInTheDocument();
      expect(screen.getByText('Article 6')).toBeInTheDocument();
      expect(screen.getByText('Article 10')).toBeInTheDocument();
    });
  });

  describe('Custom itemsPerPage', () => {
    it('should respect custom itemsPerPage prop', () => {
      const articles = createMockArticles(20);
      render(<ArticleList articles={articles} itemsPerPage={3} />);

      const articleCards = screen.getAllByTestId('article-card');
      expect(articleCards).toHaveLength(3);
    });

    it('should calculate correct number of pages with custom itemsPerPage', () => {
      const articles = createMockArticles(10);
      render(<ArticleList articles={articles} itemsPerPage={3} />);

      // 10 articles / 3 per page = 4 pages (3 full + 1 partial)
      expect(screen.getByText('1')).toBeInTheDocument();
      expect(screen.getByText('2')).toBeInTheDocument();
      expect(screen.getByText('3')).toBeInTheDocument();
      expect(screen.getByText('4')).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('should handle exactly one page of articles', () => {
      const articles = createMockArticles(9); // Exactly itemsPerPage
      render(<ArticleList articles={articles} />);

      expect(screen.queryByText('Previous')).not.toBeInTheDocument();
      expect(screen.queryByText('Next')).not.toBeInTheDocument();
    });

    it('should handle articles with missing optional fields', () => {
      const articles: Article[] = [
        {
          id: '1',
          title: 'Article 1',
          url: 'article-1',
          published: true,
        },
      ];

      render(<ArticleList articles={articles} />);
      expect(screen.getByText('Article 1')).toBeInTheDocument();
    });

    it('should handle single article', () => {
      const articles = createMockArticles(1);
      render(<ArticleList articles={articles} />);

      const articleCards = screen.getAllByTestId('article-card');
      expect(articleCards).toHaveLength(1);
      expect(screen.queryByText('Previous')).not.toBeInTheDocument();
    });
  });
});
