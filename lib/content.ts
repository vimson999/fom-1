export type ContentSource = Readonly<{ label: string; url: string }>;

export type GuideMetadata = Readonly<{
  slug: string;
  title: string;
  description: string;
  keyword: string;
  updated: string;
  sources: readonly ContentSource[];
}>;

export function defineGuideMetadata<const T extends GuideMetadata>(metadata: T): T {
  return metadata;
}
