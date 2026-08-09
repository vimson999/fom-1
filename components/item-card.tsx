import Link from 'next/link';
import type { WikiItem } from '@/lib/items';

export function ItemCard({ item }: { item: WikiItem }) {
  return <Link href={`/database/items/${item.slug}`} className="item-card"><div className="item-glyph" aria-hidden="true">✦</div><div><h2>{item.name}</h2><p>{item.summary}</p><span>{item.category}</span></div></Link>;
}
