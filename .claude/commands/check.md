Run a full health check on the Monthly Salary Planner codebase and report any issues.

Perform all of the following checks:

## 1. TypeScript
Run `npx tsc --noEmit` and report:
- Number of errors (if any)
- Each error with file path, line number, and a plain-English explanation
- Suggested fix for each error

## 2. Missing or Broken Imports
Scan `src/` for any imports that reference non-existent files:
```
grep -r "from '\.\." src/ | grep -v node_modules
```
Check that each imported path exists.

## 3. Unused Exports
Look for components or functions that are exported but never imported anywhere in `src/`.

## 4. Firebase Config
Check that `.env.local` exists and has all required variables:
- VITE_FIREBASE_API_KEY
- VITE_FIREBASE_AUTH_DOMAIN
- VITE_FIREBASE_PROJECT_ID
- VITE_FIREBASE_STORAGE_BUCKET
- VITE_FIREBASE_MESSAGING_SENDER_ID
- VITE_FIREBASE_APP_ID

Check `src/firebase/config.ts` uses these env vars correctly.

## 5. Data Model Consistency
Verify that `CategoryKey` union in `src/lib/categories.ts`, the `CATEGORIES` array, and the `expenses` object in `emptyMonth()` / `sanitize()` in `src/firebase/budget.ts` all have the same set of keys.

## 6. Route Consistency
Check that every `<Route>` in `src/App.tsx` has a corresponding nav link in `BottomNav.tsx` or `Sidebar.tsx` (and vice versa).

## Summary
End with a table:
| Check | Status | Issues |
|---|---|---|
| TypeScript | ✅ / ❌ | count |
| Imports | ✅ / ❌ | count |
| Data model | ✅ / ❌ | detail |
| Firebase config | ✅ / ❌ | detail |
| Route consistency | ✅ / ❌ | detail |
