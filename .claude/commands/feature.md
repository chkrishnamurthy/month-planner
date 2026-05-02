Plan and implement a new feature for the Monthly Salary Planner app. Feature request: $ARGUMENTS

Work through these phases:

## Phase 1 — Understand & Plan
1. Restate the feature in one sentence.
2. Identify which existing files will be touched (pages, components, hooks, firebase/, lib/).
3. List any new files that need to be created.
4. Flag any data model changes (new fields on `MonthData`, new Firestore collections).
5. Note any UX considerations: which page(s) show this feature, any new routes needed, mobile nav changes.
6. Present the plan and ask for confirmation before writing any code.

## Phase 2 — Implement (after confirmation)
Work in this order:
1. Data layer first: `src/lib/` types, `src/firebase/budget.ts` if Firestore changes needed
2. Hooks: new or updated hooks in `src/hooks/`
3. Components: new or updated components in `src/components/`
4. Pages: wire everything together in `src/pages/`
5. Routing: update `src/App.tsx` if new routes needed
6. Navigation: update `BottomNav.tsx` and `Sidebar.tsx` if new nav items needed

## Phase 3 — Verify
- Run `npx tsc --noEmit` and fix any type errors
- Confirm the feature works for: logged-in user, loading state, error state, empty data state
- Check dark mode looks correct

## Constraints to respect
- Currency always in INR — use `formatINR` / `formatCompactINR` from `src/lib/format.ts`
- Month IDs always `"YYYY-MM"` — use helpers from `src/lib/monthId.ts`
- Never call Firestore directly from components — go through `src/firebase/budget.ts`
- Never access auth state directly — use `useAuth()` from `AuthContext`
- Keep pages responsive: `max-w-xl` on mobile, `lg:max-w-5xl` on desktop, `lg:grid-cols-2` layout where possible

If no feature was described in $ARGUMENTS, ask the user to describe the feature before proceeding.
