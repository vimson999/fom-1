import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ItemFacts } from '@/components/item-facts';
import { SourceList } from '@/components/source-list';
import { getItemBySlug, items } from '@/lib/items';

export function generateStaticParams() { return items.map(({ slug }) => ({ slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> { const item = getItemBySlug((await params).slug); return item ? { title: item.name, description: item.summary } : {}; }

export default async function ItemDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const item = getItemBySlug((await params).slug); if (!item) notFound();
  const related = item.relatedSlugs.map(getItemBySlug).filter(Boolean);
  return <article className="shell detail-page"><nav className="breadcrumbs" aria-label="Breadcrumb"><Link href="/">Home</Link><span>/</span><Link href="/database/items">Items</Link><span>/</span><span>{item.name}</span></nav><header className="detail-hero"><p className="eyebrow">{item.category}</p><h1>{item.name}</h1><p>{item.summary}</p></header><div className="detail-grid"><div><section><h2>At a glance</h2><ItemFacts item={item} /></section><section><h2>Sources</h2><SourceList sources={item.sources} /></section></div><aside className="related"><p className="eyebrow">Keep exploring</p><h2>Related entries</h2>{related.length ? <ul>{related.map((entry) => entry && <li key={entry.slug}><Link href={`/database/items/${entry.slug}`}>{entry.name} →</Link></li>)}</ul> : <p>Related entries will appear here.</p>}</aside></div></article>;
}
