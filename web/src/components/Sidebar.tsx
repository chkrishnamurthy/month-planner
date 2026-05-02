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
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth={active ? 2.4 : 1.8} strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 12l9-8 9 8" />
        <path d="M5 10v10h14V10" />
      </svg>
    ),
  },
  {
    to: '/history',
    label: 'History',
    icon: (active) => (
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth={active ? 2.4 : 1.8} strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
      </svg>
    ),
  },
  {
    to: '/insights',
    label: 'Insights',
    icon: (active) => (
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth={active ? 2.4 : 1.8} strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 19V9M10 19V5M16 19v-7M22 19H2" />
      </svg>
    ),
  },
  {
    to: '/profile',
    label: 'Profile',
    icon: (active) => (
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth={active ? 2.4 : 1.8} strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4Zm0 2c-4 0-7 2-7 4v2h14v-2c0-2-3-4-7-4Z" />
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
    <aside className="hidden md:flex flex-col md:w-16 lg:w-64 shrink-0 border-r border-line-light dark:border-line-dark bg-bg-light/85 dark:bg-bg-dark/85 backdrop-blur-md md:p-3 lg:p-5 sticky top-0 h-dvh overflow-hidden">
      {/* Brand */}
      <div className="flex items-center justify-center lg:justify-start gap-2.5 mb-8 lg:mb-10 lg:px-3 mt-1">
        <span className="w-9 h-9 shrink-0 rounded-xl bg-hero text-accent grid place-items-center font-bold text-lg">
          P
        </span>
        <span className="hidden lg:block font-semibold tracking-tight text-xl">Plan</span>
      </div>

      {/* Nav */}
      <nav className="flex flex-col gap-1.5">
        {items.map((it) => (
          <NavLink
            key={it.to}
            to={it.to}
            end={it.to === '/'}
            title={it.label}
            className={({ isActive }) =>
              `flex items-center justify-center lg:justify-start gap-3 px-2 lg:px-3 py-2.5 rounded-2xl text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white'
                  : 'text-muted-light dark:text-muted-dark hover:bg-neutral-50 dark:hover:bg-neutral-900 hover:text-neutral-900 dark:hover:text-white'
              }`
            }
          >
            {({ isActive }) => (
              <>
                {it.icon(isActive)}
                <span className="hidden lg:inline text-base">{it.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      {user && (
        <div className="mt-auto pt-4 border-t border-line-light dark:border-line-dark">
          {/* Full user row — lg only */}
          <div className="hidden lg:flex items-center gap-3 px-3 py-2 mb-2">
            {user.photoURL ? (
              <img
                src={user.photoURL}
                alt=""
                className="w-8 h-8 rounded-full shrink-0"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-line-light dark:bg-line-dark grid place-items-center text-xs font-medium shrink-0">
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

          {/* Avatar only — md (icon mode) */}
          <div className="flex lg:hidden justify-center pb-2">
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
          </div>

          <button
            onClick={handleSignOut}
            disabled={busy}
            title="Sign out"
            className="w-full flex items-center justify-center lg:justify-start gap-3 px-2 lg:px-3 py-2.5 rounded-2xl text-sm font-medium text-muted-light dark:text-muted-dark hover:bg-neutral-50 dark:hover:bg-neutral-900 hover:text-neutral-900 dark:hover:text-white transition-colors disabled:opacity-50"
          >
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            <span className="hidden lg:inline text-base">{busy ? 'Signing out…' : 'Sign out'}</span>
          </button>
        </div>
      )}
    </aside>
  );
}
