# Design System — Monthly Salary Planner

> **For AI tools**: Read this file before making any UI change. Use only the tokens, classes, and patterns documented here. Do not introduce new colors, shadows, font sizes, or component patterns without checking this file first.

---

## Color Tokens

All colors are defined in [tailwind.config.js](tailwind.config.js). Use the semantic token names, never raw hex values in class names.

### Backgrounds
| Token | Light | Dark | Usage |
|---|---|---|---|
| `bg-bg-light` / `bg-bg-dark` | `#F6F5F0` | `#0A0A0A` | Page background (`body`) |
| `bg-card-light` / `bg-card-dark` | `#FFFFFF` | `#141414` | Card surfaces, modals |
| `bg-hero` | `#0A0A0A` | `#0A0A0A` | Hero cards, nav brand mark |

### Accent
| Token | Value | Usage |
|---|---|---|
| `bg-accent` / `text-accent` | `#C7F051` (lime green) | CTAs, active states, save rate tile, progress bars |
| `text-accent-ink` | `#0A0A0A` | Text **on** accent backgrounds (always dark) |

### Text
| Token | Light | Dark | Usage |
|---|---|---|---|
| `text-neutral-900` | `#171717` | — | Primary body text (set on `body`) |
| `text-neutral-100` | — | `#F5F5F5` | Primary body text in dark mode |
| `text-muted-light` / `text-muted-dark` | `#6B6B66` | `#8A8A85` | Secondary text, labels, eyebrows |

### Borders / Dividers
| Token | Light | Dark | Usage |
|---|---|---|---|
| `border-line-light` / `border-line-dark` | `#E8E6DD` | `#1F1F1F` | Card borders, dividers, input rings |

### Category Colors (preset palette)
Stored as Tailwind tokens AND used as `color` prop values in `Category` objects from the API.
| Token | Hex | Category |
|---|---|---|
| `cat-rent` | `#8AB4F8` | Rent (blue) |
| `cat-food` | `#FF9A6B` | Food (orange) |
| `cat-travel` | `#F4D03F` | Travel (yellow) |
| `cat-bills` | `#A8E063` | Bills (green) |
| `cat-misc` | `#C9A8FF` | Misc (purple) |

Additional swatch options used in `AddCategoryModal`: `#F48FB1`, `#80DEEA`, `#FFCC80`, `#A5D6A7`, `#EF9A9A`.

**Category icon background**: always `${color}22` (hex color + 22 = ~13% opacity). Text on icon: the full `color` value.

---

## CSS Component Classes

Defined in [src/index.css](src/index.css) under `@layer components`. Use these directly — never re-implement them with raw Tailwind.

### `.card`
```
bg-card-light dark:bg-card-dark  rounded-3xl  border border-line-light dark:border-line-dark
```
Standard surface for content sections. Pair with `p-5 sm:p-6` for internal padding.

### `.card-hero`
```
bg-hero  text-white  rounded-3xl
```
Full-bleed dark card. Used for RemainingCard and the big stats hero on Insights. Modify `bg-hero` with an inline `bg-red-950` override for over-budget states.

### `.pill`
Base class for pill-shaped buttons. Never use alone — always use a variant:

### `.pill-ghost`
```
pill  bg-card-light dark:bg-card-dark  border border-line-light dark:border-line-dark  text-neutral-900 dark:text-neutral-100
```
Secondary / navigation actions (Back, Edit plan, Edit all).

### `.pill-accent`
```
pill  bg-accent  text-accent-ink  hover:brightness-95
```
Primary CTA (New month, Create).

### `.label-eyebrow`
```
text-[11px]  font-medium  tracking-[0.14em]  uppercase  text-muted-light dark:text-muted-dark
```
Section labels, category names in secondary contexts, page section identifiers ("01 · Dashboard"). On dark hero cards use `text-white/60` override.

### `.num`
```
font-variant-numeric: tabular-nums
```
Apply to any element that shows numbers to prevent layout shift. Always add to amount values, percentages, dates.

---

## Typography

**Font family**: Inter (loaded via CDN), fallback `ui-sans-serif, system-ui`.

| Usage | Classes |
|---|---|
| Page H1 | `text-4xl sm:text-5xl font-semibold tracking-tight leading-[1.05]` |
| Section H1 (edit page) | `text-3xl font-semibold tracking-tight` |
| Hero number (RemainingCard) | `text-[clamp(56px,16vw,112px)] font-semibold num tracking-tight leading-[0.95]` |
| Savings rate number | `text-7xl sm:text-8xl font-semibold num text-accent leading-[0.9] tracking-tight` |
| Hero 5xl number (EditPage) | `text-5xl font-semibold num tracking-tight` |
| Card primary value | `text-2xl sm:text-3xl font-semibold num tracking-tight` |
| StatTile value | `text-2xl sm:text-3xl font-semibold num tracking-tight` |
| List item label | `text-sm font-medium` |
| List item sub | `text-xs text-muted-light dark:text-muted-dark num` |
| Body / paragraph | `text-sm text-muted-light dark:text-muted-dark` |

---

## Border Radius

| Value | Token | Usage |
|---|---|---|
| `rounded-3xl` | 1.5rem | Cards, StatTile, modals, the main content surfaces |
| `rounded-2xl` | 1rem | Input containers, sheet options, smaller interactive items |
| `rounded-xl` | 0.75rem | Category icon badges (w-9/w-10 squares) |
| `rounded-full` | 9999px | Pills, action buttons (FloatingSaveButton), toggles, avatar |
| `rounded-md` | 0.375rem | Bar chart segments in CategoryTrendCard |

---

## Shadows

| Token | Value | Usage |
|---|---|---|
| `shadow-soft` | `0 1px 2px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.04)` | MonthCard hover, FloatingSaveButton, Toast |

---

## Responsive Breakpoints

Custom breakpoints are defined in [tailwind.config.js](tailwind.config.js). `3xl` (1920px) is added for large/ultra-wide monitors.

| Breakpoint | Width | What changes |
|---|---|---|
| _(default)_ | 0–639px | Phone portrait. 1-col. BottomNav visible. No sidebar. |
| `sm` | 640px+ | Phone landscape. Side-by-side inside some cards. Still 1-col page layout. |
| `md` | 768px+ | Tablet. Sidebar appears (icon-only, 64px). BottomNav hidden. **2-col page grid** unlocks. |
| `lg` | 1024px+ | Small desktop. Sidebar expands to full labels (256px). Wider padding. |
| `xl` | 1280px+ | Desktop. **3-col page grid** unlocks on Dashboard, Insights, EditMonth. |
| `2xl` | 1536px+ | Large desktop. StatTile grid goes to 4-col. Category trends go 2-col. |
| `3xl` | 1920px+ | 27"+ monitors. History adds 7th column. Padding expands further. |

### Sidebar widths
```
md: w-16  (64px — icons only, title attribute for tooltip)
lg: w-64  (256px — icons + text labels)
```

### Content containers — ALL pages use the same pattern
```tsx
<div className="w-full px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-12 3xl:px-16">
```
**No `max-width`. No `mx-auto`.** The sidebar constrains the outer width naturally. Content fills 100% of the remaining space at every breakpoint.
- Login page is the only exception: `max-w-sm mx-auto` (no sidebar)
- Modals/sheets: `sm:max-w-md` (dialog constraint, not page layout)

### 3-column page grid — Dashboard, Insights, EditMonth
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 xl:gap-6 items-start">
  {/* Col 1 — always left */}
  <ColumnOne />

  {/* Col 2 — right at md, middle at xl */}
  <ColumnTwo />

  {/* Col 3 — spans 2 cols at md (full-width row), 1 col at xl */}
  <div className="md:col-span-2 xl:col-span-1 ...">
    <ColumnThree />
  </div>
</div>
```
At `md` (2-col): Col 1 + Col 2 share row 1; Col 3 spans the full width on row 2.
At `xl` (3-col): All three sit in a single row, each at 1/3 of the available width.

### Dashboard column contents
| Col | md layout | xl layout |
|---|---|---|
| 1 | RemainingCard | RemainingCard |
| 2 | AllocationDonut + breakdown list | AllocationDonut + breakdown list |
| 3 (spans 2 at md) | StatTile grid + QuickEdit | StatTile grid + QuickEdit |

### Insights column contents
| Col | md layout | xl layout |
|---|---|---|
| 1 | Savings rate hero | Savings rate hero |
| 2 | TotalAllocatedBars + CategoryTrends | TotalAllocatedBars only |
| 3 (hidden at md) | — | CategoryTrends (shown via `hidden xl:flex`) |

For Insights col 3, use `xl:hidden` on the in-col-2 trends and `hidden xl:flex` on col 3.

### StatTile grid (4 tiles)
```tsx
className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-2 2xl:grid-cols-4 gap-3"
```
At md (col spans 2): 4 tiles in one row. At xl (1/3 col): 2×2. At 2xl (wider 1/3): back to 4-in-a-row.

### History page grid
```tsx
className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 3xl:grid-cols-7 gap-3"
```

### Category trends grid (inside InsightsPage col 3)
```tsx
className="grid grid-cols-1 2xl:grid-cols-2 gap-3"
```

### Bottom padding
```
pb-28 md:pb-10   →  pages with BottomNav (BottomNav is md:hidden)
pb-32 md:pb-10   →  EditMonthPage (FloatingSaveButton is md:hidden)
```

### FloatingSaveButton
- On desktop (`md+`): hidden. An inline "Save plan" button renders inside the categories card.
- On mobile: `fixed bottom-0 left-0 right-0 md:left-16 lg:left-64` (sidebar-aware offset).

### BottomNav
Fixed to `md:hidden`. Page containers use `pb-28` on mobile to clear it.

---

## Dark Mode

The app uses `darkMode: 'class'` (set/toggled by `ThemeContext`). Every element that has a light-mode color must have a `dark:` counterpart.

**Required pairs**:
```
bg-card-light        → dark:bg-card-dark
border-line-light    → dark:border-line-dark
text-muted-light     → dark:text-muted-dark
bg-bg-light          → dark:bg-bg-dark
divide-line-light    → dark:divide-line-dark
bg-neutral-200       → dark:bg-neutral-700   (Skeleton)
bg-red-950/40        → use on error states inside dark cards
```

**On `.card-hero` (dark bg)**: use `text-white`, `text-white/60`, `text-white/65` — never `text-muted-*`.

---

## Spacing Conventions

| Gap | Usage |
|---|---|
| `gap-3` | Grid of cards (StatTile grid, MonthCard grid) |
| `gap-5` | Vertical stack of sections (`flex flex-col gap-5`) |
| `gap-6` | Two-column desktop grid gap |
| `p-5 sm:p-6` | Standard card padding |
| `p-6` | Hero card padding |
| `px-2` | List item horizontal inset inside `.card` sections |
| `py-3` | List item vertical padding (CategoryRow, CategoryInput) |
| `px-3 pt-3` | Section header inside card |

---

## Icons

All icons are **inline SVGs**. No icon library.

Standard attributes:
```tsx
<svg width="14" height="14" viewBox="0 0 24 24" fill="none"
     stroke="currentColor" strokeWidth="2"
     strokeLinecap="round" strokeLinejoin="round" aria-hidden>
```

| Context | strokeWidth |
|---|---|
| Pill buttons, header actions | `2` |
| BottomNav inactive | `1.8` |
| BottomNav active | `2.4` |
| Add / plus icons | `2.4` |

Icons inherit text color via `stroke="currentColor"`. Do not hard-code a stroke color.

---

## Animation & Interaction

| Pattern | Classes | Usage |
|---|---|---|
| Scale press | `active:scale-[0.99]` | Cards, FloatingSaveButton |
| Scale press (small) | `active:scale-[0.98]` | `.pill` base |
| Brightness hover | `hover:brightness-95` | `.pill-accent` |
| Background press | `active:bg-line-light/60 dark:active:bg-line-dark` | `CategoryRow` when `onClick` is set |
| Transition | `transition` | Card hover shadow, color changes |
| Focus ring | `focus-within:ring-2 focus-within:ring-accent` | Input wrappers |

**Skeleton / loading**: use the `Skeleton` component (`animate-pulse bg-neutral-200 dark:bg-neutral-700`). Every data-displaying page has a skeleton layout that mirrors the real layout structure — never show a full-page spinner alone.

---

## Component Catalog

### `Skeleton` · [src/components/Skeleton.tsx](src/components/Skeleton.tsx)
Base skeleton block. Use `className` for `h-*` and `w-*`.
```tsx
<Skeleton className="h-4 w-32" />
<SkeletonText lines={2} />
<SkeletonCard />
<SkeletonList items={3} />
```

### `StatTile` · [src/components/StatTile.tsx](src/components/StatTile.tsx)
2×2 stats grid tile. Accent variant uses lime background.
```tsx
<StatTile label="Save Rate" value="42%" accent />
<StatTile label="Days Left" value={12} sub="of 31" />
<StatTileSkeleton />
```

### `CategoryRow` · [src/components/CategoryRow.tsx](src/components/CategoryRow.tsx)
Read-only display row with emoji badge, name, optional percent, amount.
```tsx
<CategoryRow category={cat} amount={12000} total={total} showPercent compact />
<CategoryRow category={cat} amount={12000} total={total} onClick={() => navigate(...)} />
<CategoryRowSkeleton showPercent compact />
```

### `CategoryInput` · [src/components/CategoryInput.tsx](src/components/CategoryInput.tsx)
Editable row — same badge, text input on the right.
```tsx
<CategoryInput category={cat} value={expenses[cat.id]} onChange={(v) => ...} />
<CategoryInputSkeleton />
```

### `AllocationDonut` · [src/components/AllocationDonut.tsx](src/components/AllocationDonut.tsx)
Recharts donut chart. Requires both `month` and `categories` props.
```tsx
<AllocationDonut month={month} categories={categories} />
<AllocationDonutSkeleton />
```

### `RemainingCard` · [src/components/RemainingCard.tsx](src/components/RemainingCard.tsx)
`.card-hero` block showing remaining budget with allocation progress bar. Pass `isCurrent` to show day counter.
```tsx
<RemainingCard month={month} isCurrent />
```

### `MonthCard` · [src/components/MonthCard.tsx](src/components/MonthCard.tsx)
Linked card for HistoryPage grid. Needs `categories` for the color segments bar.
```tsx
<MonthCard month={m} categories={categories} isCurrent={m.monthId === cur} />
```

### `CategoryTrendCard` · [src/components/CategoryTrendCard.tsx](src/components/CategoryTrendCard.tsx)
Mini spark-bar trend card for InsightsPage.
```tsx
<CategoryTrendCard category={cat} series={[12000, 15000, 11000, 14000, 13000, 16000]} />
<CategoryTrendCardSkeleton />
```

### `AddCategoryModal` · [src/components/AddCategoryModal.tsx](src/components/AddCategoryModal.tsx)
Bottom-sheet modal (full-width on mobile, centered on sm+). Emoji picker + color swatches + duplicate validation.
```tsx
<AddCategoryModal
  open={showAddModal}
  onClose={() => setShowAddModal(false)}
  existingNames={categories.map((c) => c.name)}
  onCreate={async (data) => { await createCategory(data); }}
/>
```

### `TotalAllocatedBars` · [src/components/TotalAllocatedBars.tsx](src/components/TotalAllocatedBars.tsx)
Vertical bar chart for 6-month total allocation. Current month bar is highlighted.
```tsx
<TotalAllocatedBars data={six} currentId={latestId} />
<TotalAllocatedBarsSkeleton />
```

### `FloatingSaveButton` · [src/components/FloatingSaveButton.tsx](src/components/FloatingSaveButton.tsx)
Sticky bottom CTA with gradient bleed. Always `pb-32` on pages that use it.
```tsx
<FloatingSaveButton onClick={handleSave} saving={saving} disabled={loading} label="Save" />
```

### `ErrorBanner` · [src/components/ErrorBanner.tsx](src/components/ErrorBanner.tsx)
Inline error block. Optional retry button.
```tsx
<ErrorBanner error={error} onRetry={reload} />
```

### `Toast` · [src/components/Toast.tsx](src/components/Toast.tsx)
Auto-dismissing top-center notification. Always `bg-hero text-accent`.
```tsx
<Toast message="Saved" show={showToast} onDone={() => setShowToast(false)} />
```

### `AppHeader` · [src/components/AppHeader.tsx](src/components/AppHeader.tsx)
Page header — logo (mobile only), section label, theme toggle, sign-out.
```tsx
<AppHeader section="01 · Dashboard" />
```

### `BottomNav` · [src/components/BottomNav.tsx](src/components/BottomNav.tsx)
Fixed bottom navigation for mobile. Hidden on `md:`. Three tabs: Plan `/`, History `/history`, Insights `/insights`.

### `Spinner` · [src/components/Spinner.tsx](src/components/Spinner.tsx)
Thin-ring SVG spinner. Use sparingly — prefer skeleton layouts.
```tsx
<Spinner size={28} />
```

---

## Modal / Sheet Pattern

All modals use this fixed overlay + bottom-sheet layout:
```tsx
<div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
  {/* backdrop */}
  <div className="absolute inset-0 bg-black/50" onClick={onClose} aria-hidden />
  {/* panel */}
  <div className="relative w-full sm:max-w-md bg-card-light dark:bg-card-dark
                  rounded-t-3xl sm:rounded-3xl p-5 sm:p-6
                  border-t sm:border border-line-light dark:border-line-dark">
    ...
  </div>
</div>
```

- z-index: `z-50` for modals, `z-40` for Toast / overlays, `z-30` for BottomNav, `z-20` for FloatingSaveButton
- Close on backdrop click; disable close during async operations
- Two-button footer: `grid grid-cols-2 gap-3`
  - Cancel: `rounded-full px-4 py-3 text-sm font-medium border border-line-light dark:border-line-dark`
  - Confirm: `rounded-full px-4 py-3 text-sm font-semibold bg-accent text-accent-ink disabled:opacity-50`

---

## Loading States

Every page and data-heavy section must render a **skeleton layout** (not a spinner) that mirrors the real content structure.

Pattern:
```tsx
{loading ? (
  <SkeletonLayoutMatchingRealContent />
) : error ? (
  <ErrorBanner error={error} />
) : !data ? (
  <EmptyState />
) : (
  <RealContent />
)}
```

Skeleton sizing guide: match the visual footprint of the real element.
- Eyebrow label → `<Skeleton className="h-3 w-20" />`
- Large number → `<Skeleton className="h-12 w-32" />`
- Body text → `<Skeleton className="h-4 w-48" />`
- Icon badge → `<Skeleton className="w-9 h-9 rounded-xl" />`

---

## Adding a New UI Component

1. Create `web/src/components/ComponentName.tsx`
2. Export a `ComponentNameSkeleton` named export if the component shows async data
3. Use only tokens and classes from this document
4. Props interface: named `Props`, defined locally in the file
5. Import `Category` / `MonthData` types from `../firebase/budget` — not from `../lib/categories`
6. Do not add new Tailwind colors or custom CSS — extend `tailwind.config.js` and `index.css` instead, then document here

---

## What NOT to Do

- Do not use raw hex values in `className` — use the token alias
- Do not use `text-gray-*` — use `text-muted-light dark:text-muted-dark` or `text-neutral-*`
- Do not use `bg-white` / `bg-black` directly — use `bg-card-light` / `bg-hero`
- Do not add `shadow-md`, `shadow-lg` etc. — only `shadow-soft` exists in this system
- Do not use `rounded-lg` or `rounded-2xl` for cards — cards are always `rounded-3xl`
- Do not use `<Spinner>` as the primary loading state — use skeleton layouts
- Do not hard-code category colors — always read from the `Category` object's `.color` field
- Do not import from `../lib/categories` for component/type imports — `totalExpenses` and `remaining` are the only exports from that file
