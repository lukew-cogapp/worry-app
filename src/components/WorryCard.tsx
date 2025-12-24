import type React from 'react';
import type { Worry } from '../types';
import { formatDateTime, getRelativeTime } from '../utils/dates';

interface WorryCardProps {
  worry: Worry;
  onResolve?: (id: string) => void;
  onDismiss?: (id: string) => void;
  onSnooze?: (id: string) => void;
  onUnlockNow?: (id: string) => void;
  onClick?: (id: string) => void;
}

export const WorryCard: React.FC<WorryCardProps> = ({
  worry,
  onResolve,
  onDismiss,
  onSnooze,
  onUnlockNow,
  onClick,
}) => {
  const getStatusIcon = () => {
    switch (worry.status) {
      case 'locked':
        return '🔒';
      case 'unlocked':
        return '📦';
      case 'resolved':
        return '✓';
      case 'dismissed':
        return '✕';
      default:
        return '📦';
    }
  };

  const getStatusColor = () => {
    switch (worry.status) {
      case 'locked':
        return 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800';
      case 'unlocked':
        return 'bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800';
      case 'resolved':
        return 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800';
      case 'dismissed':
        return 'bg-gray-50 dark:bg-gray-900/20 border-gray-200 dark:border-gray-800';
      default:
        return 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700';
    }
  };

  return (
    <div
      className={`rounded-lg border p-4 ${getStatusColor()} transition-all hover:shadow-md ${onClick ? 'cursor-pointer' : ''}`}
      onClick={() => onClick?.(worry.id)}
      onKeyDown={(e) => {
        if ((e.key === 'Enter' || e.key === ' ') && onClick) {
          e.preventDefault();
          onClick(worry.id);
        }
      }}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      <div className="flex items-start gap-3">
        <span className="text-2xl" aria-hidden="true">
          {getStatusIcon()}
        </span>
        <div className="flex-1 min-w-0">
          <p className="text-gray-900 dark:text-gray-100 font-medium line-clamp-2">
            {worry.content}
          </p>
          {worry.action && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Action: {worry.action}</p>
          )}
          <div className="flex items-center gap-2 mt-2 text-xs text-gray-500 dark:text-gray-400">
            {worry.status === 'locked' && <span>Unlocks {getRelativeTime(worry.unlockAt)}</span>}
            {worry.status === 'unlocked' && worry.unlockedAt && (
              <span>Unlocked {formatDateTime(worry.unlockedAt)}</span>
            )}
            {worry.status === 'resolved' && worry.resolvedAt && (
              <span>Resolved {formatDateTime(worry.resolvedAt)}</span>
            )}
          </div>
        </div>
      </div>

      {worry.status === 'locked' && (onUnlockNow || onDismiss) && (
        <div className="flex gap-2 mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
          {onUnlockNow && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onUnlockNow(worry.id);
              }}
              className="text-sm px-3 py-1 rounded bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
            >
              Unlock Now
            </button>
          )}
          {onDismiss && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onDismiss(worry.id);
              }}
              className="text-sm px-3 py-1 rounded bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              Dismiss
            </button>
          )}
        </div>
      )}

      {worry.status === 'unlocked' && (onResolve || onSnooze || onDismiss) && (
        <div className="flex gap-2 mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
          {onResolve && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onResolve(worry.id);
              }}
              className="text-sm px-3 py-1 rounded bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors"
            >
              Mark Done
            </button>
          )}
          {onSnooze && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onSnooze(worry.id);
              }}
              className="text-sm px-3 py-1 rounded bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-colors"
            >
              Snooze 1hr
            </button>
          )}
          {onDismiss && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onDismiss(worry.id);
              }}
              className="text-sm px-3 py-1 rounded bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              Dismiss
            </button>
          )}
        </div>
      )}
    </div>
  );
};
