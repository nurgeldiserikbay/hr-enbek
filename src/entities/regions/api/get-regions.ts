import { z } from 'zod';

import { cmsContentLanguageShape, requestCms } from '@/shared/api';
import type { Locale } from '@/shared/config';

import type { Region } from '../model/region.ts';

const regionSchema = z
  .object({ code: z.string().min(1), name: z.string(), langUsed: cmsContentLanguageShape.langUsed })
  .transform(({ code, name, langUsed }): Region => ({ id: code, name, lang: langUsed }));

async function getRegions(locale: Locale): Promise<Region[]> {
  return z
    .array(regionSchema)
    .parse(await requestCms({ path: '/api/v1/public/regions', locale, sections: ['regions'] }));
}

export async function getRegionOptions(locale: Locale): Promise<{ value: string; label: string }[]> {
  const regions = await getRegions(locale);
  return regions.map(({ id, name }) => ({ value: id, label: name }));
}
