import type { Metadata } from 'next';
import { ItemBrowser } from '@/components/item-browser';
import { items } from '@/lib/items';
import { createPageMetadata } from '@/lib/seo';

export const metadata: Metadata = createPageMetadata({
  title: 'Fields of Mistria Items Database',
  description: 'Browse curated Fields of Mistria item references for forage, fish, and tools.',
  path: '/database/items'
});

export default function ItemsPage() {
  return <section className="shell database-page"><p className="eyebrow">Items</p><h1>Item References</h1><p className="lede">Browse a growing set of source-backed Fields of Mistria item notes. Search by name or narrow the list by type.</p><div className="database-stats"><span><strong>{items.length}</strong> curated entries</span><span><strong>3</strong> categories</span><span><strong>HTTPS</strong> labelled sources</span></div><ItemBrowser items={items} /></section>;
}
