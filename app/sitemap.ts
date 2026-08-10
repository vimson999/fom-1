import type { MetadataRoute } from 'next';
import { guides } from '@/lib/guides';
import { items } from '@/lib/items';
import { absoluteUrl } from '@/lib/site';

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    '/',
    '/guides',
    ...guides.map(({ slug }) => `/guides/${slug}`),
    '/database/items',
    ...items.map(({ slug }) => `/database/items/${slug}`),
    '/privacy',
    '/terms'
  ];

  return paths.map((path) => ({ url: absoluteUrl(path) }));
}
