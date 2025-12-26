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

/**
 * Animation durations in milliseconds
 */
export const ANIMATION_DURATIONS = {
  /** Lock away animation display duration */
  LOCK_ANIMATION: 2000,
  /** Fade in animation */
  FADE_IN: 200,
  /** Zoom in animation */
  ZOOM_IN: 500,
  /** Slide in animation */
  SLIDE_IN: 700,
  /** Success feedback animation */
  SUCCESS_FEEDBACK: 1500,
} as const;

/**
 * Form validation constraints
 */
export const FORM_VALIDATION = {
  /** Maximum length for worry content */
  WORRY_CONTENT_MAX_LENGTH: 500,
  /** Maximum length for worry action */
  WORRY_ACTION_MAX_LENGTH: 200,
  /** Maximum length for best outcome reflection */
  BEST_OUTCOME_MAX_LENGTH: 300,
} as const;

/**
 * Worry categories for organization
 */
export const WORRY_CATEGORIES = [
  'work',
  'health',
  'relationships',
  'finance',
  'personal',
  'other',
] as const;
