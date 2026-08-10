import type { Metadata } from 'next';
import Link from 'next/link';
import { JsonLd } from '@/components/json-ld';
import { absoluteUrl, site } from '@/lib/site';
import { createPageMetadata } from '@/lib/seo';

export const metadata: Metadata = createPageMetadata({
  title: 'Fields of Mistria Guide — Source-Based Fan Guides',
  description: site.description,
  path: '/'
});

const categories = [
  ['Beginner Guide', 'Essential tips for your first spring in Mistria including tools, stamina, and making gold.', '/guides'],
  ['Romance & Gift Preferences', 'Meet the listed romance candidates and follow sourced examples for villager gifts.', '/guides'],
  ['Tools & Resource Gathering', 'Learn the sourced shovel route and find items such as Water Chestnuts and Stone Loach.', '/database/items'],
  ['Farm Layout & Design', 'Plan practical crop, animal, storage, and flexible expansion zones.', '/guides']
];

export default function Home() {
  return <>
    <JsonLd data={{
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: site.name,
      description: site.description,
      url: absoluteUrl('/')
    }} />
    <section className="hero"><div className="shell hero-grid"><div><p className="eyebrow">Fan-Made Community Wiki</p><h1>Fields of Mistria</h1><p className="hero-copy">Restore the town of Mistria in this cozy 90s anime-inspired farming RPG. Farm, fish, mine, craft, and romance 12 eligible villagers!</p><div className="hero-actions"><Link className="button primary" href="/guides">Start Beginner Guide</Link><Link className="button secondary" href="/guides">Romance & Gifts</Link></div></div><a className="hero-mark" href={site.officialLinks.youtube} aria-label="Watch the official trailer"><span>▶</span><i>F</i></a></div></section>
    <section className="shell stats" aria-label="Game overview"><div><strong>Aug 2024</strong><span>Early Access</span></div><div><strong>12</strong><span>Listed Romance Candidates</span></div><div><strong>10</strong><span>Source-Backed Guides</span></div></section>
    <section className="shell section"><div className="section-heading"><p className="eyebrow">Start Here</p><h2>Your Mistria Journey</h2><p>Choose a starting point, then follow the guide that matches the question you have now.</p></div><div className="category-grid">{categories.map(([name, text, href], index) => <Link href={href} className="category-card" key={name}><span>0{index + 1}</span><h3>{name}</h3><p>{text}</p><b>Explore →</b></Link>)}</div></section>
    <section className="shell two-column section" id="tools"><div><p className="eyebrow">About the game</p><h2>What is Fields of Mistria?</h2><p>Fields of Mistria is a cozy farming sim RPG inspired by classic 90s anime and retro farming games. Players rebuild a magical town struck by an earthquake while managing crops, animals, and magic.</p><p>This independent hub pairs a growing set of curated guides with labelled sources, so you can follow the available evidence and check current in-game details.</p><Link className="text-link" href="/guides">Explore Guides →</Link></div><aside><p className="eyebrow">Item reference</p><h3>Find What You Need</h3><p>Search the current item collection for sourced acquisition notes, uses, and related guides.</p><Link className="text-link" href="/database/items">Browse Item References →</Link></aside></section>
    <section className="shell section"><p className="eyebrow">Keep exploring</p><h2>Plan Your Next Day in Mistria</h2><p>Use our curated, growing guide hub to choose a practical next step for farming, fishing, mining, items, or relationships.</p><div className="hero-actions"><Link className="button primary" href="/guides">Read the Beginner Guide</Link><a className="button secondary" href={site.officialLinks.steam}>Play on Steam</a></div></section>
  </>;
}
