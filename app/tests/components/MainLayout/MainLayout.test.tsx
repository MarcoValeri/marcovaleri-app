import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import MainLayout from '@/app/components/MainLayout/MainLayout';

// Mock Sidebar component
vi.mock('@/app/components/Sidebar/Sidebar', () => ({
  default: () => <div data-testid="sidebar">Sidebar Content</div>,
}));

describe('MainLayout', () => {
  describe('Rendering', () => {
    it('should render children content', () => {
      render(
        <MainLayout>
          <div>Test Content</div>
        </MainLayout>
      );
      expect(screen.getByText('Test Content')).toBeInTheDocument();
    });

    it('should render Sidebar component', () => {
      render(
        <MainLayout>
          <div>Test Content</div>
        </MainLayout>
      );
      expect(screen.getByTestId('sidebar')).toBeInTheDocument();
    });

    it('should render main element', () => {
      const { container } = render(
        <MainLayout>
          <div>Test Content</div>
        </MainLayout>
      );
      const main = container.querySelector('main');
      expect(main).toBeInTheDocument();
    });
  });

  describe('Layout Structure', () => {
    it('should have flex layout', () => {
      const { container } = render(
        <MainLayout>
          <div>Test Content</div>
        </MainLayout>
      );
      const main = container.querySelector('main');
      expect(main).toHaveClass('flex');
    });

    it('should have responsive flex direction', () => {
      const { container } = render(
        <MainLayout>
          <div>Test Content</div>
        </MainLayout>
      );
      const main = container.querySelector('main');
      expect(main).toHaveClass('flex-col');
      expect(main).toHaveClass('lg:flex-row');
    });

    it('should have correct width classes for content area', () => {
      const { container } = render(
        <MainLayout>
          <div>Test Content</div>
        </MainLayout>
      );
      const contentDiv = container.querySelector('main > div:first-child');
      expect(contentDiv).toHaveClass('w-full');
      expect(contentDiv).toHaveClass('lg:w-[60%]');
    });

    it('should have correct width classes for sidebar area', () => {
      const { container } = render(
        <MainLayout>
          <div>Test Content</div>
        </MainLayout>
      );
      const sidebarDiv = container.querySelector('main > div:last-child');
      expect(sidebarDiv).toHaveClass('w-full');
      expect(sidebarDiv).toHaveClass('lg:w-[40%]');
    });
  });

  describe('Children Rendering', () => {
    it('should render multiple children', () => {
      render(
        <MainLayout>
          <div>First Child</div>
          <div>Second Child</div>
        </MainLayout>
      );
      expect(screen.getByText('First Child')).toBeInTheDocument();
      expect(screen.getByText('Second Child')).toBeInTheDocument();
    });

    it('should render complex children', () => {
      render(
        <MainLayout>
          <div>
            <h1>Title</h1>
            <p>Paragraph</p>
          </div>
        </MainLayout>
      );
      expect(screen.getByText('Title')).toBeInTheDocument();
      expect(screen.getByText('Paragraph')).toBeInTheDocument();
    });

    it('should render React components as children', () => {
      const TestComponent = () => <div>Test Component</div>;
      render(
        <MainLayout>
          <TestComponent />
        </MainLayout>
      );
      expect(screen.getByText('Test Component')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should use semantic main element', () => {
      const { container } = render(
        <MainLayout>
          <div>Test Content</div>
        </MainLayout>
      );
      const main = container.querySelector('main');
      expect(main?.tagName).toBe('MAIN');
    });

    it('should maintain proper content hierarchy', () => {
      render(
        <MainLayout>
          <h1>Main Heading</h1>
        </MainLayout>
      );
      const heading = screen.getByRole('heading', { level: 1 });
      expect(heading).toHaveTextContent('Main Heading');
    });
  });

  describe('Responsive Behavior', () => {
    it('should have padding on content area', () => {
      const { container } = render(
        <MainLayout>
          <div>Test Content</div>
        </MainLayout>
      );
      const contentDiv = container.querySelector('main > div:first-child');
      expect(contentDiv).toHaveClass('p-6');
    });

    it('should have padding on sidebar area', () => {
      const { container } = render(
        <MainLayout>
          <div>Test Content</div>
        </MainLayout>
      );
      const sidebarDiv = container.querySelector('main > div:last-child');
      expect(sidebarDiv).toHaveClass('p-6');
    });
  });
});
