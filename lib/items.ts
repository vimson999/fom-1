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
    summary: 'A medium-shadow Upper Mines fish found in all seasons and any weather, with a place in the Museum’s Upper Mines Fish Set.',
    category: 'Fish',
    acquisition: 'Fish the water pools on the early floors of the Upper Mines and target medium shadows; no time-of-day requirement is established by the cited guides.',
    relatedSlugs: ['water-chestnuts'],
    sources: [
      { label: 'Fandom: Stone Loach', url: 'https://fields-of-mistria.fandom.com/wiki/Stone_Loach' },
      { label: 'Destructoid: Stone Loach Guide', url: 'https://www.destructoid.com/how-to-catch-a-stone-loach-in-fields-of-mistria/' },
      { label: 'Steam Community: Fishing Guide', url: 'https://steamcommunity.com/sharedfiles/filedetails/?id=3317450798' },
      { label: 'YouTube: Stone Loach Video', url: 'https://www.youtube.com/watch?v=TRQ5vT-DWvU' }
    ]
  },
  {
    slug: 'shovel',
    name: 'Shovel',
    summary: 'The Worn Shovel expands farm fields, clears or reshapes soil, and opens dig spots for materials and artifacts.',
    category: 'Tool',
    acquisition: 'Buy the Worn Shovel at the General Store for 500 Tesserae in the cited guides; switch or cycle the shop menu if only seeds are visible.',
    relatedSlugs: ['water-chestnuts'],
    sources: [
      { label: 'GameRant: Shovel Guide', url: 'https://gamerant.com/fields-of-mistria-how-get-find-buy-shovel/' },
      { label: 'TheGamer: Shovel and Upgrade Guide', url: 'https://www.thegamer.com/fields-of-mistria-how-to-get-a-shovel-upgrade/' },
      { label: 'Fandom: Worn Shovel', url: 'https://fields-of-mistria.fandom.com/wiki/Worn_Shovel' },
      { label: 'Steam Community: Shovel Discussion', url: 'https://steamcommunity.com/app/2142790/discussions/0/4520011200502631154/' },
      { label: 'YouTube: Shovel Video', url: 'https://www.youtube.com/watch?v=_naznV2emdE' }
    ]
  }
];

export const itemCategories = ['All', 'Forage', 'Fish', 'Tool'] as const;

export function getItemBySlug(slug: string) {
  return items.find((item) => item.slug === slug);
}
