import { useEffect } from 'react';

/**
 * Custom hook to handle Escape key press
 * @param callback - Function to call when Escape is pressed
 * @param enabled - Whether the hook is active (default: true)
 */
export function useEscapeKey(callback: () => void, enabled = true) {
  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        callback();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [callback, enabled]);
}
