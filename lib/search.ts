export type SearchEntry = Readonly<{
  title: string;
  description: string;
  keyword: string;
  category: string;
  href: string;
}>;

type GuideSearchRecord = Readonly<{
  slug: string;
  title: string;
  description: string;
  keyword: string;
}>;

type ItemSearchRecord = Readonly<{
  slug: string;
  name: string;
  summary: string;
  category: string;
}>;

function normalize(value: string) {
  return value.trim().replace(/\s+/g, ' ').toLocaleLowerCase();
}

function byTitle(left: SearchEntry, right: SearchEntry) {
  return left.title.localeCompare(right.title);
}

export function createSearchEntries(guides: readonly GuideSearchRecord[], items: readonly ItemSearchRecord[]): SearchEntry[] {
  return [
    ...guides.map((guide) => ({
      title: guide.title,
      description: guide.description,
      keyword: guide.keyword,
      category: 'Guide',
      href: `/guides/${guide.slug}`
    })),
    ...items.map((item) => ({
      title: item.name,
      description: item.summary,
      keyword: item.slug,
      category: item.category,
      href: `/database/items/${item.slug}`
    }))
  ];
}

export function filterSearchEntries(entries: readonly SearchEntry[], query: string): SearchEntry[] {
  const normalizedQuery = normalize(query);
  const sortedEntries = [...entries].sort(byTitle);

  if (!normalizedQuery) return sortedEntries;

  return sortedEntries.filter((entry) => [entry.title, entry.description, entry.keyword, entry.category]
    .some((value) => normalize(value).includes(normalizedQuery)));
}
