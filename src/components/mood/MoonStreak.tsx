const MAX = 7;

interface MoonStreakProps {
  streak: number;
}

export function MoonStreak({ streak }: MoonStreakProps) {
  const filled = Math.min(streak, MAX);

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex items-center gap-2" aria-label={`${streak} คืนติดกัน`}>
        {Array.from({ length: MAX }, (_, i) => (
          <div
            key={i}
            aria-hidden
            className={
              "w-4 h-4 rounded-full transition-all duration-500 ease-calm " +
              (i < filled ? "bg-honey shadow-glow" : "border border-line")
            }
          />
        ))}
      </div>
      {streak > 0 && (
        <p className="font-sans text-xs text-honey">
          {streak} คืนติดกัน · {streak}-night streak
        </p>
      )}
    </div>
  );
}
