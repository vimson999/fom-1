import { Children, isValidElement, type ReactElement, type ReactNode } from 'react';
import { describe, expect, it, vi } from 'vitest';

vi.mock('@/lib/guides', () => ({
  guides: [],
  getGuideBySlug: () => undefined
}));

describe('Google AdSense integration', () => {
  it('renders one native AdSense loader in the document head', async () => {
    const { default: RootLayout } = await import('@/app/layout');
    const layout = RootLayout({ children: <p>Route content</p> });
    const headNodes: ReactElement<{ children?: ReactNode }>[] = [];

    function visit(node: ReactNode) {
      Children.forEach(node, (child) => {
        if (!isValidElement(child)) return;

        const element = child as ReactElement<{
          children?: ReactNode;
          src?: string;
          crossOrigin?: string;
          async?: boolean;
        }>;
        if (element.type === 'head') headNodes.push(element);
        visit(element.props.children);
      });
    }

    visit(layout);

    expect(headNodes).toHaveLength(1);

    const scriptNodes: ReactElement<{
      src?: string;
      crossOrigin?: string;
      async?: boolean;
    }>[] = [];

    function visitHead(node: ReactNode) {
      Children.forEach(node, (child) => {
        if (!isValidElement(child)) return;

        const element = child as ReactElement<{
          children?: ReactNode;
          src?: string;
          crossOrigin?: string;
          async?: boolean;
        }>;
        if (element.type === 'script') scriptNodes.push(element);
        visitHead(element.props.children);
      });
    }

    visitHead(headNodes[0].props.children);

    const adsenseNodes = scriptNodes.filter((node) =>
      node.props.src?.startsWith('https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=')
    );

    expect(adsenseNodes).toHaveLength(1);
    expect(adsenseNodes[0].props.src).toBe(
      'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5054963576840100'
    );
    expect(adsenseNodes[0].props.crossOrigin).toBe('anonymous');
    expect(adsenseNodes[0].props.async).toBe(true);
  });
});
