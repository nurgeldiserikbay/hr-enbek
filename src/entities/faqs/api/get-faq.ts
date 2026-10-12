import { z } from 'zod';

import { matchesQuery } from '@/shared/lib/search';

import { type FaqCategory, faqCategorySchema } from '../model/faq.ts';
import { FAQ_MOCK } from './faq.mock.ts';

export function getFaq(query?: string): Promise<FaqCategory[]> {
  const categories = z.array(faqCategorySchema).parse(FAQ_MOCK);
  return Promise.resolve(
    categories.map((category) => ({
      ...category,
      questions: category.questions.filter(({ question, answer }) => matchesQuery(query, question, answer)),
    })),
  );
}
