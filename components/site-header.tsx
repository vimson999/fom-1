import Link from 'next/link';
import { site } from '@/lib/site';

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="shell header-inner">
        <Link className="wordmark" href="/">Fields of Mistria <span>Wiki</span></Link>
        <nav aria-label="Primary navigation" className="primary-nav">
          {site.navigation.map((item) => <Link key={item.label} href={item.href}>{item.label}</Link>)}
        </nav>
        <div className="header-actions"><button aria-label="Search the wiki" className="icon-button">⌕</button><button className="language-button">English</button></div>
      </div>
    </header>
  );
}
