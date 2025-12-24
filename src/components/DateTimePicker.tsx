import type React from 'react';
import { getNextMonday, getNextWeek, getTomorrow } from '../utils/dates';

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
          <button
            type="button"
            onClick={() => handleQuickSelect(getTomorrow(defaultTime))}
            className="min-h-[44px] px-3 py-2 text-sm rounded-md bg-secondary text-secondary-foreground hover:bg-secondary/80 active:scale-95 transition-all"
          >
            Tomorrow
          </button>
          <button
            type="button"
            onClick={() => handleQuickSelect(getNextMonday(defaultTime))}
            className="min-h-[44px] px-3 py-2 text-sm rounded-md bg-secondary text-secondary-foreground hover:bg-secondary/80 active:scale-95 transition-all"
          >
            Monday
          </button>
          <button
            type="button"
            onClick={() => handleQuickSelect(getNextWeek(defaultTime))}
            className="min-h-[44px] px-3 py-2 text-sm rounded-md bg-secondary text-secondary-foreground hover:bg-secondary/80 active:scale-95 transition-all"
          >
            Next Week
          </button>
        </div>
      </div>
    </div>
  );
};
