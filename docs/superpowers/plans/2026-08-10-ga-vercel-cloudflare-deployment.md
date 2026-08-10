# GA4, Vercel, and Cloudflare Production Deployment Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship the production-ready Fields of Mistria site with GA4 to Vercel, connect the GitHub repository, and route `fieldsofmistria.land` through Cloudflare-managed DNS.

**Architecture:** The Next.js App Router root layout owns exactly one framework-supported GA4 component. GitHub `main` remains Vercel's production branch; a preview deployment is verified before the release branch is merged and promoted. Cloudflare remains authoritative DNS and receives only the exact apex, `www`, and verification records returned by Vercel.

**Tech Stack:** Next.js 16.3.0, React 19.2.8, `@next/third-parties` 16.3.0, Vitest, GitHub, Vercel CLI 58.9.0, Cloudflare DNS.

## Global Constraints

- Production domain: `https://fieldsofmistria.land`.
- GA4 measurement ID: `G-J5CTEBXCRF`.
- GitHub repository: `vimson999/fom-1`; production branch: `main`.
- Release source begins at `cfd1a87` on `agent/ga-vercel-deployment`.
- Render the Google tag exactly once from the root layout; do not paste raw scripts into individual pages.
- Rely on GA4 Enhanced Measurement for History API route changes; do not send manual duplicate page views.
- Keep the site functional when analytics is blocked.
- Production CSP must not contain `unsafe-eval`.
- Do not commit Vercel tokens, Cloudflare tokens, `.vercel/`, `.env*`, or the primary worktree's generated `next-env.d.ts` change.
- Preserve unrelated Cloudflare DNS records. Replace only conflicting apex/`www` web records after recording their prior values.
- Steps 1–6 are authorized. Google Analytics and Search Console account inspection is outside this execution and requires a later authorization.

---

### Task 1: Add one GA4 integration with privacy and CSP coverage

**Files:**
- Create: `lib/analytics.ts`
- Create: `tests/google-analytics.test.tsx`
- Modify: `package.json`
- Modify: `package-lock.json`
- Modify: `app/layout.tsx`
- Modify: `next.config.mjs`
- Modify: `app/privacy/page.tsx`
- Modify: `tests/production-config.test.ts`
- Modify: `tests/legal-pages.test.tsx`

**Interfaces:**
- Produces: `GOOGLE_ANALYTICS_ID: 'G-J5CTEBXCRF'` from `lib/analytics.ts`.
- Consumes: `GoogleAnalytics({ gaId })` from `@next/third-parties/google` in the root layout.
- Produces: CSP directives permitting only the GA4 hosts named in the approved design.

- [ ] **Step 1: Install the exact framework-aligned integration package**

Run:

```bash
npm install --save-exact @next/third-parties@16.3.0
```

Expected: `package.json` and `package-lock.json` add `@next/third-parties` 16.3.0.

- [ ] **Step 2: Write the failing root-layout GA test**

Create `tests/google-analytics.test.tsx`:

```tsx
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';

vi.mock('@next/third-parties/google', () => ({
  GoogleAnalytics: ({ gaId }: { gaId: string }) => <i data-ga-id={gaId} />
}));

import RootLayout from '@/app/layout';

describe('Google Analytics integration', () => {
  it('renders the configured GA4 tag exactly once from the root layout', () => {
    const html = renderToStaticMarkup(
      <RootLayout><p>Route content</p></RootLayout>
    );

    expect(html.match(/data-ga-id="G-J5CTEBXCRF"/g) ?? []).toHaveLength(1);
  });
});
```

- [ ] **Step 3: Extend CSP and privacy tests before implementation**

Add these assertions to the CSP test in `tests/production-config.test.ts`:

```ts
for (const policy of [developmentPolicy, productionPolicy]) {
  expect(policy).toContain('https://www.googletagmanager.com');
  expect(policy).toContain('https://*.google-analytics.com');
  expect(policy).toContain('https://*.analytics.google.com');
}
```

These assertions cover the approved directives:

```text
script-src: https://www.googletagmanager.com
img-src: https://*.google-analytics.com https://www.googletagmanager.com
connect-src: https://*.google-analytics.com https://*.analytics.google.com https://www.googletagmanager.com
```

Replace the “no first-party analytics” assertion in `tests/legal-pages.test.tsx` with:

```ts
expect(document.body).toHaveTextContent(/Google Analytics/i);
expect(document.body).toHaveTextContent(/page activity/i);
expect(document.body).toHaveTextContent(/referrer/i);
expect(document.body).toHaveTextContent(/browser and device/i);
expect(document.body).toHaveTextContent(/approximate location/i);
expect(document.body).toHaveTextContent(/Google.*process/i);
expect(document.body).toHaveTextContent(/no advertising cookies/i);
expect(document.body).not.toHaveTextContent(/no first-party analytics/i);
```

- [ ] **Step 4: Run the focused tests and verify RED**

Run:

```bash
npx vitest run tests/google-analytics.test.tsx tests/production-config.test.ts tests/legal-pages.test.tsx
```

Expected: failures identify the absent analytics module, GA CSP hosts, and updated disclosure.

- [ ] **Step 5: Implement the minimal GA integration**

Create `lib/analytics.ts`:

```ts
export const GOOGLE_ANALYTICS_ID = 'G-J5CTEBXCRF' as const;
```

Add these imports to `app/layout.tsx`:

```ts
import { GoogleAnalytics } from '@next/third-parties/google';
import { GOOGLE_ANALYTICS_ID } from '@/lib/analytics';
```

Return the root document with one analytics component:

```tsx
return (
  <html lang="en">
    <body>
      <a className="skip-link" href="#main-content">Skip to main content</a>
      <SiteHeader searchEntries={searchEntries} />
      <main id="main-content">{children}</main>
      <SiteFooter />
    </body>
    <GoogleAnalytics gaId={GOOGLE_ANALYTICS_ID} />
  </html>
);
```

Replace the CSP value in `next.config.mjs` with:

```js
`default-src 'self'; base-uri 'self'; object-src 'none'; frame-ancestors 'none'; form-action 'self'; img-src 'self' data: https: https://*.google-analytics.com https://www.googletagmanager.com; font-src 'self' data:; style-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-inline' https://www.googletagmanager.com${process.env.NODE_ENV === 'development' ? " 'unsafe-eval'" : ''}; connect-src 'self' ws: wss: https://*.google-analytics.com https://*.analytics.google.com https://www.googletagmanager.com; upgrade-insecure-requests`
```

Replace the first privacy section and add an analytics section with this copy:

```tsx
<section>
  <h2>Information this site does not collect</h2>
  <p>This site provides no accounts, payments, comments, uploads, advertising, or newsletter collection.</p>
</section>
<section>
  <h2>Google Analytics</h2>
  <p>We use Google Analytics to understand page activity and improve this guide. Google Analytics may process visited pages, referrer information, browser and device details, approximate location, and identifiers or cookies used to distinguish visits.</p>
  <p>Google processes this analytics data under its own privacy policies. We do not use advertising cookies or enable advertising personalization on this site.</p>
</section>
```

Replace the Changes section's first paragraph with:

```tsx
<p>This policy will be updated if advertising, accounts, newsletters, or other collection features are enabled.</p>
```

- [ ] **Step 6: Run the focused tests and verify GREEN**

Run:

```bash
npx vitest run tests/google-analytics.test.tsx tests/production-config.test.ts tests/legal-pages.test.tsx
```

Expected: all focused tests pass.

- [ ] **Step 7: Commit the feature**

Run:

```bash
git add package.json package-lock.json lib/analytics.ts app/layout.tsx next.config.mjs app/privacy/page.tsx tests/google-analytics.test.tsx tests/production-config.test.ts tests/legal-pages.test.tsx
git commit -m "feat: add Google Analytics tracking"
```

### Task 2: Verify, publish, and merge the release source

**Files:**
- Modify: `docs/superpowers/plans/2026-08-10-ga-vercel-cloudflare-deployment.md` only when recording execution evidence.

**Interfaces:**
- Consumes: the complete production tree on `agent/ga-vercel-deployment`.
- Produces: GitHub `main` containing the verified release commit.

- [ ] **Step 1: Run the full local gate**

Run each command and require exit code 0:

```bash
npm test
npm run lint
npm run typecheck
npm run build
npm audit --omit=dev
git diff --check
```

- [ ] **Step 2: Confirm release scope**

Run:

```bash
git status --short
git diff main...HEAD --stat
git log --oneline main..HEAD
```

Expected: no generated secrets or `.vercel/` data; only intended production-readiness, GA, documentation, and test changes.

- [ ] **Step 3: Push the release branch**

Run:

```bash
git push -u origin agent/ga-vercel-deployment
```

- [ ] **Step 4: Create and merge a GitHub pull request**

Create a PR from `agent/ga-vercel-deployment` to `main`, wait for required GitHub checks, and merge only after all required checks succeed. Verify the remote `main` SHA equals the merged release SHA.

### Task 3: Link GitHub and create a verified Vercel preview

**Files:**
- Generated locally but never committed: `.vercel/project.json`

**Interfaces:**
- Consumes: GitHub repository `vimson999/fom-1` and Vercel project `fields-of-mistria-guide`.
- Produces: a READY preview deployment linked to the exact release commit.

- [ ] **Step 1: Authenticate the pinned Vercel CLI**

Run:

```bash
npx vercel@58.9.0 login
npx vercel@58.9.0 whoami
```

Complete the official browser authorization and record the selected personal/team scope.

- [ ] **Step 2: Link or create the project**

Run:

```bash
npx vercel@58.9.0 link --yes --project fields-of-mistria-guide
npx vercel@58.9.0 git connect https://github.com/vimson999/fom-1.git
```

Verify `.vercel/project.json` contains the expected project and organization IDs and remains ignored.

- [ ] **Step 3: Create a preview deployment**

Run:

```bash
npx vercel@58.9.0 deploy --yes
```

Record the exact preview URL printed by the command.

- [ ] **Step 4: Inspect and smoke-test the preview**

Copy the literal preview URL printed by Step 3 into the task-specific shell variable `FOM_PREVIEW_URL`, then run `npx vercel@58.9.0 inspect "$FOM_PREVIEW_URL"` and request `/`, `/guides`, `/database/items`, `/privacy`, `/robots.txt`, `/sitemap.xml`, and `/manifest.webmanifest`. Require successful HTTP responses, one H1 per content page, correct canonical URLs, the expected security headers, and no blocking console errors.

### Task 4: Promote the verified `main` release to Vercel production

**Files:**
- None.

**Interfaces:**
- Consumes: verified preview artifact and merged GitHub `main` SHA.
- Produces: READY production deployment for the same release SHA.

- [ ] **Step 1: Confirm Vercel production branch is `main`**

Inspect the linked project Git settings. Change the production branch only if it is not `main`.

- [ ] **Step 2: Promote the verified artifact**

Run:

```bash
npx vercel@58.9.0 promote "$FOM_PREVIEW_URL"
```

If Vercel has already created the identical production deployment from the merged `main`, inspect that deployment instead of rebuilding.

- [ ] **Step 3: Verify production state**

Use `vercel inspect`, `vercel ls`, and production logs to confirm status `READY`, the expected Git SHA, Next.js detection, and no new error-level runtime events.

### Task 5: Add the custom domains and configure Cloudflare DNS

**Files:**
- None.

**Interfaces:**
- Consumes: Vercel project `fields-of-mistria-guide` and Cloudflare zone `fieldsofmistria.land`.
- Produces: verified apex and `www` hostnames with Vercel-managed origin certificates.

- [ ] **Step 1: Add both hostnames to Vercel**

Run:

```bash
npx vercel@58.9.0 domains add fieldsofmistria.land fields-of-mistria-guide
npx vercel@58.9.0 domains add www.fieldsofmistria.land fields-of-mistria-guide
npx vercel@58.9.0 domains inspect fieldsofmistria.land
npx vercel@58.9.0 domains inspect www.fieldsofmistria.land
```

Use the exact A, CNAME, and TXT values returned by Vercel; do not substitute generic values when project-specific targets are supplied.

- [ ] **Step 2: Record current Cloudflare DNS state**

In the Cloudflare dashboard, capture the existing apex, `www`, MX, TXT, CAA, and nameserver records. Preserve email, verification, and unrelated subdomain records.

- [ ] **Step 3: Apply only Vercel-required Cloudflare records**

Replace conflicting apex/`www` web records with the exact Vercel targets. Add any Vercel ownership TXT records. Keep validation records DNS-only. Begin apex and `www` as DNS-only until Vercel reports valid configuration and issues certificates.

- [ ] **Step 4: Verify Vercel ownership and TLS**

Repeat both `vercel domains inspect` commands and `vercel certs ls` until both hostnames are valid and HTTPS succeeds without certificate errors.

- [ ] **Step 5: Enable Cloudflare proxy only after origin verification**

If Cloudflare proxying is required for the zone, enable it for the apex and `www` web records only after Vercel validation succeeds, use SSL/TLS Full (strict), and immediately re-test redirects, HTTPS, CSP, canonical URLs, and cache behavior. Leave the records DNS-only if proxying changes host validation or response correctness.

### Task 6: Run production acceptance checks

**Files:**
- None.

**Interfaces:**
- Consumes: live `https://fieldsofmistria.land` and `https://www.fieldsofmistria.land`.
- Produces: evidence that DNS, TLS, redirects, application routes, metadata, GA markup, and headers are production-ready.

- [ ] **Step 1: Verify DNS and redirects**

Run `dig` for apex and `www`, then request both HTTPS hostnames. Require one canonical host, no redirect loop, valid TLS, and final HTTP 200.

- [ ] **Step 2: Verify the public route matrix**

Request all sitemap routes and linked internal assets. Require expected 200 responses and custom 404 behavior for unknown routes.

- [ ] **Step 3: Verify production headers and metadata**

Confirm CSP permits the approved GA endpoints, excludes production `unsafe-eval`, and retains HSTS, `nosniff`, referrer, permissions, frame, canonical, Open Graph, Twitter, robots, sitemap, and manifest behavior.

- [ ] **Step 4: Verify GA markup without entering Google accounts**

In a clean browser, confirm exactly one Google tag for `G-J5CTEBXCRF`, no duplicate page-view dispatch from application code, and no application-blocking CSP or hydration error. Account-side Realtime confirmation remains step 7 and is not authorized in this plan execution.

- [ ] **Step 5: Record final deployment evidence**

Report the Vercel production URL, project, deployment status, Git SHA, framework, custom-domain status, Cloudflare DNS/proxy mode, TLS result, route-check result, error-log result, and any remaining propagation delay.
