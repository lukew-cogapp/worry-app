import { Loader2 } from 'lucide-react';
import type React from 'react';
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { EditWorrySheet } from '../components/EditWorrySheet';
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
import { lang } from '../config/language';
import { useHaptics } from '../hooks/useHaptics';
import { usePreferencesStore } from '../store/preferencesStore';
import { useWorryStore } from '../store/worryStore';
import type { Worry } from '../types';

type FilterType = 'all' | 'locked' | 'unlocked' | 'resolved' | 'dismissed';

export const History: React.FC = () => {
  const worries = useWorryStore((s) => s.worries);
  const editWorry = useWorryStore((s) => s.editWorry);
  const unlockWorryNow = useWorryStore((s) => s.unlockWorryNow);
  const dismissWorry = useWorryStore((s) => s.dismissWorry);
  const deleteWorry = useWorryStore((s) => s.deleteWorry);
  const defaultUnlockTime = usePreferencesStore((s) => s.preferences.defaultUnlockTime);

  const { unlockWorry: unlockHaptic } = useHaptics();

  const [filter, setFilter] = useState<FilterType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [worryToDelete, setWorryToDelete] = useState<string | null>(null);
  const [worryToDismiss, setWorryToDismiss] = useState<string | null>(null);
  const [isEditSheetOpen, setIsEditSheetOpen] = useState(false);
  const [worryToEdit, setWorryToEdit] = useState<Worry | null>(null);
  const [isEditingWorry, setIsEditingWorry] = useState(false);
  const [loadingStates, setLoadingStates] = useState<
    Record<string, { unlocking?: boolean; dismissing?: boolean }>
  >({});
  const [isDeleting, setIsDeleting] = useState(false);

  const filteredWorries = useMemo(
    () =>
      worries
        .filter((w) => (filter === 'all' ? true : w.status === filter))
        .filter((w) =>
          searchQuery
            ? w.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
              w.action?.toLowerCase().includes(searchQuery.toLowerCase())
            : true
        ),
    [worries, filter, searchQuery]
  );

  const handleUnlockNow = async (id: string) => {
    setLoadingStates((prev) => ({ ...prev, [id]: { ...prev[id], unlocking: true } }));
    try {
      await unlockWorryNow(id);
      await unlockHaptic();
      toast.success(lang.toasts.success.worryUnlocked);
    } catch (_error) {
      toast.error(lang.toasts.error.unlockWorry, {
        action: {
          label: 'Retry',
          onClick: () => handleUnlockNow(id),
        },
      });
    } finally {
      setLoadingStates((prev) => ({ ...prev, [id]: { ...prev[id], unlocking: false } }));
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

  const handleDelete = async () => {
    if (!worryToDelete) return;

    setIsDeleting(true);
    try {
      await deleteWorry(worryToDelete);
      toast.success(lang.toasts.success.worryDeleted);
      setWorryToDelete(null);
    } catch (_error) {
      toast.error(lang.toasts.error.deleteWorry, {
        action: {
          label: 'Retry',
          onClick: handleDelete,
        },
      });
    } finally {
      setIsDeleting(false);
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
        <div className="max-w-4xl mx-auto px-md py-md flex items-center gap-md">
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
          <div>
            <h1 className="text-3xl font-bold text-foreground tracking-tight">
              {lang.history.title}
            </h1>
            <p className="text-sm text-muted-foreground">{lang.history.subtitle}</p>
          </div>
        </div>
      </header>

      {/* Filters */}
      <div className="bg-card border-b border-border">
        <div className="max-w-4xl mx-auto px-md py-sm overflow-x-auto">
          <div className="flex gap-xs">
            {(
              [
                { key: 'all', label: lang.history.filters.all },
                { key: 'locked', label: lang.history.filters.locked },
                { key: 'unlocked', label: lang.history.filters.unlocked },
                { key: 'resolved', label: lang.history.filters.resolved },
                { key: 'dismissed', label: lang.history.filters.dismissed },
              ] as const
            ).map(({ key, label }) => (
              <button
                key={key}
                type="button"
                onClick={() => setFilter(key)}
                className={`min-h-touch-target px-md py-xs rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
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
        <div className="max-w-4xl mx-auto px-md py-sm">
          <div className="relative">
            <input
              type="text"
              placeholder={lang.history.search.placeholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label={lang.aria.search}
              className="w-full px-md py-xs pl-10 border border-input rounded-lg bg-background text-foreground placeholder-muted-foreground focus:ring-2 focus:ring-ring focus:border-transparent"
            />
            <svg
              className="absolute left-sm top-1/2 -translate-y-1/2 size-icon text-muted-foreground"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <title>{lang.aria.search}</title>
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
      <main className="max-w-4xl mx-auto px-md py-lg">
        {filteredWorries.length === 0 ? (
          <EmptyState
            title={lang.history.empty.title(filter)}
            message={
              filter === 'all'
                ? lang.history.empty.messageAll
                : lang.history.empty.messageFiltered(filter)
            }
          />
        ) : (
          <div className="space-y-sm">
            {filteredWorries
              .slice()
              .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
              .map((worry) => (
                <div key={worry.id} className="relative">
                  <WorryCard
                    worry={worry}
                    onUnlockNow={worry.status === 'locked' ? handleUnlockNow : undefined}
                    onDismiss={worry.status === 'locked' ? handleDismissClick : undefined}
                    onEdit={handleOpenEdit}
                    isUnlocking={loadingStates[worry.id]?.unlocking}
                    isDismissing={loadingStates[worry.id]?.dismissing}
                  />
                  {(worry.status === 'resolved' || worry.status === 'dismissed') && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setWorryToDelete(worry.id)}
                      className="absolute top-xs right-xs min-h-touch-target min-w-touch-target text-muted-foreground hover:text-destructive active:scale-95"
                      aria-label={lang.aria.delete}
                    >
                      <svg
                        className="size-icon"
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
            <AlertDialogTitle>{lang.history.deleteDialog.title}</AlertDialogTitle>
            <AlertDialogDescription>{lang.history.deleteDialog.description}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>
              {lang.history.deleteDialog.cancel}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting && <Loader2 className="mr-xs size-icon-sm animate-spin" />}
              {lang.history.deleteDialog.confirm}
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
                <Loader2 className="mr-xs size-icon-sm animate-spin" />
              )}
              {lang.history.dismissDialog.confirm}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

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
    </div>
  );
};
