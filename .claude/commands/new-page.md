Scaffold a new protected page in the Monthly Salary Planner app. Page details: $ARGUMENTS

Follow these steps:

1. **Create `src/pages/{PageName}Page.tsx`** with:
   - Default export functional component
   - `AppHeader` with a section label (e.g. `"04 · {PageName}"`)
   - Outer `<div className="min-h-dvh pb-28">` wrapper with `<div className="mx-auto max-w-xl lg:max-w-5xl px-5">` inner container
   - A page title using `<h1 className="mt-2 text-4xl sm:text-5xl font-semibold tracking-tight leading-[1.05]">`
   - `useAuth()` if the page needs user data
   - Loading/error states if the page fetches data (use `Spinner` and `ErrorBanner` components)

2. **Register the route in `src/App.tsx`** — add a `<Route>` inside the existing routes, wrapped in `<PrivateRoute>`. Choose a sensible path like `/page-name`.

3. **Add to bottom nav in `src/components/BottomNav.tsx`** — check the existing nav items pattern and add an appropriate icon and label.

4. **Add to sidebar in `src/components/Sidebar.tsx`** — follow the same pattern as existing nav links.

5. Run `npx tsc --noEmit` to verify no type errors.

6. Report the new file path, route path, and nav label added.

If no page name or purpose was provided in $ARGUMENTS, ask before proceeding.
