import { Trash2 } from 'lucide-react';
import type React from 'react';
import { useState } from 'react';
import { toast } from 'sonner';
import { ConfirmationDialog } from '../components/ConfirmationDialog';
import { PageHeader } from '../components/PageHeader';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Separator } from '../components/ui/separator';
import { Switch } from '../components/ui/switch';
import { lang } from '../config/language';
import { usePreferencesStore } from '../store/preferencesStore';
import { useWorryStore } from '../store/worryStore';

export const Settings: React.FC = () => {
  const preferences = usePreferencesStore((s) => s.preferences);
  const isSaving = usePreferencesStore((s) => s.isSaving);
  const updatePreferences = usePreferencesStore((s) => s.updatePreferences);
  const clearAllData = useWorryStore((s) => s.clearAllData);

  const [showResetDialog, setShowResetDialog] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  const handleReset = async () => {
    setIsResetting(true);
    try {
      await clearAllData();
      toast.success(lang.toasts.success.dataCleared);
      setShowResetDialog(false);
    } catch {
      toast.error('Failed to reset data. Please try again.');
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div className="h-full flex flex-col bg-background overflow-hidden">
      <PageHeader title={lang.settings.title} subtitle={lang.settings.subtitle} />
      <div className="flex-1 overflow-y-auto">
        {/* Main Content */}
        <main className="max-w-4xl mx-auto px-md py-lg">
          <div className="bg-card rounded-lg border border-border overflow-hidden">
            {/* Default Unlock Time */}
            <div className="p-lg">
              <Label htmlFor="default-unlock-time" className="text-base font-medium">
                {lang.settings.sections.defaultTime.title}
              </Label>
              <p className="text-sm text-muted-foreground mt-1 mb-sm leading-relaxed">
                {lang.settings.sections.defaultTime.description}
              </p>
              <Input
                type="time"
                id="default-unlock-time"
                value={preferences.defaultUnlockTime}
                onChange={(e) => updatePreferences({ defaultUnlockTime: e.target.value })}
                disabled={isSaving}
                className="min-h-touch-target bg-background"
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
                  <p className="text-sm text-muted-foreground leading-relaxed">
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
                  <p className="text-sm text-muted-foreground leading-relaxed">
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

          {/* Danger Zone */}
          <div className="mt-8 bg-card rounded-lg border border-destructive/30 overflow-hidden">
            <div className="p-lg">
              <h2 className="text-lg font-semibold text-destructive mb-2">
                {lang.settings.dangerZone.title}
              </h2>
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <Label className="text-base font-medium">
                    {lang.settings.dangerZone.reset.title}
                  </Label>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {lang.settings.dangerZone.reset.description}
                  </p>
                </div>
                <Button
                  variant="destructive"
                  onClick={() => setShowResetDialog(true)}
                  className="ml-4"
                >
                  <Trash2 className="size-icon-sm mr-2" aria-hidden="true" />
                  {lang.settings.dangerZone.reset.button}
                </Button>
              </div>
            </div>
          </div>

          {/* About Section */}
          <div className="mt-8 bg-card rounded-lg border border-border p-lg">
            <h2 className="text-lg font-semibold text-foreground mb-2">
              {lang.settings.about.title}
            </h2>
            <p className="text-sm text-muted-foreground mb-1 leading-relaxed">
              {lang.settings.about.version('0.1.5')}
            </p>
            <p className="text-sm text-muted-foreground italic leading-relaxed">
              {lang.onboarding.quote}
            </p>
          </div>
        </main>
      </div>

      {/* Reset Confirmation Dialog */}
      <ConfirmationDialog
        open={showResetDialog}
        onOpenChange={setShowResetDialog}
        title={lang.settings.dangerZone.resetDialog.title}
        description={lang.settings.dangerZone.resetDialog.description}
        confirmText={lang.settings.dangerZone.resetDialog.confirm}
        cancelText={lang.settings.dangerZone.resetDialog.cancel}
        onConfirm={handleReset}
        isLoading={isResetting}
        variant="destructive"
      />
    </div>
  );
};
