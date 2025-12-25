/**
 * Debug logger that only logs in development mode
 *
 * In production builds, these logs are no-ops (optimized away by bundler).
 * This keeps debugging information visible during development while
 * keeping production builds clean.
 */

const isDev = import.meta.env.DEV;

export const logger = {
  log: (...args: unknown[]) => {
    if (isDev) console.log(...args);
  },

  warn: (...args: unknown[]) => {
    if (isDev) console.warn(...args);
  },

  error: (...args: unknown[]) => {
    // Always log errors, even in production
    console.error(...args);
  },
};
