import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import {
  initializeFirestore,
  persistentLocalCache,
  persistentMultipleTabManager,
} from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

type FirebaseConfigKey =
  | 'apiKey'
  | 'authDomain'
  | 'projectId'
  | 'storageBucket'
  | 'messagingSenderId'
  | 'appId'
  | 'measurementId';

const readEnv = (primary: string, fallback?: string): string | undefined => {
  const value = import.meta.env[primary] ?? (fallback ? import.meta.env[fallback] : undefined);
  if (typeof value !== 'string') return undefined;
  const trimmed = value.trim();
  if (!trimmed || trimmed.includes('your-')) return undefined;
  return trimmed;
};

const firebaseConfig: Record<FirebaseConfigKey, string | undefined> = {
  apiKey:            readEnv('VITE_FIREBASE_API_KEY', 'FIREBASE_API_KEY'),
  authDomain:        readEnv('VITE_FIREBASE_AUTH_DOMAIN', 'FIREBASE_AUTH_DOMAIN'),
  projectId:         readEnv('VITE_FIREBASE_PROJECT_ID', 'FIREBASE_PROJECT_ID'),
  storageBucket:     readEnv('VITE_FIREBASE_STORAGE_BUCKET', 'FIREBASE_STORAGE_BUCKET'),
  messagingSenderId: readEnv('VITE_FIREBASE_MESSAGING_SENDER_ID', 'FIREBASE_MESSAGING_SENDER_ID'),
  appId:             readEnv('VITE_FIREBASE_APP_ID', 'FIREBASE_APP_ID'),
  measurementId:     readEnv('VITE_FIREBASE_MEASUREMENT_ID', 'FIREBASE_MEASUREMENT_ID'),
};

const requiredConfig: FirebaseConfigKey[] = [
  'apiKey',
  'authDomain',
  'projectId',
  'storageBucket',
  'messagingSenderId',
  'appId',
];

const missing = requiredConfig.filter((key) => !firebaseConfig[key]);
if (missing.length) {
  throw new Error(
    `Missing Firebase config: ${missing.join(', ')}. Set VITE_FIREBASE_* (or FIREBASE_*) environment variables in your deploy provider.`
  );
}

if (firebaseConfig.apiKey && !firebaseConfig.apiKey.startsWith('AIza')) {
  throw new Error(
    'Invalid Firebase apiKey format. Use your Firebase Web App config value (not Admin SDK/service account credentials).'
  );
}

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db   = initializeFirestore(app, {
  localCache: persistentLocalCache({ tabManager: persistentMultipleTabManager() })
});
export const storage = getStorage(app);
export const googleProvider = new GoogleAuthProvider();
