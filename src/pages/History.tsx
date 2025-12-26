import { Search } from 'lucide-react';
import type React from 'react';
import { useMemo, useState } from 'react';
import { ConfirmationDialog } from '../components/ConfirmationDialog';
import { DebugErrorDialog } from '../components/DebugErrorDialog';
import { EditWorrySheet } from '../components/EditWorrySheet';
import { EmptyState } from '../components/EmptyState';
import { PageContainer } from '../components/PageContainer';
import { PageHeader } from '../components/PageHeader';
import { Input } from '../components/ui/input';
import { InputGroup, InputGroupIcon } from '../components/ui/input-group';
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
    <div className="h-full flex flex-col bg-background overflow-hidden">
      <PageHeader title={lang.history.title} subtitle={lang.history.subtitle} />
      <div className="flex-1 overflow-y-auto">
        {/* Filters */}
        <div className="bg-card border-b border-border">
          <PageContainer className="py-sm">
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
          </PageContainer>
        </div>

        {/* Search */}
        <div className="bg-card border-b border-border">
          <PageContainer className="py-sm">
            <InputGroup>
              <Input
                type="text"
                placeholder={lang.history.search.placeholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label={lang.aria.search}
                className="pl-10 bg-background min-h-touch-target"
              />
              <InputGroupIcon>
                <Search className="size-icon" aria-hidden="true" />
              </InputGroupIcon>
            </InputGroup>
          </PageContainer>
        </div>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          <PageContainer className="py-lg" withBottomPadding>
            {filteredWorries.length === 0 ? (
              <EmptyState
                title={lang.history.empty.title(filter)}
                message={
                  searchQuery
                    ? lang.history.empty.noSearchResults
                    : filter === 'all'
                      ? lang.history.empty.messageAll
                      : lang.history.empty.messageFiltered(filter)
                }
              />
            ) : (
              <div className="space-y-3">
                {filteredWorries
                  .slice()
                  .sort((a, b) => {
                    // Active (unlocked) worries first, then sort by createdAt descending
                    const aIsActive = a.status === 'unlocked' ? 1 : 0;
                    const bIsActive = b.status === 'unlocked' ? 1 : 0;
                    if (aIsActive !== bIsActive) return bIsActive - aIsActive;
                    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
                  })
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
          </PageContainer>
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
    </div>
  );
};
