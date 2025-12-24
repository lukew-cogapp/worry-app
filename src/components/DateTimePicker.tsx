import type React from 'react';
import { getNextMonday, getNextWeek, getTomorrow } from '../utils/dates';
import { Button } from './ui/button';

interface DateTimePickerProps {
  value: string;
  onChange: (value: string) => void;
  defaultTime?: string;
}

export const DateTimePicker: React.FC<DateTimePickerProps> = ({
  value,
  onChange,
  defaultTime = '09:00',
}) => {
  const handleQuickSelect = (date: Date) => {
    onChange(date.toISOString());
  };

  return (
    <div className="space-y-3">
      <div>
        <label htmlFor="unlock-datetime" className="block text-sm font-medium text-foreground mb-1">
          When can you act on this?
        </label>
        <input
          type="datetime-local"
          id="unlock-datetime"
          value={value ? new Date(value).toISOString().slice(0, 16) : ''}
          onChange={(e) => onChange(new Date(e.target.value).toISOString())}
          className="w-full min-h-[44px] px-3 py-2 border border-border rounded-md bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent transition-shadow"
        />
      </div>

      <div>
        <p className="text-sm text-muted-foreground mb-2">Quick options:</p>
        <div className="grid grid-cols-3 gap-2">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => handleQuickSelect(getTomorrow(defaultTime))}
            className="min-h-[44px] active:scale-95"
          >
            Tomorrow
          </Button>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => handleQuickSelect(getNextMonday(defaultTime))}
            className="min-h-[44px] active:scale-95"
          >
            Monday
          </Button>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => handleQuickSelect(getNextWeek(defaultTime))}
            className="min-h-[44px] active:scale-95"
          >
            Next Week
          </Button>
        </div>
      </div>
    </div>
  );
};
