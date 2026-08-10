import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import PrivacyPage from '@/app/privacy/page';
import TermsPage from '@/app/terms/page';
import NotFound from '@/app/not-found';
import { SiteFooter } from '@/components/site-footer';

afterEach(cleanup);

describe('launch legal pages', () => {
  it('describes the implemented privacy behavior without promising away host processing', () => {
    render(<PrivacyPage />);

    expect(screen.getByRole('heading', { level: 1, name: 'Privacy Policy' })).toBeInTheDocument();
    expect(document.body).toHaveTextContent(/no accounts, payments, comments, or uploads/i);
    expect(document.body).toHaveTextContent(/no first-party analytics/i);
    expect(document.body).toHaveTextContent(/no advertising cookies/i);
    expect(document.body).toHaveTextContent(/no newsletter/i);
    expect(document.body).toHaveTextContent(/hosting provider.*server logs/i);
    expect(document.body).toHaveTextContent(/external links.*third part(?:y|ies).*privacy policies/i);
  });

  it('states the independent fan-project scope and provides no gameplay guarantee', () => {
    render(<TermsPage />);

    expect(screen.getByRole('heading', { level: 1, name: 'Terms of Service' })).toBeInTheDocument();
    expect(document.body).toHaveTextContent(/independent fan (?:site|project|guide)/i);
    expect(document.body).toHaveTextContent(/not affiliated with.*NPC Studio/i);
    expect(document.body).toHaveTextContent(/no guarantee.*gameplay/i);
    expect(document.body).toHaveTextContent(/external links.*third part(?:y|ies).*terms.*policies/i);
  });

  it('links both policies from the independent fan-guide footer', () => {
    render(<SiteFooter />);

    expect(screen.getByRole('link', { name: 'Privacy Policy' })).toHaveAttribute('href', '/privacy');
    expect(screen.getByRole('link', { name: 'Terms of Service' })).toHaveAttribute('href', '/terms');
    expect(document.body).toHaveTextContent(/independent fan guide/i);
  });

  it('offers useful recovery links on the custom not-found page', () => {
    render(<NotFound />);

    expect(screen.getByRole('heading', { level: 1, name: /page not found/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /browse guides/i })).toHaveAttribute('href', '/guides');
    expect(screen.getByRole('link', { name: /browse items/i })).toHaveAttribute('href', '/database/items');
  });
});
