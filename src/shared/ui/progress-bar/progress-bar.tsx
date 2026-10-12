type ProgressBarProps = Readonly<{
  value: number;
  max: number;
  label: string;
  className?: string;
}>;

export function ProgressBar({ value, max, label, className }: ProgressBarProps) {
  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={max}
      aria-valuenow={value}
      className={`h-1.5 overflow-hidden rounded-full bg-surface-page lg:h-2 ${className ?? ''}`}
    >
      <div className="h-full rounded-full bg-brand-primary" style={{ width: `${String((value / max) * 100)}%` }} />
    </div>
  );
}
