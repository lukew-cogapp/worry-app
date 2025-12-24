import { Loader2, Lock, Sparkles } from 'lucide-react';
import type React from 'react';
import { useCallback, useState } from 'react';
import { lang } from '../config/language';
import { useEscapeKey } from '../hooks/useEscapeKey';
import { usePreferencesStore } from '../store/preferencesStore';
import { getTomorrow } from '../utils/dates';
import { DateTimePicker } from './DateTimePicker';
import { Button } from './ui/button';

interface AddWorrySheetProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (worry: { content: string; action?: string; unlockAt: string }) => void;
  onRelease?: (content: string) => void;
  isSubmitting?: boolean;
  isReleasing?: boolean;
}

export const AddWorrySheet: React.FC<AddWorrySheetProps> = ({
  isOpen,
  onClose,
  onAdd,
  onRelease,
  isSubmitting = false,
  isReleasing = false,
}) => {
  const defaultUnlockTime = usePreferencesStore((s) => s.preferences.defaultUnlockTime);
  const [content, setContent] = useState('');
  const [action, setAction] = useState('');
  const [unlockAt, setUnlockAt] = useState(getTomorrow(defaultUnlockTime).toISOString());

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    onAdd({
      content: content.trim(),
      action: action.trim() || undefined,
      unlockAt,
    });

    // Reset form
    setContent('');
    setAction('');
    setUnlockAt(getTomorrow(defaultUnlockTime).toISOString());
    onClose();
  };

  const handleClose = useCallback(() => {
    setContent('');
    setAction('');
    setUnlockAt(getTomorrow(defaultUnlockTime).toISOString());
    onClose();
  }, [defaultUnlockTime, onClose]);

  const handleRelease = () => {
    if (!content.trim()) return;

    onRelease?.(content.trim());

    // Reset form
    setContent('');
    setAction('');
    setUnlockAt(getTomorrow(defaultUnlockTime).toISOString());
    onClose();
  };

  // Handle Escape key
  useEscapeKey(handleClose, isOpen);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 z-40 transition-opacity" />

      {/* Modal */}
      <div className="fixed inset-x-0 bottom-0 z-50 bg-card rounded-t-2xl shadow-2xl max-h-[90vh] overflow-y-auto animate-slide-up">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-foreground">{lang.addWorry.title}</h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClose}
              className="text-muted-foreground hover:text-foreground text-2xl h-10 w-10"
              aria-label={lang.aria.close}
            >
              ×
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="worry-content"
                className="block text-sm font-medium text-foreground mb-1"
              >
                {lang.addWorry.fields.content.label}
              </label>
              <textarea
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
                disabled={isSubmitting || isReleasing}
                className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground placeholder-muted-foreground focus:ring-2 focus:ring-ring focus:border-transparent resize-none disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>

            <div>
              <label
                htmlFor="worry-action"
                className="block text-sm font-medium text-foreground mb-1"
              >
                {lang.addWorry.fields.action.label}{' '}
                <span className="text-muted-foreground">
                  {lang.addWorry.fields.action.optional}
                </span>
              </label>
              <input
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
                disabled={isSubmitting || isReleasing}
                className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground placeholder-muted-foreground focus:ring-2 focus:ring-ring focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>

            <DateTimePicker
              value={unlockAt}
              onChange={setUnlockAt}
              defaultTime={defaultUnlockTime}
            />

            <div className="space-y-3 pt-4">
              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={handleClose}
                  disabled={isSubmitting || isReleasing}
                  className="flex-1 min-h-[44px]"
                >
                  {lang.addWorry.buttons.cancel}
                </Button>
                <Button
                  type="submit"
                  disabled={!content.trim() || isSubmitting || isReleasing}
                  className="flex-1 min-h-[44px]"
                >
                  {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  {!isSubmitting && <Lock className="w-4 h-4 mr-2" />}
                  {lang.addWorry.buttons.submit}
                </Button>
              </div>

              {onRelease && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleRelease}
                  disabled={!content.trim() || isSubmitting || isReleasing}
                  className="w-full min-h-[44px]"
                >
                  {isReleasing && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  {!isReleasing && <Sparkles className="w-4 h-4 mr-2" />}
                  {lang.addWorry.buttons.release}
                </Button>
              )}
            </div>
          </form>
        </div>
      </div>
    </>
  );
};
