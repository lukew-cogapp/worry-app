import { Clock } from 'lucide-react';
import type React from 'react';
import { useCallback, useEffect } from 'react';
import { SNOOZE_DURATIONS } from '../config/constants';
import { lang } from '../config/language';
import { useEscapeKey } from '../hooks/useEscapeKey';
import { Button } from './ui/button';

interface SnoozeSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSnooze: (durationMs: number) => void;
}

/**
 * Bottom sheet for selecting snooze duration
 * Uses simple fixed positioning to avoid layout shift
 */
export const SnoozeSheet: React.FC<SnoozeSheetProps> = ({ open, onOpenChange, onSnooze }) => {
  const handleClose = useCallback(() => {
    onOpenChange(false);
  }, [onOpenChange]);

  const handleSnooze = useCallback(
    (durationMs: number) => {
      onSnooze(durationMs);
      handleClose();
    },
    [onSnooze, handleClose]
  );

  // Handle Escape key
  useEscapeKey(handleClose, open);

  // Prevent body scroll when open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  if (!open) return null;

  const options = [
    { label: lang.worryCard.snooze.thirtyMin, duration: SNOOZE_DURATIONS.THIRTY_MINUTES },
    { label: lang.worryCard.snooze.oneHour, duration: SNOOZE_DURATIONS.ONE_HOUR },
    { label: lang.worryCard.snooze.fourHours, duration: SNOOZE_DURATIONS.FOUR_HOURS },
    { label: lang.worryCard.snooze.oneDay, duration: SNOOZE_DURATIONS.ONE_DAY },
  ];

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40 transition-opacity"
        onClick={handleClose}
        aria-hidden="true"
      />

      {/* Bottom Sheet */}
      <div
        className="fixed inset-x-0 bottom-0 z-50 bg-card rounded-t-2xl shadow-dialog animate-slide-up"
        role="dialog"
        aria-modal="true"
        aria-labelledby="snooze-title"
      >
        <div className="p-lg max-h-[90vh] overflow-y-auto overflow-x-hidden">
          {/* Header */}
          <div className="flex items-center justify-between mb-md">
            <div className="flex items-center gap-2">
              <Clock className="size-icon-md text-muted-foreground" />
              <h2 id="snooze-title" className="text-xl font-bold text-foreground">
                {lang.worryCard.buttons.snoozeOptions}
              </h2>
            </div>
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

          {/* Options */}
          <div className="space-y-2">
            {options.map((option) => (
              <Button
                key={option.duration}
                variant="secondary"
                onClick={() => handleSnooze(option.duration)}
                className="w-full min-h-touch-target justify-start"
              >
                {option.label}
              </Button>
            ))}
          </div>

          {/* Cancel */}
          <Button variant="ghost" onClick={handleClose} className="w-full min-h-touch-target mt-md">
            {lang.addWorry.buttons.cancel}
          </Button>
        </div>
      </div>
    </>
  );
};
