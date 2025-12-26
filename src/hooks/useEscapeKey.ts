import { useEffect, useRef } from 'react';

/**
 * Custom hook to handle Escape key press
 * @param callback - Function to call when Escape is pressed
 * @param enabled - Whether the hook is active (default: true)
 */
export function useEscapeKey(callback: () => void, enabled = true) {
  // Store callback in ref to avoid recreating event listener
  const callbackRef = useRef(callback);

  // Update ref on each render
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        callbackRef.current();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [enabled]); // callback removed from deps - uses ref instead
}
