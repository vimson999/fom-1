import Link from 'next/link';

export default function NotFound() {
  return (
    <section className="shell detail-page">
      <p className="eyebrow">404</p>
      <h1>Page not found</h1>
      <p className="lede">The guide or item you requested is not in this curated collection.</p>
      <div className="hero-actions">
        <Link className="button primary" href="/guides">Browse Guides</Link>
        <Link className="button secondary" href="/database/items">Browse Items</Link>
      </div>
    </section>
  );
}
