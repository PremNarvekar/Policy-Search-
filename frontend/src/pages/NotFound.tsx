import { Link } from 'react-router-dom';

export function NotFound() {
  return (
    <div
      className="flex min-h-screen flex-col items-center justify-center px-6"
      style={{ backgroundColor: 'var(--color-bg)', color: 'var(--color-text)' }}
    >
      <div className="text-center animate-fade-in">
        {/* 404 number */}
        <p
          className="text-8xl font-bold tabular-nums tracking-tight"
          style={{ color: 'var(--color-surface-overlay)' }}
        >
          404
        </p>

        {/* Message */}
        <h1 className="mt-4 text-xl font-semibold" style={{ color: 'var(--color-text)' }}>
          Page not found
        </h1>
        <p className="mt-2 text-sm max-w-xs mx-auto" style={{ color: 'var(--color-text-muted)' }}>
          The page you're looking for doesn't exist or has been moved.
        </p>

        {/* CTA */}
        <div className="mt-8 flex justify-center">
          <Link to="/">
            <button
              className="rounded-lg px-5 py-2.5 text-sm font-medium transition-all duration-150 active:scale-[0.98]"
              style={{ backgroundColor: 'var(--color-primary)', color: '#fff' }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'var(--color-primary-hover)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'var(--color-primary)';
              }}
            >
              Back to home
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
