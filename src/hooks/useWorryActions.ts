import { useState } from 'react';
import { toast } from 'sonner';
import { formatDuration, lang } from '../config/language';
import { useWorryStore } from '../store/worryStore';
import { useDebugError } from './useDebugError';
import { useHaptics } from './useHaptics';

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

  const [loadingStates, setLoadingStates] = useState<
    Record<string, { resolving?: boolean; snoozing?: boolean; dismissing?: boolean }>
  >({});

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

    setLoadingStates((prev) => ({
      ...prev,
      [worryToResolve]: { ...prev[worryToResolve], resolving: true },
    }));

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

      toast.error(lang.toasts.error.resolveWorry, {
        action: {
          label: 'Retry',
          onClick: handleResolve,
        },
      });
    } finally {
      setLoadingStates((prev) => ({
        ...prev,
        [worryToResolve]: { ...prev[worryToResolve], resolving: false },
      }));
    }
  };

  const handleSnooze = async (id: string, durationMs: number) => {
    setLoadingStates((prev) => ({ ...prev, [id]: { ...prev[id], snoozing: true } }));

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

      toast.error(lang.toasts.error.snoozeWorry, {
        action: {
          label: 'Retry',
          onClick: () => handleSnooze(id, durationMs),
        },
      });
    } finally {
      setLoadingStates((prev) => ({ ...prev, [id]: { ...prev[id], snoozing: false } }));
    }
  };

  const handleDismiss = async () => {
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
          onClick: handleDismiss,
        },
      });
    } finally {
      setLoadingStates((prev) => ({
        ...prev,
        [worryToDismiss]: { ...prev[worryToDismiss], dismissing: false },
      }));
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

      toast.error(lang.toasts.error.releaseWorry, {
        action: {
          label: 'Retry',
          onClick: handleRelease,
        },
      });
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
