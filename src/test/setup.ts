import '@testing-library/jest-dom';
import { afterEach, vi } from 'vitest';

// Mock Capacitor plugins
vi.mock('@capacitor/preferences', () => ({
  Preferences: {
    get: vi.fn(),
    set: vi.fn(),
    remove: vi.fn(),
  },
}));

vi.mock('@capacitor/local-notifications', () => ({
  LocalNotifications: {
    schedule: vi.fn(),
    cancel: vi.fn(),
    requestPermissions: vi.fn(),
    addListener: vi.fn(),
    removeAllListeners: vi.fn(),
    registerActionTypes: vi.fn(),
  },
}));

vi.mock('@capacitor/haptics', () => ({
  Haptics: {
    impact: vi.fn(),
    notification: vi.fn(),
  },
}));

// Clean up after each test
afterEach(() => {
  vi.clearAllMocks();
});
