import { cleanup, render, screen, within } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import {
  DeepWoodsFishTable,
  FarmLayoutFigure,
  OlricGiftGroups,
  StoneLoachFacts,
  WeddingOutfitCategories
} from '@/components/guide-visuals';

afterEach(cleanup);

describe('original guide figures', () => {
  it('gives every farm layout zone a visible text label', () => {
    render(<FarmLayoutFigure />);
    const figure = screen.getByRole('figure', { name: /farm layout zones/i });

    for (const zone of ['Home', 'Crops', 'Animals', 'Storage', 'Flexible expansion']) {
      expect(within(figure).getByText(zone)).toBeInTheDocument();
    }
  });

  it('presents Deep Woods fish conditions in a captioned table', () => {
    render(<DeepWoodsFishTable />);
    const table = screen.getByRole('table', { name: /Deep Woods fish conditions/i });

    for (const heading of ['Fish', 'Shadow', 'Season', 'Weather']) {
      expect(within(table).getByRole('columnheader', { name: heading })).toBeInTheDocument();
    }
    expect(within(table).getByRole('row', { name: /Sunny Small Any Rain, thunderstorm, snow, or blizzard/i })).toBeInTheDocument();
    expect(within(table).getByRole('row', { name: /Muskie Large Any Any/i })).toBeInTheDocument();
  });

  it('summarizes Stone Loach conditions without inventing a clock window', () => {
    render(<StoneLoachFacts />);
    const figure = screen.getByRole('figure', { name: /Stone Loach quick facts/i });

    expect(within(figure).getByText(/Upper Mines, early floors/i)).toBeInTheDocument();
    expect(within(figure).getByText('All seasons')).toBeInTheDocument();
    expect(within(figure).getByText('No source-backed restriction')).toBeInTheDocument();
    expect(within(figure).getByText('Any weather')).toBeInTheDocument();
    expect(within(figure).queryByText(/morning|afternoon|evening|night/i)).not.toBeInTheDocument();
  });

  it('separates Olric gifts into clear preference groups', () => {
    render(<OlricGiftGroups />);
    const figure = screen.getByRole('figure', { name: /Olric gift preferences/i });

    expect(within(figure).getByRole('heading', { name: 'Loved' })).toBeInTheDocument();
    expect(within(figure).getByRole('heading', { name: 'Liked' })).toBeInTheDocument();
    expect(within(figure).getByRole('heading', { name: 'Avoid' })).toBeInTheDocument();
    expect(within(figure).getByText('Perfect Copper Ore')).toBeInTheDocument();
    expect(within(figure).getByText('Rock Statue')).toBeInTheDocument();
    expect(within(figure).getByText('Rockbiter')).toBeInTheDocument();
  });

  it('shows sourced wedding outfit categories without copied imagery', () => {
    render(<WeddingOutfitCategories />);
    const figure = screen.getByRole('figure', { name: /wedding outfit categories/i });

    for (const category of ['Dresses', 'Formal suits', 'Wedding veil', 'Existing wardrobe clothing']) {
      expect(within(figure).getByRole('heading', { name: category })).toBeInTheDocument();
    }
    expect(within(figure).queryByRole('img')).not.toBeInTheDocument();
  });
});
