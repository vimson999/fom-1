import { describe, expect, it } from 'vitest';
import { absoluteUrl, SITE_ORIGIN } from '@/lib/site';

describe('canonical site configuration', () => {
  it('builds public URLs from the validated HTTPS production origin', () => {
    expect(SITE_ORIGIN).toBeInstanceOf(URL);
    expect(SITE_ORIGIN.protocol).toBe('https:');
    expect(SITE_ORIGIN.origin).toBe('https://fieldsofmistria.land');
    expect(absoluteUrl('/guides')).toBe('https://fieldsofmistria.land/guides');
  });
});
