import { Edit3, Loader2, Lock, Sparkles } from 'lucide-react';
import type React from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { FORM_VALIDATION } from '../config/constants';
import { lang } from '../config/language';
import { useEscapeKey } from '../hooks/useEscapeKey';
import type { Worry } from '../types';
import { DateTimePicker } from './DateTimePicker';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';

type Mode = 'add' | 'edit';

interface WorryFormSheetProps {
  mode: Mode;
  isOpen: boolean;
  onClose: () => void;
  defaultTime?: string;

  // Add mode props
  onAdd?: (data: { content: string; action?: string; unlockAt: string }) => void;
  onRelease?: (content: string) => void;
  isSubmitting?: boolean;
  isReleasing?: boolean;

  // Edit mode props
  onEdit?: (id: string, updates: { content?: string; action?: string; unlockAt?: string }) => void;
  worry?: Worry | null;
}

/**
 * Unified form component for adding and editing worries
 * Handles both modes with conditional rendering and behavior
 */
export const WorryFormSheet: React.FC<WorryFormSheetProps> = ({
  mode,
  isOpen,
  onClose,
  defaultTime = '09:00',
  onAdd,
  onRelease,
  isSubmitting = false,
  isReleasing = false,
  onEdit,
  worry,
}) => {
  const modalRef = useRef<HTMLDivElement | null>(null);
  const [content, setContent] = useState('');
  const [action, setAction] = useState('');
  const [unlockAt, setUnlockAt] = useState('');
  const [error, setError] = useState('');

  // Initialize form with worry data when editing
  useEffect(() => {
    if (mode === 'edit' && worry) {
      setContent(worry.content);
      setAction(worry.action || '');
      setUnlockAt(worry.unlockAt);
    }
  }, [mode, worry]);

  const resetForm = useCallback(() => {
    setContent('');
    setAction('');
    setUnlockAt('');
    setError('');
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedContent = content.trim();
    if (!trimmedContent) {
      setError(lang.addWorry.validation.contentRequired);
      return;
    }

    if (mode === 'add' && onAdd) {
      onAdd({
        content: trimmedContent,
        action: action.trim() || undefined,
        unlockAt,
      });
      resetForm();
    } else if (mode === 'edit' && onEdit && worry) {
      onEdit(worry.id, {
        content: trimmedContent,
        action: action.trim() || undefined,
        unlockAt,
      });
    }

    onClose();
  };

  const handleRelease = () => {
    const trimmedContent = content.trim();
    if (!trimmedContent || !onRelease) return;

    onRelease(trimmedContent);
    resetForm();
    onClose();
  };

  const handleClose = useCallback(() => {
    if (mode === 'add') {
      resetForm();
    }
    onClose();
  }, [mode, onClose, resetForm]);

  // Handle Escape key
  useEscapeKey(handleClose, isOpen);

  // Clear error when user starts typing
  useEffect(() => {
    if (content) {
      setError('');
    }
  }, [content]);

  // Prevent body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const container = modalRef.current;
    if (!container) return;

    const focusableSelector =
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
    const focusable = Array.from(container.querySelectorAll<HTMLElement>(focusableSelector)).filter(
      (el) => !el.hasAttribute('disabled')
    );
    focusable[0]?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return;
      const items = Array.from(container.querySelectorAll<HTMLElement>(focusableSelector)).filter(
        (el) => !el.hasAttribute('disabled')
      );
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement;
      if (event.shiftKey && active === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  if (!isOpen || (mode === 'edit' && !worry)) return null;

  const title = mode === 'add' ? lang.addWorry.title : lang.editWorry.title;
  const submitText = mode === 'add' ? lang.addWorry.buttons.submit : lang.editWorry.save;
  const SubmitIcon = mode === 'add' ? Lock : Edit3;
  const isLoading = isSubmitting || isReleasing;
  const showDatePicker = mode === 'add' || (mode === 'edit' && worry?.status === 'locked');

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40 transition-opacity"
        onClick={handleClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        ref={modalRef}
        className="fixed inset-x-0 bottom-0 z-50 bg-card rounded-t-2xl shadow-dialog max-h-[90vh] overflow-y-auto overflow-x-hidden animate-slide-up"
        role="dialog"
        aria-modal="true"
        aria-labelledby="worry-form-title"
      >
        <div className="p-lg">
          <div className="flex items-center justify-between mb-lg">
            <h2 id="worry-form-title" className="text-2xl font-bold text-foreground">
              {title}
            </h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClose}
              className="text-muted-foreground hover:text-foreground text-2xl size-button-icon"
              aria-label={lang.aria.close}
            >
              ×
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-md">
            <div>
              <label
                htmlFor="worry-content"
                className="block text-sm font-medium text-foreground mb-2"
              >
                {lang.addWorry.fields.content.label}
              </label>
              <Textarea
                id="worry-content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                onKeyDown={(e) => {
                  if ((e.metaKey || e.ctrlKey) && e.key === 'Enter' && content.trim()) {
                    handleSubmit(e);
                  }
                }}
                placeholder={lang.addWorry.fields.content.placeholder}
                rows={3}
                maxLength={FORM_VALIDATION.WORRY_CONTENT_MAX_LENGTH}
                disabled={isLoading}
                aria-invalid={!!error}
                aria-describedby={error ? 'worry-content-error' : undefined}
                className="bg-background resize-none disabled:cursor-not-allowed"
              />
              <div className="flex items-center justify-between mt-1">
                <p id="worry-content-error" className="text-xs text-destructive" role="alert">
                  {error}
                </p>
                <p className="text-xs text-muted-foreground">
                  {content.length}/{FORM_VALIDATION.WORRY_CONTENT_MAX_LENGTH}
                </p>
              </div>
            </div>

            <div>
              <label
                htmlFor="worry-action"
                className="block text-sm font-medium text-foreground mb-2"
              >
                {lang.addWorry.fields.action.label}{' '}
                <span className="text-muted-foreground">
                  {lang.addWorry.fields.action.optional}
                </span>
              </label>
              <Input
                type="text"
                id="worry-action"
                value={action}
                onChange={(e) => setAction(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && content.trim()) {
                    handleSubmit(e);
                  }
                }}
                placeholder={lang.addWorry.fields.action.placeholder}
                maxLength={FORM_VALIDATION.WORRY_ACTION_MAX_LENGTH}
                disabled={isLoading}
                className="bg-background"
              />
              <p className="text-xs text-muted-foreground text-right mt-1">
                {action.length}/{FORM_VALIDATION.WORRY_ACTION_MAX_LENGTH}
              </p>
            </div>

            {showDatePicker && (
              <DateTimePicker value={unlockAt} onChange={setUnlockAt} defaultTime={defaultTime} />
            )}

            <div className="flex flex-col gap-3 pt-md">
              {mode === 'add' && onRelease && (
                <Button
                  type="button"
                  variant="ghost"
                  size="lg"
                  onClick={handleRelease}
                  disabled={!content.trim() || isLoading}
                  className="w-full min-h-touch-target"
                >
                  {isReleasing && <Loader2 className="size-icon-sm mr-2 animate-spin" />}
                  {!isReleasing && <Sparkles className="size-icon-sm mr-2" />}
                  {lang.addWorry.buttons.release}
                </Button>
              )}

              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="ghost"
                  size="lg"
                  onClick={handleClose}
                  disabled={isLoading}
                  className="flex-1 min-h-touch-target"
                >
                  {lang.addWorry.buttons.cancel}
                </Button>

                <Button
                  type="submit"
                  size="lg"
                  disabled={!content.trim() || isLoading}
                  className="flex-1 min-h-touch-target"
                >
                  {isSubmitting && <Loader2 className="size-icon-sm mr-2 animate-spin" />}
                  {!isSubmitting && <SubmitIcon className="size-icon-sm mr-2" />}
                  {submitText}
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};
