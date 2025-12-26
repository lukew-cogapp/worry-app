import type React from 'react';
import { PageHeader } from '../components/PageHeader';
import { Label } from '../components/ui/label';
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
      <PageHeader title={lang.settings.title} subtitle={lang.settings.subtitle} />

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-6">
        <div className="bg-card rounded-lg border border-border overflow-hidden">
          {/* Default Unlock Time */}
          <div className="p-lg">
            <Label htmlFor="default-unlock-time" className="text-base font-medium">
              {lang.settings.sections.defaultTime.title}
            </Label>
            <p className="text-sm text-muted-foreground mt-1 mb-sm">
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
          <div className="p-lg">
            <div className="flex items-center justify-between">
              <div className="space-y-2xs">
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
          <div className="p-lg">
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
        </div>

        {/* About Section */}
        <div className="mt-8 bg-card rounded-lg border border-border p-lg">
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
