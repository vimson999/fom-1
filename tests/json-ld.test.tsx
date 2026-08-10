import { render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { JsonLd } from '@/components/json-ld';
import Home from '@/app/page';

const guide = vi.hoisted(() => ({
  slug: 'fields-of-mistria-guide',
  title: 'Fields of Mistria Guide: A Source-Based Starting Point',
  description: 'Start with a source-based overview of farming, exploration, relationships, and progression in Fields of Mistria.',
  keyword: 'Fields of Mistria guide',
  updated: '2026-08-10',
  sources: [],
  Component: () => null
}));

vi.mock('@/lib/guides', () => ({
  guides: [guide],
  getGuideBySlug: (slug: string) => slug === guide.slug ? guide : undefined
}));

describe('JsonLd', () => {
  it('escapes opening angle brackets before embedding JSON in a script element', () => {
    const { container } = render(
      <JsonLd data={{ '@context': 'https://schema.org', name: '<script>alert("unsafe")</script>' }} />
    );
    const script = container.querySelector('script[type="application/ld+json"]');

    expect(script).not.toBeNull();
    expect(script?.innerHTML).toContain('\\u003cscript>alert(\\"unsafe\\")\\u003c/script>');
    expect(script?.innerHTML).not.toContain('<script>');
  });

  it('publishes canonical WebSite structured data on the homepage', () => {
    const { container } = render(<Home />);
    const data = JSON.parse(container.querySelector('script[type="application/ld+json"]')?.innerHTML ?? '{}');

    expect(data).toEqual({
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'Fields of Mistria Guide',
      description: 'A curated independent fan guide hub for Fields of Mistria, with source-based guides and item references.',
      url: 'https://fieldsofmistria.land/'
    });
  });

  it('publishes registry-derived Article structured data on a guide route', async () => {
    const { default: GuidePage } = await import('@/app/guides/[slug]/page');
    const { container } = render(await GuidePage({ params: Promise.resolve({ slug: guide.slug }) }));
    const data = JSON.parse(container.querySelector('script[type="application/ld+json"]')?.innerHTML ?? '{}');

    expect(data).toEqual({
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: guide.title,
      description: guide.description,
      url: `https://fieldsofmistria.land/guides/${guide.slug}`,
      dateModified: guide.updated,
      publisher: {
        '@type': 'Organization',
        name: 'Fields of Mistria Guide'
      }
    });
  });
});
