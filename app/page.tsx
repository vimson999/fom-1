import Link from 'next/link';
import { site } from '@/lib/site';

const categories = [
  ['Beginner Guide', 'Essential tips for your first spring in Mistria including tools, stamina, and making gold.', '/guides'],
  ['Romance & Gift Preferences', 'Complete gift guide for all 12 romance candidates and town villagers.', '/guides'],
  ['Tools & Resource Gathering', 'How to unlock the shovel, mine ores, and locate rare items like water chestnuts.', '/database/items'],
  ['Farm Layout & Design', 'Creative farm designs, crop rotation tips, and automated animal care setups.', '/guides']
];

export default function Home() {
  return <>
    <section className="hero"><div className="shell hero-grid"><div><p className="eyebrow">Fan-Made Community Wiki</p><h1>Fields of Mistria</h1><p className="hero-copy">Restore the town of Mistria in this cozy 90s anime-inspired farming RPG. Farm, fish, mine, craft, and romance 12 eligible villagers!</p><div className="hero-actions"><Link className="button primary" href="/guides">Start Beginner Guide</Link><Link className="button secondary" href="/guides">Romance & Gifts</Link></div></div><a className="hero-mark" href={site.officialLinks.youtube} aria-label="Watch the official trailer"><span>▶</span><i>F</i></a></div></section>
    <section className="shell stats" aria-label="Game overview"><div><strong>Aug 2024</strong><span>Launched</span></div><div><strong>12</strong><span>Romance Candidates</span></div><div><strong>30+</strong><span>Villagers</span></div></section>
    <section className="shell section"><div className="section-heading"><p className="eyebrow">Start Here</p><h2>Your Mistria Journey</h2><p>Choose a starting point, then follow the guide that matches the question you have now.</p></div><div className="category-grid">{categories.map(([name, text, href], index) => <Link href={href} className="category-card" key={name}><span>0{index + 1}</span><h3>{name}</h3><p>{text}</p><b>Explore →</b></Link>)}</div></section>
    <section className="shell two-column section" id="tools"><div><p className="eyebrow">About the game</p><h2>What is Fields of Mistria?</h2><p>Fields of Mistria is a cozy farming sim RPG inspired by classic 90s anime and retro farming games. Players rebuild a magical town struck by an earthquake while managing crops, animals, and magic.</p><p>Featuring over 30 unique villagers, deep crafting mechanics, skill leveling, and dungeon exploration in the mines, it offers a rich and nostalgic simulation experience.</p><Link className="text-link" href="/guides">Explore All Guides →</Link></div><aside><p className="eyebrow">Community codes</p><h3>Redeem Codes</h3><p>暂无</p><p>Verified code information will appear here when confirmed by a source.</p></aside></section>
    <section className="shell section"><p className="eyebrow">Build your dream farm</p><h2>Ready to Master Fields of Mistria?</h2><p>From your first crop of turnips to exploring deep mine floors, our community wiki has everything you need to build your dream farm.</p><div className="hero-actions"><Link className="button primary" href="/guides">Read the Beginner Guide</Link><a className="button secondary" href={site.officialLinks.steam}>Play on Steam</a></div></section>
  </>;
}
