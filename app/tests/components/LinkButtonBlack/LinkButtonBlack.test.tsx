import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import LinkButtonBlack from '@/app/components/LinkButtonBlack/LinkButtonBlack';

describe('LinkButtonBlack', () => {
    it('renders internal link with Next.js Link component', () => {
        render(
            <LinkButtonBlack
                externalLink={false}
                link="/articles"
                content="View All Articles"
            />
        );

        const link = screen.getByRole('link', { name: 'View All Articles' });
        expect(link).toBeInTheDocument();
        expect(link).toHaveAttribute('href', '/articles');
        expect(link).not.toHaveAttribute('target');
        expect(link).not.toHaveAttribute('rel');
    });

    it('renders external link with anchor tag', () => {
        render(
            <LinkButtonBlack
                externalLink={true}
                link="https://example.com"
                content="External Link"
            />
        );

        const link = screen.getByRole('link', { name: 'External Link' });
        expect(link).toBeInTheDocument();
        expect(link).toHaveAttribute('href', 'https://example.com');
        expect(link).toHaveAttribute('target', '_blank');
        expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    });

    it('applies correct styling classes', () => {
        render(
            <LinkButtonBlack
                externalLink={false}
                link="/test"
                content="Test Button"
            />
        );

        const link = screen.getByRole('link', { name: 'Test Button' });
        expect(link).toHaveClass('bg-black');
        expect(link).toHaveClass('text-white');
        expect(link).toHaveClass('rounded-lg');
        expect(link).toHaveClass('hover:bg-accent');
        expect(link).toHaveClass('hover:scale-105');
    });

    it('renders button content correctly', () => {
        const content = 'Learn More';
        render(
            <LinkButtonBlack
                externalLink={true}
                link="https://docs.example.com"
                content={content}
            />
        );

        expect(screen.getByText(content)).toBeInTheDocument();
    });
});
