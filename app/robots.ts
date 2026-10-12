import type { MetadataRoute } from 'next';

import { env } from '@/shared/config';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/', disallow: ['/admin', '/api'] },
    sitemap: new URL('/sitemap.xml', env.NEXT_PUBLIC_SITE_URL).toString(),
  };
}
