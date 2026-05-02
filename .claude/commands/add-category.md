Add a new expense category to the Monthly Salary Planner app. The new category name is: $ARGUMENTS

Follow these exact steps in order:

1. **src/lib/categories.ts** — Add the new key to `CategoryKey` union type, add a new entry to the `CATEGORIES` array with a fitting `label`, `color` (hex), and `emoji`. Keep the existing 5 categories untouched.

2. **src/firebase/budget.ts** — Add the new key with value `0` to the `expenses` object inside `sanitize()` and `emptyMonth()`. Update the `Expenses` type import if needed (it comes from `categories.ts`).

3. Verify `totalExpenses` in `src/lib/categories.ts` still works (it uses `CATEGORY_KEYS` which is derived automatically — no change needed).

4. **Check** that `EditMonthPage` and `DashboardPage` both use `CATEGORIES.map(...)` — they should pick up the new category automatically with no changes needed.

5. Run a TypeScript check to confirm no errors: `npx tsc --noEmit`

6. Report: which files changed, what the new category looks like, and confirm the app will show it on Dashboard, Edit, History, and Insights pages.

If no category name was provided in $ARGUMENTS, ask the user for the category name, label, emoji, and color before proceeding.
