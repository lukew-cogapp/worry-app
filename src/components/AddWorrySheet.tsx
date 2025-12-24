import { Lock, Sparkles } from 'lucide-react';
import type React from 'react';
import { useCallback, useEffect, useState } from 'react';
import { usePreferencesStore } from '../store/preferencesStore';
import { getTomorrow } from '../utils/dates';
import { DateTimePicker } from './DateTimePicker';
import { Button } from './ui/button';

interface AddWorrySheetProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (worry: { content: string; action?: string; unlockAt: string }) => void;
  onRelease?: (content: string) => void;
}

export const AddWorrySheet: React.FC<AddWorrySheetProps> = ({
  isOpen,
  onClose,
  onAdd,
  onRelease,
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
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, handleClose]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 z-40 transition-opacity" />

      {/* Modal */}
      <div className="fixed inset-x-0 bottom-0 z-50 bg-card rounded-t-2xl shadow-2xl max-h-[90vh] overflow-y-auto animate-slide-up">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-foreground">Add Worry</h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClose}
              className="text-muted-foreground hover:text-foreground text-2xl h-10 w-10"
              aria-label="Close"
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
                What's worrying you?
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
                placeholder="I'm worried about..."
                rows={3}
                className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground placeholder-muted-foreground focus:ring-2 focus:ring-ring focus:border-transparent resize-none"
              />
            </div>

            <div>
              <label
                htmlFor="worry-action"
                className="block text-sm font-medium text-foreground mb-1"
              >
                What will you do about it? <span className="text-muted-foreground">(optional)</span>
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
                placeholder="I will..."
                className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground placeholder-muted-foreground focus:ring-2 focus:ring-ring focus:border-transparent"
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
                  className="flex-1 min-h-[44px]"
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={!content.trim()} className="flex-1 min-h-[44px]">
                  <Lock className="w-4 h-4 mr-2" />
                  Lock Away Worry
                </Button>
              </div>

              {onRelease && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleRelease}
                  disabled={!content.trim()}
                  className="w-full min-h-[44px]"
                >
                  <Sparkles className="w-4 h-4 mr-2" />I Can't Control This — Release It
                </Button>
              )}
            </div>
          </form>
        </div>
      </div>
    </>
  );
};
