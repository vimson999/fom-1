import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it } from 'vitest';
import { ItemBrowser } from '@/components/item-browser';
import { items } from '@/lib/items';

afterEach(cleanup);

describe('ItemBrowser', () => {
  it('filters cards by search text', async () => {
    const user = userEvent.setup();
    render(<ItemBrowser items={items} />);
    await user.type(screen.getByRole('searchbox'), 'water');
    expect(screen.getByRole('link', { name: /water chestnuts/i })).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: /stone loach/i })).not.toBeInTheDocument();
  });

  it('announces result counts and explains an empty filtered list', async () => {
    const user = userEvent.setup();
    render(<ItemBrowser items={items} />);

    expect(screen.getByRole('status')).toHaveTextContent('Showing 3 / 3 entries');
    await user.type(screen.getByRole('searchbox'), 'missing');
    expect(screen.getByRole('status')).toHaveTextContent('Showing 0 / 3 entries');
    expect(screen.getByText(/no items match/i)).toBeInTheDocument();
  });
});
