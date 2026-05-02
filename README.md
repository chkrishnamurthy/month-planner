# Plan — Monthly Salary Planner

A mobile-first web app to plan your monthly budget. Set salary, allocate spending across categories, and track your savings rate.

**Tech Stack:** React 18 + Vite + Tailwind CSS + Firebase (Auth + Firestore) + Recharts

---

## 🚀 Quick Start

### Prerequisites

- Node.js 20+
- Google account
- Firebase project (free tier works great)

### Step 1: Clone & Install

```bash
cd planner
npm install
```

### Step 2: Set Up Firebase Project

1. Go to [console.firebase.google.com](https://console.firebase.google.com)
2. Create a new project (or use an existing one)
3. Add a **Web app**:
   - Click "Web" icon
   - Register app → copy the config object
4. Enable **Google Authentication**:
   - Left sidebar → Authentication → Sign-in method
   - Enable "Google"
   - Add your domain under "Authorized domains" (e.g., `localhost`)
5. Create **Firestore Database**:
   - Left sidebar → Firestore Database → Create database
   - Start in **production mode**
   - Choose a region close to you
   - Paste security rules (see below)

### Step 3: Environment Variables

```bash
cp .env.example .env.local
```

Edit `.env.local` with your Firebase config:

```env
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=000000000000
VITE_FIREBASE_APP_ID=1:000000000000:web:xxxxxxxxxxxxxxxx
VITE_API_URL=http://localhost:3001
```

Find these in Firebase Console → Project Settings → General tab.

For production deploys, set env vars in your hosting provider (do not commit secrets):
- Frontend (`web`): use `web/.env.production.example` as a checklist and set values in Netlify UI.
- Backend (`api`): set `CORS_ORIGIN` to your frontend origin (e.g. `https://month-plan.netlify.app`) and keep local `.env` separate.

### Step 4: Firestore Security Rules

In Firebase Console → Firestore Database → Rules tab, paste:

```firestore
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{uid} {
      allow read, write: if request.auth.uid == uid;
      match /months/{monthId} {
        allow read, write: if request.auth.uid == uid;
      }
    }
  }
}
```

### Step 5: Run Locally

```bash
npm run dev
```

Opens at `http://localhost:5173`. Sign in with your Google account.

---

## 📦 Build & Deploy

### Local Build

```bash
npm run build
npm run preview
```

### Deploy to Firebase Hosting

```bash
npm install -g firebase-tools
firebase login
firebase init hosting  # Choose your project
firebase deploy
```

---

## 📱 Features

- **Monthly planning** — enter salary + 5 expense categories (Rent, Food, Travel, Bills, Misc)
- **Auto-calculations** — remaining balance, savings rate, % allocated
- **Donut chart** — visual allocation breakdown
- **6-month insights** — savings rate, total allocated trend, category trends
- **Month history** — view/edit past months, copy from previous month
- **Dark/light theme** — respects system preference + manual toggle
- **Session persistence** — login persists across refreshes
- **Mobile-optimized** — touch-friendly, responsive design

---

## 🛠️ Development

### Project Structure

```
src/
├── main.jsx              # Entry point
├── App.jsx               # Router + PrivateRoute
├── index.css             # Tailwind + global styles
├── firebase/
│   ├── config.js         # Firebase init
│   └── budget.js         # Read/write helpers
├── context/
│   ├── AuthContext.jsx   # Google login state
│   └── ThemeContext.jsx  # Dark/light mode
├── hooks/
│   ├── useMonth.js       # Load/save single month
│   └── useMonths.js      # Load all months
├── lib/
│   ├── categories.js     # 5 categories + helpers
│   ├── format.js         # INR formatting
│   └── monthId.js        # Month ID utils
├── components/           # Reusable UI pieces
└── pages/                # Full page components
```

### Adding a Feature

1. Add helper in `lib/` or `hooks/`
2. Create reusable component in `components/`
3. Use in a page under `pages/`
4. Ensure Firestore rules allow the operation

---

## 🔐 Security Notes

- Data is **private per user** (uid-scoped Firestore paths)
- **No backend** — all logic runs client-side + Firestore rules
- **Google auth only** — no passwords stored
- Firestore rules prevent reading/writing other users' data

---

## 🐛 Troubleshooting

**"Sign in popup blocked"**
- Check browser popup settings for your domain

**"Unauthorized domain" error**
- Firebase Console → Authentication → Settings → Authorized domains
- Add `localhost` for dev, your domain for prod

**Firestore data not saving**
- Check `.env.local` keys are correct
- Verify Firestore rules are pasted
- Check browser console for error details

**Dark mode not working**
- Clear localStorage: `localStorage.clear()`
- Refresh page

---

## 📄 License

Open source — use freely, modify as needed.

---

**Questions?** Check Firebase docs at [firebase.google.com/docs](https://firebase.google.com/docs) or review the code in `src/firebase/` and `src/context/`.
