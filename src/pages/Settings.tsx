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
import { lang } from '../config/language';
import { usePreferencesStore } from '../store/preferencesStore';

export const Settings: React.FC = () => {
  const preferences = usePreferencesStore((s) => s.preferences);
  const isSaving = usePreferencesStore((s) => s.isSaving);
  const updatePreferences = usePreferencesStore((s) => s.updatePreferences);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link
            to="/"
            className="text-muted-foreground hover:text-foreground transition-colors"
            aria-label={lang.aria.back}
          >
            <svg className="size-icon-md" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <title>Back</title>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </Link>
          <h1 className="text-3xl font-bold text-foreground tracking-tight">
            {lang.settings.title}
          </h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-6">
        <div className="bg-card rounded-lg border border-border overflow-hidden">
          {/* Default Unlock Time */}
          <div className="p-6">
            <Label htmlFor="default-unlock-time" className="text-base font-medium">
              {lang.settings.sections.defaultTime.title}
            </Label>
            <p className="text-sm text-muted-foreground mt-1 mb-3">
              {lang.settings.sections.defaultTime.description}
            </p>
            <input
              type="time"
              id="default-unlock-time"
              value={preferences.defaultUnlockTime}
              onChange={(e) => updatePreferences({ defaultUnlockTime: e.target.value })}
              disabled={isSaving}
              className="min-h-touch-target px-3 py-2 border border-input rounded-md bg-background text-foreground disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>

          <Separator />

          {/* Haptic Feedback */}
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="haptic-feedback" className="text-base font-medium">
                  {lang.settings.sections.hapticFeedback.title}
                </Label>
                <p className="text-sm text-muted-foreground">
                  {lang.settings.sections.hapticFeedback.description}
                </p>
              </div>
              <Switch
                id="haptic-feedback"
                checked={preferences.hapticFeedback}
                onCheckedChange={(checked: boolean) =>
                  updatePreferences({ hapticFeedback: checked })
                }
                disabled={isSaving}
              />
            </div>
          </div>

          <Separator />

          {/* Encouraging Messages */}
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="encouraging-messages" className="text-base font-medium">
                  {lang.settings.sections.encouragingMessages.title}
                </Label>
                <p className="text-sm text-muted-foreground">
                  {lang.settings.sections.encouragingMessages.description}
                </p>
              </div>
              <Switch
                id="encouraging-messages"
                checked={preferences.encouragingMessages}
                onCheckedChange={(checked: boolean) =>
                  updatePreferences({ encouragingMessages: checked })
                }
                disabled={isSaving}
              />
            </div>
          </div>

          <Separator />

          {/* Theme */}
          <div className="p-6">
            <Label htmlFor="theme" className="text-base font-medium">
              {lang.settings.sections.theme.title}
            </Label>
            <p className="text-sm text-muted-foreground mt-1 mb-3">
              {lang.settings.sections.theme.description}
            </p>
            <Select
              value={preferences.theme}
              onValueChange={(value: 'light' | 'dark' | 'system') =>
                updatePreferences({ theme: value })
              }
              disabled={isSaving}
            >
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="Select theme" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">{lang.settings.sections.theme.options.light}</SelectItem>
                <SelectItem value="dark">{lang.settings.sections.theme.options.dark}</SelectItem>
                <SelectItem value="system">
                  {lang.settings.sections.theme.options.system}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* About Section */}
        <div className="mt-8 bg-card rounded-lg border border-border p-6">
          <h2 className="text-lg font-semibold text-foreground mb-2">
            {lang.settings.about.title}
          </h2>
          <p className="text-sm text-muted-foreground mb-1">
            {lang.settings.about.version('0.1.4')}
          </p>
          <p className="text-sm text-muted-foreground italic">{lang.onboarding.quote}</p>
        </div>
      </main>
    </div>
  );
};
