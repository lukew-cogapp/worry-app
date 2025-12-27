import { useState } from 'react';
import { toast } from 'sonner';
import { formatDuration, lang } from '../config/language';
import { useWorryStore } from '../store/worryStore';
import { toastErrorWithRetry } from '../utils/toast';
import { useDebugError } from './useDebugError';
import { useHaptics } from './useHaptics';
import { useLoadingStates } from './useLoadingStates';

type WorryAction = 'resolving' | 'snoozing' | 'dismissing';

/**
 * Custom hook for managing worry actions (resolve, dismiss, snooze, release)
 * Consolidates loading states, error handling, and haptic feedback
 */
export function useWorryActions() {
  const resolveWorry = useWorryStore((s) => s.resolveWorry);
  const dismissWorry = useWorryStore((s) => s.dismissWorry);
  const releaseWorry = useWorryStore((s) => s.releaseWorry);
  const snoozeWorry = useWorryStore((s) => s.snoozeWorry);

  const { lockWorry, resolveWorry: resolveHaptic } = useHaptics();
  const { handleError } = useDebugError();
  const { loadingStates, setLoading, clearLoading } = useLoadingStates<WorryAction>();

  const [worryToResolve, setWorryToResolve] = useState<string | null>(null);
  const [resolutionNote, setResolutionNote] = useState('');
  const [worryToDismiss, setWorryToDismiss] = useState<string | null>(null);
  const [contentToRelease, setContentToRelease] = useState<string | null>(null);
  const [isShowingSuccessGlow, setIsShowingSuccessGlow] = useState(false);

  // Show success glow animation with race condition protection
  const showSuccessGlow = () => {
    if (isShowingSuccessGlow) return;

    setIsShowingSuccessGlow(true);
    document.body.classList.add('success-glow');

    setTimeout(() => {
      document.body.classList.remove('success-glow');
      setIsShowingSuccessGlow(false);
    }, 1000);
  };

  const handleResolve = async () => {
    if (!worryToResolve) return;

    setLoading(worryToResolve, 'resolving');

    try {
      await resolveWorry(worryToResolve, resolutionNote.trim() || undefined);
      await resolveHaptic();

      showSuccessGlow();

      toast.success(lang.toasts.success.worryResolved);
      setWorryToResolve(null);
      setResolutionNote('');
    } catch (error) {
      handleError(error, {
        operation: 'resolveWorry',
        worryId: worryToResolve,
        hasNote: !!resolutionNote.trim(),
      });

      toastErrorWithRetry(lang.toasts.error.resolveWorry, handleResolve);
    } finally {
      clearLoading(worryToResolve, 'resolving');
    }
  };

  const handleSnooze = async (id: string, durationMs: number) => {
    setLoading(id, 'snoozing');

    try {
      await snoozeWorry(id, durationMs);
      await lockWorry();
      toast.success(lang.toasts.success.snoozed(formatDuration(durationMs)));
    } catch (error) {
      handleError(error, {
        operation: 'snoozeWorry',
        worryId: id,
        durationMs,
      });

      toastErrorWithRetry(lang.toasts.error.snoozeWorry, () => handleSnooze(id, durationMs));
    } finally {
      clearLoading(id, 'snoozing');
    }
  };

  const handleDismiss = async () => {
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

      toastErrorWithRetry(lang.toasts.error.releaseWorry, handleDismiss);
    } finally {
      clearLoading(worryToDismiss, 'dismissing');
    }
  };

  const handleRelease = async () => {
    if (!contentToRelease) return;

    try {
      await releaseWorry(contentToRelease);
      toast.success(lang.toasts.success.worryReleased);
      setContentToRelease(null);
    } catch (error) {
      handleError(error, {
        operation: 'releaseWorry',
        contentLength: contentToRelease.length,
      });

      toastErrorWithRetry(lang.toasts.error.releaseWorry, handleRelease);
    }
  };

  return {
    // State
    loadingStates,
    worryToResolve,
    setWorryToResolve,
    resolutionNote,
    setResolutionNote,
    worryToDismiss,
    setWorryToDismiss,
    contentToRelease,
    setContentToRelease,

    // Actions
    handleResolve,
    handleSnooze,
    handleDismiss,
    handleRelease,
  };
}
