# Fields of Mistria Wiki Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build an English Next.js wiki shell that mirrors the Solarpunk Wiki page structure across a homepage, searchable item database, and item detail page.

**Architecture:** The App Router owns the three routes and shared site shell. Typed item data powers the list and detail pages; a small client component applies search and category filters. MDX content configuration is established now so later keyword articles can be added without changing the page architecture.

**Tech Stack:** Next.js App Router, TypeScript, React, Tailwind CSS, MDX, Vitest, React Testing Library.

## Global Constraints

- Publish English only in version one; preserve a locale-ready content boundary without creating translated routes.
- Mirror Solarpunk Wiki’s hierarchy, density, navigation and responsive behavior, but do not use its copy, branding, assets, data or code.
- Use original Fields of Mistria content and the existing project favicon assets.
- Keep all published game facts traceable to the raw source archive; AI reports are never the sole evidence.
- This implementation phase builds site structure and minimal verified example data, not the complete ten-page content set.

---

## File structure

- `package.json`: Next.js scripts and dependencies.
- `app/layout.tsx`: HTML metadata, fonts, favicon and shared shell.
- `app/page.tsx`: homepage composition.
- `app/database/items/page.tsx`: server route for the searchable item database.
- `app/database/items/[slug]/page.tsx`: server route for item detail pages.
- `app/globals.css`: visual tokens and responsive base styles.
- `components/site-header.tsx`, `components/site-footer.tsx`: shared navigation and legal footer.
- `components/item-browser.tsx`: client-side search/filter/list interaction.
- `components/item-card.tsx`: reusable list card.
- `components/item-facts.tsx`, `components/source-list.tsx`: detail-page structured regions.
- `lib/items.ts`: typed item records and lookup helpers.
- `lib/site.ts`: navigation, category and SEO constants.
- `content/guides/.gitkeep`: future MDX content location.
- `tests/item-browser.test.tsx`, `tests/items.test.ts`: data and interaction coverage.

## Task 1: Initialize the Next.js application and quality tooling

**Files:**
- Create: `package.json`, `tsconfig.json`, `next.config.mjs`, `postcss.config.mjs`, `tailwind.config.ts`, `vitest.config.ts`, `tests/setup.ts`.
- Create: `app/globals.css`, `app/layout.tsx`.

**Interfaces:**
- Produces the `dev`, `build`, `test` and `test:watch` scripts.
- Produces the shared root layout used by every route.

- [ ] **Step 1: Create the Next.js TypeScript project in this directory**

Use the App Router, Tailwind CSS, ESLint, and the `@/*` import alias. Do not create a nested application folder.

- [ ] **Step 2: Initialize Git before the first implementation commit**

Run `git init` in this directory and add a `.gitignore` that excludes `.next`, `node_modules`, test coverage output and local environment files.

- [ ] **Step 3: Add test dependencies and scripts**

Add Vitest, jsdom, `@testing-library/react`, `@testing-library/jest-dom`, and `@testing-library/user-event`. Configure the test environment to load `tests/setup.ts` with `import '@testing-library/jest-dom/vitest'`.

- [ ] **Step 4: Create the failing smoke test**

Create `tests/items.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { getItemBySlug } from '@/lib/items';

describe('getItemBySlug', () => {
  it('finds the Water Chestnuts record', () => {
    expect(getItemBySlug('water-chestnuts')?.name).toBe('Water Chestnuts');
  });
});
```

- [ ] **Step 5: Run the smoke test and verify it fails because the data module is absent**

Run: `npm test -- tests/items.test.ts`

Expected: failure resolving `@/lib/items`.

- [ ] **Step 6: Commit the initialized project**

Commit message: `chore: initialize fields of mistria wiki`.

## Task 2: Add the typed item data boundary

**Files:**
- Create: `lib/items.ts`, `lib/site.ts`, `content/guides/.gitkeep`.
- Modify: `tests/items.test.ts`.

**Interfaces:**
- Produces `type WikiItem`, `items`, `getItemBySlug(slug: string): WikiItem | undefined`, `itemCategories`.
- `WikiItem` fields: `slug`, `name`, `summary`, `category`, `acquisition`, `relatedSlugs`, `sources`.

- [ ] **Step 1: Extend the failing data test**

```ts
it('returns undefined for a missing slug', () => {
  expect(getItemBySlug('missing-item')).toBeUndefined();
});
```

- [ ] **Step 2: Implement the smallest verified example data set**

Create Water Chestnuts plus at least two related records with explicit source-label and source-URL fields. Use only facts present in the project’s raw materials.

```ts
export function getItemBySlug(slug: string) {
  return items.find((item) => item.slug === slug);
}
```

- [ ] **Step 3: Run the data tests**

Run: `npm test -- tests/items.test.ts`

Expected: PASS.

- [ ] **Step 4: Commit the data boundary**

Commit message: `feat: add typed wiki item data`.

## Task 3: Build the shared site shell and homepage

**Files:**
- Create: `components/site-header.tsx`, `components/site-footer.tsx`.
- Modify: `app/layout.tsx`, `app/page.tsx`, `app/globals.css`, `lib/site.ts`.

**Interfaces:**
- `SiteHeader` has no required props and renders primary navigation, search affordance and English language entry.
- `SiteFooter` has no required props and renders non-affiliation and trademark text.

- [ ] **Step 1: Add homepage render test**

```tsx
import { render, screen } from '@testing-library/react';
import Home from '@/app/page';

it('renders the wiki hero and database entry point', () => {
  render(<Home />);
  expect(screen.getByRole('heading', { name: /fields of mistria wiki/i })).toBeInTheDocument();
  expect(screen.getByRole('link', { name: /browse the database/i })).toHaveAttribute('href', '/database/items');
});
```

- [ ] **Step 2: Implement the shared navigation and footer**

Use semantic `nav`, accessible link labels, an English language control, and a responsive menu button. Include no copied Solarpunk copy or assets.

- [ ] **Step 3: Implement the homepage regions**

Compose Hero, data overview, category cards, guide entry points and FAQ using Fields of Mistria wording and the internal routes.

- [ ] **Step 4: Add theme and responsive styling**

Set CSS variables for ivory, forest green and warm gold. Match the reference’s content width, compact data cards and desktop/mobile hierarchy without reusing its stylesheets.

- [ ] **Step 5: Run homepage tests and local build**

Run: `npm test -- tests/home.test.tsx` and `npm run build`.

Expected: both PASS.

- [ ] **Step 6: Commit the homepage shell**

Commit message: `feat: build wiki homepage shell`.

## Task 4: Implement the searchable database list route

**Files:**
- Create: `components/item-browser.tsx`, `components/item-card.tsx`, `tests/item-browser.test.tsx`.
- Modify: `app/database/items/page.tsx`, `app/globals.css`.

**Interfaces:**
- `ItemBrowser({ items }: { items: WikiItem[] })` filters `items` by case-insensitive name search and selected category.
- `ItemCard({ item }: { item: WikiItem })` links to `/database/items/${item.slug}`.

- [ ] **Step 1: Write failing browser interaction tests**

```tsx
it('filters cards by search text', async () => {
  const user = userEvent.setup();
  render(<ItemBrowser items={items} />);
  await user.type(screen.getByRole('searchbox'), 'water');
  expect(screen.getByRole('link', { name: /water chestnuts/i })).toBeInTheDocument();
  expect(screen.queryByRole('link', { name: /stone loach/i })).not.toBeInTheDocument();
});
```

- [ ] **Step 2: Implement ItemBrowser and ItemCard**

Include total/shown counts, an accessible searchbox, category buttons with selected state, and semantic card links.

- [ ] **Step 3: Implement `/database/items`**

Render page heading, compact summary statistics and `ItemBrowser` using the typed item data.

- [ ] **Step 4: Run list interaction tests and production build**

Run: `npm test -- tests/item-browser.test.tsx` and `npm run build`.

Expected: both PASS.

- [ ] **Step 5: Commit the list route**

Commit message: `feat: add searchable item database`.

## Task 5: Implement the item detail route and metadata

**Files:**
- Create: `components/item-facts.tsx`, `components/source-list.tsx`.
- Modify: `app/database/items/[slug]/page.tsx`, `app/layout.tsx`, `app/globals.css`.
- Create: `tests/item-detail.test.tsx`.

**Interfaces:**
- `ItemFacts({ item }: { item: WikiItem })` renders category and acquisition fields.
- `SourceList({ sources }: { sources: WikiItem['sources'] })` renders labelled external links.

- [ ] **Step 1: Add failing detail-page tests**

```tsx
it('shows Water Chestnuts facts and sources', async () => {
  render(await ItemDetailPage({ params: Promise.resolve({ slug: 'water-chestnuts' }) }));
  expect(screen.getByRole('heading', { name: 'Water Chestnuts' })).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: /sources/i })).toBeInTheDocument();
});
```

- [ ] **Step 2: Implement the dynamic item route**

Look up the slug via `getItemBySlug`; render `notFound()` for an unknown slug. Add breadcrumb, summary, structured facts, related links and sources.

- [ ] **Step 3: Add route-specific metadata**

Export `generateMetadata` so the Water Chestnuts route has an English title and description derived from its typed record.

- [ ] **Step 4: Run detail tests and build**

Run: `npm test -- tests/item-detail.test.tsx` and `npm run build`.

Expected: both PASS.

- [ ] **Step 5: Commit the detail route**

Commit message: `feat: add item detail page template`.

## Task 6: Verify the three-page structure and prepare content entry

**Files:**
- Modify: `README.md`.
- Verify: `/`, `/database/items`, `/database/items/water-chestnuts`.

**Interfaces:**
- Documents how an editor adds a future MDX guide and cites raw source material.

- [ ] **Step 1: Run complete automated verification**

Run: `npm test` and `npm run build`.

Expected: both PASS.

- [ ] **Step 2: Manually inspect desktop and mobile widths**

Check navigation, Hero, category cards, list filters, detail sources and related links at desktop and narrow mobile widths.

- [ ] **Step 3: Update README with local run and content-entry instructions**

Document `npm run dev`, the three initial routes, the future MDX folder and the requirement to cite raw sources.

- [ ] **Step 4: Commit final structure verification**

Commit message: `docs: document wiki structure and content workflow`.
