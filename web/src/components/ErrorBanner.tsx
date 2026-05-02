interface Props {
  error?: Error | string | null;
  onRetry?: () => void;
}

export default function ErrorBanner({ error, onRetry }: Props) {
  if (!error) return null;
  const message =
    (error as Error)?.message || (typeof error === 'string' ? error : 'Something went wrong.');
  return (
    <div className="rounded-2xl border border-red-200 dark:border-red-900/60 bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 px-4 py-3 text-sm flex items-center justify-between gap-3">
      <span>{message}</span>
      {onRetry && (
        <button
          onClick={onRetry}
          className="rounded-full bg-red-100 dark:bg-red-900/40 px-3 py-1 text-xs font-medium hover:brightness-95"
        >
          Retry
        </button>
      )}
    </div>
  );
}
