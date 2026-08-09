import type { Metadata } from 'next';
import './globals.css';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { site } from '@/lib/site';

export const metadata: Metadata = {
  title: { default: 'Fields of Mistria Wiki — Guides, Gift Lists & Map Tips', template: '%s | Fields of Mistria Wiki' },
  description: site.description,
  keywords: site.keywords,
  icons: { icon: '/favicon.ico', apple: '/apple-touch-icon.png' }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body><SiteHeader /><main>{children}</main><SiteFooter /></body></html>;
}
