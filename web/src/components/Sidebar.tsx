import { useState, type ReactElement } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface NavItem {
  to: string;
  label: string;
  icon: (active: boolean) => ReactElement;
}

const items: NavItem[] = [
  {
    to: '/',
    label: 'Plan',
    icon: (active) => (
      <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth={active ? 2.4 : 1.8} strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 12l9-8 9 8" />
        <path d="M5 10v10h14V10" />
      </svg>
    ),
  },
  {
    to: '/history',
    label: 'History',
    icon: (active) => (
      <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth={active ? 2.4 : 1.8} strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
      </svg>
    ),
  },
  {
    to: '/insights',
    label: 'Insights',
    icon: (active) => (
      <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth={active ? 2.4 : 1.8} strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 19V9M10 19V5M16 19v-7M22 19H2" />
      </svg>
    ),
  },
];

export default function Sidebar() {
  const { user, signOut } = useAuth();
  const [busy, setBusy] = useState(false);

  const handleSignOut = async () => {
    if (busy) return;
    setBusy(true);
    try {
      await signOut();
    } finally {
      setBusy(false);
    }
  };

  return (
    <aside className="hidden md:flex flex-col w-64 border-r border-line-light dark:border-line-dark bg-bg-light/85 dark:bg-bg-dark/85 backdrop-blur-md p-5 sticky top-0 h-dvh">
      <div className="flex items-center gap-2.5 group mb-10 px-3">
        <span className="w-9 h-9 rounded-xl bg-hero text-accent grid place-items-center font-bold text-lg">
          P
        </span>
        <span className="font-semibold tracking-tight text-xl">Plan</span>
      </div>

      <nav className="flex flex-col gap-2">
        {items.map((it) => (
          <NavLink
            key={it.to}
            to={it.to}
            end={it.to === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-3 rounded-2xl text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white'
                  : 'text-muted-light dark:text-muted-dark hover:bg-neutral-50 dark:hover:bg-neutral-900 hover:text-neutral-900 dark:hover:text-white'
              }`
            }
          >
            {({ isActive }) => (
              <>
                {it.icon(isActive)}
                <span className="text-base">{it.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {user && (
        <div className="mt-auto pt-4 border-t border-line-light dark:border-line-dark">
          <div className="flex items-center gap-3 px-3 py-2 mb-2">
            {user.photoURL ? (
              <img
                src={user.photoURL}
                alt=""
                className="w-8 h-8 rounded-full"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-line-light dark:bg-line-dark grid place-items-center text-xs font-medium">
                {(user.displayName || user.email || '·')[0]?.toUpperCase()}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium truncate">
                {user.displayName || user.email || 'You'}
              </div>
              {user.email && (
                <div className="text-xs text-muted-light dark:text-muted-dark truncate">
                  {user.email}
                </div>
              )}
            </div>
          </div>
          <button
            onClick={handleSignOut}
            disabled={busy}
            className="w-full flex items-center gap-3 px-3 py-3 rounded-2xl text-sm font-medium text-muted-light dark:text-muted-dark hover:bg-neutral-50 dark:hover:bg-neutral-900 hover:text-neutral-900 dark:hover:text-white transition-colors disabled:opacity-50"
          >
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            <span className="text-base">{busy ? 'Signing out…' : 'Sign out'}</span>
          </button>
        </div>
      )}
    </aside>
  );
}
