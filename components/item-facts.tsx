import type { WikiItem } from '@/lib/items';

export function ItemFacts({ item }: { item: WikiItem }) {
  return <dl className="facts"><div><dt>Category</dt><dd>{item.category}</dd></div><div><dt>How to find it</dt><dd>{item.acquisition}</dd></div></dl>;
}
