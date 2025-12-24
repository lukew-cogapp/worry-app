import { Lock } from 'lucide-react';
import type React from 'react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { AddWorrySheet } from '../components/AddWorrySheet';
import { EditWorrySheet } from '../components/EditWorrySheet';
import { EmptyState } from '../components/EmptyState';
import { LockAnimation } from '../components/LockAnimation';
import { Onboarding } from '../components/Onboarding';
import { WorryCard } from '../components/WorryCard';
import { formatDuration, lang } from '../config/language';
import { useHaptics } from '../hooks/useHaptics';
import { usePreferencesStore } from '../store/preferencesStore';
import { useWorryStore } from '../store/worryStore';
import type { Worry } from '../types';

export const Home: React.FC = () => {
  const worries = useWorryStore((s) => s.worries);
  const addWorry = useWorryStore((s) => s.addWorry);
  const editWorry = useWorryStore((s) => s.editWorry);
  const resolveWorry = useWorryStore((s) => s.resolveWorry);
  const dismissWorry = useWorryStore((s) => s.dismissWorry);
  const snoozeWorry = useWorryStore((s) => s.snoozeWorry);
  const defaultUnlockTime = usePreferencesStore((s) => s.preferences.defaultUnlockTime);

  const { lockWorry, resolveWorry: resolveHaptic } = useHaptics();

  const [isAddSheetOpen, setIsAddSheetOpen] = useState(false);
  const [isEditSheetOpen, setIsEditSheetOpen] = useState(false);
  const [worryToEdit, setWorryToEdit] = useState<Worry | null>(null);
  const [showLockAnimation, setShowLockAnimation] = useState(false);
  const [loadingStates, setLoadingStates] = useState<
    Record<string, { resolving?: boolean; snoozing?: boolean; dismissing?: boolean }>
  >({});

  const unlockedWorries = worries.filter((w) => w.status === 'unlocked');
  const lockedWorries = worries.filter((w) => w.status === 'locked');
  const hasWorries = worries.length > 0;

  const handleAddWorry = async (worry: { content: string; action?: string; unlockAt: string }) => {
    try {
      await addWorry(worry);
      await lockWorry();
      setShowLockAnimation(true);
    } catch (_error) {
      toast.error(lang.toasts.error.saveWorry, {
        action: {
          label: 'Retry',
          onClick: () => handleAddWorry(worry),
        },
      });
    }
  };

  const handleResolve = async (id: string) => {
    setLoadingStates((prev) => ({ ...prev, [id]: { ...prev[id], resolving: true } }));
    try {
      await resolveWorry(id);
      await resolveHaptic();
      toast.success(lang.toasts.success.worryResolved);
    } catch (_error) {
      toast.error(lang.toasts.error.resolveWorry, {
        action: {
          label: 'Retry',
          onClick: () => handleResolve(id),
        },
      });
    } finally {
      setLoadingStates((prev) => ({ ...prev, [id]: { ...prev[id], resolving: false } }));
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

  const handleDismiss = async (id: string) => {
    setLoadingStates((prev) => ({ ...prev, [id]: { ...prev[id], dismissing: true } }));
    try {
      await dismissWorry(id);
      toast.success(lang.toasts.success.worryDismissed);
    } catch (_error) {
      toast.error(lang.toasts.error.dismissWorry, {
        action: {
          label: 'Retry',
          onClick: () => handleDismiss(id),
        },
      });
    } finally {
      setLoadingStates((prev) => ({ ...prev, [id]: { ...prev[id], dismissing: false } }));
    }
  };

  const handleRelease = async (content: string) => {
    try {
      // Add the worry with a far-future date (it will be dismissed immediately anyway)
      const futureDate = new Date();
      futureDate.setFullYear(futureDate.getFullYear() + 100);

      const worry = await addWorry({
        content,
        unlockAt: futureDate.toISOString(),
      });

      // Immediately dismiss it
      await dismissWorry(worry.id);

      toast.success(lang.toasts.success.worryReleased, {
        duration: 4000,
      });
    } catch (_error) {
      toast.error(lang.toasts.error.releaseWorry, {
        action: {
          label: 'Retry',
          onClick: () => handleRelease(content),
        },
      });
    }
  };

  const handleEdit = async (
    id: string,
    updates: { content?: string; action?: string; unlockAt?: string }
  ) => {
    try {
      await editWorry(id, updates);
      toast.success(lang.toasts.success.worryUpdated);
    } catch (_error) {
      toast.error(lang.toasts.error.updateWorry, {
        action: {
          label: 'Retry',
          onClick: () => handleEdit(id, updates),
        },
      });
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
          <Link
            to="/settings"
            className="text-muted-foreground hover:text-foreground transition-colors"
            aria-label={lang.aria.settings}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-6 pb-24">
        {!hasWorries && (
          <EmptyState title={lang.home.empty.title} message={lang.home.empty.message} />
        )}

        {/* Unlocked Worries */}
        {unlockedWorries.length > 0 && (
          <section className="mb-8">
            <h2 className="text-xl font-bold text-foreground mb-4 tracking-tight">
              {lang.home.sections.ready}
            </h2>
            <div className="space-y-3">
              {unlockedWorries.map((worry) => (
                <WorryCard
                  key={worry.id}
                  worry={worry}
                  onResolve={handleResolve}
                  onSnooze={handleSnooze}
                  onDismiss={handleDismiss}
                  onEdit={handleOpenEdit}
                  isResolving={loadingStates[worry.id]?.resolving}
                  isSnoozing={loadingStates[worry.id]?.snoozing}
                  isDismissing={loadingStates[worry.id]?.dismissing}
                />
              ))}
            </div>
          </section>
        )}

        {/* Locked Worries Summary */}
        {lockedWorries.length > 0 && (
          <section>
            <div className="bg-secondary/20 rounded-lg p-6 border border-primary/20">
              <div className="flex items-center gap-3 mb-2">
                <Lock className="w-8 h-8 text-primary" />
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
        className="fixed bottom-6 right-6 w-14 h-14 bg-primary hover:bg-primary/90 text-primary-foreground rounded-full shadow-lg flex items-center justify-center text-2xl transition-transform hover:scale-110 active:scale-95"
        aria-label={lang.aria.addWorry}
      >
        +
      </button>

      {/* Add Worry Sheet */}
      <AddWorrySheet
        isOpen={isAddSheetOpen}
        onClose={() => setIsAddSheetOpen(false)}
        onAdd={handleAddWorry}
        onRelease={handleRelease}
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
      />

      {/* Lock Animation */}
      <LockAnimation show={showLockAnimation} onComplete={() => setShowLockAnimation(false)} />

      {/* Onboarding */}
      <Onboarding />
    </div>
  );
};
