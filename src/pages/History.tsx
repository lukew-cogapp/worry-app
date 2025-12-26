import type React from 'react';
import { useMemo } from 'react';
import { ConfirmationDialog } from '../components/ConfirmationDialog';
import { DebugErrorDialog } from '../components/DebugErrorDialog';
import { EditWorrySheet } from '../components/EditWorrySheet';
import { EmptyState } from '../components/EmptyState';
import { PageContainer } from '../components/PageContainer';
import { PageHeader } from '../components/PageHeader';
import { WorryCard } from '../components/WorryCard';
import { lang } from '../config/language';
import { useDebugError } from '../hooks/useDebugError';
import { useHistoryActions } from '../hooks/useHistoryActions';
import { usePreferencesStore } from '../store/preferencesStore';
import { useWorryStore } from '../store/worryStore';

export const History: React.FC = () => {
  const worries = useWorryStore((s) => s.worries);
  const editWorry = useWorryStore((s) => s.editWorry);
  const unlockWorryNow = useWorryStore((s) => s.unlockWorryNow);
  const dismissWorry = useWorryStore((s) => s.dismissWorry);
  const deleteWorry = useWorryStore((s) => s.deleteWorry);
  const defaultUnlockTime = usePreferencesStore((s) => s.preferences.defaultUnlockTime);

  const { debugError, clearError } = useDebugError();

  // History action handlers (unlock, dismiss, delete, edit) with loading states
  const historyActions = useHistoryActions(
    unlockWorryNow,
    dismissWorry,
    deleteWorry,
    editWorry,
    worries
  );

  const sortedWorries = useMemo(
    () =>
      worries.slice().sort((a, b) => {
        // Active (unlocked) worries first, then sort by createdAt descending
        const aIsActive = a.status === 'unlocked' ? 1 : 0;
        const bIsActive = b.status === 'unlocked' ? 1 : 0;
        if (aIsActive !== bIsActive) return bIsActive - aIsActive;
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }),
    [worries]
  );

  return (
    <div className="h-full flex flex-col bg-background overflow-hidden">
      <PageHeader title={lang.history.title} subtitle={lang.history.subtitle} />
      <div className="flex-1 overflow-y-auto">
        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          <PageContainer className="py-lg" withBottomPadding>
            {sortedWorries.length === 0 ? (
              <EmptyState
                title={lang.history.empty.title('all')}
                message={lang.history.empty.messageAll}
              />
            ) : (
              <div className="space-y-3">
                {sortedWorries.map((worry) => (
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
