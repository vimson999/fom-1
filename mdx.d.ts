declare module '*.mdx' {
  import type { ComponentType } from 'react';
  import type { GuideMetadata } from '@/lib/content';

  const MDXComponent: ComponentType;
  export default MDXComponent;
  export const metadata: GuideMetadata;
}
