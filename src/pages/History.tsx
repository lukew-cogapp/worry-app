import type React from 'react';
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ConfirmationDialog } from '../components/ConfirmationDialog';
import { DebugErrorDialog } from '../components/DebugErrorDialog';
import { EditWorrySheet } from '../components/EditWorrySheet';
import { EmptyState } from '../components/EmptyState';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { WorryCard } from '../components/WorryCard';
import { lang } from '../config/language';
import { useDebugError } from '../hooks/useDebugError';
import { useHistoryActions } from '../hooks/useHistoryActions';
import { usePreferencesStore } from '../store/preferencesStore';
import { useWorryStore } from '../store/worryStore';

type FilterType = 'all' | 'locked' | 'unlocked' | 'resolved' | 'dismissed' | 'released';

export const History: React.FC = () => {
  const worries = useWorryStore((s) => s.worries);
  const editWorry = useWorryStore((s) => s.editWorry);
  const unlockWorryNow = useWorryStore((s) => s.unlockWorryNow);
  const dismissWorry = useWorryStore((s) => s.dismissWorry);
  const deleteWorry = useWorryStore((s) => s.deleteWorry);
  const defaultUnlockTime = usePreferencesStore((s) => s.preferences.defaultUnlockTime);

  const { debugError, clearError } = useDebugError();

  // UI state for filtering and search
  const [filter, setFilter] = useState<FilterType>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // History action handlers (unlock, dismiss, delete, edit) with loading states
  const historyActions = useHistoryActions(
    unlockWorryNow,
    dismissWorry,
    deleteWorry,
    editWorry,
    worries
  );

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
                  onUnlockNow={
                    worry.status === 'locked' ? historyActions.handleUnlockNow : undefined
                  }
                  onDismiss={
                    worry.status === 'locked' ? historyActions.handleDismissClick : undefined
                  }
                  onEdit={historyActions.handleOpenEdit}
                  onDelete={
                    worry.status === 'resolved' || worry.status === 'dismissed'
                      ? (id) => historyActions.setWorryToDelete(id)
                      : undefined
                  }
                  isUnlocking={historyActions.loadingStates[worry.id]?.unlocking}
                  isDismissing={historyActions.loadingStates[worry.id]?.dismissing}
                />
              ))}
          </div>
        )}
      </main>

      {/* Delete Confirmation Dialog */}
      <ConfirmationDialog
        open={!!historyActions.worryToDelete}
        onOpenChange={(open) => !open && historyActions.setWorryToDelete(null)}
        title={lang.history.deleteDialog.title}
        description={lang.history.deleteDialog.description}
        confirmText={lang.history.deleteDialog.confirm}
        cancelText={lang.history.deleteDialog.cancel}
        onConfirm={historyActions.handleDelete}
        isLoading={historyActions.isDeleting}
        variant="destructive"
      />

      {/* Dismiss Confirmation Dialog */}
      <ConfirmationDialog
        open={!!historyActions.worryToDismiss}
        onOpenChange={(open) => !open && historyActions.setWorryToDismiss(null)}
        title={lang.history.dismissDialog.title}
        description={lang.history.dismissDialog.description}
        confirmText={lang.history.dismissDialog.confirm}
        cancelText={lang.history.dismissDialog.cancel}
        onConfirm={historyActions.confirmDismiss}
        isLoading={historyActions.loadingStates[historyActions.worryToDismiss || '']?.dismissing}
      />

      {/* Edit Worry Sheet */}
      <EditWorrySheet
        isOpen={historyActions.isEditSheetOpen}
        onClose={historyActions.handleCloseEdit}
        onEdit={historyActions.handleEdit}
        worry={historyActions.worryToEdit}
        defaultTime={defaultUnlockTime}
        isSubmitting={historyActions.isEditingWorry}
      />

      <DebugErrorDialog error={debugError} onClose={clearError} />
    </div>
  );
};
