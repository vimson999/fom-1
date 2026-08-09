import Link from 'next/link';
import { items } from '@/lib/items';

const categories = [
  ['Characters', 'Romance paths, gifts and friendships.', '/guides'],
  ['Items', 'Forage, tools and useful finds.', '/database/items'],
  ['Fish', 'Locations and seasonal catches.', '/database/items'],
  ['Farm Layouts', 'Plan a cozy, practical farm.', '/guides']
];

export default function Home() {
  return <>
    <section className="hero"><div className="shell hero-grid"><div><p className="eyebrow">Unofficial fan wiki · English</p><h1>Fields of Mistria Wiki</h1><p className="hero-copy">Guides, romance, fish locations, farm layouts and the details that make a cozy life in Mistria easier to plan.</p><div className="hero-actions"><Link className="button primary" href="/database/items">Browse the database</Link><Link className="button secondary" href="/guides">Read the guides</Link></div></div><div className="hero-mark" aria-hidden="true"><span>✦</span><i>F</i></div></div></section>
    <section className="shell stats" aria-label="Wiki coverage"><div><strong>{items.length}</strong><span>Starter entries</span></div><div><strong>10</strong><span>Keyword guides planned</span></div><div><strong>3</strong><span>Core page templates</span></div></section>
    <section className="shell section"><div className="section-heading"><p className="eyebrow">Explore the game</p><h2>Browse by topic</h2><p>Start with a category, then follow the links between related information.</p></div><div className="category-grid">{categories.map(([name, text, href], index) => <Link href={href} className="category-card" key={name}><span>0{index + 1}</span><h3>{name}</h3><p>{text}</p><b>Explore →</b></Link>)}</div></section>
    <section className="shell two-column section" id="tools"><div><p className="eyebrow">Guides</p><h2>Begin with what you need now</h2><p>Our first guides focus on the questions players actively search for: getting started, characters, farming, items and Deep Woods fishing.</p><Link className="text-link" href="/guides">Open all guides →</Link></div><aside><p className="eyebrow">Built with sources</p><h3>Traceable notes, not guesswork.</h3><p>Each finished article will link back to the material used to verify it.</p></aside></section>
    <section className="shell section faq"><p className="eyebrow">FAQ</p><h2>About this wiki</h2><details open><summary>Is this an official Fields of Mistria website?</summary><p>No. This is an independent fan guide and is not affiliated with NPC Studio.</p></details><details><summary>Where does the information come from?</summary><p>Published pages are written from the project’s collected raw sources and include source links.</p></details></section>
  </>;
}
