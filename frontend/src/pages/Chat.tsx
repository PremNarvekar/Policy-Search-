import React, { useState, useRef, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useChat } from '../hooks/useChat';
import type { Message } from '../types';
import { ChatInput } from '../components/chat/ChatInput';
import { ChatMessage } from '../components/chat/ChatMessage';
import { Trash2, Bot } from 'lucide-react';

export function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const chatMutation = useChat();

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, chatMutation.isPending, scrollToBottom]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const question = input.trim();
    if (!question || chatMutation.isPending) return;

    const userMessage: Message = {
      id: uuidv4(),
      role: 'user',
      content: question,
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');

    chatMutation.mutate(
      { question },
      {
        onSuccess: (data) => {
          const assistantMessage: Message = {
            id: uuidv4(),
            role: 'assistant',
            content: data.answer,
            createdAt: new Date().toISOString(),
            sources: data.sources,
            confidence: data.confidence,
            responseTime: data.responseTime,
            retrievedDocuments: data.retrievedDocuments,
          };
          setMessages((prev) => [...prev, assistantMessage]);
        },
        onError: (error: Error) => {
          const errorMessage: Message = {
            id: uuidv4(),
            role: 'assistant',
            content: `**Something went wrong.** ${error.message || 'Please try again.'}`,
            createdAt: new Date().toISOString(),
          };
          setMessages((prev) => [...prev, errorMessage]);
        },
      }
    );
  };

  const handleClearChat = () => {
    setMessages([]);
    chatMutation.reset();
  };

  const isEmpty = messages.length === 0;

  return (
    <div
      className="flex flex-col h-full relative"
      style={{ backgroundColor: 'var(--color-bg)' }}
    >
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto pb-40">
        {isEmpty ? (
          /* Empty State */
          <div className="flex h-full flex-col items-center justify-center p-8 text-center min-h-[400px]">
            <div
              className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg animate-fade-in"
              style={{
                backgroundColor: 'var(--color-surface-raised)',
                color: 'var(--color-text-muted)',
                border: '1px solid var(--color-border)',
              }}
            >
              <Bot size={18} />
            </div>

            <h2
              className="mb-2 text-base font-semibold animate-fade-in"
              style={{ color: 'var(--color-text)', animationDelay: '50ms' }}
            >
              How can I help you?
            </h2>
            <p
              className="max-w-xs text-sm animate-fade-in"
              style={{ color: 'var(--color-text-muted)', animationDelay: '100ms' }}
            >
              Ask any question about your policy documents and I'll find a sourced answer.
            </p>
          </div>
        ) : (
          <div className="flex flex-col">
            {messages.map((msg) => (
              <ChatMessage key={msg.id} message={msg} />
            ))}

            {/* Typing indicator */}
            {chatMutation.isPending && (
              <div
                className="w-full animate-fade-in"
                style={{
                  borderTop: '1px solid var(--color-border)',
                  borderBottom: '1px solid var(--color-border)',
                  backgroundColor: 'var(--color-surface)',
                }}
              >
                <div className="mx-auto flex max-w-3xl gap-4 px-4 py-5 md:px-6">
                  <div
                    className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-md"
                    style={{
                      backgroundColor: 'var(--color-surface-overlay)',
                      color: 'var(--color-text-muted)',
                      border: '1px solid var(--color-border)',
                    }}
                  >
                    <Bot size={13} />
                  </div>
                  <div className="flex flex-col gap-3 flex-1">
                    <span
                      className="text-[10px] font-semibold uppercase tracking-widest"
                      style={{ color: 'var(--color-text-subtle)' }}
                    >
                      PolicySearch
                    </span>
                    <div className="flex items-center gap-1">
                      {[0, 150, 300].map((delay) => (
                        <span
                          key={delay}
                          className="h-1.5 w-1.5 rounded-full animate-typing-dot"
                          style={{
                            backgroundColor: 'var(--color-text-muted)',
                            animationDelay: `${delay}ms`,
                          }}
                        />
                      ))}
                    </div>
                    <div className="space-y-2">
                      <div className="skeleton h-2.5 w-2/3" />
                      <div className="skeleton h-2.5 w-1/2" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input Area */}
      <div
        className="absolute bottom-0 left-0 right-0 px-4 pb-5 pt-8 md:px-0"
        style={{
          background: `linear-gradient(to top, var(--color-bg) 65%, transparent)`,
        }}
      >
        {/* Clear chat */}
        {!isEmpty && (
          <div className="mx-auto mb-2 flex max-w-3xl justify-end">
            <button
              onClick={handleClearChat}
              className="flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors duration-150"
              style={{ color: 'var(--color-text-subtle)' }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.color = 'var(--color-error)';
                (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'var(--color-error-muted)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.color = 'var(--color-text-subtle)';
                (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'transparent';
              }}
              title="Clear conversation"
            >
              <Trash2 size={11} />
              Clear
            </button>
          </div>
        )}

        <ChatInput
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onSubmit={handleSubmit}
          isLoading={chatMutation.isPending}
        />
      </div>
    </div>
  );
}
