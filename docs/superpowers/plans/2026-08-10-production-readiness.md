# Fields of Mistria Wiki Production Readiness Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Upgrade `fieldsofmistria.land` from its audited prototype state to a secure, accessible, source-traceable, statically generated production site, then verify, commit, and push the release branch.

**Architecture:** Keep the existing Next.js App Router application and repository-authored MDX. Move guide metadata into typed MDX exports and build all discovery surfaces from shared guide and item registries. Add static metadata routes, an in-browser registry search, original HTML/CSS guide figures, explicit production headers, and CI quality gates without adding a database or remote content runtime.

**Tech Stack:** Next.js 16.3.0, React 19.2.8, TypeScript strict mode, MDX 3, Vitest, Testing Library, ESLint flat config, GitHub Actions, static App Router generation.

## Global Constraints

- [ ] Work only on `agent/production-readiness`; preserve unrelated user files and commits.
- [ ] Follow red-green-refactor for every behavior change: add one focused failing test, run it and confirm the expected failure, implement the smallest complete behavior, rerun the focused test, then run the relevant suite.
- [ ] Use `https://fieldsofmistria.land` as the only canonical origin.
- [ ] Keep MDX repository-controlled. Do not add remote or user-authored MDX ingestion.
- [ ] Do not invent game facts or copy screenshots, official artwork, or third-party assets. New visuals must be semantic HTML and original CSS geometry.
- [ ] Keep all external sources labelled, HTTPS-only, and opened with `rel="noopener noreferrer"` when a new tab is used.
- [ ] Preserve the existing ivory, forest-green, and gold visual identity.
- [ ] Stop and use the systematic-debugging workflow if any test fails for an unexpected reason.

---

## Task 1: Upgrade the runtime, quality gates, and production headers

**Files:**

- Create: `.nvmrc`
- Create: `.github/workflows/ci.yml`
- Create: `eslint.config.mjs`
- Modify: `.gitignore`
- Modify: `package.json`
- Modify: `package-lock.json`
- Modify: `next.config.mjs`
- Create: `tests/production-config.test.ts`

- [ ] **Step 1: Record the current baseline**

Run:

```bash
npm test
npm run build
npm audit --omit=dev
```

Expected: the four existing tests and production build pass; the audit reproduces the previously recorded high-severity Next.js/PostCSS/sharp dependency findings.

- [ ] **Step 2: Write the failing production-configuration test**

Create `tests/production-config.test.ts` that imports the wrapped default export from `next.config.mjs`, invokes `headers()`, and asserts:

```ts
expect(nextConfig.poweredByHeader).toBe(false);
expect(headers['content-security-policy']).toContain("default-src 'self'");
expect(headers['content-security-policy']).toContain("frame-ancestors 'none'");
expect(headers['x-content-type-options']).toBe('nosniff');
expect(headers['referrer-policy']).toBe('strict-origin-when-cross-origin');
expect(headers['permissions-policy']).toContain('camera=()');
expect(headers['x-frame-options']).toBe('DENY');
expect(headers['strict-transport-security']).toContain('max-age=63072000');
```

Run:

```bash
npm test -- tests/production-config.test.ts
```

Expected: FAIL because the current Next config defines neither `poweredByHeader` nor `headers()`.

- [ ] **Step 3: Pin the supported runtime and upgrade the framework**

Set `.nvmrc` to Node 22. Update `package.json` so the framework/runtime dependencies are exact:

```json
"@next/mdx": "16.3.0",
"next": "16.3.0",
"react": "19.2.8",
"react-dom": "19.2.8"
```

Add development dependencies compatible with Next 16:

```json
"eslint": "^9.0.0",
"eslint-config-next": "16.3.0"
```

Add scripts:

```json
"lint": "eslint .",
"typecheck": "tsc --noEmit --incremental false"
```

Run `npm install` once to update `package-lock.json`, then verify the lockfile resolves Next and `@next/mdx` to `16.3.0` and React packages to `19.2.8`.

- [ ] **Step 4: Add ESLint and ignore rules**

Create an ESLint flat config using `eslint-config-next/core-web-vitals` and `eslint-config-next/typescript`, with generated directories ignored. Extend `.gitignore` with:

```gitignore
*.tsbuildinfo
.env*
!.env.example
```

Retain the existing `node_modules`, `.next`, coverage, and local-artifact rules.

- [ ] **Step 5: Implement production response headers**

Update `next.config.mjs` to retain MDX page extensions, set `poweredByHeader: false`, and apply these headers to `/:path*`:

```text
Content-Security-Policy: default-src 'self'; base-uri 'self'; object-src 'none'; frame-ancestors 'none'; form-action 'self'; img-src 'self' data: https:; font-src 'self' data:; style-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-inline'; connect-src 'self' ws: wss:; upgrade-insecure-requests
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=(), browsing-topics=()
X-Frame-Options: DENY
Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
```

Export the header array as a named value as well as returning it from `headers()` so the policy remains directly testable.

- [ ] **Step 6: Make the configuration test pass**

Run:

```bash
npm test -- tests/production-config.test.ts
npm run lint
npm run typecheck
npm run build
npm audit --omit=dev
```

Expected: all commands pass and the production dependency audit reports zero vulnerabilities. If an advisory remains, inspect the exact installed path and advisory before changing any additional dependency.

- [ ] **Step 7: Add the CI workflow**

Create `.github/workflows/ci.yml` for pushes and pull requests. Use `actions/checkout@v5`, `actions/setup-node@v5` with `.nvmrc` and npm caching, then run in order:

```bash
npm ci
npm run lint
npm run typecheck
npm test
npm run build
npm audit --omit=dev --audit-level=high
```

- [ ] **Step 8: Commit the toolchain batch**

Run:

```bash
git add .nvmrc .github/workflows/ci.yml eslint.config.mjs .gitignore package.json package-lock.json next.config.mjs tests/production-config.test.ts
git commit -m "build: upgrade production toolchain"
```

---

## Task 2: Make guide metadata typed, single-source, and non-rendering

**Files:**

- Create: `lib/content.ts`
- Modify: `lib/guides.tsx`
- Modify: `lib/items.ts`
- Modify: `components/source-list.tsx`
- Create: `components/guide-article.tsx`
- Modify: `app/guides/[slug]/page.tsx`
- Modify: all ten files under `content/guides/*.mdx`
- Create: `tests/content-metadata.test.ts`
- Create: `tests/guide-article.test.tsx`

- [ ] **Step 1: Write failing source-metadata validation tests**

In `tests/content-metadata.test.ts`, enumerate every `content/guides/*.mdx` file and assert:

- the file does not begin with YAML delimiters;
- it imports and calls `defineGuideMetadata`;
- `slug` equals the filename;
- title length is 40–60 characters;
- description length is 140–160 characters;
- `updated` is an ISO `YYYY-MM-DD` date;
- every guide has at least one source;
- each source has a non-empty human label and an `https://` URL.

Run:

```bash
npm test -- tests/content-metadata.test.ts
```

Expected: FAIL because all ten guides still begin with visible YAML frontmatter.

- [ ] **Step 2: Write the failing guide-shell behavior test**

Create `components/guide-article.tsx` only as an empty compile-safe shell if needed, then write `tests/guide-article.test.tsx` with a mock content component and mock metadata. Assert the rendered article contains the guide heading and labelled source links, does not print metadata property names such as `title:` or `description:`, and gives external links `noopener noreferrer`.

Run:

```bash
npm test -- tests/guide-article.test.tsx
```

Expected: FAIL because the shared guide article/source rendering behavior is not implemented.

- [ ] **Step 3: Add the shared content contract**

Create `lib/content.ts` with:

```ts
export type ContentSource = Readonly<{ label: string; url: string }>;

export type GuideMetadata = Readonly<{
  slug: string;
  title: string;
  description: string;
  keyword: string;
  updated: string;
  sources: readonly ContentSource[];
}>;

export function defineGuideMetadata<const T extends GuideMetadata>(metadata: T): T {
  return metadata;
}
```

Use `ContentSource` from this module in both guide and item records.

- [ ] **Step 4: Replace YAML frontmatter with typed MDX exports**

For every guide, replace the leading YAML block with:

```mdx
import { defineGuideMetadata } from '@/lib/content';

export const metadata = defineGuideMetadata({
  slug: 'fields-of-mistria-guide',
  title: 'Fields of Mistria Guide: A Practical First Week',
  description: 'Fields of Mistria guide for your first week: learn the confirmed early tools, farm routine, requests, stamina options, and town progress steps.',
  keyword: 'fields of mistria guide',
  updated: '2026-08-10',
  sources: [
    { label: 'Steam Community: Beginner Guide', url: 'https://steamcommunity.com/sharedfiles/filedetails/?id=3301328479' },
    { label: 'Pixel Blanket: Guide to Your First Year', url: 'https://www.pixel-blanket.com/blog/field-of-misteria-guide-to-your-first-year' },
    { label: 'YouTube: Beginner Tips Video', url: 'https://www.youtube.com/watch?v=qJcilpRFJzc' }
  ]
});
```

Move every stored frontmatter source URL into the labelled `sources` array. Do not render these values inside the MDX body.

- [ ] **Step 5: Build the guide registry from component and metadata imports**

In `lib/guides.tsx`, import each MDX default component and its named `metadata`, then construct entries with a helper:

```ts
export type GuideEntry = GuideMetadata & { Component: ComponentType };

function entry(metadata: GuideMetadata, Component: ComponentType): GuideEntry {
  return { ...metadata, Component };
}
```

The `guides` array must contain no hand-copied titles, descriptions, keywords, dates, or sources.

- [ ] **Step 6: Render one shared article shell**

Implement `GuideArticle` to render breadcrumbs, the MDX component, an “Article sources” section using `SourceList`, and an update line based on the registry metadata. Update the dynamic guide route to use it, export `dynamicParams = false`, and retain `notFound()` for an unknown slug.

Update `SourceList` to accept `readonly ContentSource[]`, use `rel="noopener noreferrer"`, wrap long URLs, and use an honest generic empty state that does not mention an internal project archive.

- [ ] **Step 7: Run the focused and regression tests**

Run:

```bash
npm test -- tests/content-metadata.test.ts tests/guide-article.test.tsx
npm test
npm run typecheck
npm run build
```

Expected: all tests pass; build output includes all ten statically generated guide routes; rendered MDX exports are absent from article body HTML.

- [ ] **Step 8: Commit the content architecture batch**

Run:

```bash
git add lib/content.ts lib/guides.tsx lib/items.ts components/source-list.tsx components/guide-article.tsx app/guides/'[slug]'/page.tsx content/guides tests/content-metadata.test.ts tests/guide-article.test.tsx
git commit -m "refactor: centralize guide metadata"
```

---

## Task 3: Add canonical SEO, metadata routes, structured data, legal pages, and 404 behavior

**Files:**

- Modify: `lib/site.ts`
- Create: `lib/seo.ts`
- Create: `components/json-ld.tsx`
- Modify: `app/layout.tsx`
- Modify: `app/page.tsx`
- Modify: `app/guides/page.tsx`
- Modify: `app/guides/[slug]/page.tsx`
- Modify: `app/database/items/page.tsx`
- Modify: `app/database/items/[slug]/page.tsx`
- Create: `app/robots.ts`
- Create: `app/sitemap.ts`
- Create: `app/manifest.ts`
- Create: `app/opengraph-image.tsx`
- Create: `app/privacy/page.tsx`
- Create: `app/terms/page.tsx`
- Create: `app/not-found.tsx`
- Modify: `components/site-footer.tsx`
- Create: `tests/site-config.test.ts`
- Create: `tests/seo.test.ts`
- Create: `tests/json-ld.test.tsx`
- Create: `tests/legal-pages.test.tsx`

- [ ] **Step 1: Write failing domain and metadata tests**

Test that `SITE_ORIGIN` is an HTTPS `URL` whose origin is exactly `https://fieldsofmistria.land`, and that `absoluteUrl('/guides')` returns the canonical absolute URL.

Test `createPageMetadata()` and `createGuideMetadata()` for:

- an absolute title without the old template suffix;
- the shared registry description;
- canonical URL;
- matching Open Graph URL/title/description/image;
- `summary_large_image` Twitter data;
- `article` Open Graph type and modified date for a guide.

Run:

```bash
npm test -- tests/site-config.test.ts tests/seo.test.ts
```

Expected: FAIL because the origin and metadata helpers do not exist.

- [ ] **Step 2: Implement canonical site and SEO helpers**

In `lib/site.ts`, remove inactive language data and duplicate navigation entries. Export a validated origin:

```ts
export const SITE_ORIGIN = new URL('https://fieldsofmistria.land');
if (SITE_ORIGIN.protocol !== 'https:') throw new Error('SITE_ORIGIN must use HTTPS');
export const absoluteUrl = (path: string) => new URL(path, SITE_ORIGIN).toString();
```

Use honest site copy describing a curated fan guide hub. Keep primary navigation to Home, Guides, Items, and Tools.

Create `lib/seo.ts` to return complete, typed `Metadata` for normal pages, item pages, and guide articles. Use `/opengraph-image` as the shared original social image and `{ absolute: title }` for guide titles.

- [ ] **Step 3: Write failing route-metadata tests**

In `tests/seo.test.ts`, call `robots()` and `sitemap()` directly. Assert robots allows `/`, points to `https://fieldsofmistria.land/sitemap.xml`, and uses the canonical host. Assert the sitemap set equals:

```text
/
/guides
/guides/<all 10 registry slugs>
/database/items
/database/items/<all 3 registry slugs>
/privacy
/terms
```

Expected: FAIL because neither metadata route exists.

- [ ] **Step 4: Implement metadata routes and social image**

Add:

- `app/robots.ts` returning `MetadataRoute.Robots`;
- `app/sitemap.ts` deriving dynamic URLs from `guides` and `items`;
- `app/manifest.ts` with name, short name, description, `/`, standalone display, ivory background, forest theme, and existing icon assets;
- `app/opengraph-image.tsx` returning a 1200×630 `ImageResponse` made only from typography and geometric field rows in the site palette.

- [ ] **Step 5: Apply metadata to every public route**

Set `metadataBase` and global defaults in `app/layout.tsx`, but do not put a root canonical on the layout. Export route-specific metadata from the home, guide index, item index, Privacy, and Terms pages. Generate complete metadata from the registry in guide and item detail routes. Set `dynamicParams = false` on both finite dynamic routes.

- [ ] **Step 6: Write failing structured-data and legal-page tests**

In `tests/json-ld.test.tsx`, render a payload containing `<script>` and assert the serialized JSON replaces `<` with `\\u003c`. In `tests/legal-pages.test.tsx`, render both pages and assert their H1 headings and the launch-state statements: no accounts, payments, comments, uploads, first-party analytics, advertising cookies, or newsletter collection; hosting providers may process server logs; external links use third-party policies; independent fan project; information has no gameplay guarantee.

Run:

```bash
npm test -- tests/json-ld.test.tsx tests/legal-pages.test.tsx
```

Expected: FAIL because the serializer and pages do not exist.

- [ ] **Step 7: Implement safe JSON-LD, legal pages, and custom not-found page**

Create a server `JsonLd` component using `JSON.stringify(data).replace(/</g, '\\u003c')`. Render `WebSite` JSON-LD on the homepage and `Article` JSON-LD on guide detail pages with headline, description, URL, date modified, and site publisher name.

Create accessible English Privacy Policy and Terms pages containing only claims true for the launch implementation. Add real footer links to both pages and update footer copy to “independent fan guide” wording. Create a custom 404 page with links back to Guides and Items.

- [ ] **Step 8: Run SEO, legal, and build verification**

Run:

```bash
npm test -- tests/site-config.test.ts tests/seo.test.ts tests/json-ld.test.tsx tests/legal-pages.test.tsx
npm test
npm run typecheck
npm run build
```

Expected: all public routes build statically; `robots.txt`, `sitemap.xml`, manifest, social image, legal pages, and custom 404 are included.

- [ ] **Step 9: Commit the trust and discovery batch**

Run:

```bash
git add lib/site.ts lib/seo.ts components/json-ld.tsx components/site-footer.tsx app tests/site-config.test.ts tests/seo.test.ts tests/json-ld.test.tsx tests/legal-pages.test.tsx
git commit -m "feat: add production seo and trust pages"
```

---

## Task 4: Implement accessible mobile navigation and static global search

**Files:**

- Create: `lib/search.ts`
- Create: `components/site-search.tsx`
- Modify: `components/site-header.tsx`
- Modify: `components/item-browser.tsx`
- Modify: `app/layout.tsx`
- Modify: `app/globals.css`
- Create: `tests/search.test.ts`
- Create: `tests/site-header.test.tsx`
- Modify: `tests/item-browser.test.tsx`

- [ ] **Step 1: Write the failing search-domain tests**

Define expected `SearchEntry` fields as `title`, `description`, `keyword`, `category`, and `href`. Test that registry conversion includes all ten guides and three items, matching is case-insensitive across every text field, whitespace is normalized, an empty query returns the suggested entries, and an unmatched query returns an empty array.

Run:

```bash
npm test -- tests/search.test.ts
```

Expected: FAIL because the search domain does not exist.

- [ ] **Step 2: Implement the pure static search model**

Create `lib/search.ts` with serializable `SearchEntry` values, `createSearchEntries(guides, items)`, and `filterSearchEntries(entries, query)`. Map guide routes to `/guides/<slug>` and item routes to `/database/items/<slug>`; return a stable title-sorted result set with no network access.

- [ ] **Step 3: Write failing header interaction tests**

In `tests/site-header.test.tsx`, render the header with a small search fixture and assert:

- exactly one each of Home, Guides, Items, and Tools is in primary navigation;
- no language selector or duplicate Database link is present;
- the mobile menu button exposes `aria-expanded=false`, changes to `true` after click, and closes after a route link click;
- the Search button opens a labelled `role="dialog"` and focuses its search input;
- typing a matching term exposes the expected link and live result count;
- a miss renders a clear no-results message;
- Escape closes the dialog and restores focus to the Search button.

Run:

```bash
npm test -- tests/site-header.test.tsx
```

Expected: FAIL because the existing button has no behavior and mobile navigation is always hidden.

- [ ] **Step 4: Implement the header and search dialog**

Make `SiteHeader` a focused client component receiving `readonly SearchEntry[]`. Keep independent `menuOpen` and `searchOpen` state. Give the menu button an explicit label and `aria-expanded`; close it on link activation. Implement `SiteSearch` with a labelled search input, suggestion state for an empty query, result links, `aria-live="polite"` count/no-results status, input focus on open, Escape handling, and focus restoration on close.

In the server root layout, derive plain search entries from the guide and item registries and pass them to the header. Do not import MDX into a client bundle.

- [ ] **Step 5: Add accessibility and responsive CSS**

Update `app/layout.tsx` with a skip link before the header and `id="main-content"` on `<main>`. Update `app/globals.css` to provide:

- visible skip-link reveal on focus;
- consistent `:focus-visible` rings;
- desktop navigation and a hidden desktop menu toggle;
- at 760px, visible menu toggle and a full-width expandable navigation panel rather than `display:none` forever;
- fixed search overlay/dialog, wrapping result text, and a scrollable result list;
- `overflow-wrap:anywhere` for article/source URLs;
- no essential horizontal overflow at 390px;
- disabled smooth scrolling and non-essential transitions under `prefers-reduced-motion: reduce`.

Mark the item browser result count `aria-live="polite"` and render a clear empty result message.

- [ ] **Step 6: Run interaction and regression tests**

Run:

```bash
npm test -- tests/search.test.ts tests/site-header.test.tsx tests/item-browser.test.tsx
npm test
npm run lint
npm run typecheck
npm run build
```

Expected: all keyboard/search/menu behaviors pass and the production build remains static.

- [ ] **Step 7: Commit the interaction batch**

Run:

```bash
git add lib/search.ts components/site-search.tsx components/site-header.tsx components/item-browser.tsx app/layout.tsx app/globals.css tests/search.test.ts tests/site-header.test.tsx tests/item-browser.test.tsx
git commit -m "feat: add accessible navigation and search"
```

---

## Task 5: Complete the source-backed content and add original guide figures

**Files:**

- Modify: `lib/items.ts`
- Modify: `app/page.tsx`
- Modify: `app/guides/page.tsx`
- Modify: `app/database/items/page.tsx`
- Modify: `components/site-footer.tsx`
- Create: `components/guide-visuals.tsx`
- Modify: `mdx-components.tsx`
- Modify: `app/globals.css`
- Modify: all ten files under `content/guides/*.mdx`
- Modify: `tests/items.test.ts`
- Create: `tests/content-quality.test.ts`
- Create: `tests/guide-visuals.test.tsx`
- Modify: `tests/home.test.tsx`

- [ ] **Step 1: Write failing content-quality gates**

Create `tests/content-quality.test.ts` to scan launch-facing source under `app`, `components`, `lib`, and `content/guides`. Reject:

```text
暂无
待确认
To be confirmed
forthcoming
this project
project archive
before publishing
for publication
guide should
database field
```

Also assert every MDX file has exactly one H1, contains no raw YAML delimiter, and has no URL token long enough to force a mobile viewport when rendered as ordinary prose.

Run:

```bash
npm test -- tests/content-quality.test.ts
```

Expected: FAIL on the current Chinese temporary copy, repeated uncertainty wording, internal editorial instructions, and raw URL/frontmatter content.

- [ ] **Step 2: Write failing item-completeness tests**

Extend `tests/items.test.ts` so every item has a concrete summary and acquisition statement, at least one labelled HTTPS source, and no incomplete release wording. Assert specifically that Stone Loach identifies its guide-backed fishing conditions and Shovel identifies its guide-backed acquisition path.

Run:

```bash
npm test -- tests/items.test.ts
```

Expected: FAIL because Stone Loach and Shovel currently have empty source arrays and “forthcoming” acquisition copy.

- [ ] **Step 3: Complete item records from existing guide sources**

Use only facts and URLs already stored in the Stone Loach and Shovel guide sources. Replace their reserved-entry summaries and acquisition text with concise source-backed copy. Attach labelled HTTPS sources. Review Water Chestnuts copy against its guide and keep or tighten it without broadening the claim.

- [ ] **Step 4: Clean launch-facing copy without inventing facts**

Across all ten MDX files:

- remove internal notes about the project, publishing, archives, and database fields;
- replace repeated uncertainty paragraphs with one concise “Version note” only where a version-dependent fact genuinely needs qualification;
- use plain English for all visible text;
- leave uncertain specifics out rather than guessing;
- retain source-supported instructions and useful headings;
- keep one H1 and a logical heading order.

Update the homepage, guide index, item index, and footer to describe a curated, growing guide hub rather than a complete database. Replace the inactive community-code block with a useful link to current Guides or Items. Change “Aug 2024 Launched” to accurate early-access wording and avoid unsupported completeness claims.

- [ ] **Step 5: Write failing original-visual tests**

Create `tests/guide-visuals.test.tsx` and assert semantic headings/captions and accessible content for:

- `FarmLayoutFigure` with home, crops, animals, storage, and flexible expansion zones;
- `DeepWoodsFishTable` with source-backed fish-condition columns;
- `StoneLoachFacts` with source-backed location/season/time/weather rows;
- `OlricGiftGroups` with clearly separated preference groups;
- `WeddingOutfitCategories` with category cards and no copied images.

Expected: FAIL because these components do not exist.

- [ ] **Step 6: Implement and embed semantic guide figures**

Create `components/guide-visuals.tsx` using only `<figure>`, `<figcaption>`, lists, tables, and decorative CSS spans marked `aria-hidden="true"`. Register the five components in `mdx-components.tsx`, embed each into its corresponding source-backed guide, and style responsive tables/cards/field zones in `app/globals.css`.

Tables must scroll inside their own wrapper if needed; the document itself must stay within the viewport. Provide real captions and text equivalents so no fact depends on color or shape alone.

- [ ] **Step 7: Run content, visual, and full verification**

Run:

```bash
npm test -- tests/content-quality.test.ts tests/items.test.ts tests/guide-visuals.test.tsx tests/home.test.tsx
npm test
npm run lint
npm run typecheck
npm run build
```

Expected: all content gates pass, all three items are complete and sourced, all five original figures render, and every route builds.

- [ ] **Step 8: Commit the content-completion batch**

Run:

```bash
git add lib/items.ts app/page.tsx app/guides/page.tsx app/database/items/page.tsx components/site-footer.tsx components/guide-visuals.tsx mdx-components.tsx app/globals.css content/guides tests/items.test.ts tests/content-quality.test.ts tests/guide-visuals.test.tsx tests/home.test.tsx
git commit -m "content: complete launch guide experience"
```

---

## Task 6: Verify the production build in a real browser, review the diff, and publish

**Files:**

- Modify only files required by evidence from final verification.

- [ ] **Step 1: Run the complete automated release gate from a clean install**

Run:

```bash
npm ci
npm run lint
npm run typecheck
npm test
npm run build
npm audit --omit=dev
```

Expected: every command exits 0, all tests pass, all intended routes are static, and production dependencies report zero known vulnerabilities.

- [ ] **Step 2: Start and inspect the production server**

Run `npm start` against the completed build. At desktop and 390px widths, inspect the home page, guide index, a guide with a figure, item index, an item detail page, Privacy, Terms, and a missing route.

Verify:

- no horizontal document overflow;
- mobile Home/Guides/Items/Tools navigation opens, closes, and remains keyboard reachable;
- search suggestions, matches, no-results, Escape close, and focus restoration work;
- each page has one H1 and visible focus states;
- guide metadata exports do not appear in body text;
- source links wrap and open safely;
- figures/tables remain readable at 390px;
- no browser console errors or failed same-origin requests.

- [ ] **Step 3: Inspect live metadata and headers**

Use browser inspection and `curl -I` to confirm canonical, Open Graph, and Twitter tags on representative static and dynamic routes. Fetch `/robots.txt`, `/sitemap.xml`, `/manifest.webmanifest`, and `/opengraph-image` and confirm successful responses and the canonical domain.

Confirm responses omit `X-Powered-By` and include the tested CSP, nosniff, referrer, permissions, frame, and HSTS headers.

- [ ] **Step 4: Check internal links and finite-route behavior**

Crawl same-origin links from the generated pages or the running production site. Confirm every internal target returns success except the deliberate missing-route check, which must return the custom 404. Confirm unknown guide and item slugs do not generate static pages.

- [ ] **Step 5: Review the complete branch diff**

Run:

```bash
git status --short
git diff --check
git diff main...HEAD --stat
git log --oneline --decorate main..HEAD
```

Review every changed file for accidental secrets, unrelated edits, generated build output, unsafe external URLs, and remaining incomplete launch language. Run the complete automated gate again after any correction.

- [ ] **Step 6: Request code review and address only validated findings**

Use the code-review workflow against `main...agent/production-readiness`. For each finding, reproduce the issue or tie it to a concrete requirement before changing code. Apply corrections through a focused red-green cycle and rerun the full gate.

- [ ] **Step 7: Commit any verification corrections**

If final verification required changes, stage only those files and commit:

```bash
git commit -m "fix: close production verification gaps"
```

If no corrections were required, do not create an empty commit.

- [ ] **Step 8: Push the release branch**

Run:

```bash
git push -u origin agent/production-readiness
```

Expected: the remote branch is created or updated successfully. If connected GitHub tooling is available, open a Draft PR to `main` with the test/build/audit/browser evidence; otherwise report the pushed branch and the unavailable PR tooling without weakening the release verification.

- [ ] **Step 9: Report the production handoff**

Provide the pushed branch and commit IDs, the exact verification commands and outcomes, the browser/metadata/header findings, the production-audit result, and any deployment action that still belongs to the hosting provider. Do not claim the domain is deployed until the live host actually serves this build.
