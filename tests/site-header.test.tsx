import { cleanup, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it } from 'vitest';
import { SiteHeader } from '@/components/site-header';
import type { SearchEntry } from '@/lib/search';

const entries: readonly SearchEntry[] = [
  { title: 'Water Chestnuts', description: 'A forageable river resource', keyword: 'water chestnuts', category: 'Forage', href: '/database/items/water-chestnuts' },
  { title: 'Shovel', description: 'An early tool', keyword: 'how to get shovel', category: 'Tool', href: '/database/items/shovel' }
];

afterEach(cleanup);

describe('SiteHeader', () => {
  it('exposes one primary navigation link for Home, Guides, Items, and Tools', () => {
    render(<SiteHeader searchEntries={entries} />);
    const navigation = screen.getByRole('navigation', { name: 'Primary navigation' });

    for (const label of ['Home', 'Guides', 'Items', 'Tools']) {
      expect(within(navigation).getAllByRole('link', { name: label })).toHaveLength(1);
    }
    expect(screen.queryByRole('combobox', { name: /language/i })).not.toBeInTheDocument();
    expect(within(navigation).queryByRole('link', { name: 'Database' })).not.toBeInTheDocument();
  });

  it('expands the mobile navigation and closes it after route activation', async () => {
    const user = userEvent.setup();
    render(<SiteHeader searchEntries={entries} />);
    const button = screen.getByRole('button', { name: /toggle navigation/i });

    expect(button).toHaveAttribute('aria-expanded', 'false');
    await user.click(button);
    expect(button).toHaveAttribute('aria-expanded', 'true');
    await user.click(screen.getByRole('link', { name: 'Tools' }));
    expect(button).toHaveAttribute('aria-expanded', 'false');
  });

  it('searches entries in a focused dialog and restores focus after Escape', async () => {
    const user = userEvent.setup();
    render(<SiteHeader searchEntries={entries} />);
    const button = screen.getByRole('button', { name: /search the wiki/i });

    await user.click(button);
    const dialog = screen.getByRole('dialog', { name: /search the wiki/i });
    const input = within(dialog).getByRole('searchbox', { name: /search the wiki/i });
    expect(input).toHaveFocus();
    expect(within(dialog).getByRole('link', { name: /water chestnuts/i })).toBeInTheDocument();

    await user.type(input, 'water');
    expect(within(dialog).getByRole('link', { name: /water chestnuts/i })).toBeInTheDocument();
    expect(within(dialog).getByRole('status')).toHaveTextContent('1 result');

    await user.clear(input);
    await user.type(input, 'missing entry');
    expect(within(dialog).getByText(/no results found/i)).toBeInTheDocument();

    await user.keyboard('{Escape}');
    expect(screen.queryByRole('dialog', { name: /search the wiki/i })).not.toBeInTheDocument();
    expect(button).toHaveFocus();
  });
});
