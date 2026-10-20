import { useTranslations } from 'next-intl';

import type { FaqCategory, FaqTopic } from '@/entities/faqs';
import { AccordionItem } from '@/shared/ui/accordion';
import { ContentLink } from '@/shared/ui/content-link';
import { ArrowRight } from '@/shared/ui/icon';
import { RichText } from '@/shared/ui/rich-text';

import { helpSectionRoute } from '../config/sections.ts';
import { EmptyResult } from './empty-result.tsx';
import { FilterChips } from './filter-chips.tsx';

type FaqContentProps = Readonly<{
  topics: readonly FaqTopic[];
  categories: readonly FaqCategory[];
  category: string | undefined;
  query: string | undefined;
}>;

export function FaqContent({ topics, categories, category, query }: FaqContentProps) {
  const t = useTranslations('HelpPage');
  const visible = categories.filter(
    ({ id, questions }) => questions.length > 0 && (category === undefined || category === id),
  );

  return (
    <div className="flex flex-col gap-6">
      <FilterChips
        label={t('categories')}
        pathname={helpSectionRoute('faq')}
        param="category"
        current={category}
        query={query}
        options={[
          { value: undefined, label: t('all') },
          ...topics.map(({ id, title }) => ({ value: id, label: title })),
        ]}
      />
      {visible.length === 0 && <EmptyResult />}
      {visible.map(({ id, title, lang, questions }) => (
        <section key={id} aria-labelledby={`faq-${id}`} className="flex flex-col gap-3">
          <h2 id={`faq-${id}`} lang={lang} className="text-h5 text-text-heading lg:text-h3">
            {title}
          </h2>
          {questions.map(({ id: questionId, question, answer, lang: questionLang, answerLang, link }, index) => (
            <AccordionItem
              key={questionId}
              title={<span lang={questionLang}>{question}</span>}
              defaultOpen={index === 0}
            >
              <RichText
                document={answer}
                lang={answerLang}
                className="text-body-l text-text-body lg:text-body-l [&>*+*]:mt-3"
              />
              {link !== undefined && (
                <ContentLink
                  href={link.href}
                  lang={link.lang}
                  className="mt-3 inline-flex items-center gap-1 text-body-s-medium text-brand-primary lg:text-body-l lg:font-normal"
                >
                  {link.label}
                  <ArrowRight aria-hidden="true" className="size-4" />
                </ContentLink>
              )}
            </AccordionItem>
          ))}
        </section>
      ))}
    </div>
  );
}
