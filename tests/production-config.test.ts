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
});
