Check the Firebase setup and configuration for the Monthly Salary Planner.

Run the following checks and report findings:

## 1. Environment Variables
Read `.env.local` (or `.env.example` if `.env.local` is missing) and verify all required Firebase config vars are present:
- VITE_FIREBASE_API_KEY
- VITE_FIREBASE_AUTH_DOMAIN
- VITE_FIREBASE_PROJECT_ID
- VITE_FIREBASE_STORAGE_BUCKET
- VITE_FIREBASE_MESSAGING_SENDER_ID
- VITE_FIREBASE_APP_ID

Flag any that are missing or still set to placeholder values.

## 2. Firebase Config File
Read `src/firebase/config.ts` and verify:
- It imports from `firebase/app`, `firebase/auth`, `firebase/firestore`
- `initializeApp` is called with the env vars
- `getAuth`, `GoogleAuthProvider`, and `getFirestore` are exported
- No hardcoded credentials in the file

## 3. CRUD Functions Audit
Read `src/firebase/budget.ts` and verify:
- `getMonth` handles the offline/unavailable error case
- `saveMonth` uses `{ merge: true }` to avoid overwriting
- `listMonths` orders by `monthId` descending
- `sanitize()` coerces all numeric fields with `Number(...) || 0` (prevents NaN in Firestore)

## 4. Auth Flow
Read `src/context/AuthContext.tsx` and verify:
- `onAuthStateChanged` listener is cleaned up on unmount
- `signInWithPopup` errors are caught and exposed via `error` state
- `loading` is set to `false` in both success and error paths

## 5. Security Rules Reminder
Remind the user to set Firestore security rules in Firebase Console:
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId}/months/{monthId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## Summary Table
| Check | Status | Notes |
|---|---|---|
| Env vars | ✅ / ❌ | |
| Config file | ✅ / ❌ | |
| CRUD safety | ✅ / ❌ | |
| Auth flow | ✅ / ❌ | |
| Security rules | ⚠️ reminder | |
