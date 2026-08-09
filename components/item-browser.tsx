'use client';

import { useMemo, useState } from 'react';
import { itemCategories, type WikiItem } from '@/lib/items';
import { ItemCard } from './item-card';

export function ItemBrowser({ items }: { items: WikiItem[] }) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<(typeof itemCategories)[number]>('All');
  const filtered = useMemo(() => items.filter((item) => (category === 'All' || item.category === category) && item.name.toLowerCase().includes(query.toLowerCase())), [items, query, category]);

  return <section className="item-browser" aria-label="Items database">
    <label className="search-field">Search the list<input type="search" placeholder="Search item name…" value={query} onChange={(event) => setQuery(event.target.value)} /></label>
    <div className="filter-row" aria-label="Filter items by category">{itemCategories.map((name) => <button key={name} className={category === name ? 'filter selected' : 'filter'} aria-pressed={category === name} onClick={() => setCategory(name)}>{name}</button>)}</div>
    <p className="results-count">Showing {filtered.length} / {items.length} entries</p>
    <div className="item-grid">{filtered.map((item) => <ItemCard key={item.slug} item={item} />)}</div>
  </section>;
}
