# Monthly Salary Planner — Agent Context

## Project Overview

A full-stack personal monthly budget planner. Users sign in with Google (Firebase Auth), set their monthly salary, allocate amounts across user-defined expense categories, and track savings rate over time. The React frontend communicates with an Express REST API that persists all data in PostgreSQL (Neon) via Prisma ORM.

---

## Repository Structure

```
planner/
├── web/                    React 18 + Vite + TypeScript  →  port 5173
│   └── src/
│       ├── pages/          DashboardPage, EditMonthPage, HistoryPage, InsightsPage, LoginPage
│       ├── components/     CategoryRow, CategoryInput, AllocationDonut, AddCategoryModal,
│       │                   StatTile, RemainingCard, MonthCard, CategoryTrendCard, …
│       ├── hooks/          useMonth, useMonths, useCategories
│       ├── context/        AuthContext (Firebase Auth), ThemeContext (dark/light)
│       ├── firebase/       budget.ts (API fetch client + types), config.ts (Firebase init)
│       └── lib/            categories.ts (totalExpenses, remaining), format.ts (₹), monthId.ts
│
└── api/                    Node.js + Express + TypeScript  →  port 3001
    ├── prisma/
    │   └── schema.prisma
    └── src/
        ├── index.ts
        ├── controllers/    monthController.ts, userController.ts, categoryController.ts
        ├── routes/         monthRoutes.ts, userRoutes.ts, categoryRoutes.ts
        ├── middleware/     auth.ts, errorHandler.ts, validate.ts
        ├── services/       monthService.ts, categoryService.ts
        └── lib/            prisma.ts, firebase.ts
```

---

## Tech Stack

| Layer       | Technology                                                              |
|-------------|-------------------------------------------------------------------------|
| Frontend    | React 18, TypeScript, Vite, Tailwind CSS v3, Recharts, React Router v6  |
| Auth        | Firebase Auth (Google OAuth) — client SDK + Admin SDK on API            |
| Backend     | Node.js, Express 4, TypeScript, Zod (validation)                        |
| Database    | PostgreSQL on Neon, Prisma ORM v5                                        |
| Dev tooling | tsx watch (API hot-reload), Prisma Studio                               |

---

## Database Schema

```prisma
model User {
  id          String     @id           // Firebase UID
  email       String     @unique
  displayName String?
  photoURL    String?
  lastLoginAt DateTime   @default(now())
  createdAt   DateTime   @default(now())
  months      Month[]
  categories  Category[]
}

model Category {
  id        String   @id @default(cuid())
  name      String
  emoji     String   @default("📁")
  color     String   @default("#8AB4F8")
  isDefault Boolean  @default(false)
  userId    String
  createdAt DateTime @default(now())
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  expenses  MonthExpense[]

  @@unique([userId, name])
  @@index([userId])
}

model Month {
  id        String   @id @default(cuid())
  monthId   String                        // "YYYY-MM"
  userId    String
  salary    Float    @default(0)
  updatedAt DateTime @updatedAt
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  expenses  MonthExpense[]

  @@unique([userId, monthId])
  @@index([userId])
}

model MonthExpense {
  id         String   @id @default(cuid())
  amount     Float    @default(0)
  monthId    String
  categoryId String
  month      Month    @relation(fields: [monthId], references: [id], onDelete: Cascade)
  category   Category @relation(fields: [categoryId], references: [id], onDelete: Cascade)

  @@unique([monthId, categoryId])
}
```

---

## API Endpoints

Base URL: `http://localhost:3001`

All `/users`, `/categories`, and `/months` routes require `Authorization: Bearer <firebase_id_token>`.

| Method | Path                    | Description                                          |
|--------|-------------------------|------------------------------------------------------|
| GET    | /health                 | Health check (public)                                |
| GET    | /users/me               | Current user profile + month count; seeds defaults  |
| GET    | /users                  | All users list                                       |
| GET    | /categories             | List all categories for authenticated user           |
| POST   | /categories             | Create a new user category                           |
| DELETE | /categories/:id         | Delete a user category                               |
| GET    | /months                 | List all months for authenticated user               |
| GET    | /months/:monthId        | Get single month by ID (YYYY-MM)                     |
| POST   | /months                 | Create or update a month (upsert)                    |
| POST   | /months/:monthId/copy   | Copy a month's plan to another month                 |

---

## Data Flow

```
Login
  User clicks "Sign in with Google"
  → Firebase Auth popup → onAuthStateChanged fires
  → AuthContext calls GET /users/me  (upserts user in Neon, seeds 5 default categories)

Read / write budget
  → useMonth / useMonths / useCategories hooks
  → web/src/firebase/budget.ts  (attaches JWT, calls fetch)
  → Express API  →  Prisma  →  PostgreSQL on Neon
```

The auth middleware (`api/src/middleware/auth.ts`) verifies every JWT and upserts the user row on each request — keeping Firebase and PostgreSQL in sync automatically.

---

## Data Models (Frontend)

```ts
// Defined in web/src/firebase/budget.ts
interface Category {
  id:        string;
  name:      string;
  emoji:     string;
  color:     string;
  isDefault: boolean;
  createdAt: string;
}

interface MonthData {
  monthId:  string;               // "YYYY-MM"
  salary:   number;
  expenses: Record<string, number>; // categoryId → amount
}
```

`api/src/services/monthService.ts → toMonthData()` maps `MonthExpense` rows to the `Record<string, number>` shape before returning to the frontend.

---

## Dynamic Categories

Categories are **user-specific** and stored in the `Category` table. On first login (`GET /users/me`), `categoryService.ts → seedDefaultCategories()` creates 5 defaults (Rent, Food, Travel, Bills, Misc) if the user has none.

Users can add custom categories (name, emoji, color) from the `EditMonthPage` via the **"+ Add"** button and `AddCategoryModal`. Category names are unique per user (enforced by `@@unique([userId, name])` in Prisma and validated in the modal).

Frontend hooks:
- `useCategories()` — fetches, creates, and deletes categories with optimistic UI updates
- All components that show per-category data (`CategoryRow`, `CategoryInput`, `AllocationDonut`, `MonthCard`, `CategoryTrendCard`) receive a `category: Category` or `categories: Category[]` prop — never hardcoded

---

## Key Conventions

- **Currency** — always INR (₹). Use `formatINR` / `formatCompactINR` from `web/src/lib/format.ts`
- **Month IDs** — always `"YYYY-MM"` strings. Use helpers from `web/src/lib/monthId.ts`
- **Data access** — all reads/writes go through `web/src/firebase/budget.ts`. Never call `fetch` directly from pages or components
- **Auth token** — attached automatically by `budget.ts → request()` via `auth.currentUser.getIdToken()`
- **User scoping** — every API route is scoped to `req.user.uid`. Users can only access their own data
- **Expenses keyed by categoryId** — `expenses` is `Record<string, number>` where keys are Prisma `Category.id` (cuid), not slugs
- **Dark mode** — Tailwind `dark:` variants. Use `text-muted-light dark:text-muted-dark` etc.
- **Design tokens** — `card`, `card-hero`, `pill-ghost`, `label-eyebrow`, `num` — defined in `web/src/index.css`

---

## Environment Variables

**`web/.env.local`**
```
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_API_URL=http://localhost:3001
```

**`api/.env`**
```
DATABASE_URL=postgresql://...@neon.tech/neondb?sslmode=require
FIREBASE_PROJECT_ID=
FIREBASE_CLIENT_EMAIL=
FIREBASE_PRIVATE_KEY=
PORT=3001
```

---

## Local Development

```bash
# Terminal 1 — API (auto-restarts on save)
cd api && npm run dev          # → http://localhost:3001

# Terminal 2 — Web
cd web && npm run dev          # → http://localhost:5173
```

**Database commands (run from `api/`)**
```bash
npm run db:push       # sync schema changes to Neon (--accept-data-loss if removing columns)
npm run db:generate   # regenerate Prisma client after schema changes
npm run db:studio     # visual table browser → http://localhost:5555
```

---

## Pages & Routes

| Route            | Page          | Auth      |
|------------------|---------------|-----------|
| `/login`         | LoginPage     | Public    |
| `/`              | DashboardPage | Protected |
| `/edit/:monthId` | EditMonthPage | Protected |
| `/history`       | HistoryPage   | Protected |
| `/insights`      | InsightsPage  | Protected |

---

## Available Slash Commands

| Command            | What it does                                 |
|--------------------|----------------------------------------------|
| `/add-category`    | Add a new expense category end-to-end        |
| `/new-page`        | Scaffold a new page with routing             |
| `/new-component`   | Scaffold a typed React component             |
| `/feature`         | Plan and implement a new feature             |
| `/check`           | TypeScript compile check + issue summary     |
| `/data-model`      | Explain or extend the data model             |
| `/firebase-status` | Verify Firebase config and API connectivity  |
| `/copy-month`      | Add "copy from previous month" functionality |
| `/ui-review`       | Review UI consistency and accessibility      |
