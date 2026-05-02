import { useState, type FormEvent } from 'react';
import type { Category } from '../firebase/budget';

const PRESET_EMOJIS = ['🏠', '🍽️', '✈️', '⚡', '✨', '🎮', '🏥', '👕', '📱', '🎓', '🚗', '🐾', '💪', '🎭', '☕'];
const PRESET_COLORS = [
  '#8AB4F8', '#FF9A6B', '#F4D03F', '#A8E063', '#C9A8FF',
  '#F48FB1', '#80DEEA', '#FFCC80', '#A5D6A7', '#EF9A9A',
];

interface Props {
  open: boolean;
  onClose: () => void;
  existingNames: string[];
  onCreate: (data: { name: string; emoji: string; color: string }) => Promise<void>;
}

export default function AddCategoryModal({ open, onClose, existingNames, onCreate }: Props) {
  const [name, setName] = useState('');
  const [emoji, setEmoji] = useState('📁');
  const [color, setColor] = useState('#8AB4F8');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  if (!open) return null;

  const trimmed = name.trim();
  const isDuplicate = existingNames.some((n) => n.toLowerCase() === trimmed.toLowerCase());

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!trimmed) { setError('Name is required'); return; }
    if (isDuplicate) { setError('A category with this name already exists'); return; }
    setBusy(true);
    setError('');
    try {
      await onCreate({ name: trimmed, emoji, color });
      setName('');
      setEmoji('📁');
      setColor('#8AB4F8');
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create category');
    } finally {
      setBusy(false);
    }
  };

  const handleClose = () => {
    if (busy) return;
    setName('');
    setEmoji('📁');
    setColor('#8AB4F8');
    setError('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={handleClose} aria-hidden />
      <form
        onSubmit={handleSubmit}
        className="relative w-full sm:max-w-md bg-card-light dark:bg-card-dark rounded-t-3xl sm:rounded-3xl p-5 sm:p-6 border-t sm:border border-line-light dark:border-line-dark"
      >
        <div className="label-eyebrow">New category</div>
        <h2 className="mt-1 text-2xl font-semibold tracking-tight">Add category</h2>

        <div className="mt-5 flex items-center gap-4">
          <div
            className="w-14 h-14 rounded-2xl grid place-items-center text-2xl shrink-0"
            style={{ backgroundColor: `${color}22`, color }}
          >
            {emoji}
          </div>
          <div className="flex-1">
            <input
              autoFocus
              value={name}
              onChange={(e) => { setName(e.target.value); setError(''); }}
              placeholder="Category name"
              maxLength={32}
              className="w-full bg-transparent text-base font-medium outline-none border-b border-line-light dark:border-line-dark pb-1 focus:border-accent transition-colors"
            />
          </div>
        </div>

        <div className="mt-5">
          <div className="label-eyebrow mb-2">Emoji</div>
          <div className="flex flex-wrap gap-2">
            {PRESET_EMOJIS.map((e) => (
              <button
                key={e}
                type="button"
                onClick={() => setEmoji(e)}
                className={`w-9 h-9 rounded-xl text-base grid place-items-center transition ${
                  emoji === e
                    ? 'ring-2 ring-accent bg-accent/10'
                    : 'bg-line-light/60 dark:bg-line-dark'
                }`}
              >
                {e}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-5">
          <div className="label-eyebrow mb-2">Color</div>
          <div className="flex flex-wrap gap-2">
            {PRESET_COLORS.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setColor(c)}
                className={`w-8 h-8 rounded-full transition ${
                  color === c ? 'ring-2 ring-offset-2 ring-offset-card-light dark:ring-offset-card-dark ring-accent' : ''
                }`}
                style={{ background: c }}
                aria-label={c}
              />
            ))}
          </div>
        </div>

        {error && (
          <p className="mt-4 text-sm text-rose-500 dark:text-rose-400">{error}</p>
        )}

        <div className="mt-6 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={handleClose}
            disabled={busy}
            className="rounded-full px-4 py-3 text-sm font-medium border border-line-light dark:border-line-dark disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={busy || !trimmed || isDuplicate}
            className="rounded-full px-4 py-3 text-sm font-semibold bg-accent text-accent-ink disabled:opacity-50"
          >
            {busy ? 'Adding…' : 'Add'}
          </button>
        </div>
      </form>
    </div>
  );
}
