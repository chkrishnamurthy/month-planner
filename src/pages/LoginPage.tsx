import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const { signInWithGoogle, error } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleSignIn = async () => {
    setLoading(true);
    try {
      await signInWithGoogle();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-dvh bg-bg-light dark:bg-bg-dark flex flex-col items-center justify-center px-5">
      {/* Background glow */}
      <div
        className="pointer-events-none fixed inset-0 overflow-hidden"
        aria-hidden
      >
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-accent/10 blur-[120px]" />
      </div>

      <div className="relative w-full max-w-sm">
        {/* Logo */}
        <div className="flex flex-col items-center gap-4 mb-10">
          <div className="w-16 h-16 rounded-2xl bg-hero text-accent grid place-items-center font-bold text-3xl shadow-soft">
            P
          </div>
          <div>
            <h1 className="text-center text-3xl font-semibold tracking-tight">
              Plan
            </h1>
            <p className="mt-1 text-center text-sm text-muted-light dark:text-muted-dark">
              Your monthly salary planner
            </p>
          </div>
        </div>

        {/* Card */}
        <div className="bg-card-light dark:bg-card-dark rounded-3xl border border-line-light dark:border-line-dark p-8 shadow-soft">
          <div className="label-eyebrow text-center mb-1">Welcome</div>
          <h2 className="text-center text-xl font-semibold tracking-tight mb-6">
            Sign in to continue
          </h2>

          {error && (
            <div className="mb-4 rounded-2xl border border-red-200 dark:border-red-900/60 bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 px-4 py-3 text-sm text-center">
              {error.message || 'Sign-in failed. Please try again.'}
            </div>
          )}

          <button
            onClick={handleSignIn}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 rounded-full border border-line-light dark:border-line-dark bg-card-light dark:bg-card-dark hover:bg-line-light/50 dark:hover:bg-line-dark/50 px-5 py-3.5 text-sm font-semibold transition active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="inline-block w-5 h-5 rounded-full border-2 border-current border-t-transparent animate-spin" />
            ) : (
              /* Google 'G' SVG */
              <svg width="20" height="20" viewBox="0 0 48 48" aria-hidden>
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
                <path fill="none" d="M0 0h48v48H0z"/>
              </svg>
            )}
            {loading ? 'Signing in…' : 'Continue with Google'}
          </button>

          <p className="mt-5 text-center text-xs text-muted-light dark:text-muted-dark leading-relaxed">
            By signing in you agree to use this app<br />responsibly. Your data is stored in Firestore.
          </p>
        </div>

        {/* Features */}
        <div className="mt-8 grid grid-cols-3 gap-3 text-center">
          {[
            { emoji: '📊', label: 'Track spending' },
            { emoji: '💾', label: 'Cloud sync' },
            { emoji: '📈', label: 'Insights' },
          ].map((f) => (
            <div
              key={f.label}
              className="rounded-2xl bg-card-light dark:bg-card-dark border border-line-light dark:border-line-dark p-3"
            >
              <div className="text-xl mb-1">{f.emoji}</div>
              <div className="text-xs font-medium text-muted-light dark:text-muted-dark">
                {f.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
