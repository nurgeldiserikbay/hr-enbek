import { z } from 'zod';

import {
  cmsContentLanguageShape,
  cmsFileSchema,
  cmsOptionalTextSchema,
  cmsRichTextSchema,
  fieldLanguage,
  toContentLanguage,
} from '@/shared/api';

import type { FaqCategory, FaqLink, FaqQuestion, FaqTopic } from '../model/faq.ts';

const linkedInstructionSchema = z
  .object({
    title: z.string(),
    file: cmsFileSchema,
    url: cmsOptionalTextSchema,
    langUsed: cmsContentLanguageShape.langUsed,
  })
  .transform(({ title, file, url, langUsed }): FaqLink => ({ label: title, href: url ?? file.url, lang: langUsed }));

const linkedVideoSchema = z
  .object({ title: z.string(), videoUrl: z.url({ protocol: /^https?$/u }), langUsed: cmsContentLanguageShape.langUsed })
  .transform(({ title, videoUrl, langUsed }): FaqLink => ({ label: title, href: videoUrl, lang: langUsed }));

const faqQuestionSchema = z
  .object({
    id: z.uuid(),
    question: z.string(),
    answer: cmsRichTextSchema,
    instruction: linkedInstructionSchema.nullish(),
    videoInstruction: linkedVideoSchema.nullish(),
    linkLabel: cmsOptionalTextSchema,
    ...cmsContentLanguageShape,
  })
  .transform(({ id, question, answer, instruction, videoInstruction, linkLabel, ...language }): FaqQuestion => {
    const content = toContentLanguage(language);
    const linked = instruction ?? videoInstruction ?? undefined;
    return {
      id,
      question,
      answer,
      lang: content.lang,
      answerLang: fieldLanguage(content, 'answer'),
      link:
        linked === undefined || linkLabel === undefined
          ? linked
          : { ...linked, label: linkLabel, lang: fieldLanguage(content, 'linkLabel') },
    };
  });

export const faqTopicSchema = z
  .object({ code: z.string().min(1), name: z.string(), langUsed: cmsContentLanguageShape.langUsed })
  .transform(({ code, name, langUsed }): FaqTopic => ({ id: code, title: name, lang: langUsed }));

export const faqCategorySchema = z
  .object({
    code: z.string().min(1),
    name: z.string(),
    langUsed: cmsContentLanguageShape.langUsed,
    items: z.array(faqQuestionSchema),
  })
  .transform(({ code, name, langUsed, items }): FaqCategory => ({
    id: code,
    title: name,
    lang: langUsed,
    questions: items,
  }));
