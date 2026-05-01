import { useEffect, useState } from 'react';

export default function Toast({ message, show, onDone }) {
  const [visible, setVisible] = useState(show);
  useEffect(() => {
    if (show) {
      setVisible(true);
      const t = setTimeout(() => {
        setVisible(false);
        onDone?.();
      }, 1500);
      return () => clearTimeout(t);
    }
  }, [show, onDone]);
  if (!visible) return null;
  return (
    <div className="fixed top-4 inset-x-0 z-40 flex justify-center pointer-events-none">
      <div className="rounded-full bg-hero text-accent px-4 py-2 text-sm font-medium shadow-soft">
        {message}
      </div>
    </div>
  );
}
