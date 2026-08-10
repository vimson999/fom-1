'use client';

import Link from 'next/link';
import { useRef, useState } from 'react';
import { SiteSearch } from '@/components/site-search';
import { site } from '@/lib/site';
import type { SearchEntry } from '@/lib/search';

export function SiteHeader({ searchEntries }: { searchEntries: readonly SearchEntry[] }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const searchButtonRef = useRef<HTMLButtonElement>(null);

  function closeSearch() {
    setSearchOpen(false);
    searchButtonRef.current?.focus();
  }

  return (
    <header className="site-header">
      <div className="shell header-inner">
        <Link className="wordmark" href="/">Fields of Mistria <span>Wiki</span></Link>
        <button type="button" className="nav-toggle" aria-label="Toggle navigation" aria-controls="primary-navigation" aria-expanded={menuOpen} onClick={() => setMenuOpen((open) => !open)}>Menu</button>
        <nav id="primary-navigation" aria-label="Primary navigation" className={`primary-nav${menuOpen ? ' is-open' : ''}`}>
          {site.navigation.map((item) => <Link key={item.label} href={item.href} onClick={() => setMenuOpen(false)}>{item.label}</Link>)}
        </nav>
        <div className="header-actions"><button ref={searchButtonRef} type="button" aria-label="Search the wiki" className="icon-button" onClick={() => setSearchOpen(true)}>⌕</button></div>
      </div>
      <SiteSearch entries={searchEntries} open={searchOpen} onClose={closeSearch} />
    </header>
  );
}
