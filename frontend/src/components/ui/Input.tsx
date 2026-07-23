import * as React from 'react';
import { cn } from '../../utils/cn';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-');
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-[var(--color-text)]"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            'h-9 w-full rounded-lg border border-[var(--color-border)]',
            'bg-[var(--color-surface-raised)] px-3 py-2',
            'text-sm text-[var(--color-text)]',
            'placeholder:text-[var(--color-text-subtle)]',
            'transition-colors duration-150',
            'focus:outline-none focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)]',
            'disabled:cursor-not-allowed disabled:opacity-50',
            error && 'border-[var(--color-error)] focus:ring-[var(--color-error)]',
            className
          )}
          aria-invalid={!!error}
          aria-describedby={error ? `${inputId}-error` : undefined}
          {...props}
        />
        {error && (
          <p
            id={`${inputId}-error`}
            role="alert"
            className="text-xs text-[var(--color-error)]"
          >
            {error}
          </p>
        )}
      </div>
    );
  }
);
Input.displayName = 'Input';
