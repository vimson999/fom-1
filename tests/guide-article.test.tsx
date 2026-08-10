import { render, screen } from '@testing-library/react';
import type { ComponentType } from 'react';
import { describe, expect, it } from 'vitest';
import { GuideArticle } from '@/components/guide-article';

const guide = {
  slug: 'first-week',
  title: 'Fields of Mistria Guide: A Practical First Week',
  description: 'Fields of Mistria guide for your first week: learn the confirmed early tools, farm routine, requests, stamina options, and town progress steps.',
  keyword: 'fields of mistria guide',
  updated: '2026-08-10',
  sources: [{ label: 'Steam Community: Beginner Guide', url: 'https://steamcommunity.com/sharedfiles/filedetails/?id=3301328479' }],
  Component: (() => <p>Trusted guide body</p>) as ComponentType
} as const;

describe('GuideArticle', () => {
  it('renders registry metadata as a guide heading and safe labelled sources without dumping metadata', () => {
    render(<GuideArticle guide={guide} />);

    expect(screen.getByRole('heading', { name: guide.title })).toBeInTheDocument();
    expect(screen.getByText('Trusted guide body')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Article sources' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /steam community: beginner guide/i })).toHaveAttribute('href', guide.sources[0].url);
    expect(screen.getByRole('link', { name: /steam community: beginner guide/i })).toHaveAttribute('rel', expect.stringContaining('noopener'));
    expect(screen.getByRole('link', { name: /steam community: beginner guide/i })).toHaveAttribute('rel', expect.stringContaining('noreferrer'));
    expect(screen.queryByText(/title:/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/description:/i)).not.toBeInTheDocument();
  });
});
