import { Link } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';

interface Props {
  section?: string;
}

export default function AppHeader({ section }: Props) {
  return (
    <header className="flex items-center justify-between py-5">
      <Link to="/" className="flex items-center gap-2.5 group">
        <span className="w-9 h-9 rounded-xl bg-hero text-accent grid place-items-center font-bold text-lg">
          P
        </span>
        <span className="font-semibold tracking-tight">Plan</span>
      </Link>
      <div className="flex items-center gap-3">
        {section && (
          <span className="label-eyebrow hidden sm:inline">{section}</span>
        )}
        <ThemeToggle />
      </div>
    </header>
  );
}
