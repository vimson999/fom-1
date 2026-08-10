import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { GuideArticle } from '@/components/guide-article';
import { JsonLd } from '@/components/json-ld';
import { getGuideBySlug, guides } from '@/lib/guides';
import { createGuideMetadata } from '@/lib/seo';
import { absoluteUrl, site } from '@/lib/site';

export const dynamicParams = false;
export function generateStaticParams() { return guides.map(({ slug }) => ({ slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> { const guide = getGuideBySlug((await params).slug); return guide ? createGuideMetadata(guide) : {}; }

export default async function GuidePage({ params }: { params: Promise<{ slug: string }> }) { const guide = getGuideBySlug((await params).slug); if (!guide) notFound(); return <><JsonLd data={{ '@context': 'https://schema.org', '@type': 'Article', headline: guide.title, description: guide.description, url: absoluteUrl(`/guides/${guide.slug}`), dateModified: guide.updated, publisher: { '@type': 'Organization', name: site.name } }} /><GuideArticle guide={guide} /></>; }
