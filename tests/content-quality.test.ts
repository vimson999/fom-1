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

function visibleProse(source: string) {
  return source
    .replace(/(['"`])https?:\/\/.*?\1/g, '')
    .replace(/\]\(https?:\/\/[^)]+\)/g, ']')
    .replace(/\b(?:href|src)=(['"`])https?:\/\/.*?\1/g, '');
}

const launchFiles = launchRoots.flatMap((directory) => collectSourceFiles(path.join(root, directory)));
const guideFiles = collectSourceFiles(path.join(root, 'content/guides')).filter((file) => file.endsWith('.mdx'));

describe('launch-facing content quality', () => {
  it.each(bannedPhrases)('does not expose the placeholder or editorial phrase %s', (phrase) => {
    const matches = launchFiles.filter((file) => fs.readFileSync(file, 'utf8').toLowerCase().includes(phrase.toLowerCase()));
    expect(matches.map(displayPath), `Found "${phrase}" in launch-facing source`).toEqual([]);
  });

  it.each(guideFiles)('%s has one H1 and no raw YAML frontmatter', (file) => {
    const source = fs.readFileSync(file, 'utf8');
    expect(source.match(/^#\s+.+$/gm)?.length ?? 0, `${displayPath(file)} must have exactly one H1`).toBe(1);
    expect(source, `${displayPath(file)} must not include raw YAML delimiters`).not.toMatch(/^---\s*$/m);
  });

  it.each(launchFiles)('%s has no long raw URL in visible prose', (file) => {
    expect(visibleProse(fs.readFileSync(file, 'utf8')), `${displayPath(file)} contains a long raw URL`).not.toMatch(/https?:\/\/\S{45,}/);
  });
});
