import { Edit3, Loader2, Lock, Sparkles } from 'lucide-react';
import type React from 'react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { FORM_VALIDATION, WORRY_CATEGORIES } from '../config/constants';
import { lang } from '../config/language';
import { useBodyScrollLock } from '../hooks/useBodyScrollLock';
import { useEscapeKey } from '../hooks/useEscapeKey';
import { usePreferencesStore } from '../store/preferencesStore';
import type { Worry, WorryCategory } from '../types';
import { getTomorrow } from '../utils/dates';
import { DateTimePicker } from './DateTimePicker';
import { SheetShell } from './SheetShell';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';

type Mode = 'add' | 'edit';

interface WorryFormSheetProps {
  mode: Mode;
  isOpen: boolean;
  onClose: () => void;
  defaultTime?: string;

  // Add mode props
  onAdd?: (data: { content: string; unlockAt: string; bestOutcome?: string }) => void;
  onRelease?: (content: string) => void;
  isSubmitting?: boolean;
  isReleasing?: boolean;

  // Edit mode props
  onEdit?: (
    id: string,
    updates: {
      content?: string;
      unlockAt?: string;
      category?: WorryCategory;
      bestOutcome?: string;
    }
  ) => void;
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
  const preferences = usePreferencesStore((s) => s.preferences);
  const contentInputRef = useRef<HTMLTextAreaElement>(null);
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<WorryCategory | ''>('');
  const [bestOutcome, setBestOutcome] = useState('');
  const [contentError, setContentError] = useState('');
  const [unlockError, setUnlockError] = useState('');

  // Default unlock time is tomorrow at the user's preferred time
  const defaultUnlockAt = useMemo(() => getTomorrow(defaultTime).toISOString(), [defaultTime]);
  const [unlockAt, setUnlockAt] = useState(defaultUnlockAt);

  // Initialize form with worry data when editing
  useEffect(() => {
    if (mode === 'edit' && worry) {
      setContent(worry.content);
      setUnlockAt(worry.unlockAt);
      setCategory(worry.category || '');
      setBestOutcome(worry.bestOutcome || '');
    }
  }, [mode, worry]);

  const resetForm = useCallback(() => {
    setContent('');
    setCategory('');
    setBestOutcome('');
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
        unlockAt,
        bestOutcome: bestOutcome.trim() || undefined,
      });
      resetForm();
    } else if (mode === 'edit' && onEdit && worry) {
      onEdit(worry.id, {
        content: trimmedContent,
        unlockAt,
        category: category ? (category as WorryCategory) : undefined,
        bestOutcome: bestOutcome.trim() || undefined,
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

  // Autofocus on content input when sheet opens (skip in test environment)
  useEffect(() => {
    if (isOpen && contentInputRef.current && !import.meta.env.VITEST) {
      // Small delay to ensure the sheet animation has started
      const timer = setTimeout(() => {
        contentInputRef.current?.focus();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

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
            ref={contentInputRef}
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
          {contentError && (
            <p
              id="worry-content-error"
              className="text-sm text-destructive font-medium mt-1"
              role="alert"
            >
              {contentError}
            </p>
          )}
        </div>

        {/* Category selection - only in edit mode */}
        {mode === 'edit' && (
          <div>
            <div className="block text-sm font-medium text-foreground mb-2">
              {lang.addWorry.fields.category.label}{' '}
              <span className="text-muted-foreground">
                {lang.addWorry.fields.category.optional}
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {WORRY_CATEGORIES.map((cat) => (
                <Button
                  key={cat}
                  type="button"
                  variant={category === cat ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setCategory(category === cat ? '' : (cat as WorryCategory))}
                  disabled={isLoading}
                  className="rounded-full px-3 py-1 h-8 text-sm"
                >
                  {lang.categories[cat as WorryCategory]}
                </Button>
              ))}
            </div>
          </div>
        )}

        {preferences.showBestOutcomeField && (
          <div>
            <label
              htmlFor="worry-best-outcome"
              className="block text-sm font-medium text-foreground mb-2"
            >
              {lang.addWorry.fields.bestOutcome.label}{' '}
              <span className="text-muted-foreground">
                {lang.addWorry.fields.bestOutcome.optional}
              </span>
            </label>
            <Textarea
              id="worry-best-outcome"
              value={bestOutcome}
              onChange={(e) => setBestOutcome(e.target.value)}
              placeholder={lang.addWorry.fields.bestOutcome.placeholder}
              rows={2}
              maxLength={FORM_VALIDATION.BEST_OUTCOME_MAX_LENGTH}
              disabled={isLoading}
              className="bg-background resize-none disabled:cursor-not-allowed"
            />
            <ul className="text-xs text-muted-foreground mt-2 space-y-1 list-disc list-inside">
              {lang.addWorry.fields.bestOutcome.guidance.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        )}

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
