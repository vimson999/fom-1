import { Children, isValidElement, type ReactElement, type ReactNode } from 'react';
import Script from 'next/script';
import { describe, expect, it, vi } from 'vitest';

vi.mock('@/lib/guides', () => ({
  guides: [],
  getGuideBySlug: () => undefined
}));

describe('Google AdSense integration', () => {
  it('renders the configured loader exactly once from the root layout', async () => {
    const { default: RootLayout } = await import('@/app/layout');
    const layout = RootLayout({ children: <p>Route content</p> });
    const scriptNodes: ReactElement<{
      src?: string;
      crossOrigin?: string;
      strategy?: string;
      async?: boolean;
    }>[] = [];

    function visit(node: ReactNode) {
      Children.forEach(node, (child) => {
        if (!isValidElement(child)) return;

        const element = child as ReactElement<{
          children?: ReactNode;
          src?: string;
          crossOrigin?: string;
          strategy?: string;
          async?: boolean;
        }>;
        if (element.type === Script) {
          scriptNodes.push(element as ReactElement<{ src?: string; crossOrigin?: string; strategy?: string; async?: boolean }>);
        }
        visit(element.props.children);
      });
    }

    visit(layout);

    const adsenseNodes = scriptNodes.filter((node) =>
      node.props.src?.startsWith('https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=')
    );

    expect(adsenseNodes).toHaveLength(1);
    expect(adsenseNodes[0].props.src).toBe(
      'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5054963576840100'
    );
    expect(adsenseNodes[0].props.crossOrigin).toBe('anonymous');
    expect(adsenseNodes[0].props.strategy).toBe('beforeInteractive');
    expect(adsenseNodes[0].props.async).toBe(true);
  });
});
