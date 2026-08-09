import type { Metadata } from 'next';
import './globals.css';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';

export const metadata: Metadata = {
  title: { default: 'Fields of Mistria Wiki — Guides, Romance & Farm Layouts', template: '%s | Fields of Mistria Wiki' },
  description: 'Your English Fields of Mistria guide for romance, gifts, fish locations, farm layouts and beginner tips.'
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body><SiteHeader /><main>{children}</main><SiteFooter /></body></html>;
}
