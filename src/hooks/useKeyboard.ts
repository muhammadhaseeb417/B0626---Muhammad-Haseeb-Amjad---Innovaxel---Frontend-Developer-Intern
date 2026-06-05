import { useEffect } from 'react';

/**
 * Custom hook to listen for keyboard shortcuts.
 * Automatically handles cleanup on unmount.
 */
export function useKeyboard(key: string, handler: () => void, enabled = true): void {
  useEffect(() => {
    if (!enabled) return;

    const listener = (event: KeyboardEvent) => {
      if (event.key === key) {
        event.preventDefault();
        handler();
      }
    };

    window.addEventListener('keydown', listener);
    return () => window.removeEventListener('keydown', listener);
  }, [key, handler, enabled]);
}
