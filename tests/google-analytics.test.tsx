import { Children, isValidElement, type ReactElement, type ReactNode } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { GoogleAnalytics } from '@next/third-parties/google';

vi.mock('@/lib/guides', () => ({
  guides: [],
  getGuideBySlug: () => undefined
}));

describe('Google Analytics integration', () => {
  it('renders the configured GA4 tag exactly once from the root layout', async () => {
    const { default: RootLayout } = await import('@/app/layout');
    const layout = RootLayout({ children: <p>Route content</p> });
    const analyticsNodes: ReactElement<{ gaId: string }>[] = [];

    function visit(node: ReactNode) {
      Children.forEach(node, (child) => {
        if (!isValidElement(child)) return;

        const element = child as ReactElement<{ children?: ReactNode; gaId?: string }>;
        if (element.type === GoogleAnalytics) {
          analyticsNodes.push(element as ReactElement<{ gaId: string }>);
        }
        visit(element.props.children);
      });
    }

    visit(layout);

    expect(analyticsNodes).toHaveLength(1);
    expect(analyticsNodes[0].props.gaId).toBe('G-J5CTEBXCRF');
  });
});
