# Monthly Salary Planner — Claude Context

## What This App Does
A personal monthly budget planner. Users sign in with Google, set their monthly salary, allocate amounts across 5 fixed expense categories, and track savings rate over time.

## Tech Stack
- **React 18 + TypeScript** — Vite build, strict mode
- **Firebase** — Firestore (data), Google Auth
- **Tailwind CSS v3** — custom design tokens in `index.css`
- **Recharts** — charts on Insights page
- **React Router v6** — client-side routing

## Project Structure
```
src/
  pages/          # DashboardPage, EditMonthPage, HistoryPage, InsightsPage, LoginPage
  components/     # Shared UI (CategoryRow, AllocationDonut, StatTile, RemainingCard, …)
  hooks/          # useMonth (single month), useMonths (all months)
  context/        # AuthContext (Google auth), ThemeContext (dark/light)
  firebase/       # budget.ts (Firestore CRUD), config.ts (Firebase init)
  lib/            # categories.ts (types + constants), format.ts (₹ formatters), monthId.ts (date helpers)
```

## Data Model
```ts
// Firestore: users/{uid}/months/{monthId}
interface MonthData {
  monthId: string;   // "2025-01"
  salary:  number;
  expenses: {
    rent: number; food: number; travel: number; bills: number; misc: number;
  };
}
```

## Fixed Expense Categories
Defined in `src/lib/categories.ts`. Adding a new one requires updating `CategoryKey`, `CATEGORIES` array, and `emptyMonth` in `src/firebase/budget.ts`.

## Key Conventions
- Currency is always INR (₹). Use `formatINR` / `formatCompactINR` from `src/lib/format.ts`.
- Month IDs are `"YYYY-MM"` strings. Use helpers from `src/lib/monthId.ts`.
- All Firestore reads/writes go through `src/firebase/budget.ts` — never call Firestore directly from components.
- Auth state lives in `AuthContext`. Always get `user.uid` from `useAuth()`.
- Dark mode uses Tailwind's `dark:` variant. Use `text-muted-light dark:text-muted-dark` etc.
- Design tokens: `card`, `card-hero`, `pill-ghost`, `label-eyebrow`, `num` — defined in `index.css`.

## Pages & Routes
| Route | Page | Auth |
|---|---|---|
| `/login` | LoginPage | Public |
| `/` | DashboardPage | Protected |
| `/edit/:monthId` | EditMonthPage | Protected |
| `/history` | HistoryPage | Protected |
| `/insights` | InsightsPage | Protected |

## Available Slash Commands
| Command | What it does |
|---|---|
| `/add-category` | Add a new expense category end-to-end |
| `/new-page` | Scaffold a new page with routing |
| `/new-component` | Scaffold a typed React component |
| `/feature` | Plan and implement a new feature |
| `/check` | TypeScript compile check + issue summary |
| `/data-model` | Explain or extend the data model |
| `/firebase-status` | Verify Firebase config and Firestore rules |
