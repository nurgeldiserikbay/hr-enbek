import { z } from 'zod';

import { requestCms } from '@/shared/api';
import type { Locale } from '@/shared/config';

import type { FaqCategory, FaqTopic } from '../model/faq.ts';
import { faqCategorySchema, faqTopicSchema } from './faq-schema.ts';

export async function getFaq(locale: Locale, query?: string): Promise<FaqCategory[]> {
  return z.array(faqCategorySchema).parse(
    await requestCms({
      path: '/api/v1/public/faq',
      locale,
      sections: ['faq', 'instructions', 'video-instructions'],
      query: { q: query },
    }),
  );
}

export async function getFaqTopics(locale: Locale): Promise<FaqTopic[]> {
  return z
    .array(faqTopicSchema)
    .parse(await requestCms({ path: '/api/v1/public/faq/categories', locale, sections: ['faq'] }));
}
