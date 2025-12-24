import type React from 'react';
import { Link } from 'react-router-dom';
import { Label } from '../components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { Separator } from '../components/ui/separator';
import { Switch } from '../components/ui/switch';
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
          <h1 className="text-3xl font-bold text-foreground tracking-tight">Settings</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-6">
        <div className="bg-card rounded-lg border border-border overflow-hidden">
          {/* Default Unlock Time */}
          <div className="p-6">
            <Label htmlFor="default-unlock-time" className="text-base font-medium">
              Default Unlock Time
            </Label>
            <p className="text-sm text-muted-foreground mt-1 mb-3">
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

          <Separator />

          {/* Haptic Feedback */}
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="haptic-feedback" className="text-base font-medium">
                  Haptic Feedback
                </Label>
                <p className="text-sm text-muted-foreground">
                  Tactile feedback when locking/unlocking worries
                </p>
              </div>
              <Switch
                id="haptic-feedback"
                checked={preferences.hapticFeedback}
                onCheckedChange={(checked: boolean) =>
                  updatePreferences({ hapticFeedback: checked })
                }
              />
            </div>
          </div>

          <Separator />

          {/* Encouraging Messages */}
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="encouraging-messages" className="text-base font-medium">
                  Encouraging Messages
                </Label>
                <p className="text-sm text-muted-foreground">
                  Show supportive text in notifications
                </p>
              </div>
              <Switch
                id="encouraging-messages"
                checked={preferences.encouragingMessages}
                onCheckedChange={(checked: boolean) =>
                  updatePreferences({ encouragingMessages: checked })
                }
              />
            </div>
          </div>

          <Separator />

          {/* Theme */}
          <div className="p-6">
            <Label htmlFor="theme" className="text-base font-medium">
              Theme
            </Label>
            <p className="text-sm text-muted-foreground mt-1 mb-3">Choose your app appearance</p>
            <Select
              value={preferences.theme}
              onValueChange={(value: 'light' | 'dark' | 'system') =>
                updatePreferences({ theme: value })
              }
            >
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="Select theme" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="dark">Dark</SelectItem>
                <SelectItem value="system">System</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* About Section */}
        <div className="mt-8 bg-card rounded-lg border border-border p-6">
          <h2 className="text-lg font-semibold text-foreground mb-2">About Worry Box</h2>
          <p className="text-sm text-muted-foreground mb-1">Version 0.1.4</p>
          <p className="text-sm text-muted-foreground italic">
            "You can't always control what happens, but you can control when you worry about it."
          </p>
        </div>
      </main>
    </div>
  );
};
