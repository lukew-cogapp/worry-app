import { useState } from 'react';
import { toast } from 'sonner';
import { lang } from '../config/language';
import type { Worry } from '../types';
import { useDebugError } from './useDebugError';
import { useHaptics } from './useHaptics';

/**
 * Custom hook for History page action handlers
 * Encapsulates unlock, dismiss, delete, and edit operations
 */
export function useHistoryActions(
  unlockWorryNow: (id: string) => Promise<void>,
  dismissWorry: (id: string) => Promise<void>,
  deleteWorry: (id: string) => Promise<void>,
  editWorry: (
    id: string,
    updates: { content?: string; action?: string; unlockAt?: string }
  ) => Promise<void>,
  worries: Worry[]
) {
  const { unlockWorry: unlockHaptic } = useHaptics();
  const { handleError } = useDebugError();

  // Dialog states
  const [worryToDelete, setWorryToDelete] = useState<string | null>(null);
  const [worryToDismiss, setWorryToDismiss] = useState<string | null>(null);
  const [isEditSheetOpen, setIsEditSheetOpen] = useState(false);
  const [worryToEdit, setWorryToEdit] = useState<Worry | null>(null);

  // Loading states
  const [isEditingWorry, setIsEditingWorry] = useState(false);
  const [loadingStates, setLoadingStates] = useState<
    Record<string, { unlocking?: boolean; dismissing?: boolean }>
  >({});
  const [isDeleting, setIsDeleting] = useState(false);

  const handleUnlockNow = async (id: string) => {
    setLoadingStates((prev) => ({ ...prev, [id]: { ...prev[id], unlocking: true } }));
    try {
      await unlockWorryNow(id);
      await unlockHaptic();
      toast.success(lang.toasts.success.worryUnlocked);
    } catch (error) {
      handleError(error, {
        operation: 'unlockWorryNow',
        worryId: id,
      });

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
    } catch (error) {
      handleError(error, {
        operation: 'dismissWorry',
        worryId: worryToDismiss,
      });

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
    } catch (error) {
      handleError(error, {
        operation: 'deleteWorry',
        worryId: worryToDelete,
      });

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
    } catch (error) {
      handleError(error, {
        operation: 'editWorry',
        worryId: id,
        updates: {
          hasContent: !!updates.content,
          hasAction: !!updates.action,
          hasUnlockAt: !!updates.unlockAt,
        },
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

  const handleCloseEdit = () => {
    setIsEditSheetOpen(false);
    setWorryToEdit(null);
  };

  return {
    // Dialog states
    worryToDelete,
    setWorryToDelete,
    worryToDismiss,
    setWorryToDismiss,
    isEditSheetOpen,
    worryToEdit,

    // Loading states
    isEditingWorry,
    loadingStates,
    isDeleting,

    // Action handlers
    handleUnlockNow,
    handleDismissClick,
    confirmDismiss,
    handleDelete,
    handleEdit,
    handleOpenEdit,
    handleCloseEdit,
  };
}
