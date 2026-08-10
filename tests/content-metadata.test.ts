import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const guidesDirectory = path.join(process.cwd(), 'content/guides');
const guideFiles = fs.readdirSync(guidesDirectory).filter((file) => file.endsWith('.mdx')).sort();

function propertyValue(source: string, property: string) {
  return source.match(new RegExp(`${property}: ['\"]([^'\"]+)['\"]`))?.[1];
}

describe('guide content metadata', () => {
  it('keeps every guide in typed, non-rendering metadata exports', () => {
    expect(guideFiles).toHaveLength(10);

    for (const file of guideFiles) {
      const source = fs.readFileSync(path.join(guidesDirectory, file), 'utf8');
      const slug = file.replace(/\.mdx$/, '');

      expect(source.startsWith('---')).toBe(false);
      expect(source).toContain("import { defineGuideMetadata } from '@/lib/content';");
      expect(source).toContain('export const metadata = defineGuideMetadata({');
      expect(propertyValue(source, 'slug')).toBe(slug);

      const title = propertyValue(source, 'title');
      const description = propertyValue(source, 'description');
      expect(title?.length).toBeGreaterThanOrEqual(40);
      expect(title?.length).toBeLessThanOrEqual(60);
      expect(description?.length).toBeGreaterThanOrEqual(140);
      expect(description?.length).toBeLessThanOrEqual(160);
      expect(propertyValue(source, 'updated')).toMatch(/^\d{4}-\d{2}-\d{2}$/);

      const sources = source.match(/sources:\s*\[([\s\S]*?)\n\s*\]/)?.[1] ?? '';
      const sourceEntries = [...sources.matchAll(/\{\s*label:\s*['\"]([^'\"]+)['\"],\s*url:\s*['\"](https:\/\/[^'\"]+)['\"]\s*\}/g)];
      expect(sourceEntries.length).toBeGreaterThan(0);
      for (const [, label, url] of sourceEntries) {
        expect(label.trim()).not.toBe('');
        expect(url).toMatch(/^https:\/\//);
      }
    }
  });
});
