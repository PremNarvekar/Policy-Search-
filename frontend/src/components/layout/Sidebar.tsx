import { NavLink } from 'react-router-dom';
import { Plus, Settings, Shield, MessageSquare } from 'lucide-react';

interface SidebarProps {
  onNavigate?: () => void;
}

export function Sidebar({ onNavigate }: SidebarProps) {
  return (
    <aside
      className="flex h-full w-60 flex-col"
      style={{
        backgroundColor: 'var(--color-surface)',
        borderRight: '1px solid var(--color-border)',
      }}
      aria-label="Main navigation"
    >
      {/* Brand */}
      <div
        className="flex h-13 items-center gap-2.5 px-4"
        style={{ borderBottom: '1px solid var(--color-border)', height: '52px' }}
      >
        <div
          className="flex h-6 w-6 items-center justify-center rounded-md flex-shrink-0"
          style={{ backgroundColor: 'var(--color-primary)', color: '#fff' }}
          aria-hidden="true"
        >
          <Shield size={13} strokeWidth={2.5} />
        </div>
        <span
          className="text-sm font-semibold tracking-tight"
          style={{ color: 'var(--color-text)' }}
        >
          PolicySearch
        </span>
      </div>

      {/* New Chat */}
      <div className="p-3">
        <NavLink to="/chat" onClick={onNavigate}>
          <button
            className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors duration-150"
            style={{
              backgroundColor: 'var(--color-surface-raised)',
              color: 'var(--color-text)',
              border: '1px solid var(--color-border)',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'var(--color-surface-overlay)';
              (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--color-border-strong)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'var(--color-surface-raised)';
              (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--color-border)';
            }}
          >
            <Plus size={14} strokeWidth={2} style={{ color: 'var(--color-text-muted)' }} />
            New chat
          </button>
        </NavLink>
      </div>

      {/* History — empty state */}
      <div className="flex-1 overflow-y-auto px-3 pb-2">
        <p
          className="mb-2 px-1 text-[10px] font-semibold uppercase tracking-widest"
          style={{ color: 'var(--color-text-subtle)' }}
        >
          Recent
        </p>

        {/* Empty state — no fake data */}
        <div
          className="flex flex-col items-center justify-center rounded-md px-3 py-6 text-center"
          style={{ border: '1px dashed var(--color-border)' }}
        >
          <MessageSquare
            size={16}
            style={{ color: 'var(--color-text-subtle)', marginBottom: '6px' }}
          />
          <p className="text-xs" style={{ color: 'var(--color-text-subtle)' }}>
            No conversations yet
          </p>
        </div>
      </div>

      {/* Footer — Settings link */}
      <div className="p-3" style={{ borderTop: '1px solid var(--color-border)' }}>
        <NavLink to="/settings" onClick={onNavigate}>
          {({ isActive }) => (
            <div
              className="flex items-center gap-2.5 rounded-md px-3 py-2 text-sm transition-colors duration-150 cursor-pointer"
              style={{
                backgroundColor: isActive ? 'var(--color-surface-raised)' : 'transparent',
                color: isActive ? 'var(--color-text)' : 'var(--color-text-muted)',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLDivElement).style.backgroundColor = 'var(--color-surface-raised)';
                (e.currentTarget as HTMLDivElement).style.color = 'var(--color-text)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.backgroundColor = isActive ? 'var(--color-surface-raised)' : 'transparent';
                (e.currentTarget as HTMLDivElement).style.color = isActive ? 'var(--color-text)' : 'var(--color-text-muted)';
              }}
            >
              <Settings size={14} />
              Settings
            </div>
          )}
        </NavLink>
      </div>
    </aside>
  );
}
