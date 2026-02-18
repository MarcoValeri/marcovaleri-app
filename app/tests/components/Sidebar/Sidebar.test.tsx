import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import Sidebar from '@/app/components/Sidebar/Sidebar';

// Mock react-icons
vi.mock('react-icons/fa', () => ({
  FaInstagram: () => <div data-testid="instagram-icon">Instagram</div>,
  FaTiktok: () => <div data-testid="tiktok-icon">TikTok</div>,
}));

// Mock LinkButtonYellow
vi.mock('@/app/components/LinkButtonYellow/LinkButtonYellow', () => ({
  default: ({ content }: { content: string }) => (
    <button data-testid="newsletter-button">{content}</button>
  ),
}));

describe('Sidebar', () => {
  describe('Rendering', () => {
    it('should render social media section heading', () => {
      render(<Sidebar />);
      expect(screen.getByText('Seguimi su:')).toBeInTheDocument();
    });

    it('should render newsletter section heading', () => {
      render(<Sidebar />);
      expect(screen.getByText('Iscriviti alla mia newsletter')).toBeInTheDocument();
    });

    it('should render newsletter description', () => {
      render(<Sidebar />);
      expect(screen.getByText(/Restiamo in contatto/i)).toBeInTheDocument();
    });

    it('should render Instagram icon', () => {
      render(<Sidebar />);
      expect(screen.getByTestId('instagram-icon')).toBeInTheDocument();
    });

    it('should render TikTok icon', () => {
      render(<Sidebar />);
      expect(screen.getByTestId('tiktok-icon')).toBeInTheDocument();
    });

    it('should render newsletter button', () => {
      render(<Sidebar />);
      expect(screen.getByTestId('newsletter-button')).toBeInTheDocument();
      expect(screen.getByText('Iscriviti')).toBeInTheDocument();
    });
  });

  describe('Social Media Links', () => {
    it('should have Instagram link with correct href', () => {
      render(<Sidebar />);
      const instagramLink = screen.getByLabelText('Follow on Instagram');
      expect(instagramLink).toHaveAttribute('href', 'https://www.instagram.com/marcovalerinet/');
    });

    it('should have TikTok link with correct href', () => {
      render(<Sidebar />);
      const tiktokLink = screen.getByLabelText('Follow on TikTok');
      expect(tiktokLink).toHaveAttribute('href', 'https://tiktok.com/@yourusername');
    });

    it('should open social links in new tab', () => {
      render(<Sidebar />);
      const instagramLink = screen.getByLabelText('Follow on Instagram');
      const tiktokLink = screen.getByLabelText('Follow on TikTok');
      
      expect(instagramLink).toHaveAttribute('target', '_blank');
      expect(tiktokLink).toHaveAttribute('target', '_blank');
    });

    it('should have proper security attributes on external links', () => {
      render(<Sidebar />);
      const instagramLink = screen.getByLabelText('Follow on Instagram');
      const tiktokLink = screen.getByLabelText('Follow on TikTok');
      
      expect(instagramLink).toHaveAttribute('rel', 'noopener noreferrer');
      expect(tiktokLink).toHaveAttribute('rel', 'noopener noreferrer');
    });
  });

  describe('Styling', () => {
    it('should have spacing between sections', () => {
      const { container } = render(<Sidebar />);
      const mainDiv = container.firstChild;
      expect(mainDiv).toHaveClass('space-y-8');
    });

    it('should have white background on social section', () => {
      const { container } = render(<Sidebar />);
      const socialSection = container.querySelector('.bg-white');
      expect(socialSection).toBeInTheDocument();
    });

    it('should have black background on newsletter section', () => {
      const { container } = render(<Sidebar />);
      const newsletterSection = container.querySelector('.bg-black');
      expect(newsletterSection).toBeInTheDocument();
    });

    it('should have rounded corners on sections', () => {
      const { container } = render(<Sidebar />);
      const sections = container.querySelectorAll('.rounded-lg');
      expect(sections.length).toBeGreaterThan(0);
    });

    it('should have shadow on sections', () => {
      const { container } = render(<Sidebar />);
      const sections = container.querySelectorAll('.shadow-lg');
      expect(sections.length).toBe(2);
    });
  });

  describe('Accessibility', () => {
    it('should have aria-labels on social links', () => {
      render(<Sidebar />);
      expect(screen.getByLabelText('Follow on Instagram')).toBeInTheDocument();
      expect(screen.getByLabelText('Follow on TikTok')).toBeInTheDocument();
    });

    it('should have proper heading hierarchy', () => {
      render(<Sidebar />);
      const headings = screen.getAllByRole('heading', { level: 3 });
      expect(headings).toHaveLength(2);
    });

    it('should have semantic HTML structure', () => {
      const { container } = render(<Sidebar />);
      const headings = container.querySelectorAll('h3');
      expect(headings).toHaveLength(2);
    });
  });

  describe('Layout', () => {
    it('should display social icons in a row', () => {
      const { container } = render(<Sidebar />);
      const iconsContainer = container.querySelector('.flex.gap-4');
      expect(iconsContainer).toBeInTheDocument();
    });

    it('should have proper spacing between social icons', () => {
      const { container } = render(<Sidebar />);
      const iconsContainer = container.querySelector('.flex.gap-4');
      expect(iconsContainer).toHaveClass('gap-4');
    });
  });

  describe('Hover Effects', () => {
    it('should have transition classes on social links', () => {
      render(<Sidebar />);
      const instagramLink = screen.getByLabelText('Follow on Instagram');
      expect(instagramLink).toHaveClass('transition-all');
      expect(instagramLink).toHaveClass('duration-300');
    });

    it('should have hover scale effect on social links', () => {
      render(<Sidebar />);
      const instagramLink = screen.getByLabelText('Follow on Instagram');
      expect(instagramLink).toHaveClass('hover:scale-110');
    });

    it('should have hover color change on social links', () => {
      render(<Sidebar />);
      const instagramLink = screen.getByLabelText('Follow on Instagram');
      expect(instagramLink).toHaveClass('hover:bg-accent');
    });
  });
});
