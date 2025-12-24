import type React from 'react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { EmptyState } from '../components/EmptyState';
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
import { Button } from '../components/ui/button';
import { WorryCard } from '../components/WorryCard';
import { useHaptics } from '../hooks/useHaptics';
import { useWorryStore } from '../store/worryStore';

type FilterType = 'all' | 'locked' | 'unlocked' | 'resolved' | 'dismissed';

export const History: React.FC = () => {
  const worries = useWorryStore((s) => s.worries);
  const unlockWorryNow = useWorryStore((s) => s.unlockWorryNow);
  const dismissWorry = useWorryStore((s) => s.dismissWorry);
  const deleteWorry = useWorryStore((s) => s.deleteWorry);

  const { unlockWorry: unlockHaptic } = useHaptics();

  const [filter, setFilter] = useState<FilterType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [worryToDelete, setWorryToDelete] = useState<string | null>(null);

  const filteredWorries = worries
    .filter((w) => (filter === 'all' ? true : w.status === filter))
    .filter((w) =>
      searchQuery
        ? w.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
          w.action?.toLowerCase().includes(searchQuery.toLowerCase())
        : true
    );

  const handleUnlockNow = async (id: string) => {
    try {
      await unlockWorryNow(id);
      await unlockHaptic();
      toast.success('Worry unlocked now!');
    } catch (_error) {
      toast.error('Failed to unlock worry');
    }
  };

  const handleDismiss = async (id: string) => {
    try {
      await dismissWorry(id);
      toast.success('Worry dismissed');
    } catch (_error) {
      toast.error('Failed to dismiss worry');
    }
  };

  const handleDelete = async () => {
    if (!worryToDelete) return;

    try {
      await deleteWorry(worryToDelete);
      toast.success('Worry deleted');
      setWorryToDelete(null);
    } catch (_error) {
      toast.error('Failed to delete worry');
    }
  };

  const counts = {
    all: worries.length,
    locked: worries.filter((w) => w.status === 'locked').length,
    unlocked: worries.filter((w) => w.status === 'unlocked').length,
    resolved: worries.filter((w) => w.status === 'resolved').length,
    dismissed: worries.filter((w) => w.status === 'dismissed').length,
  };

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
          <div>
            <h1 className="text-2xl font-bold text-foreground">Worry History</h1>
            <p className="text-sm text-muted-foreground">View all your worries</p>
          </div>
        </div>
      </header>

      {/* Filters */}
      <div className="bg-card border-b border-border">
        <div className="max-w-4xl mx-auto px-4 py-3 overflow-x-auto">
          <div className="flex gap-2">
            {(
              [
                { key: 'all', label: 'All' },
                { key: 'locked', label: 'Locked' },
                { key: 'unlocked', label: 'Unlocked' },
                { key: 'resolved', label: 'Resolved' },
                { key: 'dismissed', label: 'Dismissed' },
              ] as const
            ).map(({ key, label }) => (
              <button
                key={key}
                type="button"
                onClick={() => setFilter(key)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  filter === key
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                }`}
              >
                {label} ({counts[key]})
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="bg-card border-b border-border">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Search worries..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 pl-10 border border-input rounded-lg bg-background text-foreground placeholder-muted-foreground focus:ring-2 focus:ring-ring focus:border-transparent"
            />
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <title>Search</title>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-6">
        {filteredWorries.length === 0 ? (
          <EmptyState
            title={`No ${filter === 'all' ? '' : filter} worries`}
            message={
              filter === 'all'
                ? "You haven't added any worries yet."
                : `You don't have any ${filter} worries.`
            }
            icon="📦"
          />
        ) : (
          <div className="space-y-3">
            {filteredWorries
              .slice()
              .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
              .map((worry) => (
                <div key={worry.id} className="relative">
                  <WorryCard
                    worry={worry}
                    onUnlockNow={worry.status === 'locked' ? handleUnlockNow : undefined}
                    onDismiss={worry.status === 'locked' ? handleDismiss : undefined}
                  />
                  {(worry.status === 'resolved' || worry.status === 'dismissed') && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setWorryToDelete(worry.id)}
                      className="absolute top-2 right-2 text-muted-foreground hover:text-destructive active:scale-95"
                      aria-label="Delete worry"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <title>Delete</title>
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </Button>
                  )}
                </div>
              ))}
          </div>
        )}
      </main>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!worryToDelete} onOpenChange={(open) => !open && setWorryToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Worry?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this worry from your
              history.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
