import type { Source } from '@/lib/items';

export function SourceList({ sources }: { sources: Source[] }) {
  if (!sources.length) return <p className="empty-copy">Sources will be added when this guide is verified against the project archive.</p>;
  return <ul className="source-list">{sources.map((source) => <li key={source.url}><a href={source.url} target="_blank" rel="noreferrer">{source.label}<span aria-hidden="true"> ↗</span></a></li>)}</ul>;
}
