import type React from 'react';
import { Link } from 'react-router-dom';
import { usePreferencesStore } from '../store/preferencesStore';

export const Settings: React.FC = () => {
  const preferences = usePreferencesStore((s) => s.preferences);
  const updatePreferences = usePreferencesStore((s) => s.updatePreferences);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link
            to="/"
            className="text-muted-foreground hover:text-foreground transition-colors"
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
          <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-6">
        <div className="bg-card rounded-lg border border-border divide-y divide-border">
          {/* Default Unlock Time */}
          <div className="p-4">
            <label
              htmlFor="default-unlock-time"
              className="block text-sm font-medium text-foreground mb-1"
            >
              Default Unlock Time
            </label>
            <p className="text-sm text-muted-foreground mb-3">
              When using quick options (Tomorrow, Monday, etc.)
            </p>
            <input
              type="time"
              id="default-unlock-time"
              value={preferences.defaultUnlockTime}
              onChange={(e) => updatePreferences({ defaultUnlockTime: e.target.value })}
              className="px-3 py-2 border border-input rounded-md bg-background text-foreground"
            />
          </div>

          {/* Haptic Feedback */}
          <div className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-foreground">
                  Haptic Feedback
                </h3>
                <p className="text-sm text-muted-foreground">
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
                <div className="w-11 h-6 bg-input peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-ring/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-border after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary" />
              </label>
            </div>
          </div>

          {/* Encouraging Messages */}
          <div className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-foreground">
                  Encouraging Messages
                </h3>
                <p className="text-sm text-muted-foreground">
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
                <div className="w-11 h-6 bg-input peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-ring/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-border after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary" />
              </label>
            </div>
          </div>

          {/* Theme */}
          <div className="p-4">
            <label
              htmlFor="theme"
              className="block text-sm font-medium text-foreground mb-1"
            >
              Theme
            </label>
            <p className="text-sm text-muted-foreground mb-3">
              Choose your app appearance
            </p>
            <select
              id="theme"
              value={preferences.theme}
              onChange={(e) =>
                updatePreferences({ theme: e.target.value as 'light' | 'dark' | 'system' })
              }
              className="px-3 py-2 border border-input rounded-md bg-background text-foreground"
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="system">System</option>
            </select>
          </div>
        </div>

        {/* About Section */}
        <div className="mt-8 bg-card rounded-lg border border-border p-4">
          <h2 className="text-lg font-semibold text-foreground mb-2">
            About Worry Box
          </h2>
          <p className="text-sm text-muted-foreground mb-1">Version 0.1.2</p>
          <p className="text-sm text-muted-foreground italic">
            "You can't always control what happens, but you can control when you worry about it."
          </p>
        </div>
      </main>
    </div>
  );
};
