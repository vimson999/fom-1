import type { ContentSource } from '@/lib/content';

export function SourceList({ sources }: { sources: readonly ContentSource[] }) {
  if (!sources.length) return <p className="empty-copy">No sources are available for this entry.</p>;
  return <ul className="source-list">{sources.map((source) => <li key={source.url}><a href={source.url} target="_blank" rel="noopener noreferrer" style={{ overflowWrap: 'anywhere' }}>{source.label}<span aria-hidden="true"> ↗</span></a></li>)}</ul>;
}
