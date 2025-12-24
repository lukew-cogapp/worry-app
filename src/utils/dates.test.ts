import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  addHours,
  formatDate,
  formatDateTime,
  formatTime,
  getNextMonday,
  getNextWeek,
  getRelativeTime,
  getTomorrow,
  isToday,
  isTomorrow,
  setTimeOnDate,
} from './dates';

describe('dates utility functions', () => {
  beforeEach(() => {
    // Reset date to a known value for testing
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2025-01-15T10:00:00.000Z')); // Wednesday
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('formatDateTime', () => {
    it('should format ISO string to readable date and time', () => {
      const result = formatDateTime('2025-01-15T14:30:00.000Z');
      expect(result).toContain('Jan');
      expect(result).toContain('15');
    });
  });

  describe('formatDate', () => {
    it('should format ISO string to readable date', () => {
      const result = formatDate('2025-01-15T14:30:00.000Z');
      expect(result).toContain('Jan');
      expect(result).toContain('15');
      expect(result).toContain('2025');
    });
  });

  describe('formatTime', () => {
    it('should format ISO string to readable time', () => {
      const result = formatTime('2025-01-15T14:30:00.000Z');
      expect(result).toMatch(/\d{1,2}:\d{2}/);
    });
  });

  describe('getRelativeTime', () => {
    it('should return "in X minutes" for times less than an hour away', () => {
      const future = new Date('2025-01-15T10:30:00.000Z').toISOString();
      const result = getRelativeTime(future);
      expect(result).toContain('minute');
    });

    it('should return "in X hours" for times less than a day away', () => {
      const future = new Date('2025-01-15T14:00:00.000Z').toISOString();
      const result = getRelativeTime(future);
      expect(result).toContain('hour');
    });

    it('should return "in X days" for times less than a week away', () => {
      const future = new Date('2025-01-17T10:00:00.000Z').toISOString();
      const result = getRelativeTime(future);
      expect(result).toContain('day');
    });

    it('should return formatted date for times more than a week away', () => {
      const future = new Date('2025-01-25T10:00:00.000Z').toISOString();
      const result = getRelativeTime(future);
      expect(result).toContain('Jan');
    });
  });

  describe('addHours', () => {
    it('should add hours to a date', () => {
      const date = new Date('2025-01-15T10:00:00.000Z');
      const result = addHours(date, 5);
      expect(result.getHours()).toBe(15);
    });

    it('should handle negative hours', () => {
      const date = new Date('2025-01-15T10:00:00.000Z');
      const result = addHours(date, -2);
      expect(result.getHours()).toBe(8);
    });
  });

  describe('setTimeOnDate', () => {
    it('should set time on a date', () => {
      const date = new Date('2025-01-15T00:00:00.000Z');
      const result = setTimeOnDate(date, '14:30');
      expect(result.getHours()).toBe(14);
      expect(result.getMinutes()).toBe(30);
      expect(result.getSeconds()).toBe(0);
      expect(result.getMilliseconds()).toBe(0);
    });
  });

  describe('isToday', () => {
    it('should return true for today\'s date', () => {
      const today = new Date().toISOString();
      expect(isToday(today)).toBe(true);
    });

    it('should return false for yesterday', () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      expect(isToday(yesterday.toISOString())).toBe(false);
    });

    it('should return false for tomorrow', () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      expect(isToday(tomorrow.toISOString())).toBe(false);
    });
  });

  describe('isTomorrow', () => {
    it('should return true for tomorrow\'s date', () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      expect(isTomorrow(tomorrow.toISOString())).toBe(true);
    });

    it('should return false for today', () => {
      const today = new Date().toISOString();
      expect(isTomorrow(today)).toBe(false);
    });
  });

  describe('getNextMonday', () => {
    it('should return next Monday with default time', () => {
      const result = getNextMonday();
      expect(result.getDay()).toBe(1); // Monday
      expect(result.getHours()).toBe(9);
      expect(result.getMinutes()).toBe(0);
    });

    it('should return next Monday with custom time', () => {
      const result = getNextMonday('14:30');
      expect(result.getDay()).toBe(1); // Monday
      expect(result.getHours()).toBe(14);
      expect(result.getMinutes()).toBe(30);
    });

    it('should return a Monday after today', () => {
      const result = getNextMonday();
      const now = new Date();
      expect(result > now).toBe(true);
    });
  });

  describe('getTomorrow', () => {
    it('should return tomorrow with default time', () => {
      const result = getTomorrow();
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);

      expect(result.getDate()).toBe(tomorrow.getDate());
      expect(result.getHours()).toBe(9);
      expect(result.getMinutes()).toBe(0);
    });

    it('should return tomorrow with custom time', () => {
      const result = getTomorrow('15:45');
      expect(result.getHours()).toBe(15);
      expect(result.getMinutes()).toBe(45);
    });
  });

  describe('getNextWeek', () => {
    it('should return same day next week with default time', () => {
      const result = getNextWeek();
      const now = new Date();
      const weekLater = new Date();
      weekLater.setDate(now.getDate() + 7);

      expect(result.getDate()).toBe(weekLater.getDate());
      expect(result.getHours()).toBe(9);
      expect(result.getMinutes()).toBe(0);
    });

    it('should return same day next week with custom time', () => {
      const result = getNextWeek('16:20');
      expect(result.getHours()).toBe(16);
      expect(result.getMinutes()).toBe(20);
    });
  });
});
