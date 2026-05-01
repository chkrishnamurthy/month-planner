import { useTheme } from '../context/ThemeContext';

const ICONS = {
  light: (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
    </svg>
  ),
  dark: (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z" />
    </svg>
  ),
  system: (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="12" rx="2" />
      <path d="M8 20h8M12 16v4" />
    </svg>
  ),
};

const NEXT_LABEL = { light: 'Dark', dark: 'System', system: 'Light' };

export default function ThemeToggle() {
  const { mode, cycle } = useTheme();
  return (
    <button
      onClick={cycle}
      title={`Theme: ${mode} (click for ${NEXT_LABEL[mode]})`}
      className="inline-flex items-center justify-center w-9 h-9 rounded-full border border-line-light dark:border-line-dark bg-card-light dark:bg-card-dark text-neutral-900 dark:text-neutral-100 active:scale-95 transition"
      aria-label="Toggle theme"
    >
      {ICONS[mode]}
    </button>
  );
}
