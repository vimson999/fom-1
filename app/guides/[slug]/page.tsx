import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { GuideArticle } from '@/components/guide-article';
import { getGuideBySlug, guides } from '@/lib/guides';

export const dynamicParams = false;
export function generateStaticParams() { return guides.map(({ slug }) => ({ slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> { const guide = getGuideBySlug((await params).slug); return guide ? { title: guide.title, description: guide.description, keywords: guide.keyword } : {}; }

export default async function GuidePage({ params }: { params: Promise<{ slug: string }> }) { const guide = getGuideBySlug((await params).slug); if (!guide) notFound(); return <GuideArticle guide={guide} />; }
