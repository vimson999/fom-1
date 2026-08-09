import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import Home from '@/app/page';

describe('Home', () => {
  it('renders the wiki hero and database entry point', () => {
    render(<Home />);
    expect(screen.getByRole('heading', { name: /fields of mistria wiki/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /browse the database/i })).toHaveAttribute('href', '/database/items');
  });
});
