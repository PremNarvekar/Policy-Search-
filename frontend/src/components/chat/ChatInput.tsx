import React, { useRef, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

interface ChatInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoading?: boolean;
}

const MAX_CHARS = 4000;

export function ChatInput({ value, onChange, onSubmit, isLoading }: ChatInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 200)}px`;
  }, [value]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (canSubmit) onSubmit(e as unknown as React.FormEvent);
    }
  };

  const canSubmit = value.trim().length > 0 && !isLoading && value.length <= MAX_CHARS;
  const charsRemaining = MAX_CHARS - value.length;
  const isNearLimit = charsRemaining < 200;

  return (
    <form onSubmit={onSubmit} className="relative mx-auto w-full max-w-3xl">
      <div
        className="relative flex w-full flex-col rounded-lg transition-colors duration-150"
        style={{
          backgroundColor: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          boxShadow: 'var(--shadow-md)',
        }}
        onFocusCapture={(e) => {
          (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--color-border-strong)';
        }}
        onBlurCapture={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget as Node)) {
            (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--color-border)';
          }
        }}
      >
        <textarea
          ref={textareaRef}
          value={value}
          onChange={onChange}
          onKeyDown={handleKeyDown}
          placeholder="Ask a question about your policies…"
          className="w-full resize-none bg-transparent px-4 py-3.5 pr-14 text-sm focus:outline-none"
          style={{
            color: 'var(--color-text)',
            minHeight: '52px',
            maxHeight: '200px',
          }}
          rows={1}
          maxLength={MAX_CHARS}
          disabled={isLoading}
          aria-label="Message input"
        />

        {/* Send button */}
        <div className="absolute right-2.5 bottom-2.5">
          <button
            type="submit"
            disabled={!canSubmit}
            aria-label="Send message"
            className="flex h-7 w-7 items-center justify-center rounded-md transition-colors duration-150 disabled:opacity-30 disabled:cursor-not-allowed active:scale-95"
            style={{
              backgroundColor: canSubmit ? 'var(--color-primary)' : 'var(--color-surface-overlay)',
              color: canSubmit ? '#fff' : 'var(--color-text-subtle)',
              border: canSubmit ? 'none' : '1px solid var(--color-border)',
            }}
            onMouseEnter={(e) => {
              if (canSubmit) {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'var(--color-primary-hover)';
              }
            }}
            onMouseLeave={(e) => {
              if (canSubmit) {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'var(--color-primary)';
              }
            }}
          >
            {isLoading ? (
              <div className="flex gap-0.5 items-center">
                <span className="h-1 w-1 rounded-full bg-current animate-typing-dot" style={{ animationDelay: '0ms' }} />
                <span className="h-1 w-1 rounded-full bg-current animate-typing-dot" style={{ animationDelay: '150ms' }} />
                <span className="h-1 w-1 rounded-full bg-current animate-typing-dot" style={{ animationDelay: '300ms' }} />
              </div>
            ) : (
              <ArrowUp size={14} strokeWidth={2.5} />
            )}
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between mt-1.5 px-1">
        <p className="text-[11px]" style={{ color: 'var(--color-text-subtle)' }}>
          <kbd className="rounded px-1 py-0.5 font-mono text-[10px]" style={{ backgroundColor: 'var(--color-surface-raised)', border: '1px solid var(--color-border)', color: 'var(--color-text-subtle)' }}>Enter</kbd>
          {' '}to send ·{' '}
          <kbd className="rounded px-1 py-0.5 font-mono text-[10px]" style={{ backgroundColor: 'var(--color-surface-raised)', border: '1px solid var(--color-border)', color: 'var(--color-text-subtle)' }}>Shift+Enter</kbd>
          {' '}for new line
        </p>
        {isNearLimit && (
          <span className="text-[11px] tabular-nums" style={{ color: charsRemaining < 0 ? 'var(--color-error)' : 'var(--color-text-subtle)' }}>
            {charsRemaining}
          </span>
        )}
      </div>
    </form>
  );
}
