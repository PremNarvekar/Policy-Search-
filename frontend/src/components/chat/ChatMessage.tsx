import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Bot, User, Zap, Database, Clock } from 'lucide-react';
import type { Message } from '../../types';
import { cn } from '../../utils/cn';

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === 'user';

  return (
    <div
      className={cn('w-full animate-fade-in')}
      style={
        !isUser
          ? {
              borderTop: '1px solid var(--color-border)',
              borderBottom: '1px solid var(--color-border)',
              backgroundColor: 'var(--color-surface)',
            }
          : {}
      }
    >
      <div className="mx-auto flex max-w-3xl gap-3.5 px-4 py-5 md:px-6">
        {/* Avatar */}
        <div className="flex-shrink-0 mt-0.5">
          {isUser ? (
            <div
              className="flex h-7 w-7 items-center justify-center rounded-md"
              style={{
                backgroundColor: 'var(--color-surface-overlay)',
                color: 'var(--color-text-muted)',
                border: '1px solid var(--color-border)',
              }}
              aria-hidden="true"
            >
              <User size={13} />
            </div>
          ) : (
            <div
              className="flex h-7 w-7 items-center justify-center rounded-md"
              style={{
                backgroundColor: 'var(--color-surface-overlay)',
                color: 'var(--color-primary)',
                border: '1px solid var(--color-border)',
              }}
              aria-hidden="true"
            >
              <Bot size={13} />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex flex-col flex-1 min-w-0 gap-2.5">
          {/* Sender label */}
          <span
            className="text-[10px] font-semibold uppercase tracking-widest"
            style={{ color: 'var(--color-text-subtle)' }}
          >
            {isUser ? 'You' : 'PolicySearch'}
          </span>

          {/* Message body */}
          <div className="prose-chat text-sm break-words">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {message.content}
            </ReactMarkdown>
          </div>

          {/* Metadata badges */}
          {!isUser &&
            (message.confidence !== undefined ||
              message.responseTime !== undefined ||
              message.retrievedDocuments !== undefined) && (
              <div
                className="flex flex-wrap gap-1.5 pt-3"
                style={{ borderTop: '1px solid var(--color-border)' }}
              >
                {message.confidence !== undefined && (
                  <span
                    className="inline-flex items-center gap-1 rounded px-2 py-1 text-[11px] font-medium"
                    style={{
                      backgroundColor: 'var(--color-surface-overlay)',
                      color: 'var(--color-text-muted)',
                      border: '1px solid var(--color-border)',
                    }}
                  >
                    <Zap size={10} />
                    {(message.confidence * 100).toFixed(0)}% confidence
                  </span>
                )}
                {message.responseTime !== undefined && (
                  <span
                    className="inline-flex items-center gap-1 rounded px-2 py-1 text-[11px] font-medium"
                    style={{
                      backgroundColor: 'var(--color-surface-overlay)',
                      color: 'var(--color-text-muted)',
                      border: '1px solid var(--color-border)',
                    }}
                  >
                    <Clock size={10} />
                    {message.responseTime}ms
                  </span>
                )}
                {message.retrievedDocuments !== undefined && (
                  <span
                    className="inline-flex items-center gap-1 rounded px-2 py-1 text-[11px] font-medium"
                    style={{
                      backgroundColor: 'var(--color-surface-overlay)',
                      color: 'var(--color-text-muted)',
                      border: '1px solid var(--color-border)',
                    }}
                  >
                    <Database size={10} />
                    {message.retrievedDocuments} docs
                  </span>
                )}
              </div>
            )}

          {/* Source pills */}
          {!isUser && message.sources && message.sources.length > 0 && (
            <div className="flex flex-col gap-1.5">
              <span
                className="text-[10px] font-semibold uppercase tracking-widest"
                style={{ color: 'var(--color-text-subtle)' }}
              >
                Sources
              </span>
              <div className="flex flex-wrap gap-1.5">
                {message.sources.map((source, i) => (
                  <a
                    key={source.id ?? i}
                    href={source.url ?? '#'}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 rounded px-2 py-1 text-[11px] font-medium transition-colors duration-150"
                    style={{
                      backgroundColor: 'var(--color-surface-raised)',
                      color: 'var(--color-text-muted)',
                      border: '1px solid var(--color-border)',
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLAnchorElement).style.color = 'var(--color-primary)';
                      (e.currentTarget as HTMLAnchorElement).style.borderColor = 'var(--color-border-strong)';
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLAnchorElement).style.color = 'var(--color-text-muted)';
                      (e.currentTarget as HTMLAnchorElement).style.borderColor = 'var(--color-border)';
                    }}
                  >
                    [{i + 1}] {source.title}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
