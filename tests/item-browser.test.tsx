import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { ItemBrowser } from '@/components/item-browser';
import { items } from '@/lib/items';

describe('ItemBrowser', () => {
  it('filters cards by search text', async () => {
    const user = userEvent.setup();
    render(<ItemBrowser items={items} />);
    await user.type(screen.getByRole('searchbox'), 'water');
    expect(screen.getByRole('link', { name: /water chestnuts/i })).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: /stone loach/i })).not.toBeInTheDocument();
  });
});
