import { z } from 'zod';

export const faqCategorySchema = z.object({
  id: z.string(),
  title: z.string(),
  questions: z.array(
    z.object({
      id: z.string(),
      question: z.string(),
      answer: z.string(),
      link: z.object({ label: z.string(), href: z.string() }).optional(),
    }),
  ),
});

export type FaqCategory = z.infer<typeof faqCategorySchema>;
