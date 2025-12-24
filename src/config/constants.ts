/**
 * Application constants
 * Centralized location for magic numbers and configuration values
 */

/**
 * Snooze duration options in milliseconds
 */
export const SNOOZE_DURATIONS = {
  THIRTY_MINUTES: 30 * 60 * 1000,
  ONE_HOUR: 60 * 60 * 1000,
  FOUR_HOURS: 4 * 60 * 60 * 1000,
  ONE_DAY: 24 * 60 * 60 * 1000,
} as const;

/**
 * Toast notification durations in milliseconds
 */
export const TOAST_DURATIONS = {
  SHORT: 2000,
  NORMAL: 3000,
  LONG: 4000,
} as const;

/**
 * Date offsets for special cases
 */
export const DATE_OFFSETS = {
  /** Far future date for released worries (100 years) */
  RELEASE_YEARS: 100,
  /** One day in milliseconds */
  ONE_DAY: 24 * 60 * 60 * 1000,
  /** Two days in milliseconds */
  TWO_DAYS: 2 * 24 * 60 * 60 * 1000,
} as const;

/**
 * UI touch target minimum size (for accessibility)
 */
export const TOUCH_TARGET_SIZE = {
  MIN_HEIGHT: 44,
  MIN_WIDTH: 44,
} as const;
