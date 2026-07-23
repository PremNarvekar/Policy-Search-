import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Search, FileText, Zap, Cpu, Shield } from 'lucide-react';

// Real architecture steps — reflects what the app actually does
const PIPELINE: { icon: typeof FileText; label: string; desc: string }[] = [
  { icon: FileText, label: 'Ingest',    desc: 'PDF extraction & chunking' },
  { icon: Search,   label: 'Embed',     desc: 'Gemini vector embeddings → ChromaDB' },
  { icon: Zap,      label: 'Retrieve',  desc: 'BM25 + semantic hybrid search' },
  { icon: Cpu,      label: 'Generate',  desc: 'Gemini 2.5 Flash grounded answer' },
];

export function Landing() {
  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: 'var(--color-bg)', color: 'var(--color-text)' }}
    >
      {/* Header */}
      <header
        className="sticky top-0 z-10 flex h-13 items-center justify-between px-5"
        style={{
          height: '52px',
          borderBottom: '1px solid var(--color-border)',
          backgroundColor: 'var(--color-bg)',
        }}
      >
        <div className="flex items-center gap-2">
          <div
            className="flex h-6 w-6 items-center justify-center rounded-md"
            style={{ backgroundColor: 'var(--color-primary)', color: '#fff' }}
          >
            <Shield size={13} strokeWidth={2.5} />
          </div>
          <span className="text-sm font-semibold" style={{ color: 'var(--color-text)' }}>
            PolicySearch
          </span>
        </div>

        <Link to="/chat">
          <button
            className="rounded-md px-3 py-1.5 text-xs font-medium transition-colors duration-150"
            style={{
              backgroundColor: 'var(--color-primary)',
              color: '#fff',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'var(--color-primary-hover)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'var(--color-primary)';
            }}
          >
            Open app
          </button>
        </Link>
      </header>

      {/* Hero */}
      <main className="flex flex-1 flex-col items-center justify-center px-5 py-24 text-center">

        <h1
          className="mb-4 max-w-xl text-4xl font-bold tracking-tight md:text-5xl animate-fade-in"
          style={{ color: 'var(--color-text)', lineHeight: 1.15 }}
        >
          Ask anything about your policies
        </h1>

        <p
          className="mb-8 max-w-md text-sm leading-relaxed animate-fade-in"
          style={{ color: 'var(--color-text-muted)', animationDelay: '60ms' }}
        >
          A production-grade RAG application. Get accurate, sourced answers
          from your policy documents using hybrid retrieval and Gemini AI.
        </p>

        <div className="flex items-center gap-2 animate-fade-in" style={{ animationDelay: '120ms' }}>
          <Link to="/chat">
            <button
              className="flex items-center gap-1.5 rounded-md px-4 py-2 text-sm font-medium transition-colors duration-150 active:scale-[0.98]"
              style={{ backgroundColor: 'var(--color-primary)', color: '#fff' }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'var(--color-primary-hover)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'var(--color-primary)';
              }}
            >
              Start chatting
              <ArrowRight size={14} />
            </button>
          </Link>

          <a
            href="#how-it-works"
            className="rounded-md px-4 py-2 text-sm font-medium transition-colors duration-150"
            style={{
              color: 'var(--color-text-muted)',
              border: '1px solid var(--color-border)',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.backgroundColor = 'var(--color-surface-raised)';
              (e.currentTarget as HTMLAnchorElement).style.color = 'var(--color-text)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.backgroundColor = 'transparent';
              (e.currentTarget as HTMLAnchorElement).style.color = 'var(--color-text-muted)';
            }}
          >
            How it works
          </a>
        </div>
      </main>

      {/* Pipeline Section */}
      <section
        id="how-it-works"
        className="w-full px-5 py-16"
        style={{ borderTop: '1px solid var(--color-border)' }}
      >
        <div className="mx-auto max-w-4xl">
          <h2
            className="mb-2 text-center text-sm font-semibold uppercase tracking-widest"
            style={{ color: 'var(--color-text-subtle)' }}
          >
            How it works
          </h2>
          <p
            className="mb-10 text-center text-sm"
            style={{ color: 'var(--color-text-muted)' }}
          >
            A four-stage RAG pipeline from document to grounded answer
          </p>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {PIPELINE.map((step, i) => {
              const Icon = step.icon;
              return (
                <React.Fragment key={step.label}>
                  <PipelineStep icon={Icon} label={step.label} desc={step.desc} index={i} />
                </React.Fragment>
              );
            })}
          </div>

          {/* Connector */}
          <div
            className="mt-4 hidden items-center justify-center gap-1.5 text-xs lg:flex"
            style={{ color: 'var(--color-text-subtle)' }}
          >
            {PIPELINE.map((step, i) => (
              <React.Fragment key={step.label}>
                <span>{step.label}</span>
                {i < PIPELINE.length - 1 && (
                  <ArrowRight size={11} style={{ opacity: 0.4 }} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer
        className="flex h-12 items-center justify-center"
        style={{ borderTop: '1px solid var(--color-border)' }}
      >
        <p className="text-xs" style={{ color: 'var(--color-text-subtle)' }}>
          PolicySearch · FastAPI · LangChain · Gemini 2.5 Flash
        </p>
      </footer>
    </div>
  );
}

function PipelineStep({
  icon: Icon,
  label,
  desc,
  index,
}: {
  icon: typeof FileText;
  label: string;
  desc: string;
  index: number;
}) {
  return (
    <div
      className="rounded-lg p-4 transition-colors duration-150 animate-fade-in"
      style={{
        backgroundColor: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        animationDelay: `${index * 50}ms`,
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--color-border-strong)';
        (e.currentTarget as HTMLDivElement).style.backgroundColor = 'var(--color-surface-raised)';
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--color-border)';
        (e.currentTarget as HTMLDivElement).style.backgroundColor = 'var(--color-surface)';
      }}
    >
      <div
        className="mb-3 flex h-7 w-7 items-center justify-center rounded-md"
        style={{
          backgroundColor: 'var(--color-surface-overlay)',
          border: '1px solid var(--color-border)',
          color: 'var(--color-text-muted)',
        }}
      >
        <Icon size={14} />
      </div>
      <p className="mb-0.5 text-sm font-semibold" style={{ color: 'var(--color-text)' }}>
        {label}
      </p>
      <p className="text-xs leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>
        {desc}
      </p>
    </div>
  );
}
