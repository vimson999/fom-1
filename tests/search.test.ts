import { describe, expect, it } from 'vitest';
import { createSearchEntries, filterSearchEntries } from '@/lib/search';

const guides = [
  { slug: 'first-week', title: 'First Week', description: 'Beginner farming routine', keyword: 'starting guide' },
  { slug: 'fish-guide', title: 'Fishing Notes', description: 'Find river fish', keyword: 'angler' }
] as const;

const items = [
  { slug: 'water-chestnuts', name: 'Water Chestnuts', summary: 'A forageable river resource', category: 'Forage' },
  { slug: 'shovel', name: 'Shovel', summary: 'An early tool', category: 'Tool' }
] as const;

const tenGuides = [
  { slug: 'guide-1', title: 'Guide 1', description: 'Description 1', keyword: 'keyword 1' },
  { slug: 'guide-2', title: 'Guide 2', description: 'Description 2', keyword: 'keyword 2' },
  { slug: 'guide-3', title: 'Guide 3', description: 'Description 3', keyword: 'keyword 3' },
  { slug: 'guide-4', title: 'Guide 4', description: 'Description 4', keyword: 'keyword 4' },
  { slug: 'guide-5', title: 'Guide 5', description: 'Description 5', keyword: 'keyword 5' },
  { slug: 'guide-6', title: 'Guide 6', description: 'Description 6', keyword: 'keyword 6' },
  { slug: 'guide-7', title: 'Guide 7', description: 'Description 7', keyword: 'keyword 7' },
  { slug: 'guide-8', title: 'Guide 8', description: 'Description 8', keyword: 'keyword 8' },
  { slug: 'guide-9', title: 'Guide 9', description: 'Description 9', keyword: 'keyword 9' },
  { slug: 'guide-10', title: 'Guide 10', description: 'Description 10', keyword: 'keyword 10' }
] as const;

const threeItems = [
  { slug: 'item-1', name: 'Item 1', summary: 'Summary 1', category: 'Forage' },
  { slug: 'item-2', name: 'Item 2', summary: 'Summary 2', category: 'Fish' },
  { slug: 'item-3', name: 'Item 3', summary: 'Summary 3', category: 'Tool' }
] as const;

describe('search registry', () => {
  it('converts all ten guide records and three item records', () => {
    const entries = createSearchEntries(tenGuides, threeItems);

    expect(entries).toHaveLength(13);
    expect(entries.filter((entry) => entry.category === 'Guide')).toHaveLength(10);
    expect(entries.filter((entry) => entry.href.startsWith('/database/items/'))).toHaveLength(3);
  });

  it('converts every guide and item registry record into serializable routes', () => {
    const entries = createSearchEntries(guides, items);

    expect(entries).toEqual([
      { title: 'First Week', description: 'Beginner farming routine', keyword: 'starting guide', category: 'Guide', href: '/guides/first-week' },
      { title: 'Fishing Notes', description: 'Find river fish', keyword: 'angler', category: 'Guide', href: '/guides/fish-guide' },
      { title: 'Water Chestnuts', description: 'A forageable river resource', keyword: 'water-chestnuts', category: 'Forage', href: '/database/items/water-chestnuts' },
      { title: 'Shovel', description: 'An early tool', keyword: 'shovel', category: 'Tool', href: '/database/items/shovel' }
    ]);
  });

  it('matches titles, descriptions, keywords, and categories case-insensitively with normalized whitespace', () => {
    const entries = createSearchEntries(guides, items);

    expect(filterSearchEntries(entries, ' FIRST   week ')).toEqual([entries[0]]);
    expect(filterSearchEntries(entries, 'RIVER')).toEqual([entries[1], entries[2]]);
    expect(filterSearchEntries(entries, 'STARTING')).toEqual([entries[0]]);
    expect(filterSearchEntries(entries, ' tool ')).toEqual([entries[3]]);
  });

  it('returns title-sorted suggestions for an empty query and no results for a miss', () => {
    const entries = createSearchEntries(guides, items);

    expect(filterSearchEntries(entries, '   ')).toEqual([entries[0], entries[1], entries[3], entries[2]]);
    expect(filterSearchEntries(entries, 'not-a-record')).toEqual([]);
  });
});
