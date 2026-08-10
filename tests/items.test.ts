import { describe, expect, it } from 'vitest';
import { getItemBySlug, items } from '@/lib/items';

describe('getItemBySlug', () => {
  it('finds the Water Chestnuts record', () => {
    expect(getItemBySlug('water-chestnuts')?.name).toBe('Water Chestnuts');
  });

  it('keeps every item useful and traceable on its detail page', () => {
    for (const item of items) {
      expect(item.summary.trim().length, `${item.name} needs a concrete summary`).toBeGreaterThan(30);
      expect(item.acquisition.trim().length, `${item.name} needs a concrete acquisition statement`).toBeGreaterThan(30);
      expect(`${item.summary} ${item.acquisition}`, `${item.name} still has incomplete release copy`).not.toMatch(/reserved|forthcoming|to be confirmed|see the .*guide/i);
      expect(item.sources.length, `${item.name} needs at least one source`).toBeGreaterThan(0);
      for (const source of item.sources) {
        expect(source.label.trim().length, `${item.name} has an unlabelled source`).toBeGreaterThan(0);
        expect(source.url, `${item.name} source must use HTTPS`).toMatch(/^https:\/\//);
      }
    }
  });

  it('describes the guide-backed Stone Loach fishing conditions and museum use', () => {
    const stoneLoach = getItemBySlug('stone-loach');
    const copy = `${stoneLoach?.summary} ${stoneLoach?.acquisition}`;

    expect(copy).toMatch(/Upper Mines/i);
    expect(copy).toMatch(/early floors/i);
    expect(copy).toMatch(/medium shadow/i);
    expect(copy).toMatch(/all seasons/i);
    expect(copy).toMatch(/any weather/i);
    expect(copy).toMatch(/museum/i);
    expect(copy).not.toMatch(/morning|afternoon|evening|night/i);
  });

  it('describes the guide-backed Worn Shovel shop route and uses', () => {
    const shovel = getItemBySlug('shovel');
    const copy = `${shovel?.summary} ${shovel?.acquisition}`;

    expect(copy).toMatch(/Worn Shovel/i);
    expect(copy).toMatch(/General Store/i);
    expect(copy).toMatch(/500 Tesserae/i);
    expect(copy).toMatch(/switch|cycle/i);
    expect(copy).toMatch(/farm|soil|field/i);
    expect(copy).toMatch(/artifact|dig/i);
  });
});
