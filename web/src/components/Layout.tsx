import { type ReactNode } from 'react';
import BottomNav from './BottomNav';
import Sidebar from './Sidebar';

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-dvh">
      <Sidebar />
      <main className="flex-1 min-w-0">
        {children}
      </main>
      <BottomNav />
    </div>
  );
}
