import type { Metadata } from 'next';
import Link from 'next/link';
import { createPageMetadata } from '@/lib/seo';

export const metadata: Metadata = createPageMetadata({
  title: 'Terms of Service — Fields of Mistria Guide',
  description: 'Terms for using the independent Fields of Mistria fan guide.',
  path: '/terms'
});

export default function TermsPage() {
  return (
    <article className="shell detail-page">
      <header className="detail-hero">
        <p className="eyebrow">Site terms</p>
        <h1>Terms of Service</h1>
        <p>The conditions for using this source-based fan guide.</p>
      </header>
      <div className="legal-copy">
        <section>
          <h2>Independent fan project</h2>
          <p>This is an independent fan guide and is not affiliated with, endorsed by, or sponsored by NPC Studio or the game’s publishers. Fields of Mistria names and trademarks belong to their respective owners.</p>
        </section>
        <section>
          <h2>Informational use</h2>
          <p>Guide information can become incomplete or outdated as the game changes. We make no guarantee that information is error-free or will produce a particular gameplay result. Confirm version-sensitive details in the game or through current official sources.</p>
        </section>
        <section>
          <h2>External services</h2>
          <p>External links lead to third parties whose own terms and policies govern those services. We do not control their content, availability, or data practices.</p>
        </section>
        <section>
          <h2>Acceptable use</h2>
          <p>You may use this site for lawful personal reference. Do not interfere with the site, attempt unauthorized access, or misuse its content to harm others.</p>
          <p>For information-handling details, read the <Link className="text-link" href="/privacy">Privacy Policy</Link>.</p>
        </section>
      </div>
    </article>
  );
}
