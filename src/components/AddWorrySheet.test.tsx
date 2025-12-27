import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { FORM_VALIDATION } from '../config/constants';
import { lang } from '../config/language';
import { AddWorrySheet } from './AddWorrySheet';

// Mock the hooks and utilities
vi.mock('../hooks/useEscapeKey', () => ({
  useEscapeKey: vi.fn(),
}));

vi.mock('../store/preferencesStore', () => ({
  usePreferencesStore: vi.fn(() => ({
    preferences: {
      defaultUnlockTime: '09:00',
      showBestOutcomeField: true,
    },
  })),
}));

vi.mock('../utils/dates', () => ({
  getTomorrow: vi.fn(() => new Date('2025-01-16T09:00:00.000Z')),
  getNextMonday: vi.fn(() => new Date('2025-01-20T09:00:00.000Z')),
  getNextWeek: vi.fn(() => new Date('2025-01-22T09:00:00.000Z')),
}));

describe('AddWorrySheet', () => {
  const mockOnClose = vi.fn();
  const mockOnAdd = vi.fn();
  const mockOnRelease = vi.fn();

  const defaultProps = {
    isOpen: true,
    onClose: mockOnClose,
    onAdd: mockOnAdd,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should not render when isOpen is false', () => {
      render(<AddWorrySheet {...defaultProps} isOpen={false} />);
      expect(screen.queryByText(lang.addWorry.title)).not.toBeInTheDocument();
    });

    it('should render when isOpen is true', () => {
      render(<AddWorrySheet {...defaultProps} />);
      expect(screen.getByText(lang.addWorry.title)).toBeInTheDocument();
    });

    it('should render content field', () => {
      render(<AddWorrySheet {...defaultProps} />);
      expect(screen.getByLabelText(lang.addWorry.fields.content.label)).toBeInTheDocument();
    });

    it('should render submit and cancel buttons', () => {
      render(<AddWorrySheet {...defaultProps} />);

      expect(screen.getByText(lang.addWorry.buttons.submit)).toBeInTheDocument();
      expect(screen.getByText(lang.addWorry.buttons.cancel)).toBeInTheDocument();
    });

    it('should render release button when onRelease prop is provided', () => {
      render(<AddWorrySheet {...defaultProps} onRelease={mockOnRelease} />);
      expect(screen.getByText(lang.addWorry.buttons.release)).toBeInTheDocument();
    });

    it('should not render release button when onRelease prop is not provided', () => {
      render(<AddWorrySheet {...defaultProps} />);
      expect(screen.queryByText(lang.addWorry.buttons.release)).not.toBeInTheDocument();
    });

    it('should render close button in header', () => {
      render(<AddWorrySheet {...defaultProps} />);
      expect(screen.getByLabelText(lang.aria.close)).toBeInTheDocument();
    });
  });

  describe('Form Interactions', () => {
    it('should update content field when user types', async () => {
      const user = userEvent.setup();
      render(<AddWorrySheet {...defaultProps} />);

      const contentInput = screen.getByLabelText(lang.addWorry.fields.content.label);
      await user.type(contentInput, 'Test worry content');

      expect(contentInput).toHaveValue('Test worry content');
    });

    it('should clear error message when user starts typing', async () => {
      const user = userEvent.setup();
      render(<AddWorrySheet {...defaultProps} />);

      // Trigger form submission to show error
      const form = screen.getByLabelText(lang.addWorry.fields.content.label).closest('form');
      if (form) {
        fireEvent.submit(form);
      }

      // Error should appear
      await waitFor(() => {
        expect(screen.getByText("Please describe what's worrying you")).toBeInTheDocument();
      });

      // Type in content field
      const contentInput = screen.getByLabelText(lang.addWorry.fields.content.label);
      await user.type(contentInput, 'Test');

      // Error should disappear
      expect(screen.queryByText("Please describe what's worrying you")).not.toBeInTheDocument();
    });
  });

  describe('Form Validation', () => {
    it('should show error when submitting with empty content via form submit', async () => {
      render(<AddWorrySheet {...defaultProps} />);

      // Submit the form directly (bypassing button disabled state)
      const form = screen.getByLabelText(lang.addWorry.fields.content.label).closest('form');
      if (form) {
        // Trigger form submission via direct submit
        fireEvent.submit(form);
      }

      await waitFor(() => {
        expect(screen.getByText("Please describe what's worrying you")).toBeInTheDocument();
      });
      expect(mockOnAdd).not.toHaveBeenCalled();
    });

    it('should show error when submitting with only whitespace in content', async () => {
      const user = userEvent.setup();
      render(<AddWorrySheet {...defaultProps} />);

      const contentInput = screen.getByLabelText(lang.addWorry.fields.content.label);
      await user.type(contentInput, '   ');

      // Form submit should be triggered when user types Enter in textarea with whitespace
      const form = contentInput.closest('form');
      if (form) {
        fireEvent.submit(form);
      }

      await waitFor(() => {
        expect(screen.getByText("Please describe what's worrying you")).toBeInTheDocument();
      });
      expect(mockOnAdd).not.toHaveBeenCalled();
    });

    it('should disable submit button when content is empty', () => {
      render(<AddWorrySheet {...defaultProps} />);
      const submitButton = screen.getByText(lang.addWorry.buttons.submit);
      expect(submitButton).toBeDisabled();
    });

    it('should enable submit button when content has value', async () => {
      const user = userEvent.setup();
      render(<AddWorrySheet {...defaultProps} />);

      const contentInput = screen.getByLabelText(lang.addWorry.fields.content.label);
      await user.type(contentInput, 'Test worry');

      const submitButton = screen.getByText(lang.addWorry.buttons.submit);
      expect(submitButton).toBeEnabled();
    });

    it('should enforce max length on content field', () => {
      render(<AddWorrySheet {...defaultProps} />);
      const contentInput = screen.getByLabelText(
        lang.addWorry.fields.content.label
      ) as HTMLTextAreaElement;
      expect(contentInput).toHaveAttribute(
        'maxLength',
        FORM_VALIDATION.WORRY_CONTENT_MAX_LENGTH.toString()
      );
    });
  });

  describe('Form Submission', () => {
    it('should call onAdd with correct data when submitting valid form', async () => {
      const user = userEvent.setup();
      render(<AddWorrySheet {...defaultProps} />);

      const contentInput = screen.getByLabelText(lang.addWorry.fields.content.label);
      await user.type(contentInput, 'Test worry content');

      const submitButton = screen.getByText(lang.addWorry.buttons.submit);
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockOnAdd).toHaveBeenCalledWith({
          content: 'Test worry content',
          unlockAt: expect.any(String),
        });
      });
    });

    it('should trim whitespace from content before submitting', async () => {
      const user = userEvent.setup();
      render(<AddWorrySheet {...defaultProps} />);

      const contentInput = screen.getByLabelText(lang.addWorry.fields.content.label);
      await user.type(contentInput, '  Test worry  ');

      const submitButton = screen.getByText(lang.addWorry.buttons.submit);
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockOnAdd).toHaveBeenCalledWith({
          content: 'Test worry',
          unlockAt: expect.any(String),
        });
      });
    });

    it('should call onClose after successful submission', async () => {
      const user = userEvent.setup();
      render(<AddWorrySheet {...defaultProps} />);

      const contentInput = screen.getByLabelText(lang.addWorry.fields.content.label);
      await user.type(contentInput, 'Test worry');

      const submitButton = screen.getByText(lang.addWorry.buttons.submit);
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockOnClose).toHaveBeenCalled();
      });
    });

    it('should reset form after successful submission', async () => {
      const user = userEvent.setup();
      const { rerender } = render(<AddWorrySheet {...defaultProps} />);

      const contentInput = screen.getByLabelText(lang.addWorry.fields.content.label);
      await user.type(contentInput, 'Test worry');

      const submitButton = screen.getByText(lang.addWorry.buttons.submit);
      await user.click(submitButton);

      // Re-render to see the reset state
      rerender(<AddWorrySheet {...defaultProps} isOpen={true} />);

      const contentInputAfter = screen.getByLabelText(
        lang.addWorry.fields.content.label
      ) as HTMLTextAreaElement;
      expect(contentInputAfter.value).toBe('');
    });

    it('should submit form with Cmd+Enter on Mac', async () => {
      const user = userEvent.setup();
      render(<AddWorrySheet {...defaultProps} />);

      const contentInput = screen.getByLabelText(lang.addWorry.fields.content.label);
      await user.type(contentInput, 'Test worry');
      await user.keyboard('{Meta>}{Enter}{/Meta}');

      await waitFor(() => {
        expect(mockOnAdd).toHaveBeenCalled();
      });
    });

    it('should submit form with Ctrl+Enter on Windows/Linux', async () => {
      const user = userEvent.setup();
      render(<AddWorrySheet {...defaultProps} />);

      const contentInput = screen.getByLabelText(lang.addWorry.fields.content.label);
      await user.type(contentInput, 'Test worry');
      await user.keyboard('{Control>}{Enter}{/Control}');

      await waitFor(() => {
        expect(mockOnAdd).toHaveBeenCalled();
      });
    });
  });

  describe('Cancel Functionality', () => {
    it('should call onClose when cancel button is clicked', async () => {
      const user = userEvent.setup();
      render(<AddWorrySheet {...defaultProps} />);

      const cancelButton = screen.getByText(lang.addWorry.buttons.cancel);
      await user.click(cancelButton);

      expect(mockOnClose).toHaveBeenCalled();
    });

    it('should call onClose when close button (×) is clicked', async () => {
      const user = userEvent.setup();
      render(<AddWorrySheet {...defaultProps} />);

      const closeButton = screen.getByLabelText(lang.aria.close);
      await user.click(closeButton);

      expect(mockOnClose).toHaveBeenCalled();
    });

    it('should reset form when closing', async () => {
      const user = userEvent.setup();
      const { rerender } = render(<AddWorrySheet {...defaultProps} />);

      const contentInput = screen.getByLabelText(lang.addWorry.fields.content.label);
      await user.type(contentInput, 'Test worry');

      const cancelButton = screen.getByText(lang.addWorry.buttons.cancel);
      await user.click(cancelButton);

      // Re-render to see the reset state
      rerender(<AddWorrySheet {...defaultProps} isOpen={true} />);

      const contentInputAfter = screen.getByLabelText(
        lang.addWorry.fields.content.label
      ) as HTMLTextAreaElement;
      expect(contentInputAfter.value).toBe('');
    });

    it('should clear error message when closing', async () => {
      const user = userEvent.setup();
      const { rerender } = render(<AddWorrySheet {...defaultProps} />);

      // Trigger form submission to show error
      const form = screen.getByLabelText(lang.addWorry.fields.content.label).closest('form');
      if (form) {
        fireEvent.submit(form);
      }

      // Error should appear
      await waitFor(() => {
        expect(screen.getByText("Please describe what's worrying you")).toBeInTheDocument();
      });

      const cancelButton = screen.getByText(lang.addWorry.buttons.cancel);
      await user.click(cancelButton);

      // Re-render to see the reset state
      rerender(<AddWorrySheet {...defaultProps} isOpen={true} />);

      expect(screen.queryByText("Please describe what's worrying you")).not.toBeInTheDocument();
    });
  });

  describe('Release Functionality', () => {
    it('should call onRelease with content when release button is clicked', async () => {
      const user = userEvent.setup();
      render(<AddWorrySheet {...defaultProps} onRelease={mockOnRelease} />);

      const contentInput = screen.getByLabelText(lang.addWorry.fields.content.label);
      await user.type(contentInput, 'Test worry to release');

      const releaseButton = screen.getByText(lang.addWorry.buttons.release);
      await user.click(releaseButton);

      await waitFor(() => {
        expect(mockOnRelease).toHaveBeenCalledWith('Test worry to release');
      });
    });

    it('should trim whitespace before calling onRelease', async () => {
      const user = userEvent.setup();
      render(<AddWorrySheet {...defaultProps} onRelease={mockOnRelease} />);

      const contentInput = screen.getByLabelText(lang.addWorry.fields.content.label);
      await user.type(contentInput, '  Test worry  ');

      const releaseButton = screen.getByText(lang.addWorry.buttons.release);
      await user.click(releaseButton);

      await waitFor(() => {
        expect(mockOnRelease).toHaveBeenCalledWith('Test worry');
      });
    });

    it('should not call onRelease when content is empty', async () => {
      const user = userEvent.setup();
      render(<AddWorrySheet {...defaultProps} onRelease={mockOnRelease} />);

      const releaseButton = screen.getByText(lang.addWorry.buttons.release);
      await user.click(releaseButton);

      expect(mockOnRelease).not.toHaveBeenCalled();
    });

    it('should disable release button when content is empty', () => {
      render(<AddWorrySheet {...defaultProps} onRelease={mockOnRelease} />);
      const releaseButton = screen.getByText(lang.addWorry.buttons.release);
      expect(releaseButton).toBeDisabled();
    });

    it('should call onClose after releasing', async () => {
      const user = userEvent.setup();
      render(<AddWorrySheet {...defaultProps} onRelease={mockOnRelease} />);

      const contentInput = screen.getByLabelText(lang.addWorry.fields.content.label);
      await user.type(contentInput, 'Test worry');

      const releaseButton = screen.getByText(lang.addWorry.buttons.release);
      await user.click(releaseButton);

      await waitFor(() => {
        expect(mockOnClose).toHaveBeenCalled();
      });
    });

    it('should reset form after releasing', async () => {
      const user = userEvent.setup();
      const { rerender } = render(<AddWorrySheet {...defaultProps} onRelease={mockOnRelease} />);

      const contentInput = screen.getByLabelText(lang.addWorry.fields.content.label);
      await user.type(contentInput, 'Test worry');

      const releaseButton = screen.getByText(lang.addWorry.buttons.release);
      await user.click(releaseButton);

      // Re-render to see the reset state
      rerender(<AddWorrySheet {...defaultProps} onRelease={mockOnRelease} isOpen={true} />);

      const contentInputAfter = screen.getByLabelText(
        lang.addWorry.fields.content.label
      ) as HTMLTextAreaElement;
      expect(contentInputAfter.value).toBe('');
    });
  });

  describe('Loading States', () => {
    it('should disable content input when isSubmitting is true', () => {
      render(<AddWorrySheet {...defaultProps} isSubmitting={true} />);

      const contentInput = screen.getByLabelText(lang.addWorry.fields.content.label);
      expect(contentInput).toBeDisabled();
    });

    it('should disable all buttons when isSubmitting is true', () => {
      render(<AddWorrySheet {...defaultProps} isSubmitting={true} />);

      const submitButton = screen.getByText(lang.addWorry.buttons.submit);
      const cancelButton = screen.getByText(lang.addWorry.buttons.cancel);

      expect(submitButton).toBeDisabled();
      expect(cancelButton).toBeDisabled();
    });

    it('should disable content input when isReleasing is true', () => {
      render(<AddWorrySheet {...defaultProps} onRelease={mockOnRelease} isReleasing={true} />);

      const contentInput = screen.getByLabelText(lang.addWorry.fields.content.label);
      expect(contentInput).toBeDisabled();
    });

    it('should disable all buttons when isReleasing is true', () => {
      render(<AddWorrySheet {...defaultProps} onRelease={mockOnRelease} isReleasing={true} />);

      const submitButton = screen.getByText(lang.addWorry.buttons.submit);
      const cancelButton = screen.getByText(lang.addWorry.buttons.cancel);
      const releaseButton = screen.getByText(lang.addWorry.buttons.release);

      expect(submitButton).toBeDisabled();
      expect(cancelButton).toBeDisabled();
      expect(releaseButton).toBeDisabled();
    });

    it('should show loading spinner on submit button when isSubmitting is true', () => {
      render(<AddWorrySheet {...defaultProps} isSubmitting={true} />);

      // The Loader2 component should be present
      const submitButton = screen.getByText(lang.addWorry.buttons.submit);
      const svg = submitButton.querySelector('svg.animate-spin');
      expect(svg).toBeInTheDocument();
    });

    it('should show loading spinner on release button when isReleasing is true', () => {
      render(<AddWorrySheet {...defaultProps} onRelease={mockOnRelease} isReleasing={true} />);

      const releaseButton = screen.getByText(lang.addWorry.buttons.release);
      const svg = releaseButton.querySelector('svg.animate-spin');
      expect(svg).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper labels for content field', () => {
      render(<AddWorrySheet {...defaultProps} />);

      expect(screen.getByLabelText(lang.addWorry.fields.content.label)).toBeInTheDocument();
    });

    it('should mark content field as invalid when error is shown', async () => {
      render(<AddWorrySheet {...defaultProps} />);

      // Trigger form submission to show error
      const form = screen.getByLabelText(lang.addWorry.fields.content.label).closest('form');
      if (form) {
        fireEvent.submit(form);
      }

      await waitFor(() => {
        const contentInput = screen.getByLabelText(lang.addWorry.fields.content.label);
        expect(contentInput).toHaveAttribute('aria-invalid', 'true');
      });
    });

    it('should have proper heading hierarchy', () => {
      render(<AddWorrySheet {...defaultProps} />);

      const heading = screen.getByText(lang.addWorry.title);
      expect(heading.tagName).toBe('H2');
    });

    it('should have close button with aria-label', () => {
      render(<AddWorrySheet {...defaultProps} />);

      const closeButton = screen.getByLabelText(lang.aria.close);
      expect(closeButton).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('should handle rapid open/close cycles', async () => {
      const user = userEvent.setup();
      const { rerender } = render(<AddWorrySheet {...defaultProps} />);

      const contentInput = screen.getByLabelText(lang.addWorry.fields.content.label);
      await user.type(contentInput, 'Test');

      rerender(<AddWorrySheet {...defaultProps} isOpen={false} />);
      rerender(<AddWorrySheet {...defaultProps} isOpen={true} />);

      const contentInputAfter = screen.getByLabelText(
        lang.addWorry.fields.content.label
      ) as HTMLTextAreaElement;
      // Form should be preserved during rapid cycles (not reset unless explicitly closed)
      expect(contentInputAfter.value).toBe('Test');
    });

    it('should handle maximum length content', async () => {
      const user = userEvent.setup();
      render(<AddWorrySheet {...defaultProps} />);

      const maxContent = 'a'.repeat(FORM_VALIDATION.WORRY_CONTENT_MAX_LENGTH);
      const contentInput = screen.getByLabelText(lang.addWorry.fields.content.label);
      await user.type(contentInput, maxContent);

      // Just verify the content was entered (character count was removed)
      expect(contentInput).toHaveValue(maxContent);
    });
  });
});
