import { cleanup, render, screen } from '@testing-library/react';
import fs from 'node:fs';
import path from 'node:path';
import type { ComponentType } from 'react';
import { afterEach, describe, expect, it } from 'vitest';
import { GuideArticle } from '@/components/guide-article';

afterEach(cleanup);

const guide = {
  slug: 'first-week',
  title: 'Fields of Mistria Guide: A Practical First Week',
  description: 'Fields of Mistria guide for your first week: learn the confirmed early tools, farm routine, requests, stamina options, and town progress steps.',
  keyword: 'fields of mistria guide',
  updated: '2026-08-10',
  sources: [{ label: 'Steam Community: Beginner Guide', url: 'https://steamcommunity.com/sharedfiles/filedetails/?id=3301328479' }],
  Component: (() => <>
    <h1>Fields of Mistria Guide: A Practical First Week</h1>
    <p>Trusted guide body</p>
    <h2>First steps</h2>
    <h3>Choose a tool</h3>
  </>) as ComponentType
} as const;

describe('GuideArticle', () => {
  it('renders one MDX H1 followed by a logical H2 and H3 outline', () => {
    render(<GuideArticle guide={guide} />);

    const headings = screen.getAllByRole('heading');
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
    expect(headings.slice(0, 3).map((heading) => `${heading.tagName}:${heading.textContent}`)).toEqual([
      `H1:${guide.title}`,
      'H2:First steps',
      'H3:Choose a tool'
    ]);
  });

  it('renders safe labelled sources without dumping metadata', () => {
    render(<GuideArticle guide={guide} />);

    expect(screen.getByText('Trusted guide body')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Article sources' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /steam community: beginner guide/i })).toHaveAttribute('href', guide.sources[0].url);
    expect(screen.getByRole('link', { name: /steam community: beginner guide/i })).toHaveAttribute('rel', expect.stringContaining('noopener'));
    expect(screen.getByRole('link', { name: /steam community: beginner guide/i })).toHaveAttribute('rel', expect.stringContaining('noreferrer'));
    expect(screen.queryByText(/title:/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/description:/i)).not.toBeInTheDocument();
  });

  it('keeps the actual Olric H3 card embed after the first H2', () => {
    const source = fs.readFileSync(path.join(process.cwd(), 'content/guides/olric-fields-of-mistria-gifts.mdx'), 'utf8');

    expect(source.indexOf('<OlricGiftGroups />')).toBeGreaterThan(source.search(/^##\s/m));
  });
});
