import type { Metadata } from 'next';
import type { GuideMetadata } from '@/lib/content';
import type { WikiItem } from '@/lib/items';
import { absoluteUrl, site } from '@/lib/site';

type PageMetadataInput = Readonly<{
  title: string;
  description: string;
  path: string;
}>;

const socialImage = {
  url: absoluteUrl('/opengraph-image'),
  width: 1200,
  height: 630,
  alt: `${site.name} — curated guides and item references`
};

export function createPageMetadata({ title, description, path }: PageMetadataInput): Metadata {
  const url = absoluteUrl(path);

  return {
    title: { absolute: title },
    description,
    alternates: { canonical: url },
    openGraph: {
      type: 'website',
      siteName: site.name,
      url,
      title,
      description,
      images: [socialImage]
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [socialImage.url]
    }
  };
}

export function createItemMetadata(item: WikiItem): Metadata {
  return createPageMetadata({
    title: item.name,
    description: item.summary,
    path: `/database/items/${item.slug}`
  });
}

export function createGuideMetadata(guide: GuideMetadata): Metadata {
  const url = absoluteUrl(`/guides/${guide.slug}`);

  return {
    ...createPageMetadata({ title: guide.title, description: guide.description, path: `/guides/${guide.slug}` }),
    keywords: guide.keyword,
    openGraph: {
      type: 'article',
      siteName: site.name,
      url,
      title: guide.title,
      description: guide.description,
      modifiedTime: guide.updated,
      images: [socialImage]
    }
  };
}
