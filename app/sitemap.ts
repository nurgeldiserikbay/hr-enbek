import type { MetadataRoute } from 'next';

import { env, routing } from '@/shared/config';

const absolute = (pathname: string): string => new URL(pathname, env.NEXT_PUBLIC_SITE_URL).toString();

export default function sitemap(): MetadataRoute.Sitemap {
  return routing.locales.map((locale) => ({
    url: absolute(`/${locale}`),
    alternates: {
      languages: Object.fromEntries(routing.locales.map((code) => [code, absolute(`/${code}`)])),
    },
  }));
}
