import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function SignOutButton() {
  const { user, signOut } = useAuth();
  const [busy, setBusy] = useState(false);

  if (!user) return null;

  const handleClick = async () => {
    if (busy) return;
    setBusy(true);
    try {
      await signOut();
    } finally {
      setBusy(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={busy}
      title="Sign out"
      aria-label="Sign out"
      className="inline-flex items-center justify-center w-9 h-9 rounded-full border border-line-light dark:border-line-dark bg-card-light dark:bg-card-dark text-neutral-900 dark:text-neutral-100 active:scale-95 transition disabled:opacity-50"
    >
      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
        <polyline points="16 17 21 12 16 7" />
        <line x1="21" y1="12" x2="9" y2="12" />
      </svg>
    </button>
  );
}
