export default function Spinner({ size = 24, className = '' }) {
  return (
    <span
      className={`inline-block animate-spin rounded-full border-2 border-current border-t-transparent ${className}`}
      style={{ width: size, height: size }}
      aria-label="Loading"
    />
  );
}

export function FullPageSpinner() {
  return (
    <div className="min-h-dvh flex items-center justify-center text-muted-light dark:text-muted-dark">
      <Spinner size={32} />
    </div>
  );
}
