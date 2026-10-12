import { CircleCheck, History, LogIn } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { type ReactNode, useEffect, useRef } from 'react';

import type { SelfCheckTopic } from '@/entities/self-checks';
import { Link, ROUTES } from '@/shared/config';
import { cn } from '@/shared/lib/styles';
import { AccordionItem } from '@/shared/ui/accordion';
import { Button } from '@/shared/ui/button';
import { Card } from '@/shared/ui/card';
import {
  ArrowRight,
  Check,
  ChevronRight,
  CircleHelp,
  CircleX,
  Download,
  FileText,
  RefreshCw,
  ShieldCheck,
  TriangleAlert,
} from '@/shared/ui/icon';
import { IconTile } from '@/shared/ui/icon-tile';
import { ItemRow } from '@/shared/ui/item-row';
import { Tag } from '@/shared/ui/tag';

import type { Risk, SelfCheckResult } from '../model/evaluate-self-check.ts';
import { ScoreRing } from './score-ring.tsx';

const RISK_STYLES: Record<Risk, { card: string; title: string; tag: 'success' | 'warning' | 'danger' }> = {
  low: { card: 'border-brand-primary bg-brand-tint', title: 'text-brand-primary', tag: 'success' },
  medium: { card: 'border-status-warning bg-status-warning-bg', title: 'text-status-warning-strong', tag: 'warning' },
  high: { card: 'border-status-danger bg-status-danger-bg', title: 'text-status-danger-strong', tag: 'danger' },
};

const RESULT_LINKS = [
  { key: 'another', icon: <RefreshCw aria-hidden="true" />, href: ROUTES.selfCheck },
  { key: 'download', icon: <Download aria-hidden="true" />, href: undefined },
  { key: 'instructions', icon: <FileText aria-hidden="true" />, href: ROUTES.helpInstructions },
] as const;

const ACTION_ROW =
  'flex h-13 w-full items-center gap-3 rounded-xl px-4 text-body-m-medium text-text-heading hover:bg-surface-soft [&>svg:first-child]:size-5';

type ResultViewProps = Readonly<{
  topic: SelfCheckTopic;
  result: SelfCheckResult;
  support: ReactNode;
}>;

export function ResultView({ topic, result, support }: ResultViewProps) {
  const t = useTranslations('SelfCheck.result');
  const { score, total, risk, passed, failed, unsure } = result;
  const styles = RISK_STYLES[risk];
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    headingRef.current?.focus();
  }, []);
  const issues = [
    ...failed.map((question) => ({ question, title: question.failTitle, isUnsure: false })),
    ...unsure.map((question) => ({ question, title: question.checkTitle, isUnsure: true })),
  ];

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_22.5rem]">
      <div className="flex flex-col gap-4">
        <section
          aria-labelledby="self-check-result"
          className={cn(
            'flex flex-col gap-4 rounded-2xl border p-4 sm:flex-row sm:items-center lg:gap-7 lg:p-8',
            styles.card,
          )}
        >
          <div className={styles.title}>
            <ScoreRing score={score} total={total} risk={risk} label={t('scoreLabel', { score, total })} />
          </div>
          <div>
            <Tag tone={styles.tag} size="sm" className="bg-surface-card">
              {risk === 'low' ? <ShieldCheck aria-hidden="true" /> : <TriangleAlert aria-hidden="true" />}
              {t(`risk.${risk}`)}
            </Tag>
            <h2
              ref={headingRef}
              tabIndex={-1}
              id="self-check-result"
              className={cn('mt-2 text-h3-sm outline-none lg:text-h2-xs', styles.title)}
            >
              {t(`title.${risk}`)}
            </h2>
            <p className={cn('mt-2 text-body-l', styles.title)}>
              {t(`text.${risk}`, { topic: topic.title, score, total })}
            </p>
          </div>
        </section>

        {issues.length > 0 && (
          <section aria-labelledby="self-check-issues" className="flex flex-col gap-3 lg:gap-4">
            <h2 id="self-check-issues" className="mt-2 text-h5 text-text-heading lg:mt-0 lg:text-h4">
              {t('toFix')}
            </h2>
            {issues.map(({ question, title, isUnsure }) => (
              <ItemRow
                key={question.id}
                align="start"
                className="lg:p-6"
                iconSize="sm"
                iconTone={isUnsure ? 'warning' : 'danger'}
                icon={isUnsure ? <CircleHelp /> : <CircleX />}
                title={title}
                description={question.advice}
              >
                {question.link !== undefined && (
                  <Link
                    href={question.link.href}
                    className="mt-2 inline-flex items-center gap-1 text-body-m-semibold text-brand-primary lg:text-body-s-medium lg:font-semibold"
                  >
                    {question.link.label}
                    <ArrowRight aria-hidden="true" className="size-4" />
                  </Link>
                )}
              </ItemRow>
            ))}
          </section>
        )}

        {passed.length > 0 && (
          <AccordionItem
            variant="plain"
            defaultOpen
            title={
              <span className="flex items-center gap-3">
                <CircleCheck aria-hidden="true" className="size-5 text-brand-primary" />
                {t('passed', { count: passed.length })}
              </span>
            }
          >
            <ul className="flex flex-col gap-3 lg:gap-4">
              {passed.map((question) => (
                <li key={question.id} className="flex items-center gap-3 text-body-m text-text-body">
                  <Check aria-hidden="true" className="size-4 shrink-0 text-brand-primary" />
                  {question.passTitle}
                </li>
              ))}
            </ul>
          </AccordionItem>
        )}
      </div>

      <aside className="flex flex-col gap-4">
        <Card className="p-4 lg:p-7">
          <IconTile size="md">
            <History />
          </IconTile>
          <h2 className="mt-4 text-h4 text-text-heading">{t('saveTitle')}</h2>
          <p className="mt-3 text-body-m text-text-body">{t('saveText')}</p>
          <Button asChild className="mt-5 h-11 w-full text-body-l-medium lg:h-[46px] lg:text-body-m-medium">
            <Link href={ROUTES.login}>
              <LogIn aria-hidden="true" className="size-4" />
              {t('saveAction')}
            </Link>
          </Button>
        </Card>
        {risk !== 'low' && support}
        <Card asChild className="p-2 lg:p-3">
          <ul>
            {RESULT_LINKS.map(({ key, icon, href }) => (
              <li key={key}>
                {href === undefined ? (
                  <button
                    type="button"
                    onClick={() => {
                      globalThis.print();
                    }}
                    className={ACTION_ROW}
                  >
                    {icon}
                    {t(`actions.${key}`)}
                    <ChevronRight aria-hidden="true" className="ml-auto size-4 text-text-muted" />
                  </button>
                ) : (
                  <Link href={href} className={ACTION_ROW}>
                    {icon}
                    {t(`actions.${key}`)}
                    <ChevronRight aria-hidden="true" className="ml-auto size-4 text-text-muted" />
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </Card>
      </aside>
    </div>
  );
}
