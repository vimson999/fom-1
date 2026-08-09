import { describe, expect, it } from 'vitest';
import { getItemBySlug } from '@/lib/items';

describe('getItemBySlug', () => {
  it('finds the Water Chestnuts record', () => {
    expect(getItemBySlug('water-chestnuts')?.name).toBe('Water Chestnuts');
  });
});
