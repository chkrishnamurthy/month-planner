import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import ErrorBanner from '../components/ErrorBanner';
import Spinner from '../components/Spinner';
import ThemeToggle from '../components/ThemeToggle';

export default function LoginPage() {
  const { signInWithGoogle } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSignIn = async () => {
    setLoading(true);
    setError(null);
    try {
      await signInWithGoogle();
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-dvh px-5 py-6 flex flex-col">
      <div className="flex justify-end">
        <ThemeToggle />
      </div>
      <div className="flex-1 flex items-center justify-center">
        <div className="w-full max-w-sm">
          <div className="flex items-center gap-3">
            <span className="w-12 h-12 rounded-2xl bg-hero text-accent grid place-items-center font-bold text-2xl">
              P
            </span>
            <span className="text-2xl font-semibold tracking-tight">Plan</span>
          </div>
          <h1 className="mt-10 text-4xl font-semibold tracking-tight leading-[1.05]">
            Plan the month,
            <br />
            not the day.
          </h1>
          <p className="mt-4 text-muted-light dark:text-muted-dark">
            A simple monthly budget. Set salary, allocate categories, see what's
            left. Nothing more.
          </p>

          <div className="mt-8">
            <button
              onClick={handleSignIn}
              disabled={loading}
              className="w-full inline-flex items-center justify-center gap-3 rounded-full bg-accent text-accent-ink px-5 py-4 font-semibold text-base shadow-soft active:scale-[0.99] disabled:opacity-60"
            >
              {loading ? (
                <Spinner size={18} />
              ) : (
                <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden>
                  <path fill="#0A0A0A" d="M44.5 20H24v8.5h11.8C34.7 33 30 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.7 1.1 7.8 2.9l6.3-6.3C34.5 5.1 29.6 3 24 3 12.4 3 3 12.4 3 24s9.4 21 21 21c12.1 0 20.5-8.5 20.5-20.5 0-1.4-.2-2.7-.5-4z"/>
                </svg>
              )}
              <span>Continue with Google</span>
            </button>
            <div className="mt-4">
              <ErrorBanner error={error} />
            </div>
          </div>

          <p className="mt-10 text-xs text-muted-light dark:text-muted-dark">
            Your data stays in your own Firebase project.
          </p>
        </div>
      </div>
    </div>
  );
}
