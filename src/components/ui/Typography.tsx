import type { HTMLAttributes, ReactNode } from "react";

interface TextProps extends HTMLAttributes<HTMLElement> {
  children: ReactNode;
}

/** Big literary title — Fraunces */
export function Display({ children, className = "", ...p }: TextProps) {
  return (
    <h1
      className={`font-display font-medium text-3xl md:text-4xl leading-tight text-ink ${className}`}
      {...p}
    >
      {children}
    </h1>
  );
}

/** Section eyebrow — small, tracked, muted */
export function Eyebrow({ children, className = "", ...p }: TextProps) {
  return (
    <span
      className={`font-sans text-xs uppercase tracking-[0.2em] text-muted select-none ${className}`}
      {...p}
    >
      {children}
    </span>
  );
}

/** Reading / body copy */
export function Body({ children, className = "", ...p }: TextProps) {
  return (
    <p className={`font-sans text-base leading-relaxed text-ink/90 ${className}`} {...p}>
      {children}
    </p>
  );
}
