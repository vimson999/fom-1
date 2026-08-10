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

function selectorSpecificity(selector: string) {
  const ids = selector.match(/#[\w-]+/g)?.length ?? 0;
  const classLike = selector.match(/\.[\w-]+|\[[^\]]+\]|:(?!:|not\b)[\w-]+/g)?.length ?? 0;
  const withoutFunctionalSelectors = selector.replace(/:(?:not|is|has|where)\([^)]*\)/g, '');
  const types = withoutFunctionalSelectors.match(/(?:^|[\s>+~])(?:[a-z][\w-]*|::[\w-]+)/gi)?.length ?? 0;

  return [ids, classLike, types] as const;
}

function cascadedCardShadow(className: string) {
  const statefulCss = css
    .replaceAll(':hover', '[data-hover]')
    .replaceAll(':focus-visible', '[data-focus-visible]');
  const style = document.createElement('style');
  const card = document.createElement('a');
  style.textContent = statefulCss;
  card.className = className;
  card.toggleAttribute('data-hover', true);
  card.toggleAttribute('data-focus-visible', true);
  document.head.append(style);
  document.body.append(card);
  if (!style.sheet) throw new Error('Unable to build the card style fixture');

  let sourceOrder = 0;
  let winner: { important: boolean; specificity: readonly number[]; order: number; value: string } | undefined;

  function visit(rules: CSSRuleList) {
    for (const rule of Array.from(rules)) {
      if ('cssRules' in rule) visit((rule as CSSGroupingRule).cssRules);
      if (rule.type !== CSSRule.STYLE_RULE) continue;
      const styleRule = rule as CSSStyleRule;

      for (const selector of styleRule.selectorText.split(',')) {
        const value = styleRule.style.getPropertyValue('box-shadow').trim();
        const candidate = {
          important: styleRule.style.getPropertyPriority('box-shadow') === 'important',
          specificity: selectorSpecificity(selector),
          order: sourceOrder++,
          value
        };
        if (!value || !card.matches(selector.trim())) continue;

        const candidateRank = [Number(candidate.important), ...candidate.specificity, candidate.order];
        const winnerRank = winner
          ? [Number(winner.important), ...winner.specificity, winner.order]
          : [-1, -1, -1, -1, -1];
        if (candidateRank.some((part, index) => part !== winnerRank[index]
          && part > winnerRank[index]
          && candidateRank.slice(0, index).every((rank, rankIndex) => rank === winnerRank[rankIndex]))) {
          winner = candidate;
        }
      }
    }
  }

  visit(style.sheet.cssRules);
  style.remove();
  card.remove();
  return winner?.value;
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

  it.each(['category-card', 'item-card'])(
    'preserves the dark focus layer when a hovered %s receives keyboard focus',
    (className) => {
      expect(cascadedCardShadow(className)).toBe('0 0 0 6px var(--focus-dark)');
    }
  );

  it('keeps normal-size footer gold readable on the dark footer surface', () => {
    const footerAccent = tokens.get('--gold-on-dark') ?? token('--gold');

    expect(contrastRatio(footerAccent, token('--deep'))).toBeGreaterThanOrEqual(4.5);
    expect(declarationBlock('.footer-inner a')).toContain('color:var(--gold-on-dark)');
  });
});
