import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import Home from '@/app/page';

describe('Home', () => {
  it('renders the wiki hero and database entry point', () => {
    render(<Home />);
    expect(screen.getByRole('heading', { name: 'Fields of Mistria' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /start beginner guide/i })).toHaveAttribute('href', '/guides');
  });
});
