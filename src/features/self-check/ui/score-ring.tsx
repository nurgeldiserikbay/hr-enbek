import type { Risk } from '../model/evaluate-self-check.ts';

const RADIUS = 52;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

const STROKE: Record<Risk, string> = {
  low: 'stroke-brand-primary',
  medium: 'stroke-status-warning',
  high: 'stroke-status-danger',
};

type ScoreRingProps = Readonly<{
  score: number;
  total: number;
  risk: Risk;
  label: string;
}>;

export function ScoreRing({ score, total, risk, label }: ScoreRingProps) {
  return (
    <div className="relative size-32 shrink-0 lg:size-[130px]" role="img" aria-label={label}>
      <svg viewBox="0 0 120 120" className="size-full -rotate-90" aria-hidden="true">
        <circle cx="60" cy="60" r={RADIUS} strokeWidth="10" className="fill-surface-card stroke-surface-card" />
        <circle
          cx="60"
          cy="60"
          r={RADIUS}
          fill="none"
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={`${String((score / total) * CIRCUMFERENCE)} ${String(CIRCUMFERENCE)}`}
          className={STROKE[risk]}
        />
      </svg>
      <span aria-hidden="true" className="absolute inset-0 flex items-center justify-center text-number-l">
        {score}/{total}
      </span>
    </div>
  );
}
