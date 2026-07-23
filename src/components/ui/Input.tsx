import { forwardRef } from "react";
import type { InputHTMLAttributes } from "react";

interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "value" | "onChange"> {
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, className = "", id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-");
    return (
      <div className="flex flex-col gap-1">
        {label && (
          <label htmlFor={inputId} className="font-sans text-sm text-muted">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={
            "w-full bg-surface border border-line rounded-card px-4 py-3 " +
            "text-ink placeholder:text-muted font-sans text-base " +
            "focus:outline-none focus:ring-2 focus:ring-honey focus:border-honey " +
            "transition-colors duration-300 ease-calm " +
            className
          }
          {...props}
        />
      </div>
    );
  }
);
Input.displayName = "Input";
