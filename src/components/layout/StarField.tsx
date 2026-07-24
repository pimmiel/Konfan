// Fixed star field — 8 small dots scattered across the viewport.
// dusk: dim (opacity 0.35 wrapper), bedtime: full brightness.
// Respects prefers-reduced-motion via global CSS in index.css.

const STARS: { top: string; left: string; delay: string; duration: string }[] = [
  { top: "7%",  left: "11%", delay: "0s",    duration: "4.2s" },
  { top: "14%", left: "79%", delay: "1.3s",  duration: "5.8s" },
  { top: "5%",  left: "46%", delay: "0.7s",  duration: "6.4s" },
  { top: "21%", left: "91%", delay: "2.1s",  duration: "4.8s" },
  { top: "4%",  left: "29%", delay: "3.2s",  duration: "5.2s" },
  { top: "17%", left: "61%", delay: "0.4s",  duration: "4.6s" },
  { top: "11%", left: "87%", delay: "1.8s",  duration: "6.0s" },
  { top: "3%",  left: "54%", delay: "2.6s",  duration: "5.4s" },
];

export function StarField() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 opacity-[0.35] dark:opacity-100 transition-opacity duration-700"
    >
      {STARS.map((s, i) => (
        <span
          key={i}
          className="absolute w-[3px] h-[3px] rounded-full bg-ink"
          style={{
            top: s.top,
            left: s.left,
            animation: `twinkle ${s.duration} ${s.delay} infinite ease-in-out`,
          }}
        />
      ))}
    </div>
  );
}
