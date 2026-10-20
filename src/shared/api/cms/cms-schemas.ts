import { z } from 'zod';

import type { Audience, ContentAudience } from '@/shared/config/audience.ts';
import { type Locale, routing } from '@/shared/config/i18n/routing.ts';
import { type RichTextDocument, richTextDocumentSchema, type RichTextNode } from '@/shared/lib/rich-text';

export const cmsDownloadUrl = (fileUrl: string) => {
  const url = new URL(fileUrl);
  url.searchParams.set('download', 'true');
  return url.toString();
};

const cmsLocaleSchema = z.enum(routing.locales).catch(routing.defaultLocale);

export const cmsOptionalTextSchema = z
  .string()
  .nullish()
  .transform((value) => (value === null || value === undefined || value.trim() === '' ? undefined : value));

export interface CmsFile {
  url: string;
  width: number | undefined;
  height: number | undefined;
  thumbnailUrl: string | undefined;
}

const ROOT_PATH = /^\/(?!\/)/u;

const resolveCmsUrl = (value: string): string => {
  const base = process.env.CMS_PUBLIC_URL;
  return ROOT_PATH.test(value) && base !== undefined && base !== '' ? new URL(value, base).toString() : value;
};

const cmsFileUrlSchema = z
  .string()
  .transform(resolveCmsUrl)
  .pipe(z.url({ protocol: /^https?$/u }));

const resolveImageUrls = (node: RichTextNode): RichTextNode => {
  const url = node.type === 'image' ? node.attrs?.['url'] : undefined;
  return {
    ...node,
    ...(typeof url === 'string' && { attrs: { ...node.attrs, url: resolveCmsUrl(url) } }),
    ...(node.content !== undefined && { content: node.content.map((child) => resolveImageUrls(child)) }),
  };
};

export const cmsRichTextSchema = richTextDocumentSchema.transform((document): RichTextDocument =>
  resolveImageUrls(document),
);
const cmsDimensionSchema = z.number().int().positive().nullish();

export const cmsFileSchema = z
  .object({
    id: z.uuid(),
    url: cmsFileUrlSchema,
    width: cmsDimensionSchema,
    height: cmsDimensionSchema,
    thumbnailUrl: cmsFileUrlSchema.nullish(),
  })
  .transform(({ url, width, height, thumbnailUrl }): CmsFile => ({
    url,
    width: width ?? undefined,
    height: height ?? undefined,
    thumbnailUrl: thumbnailUrl ?? undefined,
  }));

const CMS_AUDIENCES = { employer: 'EMPLOYER', employee: 'WORKER' } as const satisfies Record<Audience, string>;

export const cmsAudienceSchema = z.enum(['ALL', 'EMPLOYER', 'WORKER']).transform((value): ContentAudience => {
  switch (value) {
    case 'EMPLOYER': {
      return 'employer';
    }
    case 'WORKER': {
      return 'employee';
    }
    case 'ALL': {
      return 'all';
    }
  }
});

export const toCmsAudience = (audience: Audience | undefined) =>
  audience === undefined ? undefined : CMS_AUDIENCES[audience];

export interface ContentLanguage {
  lang: Locale;
  fallbackFields: readonly string[];
}

export const cmsContentLanguageShape = {
  langUsed: cmsLocaleSchema,
  fallbackFields: z.array(z.string()).nullish(),
};

export const toContentLanguage = ({
  langUsed,
  fallbackFields,
}: {
  langUsed: Locale;
  fallbackFields?: readonly string[] | null | undefined;
}): ContentLanguage => ({ lang: langUsed, fallbackFields: fallbackFields ?? [] });

export const fieldLanguage = ({ lang, fallbackFields }: ContentLanguage, field: string): Locale =>
  fallbackFields.includes(field) ? routing.defaultLocale : lang;
