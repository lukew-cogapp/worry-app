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
        <label
          htmlFor="unlock-datetime"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          When can you act on this?
        </label>
        <input
          type="datetime-local"
          id="unlock-datetime"
          value={value ? new Date(value).toISOString().slice(0, 16) : ''}
          onChange={(e) => onChange(new Date(e.target.value).toISOString())}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        />
      </div>

      <div>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Quick options:</p>
        <div className="grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => handleQuickSelect(getTomorrow(defaultTime))}
            className="px-3 py-2 text-sm rounded-md bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            Tomorrow
          </button>
          <button
            type="button"
            onClick={() => handleQuickSelect(getNextMonday(defaultTime))}
            className="px-3 py-2 text-sm rounded-md bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            Monday
          </button>
          <button
            type="button"
            onClick={() => handleQuickSelect(getNextWeek(defaultTime))}
            className="px-3 py-2 text-sm rounded-md bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            Next Week
          </button>
        </div>
      </div>
    </div>
  );
};
