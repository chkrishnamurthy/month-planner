Copy budget plan from one month to another in the Monthly Salary Planner. Arguments: $ARGUMENTS

This command helps when the user wants to reuse a previous month's plan (salary + allocations) as a starting point for a new month.

## Step 1 — Parse arguments
Expected format: `copy-month <from-monthId> <to-monthId>` e.g. `copy-month 2025-01 2025-02`

If arguments are missing or unclear, ask:
- Which month to copy FROM (format: YYYY-MM)
- Which month to copy TO (format: YYYY-MM)

## Step 2 — Verify the function exists
Read `src/firebase/budget.ts` and confirm `copyFromMonth(uid, fromId, toId)` is exported. If not, implement it:
```ts
export async function copyFromMonth(uid: string, fromId: string, toId: string): Promise<MonthData> {
  const source = await getMonth(uid, fromId);
  if (!source) throw new Error(`Month ${fromId} not found`);
  return saveMonth(uid, toId, { ...source, monthId: toId });
}
```

## Step 3 — Check UI exposure
Check if there is already a "copy from last month" button in `EditMonthPage.tsx`. If not, offer to add one:
- A button labeled "Copy from [previous month]" that appears when the current month has no data yet
- It should call `copyFromMonth` and then reload the form with the copied values
- Place it near the salary input section

## Step 4 — Implement if confirmed
If the user wants the UI button added:
1. Add a `copyFromPrev` handler in `EditMonthPage.tsx` that uses `copyFromMonth`
2. Show the button only when `month.salary === 0` (empty month)
3. Previous month ID: subtract 1 month from `monthId` using logic from `src/lib/monthId.ts`
4. Show a Toast on success

Run `npx tsc --noEmit` after changes.
