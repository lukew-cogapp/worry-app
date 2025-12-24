import type React from 'react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { AddWorrySheet } from '../components/AddWorrySheet';
import { EmptyState } from '../components/EmptyState';
import { LockAnimation } from '../components/LockAnimation';
import { Onboarding } from '../components/Onboarding';
import { WorryCard } from '../components/WorryCard';
import { useHaptics } from '../hooks/useHaptics';
import { useWorryStore } from '../store/worryStore';

export const Home: React.FC = () => {
  const worries = useWorryStore((s) => s.worries);
  const addWorry = useWorryStore((s) => s.addWorry);
  const resolveWorry = useWorryStore((s) => s.resolveWorry);
  const dismissWorry = useWorryStore((s) => s.dismissWorry);
  const snoozeWorry = useWorryStore((s) => s.snoozeWorry);

  const { lockWorry, resolveWorry: resolveHaptic } = useHaptics();

  const [isAddSheetOpen, setIsAddSheetOpen] = useState(false);
  const [showLockAnimation, setShowLockAnimation] = useState(false);

  const unlockedWorries = worries.filter((w) => w.status === 'unlocked');
  const lockedWorries = worries.filter((w) => w.status === 'locked');
  const hasWorries = worries.length > 0;

  const handleAddWorry = async (worry: { content: string; action?: string; unlockAt: string }) => {
    try {
      await addWorry(worry);
      await lockWorry();
      setShowLockAnimation(true);
    } catch (error) {
      toast.error('Failed to save worry');
    }
  };

  const handleResolve = async (id: string) => {
    try {
      await resolveWorry(id);
      await resolveHaptic();
      toast.success('Worry resolved! Well done! ✓');
    } catch (error) {
      toast.error('Failed to resolve worry');
    }
  };

  const handleSnooze = async (id: string) => {
    try {
      await snoozeWorry(id, 60 * 60 * 1000); // 1 hour
      await lockWorry();
      toast.success('Worry snoozed for 1 hour');
    } catch (error) {
      toast.error('Failed to snooze worry');
    }
  };

  const handleDismiss = async (id: string) => {
    try {
      await dismissWorry(id);
      toast.success('Worry dismissed');
    } catch (error) {
      toast.error('Failed to dismiss worry');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Worry Box</h1>
            <p className="text-sm text-muted-foreground">
              Store your worries until you can act
            </p>
          </div>
          <Link
            to="/settings"
            className="text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Settings"
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
          <EmptyState
            title="No worries yet"
            message="Add your first worry and lock it away until you can act on it."
            icon="📦"
          />
        )}

        {/* Unlocked Worries */}
        {unlockedWorries.length > 0 && (
          <section className="mb-8">
            <h2 className="text-lg font-semibold text-foreground mb-3">
              Ready to Act
            </h2>
            <div className="space-y-3">
              {unlockedWorries.map((worry) => (
                <WorryCard
                  key={worry.id}
                  worry={worry}
                  onResolve={handleResolve}
                  onSnooze={handleSnooze}
                  onDismiss={handleDismiss}
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
                <span className="text-3xl">🔒</span>
                <div>
                  <h2 className="text-lg font-semibold text-foreground">
                    {lockedWorries.length} {lockedWorries.length === 1 ? 'Worry' : 'Worries'} Safely
                    Stored
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Your worries are locked away. Rest easy.
                  </p>
                </div>
              </div>
              <Link
                to="/history"
                className="text-sm text-primary hover:underline inline-block mt-2"
              >
                View all locked worries →
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
        aria-label="Add worry"
      >
        +
      </button>

      {/* Add Worry Sheet */}
      <AddWorrySheet
        isOpen={isAddSheetOpen}
        onClose={() => setIsAddSheetOpen(false)}
        onAdd={handleAddWorry}
      />

      {/* Lock Animation */}
      <LockAnimation show={showLockAnimation} onComplete={() => setShowLockAnimation(false)} />

      {/* Onboarding */}
      <Onboarding />
    </div>
  );
};
