import type React from 'react';
import { useEffect, useState } from 'react';
import { ANIMATION_DURATIONS } from '../config/constants';
import { lang } from '../config/language';

interface LockAnimationProps {
  show: boolean;
  onComplete?: () => void;
}

export const LockAnimation: React.FC<LockAnimationProps> = ({ show, onComplete }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (show) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
        onComplete?.();
      }, ANIMATION_DURATIONS.LOCK_ANIMATION);

      return () => clearTimeout(timer);
    }
  }, [show, onComplete]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 animate-in fade-in duration-200">
      <div className="flex flex-col items-center gap-md animate-in zoom-in duration-500">
        <div className="relative">
          {/* Lock Icon SVG with animation */}
          <svg
            className="size-icon-xl text-white animate-bounce"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            {/* Lock body */}
            <rect x="5" y="11" width="14" height="10" rx="2" ry="2" />
            {/* Shackle */}
            <path d="M12 11V7a4 4 0 0 1 8 0v4" />
            {/* Keyhole */}
            <circle cx="12" cy="16" r="1" />
          </svg>

          {/* Subtle glow effect */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="absolute w-24 h-24 bg-white/10 rounded-full animate-ping" />
          </div>
        </div>

        <div className="text-white text-xl font-medium animate-in fade-in slide-in-from-bottom duration-700">
          {lang.animations.lockAway}
        </div>
      </div>
    </div>
  );
};
