import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ArticleListWithFilter from '@/app/components/ArticleListWithFilter/ArticleListWithFilter';
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

// Helper function to create mock articles with categories
const createMockArticles = (): Article[] => [
  {
    id: 'article-1',
    title: 'React Hooks Guide',
    description: 'Learn about React hooks',
    url: 'react-hooks-guide',
    published: true,
    category: { id: 'cat-tech', category: 'Tecnologia', url: 'tecnologia' },
  },
  {
    id: 'article-2',
    title: 'Trip to Rome',
    description: 'My trip to Rome',
    url: 'trip-to-rome',
    published: true,
    category: { id: 'cat-travel', category: 'Viaggi', url: 'viaggi' },
  },
  {
    id: 'article-3',
    title: 'TypeScript Tips',
    description: 'Useful TypeScript tips',
    url: 'typescript-tips',
    published: true,
    category: { id: 'cat-tech', category: 'Tecnologia', url: 'tecnologia' },
  },
  {
    id: 'article-4',
    title: 'Weekend in Florence',
    description: 'A weekend in Florence',
    url: 'weekend-in-florence',
    published: true,
    category: { id: 'cat-travel', category: 'Viaggi', url: 'viaggi' },
  },
  {
    id: 'article-5',
    title: 'Reading Paul Auster',
    description: 'My thoughts on Timbuktu',
    url: 'reading-paul-auster',
    published: true,
    category: { id: 'cat-books', category: 'Libri', url: 'libri' },
  },
];

describe('ArticleListWithFilter', () => {
  describe('Rendering', () => {
    it('should render all articles by default', () => {
      const articles = createMockArticles();
      render(<ArticleListWithFilter articles={articles} />);

      const articleCards = screen.getAllByTestId('article-card');
      expect(articleCards).toHaveLength(5);
    });

    it('should render the "All" button', () => {
      const articles = createMockArticles();
      render(<ArticleListWithFilter articles={articles} />);

      expect(screen.getByText('All')).toBeInTheDocument();
    });

    it('should render a button for each unique category', () => {
      const articles = createMockArticles();
      render(<ArticleListWithFilter articles={articles} />);

      expect(screen.getByText('Tecnologia')).toBeInTheDocument();
      expect(screen.getByText('Viaggi')).toBeInTheDocument();
      expect(screen.getByText('Libri')).toBeInTheDocument();
    });

    it('should not render duplicate category buttons', () => {
      const articles = createMockArticles();
      render(<ArticleListWithFilter articles={articles} />);

      // "Tecnologia" appears in 2 articles but should only have 1 button
      const techButtons = screen.getAllByText('Tecnologia');
      expect(techButtons).toHaveLength(1);
    });

    it('should not render filter buttons when no articles have categories', () => {
      const articles: Article[] = [
        { id: '1', title: 'No Category', url: 'no-cat', published: true },
        { id: '2', title: 'Also No Category', url: 'also-no-cat', published: true },
      ];
      render(<ArticleListWithFilter articles={articles} />);

      expect(screen.queryByText('All')).not.toBeInTheDocument();
    });

    it('should not render filter buttons when articles array is empty', () => {
      render(<ArticleListWithFilter articles={[]} />);

      expect(screen.queryByText('All')).not.toBeInTheDocument();
    });
  });

  describe('Filtering', () => {
    it('should show "All" as active by default', () => {
      const articles = createMockArticles();
      render(<ArticleListWithFilter articles={articles} />);

      const tuttiButton = screen.getByText('All');
      expect(tuttiButton).toHaveClass('bg-black', 'text-white');
    });

    it('should filter articles when clicking a category button', () => {
      const articles = createMockArticles();
      render(<ArticleListWithFilter articles={articles} />);

      const techButton = screen.getByText('Tecnologia');
      fireEvent.click(techButton);

      const articleCards = screen.getAllByTestId('article-card');
      expect(articleCards).toHaveLength(2);
      expect(screen.getByText('React Hooks Guide')).toBeInTheDocument();
      expect(screen.getByText('TypeScript Tips')).toBeInTheDocument();
    });

    it('should show all articles when clicking "All"', () => {
      const articles = createMockArticles();
      render(<ArticleListWithFilter articles={articles} />);

      // First filter by category
      const techButton = screen.getByText('Tecnologia');
      fireEvent.click(techButton);
      expect(screen.getAllByTestId('article-card')).toHaveLength(2);

      // Then click All
      const tuttiButton = screen.getByText('All');
      fireEvent.click(tuttiButton);
      expect(screen.getAllByTestId('article-card')).toHaveLength(5);
    });

    it('should update active button styling when filtering', () => {
      const articles = createMockArticles();
      render(<ArticleListWithFilter articles={articles} />);

      const techButton = screen.getByText('Tecnologia');
      fireEvent.click(techButton);

      // Tech button should be active
      expect(techButton).toHaveClass('bg-black', 'text-white');

      // All button should be inactive
      const tuttiButton = screen.getByText('All');
      expect(tuttiButton).toHaveClass('bg-gray-100');
    });

    it('should filter to show only travel articles', () => {
      const articles = createMockArticles();
      render(<ArticleListWithFilter articles={articles} />);

      const travelButton = screen.getByText('Viaggi');
      fireEvent.click(travelButton);

      const articleCards = screen.getAllByTestId('article-card');
      expect(articleCards).toHaveLength(2);
      expect(screen.getByText('Trip to Rome')).toBeInTheDocument();
      expect(screen.getByText('Weekend in Florence')).toBeInTheDocument();
    });

    it('should filter to show only book articles', () => {
      const articles = createMockArticles();
      render(<ArticleListWithFilter articles={articles} />);

      const booksButton = screen.getByText('Libri');
      fireEvent.click(booksButton);

      const articleCards = screen.getAllByTestId('article-card');
      expect(articleCards).toHaveLength(1);
      expect(screen.getByText('Reading Paul Auster')).toBeInTheDocument();
    });

    it('should allow switching between categories', () => {
      const articles = createMockArticles();
      render(<ArticleListWithFilter articles={articles} />);

      // Filter by tech
      fireEvent.click(screen.getByText('Tecnologia'));
      expect(screen.getAllByTestId('article-card')).toHaveLength(2);

      // Switch to travel
      fireEvent.click(screen.getByText('Viaggi'));
      expect(screen.getAllByTestId('article-card')).toHaveLength(2);
      expect(screen.getByText('Trip to Rome')).toBeInTheDocument();
      expect(screen.queryByText('React Hooks Guide')).not.toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('should handle articles with mixed categories and no categories', () => {
      const articles: Article[] = [
        {
          id: '1',
          title: 'With Category',
          url: 'with-cat',
          published: true,
          category: { id: 'cat-1', category: 'Tech', url: 'tech' },
        },
        {
          id: '2',
          title: 'Without Category',
          url: 'without-cat',
          published: true,
        },
      ];
      render(<ArticleListWithFilter articles={articles} />);

      // Should show filter buttons since at least one article has a category
      expect(screen.getByText('All')).toBeInTheDocument();
      expect(screen.getByText('Tech')).toBeInTheDocument();

      // All articles shown by default
      expect(screen.getAllByTestId('article-card')).toHaveLength(2);
    });

    it('should hide uncategorized articles when filtering by a category', () => {
      const articles: Article[] = [
        {
          id: '1',
          title: 'With Category',
          url: 'with-cat',
          published: true,
          category: { id: 'cat-1', category: 'Tech', url: 'tech' },
        },
        {
          id: '2',
          title: 'Without Category',
          url: 'without-cat',
          published: true,
        },
      ];
      render(<ArticleListWithFilter articles={articles} />);

      fireEvent.click(screen.getByText('Tech'));

      expect(screen.getAllByTestId('article-card')).toHaveLength(1);
      expect(screen.getByText('With Category')).toBeInTheDocument();
      expect(screen.queryByText('Without Category')).not.toBeInTheDocument();
    });

    it('should handle a single article with a category', () => {
      const articles: Article[] = [
        {
          id: '1',
          title: 'Solo Article',
          url: 'solo',
          published: true,
          category: { id: 'cat-1', category: 'Solo Category', url: 'solo-cat' },
        },
      ];
      render(<ArticleListWithFilter articles={articles} />);

      expect(screen.getByText('All')).toBeInTheDocument();
      expect(screen.getByText('Solo Category')).toBeInTheDocument();
      expect(screen.getAllByTestId('article-card')).toHaveLength(1);
    });
  });
});
