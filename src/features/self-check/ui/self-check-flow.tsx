'use client';

import { type ReactNode, useState } from 'react';

import type { SelfCheckTopic } from '@/entities/self-checks';

import { type Answer, evaluateSelfCheck } from '../model/evaluate-self-check.ts';
import { QuestionStep } from './question-step.tsx';
import { ResultView } from './result-view.tsx';
import { SelfCheckIntro } from './self-check-intro.tsx';

type SelfCheckFlowProps = Readonly<{
  topic: SelfCheckTopic;
  support: ReactNode;
}>;

export function SelfCheckFlow({ topic, support }: SelfCheckFlowProps) {
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, Answer>>({});
  const [isFinished, setIsFinished] = useState(false);

  const answer = (value: Answer) => {
    const question = topic.questions[index];
    if (question === undefined) return;
    setAnswers((previous) => ({ ...previous, [question.id]: value }));
  };

  const next = () => {
    if (index === topic.questions.length - 1) {
      setIsFinished(true);
      globalThis.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    setIndex(index + 1);
  };

  return (
    <div className="flex flex-col gap-8 lg:gap-12">
      <SelfCheckIntro step={isFinished ? 3 : 2} />
      {isFinished ? (
        <ResultView topic={topic} result={evaluateSelfCheck(topic.questions, answers)} support={support} />
      ) : (
        <QuestionStep
          topic={topic}
          index={index}
          answers={answers}
          onAnswer={answer}
          onBack={() => {
            setIndex(Math.max(0, index - 1));
          }}
          onNext={next}
        />
      )}
    </div>
  );
}
