import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

describe('AdSense publisher authorization', () => {
  it('publishes the exact ads.txt authorization record', () => {
    const adsTxt = fs.readFileSync(path.join(process.cwd(), 'public/ads.txt'), 'utf8');

    expect(adsTxt).toBe('google.com, pub-5054963576840100, DIRECT, f08c47fec0942fa0\n');
  });
});
