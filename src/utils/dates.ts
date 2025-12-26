// Date utility functions for Worry Box

/**
 * Formats an ISO date string as a short date with time
 * @param isoString - ISO 8601 date string
 * @returns Formatted string like "Jan 15, 9:30 AM"
 * @example
 * formatDateTime("2024-01-15T09:30:00.000Z") // "Jan 15, 9:30 AM"
 */
export function formatDateTime(isoString: string): string {
  const date = new Date(isoString);
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(date);
}

/**
 * Formats an ISO date string as a short date (no time)
 * @param isoString - ISO 8601 date string
 * @returns Formatted string like "Jan 15, 2024"
 * @example
 * formatDate("2024-01-15T09:30:00.000Z") // "Jan 15, 2024"
 */
export function formatDate(isoString: string): string {
  const date = new Date(isoString);
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
}

/**
 * Formats an ISO date string as time only
 * @param isoString - ISO 8601 date string
 * @returns Formatted string like "9:30 AM"
 * @example
 * formatTime("2024-01-15T09:30:00.000Z") // "9:30 AM"
 */
export function formatTime(isoString: string): string {
  const date = new Date(isoString);
  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  }).format(date);
}

/**
 * Gets a human-readable relative time string for future dates
 * @param isoString - ISO 8601 date string
 * @returns Relative time like "in 5 minutes" or falls back to formatDateTime for > 7 days
 * @example
 * getRelativeTime("2024-01-15T10:00:00.000Z") // "in 30 minutes" (if current time is 9:30 AM)
 */
export function getRelativeTime(isoString: string): string {
  const date = new Date(isoString);
  const now = new Date();
  const diffMs = date.getTime() - now.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 60) {
    return `in ${diffMins} minute${diffMins !== 1 ? 's' : ''}`;
  } else if (diffHours < 24) {
    return `in ${diffHours} hour${diffHours !== 1 ? 's' : ''}`;
  } else if (diffDays < 7) {
    return `in ${diffDays} day${diffDays !== 1 ? 's' : ''}`;
  } else {
    return formatDateTime(isoString);
  }
}

/**
 * Adds hours to a date
 * @param date - The base date
 * @param hours - Number of hours to add (can be negative)
 * @returns New Date object with hours added
 * @example
 * addHours(new Date("2024-01-15T09:00:00"), 2) // 2024-01-15T11:00:00
 */
export function addHours(date: Date, hours: number): Date {
  const result = new Date(date);
  result.setHours(result.getHours() + hours);
  return result;
}

/**
 * Sets a specific time on a date
 * @param date - The base date
 * @param timeString - Time in "HH:MM" format (24-hour)
 * @returns New Date object with specified time
 * @example
 * setTimeOnDate(new Date("2024-01-15"), "14:30") // 2024-01-15T14:30:00
 */
export function setTimeOnDate(date: Date, timeString: string): Date {
  const [hours, minutes] = timeString.split(':').map(Number);
  const result = new Date(date);
  result.setHours(hours, minutes, 0, 0);
  return result;
}

/**
 * Checks if an ISO date string is today
 * @param isoString - ISO 8601 date string
 * @returns True if the date is today
 * @example
 * isToday("2024-01-15T09:00:00.000Z") // true (if today is Jan 15, 2024)
 */
export function isToday(isoString: string): boolean {
  const date = new Date(isoString);
  const today = new Date();
  return date.toDateString() === today.toDateString();
}

/**
 * Checks if an ISO date string is tomorrow
 * @param isoString - ISO 8601 date string
 * @returns True if the date is tomorrow
 * @example
 * isTomorrow("2024-01-16T09:00:00.000Z") // true (if today is Jan 15, 2024)
 */
export function isTomorrow(isoString: string): boolean {
  const date = new Date(isoString);
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return date.toDateString() === tomorrow.toDateString();
}

/**
 * Gets the next Monday from today with a specified time
 * @param time - Time in "HH:MM" format (default: "09:00")
 * @returns Date object for next Monday at specified time
 * @example
 * getNextMonday("10:00") // Next Monday at 10:00 AM
 */
export function getNextMonday(time: string = '09:00'): Date {
  const now = new Date();
  const daysUntilMonday = (8 - now.getDay()) % 7 || 7;
  const nextMonday = new Date(now);
  nextMonday.setDate(now.getDate() + daysUntilMonday);
  return setTimeOnDate(nextMonday, time);
}

/**
 * Gets tomorrow's date with a specified time
 * @param time - Time in "HH:MM" format (default: "09:00")
 * @returns Date object for tomorrow at specified time
 * @example
 * getTomorrow("09:00") // Tomorrow at 9:00 AM
 */
export function getTomorrow(time: string = '09:00'): Date {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return setTimeOnDate(tomorrow, time);
}

/**
 * Gets the date one week from today with a specified time
 * @param time - Time in "HH:MM" format (default: "09:00")
 * @returns Date object for one week from today at specified time
 * @example
 * getNextWeek("09:00") // Same day next week at 9:00 AM
 */
export function getNextWeek(time: string = '09:00'): Date {
  const nextWeek = new Date();
  nextWeek.setDate(nextWeek.getDate() + 7);
  return setTimeOnDate(nextWeek, time);
}
