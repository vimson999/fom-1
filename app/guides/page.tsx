import type { Metadata } from 'next';
import Link from 'next/link';
import { guides } from '@/lib/guides';

export const metadata: Metadata = { title: 'Guides', description: 'Fields of Mistria guides built from traceable project sources.' };

export default function GuidesPage() { return <section className="shell database-page"><p className="eyebrow">Guides</p><h1>Fields of Mistria Guides</h1><p className="lede">Ten source-based guides built from the project’s collected materials. Unsupported details are marked To be confirmed.</p><div className="item-grid">{guides.map((guide) => <Link className="item-card" key={guide.slug} href={`/guides/${guide.slug}`}><div className="item-glyph">✦</div><div><h2>{guide.title}</h2><p>{guide.description}</p><span>{guide.keyword}</span></div></Link>)}</div></section>; }
