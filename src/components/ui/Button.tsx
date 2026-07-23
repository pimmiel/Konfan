import { forwardRef } from "react";
import type { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "ghost" | "quiet";
type Size = "sm" | "md";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

const base =
  "inline-flex items-center justify-center gap-2 font-sans font-medium " +
  "rounded-pill transition-all duration-300 ease-calm select-none " +
  "disabled:opacity-40 disabled:pointer-events-none";

const variants: Record<Variant, string> = {
  // warm candlelight fill
  primary:
    "bg-honey text-plum-deep hover:bg-honey-deep hover:text-paper shadow-glow hover:shadow-lift",
  // outlined, herb-garden
  ghost:
    "border border-line text-ink hover:border-sage hover:bg-sage/10",
  // text-only
  quiet: "text-muted hover:text-ink hover:bg-ink/5",
};

const sizes: Record<Size, string> = {
  sm: "text-sm px-4 py-2",
  md: "text-base px-6 py-3",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", size = "md", className = "", ...props }, ref) => (
    <button
      ref={ref}
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    />
  )
);
Button.displayName = "Button";
