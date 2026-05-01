import type { ReactNode } from 'react';

interface Props {
  label: string;
  value: ReactNode;
  accent?: boolean;
  sub?: ReactNode;
}

export default function StatTile({ label, value, accent = false, sub }: Props) {
  return (
    <div
      className={`rounded-3xl p-5 ${
        accent
          ? 'bg-accent text-accent-ink'
          : 'bg-card-light dark:bg-card-dark border border-line-light dark:border-line-dark'
      }`}
    >
      <div
        className={`label-eyebrow ${
          accent ? 'text-accent-ink/70' : ''
        }`}
      >
        {label}
      </div>
      <div className="mt-1.5 text-2xl sm:text-3xl font-semibold num tracking-tight">
        {value}
      </div>
      {sub && (
        <div
          className={`mt-0.5 text-xs num ${
            accent ? 'text-accent-ink/70' : 'text-muted-light dark:text-muted-dark'
          }`}
        >
          {sub}
        </div>
      )}
    </div>
  );
}
