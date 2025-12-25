import { useState } from 'react';

/**
 * Debug error state
 */
export interface DebugError {
  message: string;
  details: string;
  stack?: string;
}

/**
 * Hook for debug error handling
 *
 * Centralized error handling that shows detailed error information on screen.
 * In the future, this can be easily modified to:
 * - Disable in production builds
 * - Send errors to analytics
 * - Show different UI based on error type
 * - Log to external error tracking service
 */
export function useDebugError() {
  const [debugError, setDebugError] = useState<DebugError | null>(null);

  /**
   * Handle an error by displaying debug information
   *
   * @param error - The error object
   * @param context - Additional context about what operation failed
   */
  const handleError = (error: unknown, context?: Record<string, unknown>) => {
    // TODO: In production, disable this or send to error tracking
    // if (import.meta.env.PROD) return;

    const errorInfo: DebugError = {
      message: error instanceof Error ? error.message : 'Unknown error',
      details: JSON.stringify(
        {
          errorType: error?.constructor?.name,
          error: error instanceof Error ? error.toString() : String(error),
          ...(context && { context }),
        },
        null,
        2
      ),
      stack: error instanceof Error ? error.stack : undefined,
    };

    setDebugError(errorInfo);
  };

  /**
   * Clear the current debug error
   */
  const clearError = () => {
    setDebugError(null);
  };

  return {
    debugError,
    handleError,
    clearError,
  };
}
