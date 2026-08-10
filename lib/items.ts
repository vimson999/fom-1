import type { ContentSource } from '@/lib/content';

export type WikiItem = {
  slug: string;
  name: string;
  summary: string;
  category: 'Forage' | 'Fish' | 'Tool';
  acquisition: string;
  relatedSlugs: string[];
  sources: readonly ContentSource[];
};

export const items: WikiItem[] = [
  {
    slug: 'water-chestnuts',
    name: 'Water Chestnuts',
    summary: 'A forageable resource found along the water in the Narrows.',
    category: 'Forage',
    acquisition: 'Look along the southern river in the Narrows, west of Mistria, and harvest the green-leafed plants from the riverbank.',
    relatedSlugs: ['stone-loach', 'shovel'],
    sources: [
      { label: 'TheGamer: Water Chestnut Forage Location', url: 'https://www.thegamer.com/fields-of-mistria-water-chestnuts-location/' },
      { label: 'Steam Community: Balor’s Wagon — Water Chestnuts', url: 'https://steamcommunity.com/app/2142790/discussions/0/598524246085399925/' }
    ]
  },
  {
    slug: 'stone-loach',
    name: 'Stone Loach',
    summary: 'A fish entry reserved for the verified fishing guide.',
    category: 'Fish',
    acquisition: 'See the forthcoming Stone Loach guide for verified location and season details.',
    relatedSlugs: ['water-chestnuts'],
    sources: []
  },
  {
    slug: 'shovel',
    name: 'Shovel',
    summary: 'A tool entry reserved for the verified beginner guide.',
    category: 'Tool',
    acquisition: 'See the forthcoming shovel guide for verified acquisition details.',
    relatedSlugs: ['water-chestnuts'],
    sources: []
  }
];

export const itemCategories = ['All', 'Forage', 'Fish', 'Tool'] as const;

export function getItemBySlug(slug: string) {
  return items.find((item) => item.slug === slug);
}
