import * as React from 'react';
import { cn } from '../../utils/cn';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost' | 'secondary' | 'destructive';
  size?: 'sm' | 'md' | 'lg' | 'icon';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'md', ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center rounded-lg text-sm font-medium',
          'transition-all duration-150 ease-in-out',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg)]',
          'disabled:pointer-events-none disabled:opacity-40 disabled:cursor-not-allowed',
          'select-none',
          {
            // default
            'bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-hover)] shadow-sm active:scale-[0.98]':
              variant === 'default',
            // outline
            'border border-[var(--color-border)] bg-transparent text-[var(--color-text)] hover:bg-[var(--color-surface-raised)] hover:border-[var(--color-border-strong)] active:scale-[0.98]':
              variant === 'outline',
            // ghost
            'bg-transparent text-[var(--color-text-muted)] hover:bg-[var(--color-surface-raised)] hover:text-[var(--color-text)]':
              variant === 'ghost',
            // secondary
            'bg-[var(--color-surface-raised)] text-[var(--color-text)] hover:bg-[var(--color-surface-overlay)] border border-[var(--color-border)]':
              variant === 'secondary',
            // destructive
            'bg-[var(--color-error-muted)] text-[var(--color-error)] border border-[var(--color-error)] border-opacity-30 hover:bg-[var(--color-error)] hover:text-white':
              variant === 'destructive',
            // sizes
            'h-9 px-4 py-2':         size === 'md',
            'h-7 px-3 text-xs':      size === 'sm',
            'h-11 px-6 text-base':   size === 'lg',
            'h-9 w-9 p-0 rounded-lg': size === 'icon',
          },
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';
