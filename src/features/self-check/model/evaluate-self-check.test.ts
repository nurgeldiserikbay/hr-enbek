import type { SelfCheckQuestion } from '@/entities/self-checks';

import { type Answer, evaluateSelfCheck } from './evaluate-self-check.ts';

const question = (id: string): SelfCheckQuestion => ({
  id,
  label: id,
  question: id,
  hint: '',
  why: '',
  passTitle: '',
  failTitle: '',
  checkTitle: '',
  advice: '',
});

const QUESTIONS = ['a', 'b', 'c', 'd'].map((id) => question(id));

const answersFor = (...values: Answer[]) => {
  const answers: Record<string, Answer> = {};
  for (const [index, value] of values.entries()) {
    const id = QUESTIONS[index]?.id;
    if (id !== undefined) answers[id] = value;
  }
  return answers;
};

describe('evaluateSelfCheck', () => {
  it('reports low risk when every requirement is met', () => {
    const result = evaluateSelfCheck(QUESTIONS, answersFor('yes', 'yes', 'yes', 'yes'));

    expect(result).toMatchObject({ score: 4, total: 4, risk: 'low' });
    expect(result.failed).toHaveLength(0);
  });

  it('reports medium risk when at least half of the requirements are met', () => {
    expect(evaluateSelfCheck(QUESTIONS, answersFor('yes', 'yes', 'no', 'unknown')).risk).toBe('medium');
  });

  it('reports high risk when less than half of the requirements are met', () => {
    expect(evaluateSelfCheck(QUESTIONS, answersFor('yes', 'no', 'no', 'no')).risk).toBe('high');
  });

  it('separates violations from requirements the employer is unsure about', () => {
    const result = evaluateSelfCheck(QUESTIONS, answersFor('no', 'unknown', 'yes'));

    expect(result.failed.map(({ id }) => id)).toEqual(['a']);
    expect(result.unsure.map(({ id }) => id)).toEqual(['b', 'd']);
    expect(result.passed.map(({ id }) => id)).toEqual(['c']);
  });
});
