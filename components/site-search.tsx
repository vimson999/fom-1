'use client';

import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';
import { filterSearchEntries, type SearchEntry } from '@/lib/search';

type SiteSearchProps = Readonly<{
  entries: readonly SearchEntry[];
  open: boolean;
  onClose: () => void;
}>;

export function SiteSearch({ entries, open, onClose }: SiteSearchProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState('');
  const results = useMemo(() => filterSearchEntries(entries, query), [entries, query]);
  const isSuggestionList = !query.trim();

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  if (!open) return null;

  const status = results.length === 0
    ? 'No results found.'
    : `${results.length} ${results.length === 1 ? 'result' : 'results'} ${isSuggestionList ? 'suggested' : 'found'}.`;

  return (
    <div className="search-overlay" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <section className="search-dialog" role="dialog" aria-modal="true" aria-labelledby="search-dialog-title" onKeyDown={(event) => { if (event.key === 'Escape') onClose(); }}>
        <div className="search-dialog-heading">
          <h2 id="search-dialog-title">Search the wiki</h2>
          <button type="button" className="icon-button" aria-label="Close search" onClick={onClose}>×</button>
        </div>
        <label className="search-field" htmlFor="site-search-input">Search the wiki</label>
        <input ref={inputRef} id="site-search-input" type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search guides and items…" />
        <p className="search-status" role="status" aria-live="polite">{status}</p>
        {results.length > 0 ? (
          <ul className="search-results">
            {results.map((entry) => <li key={entry.href}>
              <Link href={entry.href} onClick={onClose}>
                <span className="search-result-category">{entry.category}</span>
                <strong>{entry.title}</strong>
                <span>{entry.description}</span>
              </Link>
            </li>)}
          </ul>
        ) : null}
      </section>
    </div>
  );
}
