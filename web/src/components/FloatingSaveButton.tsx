import Spinner from './Spinner';

interface Props {
  onClick: () => void;
  saving: boolean;
  label?: string;
  disabled?: boolean;
}

export default function FloatingSaveButton({
  onClick,
  saving,
  label = 'Save',
  disabled,
}: Props) {
  return (
    <div
      className="fixed bottom-0 left-0 right-0 md:left-16 lg:left-64 z-20 px-4 pt-3 bg-gradient-to-t from-bg-light dark:from-bg-dark via-bg-light/90 dark:via-bg-dark/90 to-transparent"
      style={{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 12px)' }}
    >
      <div className="mx-auto max-w-xl lg:max-w-2xl">
        <button
          onClick={onClick}
          disabled={saving || disabled}
          className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-accent text-accent-ink px-5 py-4 font-semibold text-base shadow-soft active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {saving ? <Spinner size={18} /> : null}
          {saving ? 'Saving…' : label}
        </button>
      </div>
    </div>
  );
}
