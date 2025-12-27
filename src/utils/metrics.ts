import type { Worry } from '../types';

export interface WorryMetrics {
  total: number;
  resolved: number;
  dismissed: number;
  locked: number;
  unlocked: number;
  completed: number;
  resolutionRate: number;
  avgTimeToResolve: number;
  completionRate: number;
  thisWeekCount: number;
  thisWeekResolved: number;
  categoryBreakdown: Record<string, number>;
}

/**
 * Calculate comprehensive metrics from a list of worries
 */
export function calculateWorryMetrics(worries: Worry[]): WorryMetrics {
  const total = worries.length;
  const resolved = worries.filter((w) => w.status === 'resolved').length;
  const dismissed = worries.filter((w) => w.status === 'dismissed').length;
  const locked = worries.filter((w) => w.status === 'locked').length;
  const unlocked = worries.filter((w) => w.status === 'unlocked').length;
  const completed = resolved + dismissed;

  // Calculate resolution rate (what % of completed worries were resolved vs dismissed)
  const resolutionRate = completed > 0 ? Math.round((resolved / completed) * 100) : 0;

  // Calculate average time to resolution
  const resolvedWorries = worries.filter(
    (w) => w.status === 'resolved' && w.resolvedAt && w.unlockedAt
  );
  const avgTimeToResolve =
    resolvedWorries.length > 0
      ? resolvedWorries.reduce((sum, w) => {
          if (!w.unlockedAt || !w.resolvedAt) return sum;
          const unlockedTime = new Date(w.unlockedAt).getTime();
          const resolvedTime = new Date(w.resolvedAt).getTime();
          return sum + (resolvedTime - unlockedTime);
        }, 0) / resolvedWorries.length
      : 0;

  // Calculate completion rate
  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

  // Get this week's data
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  const thisWeek = worries.filter((w) => new Date(w.createdAt) >= oneWeekAgo);
  const thisWeekResolved = thisWeek.filter((w) => w.status === 'resolved').length;

  // Calculate category breakdown
  const categoryBreakdown: Record<string, number> = {};
  for (const w of worries) {
    const category = w.category || 'uncategorized';
    categoryBreakdown[category] = (categoryBreakdown[category] || 0) + 1;
  }

  return {
    total,
    resolved,
    dismissed,
    locked,
    unlocked,
    completed,
    resolutionRate,
    avgTimeToResolve,
    completionRate,
    thisWeekCount: thisWeek.length,
    thisWeekResolved,
    categoryBreakdown,
  };
}

/**
 * Format milliseconds to a human-readable time string
 */
export function formatTimeToResolve(
  ms: number,
  formatDay: (n: number) => string,
  formatHour: (n: number) => string
): string {
  const hours = Math.round(ms / (1000 * 60 * 60));
  const days = Math.round(hours / 24);

  if (days >= 1) {
    return formatDay(days);
  }
  return formatHour(hours);
}
