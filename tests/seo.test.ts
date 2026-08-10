import { describe, expect, it, vi } from 'vitest';
import type { GuideMetadata } from '@/lib/content';
import { createGuideMetadata, createPageMetadata } from '@/lib/seo';

const guideSlugs = [
  'fields-of-mistria-guide',
  'fields-of-mistria-characters',
  'fields-of-mistria-farm-layout',
  'fields-of-mistria-items',
  'how-to-get-shovel-fields-of-mistria',
  'water-chestnuts-fields-of-mistria',
  'fields-of-mistria-deep-woods-fish',
  'stone-loach-fields-of-mistria',
  'olric-fields-of-mistria-gifts',
  'wedding-outfits-fields-of-mistria'
];

vi.mock('@/lib/guides', () => ({
  guides: guideSlugs.map((slug) => slug === registryGuide.slug
    ? { ...registryGuide, Component: () => null }
    : { slug }),
  getGuideBySlug: (slug: string) => slug === registryGuide.slug
    ? { ...registryGuide, Component: () => null }
    : undefined
}));

const registryGuide: GuideMetadata = {
  slug: 'fields-of-mistria-guide',
  title: 'Fields of Mistria Guide: A Source-Based Starting Point',
  description: 'Start with a source-based overview of farming, exploration, relationships, and progression in Fields of Mistria.',
  keyword: 'Fields of Mistria guide',
  updated: '2026-08-10',
  sources: []
};

describe('SEO metadata helpers', () => {
  it('keeps canonical and social metadata aligned for a normal page', () => {
    const metadata = createPageMetadata({
      title: 'Fields of Mistria Guides',
      description: 'Source-based guides for farming, villagers, items, and exploration.',
      path: '/guides'
    });

    expect(metadata.title).toEqual({ absolute: 'Fields of Mistria Guides' });
    expect(metadata.description).toBe('Source-based guides for farming, villagers, items, and exploration.');
    expect(metadata.alternates?.canonical).toBe('https://fieldsofmistria.land/guides');
    expect(metadata.openGraph).toMatchObject({
      type: 'website',
      url: 'https://fieldsofmistria.land/guides',
      title: 'Fields of Mistria Guides',
      description: 'Source-based guides for farming, villagers, items, and exploration.',
      images: [
        {
          url: 'https://fieldsofmistria.land/opengraph-image',
          width: 1200,
          height: 630
        }
      ]
    });
    expect(metadata.twitter).toMatchObject({
      card: 'summary_large_image',
      title: 'Fields of Mistria Guides',
      description: 'Source-based guides for farming, villagers, items, and exploration.',
      images: ['https://fieldsofmistria.land/opengraph-image']
    });
  });

  it('builds article metadata from the shared guide registry', () => {
    const guide = registryGuide;
    const metadata = createGuideMetadata(guide);
    const canonical = `https://fieldsofmistria.land/guides/${guide.slug}`;

    expect(metadata.title).toEqual({ absolute: guide.title });
    expect(metadata.description).toBe(guide.description);
    expect(metadata.alternates?.canonical).toBe(canonical);
    expect(metadata.openGraph).toMatchObject({
      type: 'article',
      url: canonical,
      title: guide.title,
      description: guide.description,
      modifiedTime: guide.updated,
      images: [
        {
          url: 'https://fieldsofmistria.land/opengraph-image',
          width: 1200,
          height: 630
        }
      ]
    });
    expect(metadata.twitter).toMatchObject({
      card: 'summary_large_image',
      title: guide.title,
      description: guide.description,
      images: ['https://fieldsofmistria.land/opengraph-image']
    });
  });
});

describe('metadata routes', () => {
  it('allows crawling and advertises the canonical sitemap', async () => {
    const { default: robots } = await import('@/app/robots');

    expect(robots()).toEqual({
      rules: { userAgent: '*', allow: '/' },
      sitemap: 'https://fieldsofmistria.land/sitemap.xml',
      host: 'https://fieldsofmistria.land'
    });
  });

  it('publishes exactly the public route set from the shared registries', async () => {
    const { default: sitemap } = await import('@/app/sitemap');
    const paths = sitemap().map(({ url }) => new URL(url).pathname);

    expect(new Set(paths)).toEqual(new Set([
      '/',
      '/guides',
      ...guideSlugs.map((slug) => `/guides/${slug}`),
      '/database/items',
      '/database/items/water-chestnuts',
      '/database/items/stone-loach',
      '/database/items/shovel',
      '/privacy',
      '/terms'
    ]));
    expect(paths).toHaveLength(18);
    expect(sitemap().every(({ url }) => new URL(url).origin === 'https://fieldsofmistria.land')).toBe(true);
  });
});

describe('public page metadata', () => {
  it('sets global defaults without leaking a layout canonical', async () => {
    const { metadata } = await import('@/app/layout');

    expect(metadata.metadataBase).toEqual(new URL('https://fieldsofmistria.land'));
    expect(metadata.alternates?.canonical).toBeUndefined();
    expect(metadata.openGraph).toMatchObject({ siteName: 'Fields of Mistria Guide' });
    expect(metadata.twitter).toMatchObject({ card: 'summary_large_image' });
  });

  it.each([
    ['home', '@/app/page', 'https://fieldsofmistria.land/'],
    ['guide index', '@/app/guides/page', 'https://fieldsofmistria.land/guides'],
    ['item index', '@/app/database/items/page', 'https://fieldsofmistria.land/database/items']
  ])('gives the %s route complete canonical metadata', async (_label, modulePath, canonical) => {
    const { metadata } = await import(/* @vite-ignore */ modulePath);

    expect(metadata.alternates.canonical).toBe(canonical);
    expect(metadata.openGraph.url).toBe(canonical);
    expect(metadata.twitter.card).toBe('summary_large_image');
  });

  it('generates complete guide metadata without a title-template suffix', async () => {
    const { generateMetadata } = await import('@/app/guides/[slug]/page');
    const metadata = await generateMetadata({ params: Promise.resolve({ slug: registryGuide.slug }) });

    expect(metadata.title).toEqual({ absolute: registryGuide.title });
    expect(metadata.description).toBe(registryGuide.description);
    expect(metadata.alternates?.canonical).toBe(`https://fieldsofmistria.land/guides/${registryGuide.slug}`);
    expect(metadata.openGraph).toMatchObject({ type: 'article', modifiedTime: registryGuide.updated });
  });

  it('generates canonical item metadata and limits item routes to registry slugs', async () => {
    const itemRoute = await import('@/app/database/items/[slug]/page');
    const metadata = await itemRoute.generateMetadata({ params: Promise.resolve({ slug: 'water-chestnuts' }) });

    expect(itemRoute.dynamicParams).toBe(false);
    expect(metadata.title).toEqual({ absolute: 'Water Chestnuts' });
    expect(metadata.alternates?.canonical).toBe('https://fieldsofmistria.land/database/items/water-chestnuts');
    expect(metadata.openGraph).toMatchObject({ type: 'website', url: 'https://fieldsofmistria.land/database/items/water-chestnuts' });
    expect(metadata.twitter).toMatchObject({ card: 'summary_large_image' });
  });

  it('does not assign a canonical to missing dynamic content', async () => {
    const guideRoute = await import('@/app/guides/[slug]/page');
    const itemRoute = await import('@/app/database/items/[slug]/page');

    expect(await guideRoute.generateMetadata({ params: Promise.resolve({ slug: 'missing' }) })).toEqual({});
    expect(await itemRoute.generateMetadata({ params: Promise.resolve({ slug: 'missing' }) })).toEqual({});
  });
});
