import { toast } from 'sonner';

/**
 * Show an error toast with a retry button
 * Simplifies the repetitive pattern of error toasts with retry actions
 *
 * @param message - The error message to display
 * @param onRetry - Callback function to invoke when retry button is clicked
 *
 * @example
 * toastErrorWithRetry(lang.toasts.error.resolveWorry, () => handleResolve());
 */
export function toastErrorWithRetry(message: string, onRetry: () => void) {
  toast.error(message, {
    action: {
      label: 'Retry',
      onClick: onRetry,
    },
  });
}
