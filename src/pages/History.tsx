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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { WorryCard } from '../components/WorryCard';
import { lang } from '../config/language';
import { useHaptics } from '../hooks/useHaptics';
import { usePreferencesStore } from '../store/preferencesStore';
import { useWorryStore } from '../store/worryStore';
import type { Worry } from '../types';

type FilterType = 'all' | 'locked' | 'unlocked' | 'resolved' | 'dismissed' | 'released';

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
        .filter((w) => {
          if (filter === 'all') return true;
          if (filter === 'released') return w.releasedAt !== undefined;
          if (filter === 'dismissed') return w.status === 'dismissed' && !w.releasedAt;
          return w.status === filter;
        })
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
    dismissed: worries.filter((w) => w.status === 'dismissed' && !w.releasedAt).length,
    released: worries.filter((w) => w.releasedAt !== undefined).length,
  };

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
        <div className="max-w-4xl mx-auto px-4 py-3">
          <Select value={filter} onValueChange={(value: FilterType) => setFilter(value)}>
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">
                {lang.history.filters.all} ({counts.all})
              </SelectItem>
              <SelectItem value="locked">
                {lang.history.filters.locked} ({counts.locked})
              </SelectItem>
              <SelectItem value="unlocked">
                {lang.history.filters.unlocked} ({counts.unlocked})
              </SelectItem>
              <SelectItem value="resolved">
                {lang.history.filters.resolved} ({counts.resolved})
              </SelectItem>
              <SelectItem value="dismissed">
                {lang.history.filters.dismissed} ({counts.dismissed})
              </SelectItem>
              <SelectItem value="released">
                {lang.history.filters.released} ({counts.released})
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Search */}
      <div className="bg-card border-b border-border">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <div className="relative">
            <input
              type="text"
              placeholder={lang.history.search.placeholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label={lang.aria.search}
              className="w-full px-4 py-2 pl-10 border border-input rounded-lg bg-background text-foreground placeholder-muted-foreground focus:ring-2 focus:ring-ring focus:border-transparent"
            />
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 size-icon text-muted-foreground"
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
      <main className="max-w-4xl mx-auto px-4 py-6">
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
          <div className="space-y-3">
            {filteredWorries
              .slice()
              .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
              .map((worry) => (
                <WorryCard
                  key={worry.id}
                  worry={worry}
                  onUnlockNow={worry.status === 'locked' ? handleUnlockNow : undefined}
                  onDismiss={worry.status === 'locked' ? handleDismissClick : undefined}
                  onEdit={handleOpenEdit}
                  onDelete={
                    worry.status === 'resolved' || worry.status === 'dismissed'
                      ? (id) => setWorryToDelete(id)
                      : undefined
                  }
                  isUnlocking={loadingStates[worry.id]?.unlocking}
                  isDismissing={loadingStates[worry.id]?.dismissing}
                />
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
              {isDeleting && <Loader2 className="mr-2 size-icon-sm animate-spin" />}
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
                <Loader2 className="mr-2 size-icon-sm animate-spin" />
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
