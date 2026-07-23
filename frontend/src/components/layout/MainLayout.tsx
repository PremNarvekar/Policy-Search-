import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Menu, Shield } from 'lucide-react';
import { useState } from 'react';

export function MainLayout() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const closeMobile = () => setIsMobileOpen(false);

  return (
    <div
      className="flex h-screen w-full overflow-hidden"
      style={{ backgroundColor: 'var(--color-bg)', color: 'var(--color-text)' }}
    >
      {/* Desktop Sidebar */}
      <div className="hidden md:flex flex-shrink-0">
        <Sidebar />
      </div>

      {/* Mobile Sidebar Overlay */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-40 flex md:hidden">
          <div
            className="fixed inset-0 bg-black/50"
            onClick={closeMobile}
            aria-hidden="true"
          />
          <div
            className="relative z-50 w-60 h-full animate-fade-in-scale"
            style={{ transformOrigin: 'left center' }}
          >
            <Sidebar onNavigate={closeMobile} />
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden min-w-0">
        {/* Mobile Header */}
        <header
          className="md:hidden flex items-center px-4 flex-shrink-0"
          style={{
            height: '52px',
            borderBottom: '1px solid var(--color-border)',
            backgroundColor: 'var(--color-surface)',
          }}
        >
          <button
            onClick={() => setIsMobileOpen(true)}
            className="flex h-7 w-7 items-center justify-center rounded-md transition-colors"
            style={{ color: 'var(--color-text-muted)' }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'var(--color-surface-raised)';
              (e.currentTarget as HTMLButtonElement).style.color = 'var(--color-text)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'transparent';
              (e.currentTarget as HTMLButtonElement).style.color = 'var(--color-text-muted)';
            }}
            aria-label="Open navigation"
          >
            <Menu size={16} />
          </button>
          <div className="flex items-center gap-2 ml-2">
            <div
              className="flex h-5 w-5 items-center justify-center rounded"
              style={{ backgroundColor: 'var(--color-primary)', color: '#fff' }}
            >
              <Shield size={11} strokeWidth={2.5} />
            </div>
            <span className="text-sm font-semibold" style={{ color: 'var(--color-text)' }}>
              PolicySearch
            </span>
          </div>
        </header>

        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
