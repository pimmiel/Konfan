interface ProgressBarProps {
  value: number;
  className?: string;
}

export function ProgressBar({ value, className = "" }: ProgressBarProps) {
  const pct = Math.min(Math.max(value, 0), 1) * 100;
  return (
    <div
      role="progressbar"
      aria-valuenow={Math.round(pct)}
      aria-valuemin={0}
      aria-valuemax={100}
      className={`rounded-full bg-honey/30 overflow-hidden h-1.5 ${className}`}
    >
      <div
        className="h-full bg-honey rounded-full transition-all duration-700 ease-calm"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
