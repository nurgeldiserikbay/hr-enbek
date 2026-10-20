import type { Locale } from '@/shared/config/i18n/routing.ts';

import { readApiResponse } from '../api-error/api-error.ts';
import { readCmsEnv } from './cms-env.ts';
import { type CmsSection, cmsSectionTag } from './cms-sections.ts';

const CMS_REVALIDATE_SECONDS = 60;

type CmsQueryValue = string | number | undefined;

export interface CmsRequest {
  path: `/api/v1/public/${string}`;
  locale?: Locale | undefined;
  sections: readonly [CmsSection, ...CmsSection[]];
  query?: Readonly<Record<string, CmsQueryValue>>;
}

const cmsServiceUrl = (path: string): URL => {
  const base = readCmsEnv().CMS_SERVICE_URL;
  return new URL(`${base.endsWith('/') ? base.slice(0, -1) : base}${path}`);
};

export async function requestCms({ path, locale, sections, query = {} }: CmsRequest): Promise<unknown> {
  const url = cmsServiceUrl(path);
  if (locale !== undefined) url.searchParams.set('lang', locale);
  for (const [key, value] of Object.entries(query)) {
    if (value !== undefined && value !== '') url.searchParams.set(key, String(value));
  }
  const response = await fetch(url, {
    headers: { Accept: 'application/json', ...(locale === undefined ? {} : { 'Accept-Language': locale }) },
    next: { revalidate: CMS_REVALIDATE_SECONDS, tags: sections.map((section) => cmsSectionTag(section)) },
  });
  return readApiResponse(response);
}
