import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { SiteFooter } from '@/components/site-footer';

describe('SiteFooter', () => {
  it('renders each footer link group as a semantic list', () => {
    render(<SiteFooter />);

    const footer = screen.getByRole('contentinfo');
    const linkGroups = within(footer).queryAllByRole('list');

    expect(linkGroups).toHaveLength(2);
    expect(within(linkGroups[0]).getAllByRole('listitem')).toHaveLength(4);
    expect(within(linkGroups[1]).getAllByRole('listitem')).toHaveLength(4);
  });
});
