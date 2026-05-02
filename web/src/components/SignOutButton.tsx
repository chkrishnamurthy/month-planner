import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function SignOutButton() {
  const { user, signOut } = useAuth();
  const [busy, setBusy] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  if (!user) return null;

  const handleClick = () => {
    setShowConfirmation(true);
  };

  const handleConfirm = async () => {
    if (busy) return;
    setBusy(true);
    try {
      await signOut();
    } finally {
      setBusy(false);
      setShowConfirmation(false);
    }
  };

  const handleCancel = () => {
    setShowConfirmation(false);
  };

  return (
    <>
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

      {/* Confirmation Dialog */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black/50 dark:bg-black/60 flex items-center justify-center z-50">
          <div className="bg-card-light dark:bg-card-dark rounded-lg shadow-lg p-6 max-w-sm mx-4">
            <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
              Confirm Sign Out
            </h2>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-6">
              Are you sure you want to sign out? You'll need to sign in again to access your budget.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={handleCancel}
                disabled={busy}
                className="px-4 py-2 text-sm font-medium text-neutral-900 dark:text-neutral-100 bg-neutral-100 dark:bg-neutral-700 rounded hover:bg-neutral-200 dark:hover:bg-neutral-600 transition disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                disabled={busy}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded hover:bg-red-700 transition disabled:opacity-50 flex items-center gap-2"
              >
                {busy ? (
                  <>
                    <svg className="animate-spin w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" />
                      <path d="M4 12a8 8 0 0 1 15.3-2" stroke="currentColor" strokeWidth="2" fill="none" />
                    </svg>
                    Signing out...
                  </>
                ) : (
                  'Sign Out'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
