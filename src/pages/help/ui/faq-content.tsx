import { useTranslations } from 'next-intl';

import type { FaqCategory } from '@/entities/faqs';
import { Link } from '@/shared/config';
import { AccordionItem } from '@/shared/ui/accordion';
import { ArrowRight } from '@/shared/ui/icon';

import { helpSectionRoute } from '../config/sections.ts';
import { EmptyResult } from './empty-result.tsx';
import { FilterChips } from './filter-chips.tsx';

type FaqContentProps = Readonly<{
  categories: readonly FaqCategory[];
  category: string | undefined;
  query: string | undefined;
}>;

export function FaqContent({ categories, category, query }: FaqContentProps) {
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
          ...categories.map(({ id, title }) => ({ value: id, label: title })),
        ]}
      />
      {visible.length === 0 && <EmptyResult />}
      {visible.map(({ id, title, questions }) => (
        <section key={id} aria-labelledby={`faq-${id}`} className="flex flex-col gap-3">
          <h2 id={`faq-${id}`} className="text-h5 text-text-heading lg:text-h3">
            {title}
          </h2>
          {questions.map(({ id: questionId, question, answer, link }, index) => (
            <AccordionItem key={questionId} title={question} defaultOpen={index === 0}>
              <p className="text-body-l text-text-body">{answer}</p>
              {link !== undefined && (
                <Link
                  href={link.href}
                  className="mt-3 inline-flex items-center gap-1 text-body-s-medium text-brand-primary lg:text-body-l lg:font-normal"
                >
                  {link.label}
                  <ArrowRight aria-hidden="true" className="size-4" />
                </Link>
              )}
            </AccordionItem>
          ))}
        </section>
      ))}
    </div>
  );
}
