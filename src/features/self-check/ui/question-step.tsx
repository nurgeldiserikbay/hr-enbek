import { useTranslations } from 'next-intl';
import { useEffect, useRef } from 'react';

import type { SelfCheckTopic } from '@/entities/self-checks';
import { Link, ROUTES } from '@/shared/config';
import { Button } from '@/shared/ui/button';
import { Card } from '@/shared/ui/card';
import { ContentIcon } from '@/shared/ui/content-icon';
import { ArrowLeft, ArrowRight, Scale } from '@/shared/ui/icon';
import { IconTile } from '@/shared/ui/icon-tile';
import { Notice } from '@/shared/ui/notice';
import { ProgressBar } from '@/shared/ui/progress-bar';
import { StepList } from '@/shared/ui/step-list';
import { Tag } from '@/shared/ui/tag';

import { type Answer, ANSWERS } from '../model/evaluate-self-check.ts';
import { AnswerOption } from './answer-option.tsx';

type QuestionStepProps = Readonly<{
  topic: SelfCheckTopic;
  index: number;
  answers: Readonly<Record<string, Answer>>;
  onAnswer: (answer: Answer) => void;
  onBack: () => void;
  onNext: () => void;
}>;

export function QuestionStep({ topic, index, answers, onAnswer, onBack, onNext }: QuestionStepProps) {
  const t = useTranslations('SelfCheck.question');
  const headingRef = useRef<HTMLHeadingElement>(null);
  const total = topic.questions.length;
  const current = topic.questions[index];
  const position = index + 1;

  useEffect(() => {
    if (index > 0) headingRef.current?.focus();
  }, [index]);

  if (current === undefined) return null;
  const answer = answers[current.id];

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[18.75rem_1fr]">
      <Card className="self-start p-4 lg:p-6">
        <div className="flex items-center gap-3">
          <IconTile size="card">
            <ContentIcon name={topic.icon} />
          </IconTile>
          <div>
            <p className="text-body-l-medium text-text-heading lg:font-semibold">{topic.title}</p>
            <p className="text-label font-normal text-text-body lg:text-caption">
              {t('progress', { current: position, total })}
            </p>
          </div>
        </div>
        <ProgressBar className="mt-4" value={position} max={total} label={t('progressLabel')} />
        <StepList
          className="mt-4 flex flex-col gap-2 lg:gap-3"
          steps={topic.questions.map((question, questionIndex) => {
            let state: 'done' | 'current' | 'upcoming' = 'upcoming';
            if (questionIndex < index) state = 'done';
            else if (questionIndex === index) state = 'current';
            return { key: question.id, label: question.label, state };
          })}
        />
      </Card>

      <Card asChild className="flex flex-col p-4 lg:p-8">
        <fieldset>
          <legend className="contents">
            <Tag tone="success" size="sm">
              {t('counter', { current: position, total })}
            </Tag>
            <h2
              ref={headingRef}
              tabIndex={-1}
              className="mt-4 text-h3-sm text-text-heading outline-none lg:mt-6 lg:text-h2-xs lg:font-semibold"
            >
              {current.question}
            </h2>
          </legend>
          <p className="mt-3 text-body-l text-text-body">{current.hint}</p>
          <div className="mt-6 grid gap-3 lg:mt-[29px] lg:grid-cols-3">
            {ANSWERS.map((option) => (
              <AnswerOption
                key={option}
                name={current.id}
                value={option}
                label={t(`answers.${option}`)}
                isChecked={answer === option}
                onChange={() => {
                  onAnswer(option);
                }}
              />
            ))}
          </div>
          <Notice className="mt-6 lg:mt-8" icon={<Scale aria-hidden="true" />} title={t('why')}>
            {current.why}
          </Notice>
          <div className="mt-8 flex flex-wrap items-center gap-3 lg:mt-auto lg:pt-10">
            {index === 0 ? (
              <Button asChild variant="secondary" className="h-12 px-6 text-body-l-medium">
                <Link href={ROUTES.selfCheck}>
                  <ArrowLeft aria-hidden="true" className="size-4" />
                  {t('back')}
                </Link>
              </Button>
            ) : (
              <Button variant="secondary" className="h-12 px-6 text-body-l-medium" onClick={onBack}>
                <ArrowLeft aria-hidden="true" className="size-4" />
                {t('back')}
              </Button>
            )}
            <p className="order-last w-full text-label font-normal text-text-muted lg:order-none lg:ml-auto lg:w-auto">
              {t('notSaved')}
            </p>
            <Button
              className="ml-auto h-12 px-6 text-body-l-medium lg:ml-0"
              disabled={answer === undefined}
              onClick={onNext}
            >
              {position === total ? t('finish') : t('next')}
              <ArrowRight aria-hidden="true" className="size-4" />
            </Button>
          </div>
        </fieldset>
      </Card>
    </div>
  );
}
