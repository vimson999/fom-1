import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import ItemDetailPage from '@/app/database/items/[slug]/page';

describe('ItemDetailPage', () => {
  it('shows Water Chestnuts facts and sources', async () => {
    render(await ItemDetailPage({ params: Promise.resolve({ slug: 'water-chestnuts' }) }));
    expect(screen.getByRole('heading', { name: 'Water Chestnuts' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /sources/i })).toBeInTheDocument();
  });
});
