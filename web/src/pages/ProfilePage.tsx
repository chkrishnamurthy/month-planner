import { type ChangeEvent, useEffect, useMemo, useRef, useState } from 'react';
import { updateProfile } from 'firebase/auth';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import AppHeader from '../components/AppHeader';
import SignOutButton from '../components/SignOutButton';
import Spinner from '../components/Spinner';
import Toast from '../components/Toast';
import { useAuth } from '../context/AuthContext';
import { useCategories } from '../hooks/useCategories';
import { auth, storage } from '../firebase/config';
import { getUserProfile, type UserProfile } from '../firebase/budget';

function formatDate(value: string) {
  return new Date(value).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

function providerName(providerId: string | undefined) {
  if (providerId === 'google.com') return 'Google';
  if (providerId === 'password') return 'Password';
  return providerId || 'Unknown';
}

export default function ProfilePage() {
  const { user } = useAuth();
  const { categories } = useCategories();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [name, setName] = useState('');
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [toast, setToast] = useState('');
  const previewUrlRef = useRef<string | null>(null);

  const providerId = user?.providerData?.[0]?.providerId;
  const providerLabel = providerName(providerId);

  useEffect(() => {
    if (!user) return;

    setName(user.displayName ?? '');
    return () => {
      if (previewUrlRef.current) {
        URL.revokeObjectURL(previewUrlRef.current);
      }
    };
  }, [user]);

  useEffect(() => {
    let cancelled = false;
    async function loadProfile() {
      setLoading(true);
      setError(null);
      try {
        const data = await getUserProfile();
        if (!cancelled) setProfile(data);
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err : new Error(String(err)));
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    loadProfile();
    return () => {
      cancelled = true;
    };
  }, []);

  const avatarUrl = photoPreview || user?.photoURL || null;
  const initials = useMemo(() => {
    const label = user?.displayName || user?.email || '';
    return label
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join('') || 'U';
  }, [user]);

  const hasChanges = Boolean(
    user &&
      (name.trim() !== (user.displayName ?? '') || photoFile !== null)
  );

  const resetForm = () => {
    if (!user) return;
    setName(user.displayName ?? '');
    setPhotoFile(null);
    setPhotoPreview(null);
    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
      previewUrlRef.current = null;
    }
    setError(null);
  };

  const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
    }
    previewUrlRef.current = url;
    setPhotoPreview(url);
    setPhotoFile(file);
  };

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    setError(null);
    try {
      let updatedPhotoURL = user.photoURL ?? null;
      if (photoFile) {
        const sanitizedFileName = photoFile.name.replace(/\s+/g, '_');
        const storageRef = ref(
          storage,
          `profile/${user.uid}/${Date.now()}_${sanitizedFileName}`
        );
        const snapshot = await uploadBytes(storageRef, photoFile);
        updatedPhotoURL = await getDownloadURL(snapshot.ref);
      }

      await updateProfile(user, {
        displayName: name.trim() || undefined,
        photoURL: updatedPhotoURL || undefined,
      });

      await auth.currentUser?.getIdToken(true);
      const freshProfile = await getUserProfile();
      setProfile(freshProfile);
      setPhotoFile(null);
      setPhotoPreview(null);
      setToast('Profile updated successfully');
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setSaving(false);
    }
  };

  if (loading || !user) {
    return (
      <div className="min-h-dvh pb-28">
        <div className="mx-auto max-w-xl lg:max-w-5xl px-5">
          <AppHeader section="05 · Profile" />
          <div className="mt-8 flex justify-center text-muted-light dark:text-muted-dark">
            <Spinner size={28} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-dvh pb-28">
      <div className="mx-auto max-w-xl lg:max-w-5xl px-5">
        <AppHeader section="05 · Profile" />

        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-6">
            <section className="card p-6">
              <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="w-28 h-28 rounded-full bg-line-light dark:bg-line-dark overflow-hidden shadow-sm">
                      {avatarUrl ? (
                        <img
                          src={avatarUrl}
                          alt="Profile"
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <div className="w-full h-full grid place-items-center text-3xl font-semibold text-muted-light dark:text-muted-dark">
                          {initials}
                        </div>
                      )}
                    </div>
                    <label className="absolute -bottom-1 -right-1 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-card-light border border-line-light dark:bg-card-dark dark:border-line-dark text-sm shadow-soft">
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handlePhotoChange}
                      />
                      ✎
                    </label>
                  </div>
                  <div>
                    <div className="text-sm text-muted-light dark:text-muted-dark">Profile picture</div>
                    <div className="mt-2 text-lg font-semibold">Tap to upload</div>
                  </div>
                </div>

                <div className="rounded-3xl border border-line-light dark:border-line-dark bg-card-light dark:bg-card-dark p-4">
                  <div className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-light dark:text-muted-dark">
                    Account provider
                  </div>
                  <div className="mt-2 text-base font-semibold">{providerLabel}</div>
                </div>
              </div>
            </section>

            <section className="card p-6">
              <div className="flex items-center justify-between gap-4 mb-6">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-muted-light dark:text-muted-dark">Personal details</p>
                  <h2 className="mt-3 text-2xl font-semibold">Profile info</h2>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={resetForm}
                    disabled={saving}
                    className="pill-ghost"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSave}
                    disabled={saving || !hasChanges || !name.trim()}
                    className="pill-accent"
                  >
                    {saving ? 'Saving…' : 'Save changes'}
                  </button>
                </div>
              </div>

              {error && (
                <div className="mb-5 rounded-2xl border border-red-200 dark:border-red-900/60 bg-red-50 dark:bg-red-950/40 px-4 py-3 text-sm text-red-700 dark:text-red-300">
                  {error.message || 'Unable to save changes. Please try again.'}
                </div>
              )}

              <div className="grid gap-4">
                <label className="grid gap-2 text-sm font-medium">
                  Full name
                  <input
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    className="w-full rounded-3xl border border-line-light bg-transparent px-4 py-3 text-base outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/10"
                    placeholder="Your full name"
                  />
                </label>

                <label className="grid gap-2 text-sm font-medium">
                  Email address
                  <input
                    value={user.email ?? ''}
                    readOnly
                    disabled
                    className="w-full rounded-3xl border border-line-light bg-muted-light/50 text-muted-light px-4 py-3 text-base outline-none dark:bg-muted-dark/50 dark:text-muted-dark"
                  />
                </label>

                <div className="grid gap-2 text-sm font-medium">
                  <div className="flex items-center justify-between text-sm text-muted-light dark:text-muted-dark">
                    <span>Change password</span>
                    <span className="font-semibold text-neutral-900 dark:text-neutral-100">
                      {providerId === 'password' ? 'Available' : 'Not supported'}
                    </span>
                  </div>
                  <p className="text-xs text-muted-light dark:text-muted-dark">
                    {providerId === 'password'
                      ? 'Use your account password to sign in.'
                      : 'Password management is handled by your identity provider.'}
                  </p>
                </div>
              </div>
            </section>

            <section className="card p-6">
              <div className="flex items-start justify-between gap-3 mb-5">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-muted-light dark:text-muted-dark">
                    Account settings
                  </p>
                  <h2 className="mt-3 text-2xl font-semibold">Security</h2>
                </div>
              </div>
              <div className="space-y-4">
                <div className="rounded-3xl border border-line-light dark:border-line-dark bg-card-light dark:bg-card-dark p-4">
                  <div className="text-sm text-muted-light dark:text-muted-dark">Last synced</div>
                  <div className="mt-2 text-base font-semibold">{profile ? formatDate(profile.lastLoginAt) : '—'}</div>
                </div>
                <SignOutButton />
              </div>
            </section>
          </div>

          <div className="space-y-6">
            <section className="card p-6">
              <div className="text-xs uppercase tracking-[0.3em] text-muted-light dark:text-muted-dark">
                Profile summary
              </div>
              <div className="mt-4 grid gap-4">
                <div className="rounded-3xl border border-line-light dark:border-line-dark bg-card-light dark:bg-card-dark p-4">
                  <div className="text-sm text-muted-light dark:text-muted-dark">Joined</div>
                  <div className="mt-2 text-lg font-semibold">{profile ? formatDate(profile.createdAt) : '—'}</div>
                </div>
                <div className="rounded-3xl border border-line-light dark:border-line-dark bg-card-light dark:bg-card-dark p-4">
                  <div className="text-sm text-muted-light dark:text-muted-dark">Monthly plans</div>
                  <div className="mt-2 text-lg font-semibold">{profile?._count.months ?? 0}</div>
                </div>
                <div className="rounded-3xl border border-line-light dark:border-line-dark bg-card-light dark:bg-card-dark p-4">
                  <div className="text-sm text-muted-light dark:text-muted-dark">Categories</div>
                  <div className="mt-2 text-lg font-semibold">{categories.length}</div>
                </div>
              </div>
            </section>

            <section className="card p-6">
              <div className="text-xs uppercase tracking-[0.3em] text-muted-light dark:text-muted-dark">
                Quick stats
              </div>
              <div className="mt-4 grid gap-3">
                <div className="rounded-3xl border border-line-light dark:border-line-dark bg-card-light dark:bg-card-dark p-4">
                  <div className="text-sm text-muted-light dark:text-muted-dark">Profile name</div>
                  <div className="mt-2 text-lg font-semibold">{user.displayName || 'Not set'}</div>
                </div>
                <div className="rounded-3xl border border-line-light dark:border-line-dark bg-card-light dark:bg-card-dark p-4">
                  <div className="text-sm text-muted-light dark:text-muted-dark">Email</div>
                  <div className="mt-2 text-lg font-semibold truncate">{user.email}</div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
      <Toast message={toast} show={Boolean(toast)} onDone={() => setToast('')} />
    </div>
  );
}
