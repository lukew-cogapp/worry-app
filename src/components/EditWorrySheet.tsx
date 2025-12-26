import { Edit3, Loader2 } from 'lucide-react';
import type React from 'react';
import { useCallback, useEffect, useState } from 'react';
import { FORM_VALIDATION } from '../config/constants';
import { lang } from '../config/language';
import { useEscapeKey } from '../hooks/useEscapeKey';
import type { Worry } from '../types';
import { DateTimePicker } from './DateTimePicker';
import { Button } from './ui/button';

interface EditWorrySheetProps {
  isOpen: boolean;
  onClose: () => void;
  onEdit: (id: string, updates: { content?: string; action?: string; unlockAt?: string }) => void;
  worry: Worry | null;
  defaultTime?: string;
  isSubmitting?: boolean;
}

export const EditWorrySheet: React.FC<EditWorrySheetProps> = ({
  isOpen,
  onClose,
  onEdit,
  worry,
  defaultTime = '09:00',
  isSubmitting = false,
}) => {
  const [content, setContent] = useState('');
  const [action, setAction] = useState('');
  const [unlockAt, setUnlockAt] = useState('');

  // Initialize form with worry data when worry changes
  useEffect(() => {
    if (worry) {
      setContent(worry.content);
      setAction(worry.action || '');
      setUnlockAt(worry.unlockAt);
    }
  }, [worry]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || !worry) return;

    onEdit(worry.id, {
      content: content.trim(),
      action: action.trim() || undefined,
      unlockAt,
    });

    onClose();
  };

  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  // Handle Escape key
  useEscapeKey(handleClose, isOpen);

  if (!isOpen || !worry) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 z-40 transition-opacity" />

      {/* Modal */}
      <div className="fixed inset-x-0 bottom-0 z-50 bg-card rounded-t-2xl shadow-dialog max-h-[90vh] overflow-y-auto animate-slide-up">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-foreground">{lang.editWorry.title}</h2>
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

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="edit-worry-content"
                className="block text-sm font-medium text-foreground mb-2"
              >
                {lang.addWorry.fields.content.label}
              </label>
              <textarea
                id="edit-worry-content"
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
                disabled={isSubmitting}
                className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground placeholder-muted-foreground focus:ring-2 focus:ring-ring focus:border-transparent resize-none disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <p className="text-xs text-muted-foreground text-right mt-1">
                {content.length}/{FORM_VALIDATION.WORRY_CONTENT_MAX_LENGTH}
              </p>
            </div>

            <div>
              <label
                htmlFor="edit-worry-action"
                className="block text-sm font-medium text-foreground mb-2"
              >
                {lang.addWorry.fields.action.label}{' '}
                <span className="text-muted-foreground">
                  {lang.addWorry.fields.action.optional}
                </span>
              </label>
              <input
                type="text"
                id="edit-worry-action"
                value={action}
                onChange={(e) => setAction(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && content.trim()) {
                    handleSubmit(e);
                  }
                }}
                placeholder={lang.addWorry.fields.action.placeholder}
                maxLength={FORM_VALIDATION.WORRY_ACTION_MAX_LENGTH}
                disabled={isSubmitting}
                className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground placeholder-muted-foreground focus:ring-2 focus:ring-ring focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <p className="text-xs text-muted-foreground text-right mt-1">
                {action.length}/{FORM_VALIDATION.WORRY_ACTION_MAX_LENGTH}
              </p>
            </div>

            {worry.status === 'locked' && (
              <DateTimePicker value={unlockAt} onChange={setUnlockAt} defaultTime={defaultTime} />
            )}

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="secondary"
                onClick={handleClose}
                disabled={isSubmitting}
                className="flex-1 min-h-touch-target"
              >
                {lang.addWorry.buttons.cancel}
              </Button>
              <Button
                type="submit"
                disabled={!content.trim() || isSubmitting}
                className="flex-1 min-h-touch-target"
              >
                {isSubmitting && <Loader2 className="size-icon-sm mr-2 animate-spin" />}
                {!isSubmitting && <Edit3 className="size-icon-sm mr-2" />}
                {lang.editWorry.save}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};
