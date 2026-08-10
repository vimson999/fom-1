import type { Metadata } from 'next';
import { GoogleAnalytics } from '@next/third-parties/google';
import './globals.css';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { guides } from '@/lib/guides';
import { items } from '@/lib/items';
import { createSearchEntries } from '@/lib/search';
import { absoluteUrl, site, SITE_ORIGIN } from '@/lib/site';
import { GOOGLE_ANALYTICS_ID } from '@/lib/analytics';

export const metadata: Metadata = {
  metadataBase: SITE_ORIGIN,
  applicationName: site.name,
  title: { default: 'Fields of Mistria Guide — Source-Based Fan Guides', template: `%s | ${site.name}` },
  description: site.description,
  keywords: site.keywords,
  manifest: '/manifest.webmanifest',
  icons: { icon: '/favicon.ico', apple: '/apple-touch-icon.png' },
  openGraph: {
    type: 'website',
    siteName: site.name,
    title: 'Fields of Mistria Guide — Source-Based Fan Guides',
    description: site.description,
    images: [{ url: absoluteUrl('/opengraph-image'), width: 1200, height: 630 }]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Fields of Mistria Guide — Source-Based Fan Guides',
    description: site.description,
    images: [absoluteUrl('/opengraph-image')]
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const searchEntries = createSearchEntries(guides, items);

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
}
