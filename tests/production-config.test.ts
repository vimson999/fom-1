import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { describe, expect, it } from 'vitest';

type Header = { key: string; value: string };
type HeaderRule = { source: string; headers: Header[] };
type NextConfigUnderTest = {
  poweredByHeader?: boolean;
  headers?: () => Promise<HeaderRule[]>;
};

// @ts-expect-error next.config.mjs is a JavaScript config file without declarations.
import untypedNextConfig from '../next.config.mjs';

const nextConfig = untypedNextConfig as NextConfigUnderTest;

function contentSecurityPolicyFor(nodeEnvironment: 'development' | 'production') {
  const script = [
    "import config from './next.config.mjs';",
    'const rules = await config.headers();',
    "const header = rules.flatMap(({ headers }) => headers).find(({ key }) => key === 'Content-Security-Policy');",
    'process.stdout.write(header?.value ?? \'\');'
  ].join('\n');

  return execFileSync(process.execPath, ['--input-type=module', '--eval', script], {
    cwd: process.cwd(),
    encoding: 'utf8',
    env: { ...process.env, NODE_ENV: nodeEnvironment }
  });
}

describe('production configuration', () => {
  it('applies secure response headers to every route', async () => {
    const headersConfig = await nextConfig.headers?.();
    const globalHeaders = headersConfig?.find(({ source }) => source === '/:path*');
    const headers = Object.fromEntries(
      globalHeaders?.headers.map(({ key, value }) => [key.toLowerCase(), value]) ?? []
    );

    expect(nextConfig.poweredByHeader).toBe(false);
    expect(headers['content-security-policy']).toContain("default-src 'self'");
    expect(headers['content-security-policy']).toContain("frame-ancestors 'none'");
    expect(headers['x-content-type-options']).toBe('nosniff');
    expect(headers['referrer-policy']).toBe('strict-origin-when-cross-origin');
    expect(headers['permissions-policy']).toContain('camera=()');
    expect(headers['x-frame-options']).toBe('DENY');
    expect(headers['strict-transport-security']).toContain('max-age=63072000');
  });

  it('allows React debugging eval in development without weakening production CSP', () => {
    const developmentPolicy = contentSecurityPolicyFor('development');
    const productionPolicy = contentSecurityPolicyFor('production');

    for (const policy of [developmentPolicy, productionPolicy]) {
      expect(policy).toContain('https://www.googletagmanager.com');
      expect(policy).toContain('https://*.google-analytics.com');
      expect(policy).toContain('https://*.analytics.google.com');
      expect(policy).toContain('https://pagead2.googlesyndication.com');
      expect(policy).toContain('https://*.googlesyndication.com');
      expect(policy).toContain('https://*.doubleclick.net');
      expect(policy).toContain("frame-src 'self' https://googleads.g.doubleclick.net https://*.googlesyndication.com");
    }

    expect(developmentPolicy).toContain(
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'"
    );
    expect(productionPolicy).toContain("script-src 'self' 'unsafe-inline'");
    expect(productionPolicy).not.toContain("'unsafe-eval'");
  });

  it('fails CI for any known production dependency advisory', () => {
    const workflow = fs.readFileSync(
      path.join(process.cwd(), '.github/workflows/ci.yml'),
      'utf8'
    );
    const runCommands = [...workflow.matchAll(/^\s*-\s+run:\s*(.+)$/gm)].map((match) =>
      match[1].trim()
    );

    expect(runCommands.filter((command) => command.startsWith('npm audit'))).toEqual([
      'npm audit --omit=dev'
    ]);
  });
});
