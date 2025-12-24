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
          {/* Lock Icon with animation */}
          <div className="text-8xl animate-bounce">🔒</div>

          {/* Particles effect */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="absolute w-2 h-2 bg-blue-400 rounded-full animate-ping" />
            <div className="absolute w-2 h-2 bg-purple-400 rounded-full animate-ping delay-75" />
            <div className="absolute w-2 h-2 bg-indigo-400 rounded-full animate-ping delay-150" />
          </div>
        </div>

        <div className="text-white text-xl font-medium animate-in fade-in slide-in-from-bottom duration-700">
          {lang.animations.lockAway}
        </div>
      </div>
    </div>
  );
};
