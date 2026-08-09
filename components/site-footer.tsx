import Link from 'next/link';

export function SiteFooter() {
  return <footer className="site-footer"><div className="shell footer-inner"><p>Fields of Mistria Wiki is an unofficial fan guide.</p><p>Not affiliated with NPC Studio. Game names and trademarks belong to their respective owners.</p><Link href="/database/items">Browse the database</Link></div></footer>;
}
