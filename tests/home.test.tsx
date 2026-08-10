import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import Home from '@/app/page';

afterEach(cleanup);

describe('Home', () => {
  it('renders the wiki hero and database entry point', () => {
    render(<Home />);
    expect(screen.getByRole('heading', { name: 'Fields of Mistria' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /start beginner guide/i })).toHaveAttribute('href', '/guides');
  });

  it('presents an honest Early Access hub with useful guide routes', () => {
    render(<Home />);

    expect(screen.getByText('Early Access')).toBeInTheDocument();
    expect(screen.getByText(/curated, growing/i)).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: /redeem codes/i })).not.toBeInTheDocument();
    expect(screen.getByRole('link', { name: /browse item references/i })).toHaveAttribute('href', '/database/items');
  });
});
