import type { Metadata } from 'next';
import Link from 'next/link';
import { createPageMetadata } from '@/lib/seo';

export const metadata: Metadata = createPageMetadata({
  title: 'Privacy Policy — Fields of Mistria Guide',
  description: 'Privacy information for the independent Fields of Mistria fan guide.',
  path: '/privacy'
});

export default function PrivacyPage() {
  return (
    <article className="shell detail-page">
      <header className="detail-hero">
        <p className="eyebrow">Site policy</p>
        <h1>Privacy Policy</h1>
        <p>How this independent fan guide handles information at launch.</p>
      </header>
      <div className="legal-copy">
        <section>
          <h2>Information this site does not collect</h2>
          <p>This site provides no accounts, payments, comments, or uploads. It has no advertising and performs no newsletter collection.</p>
        </section>
        <section>
          <h2>Google Analytics</h2>
          <p>We use Google Analytics to understand page activity and improve this guide. Google Analytics may process visited pages, referrer information, browser and device details, approximate location, and identifiers or cookies used to distinguish visits.</p>
          <p>Google processes this analytics data under its own privacy policies. No advertising cookies are used, and advertising personalization is not enabled on this site.</p>
        </section>
        <section>
          <h2>Technical hosting data</h2>
          <p>Our hosting provider may process standard server logs, such as an IP address, browser details, requested pages, timestamps, and security events. That processing is controlled by the hosting provider and its own policies.</p>
        </section>
        <section>
          <h2>External links</h2>
          <p>External links lead to services operated by third parties. Their privacy policies, not this policy, govern information they receive.</p>
        </section>
        <section>
          <h2>Changes</h2>
          <p>This policy will be updated if advertising, accounts, newsletters, or other collection features are enabled.</p>
          <p>Questions about these terms can be reviewed alongside the <Link className="text-link" href="/terms">Terms of Service</Link>.</p>
        </section>
      </div>
    </article>
  );
}
