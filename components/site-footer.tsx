import Link from 'next/link';
import { site } from '@/lib/site';

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="shell footer-inner">
        <div>
          <strong>Fields of Mistria Guide</strong>
          <p>
            This independent fan hub is a curated, growing collection of source-backed guides
            and item references.
          </p>
        </div>
        <nav aria-labelledby="footer-official-heading">
          <strong id="footer-official-heading">Official links</strong>
          <ul className="footer-links">
            <li><a href={site.officialLinks.website}>Official Website</a></li>
            <li><a href={site.officialLinks.steam}>Play on Steam</a></li>
            <li><a href={site.officialLinks.discord}>Official Discord</a></li>
            <li><a href={site.officialLinks.youtube}>Official YouTube</a></li>
          </ul>
        </nav>
        <nav aria-labelledby="footer-explore-heading">
          <strong id="footer-explore-heading">Explore</strong>
          <ul className="footer-links">
            <li><Link href="/database/items">Item references</Link></li>
            <li><Link href="/guides">All guides</Link></li>
            <li><Link href="/privacy">Privacy Policy</Link></li>
            <li><Link href="/terms">Terms of Service</Link></li>
          </ul>
        </nav>
      </div>
      <div className="shell footer-legal">
        Independent fan guide. Not affiliated with NPC Studio. Game names and trademarks belong
        to their respective owners.
      </div>
    </footer>
  );
}
