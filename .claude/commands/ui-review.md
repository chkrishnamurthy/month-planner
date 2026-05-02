Review the UI of the Monthly Salary Planner for consistency, accessibility, and mobile quality. Scope: $ARGUMENTS

## What to check

### 1. Design Token Consistency
Scan all `src/components/` and `src/pages/` files and flag any:
- Hardcoded colors (hex values, `text-gray-*`, `bg-gray-*`) that should use design tokens
- Font sizes / weights that don't follow the typography pattern (`label-eyebrow`, `num`, etc.)
- Spacing values that break the visual rhythm (should use Tailwind scale)

### 2. Dark Mode Coverage
Check every component for elements that have light-mode colors but are missing `dark:` variants.
Look for patterns like `text-gray-500` without `dark:text-gray-400`, or `bg-white` without `dark:bg-*`.

### 3. Responsive Layout
Check pages use the standard responsive pattern:
- Mobile: `max-w-xl px-5` single column
- Desktop: `lg:max-w-5xl lg:grid-cols-2`

Flag any page that doesn't follow this pattern.

### 4. Loading & Empty States
Verify every page that fetches data has:
- A `<Spinner>` shown while `loading === true`
- An `<ErrorBanner>` shown when `error !== null`
- An empty state message when data is null/empty

### 5. Accessibility Quick Check
- All `<button>` and `<a>` elements should have visible text or `aria-label`
- `<img>` tags should have `alt` attributes
- Form inputs should have associated `<label>` elements
- Interactive SVG icons should have `aria-hidden`

### 6. Currency Formatting
Confirm all currency values use `formatINR` or `formatCompactINR` from `src/lib/format.ts`, not raw numbers or custom formatting.

## Output
For each issue found, report:
- File path + line number
- What the issue is
- Suggested fix (one line of code if simple)

If $ARGUMENTS specifies a specific component or page, focus the review on that file only.
