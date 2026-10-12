import type { SelfCheckQuestion } from '@/entities/self-checks';

export const ANSWERS = ['yes', 'no', 'unknown'] as const;

export type Answer = (typeof ANSWERS)[number];

export type Risk = 'low' | 'medium' | 'high';

export interface SelfCheckResult {
  score: number;
  total: number;
  risk: Risk;
  passed: SelfCheckQuestion[];
  failed: SelfCheckQuestion[];
  unsure: SelfCheckQuestion[];
}

const MEDIUM_RISK_SHARE = 0.5;

export function evaluateSelfCheck(
  questions: readonly SelfCheckQuestion[],
  answers: Readonly<Record<string, Answer>>,
): SelfCheckResult {
  const passed = questions.filter(({ id }) => answers[id] === 'yes');
  const failed = questions.filter(({ id }) => answers[id] === 'no');
  const unsure = questions.filter(({ id }) => answers[id] !== 'yes' && answers[id] !== 'no');
  const score = passed.length;
  const total = questions.length;

  let risk: Risk = 'high';
  if (score === total) risk = 'low';
  else if (score / total >= MEDIUM_RISK_SHARE) risk = 'medium';

  return { score, total, risk, passed, failed, unsure };
}
