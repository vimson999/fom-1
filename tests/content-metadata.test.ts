import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const guidesDirectory = path.join(process.cwd(), 'content/guides');
const guideFiles = fs.readdirSync(guidesDirectory).filter((file) => file.endsWith('.mdx')).sort();

function propertyValue(source: string, property: string) {
  return source.match(new RegExp(`${property}: ['\"]([^'\"]+)['\"]`))?.[1];
}

function assertValidSources(source: string) {
  const sources = source.match(/sources:\s*\[([\s\S]*?)\n\s*\]/)?.[1] ?? '';
  const sourceEntries = [...sources.matchAll(/\{([\s\S]*?)\}/g)].map((match) => match[1]);
  expect(sourceEntries.length).toBeGreaterThan(0);
  for (const sourceEntry of sourceEntries) {
    const label = sourceEntry.match(/label:\s*['\"]([^'\"]*)['\"]/)?.[1];
    const url = sourceEntry.match(/url:\s*['\"]([^'\"]*)['\"]/)?.[1];

    expect(label?.trim()).toBeTruthy();
    expect(url).toMatch(/^https:\/\//);
  }
}

describe('guide content metadata', () => {
  it('rejects a malformed source even when another source is valid', () => {
    const mixedSources = `sources: [
      { label: 'Steam Community: Beginner Guide', url: 'https://steamcommunity.com/sharedfiles/filedetails/?id=3301328479' },
      { label: '', url: 'http://example.com/not-secure' }
    ]`;

    expect(() => assertValidSources(mixedSources)).toThrow();
  });

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

      assertValidSources(source);
    }
  });
});
