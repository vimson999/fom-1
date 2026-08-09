import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getGuideBySlug, guides } from '@/lib/guides';

export function generateStaticParams() { return guides.map(({ slug }) => ({ slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> { const guide = getGuideBySlug((await params).slug); return guide ? { title: guide.title, description: guide.description, keywords: guide.keyword } : {}; }

export default async function GuidePage({ params }: { params: Promise<{ slug: string }> }) { const guide = getGuideBySlug((await params).slug); if (!guide) notFound(); const Content = guide.Component; return <article className="shell guide-page"><nav className="breadcrumbs" aria-label="Breadcrumb"><Link href="/">Home</Link><span>/</span><Link href="/guides">Guides</Link><span>/</span><span>{guide.keyword}</span></nav><Content /></article>; }
