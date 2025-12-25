import { Loader2, Lock } from 'lucide-react';
import type React from 'react';
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { AddWorrySheet } from '../components/AddWorrySheet';
import { EditWorrySheet } from '../components/EditWorrySheet';
import { EmptyState } from '../components/EmptyState';
import { LockAnimation } from '../components/LockAnimation';
import { Onboarding } from '../components/Onboarding';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../components/ui/alert-dialog';
import { WorryCard } from '../components/WorryCard';
import { TOAST_DURATIONS } from '../config/constants';
import { formatDuration, lang } from '../config/language';
import { useHaptics } from '../hooks/useHaptics';
import { usePreferencesStore } from '../store/preferencesStore';
import { useWorryStore } from '../store/worryStore';
import type { Worry } from '../types';

export const Home: React.FC = () => {
  const worries = useWorryStore((s) => s.worries);
  const isLoadingWorries = useWorryStore((s) => s.isLoading);
  const addWorry = useWorryStore((s) => s.addWorry);
  const editWorry = useWorryStore((s) => s.editWorry);
  const resolveWorry = useWorryStore((s) => s.resolveWorry);
  const dismissWorry = useWorryStore((s) => s.dismissWorry);
  const releaseWorry = useWorryStore((s) => s.releaseWorry);
  const snoozeWorry = useWorryStore((s) => s.snoozeWorry);
  const defaultUnlockTime = usePreferencesStore((s) => s.preferences.defaultUnlockTime);
  const isLoadingPreferences = usePreferencesStore((s) => s.isLoading);

  const { lockWorry, resolveWorry: resolveHaptic } = useHaptics();

  const [isAddSheetOpen, setIsAddSheetOpen] = useState(false);
  const [isEditSheetOpen, setIsEditSheetOpen] = useState(false);
  const [worryToEdit, setWorryToEdit] = useState<Worry | null>(null);
  const [showLockAnimation, setShowLockAnimation] = useState(false);
  const [isAddingWorry, setIsAddingWorry] = useState(false);
  const [isReleasingWorry, setIsReleasingWorry] = useState(false);
  const [isEditingWorry, setIsEditingWorry] = useState(false);
  const [worryToDismiss, setWorryToDismiss] = useState<string | null>(null);
  const [worryToResolve, setWorryToResolve] = useState<string | null>(null);
  const [resolutionNote, setResolutionNote] = useState('');
  const [contentToRelease, setContentToRelease] = useState<string | null>(null);
  const [loadingStates, setLoadingStates] = useState<
    Record<string, { resolving?: boolean; snoozing?: boolean; dismissing?: boolean }>
  >({});

  const unlockedWorries = useMemo(() => worries.filter((w) => w.status === 'unlocked'), [worries]);
  const lockedWorries = useMemo(() => worries.filter((w) => w.status === 'locked'), [worries]);
  const hasWorries = worries.length > 0;

  const handleAddWorry = async (worry: { content: string; action?: string; unlockAt: string }) => {
    setIsAddingWorry(true);
    try {
      await addWorry(worry);
      await lockWorry();
      setShowLockAnimation(true);
      setIsAddSheetOpen(false);
    } catch (_error) {
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
    setWorryToResolve(id);
    setResolutionNote('');
  };

  const confirmResolve = async () => {
    if (!worryToResolve) return;

    setLoadingStates((prev) => ({
      ...prev,
      [worryToResolve]: { ...prev[worryToResolve], resolving: true },
    }));
    try {
      await resolveWorry(worryToResolve, resolutionNote.trim() || undefined);
      await resolveHaptic();
      toast.success(lang.toasts.success.worryResolved);
      setWorryToResolve(null);
      setResolutionNote('');
    } catch (_error) {
      toast.error(lang.toasts.error.resolveWorry, {
        action: {
          label: 'Retry',
          onClick: confirmResolve,
        },
      });
    } finally {
      setLoadingStates((prev) => ({
        ...prev,
        [worryToResolve]: { ...prev[worryToResolve], resolving: false },
      }));
    }
  };

  const handleSnooze = async (id: string, durationMs: number) => {
    setLoadingStates((prev) => ({ ...prev, [id]: { ...prev[id], snoozing: true } }));
    try {
      await snoozeWorry(id, durationMs);
      await lockWorry();
      toast.success(lang.toasts.success.snoozed(formatDuration(durationMs)));
    } catch (_error) {
      toast.error(lang.toasts.error.snoozeWorry, {
        action: {
          label: 'Retry',
          onClick: () => handleSnooze(id, durationMs),
        },
      });
    } finally {
      setLoadingStates((prev) => ({ ...prev, [id]: { ...prev[id], snoozing: false } }));
    }
  };

  const handleDismissClick = (id: string) => {
    setWorryToDismiss(id);
  };

  const confirmDismiss = async () => {
    if (!worryToDismiss) return;

    setLoadingStates((prev) => ({
      ...prev,
      [worryToDismiss]: { ...prev[worryToDismiss], dismissing: true },
    }));
    try {
      await dismissWorry(worryToDismiss);
      toast.success(lang.toasts.success.worryDismissed);
      setWorryToDismiss(null);
    } catch (_error) {
      toast.error(lang.toasts.error.dismissWorry, {
        action: {
          label: 'Retry',
          onClick: confirmDismiss,
        },
      });
    } finally {
      setLoadingStates((prev) => ({
        ...prev,
        [worryToDismiss]: { ...prev[worryToDismiss], dismissing: false },
      }));
    }
  };

  const handleReleaseClick = (content: string) => {
    setContentToRelease(content);
  };

  const confirmRelease = async () => {
    if (!contentToRelease) return;

    setIsReleasingWorry(true);
    try {
      await releaseWorry(contentToRelease);

      setIsAddSheetOpen(false);
      setContentToRelease(null);
      toast.success(lang.toasts.success.worryReleased, {
        duration: TOAST_DURATIONS.LONG,
      });
    } catch (_error) {
      toast.error(lang.toasts.error.releaseWorry, {
        action: {
          label: 'Retry',
          onClick: confirmRelease,
        },
      });
    } finally {
      setIsReleasingWorry(false);
    }
  };

  const handleEdit = async (
    id: string,
    updates: { content?: string; action?: string; unlockAt?: string }
  ) => {
    setIsEditingWorry(true);
    try {
      await editWorry(id, updates);
      toast.success(lang.toasts.success.worryUpdated);
      setIsEditSheetOpen(false);
    } catch (_error) {
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
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground tracking-tight">{lang.app.name}</h1>
            <p className="text-sm text-muted-foreground">{lang.app.tagline}</p>
          </div>
          <div className="flex items-center gap-4">
            <Link
              to="/insights"
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label={lang.aria.insights}
            >
              <svg className="size-icon-md" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <title>{lang.aria.insights}</title>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </Link>
            <Link
              to="/settings"
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label={lang.aria.settings}
            >
              <svg className="size-icon-md" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <title>Settings</title>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-6 pb-24">
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
            <h2 className="text-xl font-bold text-foreground mb-4 tracking-tight">
              {lang.home.sections.ready}
            </h2>
            <div className="space-y-3">
              {unlockedWorries.map((worry) => (
                <WorryCard
                  key={worry.id}
                  worry={worry}
                  onResolve={handleResolveClick}
                  onSnooze={handleSnooze}
                  onDismiss={handleDismissClick}
                  onEdit={handleOpenEdit}
                  isResolving={loadingStates[worry.id]?.resolving}
                  isSnoozing={loadingStates[worry.id]?.snoozing}
                  isDismissing={loadingStates[worry.id]?.dismissing}
                />
              ))}
            </div>
          </section>
        )}

        {/* View History Link - show when no unlocked worries but has history */}
        {!isLoadingWorries &&
          !isLoadingPreferences &&
          unlockedWorries.length === 0 &&
          hasWorries && (
            <div className="text-center mb-6">
              <Link to="/history" className="text-sm text-primary hover:underline">
                {lang.home.sections.locked.viewAll}
              </Link>
            </div>
          )}

        {/* Locked Worries Summary */}
        {!isLoadingWorries && !isLoadingPreferences && lockedWorries.length > 0 && (
          <section>
            <div className="bg-secondary/20 rounded-lg p-6 border border-primary/20">
              <div className="flex items-center gap-3 mb-2">
                <Lock className="size-icon-lg text-primary" />
                <div>
                  <h2 className="text-xl font-bold text-foreground tracking-tight">
                    {lang.home.sections.locked.title(lockedWorries.length)}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    {lang.home.sections.locked.subtitle}
                  </p>
                </div>
              </div>
              <Link
                to="/history"
                className="text-sm text-primary hover:underline inline-block mt-2"
              >
                {lang.home.sections.locked.viewAll}
              </Link>
            </div>
          </section>
        )}
      </main>

      {/* FAB */}
      <button
        type="button"
        onClick={() => setIsAddSheetOpen(true)}
        className="fixed bottom-fab-offset right-fab-offset size-fab bg-primary hover:bg-primary/90 text-primary-foreground rounded-full shadow-lg flex items-center justify-center text-2xl transition-transform hover:scale-110 active:scale-95"
        aria-label={lang.aria.addWorry}
      >
        +
      </button>

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
      <AlertDialog
        open={!!worryToResolve}
        onOpenChange={(open) => {
          if (!open) {
            setWorryToResolve(null);
            setResolutionNote('');
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{lang.resolveWorry.title}</AlertDialogTitle>
            <AlertDialogDescription>
              <label htmlFor="resolution-note" className="block text-sm font-medium mb-2 mt-4">
                {lang.resolveWorry.noteLabel}
              </label>
              <textarea
                id="resolution-note"
                value={resolutionNote}
                onChange={(e) => setResolutionNote(e.target.value)}
                placeholder={lang.resolveWorry.notePlaceholder}
                rows={3}
                className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground placeholder-muted-foreground focus:ring-2 focus:ring-ring focus:border-transparent resize-none"
              />
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={loadingStates[worryToResolve || '']?.resolving}>
              {lang.resolveWorry.cancel}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmResolve}
              disabled={loadingStates[worryToResolve || '']?.resolving}
            >
              {loadingStates[worryToResolve || '']?.resolving && (
                <Loader2 className="mr-2 size-icon-sm animate-spin" />
              )}
              {lang.resolveWorry.confirm}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Dismiss Confirmation Dialog */}
      <AlertDialog
        open={!!worryToDismiss}
        onOpenChange={(open) => !open && setWorryToDismiss(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{lang.history.dismissDialog.title}</AlertDialogTitle>
            <AlertDialogDescription>
              {lang.history.dismissDialog.description}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={loadingStates[worryToDismiss || '']?.dismissing}>
              {lang.history.dismissDialog.cancel}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDismiss}
              disabled={loadingStates[worryToDismiss || '']?.dismissing}
            >
              {loadingStates[worryToDismiss || '']?.dismissing && (
                <Loader2 className="mr-2 size-icon-sm animate-spin" />
              )}
              {lang.history.dismissDialog.confirm}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Release Confirmation Dialog */}
      <AlertDialog
        open={!!contentToRelease}
        onOpenChange={(open) => !open && setContentToRelease(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{lang.history.releaseDialog.title}</AlertDialogTitle>
            <AlertDialogDescription>
              {lang.history.releaseDialog.description}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isReleasingWorry}>
              {lang.history.releaseDialog.cancel}
            </AlertDialogCancel>
            <AlertDialogAction onClick={confirmRelease} disabled={isReleasingWorry}>
              {isReleasingWorry && <Loader2 className="mr-2 size-icon-sm animate-spin" />}
              {lang.history.releaseDialog.confirm}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
