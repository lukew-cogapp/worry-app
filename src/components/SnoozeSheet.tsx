import { Clock } from 'lucide-react';
import type React from 'react';
import { useCallback } from 'react';
import { SNOOZE_DURATIONS } from '../config/constants';
import { lang } from '../config/language';
import { useBodyScrollLock } from '../hooks/useBodyScrollLock';
import { useEscapeKey } from '../hooks/useEscapeKey';
import { SheetShell } from './SheetShell';
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

  useBodyScrollLock(open);

  const options = [
    { label: lang.worryCard.snooze.thirtyMin, duration: SNOOZE_DURATIONS.THIRTY_MINUTES },
    { label: lang.worryCard.snooze.oneHour, duration: SNOOZE_DURATIONS.ONE_HOUR },
    { label: lang.worryCard.snooze.fourHours, duration: SNOOZE_DURATIONS.FOUR_HOURS },
    { label: lang.worryCard.snooze.oneDay, duration: SNOOZE_DURATIONS.ONE_DAY },
  ];

  return (
    <SheetShell
      open={open}
      onClose={handleClose}
      ariaLabelledBy="snooze-title"
      title={lang.worryCard.buttons.snoozeOptions}
      headerIcon={<Clock className="size-icon-md text-muted-foreground" />}
      trapFocus
    >
      <div className="space-y-2">
        {options.map((option) => (
          <Button
            key={option.duration}
            variant="secondary"
            size="lg"
            onClick={() => handleSnooze(option.duration)}
            className="w-full min-h-touch-target justify-start"
          >
            {option.label}
          </Button>
        ))}
      </div>

      <Button
        variant="ghost"
        size="lg"
        onClick={handleClose}
        className="w-full min-h-touch-target mt-md"
      >
        {lang.addWorry.buttons.cancel}
      </Button>
    </SheetShell>
  );
};
