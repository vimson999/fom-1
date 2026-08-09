import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = { title: 'Guides', description: 'Fields of Mistria guides built from traceable project sources.' };

export default function GuidesPage() { return <section className="shell database-page"><p className="eyebrow">Guides</p><h1>Fields of Mistria Guides</h1><p className="lede">The guide collection is ready for the keyword research material to be added next.</p><Link className="button primary" href="/database/items">Explore the item database</Link></section>; }
