import { Edit3, Loader2, Lock, Sparkles } from 'lucide-react';
import type React from 'react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { FORM_VALIDATION } from '../config/constants';
import { lang } from '../config/language';
import { useBodyScrollLock } from '../hooks/useBodyScrollLock';
import { useEscapeKey } from '../hooks/useEscapeKey';
import type { Worry } from '../types';
import { getTomorrow } from '../utils/dates';
import { DateTimePicker } from './DateTimePicker';
import { SheetShell } from './SheetShell';
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
  const [content, setContent] = useState('');
  const [action, setAction] = useState('');
  const [contentError, setContentError] = useState('');
  const [unlockError, setUnlockError] = useState('');

  // Default unlock time is tomorrow at the user's preferred time
  const defaultUnlockAt = useMemo(() => getTomorrow(defaultTime).toISOString(), [defaultTime]);
  const [unlockAt, setUnlockAt] = useState(defaultUnlockAt);

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
    setUnlockAt(defaultUnlockAt);
    setContentError('');
    setUnlockError('');
  }, [defaultUnlockAt]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedContent = content.trim();
    let hasError = false;

    if (!trimmedContent) {
      setContentError(lang.addWorry.validation.contentRequired);
      hasError = true;
    }

    // Validate unlock time is set in add mode
    if (mode === 'add' && !unlockAt) {
      setUnlockError(lang.validation.unlockTimeRequired);
      hasError = true;
    }

    if (hasError) return;

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

  // Clear content error when user starts typing
  useEffect(() => {
    if (content) {
      setContentError('');
    }
  }, [content]);

  // Clear unlock error when user selects a time
  useEffect(() => {
    if (unlockAt) {
      setUnlockError('');
    }
  }, [unlockAt]);

  useBodyScrollLock(isOpen);

  if (!isOpen || (mode === 'edit' && !worry)) return null;

  const title = mode === 'add' ? lang.addWorry.title : lang.editWorry.title;
  const submitText = mode === 'add' ? lang.addWorry.buttons.submit : lang.editWorry.save;
  const SubmitIcon = mode === 'add' ? Lock : Edit3;
  const isLoading = isSubmitting || isReleasing;
  const showDatePicker = mode === 'add' || (mode === 'edit' && worry?.status === 'locked');

  return (
    <SheetShell
      open={isOpen}
      onClose={handleClose}
      ariaLabelledBy="worry-form-title"
      title={title}
      titleClassName="text-2xl font-bold"
      headerClassName="mb-lg"
      trapFocus
    >
      <form onSubmit={handleSubmit} className="space-y-md">
        <div>
          <label htmlFor="worry-content" className="block text-sm font-medium text-foreground mb-2">
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
            aria-invalid={!!contentError}
            aria-describedby={contentError ? 'worry-content-error' : undefined}
            className="bg-background resize-none disabled:cursor-not-allowed"
          />
          <div className="flex items-center justify-between mt-1">
            {contentError && (
              <p
                id="worry-content-error"
                className="text-sm text-destructive font-medium"
                role="alert"
              >
                {contentError}
              </p>
            )}
            <p className="text-caption ml-auto">
              {content.length}/{FORM_VALIDATION.WORRY_CONTENT_MAX_LENGTH}
            </p>
          </div>
        </div>

        <div>
          <label htmlFor="worry-action" className="block text-sm font-medium text-foreground mb-2">
            {lang.addWorry.fields.action.label}{' '}
            <span className="text-muted-foreground">{lang.addWorry.fields.action.optional}</span>
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
          <p className="text-caption text-right mt-1">
            {action.length}/{FORM_VALIDATION.WORRY_ACTION_MAX_LENGTH}
          </p>
        </div>

        {showDatePicker && (
          <div>
            <DateTimePicker value={unlockAt} onChange={setUnlockAt} defaultTime={defaultTime} />
            {unlockError && (
              <p className="text-sm text-destructive font-medium mt-2" role="alert">
                {unlockError}
              </p>
            )}
          </div>
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
    </SheetShell>
  );
};
