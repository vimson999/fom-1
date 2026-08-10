import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const css = fs.readFileSync(path.join(process.cwd(), 'app/globals.css'), 'utf8');
const rootDeclarations = css.match(/:root\s*\{([^}]*)\}/)?.[1] ?? '';
const tokens = new Map(
  [...rootDeclarations.matchAll(/(--[\w-]+)\s*:\s*([^;]+);/g)].map((match) => [
    match[1],
    match[2].trim()
  ])
);

type Rgb = readonly [number, number, number];

function token(name: string) {
  const value = tokens.get(name);
  if (!value) throw new Error(`Missing CSS token: ${name}`);
  return value;
}

function colorToRgb(color: string): Rgb {
  const hex = color.match(/^#([\da-f]{2})([\da-f]{2})([\da-f]{2})$/i);
  if (hex) return [hex[1], hex[2], hex[3]].map((channel) => parseInt(channel, 16)) as unknown as Rgb;

  const hsl = color.match(/^hsl\(([\d.]+)\s+([\d.]+)%\s+([\d.]+)%\)$/i);
  if (!hsl) throw new Error(`Unsupported CSS color: ${color}`);

  const hue = Number(hsl[1]);
  const saturation = Number(hsl[2]) / 100;
  const lightness = Number(hsl[3]) / 100;
  const chroma = (1 - Math.abs(2 * lightness - 1)) * saturation;
  const secondary = chroma * (1 - Math.abs(((hue / 60) % 2) - 1));
  const offset = lightness - chroma / 2;
  let channels: Rgb;

  if (hue < 60) channels = [chroma, secondary, 0];
  else if (hue < 120) channels = [secondary, chroma, 0];
  else if (hue < 180) channels = [0, chroma, secondary];
  else if (hue < 240) channels = [0, secondary, chroma];
  else if (hue < 300) channels = [secondary, 0, chroma];
  else channels = [chroma, 0, secondary];

  return channels.map((channel) => (channel + offset) * 255) as unknown as Rgb;
}

function relativeLuminance(color: string) {
  const [red, green, blue] = colorToRgb(color).map((channel) => {
    const normalized = channel / 255;
    return normalized <= 0.04045
      ? normalized / 12.92
      : ((normalized + 0.055) / 1.055) ** 2.4;
  });

  return 0.2126 * red + 0.7152 * green + 0.0722 * blue;
}

function contrastRatio(first: string, second: string) {
  const luminances = [relativeLuminance(first), relativeLuminance(second)].sort(
    (left, right) => right - left
  );
  return (luminances[0] + 0.05) / (luminances[1] + 0.05);
}

function declarationBlock(selector: string) {
  const escapedSelector = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return css.match(new RegExp(`${escapedSelector}\\s*\\{([^}]*)\\}`))?.[1] ?? '';
}

describe('global color accessibility', () => {
  it('uses a separate gold text accent with normal-text contrast on light surfaces', () => {
    const textAccent = tokens.get('--gold-text') ?? token('--gold');

    expect(contrastRatio(textAccent, token('--paper'))).toBeGreaterThanOrEqual(4.5);
    expect(contrastRatio(textAccent, token('--cream'))).toBeGreaterThanOrEqual(4.5);
    expect(tokens.get('--gold-text')).toBeDefined();
    expect(textAccent).not.toBe(token('--gold'));
    expect(declarationBlock('.wordmark span')).toContain('color:var(--gold-text)');
  });

  it('applies light and dark focus layers that contrast with dark and light surfaces', () => {
    const darkFocus = tokens.get('--focus-dark') ?? token('--gold');
    const lightFocus = tokens.get('--focus-light') ?? token('--gold');

    expect(contrastRatio(darkFocus, token('--paper'))).toBeGreaterThanOrEqual(3);
    expect(contrastRatio(darkFocus, token('--cream'))).toBeGreaterThanOrEqual(3);
    expect(contrastRatio(lightFocus, token('--deep'))).toBeGreaterThanOrEqual(3);

    const focusStyle = declarationBlock(':focus-visible');
    expect(focusStyle).toContain('outline:2px solid var(--focus-light)');
    expect(focusStyle).toContain('box-shadow:0 0 0 6px var(--focus-dark)');
  });

  it('keeps normal-size footer gold readable on the dark footer surface', () => {
    const footerAccent = tokens.get('--gold-on-dark') ?? token('--gold');

    expect(contrastRatio(footerAccent, token('--deep'))).toBeGreaterThanOrEqual(4.5);
    expect(declarationBlock('.footer-inner a')).toContain('color:var(--gold-on-dark)');
  });
});
