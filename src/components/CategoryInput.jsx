import { CATEGORIES } from '../lib/categories';

export default function CategoryInput({ categoryKey, value, onChange }) {
  const cat = CATEGORIES.find((c) => c.key === categoryKey);
  if (!cat) return null;
  const handle = (e) => {
    const raw = e.target.value.replace(/[^\d]/g, '');
    onChange(raw === '' ? '' : Number(raw));
  };
  return (
    <label className="flex items-center gap-3 py-3">
      <span
        className="w-10 h-10 rounded-xl grid place-items-center text-base shrink-0"
        style={{ backgroundColor: `${cat.color}22`, color: cat.color }}
        aria-hidden
      >
        {cat.emoji}
      </span>
      <span className="flex-1 text-sm font-medium">{cat.label}</span>
      <span className="flex items-center gap-1 rounded-2xl bg-line-light/60 dark:bg-line-dark px-3 py-2 focus-within:ring-2 focus-within:ring-accent">
        <span className="text-muted-light dark:text-muted-dark text-sm">₹</span>
        <input
          inputMode="numeric"
          pattern="[0-9]*"
          value={value === 0 ? '' : value}
          placeholder="0"
          onChange={handle}
          className="w-28 sm:w-32 bg-transparent text-right text-base font-semibold num outline-none"
        />
      </span>
    </label>
  );
}
