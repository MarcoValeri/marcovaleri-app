import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import Footer from '@/app/components/Footer/Footer';

describe('Footer', () => {
  const originalDate = Date;

  beforeEach(() => {
    // Mock Date to return a consistent year
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2024-01-01'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('Rendering', () => {
    it('should render footer element', () => {
      const { container } = render(<Footer />);
      const footer = container.querySelector('footer');
      expect(footer).toBeInTheDocument();
    });

    it('should display copyright text', () => {
      render(<Footer />);
      expect(screen.getByText(/Made with/i)).toBeInTheDocument();
      expect(screen.getByText(/in London by Marco Valeri/i)).toBeInTheDocument();
      expect(screen.getByText(/All rights reserved/i)).toBeInTheDocument();
    });

    it('should display current year', () => {
      render(<Footer />);
      expect(screen.getByText(/2024/)).toBeInTheDocument();
    });

    it('should display heart emoji', () => {
      render(<Footer />);
      const heartEmoji = screen.getByText('♥');
      expect(heartEmoji).toBeInTheDocument();
    });
  });

  describe('Styling', () => {
    it('should have black background', () => {
      const { container } = render(<Footer />);
      const footer = container.querySelector('footer');
      expect(footer).toHaveClass('bg-black');
    });

    it('should have centered text', () => {
      const { container } = render(<Footer />);
      const footer = container.querySelector('footer');
      expect(footer).toHaveClass('text-center');
    });

    it('should have white text color', () => {
      render(<Footer />);
      const text = screen.getByText(/Made with/i);
      expect(text).toHaveClass('text-white');
    });

    it('should have red heart', () => {
      render(<Footer />);
      const heart = screen.getByText('♥');
      expect(heart).toHaveClass('text-red-500');
    });
  });

  describe('Dynamic Year', () => {
    it('should update year when date changes', () => {
      vi.setSystemTime(new Date('2025-06-15'));
      render(<Footer />);
      expect(screen.getByText(/2025/)).toBeInTheDocument();
    });

    it('should display correct year for different dates', () => {
      vi.setSystemTime(new Date('2023-12-31'));
      render(<Footer />);
      expect(screen.getByText(/2023/)).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have semantic footer element', () => {
      const { container } = render(<Footer />);
      const footer = container.querySelector('footer');
      expect(footer?.tagName).toBe('FOOTER');
    });

    it('should have readable text content', () => {
      render(<Footer />);
      const paragraph = screen.getByText(/Made with/i);
      expect(paragraph.tagName).toBe('P');
    });
  });
});
