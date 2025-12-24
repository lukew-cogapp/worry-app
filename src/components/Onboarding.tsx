import type React from 'react';
import { useEffect, useState } from 'react';

const ONBOARDING_KEY = 'worry_box_onboarding_complete';

export const Onboarding: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const hasSeenOnboarding = localStorage.getItem(ONBOARDING_KEY);
    if (!hasSeenOnboarding) {
      setIsOpen(true);
    }
  }, []);

  const handleComplete = () => {
    localStorage.setItem(ONBOARDING_KEY, 'true');
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full p-6 shadow-2xl animate-in fade-in zoom-in duration-300">
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="text-6xl mb-2">📦</div>

          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Welcome to Worry Box
          </h2>

          <p className="text-gray-600 dark:text-gray-400 italic text-sm">
            "You can't always control what happens, but you can control when you worry about it."
          </p>

          <div className="space-y-3 text-left w-full">
            <div className="flex gap-3">
              <div className="flex-shrink-0 text-2xl">🔒</div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                  Lock Away Worries
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Add worries with a future unlock date when you can actually act on them
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="flex-shrink-0 text-2xl">🔔</div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100">Get Reminded</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Receive notifications when your worries unlock and you can take action
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="flex-shrink-0 text-2xl">✨</div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100">Stay Calm</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Stop dwelling on things you can't fix right now and find peace
                </p>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleComplete}
            className="w-full mt-4 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors"
          >
            Get Started
          </button>
        </div>
      </div>
    </div>
  );
};
