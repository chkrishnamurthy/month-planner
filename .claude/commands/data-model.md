Explain or extend the data model for the Monthly Salary Planner. Request: $ARGUMENTS

## If no arguments — explain the current model:

Show the complete current data model:

1. **Read** `src/lib/categories.ts` — show `CategoryKey`, `Expenses`, `Category` types and the `CATEGORIES` array
2. **Read** `src/firebase/budget.ts` — show `MonthData`, `sanitize()`, `emptyMonth()`
3. Explain the Firestore structure: `users/{uid}/months/{monthId}`
4. Show example Firestore document for a typical month
5. Explain how `monthId` format works (read `src/lib/monthId.ts`)

## If arguments mention adding a field:

1. Identify where the new field belongs: `MonthData`, per-category in `Expenses`, or a new sub-collection
2. Show exact code changes needed in:
   - `src/lib/categories.ts` (if category-related)
   - `src/firebase/budget.ts` (sanitize, emptyMonth, and any CRUD functions)
   - Relevant hooks in `src/hooks/`
3. Note any UI components that would need updating
4. Warn about backwards compatibility: existing Firestore documents won't have the new field — ensure `sanitize()` handles missing values with a safe default

## If arguments mention a new collection or feature:

Design the Firestore schema:
- Collection path
- Document shape with TypeScript interface
- CRUD functions to add to `src/firebase/`
- Hook to add to `src/hooks/`
- Whether Firebase Security Rules need updating
