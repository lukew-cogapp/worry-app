import { BarChart3, Loader2, Lock, Settings } from 'lucide-react';
import type React from 'react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { AddWorrySheet } from '../components/AddWorrySheet';
import { ConfirmationDialog } from '../components/ConfirmationDialog';
import { DebugErrorDialog } from '../components/DebugErrorDialog';
import { EditWorrySheet } from '../components/EditWorrySheet';
import { EmptyState } from '../components/EmptyState';
import { LockAnimation } from '../components/LockAnimation';
import { Onboarding } from '../components/Onboarding';
import { PageContainer } from '../components/PageContainer';
import { PageHeader } from '../components/PageHeader';
import { Button } from '../components/ui/button';
import { WorryCard } from '../components/WorryCard';
import { lang } from '../config/language';
import { useDebugError } from '../hooks/useDebugError';
import { useHaptics } from '../hooks/useHaptics';
import { useWorryActions } from '../hooks/useWorryActions';
import { usePreferencesStore } from '../store/preferencesStore';
import { useLockedWorries, useUnlockedWorries, useWorryStore } from '../store/worryStore';
import type { Worry, WorryCategory } from '../types';

export const Home: React.FC = () => {
  const worries = useWorryStore((s) => s.worries);
  const isLoadingWorries = useWorryStore((s) => s.isLoading);
  const addWorry = useWorryStore((s) => s.addWorry);
  const editWorry = useWorryStore((s) => s.editWorry);
  const defaultUnlockTime = usePreferencesStore((s) => s.preferences.defaultUnlockTime);
  const isLoadingPreferences = usePreferencesStore((s) => s.isLoading);

  const { lockWorry, buttonTap } = useHaptics();
  const { debugError, handleError, clearError } = useDebugError();

  // Worry action handlers (resolve, dismiss, snooze, release) with loading states
  const worryActions = useWorryActions();

  const [isAddSheetOpen, setIsAddSheetOpen] = useState(false);
  const [isEditSheetOpen, setIsEditSheetOpen] = useState(false);
  const [worryToEdit, setWorryToEdit] = useState<Worry | null>(null);
  const [showLockAnimation, setShowLockAnimation] = useState(false);
  const [isAddingWorry, setIsAddingWorry] = useState(false);
  const [isReleasingWorry, setIsReleasingWorry] = useState(false);
  const [isEditingWorry, setIsEditingWorry] = useState(false);

  // Optimized selectors with shallow comparison (prevents unnecessary re-renders)
  const unlockedWorries = useUnlockedWorries();
  const lockedWorries = useLockedWorries();
  const hasWorries = worries.length > 0;

  const handleAddWorry = async (worry: {
    content: string;
    unlockAt: string;
    bestOutcome?: string;
  }) => {
    setIsAddingWorry(true);
    try {
      await addWorry(worry);
      await lockWorry();
      setShowLockAnimation(true);
      setIsAddSheetOpen(false);
    } catch (error) {
      handleError(error, {
        operation: 'addWorry',
        worry: {
          contentLength: worry.content.length,
          unlockAt: worry.unlockAt,
        },
      });

      toast.error(lang.toasts.error.saveWorry, {
        action: {
          label: 'Retry',
          onClick: () => handleAddWorry(worry),
        },
      });
    } finally {
      setIsAddingWorry(false);
    }
  };

  const handleResolveClick = (id: string) => {
    worryActions.setWorryToResolve(id);
    worryActions.setResolutionNote('');
  };

  const handleDismissClick = (id: string) => {
    worryActions.setWorryToDismiss(id);
  };

  const handleReleaseClick = (content: string) => {
    worryActions.setContentToRelease(content);
  };

  const confirmRelease = async () => {
    if (!worryActions.contentToRelease) return;

    setIsReleasingWorry(true);
    try {
      await worryActions.handleRelease();
      setIsAddSheetOpen(false);
    } finally {
      setIsReleasingWorry(false);
    }
  };

  const handleEdit = async (
    id: string,
    updates: { content?: string; unlockAt?: string; category?: WorryCategory; bestOutcome?: string }
  ) => {
    setIsEditingWorry(true);
    try {
      await editWorry(id, updates);
      toast.success(lang.toasts.success.worryUpdated);
      setIsEditSheetOpen(false);
    } catch (error) {
      handleError(error, {
        operation: 'editWorry',
        worryId: id,
        updates,
      });

      toast.error(lang.toasts.error.updateWorry, {
        action: {
          label: 'Retry',
          onClick: () => handleEdit(id, updates),
        },
      });
    } finally {
      setIsEditingWorry(false);
    }
  };

  const handleOpenEdit = (id: string) => {
    const worry = worries.find((w) => w.id === id);
    if (worry) {
      setWorryToEdit(worry);
      setIsEditSheetOpen(true);
    }
  };

  return (
    <div className="h-full flex flex-col bg-background overflow-hidden">
      <PageHeader
        title={lang.app.name}
        subtitle={lang.app.tagline}
        showBack={false}
        rightSlot={
          <div className="flex items-center justify-end gap-sm">
            <Link
              to="/insights"
              className="text-muted-foreground active:text-foreground transition-colors"
              aria-label={lang.aria.insights}
            >
              <BarChart3 className="size-icon-md" aria-hidden="true" />
            </Link>
            <Link
              to="/settings"
              className="text-muted-foreground active:text-foreground transition-colors"
              aria-label={lang.aria.settings}
            >
              <Settings className="size-icon-md" aria-hidden="true" />
            </Link>
          </div>
        }
      />

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <PageContainer className="py-lg pb-24">
          {(isLoadingWorries || isLoadingPreferences) && (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="size-icon-lg animate-spin text-muted-foreground" />
            </div>
          )}

          {!isLoadingWorries && !isLoadingPreferences && !hasWorries && (
            <EmptyState title={lang.home.empty.title} message={lang.home.empty.message} />
          )}

          {/* Unlocked Worries */}
          {!isLoadingWorries && !isLoadingPreferences && unlockedWorries.length > 0 && (
            <section className="mb-8">
              <h2 className="text-foreground mb-4 tracking-tight">{lang.home.sections.ready}</h2>
              <div className="space-y-3">
                {unlockedWorries.map((worry, index) => (
                  <div
                    key={worry.id}
                    className="animate-in fade-in slide-in-from-bottom-4"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <WorryCard
                      worry={worry}
                      onResolve={handleResolveClick}
                      onSnooze={worryActions.handleSnooze}
                      onDismiss={handleDismissClick}
                      onEdit={handleOpenEdit}
                      isResolving={worryActions.loadingStates[worry.id]?.resolving}
                      isSnoozing={worryActions.loadingStates[worry.id]?.snoozing}
                      isDismissing={worryActions.loadingStates[worry.id]?.dismissing}
                    />
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* View History Link - show when no unlocked worries and no locked summary */}
          {!isLoadingWorries &&
            !isLoadingPreferences &&
            unlockedWorries.length === 0 &&
            lockedWorries.length === 0 &&
            hasWorries && (
              <div className="text-center mb-6">
                <Link to="/history" className="text-sm text-primary active:underline">
                  {lang.home.sections.locked.viewAll}
                </Link>
              </div>
            )}

          {/* Locked Worries Summary */}
          {!isLoadingWorries && !isLoadingPreferences && lockedWorries.length > 0 && (
            <section>
              <Link
                to="/history"
                className="block bg-secondary/20 rounded-lg p-lg border border-primary/20 active:bg-secondary/30 transition-colors"
              >
                <div className="flex items-center gap-sm">
                  <Lock className="size-icon-lg text-primary" />
                  <div>
                    <h2 className="text-foreground tracking-tight">
                      {lang.home.sections.locked.title(lockedWorries.length)}
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      {lang.home.sections.locked.subtitle}
                    </p>
                  </div>
                </div>
              </Link>
            </section>
          )}
        </PageContainer>
      </main>

      {/* FAB */}
      <Button
        type="button"
        variant="fab"
        size="fab"
        onClick={() => {
          buttonTap();
          setIsAddSheetOpen(true);
        }}
        className="fixed bottom-fab-offset right-fab-offset transition-all duration-300 active:scale-95 active:rotate-90"
        aria-label={lang.aria.addWorry}
      >
        +
      </Button>

      {/* Add Worry Sheet */}
      <AddWorrySheet
        isOpen={isAddSheetOpen}
        onClose={() => setIsAddSheetOpen(false)}
        onAdd={handleAddWorry}
        onRelease={handleReleaseClick}
        isSubmitting={isAddingWorry}
        isReleasing={isReleasingWorry}
      />

      {/* Edit Worry Sheet */}
      <EditWorrySheet
        isOpen={isEditSheetOpen}
        onClose={() => {
          setIsEditSheetOpen(false);
          setWorryToEdit(null);
        }}
        onEdit={handleEdit}
        worry={worryToEdit}
        defaultTime={defaultUnlockTime}
        isSubmitting={isEditingWorry}
      />

      {/* Lock Animation */}
      <LockAnimation show={showLockAnimation} onComplete={() => setShowLockAnimation(false)} />

      {/* Onboarding */}
      <Onboarding />

      {/* Resolve Dialog */}
      <ConfirmationDialog
        open={!!worryActions.worryToResolve}
        onOpenChange={(open) => {
          if (!open) {
            worryActions.setWorryToResolve(null);
            worryActions.setResolutionNote('');
          }
        }}
        title={lang.resolveWorry.title}
        description=""
        confirmText={lang.resolveWorry.confirm}
        cancelText={lang.resolveWorry.cancel}
        onConfirm={worryActions.handleResolve}
        isLoading={worryActions.loadingStates[worryActions.worryToResolve || '']?.resolving}
        showTextarea
        textareaValue={worryActions.resolutionNote}
        onTextareaChange={worryActions.setResolutionNote}
        textareaLabel={lang.resolveWorry.noteLabel}
        textareaPlaceholder={lang.resolveWorry.notePlaceholder}
      />

      {/* Release Confirmation Dialog */}
      <ConfirmationDialog
        open={!!worryActions.worryToDismiss}
        onOpenChange={(open) => !open && worryActions.setWorryToDismiss(null)}
        title={lang.history.releaseDialog.title}
        description={lang.history.releaseDialog.description}
        confirmText={lang.history.releaseDialog.confirm}
        cancelText={lang.history.releaseDialog.cancel}
        onConfirm={worryActions.handleDismiss}
        isLoading={worryActions.loadingStates[worryActions.worryToDismiss || '']?.dismissing}
      />

      {/* Release Confirmation Dialog */}
      <ConfirmationDialog
        open={!!worryActions.contentToRelease}
        onOpenChange={(open) => !open && worryActions.setContentToRelease(null)}
        title={lang.history.releaseDialog.title}
        description={lang.history.releaseDialog.description}
        confirmText={lang.history.releaseDialog.confirm}
        cancelText={lang.history.releaseDialog.cancel}
        onConfirm={confirmRelease}
        isLoading={isReleasingWorry}
      />

      <DebugErrorDialog error={debugError} onClose={clearError} />
    </div>
  );
};
