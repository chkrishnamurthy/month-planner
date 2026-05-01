import { CATEGORIES } from '../lib/categories';
import { formatCompactINR, formatINR, pct } from '../lib/format';

export default function CategoryRow({
  categoryKey,
  amount,
  total,
  showPercent = false,
  compact = false,
  trailing,
  onClick,
}) {
  const cat = CATEGORIES.find((c) => c.key === categoryKey);
  if (!cat) return null;
  const Wrapper = onClick ? 'button' : 'div';
  return (
    <Wrapper
      onClick={onClick}
      className={`w-full flex items-center gap-3 py-3 ${
        onClick ? 'active:bg-line-light/60 dark:active:bg-line-dark rounded-2xl px-2 -mx-2' : ''
      }`}
    >
      <span
        className="w-9 h-9 rounded-xl grid place-items-center text-base shrink-0"
        style={{ backgroundColor: `${cat.color}22`, color: cat.color }}
        aria-hidden
      >
        {cat.emoji}
      </span>
      <div className="min-w-0 flex-1 text-left">
        <div className="text-sm font-medium">{cat.label}</div>
        {showPercent && total > 0 && (
          <div className="text-xs text-muted-light dark:text-muted-dark num">
            {pct(amount, total)}%
          </div>
        )}
      </div>
      <div className="text-sm font-semibold num">
        {compact ? formatCompactINR(amount) : formatINR(amount)}
      </div>
      {trailing}
    </Wrapper>
  );
}
