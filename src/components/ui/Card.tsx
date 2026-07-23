import type { HTMLAttributes } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  /** glowing = candle-lit, for the "tonight" hero card */
  glowing?: boolean;
}

export function Card({ glowing = false, className = "", ...props }: CardProps) {
  return (
    <div
      className={
        "bg-surface border border-line rounded-card p-6 " +
        "transition-shadow duration-500 ease-calm " +
        (glowing ? "shadow-glow" : "shadow-lift") +
        " " +
        className
      }
      {...props}
    />
  );
}
