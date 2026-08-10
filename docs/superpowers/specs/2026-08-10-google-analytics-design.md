# Google Analytics 4 integration design

Date: 2026-08-10
Status: Approved for specification review
Measurement ID: `G-J5CTEBXCRF`

## Goal

Add Google Analytics 4 measurement to every route of `fieldsofmistria.land` exactly once. Tracking starts when the global Google tag loads; there is no consent gate or cookie banner in this scope.

## Chosen approach

Use the Next.js-supported `GoogleAnalytics` component from `@next/third-parties/google` in the App Router root layout. The component receives `G-J5CTEBXCRF` and is rendered once alongside the root document, so individual pages do not duplicate the Google tag.

This approach intentionally replaces a literal copy of the raw `<script>` snippet with the framework-supported equivalent. It loads the same Google tag after hydration, preserves the site's static rendering model, and keeps third-party loading isolated from page content.

## Runtime behavior

1. The root layout renders the Google Analytics component once for every route.
2. The component loads `gtag.js` asynchronously from Google Tag Manager.
3. The tag initializes `dataLayer` and configures the supplied measurement ID.
4. The initial `config` call records the initial page view.
5. Client-side route changes rely on GA4 Enhanced Measurement with “Page changes based on browser history events” enabled. The application will not send additional manual page-view events, preventing duplicate counts.
6. If Google is unavailable or blocked by a browser extension, the site remains fully usable; analytics loss must not block rendering or navigation.

## Configuration boundary

The measurement ID is a public identifier, not a secret. It will be centralized in application code rather than duplicated across pages.

The Content Security Policy will allow only the non-advertising GA4 endpoints required for this integration:

- `script-src`: `https://www.googletagmanager.com`
- `img-src`: `https://*.google-analytics.com` and `https://www.googletagmanager.com`
- `connect-src`: `https://*.google-analytics.com`, `https://*.analytics.google.com`, and `https://www.googletagmanager.com`

Advertising, DoubleClick, Google Ads, and iframe endpoints are outside scope and will not be added. Existing development-only `unsafe-eval` behavior remains environment-scoped, and production remains without `unsafe-eval`.

## Privacy disclosure

The Privacy Policy currently states that the site uses no analytics. That statement must change before analytics ships.

The updated policy will:

- retain the statement that the site has no accounts, payments, comments, uploads, advertising, or newsletter collection;
- disclose immediate use of Google Analytics;
- describe analytics data in plain language, including page activity, referrer, browser/device information, approximate location, and identifiers or cookies used by Google Analytics;
- explain that Google processes the analytics data under its own policies;
- avoid claiming that the site sets no cookies at all;
- retain the hosting-log and external-link disclosures.

This is a product disclosure, not a representation that immediate tracking satisfies every regional legal requirement. Consent management is explicitly outside this implementation because the user chose immediate loading.

## Testing and verification

Implementation follows RED→GREEN TDD and adds behavior-level coverage for:

- the root layout including the expected GA4 measurement ID exactly once;
- the development and production CSPs allowing the required GA4 endpoints while production continues to exclude `unsafe-eval`;
- the Privacy Policy disclosing Google Analytics and no longer claiming that analytics is absent;
- the complete site build retaining all 24 static routes.

Final verification includes the full test suite, lint, typecheck, production build, production dependency audit, whitespace/diff checks, and a clean-browser inspection that confirms one Google tag instance and no application-blocking CSP error. A live analytics hit should additionally be confirmed after deployment with Google Tag Assistant or the GA4 Realtime report because local or automated browsers may block external analytics requests.

## Out of scope

- consent banner or Consent Mode UI;
- Google Tag Manager containers;
- Google Ads, remarketing, Google Signals, or advertising personalization;
- custom events, conversions, ecommerce, user IDs, or manual page views;
- server-side tagging;
- suppressing unrelated hydration warnings caused by browser extensions.

## Sources

- Next.js third-party library guide: https://nextjs.org/docs/app/guides/third-party-libraries
- Google tag setup: https://developers.google.com/tag-platform/gtagjs
- Google CSP requirements: https://developers.google.com/tag-platform/security/guides/csp
- GA4 Enhanced Measurement: https://support.google.com/analytics/answer/9216061
