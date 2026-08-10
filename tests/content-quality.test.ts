import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const root = process.cwd();
const launchRoots = ['app', 'components', 'lib', 'content/guides'];
const extensions = new Set(['.ts', '.tsx', '.mdx']);
const bannedPhrases = [
  '暂无',
  '待确认',
  'To be confirmed',
  'forthcoming',
  'this project',
  'project archive',
  'before publishing',
  'for publication',
  'guide should',
  'database field'
] as const;
const editorialPatterns = [
  /plann(?:ing|ed)\s+(?:a|the)\s+(?:romance|guide|wiki)\s+page/i,
  /(?:record|store|save)\s+(?:the\s+)?source\s+url/i,
  /so\s+(?:that\s+)?later\s+updates?\s+can\s+be\s+checked/i
] as const;

function collectSourceFiles(directory: string): string[] {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) return collectSourceFiles(fullPath);
    return extensions.has(path.extname(entry.name)) ? [fullPath] : [];
  });
}

function displayPath(file: string) {
  return path.relative(root, file);
}

function visibleProse(source: string, file?: string) {
  const relativePath = file ? displayPath(file).split(path.sep).join('/') : '';
  let visible = source;

  if (relativePath.startsWith('content/guides/') && relativePath.endsWith('.mdx')) {
    visible = visible.replace(/export const metadata\s*=\s*defineGuideMetadata\(\{[\s\S]*?\n\}\);/, '');
  } else if (relativePath === 'lib/items.ts') {
    visible = visible.replace(/\bsources\s*:\s*\[[\s\S]*?\n\s*\]/g, '');
  } else if (relativePath === 'lib/site.ts') {
    visible = visible.replace(/\bofficialLinks\s*:\s*\{[\s\S]*?\n\s*\},/, '');
  }

  return visible
    .replace(/\]\(https?:\/\/[^)]+\)/g, ']')
    .replace(/\b(?:href|src)\s*=\s*(?:\{\s*)?(['"`])https?:\/\/.*?\1(?:\s*\})?/g, '');
}

function assertNoLongVisibleUrl(source: string, file?: string) {
  const match = visibleProse(source, file).match(/https?:\/\/\S{45,}/);
  if (match) throw new Error(`Long visible URL: ${match[0]}`);
}

const launchFiles = launchRoots.flatMap((directory) => collectSourceFiles(path.join(root, directory)));
const guideFiles = collectSourceFiles(path.join(root, 'content/guides')).filter((file) => file.endsWith('.mdx'));

describe('launch-facing content quality', () => {
  it.each(bannedPhrases)('does not expose the placeholder or editorial phrase %s', (phrase) => {
    const matches = launchFiles.filter((file) => fs.readFileSync(file, 'utf8').toLowerCase().includes(phrase.toLowerCase()));
    expect(matches.map(displayPath), `Found "${phrase}" in launch-facing source`).toEqual([]);
  });

  it.each(editorialPatterns)('does not expose page-planning or update-maintenance instructions matching %s', (pattern) => {
    const matches = launchFiles.filter((file) => pattern.test(fs.readFileSync(file, 'utf8')));
    expect(matches.map(displayPath), `Found editorial instruction ${pattern} in launch-facing source`).toEqual([]);
  });

  it('keeps a quoted long URL visible when it is rendered as JSX prose', () => {
    const source = "<p>{'https://example.com/a-visible-url-that-is-long-enough-to-break-a-mobile-viewport'}</p>";

    expect(visibleProse(source)).toMatch(/https?:\/\/\S{45,}/);
  });

  it('does not assume every URL-valued variable is non-rendered config', () => {
    const source = "const visibleUrl = 'https://example.com/a-visible-variable-url-that-is-long-enough-to-break-a-mobile-viewport'; <p>{visibleUrl}</p>";

    expect(visibleProse(source)).toMatch(/https?:\/\/\S{45,}/);
  });

  it('rejects a long URL stored on an object property and rendered by property path', () => {
    const source = "const card = { url: 'https://example.com/a-visible-object-property-url-that-is-long-enough-to-break-a-mobile-viewport' }; <p>{card.url}</p>";

    expect(() => assertNoLongVisibleUrl(source)).toThrow(/Long visible URL/);
  });

  it.each(guideFiles)('%s has one H1 and no raw YAML frontmatter', (file) => {
    const source = fs.readFileSync(file, 'utf8');
    expect(source.match(/^#\s+.+$/gm)?.length ?? 0, `${displayPath(file)} must have exactly one H1`).toBe(1);
    expect(source, `${displayPath(file)} must not include raw YAML delimiters`).not.toMatch(/^---\s*$/m);
  });

  it.each(launchFiles)('%s has no long raw URL in visible prose', (file) => {
    expect(() => assertNoLongVisibleUrl(fs.readFileSync(file, 'utf8'), file), `${displayPath(file)} contains a long raw URL`).not.toThrow();
  });
});
