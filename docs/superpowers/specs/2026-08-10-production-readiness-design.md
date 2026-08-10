# Fields of Mistria Wiki Production Readiness Design

## Objective

Bring the existing Fields of Mistria fan wiki to a deployable production standard at `https://fieldsofmistria.land`. The work fixes all launch blockers identified in the 2026-08-10 audit while preserving the current warm ivory, forest green, and gold visual identity and the source-traceability rules in `AI_PROJECT_CONTEXT.md`.

## Chosen Approach

Upgrade the current Next.js application in place instead of applying a narrow patch or rebuilding around a CMS. The site remains a small, statically generated, repository-authored wiki. This keeps the runtime attack surface and hosting requirements small while making metadata, navigation, content, testing, and deployment behavior explicit.

## Technical Baseline

- Upgrade Next.js and `@next/mdx` to `16.3.0`, the audited fixed release, and pin React and React DOM to `19.2.8`.
- Keep TypeScript strict mode, App Router, static generation, and repository-controlled MDX.
- Add ESLint as an explicit command and run it independently of `next build`.
- Use the committed lockfile and `npm ci` in CI.
- Treat every MDX change as executable source requiring code review; the project will not ingest remote or user-authored MDX.

## Content Metadata Architecture

Each guide exports a typed `metadata` object from MDX rather than YAML frontmatter. The object contains:

- `slug`
- `title`
- `description`
- `keyword`
- `updated`
- `sources`, as labelled HTTPS links

`lib/guides.tsx` imports each component and its exported metadata, producing one registry used by the guide index, static route generation, page metadata, global search, sitemap generation, source rendering, and related links. This removes the current duplicated and inconsistent metadata in `lib/guides.tsx`.

Guide pages render their source list as real links after the article. Metadata exports never appear in article body text. Long URLs must wrap safely on narrow screens.

## SEO and Domain Behavior

`https://fieldsofmistria.land` is the canonical production origin. A single site configuration exports the validated origin and helpers for absolute URLs.

The root layout and route metadata will provide:

- concise, unique English titles;
- descriptions derived from the guide metadata;
- canonical URLs;
- Open Graph and Twitter metadata;
- a programmatically generated original social-sharing image;
- `WebSite` structured data on the home page and `Article` structured data on guides;
- favicon, Apple icon, manifest, and theme colors.

Next.js metadata routes generate `robots.txt` and `sitemap.xml` from the same guide and item registries. The sitemap includes the home page, guide index, all ten guides, item index, three item detail pages, Privacy Policy, and Terms of Service.

## Navigation and Search

The shared header becomes a focused client component with two independent accessible controls:

1. A mobile menu button that expands and collapses the primary navigation below the 760px breakpoint. It exposes `aria-expanded`, closes after route selection, and supports keyboard interaction.
2. A global search dialog that searches the static guide and item registry by title, keyword, description, name, and category. Results link directly to the matching route. The dialog has a labelled input, empty state, result count, Escape handling, focus restoration, and no network dependency.

Desktop navigation remains visible. Mobile users always retain access to Home, Guides, Items, and the homepage tools section. Redundant Database and Items links are consolidated.

## Accessibility and Responsive Layout

- Add a skip-to-content link and a stable `id` on the main content region.
- Add visible `:focus-visible` treatment to links, buttons, inputs, and selects.
- Respect `prefers-reduced-motion` for smooth scrolling and hover transitions.
- Give interactive search/filter status an `aria-live` region.
- Ensure all long text and URLs wrap within the viewport.
- Preserve one-column layouts at mobile widths without hiding essential navigation.
- Retain one clear H1 per page and semantic headings below it.

## Content and Visual Cleanup

The release must describe the actual first-launch scope honestly:

- Replace claims of a complete database with source-backed guide hub or featured-item wording.
- Replace Chinese placeholders with English copy.
- Remove internal editorial instructions such as references to this project, publishing decisions, or filling database fields.
- Consolidate repeated `To be confirmed` language into a concise version note where uncertainty is material; do not invent missing game facts.
- Complete the Stone Loach and Shovel item records from their existing source-backed guides and attach labelled sources.
- Keep the Water Chestnuts record and verify its wording against the stored guide.
- Add original HTML/CSS figures and structured tables where the stored facts support them, including a farm-zoning diagram, fish condition tables, Olric gift groups, and wedding-outfit category cards.
- Do not copy third-party screenshots, official game artwork, or competitor assets.

The homepage keeps its existing visual direction but uses honest calls to action and removes inactive language controls until translations exist. The social image is generated from original typography and geometric farm motifs, not game artwork.

## Legal and Trust Pages

Add English Privacy Policy and Terms of Service routes. They describe the implemented site accurately:

- no accounts, payments, comments, or user uploads;
- no first-party analytics, advertising cookies, or newsletter collection at launch;
- normal server logs may be processed by the hosting provider;
- external links are governed by third-party policies;
- game names and trademarks belong to their respective owners;
- the site is an independent fan project and provides information without gameplay guarantees.

If analytics, advertising, accounts, or data collection are added later, the Privacy Policy must be revised before those features are enabled.

## Security and Production Configuration

- Disable `X-Powered-By`.
- Configure `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, frame protection, and a CSP compatible with the statically generated Next.js application.
- Keep external URLs HTTPS-only and apply `noopener noreferrer` to new-tab links.
- Reject unknown guide and item slugs with the existing 404 path and make the finite static route set explicit.
- Expand `.gitignore` to cover TypeScript build info and Next.js environment-file patterns while retaining a safe `.env.example` if configuration is introduced.
- Re-run the production dependency audit after the framework upgrade; the release gate is zero known production vulnerabilities or a written, source-backed exception for an unreachable advisory.

## Error Handling

- Unknown dynamic slugs render the 404 page.
- Empty global-search queries show suggested sections instead of an empty blank panel.
- Search queries with no matches render a clear no-results state.
- Metadata generation uses registry data only; a missing registry entry returns empty metadata only on the 404 path.
- The production origin is validated as an HTTPS URL during module initialization so an invalid domain fails tests and the build rather than emitting broken canonical links.

## Testing and Verification

Behavior changes follow red-green-refactor cycles. Automated coverage will include:

- MDX metadata does not render in guide body output;
- guide metadata descriptions and canonical URLs come from the shared registry;
- global search returns matching guides and items and has a no-results state;
- mobile navigation exposes its expanded state and route links;
- item records contain completed acquisition copy and sources;
- sitemap and robots routes contain the production origin and complete route set;
- Privacy Policy and Terms routes render their required headings;
- content-validation tests reject Chinese placeholders, raw YAML frontmatter, internal editorial phrases, overlong titles, short descriptions, non-HTTPS sources, and missing source labels;
- existing item filtering and 404 behavior remain intact.

Release verification runs:

1. `npm run lint`
2. `npm run typecheck`
3. `npm test`
4. `npm run build`
5. `npm audit --omit=dev`
6. production-mode browser smoke tests at desktop and 390px mobile widths
7. inspection of canonical, Open Graph, sitemap, robots, security headers, internal links, and console errors
8. `git status --short` to confirm only intended files are committed

## Delivery

Implementation occurs on `agent/production-readiness`. The final diff is committed intentionally, pushed to `origin`, and prepared as a Draft PR targeting `main` when GitHub tooling is available. Direct changes to `main` are not required.
