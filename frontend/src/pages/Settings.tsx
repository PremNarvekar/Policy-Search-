import { Server, Cpu, Layers, Code2, ExternalLink } from 'lucide-react';

const MODEL_INFO = [
  { label: 'LLM Model',           value: 'Gemini 2.5 Flash',          icon: Cpu },
  { label: 'Embedding Model',     value: 'text-embedding-004',         icon: Layers },
  { label: 'Vector Store',        value: 'ChromaDB (local)',            icon: Server },
  { label: 'Retrieval Strategy',  value: 'Hybrid — BM25 + Semantic',   icon: Code2 },
];

const API_ENDPOINTS = [
  { method: 'GET',  path: '/',       desc: 'Service info' },
  { method: 'GET',  path: '/health', desc: 'Health check with uptime' },
  { method: 'POST', path: '/chat',   desc: 'Submit a question, get a grounded answer' },
  { method: 'GET',  path: '/docs',   desc: 'OpenAPI interactive documentation' },
];

export function Settings() {
  const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:8000';

  return (
    <div
      className="flex flex-col h-full overflow-auto"
      style={{ backgroundColor: 'var(--color-bg)' }}
    >
      <div className="mx-auto w-full max-w-2xl p-6 md:p-8 space-y-8">

        {/* Header */}
        <div className="animate-fade-in">
          <h1 className="text-base font-semibold" style={{ color: 'var(--color-text)' }}>
            Settings
          </h1>
          <p className="mt-0.5 text-sm" style={{ color: 'var(--color-text-muted)' }}>
            Application configuration and model information.
          </p>
        </div>

        {/* Model Configuration */}
        <section className="animate-fade-in" style={{ animationDelay: '50ms' }}>
          <h2
            className="mb-3 text-[10px] font-semibold uppercase tracking-widest"
            style={{ color: 'var(--color-text-subtle)' }}
          >
            Model Configuration
          </h2>
          <div
            className="rounded-lg overflow-hidden"
            style={{ border: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface)' }}
          >
            {MODEL_INFO.map((item, i) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.label}
                  className="flex items-center justify-between px-4 py-3"
                  style={{ borderTop: i > 0 ? '1px solid var(--color-border)' : 'none' }}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon size={13} style={{ color: 'var(--color-text-subtle)' }} />
                    <span className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
                      {item.label}
                    </span>
                  </div>
                  <span className="text-sm font-medium font-mono" style={{ color: 'var(--color-text)' }}>
                    {item.value}
                  </span>
                </div>
              );
            })}
          </div>
        </section>

        {/* API Endpoints */}
        <section className="animate-fade-in" style={{ animationDelay: '100ms' }}>
          <div className="flex items-center justify-between mb-3">
            <h2
              className="text-[10px] font-semibold uppercase tracking-widest"
              style={{ color: 'var(--color-text-subtle)' }}
            >
              API Endpoints
            </h2>
            <a
              href={`${apiBase}/docs`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1 text-xs font-medium transition-colors"
              style={{ color: 'var(--color-primary)' }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.color = 'var(--color-primary-hover)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.color = 'var(--color-primary)';
              }}
            >
              Open docs
              <ExternalLink size={10} />
            </a>
          </div>
          <div
            className="rounded-lg overflow-hidden"
            style={{ border: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface)' }}
          >
            {API_ENDPOINTS.map((ep, i) => (
              <div
                key={ep.path}
                className="flex items-center gap-3 px-4 py-3"
                style={{ borderTop: i > 0 ? '1px solid var(--color-border)' : 'none' }}
              >
                {/* Method badge — neutral, no colors */}
                <span
                  className="w-10 rounded px-1.5 py-0.5 text-center text-[10px] font-bold font-mono flex-shrink-0"
                  style={{
                    backgroundColor: 'var(--color-surface-overlay)',
                    color: 'var(--color-text-muted)',
                    border: '1px solid var(--color-border)',
                  }}
                >
                  {ep.method}
                </span>
                <code
                  className="w-20 flex-shrink-0 text-xs font-mono"
                  style={{ color: 'var(--color-text)' }}
                >
                  {ep.path}
                </code>
                <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                  {ep.desc}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Environment */}
        <section className="animate-fade-in" style={{ animationDelay: '150ms' }}>
          <h2
            className="mb-3 text-[10px] font-semibold uppercase tracking-widest"
            style={{ color: 'var(--color-text-subtle)' }}
          >
            Environment
          </h2>
          <div
            className="flex items-center justify-between rounded-lg px-4 py-3"
            style={{ border: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface)' }}
          >
            <span className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
              API Base URL
            </span>
            <code
              className="text-xs font-mono rounded px-2 py-1"
              style={{
                color: 'var(--color-text)',
                backgroundColor: 'var(--color-surface-overlay)',
                border: '1px solid var(--color-border)',
              }}
            >
              {apiBase}
            </code>
          </div>
        </section>

      </div>
    </div>
  );
}
