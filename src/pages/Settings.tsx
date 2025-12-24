import type React from 'react';
import { Link } from 'react-router-dom';
import { usePreferencesStore } from '../store/preferencesStore';

export const Settings: React.FC = () => {
  const preferences = usePreferencesStore((s) => s.preferences);
  const updatePreferences = usePreferencesStore((s) => s.updatePreferences);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link
            to="/"
            className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
            aria-label="Back to home"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <title>Back</title>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Settings</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 divide-y divide-gray-200 dark:divide-gray-700">
          {/* Default Unlock Time */}
          <div className="p-4">
            <label
              htmlFor="default-unlock-time"
              className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-1"
            >
              Default Unlock Time
            </label>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
              When using quick options (Tomorrow, Monday, etc.)
            </p>
            <input
              type="time"
              id="default-unlock-time"
              value={preferences.defaultUnlockTime}
              onChange={(e) => updatePreferences({ defaultUnlockTime: e.target.value })}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
            />
          </div>

          {/* Haptic Feedback */}
          <div className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  Haptic Feedback
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Tactile feedback when locking/unlocking worries
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={preferences.hapticFeedback}
                  onChange={(e) => updatePreferences({ hapticFeedback: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600" />
              </label>
            </div>
          </div>

          {/* Encouraging Messages */}
          <div className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  Encouraging Messages
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Show supportive text in notifications
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={preferences.encouragingMessages}
                  onChange={(e) => updatePreferences({ encouragingMessages: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600" />
              </label>
            </div>
          </div>

          {/* Theme */}
          <div className="p-4">
            <label
              htmlFor="theme"
              className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-1"
            >
              Theme
            </label>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
              Choose your app appearance
            </p>
            <select
              id="theme"
              value={preferences.theme}
              onChange={(e) =>
                updatePreferences({ theme: e.target.value as 'light' | 'dark' | 'system' })
              }
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="system">System</option>
            </select>
          </div>
        </div>

        {/* About Section */}
        <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
            About Worry Box
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Version 0.1.1</p>
          <p className="text-sm text-gray-600 dark:text-gray-400 italic">
            "You can't always control what happens, but you can control when you worry about it."
          </p>
        </div>
      </main>
    </div>
  );
};
