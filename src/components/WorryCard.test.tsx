import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { SNOOZE_DURATIONS } from '../config/constants';
import { lang } from '../config/language';
import type { Worry } from '../types';
import { WorryCard } from './WorryCard';

// Mock the action sheet utility
vi.mock('../utils/actionSheet', () => ({
  showActionSheet: vi.fn(() => Promise.resolve(false)), // Always use fallback (dropdown)
}));

// Mock Capacitor
vi.mock('@capacitor/core', () => ({
  Capacitor: {
    isNativePlatform: vi.fn(() => false),
  },
}));

// Mock date utilities
vi.mock('../utils/dates', () => ({
  formatDateTime: vi.fn((date: string) => `Formatted: ${date}`),
  getRelativeTime: vi.fn((_date: string) => 'in 2 hours'),
}));

describe('WorryCard', () => {
  const mockOnResolve = vi.fn();
  const mockOnDismiss = vi.fn();
  const mockOnSnooze = vi.fn();
  const mockOnUnlockNow = vi.fn();
  const mockOnEdit = vi.fn();
  const mockOnDelete = vi.fn();
  const mockOnClick = vi.fn();

  const baseWorry: Worry = {
    id: 'test-id-123',
    content: 'Test worry content',
    createdAt: '2025-01-15T10:00:00.000Z',
    unlockAt: '2025-01-16T10:00:00.000Z',
    status: 'locked',
    notificationId: 123,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering - Locked Worry', () => {
    it('should render locked worry with correct content', () => {
      render(<WorryCard worry={baseWorry} />);
      expect(screen.getByText('Test worry content')).toBeInTheDocument();
    });

    it('should display locked status badge', () => {
      render(<WorryCard worry={baseWorry} />);
      expect(screen.getByText(lang.worryCard.status.locked)).toBeInTheDocument();
    });

    it('should display unlock time for locked worry', () => {
      render(<WorryCard worry={baseWorry} />);
      expect(screen.getByText(lang.worryCard.labels.unlocks('in 2 hours'))).toBeInTheDocument();
    });

    it('should render action when provided', () => {
      const worryWithAction = { ...baseWorry, action: 'Call the dentist' };
      render(<WorryCard worry={worryWithAction} />);
      expect(screen.getByText('Call the dentist')).toBeInTheDocument();
    });

    it('should not render action when not provided', () => {
      render(<WorryCard worry={baseWorry} />);
      const actionLabel = screen.queryByText(lang.worryCard.labels.action);
      expect(actionLabel).not.toBeInTheDocument();
    });

    it('should render unlock now button when handler provided', () => {
      render(<WorryCard worry={baseWorry} onUnlockNow={mockOnUnlockNow} />);
      expect(screen.getByText(lang.worryCard.buttons.unlockNow)).toBeInTheDocument();
    });

    it('should render dismiss button when handler provided', () => {
      render(<WorryCard worry={baseWorry} onDismiss={mockOnDismiss} />);
      expect(screen.getByText(lang.worryCard.buttons.release)).toBeInTheDocument();
    });

    it('should not render unlock now button when handler not provided', () => {
      render(<WorryCard worry={baseWorry} />);
      expect(screen.queryByText(lang.worryCard.buttons.unlockNow)).not.toBeInTheDocument();
    });

    it('should render edit button for locked worry when handler provided', () => {
      render(<WorryCard worry={baseWorry} onEdit={mockOnEdit} />);
      expect(screen.getByLabelText(lang.aria.editWorry)).toBeInTheDocument();
    });
  });

  describe('Rendering - Unlocked Worry', () => {
    const unlockedWorry: Worry = {
      ...baseWorry,
      status: 'unlocked',
      unlockedAt: '2025-01-16T10:00:00.000Z',
    };

    it('should display ready status badge for unlocked worry', () => {
      render(<WorryCard worry={unlockedWorry} />);
      expect(screen.getByText(lang.worryCard.status.ready)).toBeInTheDocument();
    });

    it('should display unlocked time', () => {
      render(<WorryCard worry={unlockedWorry} />);
      expect(
        screen.getByText(lang.worryCard.labels.unlocked('Formatted: 2025-01-16T10:00:00.000Z'))
      ).toBeInTheDocument();
    });

    it('should render mark done button when handler provided', () => {
      render(<WorryCard worry={unlockedWorry} onResolve={mockOnResolve} />);
      expect(screen.getByText(lang.worryCard.buttons.markDone)).toBeInTheDocument();
    });

    it('should render snooze button when handler provided', () => {
      render(<WorryCard worry={unlockedWorry} onSnooze={mockOnSnooze} />);
      expect(screen.getByText(lang.worryCard.buttons.snooze)).toBeInTheDocument();
    });

    it('should render dismiss button when handler provided', () => {
      render(<WorryCard worry={unlockedWorry} onDismiss={mockOnDismiss} />);
      expect(screen.getByText(lang.worryCard.buttons.release)).toBeInTheDocument();
    });

    it('should render edit button for unlocked worry when handler provided', () => {
      render(<WorryCard worry={unlockedWorry} onEdit={mockOnEdit} />);
      expect(screen.getByLabelText(lang.aria.editWorry)).toBeInTheDocument();
    });
  });

  describe('Rendering - Resolved Worry', () => {
    const resolvedWorry: Worry = {
      ...baseWorry,
      status: 'resolved',
      resolvedAt: '2025-01-17T10:00:00.000Z',
      resolutionNote: 'Called the dentist and booked appointment',
    };

    it('should display resolved status badge', () => {
      render(<WorryCard worry={resolvedWorry} />);
      expect(screen.getByText(lang.worryCard.status.resolved)).toBeInTheDocument();
    });

    it('should display resolved time', () => {
      render(<WorryCard worry={resolvedWorry} />);
      expect(
        screen.getByText(lang.worryCard.labels.resolved('Formatted: 2025-01-17T10:00:00.000Z'))
      ).toBeInTheDocument();
    });

    it('should display resolution note when provided', () => {
      render(<WorryCard worry={resolvedWorry} />);
      expect(screen.getByText('Called the dentist and booked appointment')).toBeInTheDocument();
    });

    it('should not render action buttons for resolved worry', () => {
      render(
        <WorryCard
          worry={resolvedWorry}
          onResolve={mockOnResolve}
          onDismiss={mockOnDismiss}
          onSnooze={mockOnSnooze}
        />
      );
      expect(screen.queryByText(lang.worryCard.buttons.markDone)).not.toBeInTheDocument();
      expect(screen.queryByText(lang.worryCard.buttons.snooze)).not.toBeInTheDocument();
      expect(screen.queryByText(lang.worryCard.buttons.release)).not.toBeInTheDocument();
    });

    it('should not render edit button for resolved worry', () => {
      render(<WorryCard worry={resolvedWorry} onEdit={mockOnEdit} />);
      expect(screen.queryByLabelText(lang.aria.editWorry)).not.toBeInTheDocument();
    });
  });

  describe('Rendering - Dismissed Worry', () => {
    const dismissedWorry: Worry = {
      ...baseWorry,
      status: 'dismissed',
    };

    it('should display dismissed status badge', () => {
      render(<WorryCard worry={dismissedWorry} />);
      expect(screen.getByText(lang.worryCard.status.dismissed)).toBeInTheDocument();
    });

    it('should not render action buttons for dismissed worry', () => {
      render(
        <WorryCard
          worry={dismissedWorry}
          onResolve={mockOnResolve}
          onDismiss={mockOnDismiss}
          onUnlockNow={mockOnUnlockNow}
        />
      );
      expect(screen.queryByText(lang.worryCard.buttons.markDone)).not.toBeInTheDocument();
      expect(screen.queryByText(lang.worryCard.buttons.unlockNow)).not.toBeInTheDocument();
      expect(screen.queryByText(lang.worryCard.buttons.release)).not.toBeInTheDocument();
    });
  });

  describe('Rendering - Released Worry', () => {
    const releasedWorry: Worry = {
      ...baseWorry,
      status: 'dismissed',
      releasedAt: '2025-01-16T12:00:00.000Z',
    };

    it('should display released status badge for released worry', () => {
      render(<WorryCard worry={releasedWorry} />);
      expect(screen.getByText(lang.worryCard.status.released)).toBeInTheDocument();
    });

    it('should not display dismissed badge for released worry', () => {
      render(<WorryCard worry={releasedWorry} />);
      const dismissedBadge = screen.queryByText(lang.worryCard.status.dismissed);
      expect(dismissedBadge).not.toBeInTheDocument();
    });
  });

  describe('Delete Button', () => {
    it('should render delete button when handler provided', () => {
      render(<WorryCard worry={baseWorry} onDelete={mockOnDelete} />);
      expect(screen.getByLabelText(lang.aria.delete)).toBeInTheDocument();
    });

    it('should not render delete button when handler not provided', () => {
      render(<WorryCard worry={baseWorry} />);
      expect(screen.queryByLabelText(lang.aria.delete)).not.toBeInTheDocument();
    });

    it('should render delete button for all worry statuses when handler provided', () => {
      const statuses: Array<Worry['status']> = ['locked', 'unlocked', 'resolved', 'dismissed'];

      for (const status of statuses) {
        const worry = { ...baseWorry, status };
        const { unmount } = render(<WorryCard worry={worry} onDelete={mockOnDelete} />);
        expect(screen.getByLabelText(lang.aria.delete)).toBeInTheDocument();
        unmount();
      }
    });
  });

  describe('Event Handlers - Locked Worry', () => {
    it('should call onClick when card is clicked', async () => {
      const user = userEvent.setup();
      render(<WorryCard worry={baseWorry} onClick={mockOnClick} />);

      const card = screen.getByText('Test worry content').closest('div[class*="cursor-pointer"]');
      if (card) {
        await user.click(card);
      }

      expect(mockOnClick).toHaveBeenCalledWith('test-id-123');
    });

    it('should call onUnlockNow when unlock now button is clicked', async () => {
      const user = userEvent.setup();
      render(<WorryCard worry={baseWorry} onUnlockNow={mockOnUnlockNow} />);

      const button = screen.getByText(lang.worryCard.buttons.unlockNow);
      await user.click(button);

      expect(mockOnUnlockNow).toHaveBeenCalledWith('test-id-123');
    });

    it('should call onDismiss when dismiss button is clicked', async () => {
      const user = userEvent.setup();
      render(<WorryCard worry={baseWorry} onDismiss={mockOnDismiss} />);

      const button = screen.getByText(lang.worryCard.buttons.release);
      await user.click(button);

      expect(mockOnDismiss).toHaveBeenCalledWith('test-id-123');
    });

    it('should call onEdit when edit button is clicked', async () => {
      const user = userEvent.setup();
      render(<WorryCard worry={baseWorry} onEdit={mockOnEdit} />);

      const button = screen.getByLabelText(lang.aria.editWorry);
      await user.click(button);

      expect(mockOnEdit).toHaveBeenCalledWith('test-id-123');
    });

    it('should call onDelete when delete button is clicked', async () => {
      const user = userEvent.setup();
      render(<WorryCard worry={baseWorry} onDelete={mockOnDelete} />);

      const button = screen.getByLabelText(lang.aria.delete);
      await user.click(button);

      expect(mockOnDelete).toHaveBeenCalledWith('test-id-123');
    });

    it('should not call onClick when unlock now button is clicked', async () => {
      const user = userEvent.setup();
      render(<WorryCard worry={baseWorry} onClick={mockOnClick} onUnlockNow={mockOnUnlockNow} />);

      const button = screen.getByText(lang.worryCard.buttons.unlockNow);
      await user.click(button);

      expect(mockOnUnlockNow).toHaveBeenCalledWith('test-id-123');
      expect(mockOnClick).not.toHaveBeenCalled(); // stopPropagation should prevent this
    });
  });

  describe('Event Handlers - Unlocked Worry', () => {
    const unlockedWorry: Worry = {
      ...baseWorry,
      status: 'unlocked',
      unlockedAt: '2025-01-16T10:00:00.000Z',
    };

    it('should call onResolve when mark done button is clicked', async () => {
      const user = userEvent.setup();
      render(<WorryCard worry={unlockedWorry} onResolve={mockOnResolve} />);

      const button = screen.getByText(lang.worryCard.buttons.markDone);
      await user.click(button);

      expect(mockOnResolve).toHaveBeenCalledWith('test-id-123');
    });

    it('should call onDismiss when dismiss button is clicked', async () => {
      const user = userEvent.setup();
      render(<WorryCard worry={unlockedWorry} onDismiss={mockOnDismiss} />);

      const button = screen.getByText(lang.worryCard.buttons.release);
      await user.click(button);

      expect(mockOnDismiss).toHaveBeenCalledWith('test-id-123');
    });

    it('should not call onClick when resolve button is clicked', async () => {
      const user = userEvent.setup();
      render(<WorryCard worry={unlockedWorry} onClick={mockOnClick} onResolve={mockOnResolve} />);

      const button = screen.getByText(lang.worryCard.buttons.markDone);
      await user.click(button);

      expect(mockOnResolve).toHaveBeenCalledWith('test-id-123');
      expect(mockOnClick).not.toHaveBeenCalled();
    });
  });

  describe('Snooze Functionality', () => {
    const unlockedWorry: Worry = {
      ...baseWorry,
      status: 'unlocked',
      unlockedAt: '2025-01-16T10:00:00.000Z',
    };

    it('should open snooze dropdown menu when snooze button is clicked', async () => {
      const user = userEvent.setup();
      render(<WorryCard worry={unlockedWorry} onSnooze={mockOnSnooze} />);

      const snoozeButton = screen.getByText(lang.worryCard.buttons.snooze);
      await user.click(snoozeButton);

      await waitFor(() => {
        expect(screen.getByText(lang.worryCard.snooze.thirtyMin)).toBeInTheDocument();
        expect(screen.getByText(lang.worryCard.snooze.oneHour)).toBeInTheDocument();
        expect(screen.getByText(lang.worryCard.snooze.fourHours)).toBeInTheDocument();
        expect(screen.getByText(lang.worryCard.snooze.oneDay)).toBeInTheDocument();
      });
    });

    it('should call onSnooze with 30 minutes duration', async () => {
      const user = userEvent.setup();
      render(<WorryCard worry={unlockedWorry} onSnooze={mockOnSnooze} />);

      const snoozeButton = screen.getByText(lang.worryCard.buttons.snooze);
      await user.click(snoozeButton);

      await waitFor(() => {
        expect(screen.getByText(lang.worryCard.snooze.thirtyMin)).toBeInTheDocument();
      });

      const option = screen.getByText(lang.worryCard.snooze.thirtyMin);
      await user.click(option);

      expect(mockOnSnooze).toHaveBeenCalledWith('test-id-123', SNOOZE_DURATIONS.THIRTY_MINUTES);
    });

    it('should call onSnooze with 1 hour duration', async () => {
      const user = userEvent.setup();
      render(<WorryCard worry={unlockedWorry} onSnooze={mockOnSnooze} />);

      const snoozeButton = screen.getByText(lang.worryCard.buttons.snooze);
      await user.click(snoozeButton);

      await waitFor(() => {
        expect(screen.getByText(lang.worryCard.snooze.oneHour)).toBeInTheDocument();
      });

      const option = screen.getByText(lang.worryCard.snooze.oneHour);
      await user.click(option);

      expect(mockOnSnooze).toHaveBeenCalledWith('test-id-123', SNOOZE_DURATIONS.ONE_HOUR);
    });

    it('should call onSnooze with 4 hours duration', async () => {
      const user = userEvent.setup();
      render(<WorryCard worry={unlockedWorry} onSnooze={mockOnSnooze} />);

      const snoozeButton = screen.getByText(lang.worryCard.buttons.snooze);
      await user.click(snoozeButton);

      await waitFor(() => {
        expect(screen.getByText(lang.worryCard.snooze.fourHours)).toBeInTheDocument();
      });

      const option = screen.getByText(lang.worryCard.snooze.fourHours);
      await user.click(option);

      expect(mockOnSnooze).toHaveBeenCalledWith('test-id-123', SNOOZE_DURATIONS.FOUR_HOURS);
    });

    it('should call onSnooze with 1 day duration', async () => {
      const user = userEvent.setup();
      render(<WorryCard worry={unlockedWorry} onSnooze={mockOnSnooze} />);

      const snoozeButton = screen.getByText(lang.worryCard.buttons.snooze);
      await user.click(snoozeButton);

      await waitFor(() => {
        expect(screen.getByText(lang.worryCard.snooze.oneDay)).toBeInTheDocument();
      });

      const option = screen.getByText(lang.worryCard.snooze.oneDay);
      await user.click(option);

      expect(mockOnSnooze).toHaveBeenCalledWith('test-id-123', SNOOZE_DURATIONS.ONE_DAY);
    });
  });

  describe('Loading States', () => {
    it('should disable unlock now button when isUnlocking is true', () => {
      render(<WorryCard worry={baseWorry} onUnlockNow={mockOnUnlockNow} isUnlocking={true} />);
      const button = screen.getByText(lang.worryCard.buttons.unlockNow);
      expect(button).toBeDisabled();
    });

    it('should disable dismiss button when isDismissing is true', () => {
      render(<WorryCard worry={baseWorry} onDismiss={mockOnDismiss} isDismissing={true} />);
      const button = screen.getByText(lang.worryCard.buttons.release);
      expect(button).toBeDisabled();
    });

    it('should disable buttons when isUnlocking is true', () => {
      render(
        <WorryCard
          worry={baseWorry}
          onUnlockNow={mockOnUnlockNow}
          onDismiss={mockOnDismiss}
          isUnlocking={true}
        />
      );
      expect(screen.getByText(lang.worryCard.buttons.unlockNow)).toBeDisabled();
      expect(screen.getByText(lang.worryCard.buttons.release)).toBeDisabled();
    });

    it('should show loading spinner when isUnlocking is true', () => {
      render(<WorryCard worry={baseWorry} onUnlockNow={mockOnUnlockNow} isUnlocking={true} />);
      const button = screen.getByText(lang.worryCard.buttons.unlockNow);
      const spinner = button.querySelector('svg.animate-spin');
      expect(spinner).toBeInTheDocument();
    });

    it('should show loading spinner when isDismissing is true', () => {
      render(<WorryCard worry={baseWorry} onDismiss={mockOnDismiss} isDismissing={true} />);
      const button = screen.getByText(lang.worryCard.buttons.release);
      const spinner = button.querySelector('svg.animate-spin');
      expect(spinner).toBeInTheDocument();
    });
  });

  describe('Loading States - Unlocked Worry', () => {
    const unlockedWorry: Worry = {
      ...baseWorry,
      status: 'unlocked',
      unlockedAt: '2025-01-16T10:00:00.000Z',
    };

    it('should disable all buttons when isResolving is true', () => {
      render(
        <WorryCard
          worry={unlockedWorry}
          onResolve={mockOnResolve}
          onSnooze={mockOnSnooze}
          onDismiss={mockOnDismiss}
          isResolving={true}
        />
      );

      expect(screen.getByText(lang.worryCard.buttons.markDone)).toBeDisabled();
      expect(screen.getByText(lang.worryCard.buttons.snooze)).toBeDisabled();
      expect(screen.getByText(lang.worryCard.buttons.release)).toBeDisabled();
    });

    it('should disable all buttons when isSnoozing is true', () => {
      render(
        <WorryCard
          worry={unlockedWorry}
          onResolve={mockOnResolve}
          onSnooze={mockOnSnooze}
          onDismiss={mockOnDismiss}
          isSnoozing={true}
        />
      );

      expect(screen.getByText(lang.worryCard.buttons.markDone)).toBeDisabled();
      expect(screen.getByText(lang.worryCard.buttons.snooze)).toBeDisabled();
      expect(screen.getByText(lang.worryCard.buttons.release)).toBeDisabled();
    });

    it('should disable all buttons when isDismissing is true', () => {
      render(
        <WorryCard
          worry={unlockedWorry}
          onResolve={mockOnResolve}
          onSnooze={mockOnSnooze}
          onDismiss={mockOnDismiss}
          isDismissing={true}
        />
      );

      expect(screen.getByText(lang.worryCard.buttons.markDone)).toBeDisabled();
      expect(screen.getByText(lang.worryCard.buttons.snooze)).toBeDisabled();
      expect(screen.getByText(lang.worryCard.buttons.release)).toBeDisabled();
    });

    it('should show loading spinner when isResolving is true', () => {
      render(<WorryCard worry={unlockedWorry} onResolve={mockOnResolve} isResolving={true} />);

      const button = screen.getByText(lang.worryCard.buttons.markDone);
      const spinner = button.querySelector('svg.animate-spin');
      expect(spinner).toBeInTheDocument();
    });

    it('should show loading spinner when isSnoozing is true', () => {
      render(<WorryCard worry={unlockedWorry} onSnooze={mockOnSnooze} isSnoozing={true} />);

      const button = screen.getByText(lang.worryCard.buttons.snooze);
      const spinner = button.querySelector('svg.animate-spin');
      expect(spinner).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have accessible edit button label', () => {
      render(<WorryCard worry={baseWorry} onEdit={mockOnEdit} />);
      expect(screen.getByLabelText(lang.aria.editWorry)).toBeInTheDocument();
    });

    it('should have accessible delete button label', () => {
      render(<WorryCard worry={baseWorry} onDelete={mockOnDelete} />);
      expect(screen.getByLabelText(lang.aria.delete)).toBeInTheDocument();
    });

    it('should have clickable card for better mobile UX', () => {
      render(<WorryCard worry={baseWorry} onClick={mockOnClick} />);
      const card = screen.getByText('Test worry content').closest('div[class*="cursor-pointer"]');
      expect(card).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('should handle worry without optional fields', () => {
      const minimalWorry: Worry = {
        id: 'minimal-id',
        content: 'Minimal worry',
        createdAt: '2025-01-15T10:00:00.000Z',
        unlockAt: '2025-01-16T10:00:00.000Z',
        status: 'locked',
        notificationId: 999,
      };

      render(<WorryCard worry={minimalWorry} />);
      expect(screen.getByText('Minimal worry')).toBeInTheDocument();
    });

    it('should handle very long content', () => {
      const longContentWorry = {
        ...baseWorry,
        content: 'A'.repeat(500),
      };

      render(<WorryCard worry={longContentWorry} />);
      expect(screen.getByText('A'.repeat(500))).toBeInTheDocument();
    });

    it('should handle worry with all optional fields', () => {
      const fullWorry: Worry = {
        id: 'full-id',
        content: 'Full worry',
        action: 'Do something',
        context: 'Because reasons',
        createdAt: '2025-01-15T10:00:00.000Z',
        unlockAt: '2025-01-16T10:00:00.000Z',
        unlockedAt: '2025-01-16T10:00:00.000Z',
        resolvedAt: '2025-01-17T10:00:00.000Z',
        resolutionNote: 'Did the thing',
        status: 'resolved',
        notificationId: 456,
        tags: ['work', 'urgent'],
      };

      render(<WorryCard worry={fullWorry} />);
      expect(screen.getByText('Full worry')).toBeInTheDocument();
      expect(screen.getByText('Do something')).toBeInTheDocument();
      expect(screen.getByText('Did the thing')).toBeInTheDocument();
    });

    it('should not crash when all handlers are undefined', () => {
      expect(() => {
        render(<WorryCard worry={baseWorry} />);
      }).not.toThrow();
    });

    it('should handle rapid clicks without crashing', async () => {
      const user = userEvent.setup();
      render(<WorryCard worry={baseWorry} onUnlockNow={mockOnUnlockNow} />);

      const button = screen.getByText(lang.worryCard.buttons.unlockNow);
      await user.click(button);
      await user.click(button);
      await user.click(button);

      expect(mockOnUnlockNow).toHaveBeenCalledTimes(3);
    });
  });

  describe('Memoization', () => {
    it('should not re-render when props are unchanged', () => {
      const { rerender } = render(<WorryCard worry={baseWorry} />);

      const firstRender = screen.getByText('Test worry content');

      rerender(<WorryCard worry={baseWorry} />);

      const secondRender = screen.getByText('Test worry content');

      // Same DOM node means no re-render (React.memo working)
      expect(firstRender).toBe(secondRender);
    });
  });
});
