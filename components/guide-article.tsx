import Link from 'next/link';
import type { ComponentType } from 'react';
import type { GuideMetadata } from '@/lib/content';
import { SourceList } from '@/components/source-list';

type GuideArticleEntry = GuideMetadata & { Component: ComponentType };

export function GuideArticle({ guide }: { guide: GuideArticleEntry }) {
  const Content = guide.Component;

  return <article className="shell guide-page">
    <nav className="breadcrumbs" aria-label="Breadcrumb">
      <Link href="/">Home</Link><span>/</span><Link href="/guides">Guides</Link><span>/</span><span>{guide.keyword}</span>
    </nav>
    <header className="detail-hero">
      <h1>{guide.title}</h1>
      <p>{guide.description}</p>
    </header>
    <Content />
    <section>
      <h2>Article sources</h2>
      <SourceList sources={guide.sources} />
    </section>
    <p className="empty-copy">Updated <time dateTime={guide.updated}>{guide.updated}</time></p>
  </article>;
}
