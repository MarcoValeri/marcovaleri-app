import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import LinkButtonYellow from '@/app/components/LinkButtonYellow/LinkButtonYellow';

describe('LinkButtonYellow', () => {
    it('renders internal link with Next.js Link component', () => {
        render(
            <LinkButtonYellow
                externalLink={false}
                link="/articles"
                content="Read Articles"
            />
        );

        const link = screen.getByRole('link', { name: 'Read Articles' });
        expect(link).toBeInTheDocument();
        expect(link).toHaveAttribute('href', '/articles');
        expect(link).not.toHaveAttribute('target');
        expect(link).not.toHaveAttribute('rel');
    });

    it('renders external link with anchor tag', () => {
        render(
            <LinkButtonYellow
                externalLink={true}
                link="https://example.com"
                content="Visit Website"
            />
        );

        const link = screen.getByRole('link', { name: 'Visit Website' });
        expect(link).toBeInTheDocument();
        expect(link).toHaveAttribute('href', 'https://example.com');
        expect(link).toHaveAttribute('target', '_blank');
        expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    });

    it('applies correct styling classes', () => {
        render(
            <LinkButtonYellow
                externalLink={false}
                link="/test"
                content="Test Button"
            />
        );

        const link = screen.getByRole('link', { name: 'Test Button' });
        expect(link).toHaveClass('bg-accent');
        expect(link).toHaveClass('text-white');
        expect(link).toHaveClass('rounded-lg');
        expect(link).toHaveClass('hover:bg-white');
        expect(link).toHaveClass('hover:text-black');
    });

    it('renders button content correctly', () => {
        const content = 'Subscribe Now';
        render(
            <LinkButtonYellow
                externalLink={true}
                link="https://newsletter.com"
                content={content}
            />
        );

        expect(screen.getByText(content)).toBeInTheDocument();
    });
});
