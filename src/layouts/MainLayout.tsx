import type { ReactNode } from 'react';
import { Navbar } from '../components/Navbar';

interface MainLayoutProps {
  children: ReactNode;
}

/**
 * Main application layout shell.
 * Wraps content with the navigation bar and applies max-width constraints.
 */
export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="app-container">
      <Navbar />
      {children}
    </div>
  );
}
