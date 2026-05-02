Scaffold a new React component for the Monthly Salary Planner. Component details: $ARGUMENTS

Follow these steps:

1. **Create `src/components/{ComponentName}.tsx`** with:
   - Named export (not default) matching the filename
   - Typed props interface defined above the component
   - Tailwind classes only — no inline styles
   - Dark mode support using `dark:` variants where applicable
   - Use existing design tokens: `card`, `card-hero`, `pill-ghost`, `label-eyebrow`, `num` (defined in `src/index.css`)
   - Use `formatINR` / `formatCompactINR` from `src/lib/format.ts` for any currency values
   - Use `CATEGORIES` from `src/lib/categories.ts` for any category-related rendering

2. **If it's a chart component**, use Recharts — look at `AllocationDonut.tsx` or `CategoryTrendCard.tsx` for patterns.

3. **If it's a stat/metric display**, follow `StatTile.tsx` pattern.

4. **If it displays per-category data**, follow `CategoryRow.tsx` pattern.

5. Run `npx tsc --noEmit` to confirm no type errors.

6. Show the component API (props interface) and a usage example.

If no component name or purpose was provided in $ARGUMENTS, ask for: component name, what data it displays, and where it will be used.
