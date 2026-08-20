import createMDX from '@next/mdx';

export const securityHeaders = [
  {
    key: 'Content-Security-Policy',
    value:
      `default-src 'self'; base-uri 'self'; object-src 'none'; frame-ancestors 'none'; form-action 'self'; img-src 'self' data: https: https://*.google-analytics.com https://www.googletagmanager.com; font-src 'self' data:; style-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-inline'${process.env.NODE_ENV === 'development' ? " 'unsafe-eval'" : ''} https://www.googletagmanager.com https://pagead2.googlesyndication.com; connect-src 'self' ws: wss: https://*.google-analytics.com https://*.analytics.google.com https://www.googletagmanager.com https://pagead2.googlesyndication.com https://*.googlesyndication.com https://*.doubleclick.net; frame-src 'self' https://googleads.g.doubleclick.net https://*.googlesyndication.com; upgrade-insecure-requests`
  },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(), payment=(), browsing-topics=()'
  },
  { key: 'X-Frame-Options', value: 'DENY' },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload'
  }
];

const nextConfig = {
  pageExtensions: ['ts', 'tsx', 'md', 'mdx'],
  poweredByHeader: false,
  async headers() {
    return [{ source: '/:path*', headers: securityHeaders }];
  }
};

export default createMDX({})(nextConfig);
