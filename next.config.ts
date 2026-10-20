import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/shared/config/i18n/request.ts');

const securityHeaders = [
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), payment=()' },
];

const cmsPublicUrl = URL.parse(process.env.CMS_PUBLIC_URL ?? '');

const cmsImages = (cms: URL): NonNullable<NextConfig['images']> => ({
  remotePatterns: [new URL(`${cms.origin}${cms.pathname.replace(/\/$/u, '')}/api/v1/public/files/**`)],
  dangerouslyAllowLocalIP: cms.hostname === 'localhost',
});

const nextConfig: NextConfig = {
  output: 'standalone',
  poweredByHeader: false,
  reactStrictMode: true,
  reactCompiler: true,
  typedRoutes: true,
  ...(cmsPublicUrl === null ? {} : { env: { CMS_PUBLIC_URL: cmsPublicUrl.href } }),
  images: {
    localPatterns: [{ pathname: '/_next/static/media/**' }],
    ...(cmsPublicUrl === null ? {} : cmsImages(cmsPublicUrl)),
  },
  headers() {
    return Promise.resolve([
      { source: '/:path*', headers: securityHeaders },
      { source: '/admin/:path*', headers: [{ key: 'Cache-Control', value: 'no-store' }] },
      { source: '/cabinet/:path*', headers: [{ key: 'Cache-Control', value: 'no-store' }] },
      { source: '/api/auth/:path*', headers: [{ key: 'Cache-Control', value: 'no-store' }] },
      { source: '/api/cms/:path*', headers: [{ key: 'Cache-Control', value: 'no-store' }] },
    ]);
  },
};

export default withNextIntl(nextConfig);
