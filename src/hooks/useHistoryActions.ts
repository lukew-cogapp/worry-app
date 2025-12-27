import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { lang } from '../config/language';
import type { Worry } from '../types';
import { toastErrorWithRetry } from '../utils/toast';
import { useDebugError } from './useDebugError';
import { useHaptics } from './useHaptics';
import { useLoadingStates } from './useLoadingStates';

type HistoryAction = 'unlocking' | 'dismissing';

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
  const navigate = useNavigate();
  const { unlockWorry: unlockHaptic } = useHaptics();
  const { handleError } = useDebugError();
  const { loadingStates, setLoading, clearLoading } = useLoadingStates<HistoryAction>();

  // Dialog states
  const [worryToDelete, setWorryToDelete] = useState<string | null>(null);
  const [worryToDismiss, setWorryToDismiss] = useState<string | null>(null);
  const [isEditSheetOpen, setIsEditSheetOpen] = useState(false);
  const [worryToEdit, setWorryToEdit] = useState<Worry | null>(null);

  // Loading states
  const [isEditingWorry, setIsEditingWorry] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleUnlockNow = async (id: string) => {
    setLoading(id, 'unlocking');
    try {
      await unlockWorryNow(id);
      await unlockHaptic();
      toast.success(lang.toasts.success.worryUnlocked);
      // Navigate to home so user can act on the unlocked worry
      navigate('/');
    } catch (error) {
      handleError(error, {
        operation: 'unlockWorryNow',
        worryId: id,
      });

      toastErrorWithRetry(lang.toasts.error.unlockWorry, () => handleUnlockNow(id));
    } finally {
      clearLoading(id, 'unlocking');
    }
  };

  const handleDismissClick = (id: string) => {
    setWorryToDismiss(id);
  };

  const confirmDismiss = async () => {
    if (!worryToDismiss) return;

    setLoading(worryToDismiss, 'dismissing');
    try {
      await dismissWorry(worryToDismiss);
      toast.success(lang.toasts.success.worryReleased);
      setWorryToDismiss(null);
    } catch (error) {
      handleError(error, {
        operation: 'releaseWorry',
        worryId: worryToDismiss,
      });

      toastErrorWithRetry(lang.toasts.error.releaseWorry, confirmDismiss);
    } finally {
      clearLoading(worryToDismiss, 'dismissing');
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

      toastErrorWithRetry(lang.toasts.error.deleteWorry, handleDelete);
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

      toastErrorWithRetry(lang.toasts.error.updateWorry, () => handleEdit(id, updates));
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
