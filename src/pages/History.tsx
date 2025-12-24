import type React from 'react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { EmptyState } from '../components/EmptyState';
import { WorryCard } from '../components/WorryCard';
import { useHaptics } from '../hooks/useHaptics';
import { useWorryStore } from '../store/worryStore';

type FilterType = 'all' | 'locked' | 'unlocked' | 'resolved' | 'dismissed';

export const History: React.FC = () => {
  const worries = useWorryStore((s) => s.worries);
  const unlockWorryNow = useWorryStore((s) => s.unlockWorryNow);
  const dismissWorry = useWorryStore((s) => s.dismissWorry);
  const deleteWorry = useWorryStore((s) => s.deleteWorry);

  const { unlockWorry: unlockHaptic } = useHaptics();

  const [filter, setFilter] = useState<FilterType>('all');

  const filteredWorries = filter === 'all' ? worries : worries.filter((w) => w.status === filter);

  const handleUnlockNow = async (id: string) => {
    await unlockWorryNow(id);
    await unlockHaptic();
  };

  const counts = {
    all: worries.length,
    locked: worries.filter((w) => w.status === 'locked').length,
    unlocked: worries.filter((w) => w.status === 'unlocked').length,
    resolved: worries.filter((w) => w.status === 'resolved').length,
    dismissed: worries.filter((w) => w.status === 'dismissed').length,
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link
            to="/"
            className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
            aria-label="Back to home"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <title>Back</title>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Worry History</h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">View all your worries</p>
          </div>
        </div>
      </header>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-4xl mx-auto px-4 py-3 overflow-x-auto">
          <div className="flex gap-2">
            {(
              [
                { key: 'all', label: 'All' },
                { key: 'locked', label: 'Locked' },
                { key: 'unlocked', label: 'Unlocked' },
                { key: 'resolved', label: 'Resolved' },
                { key: 'dismissed', label: 'Dismissed' },
              ] as const
            ).map(({ key, label }) => (
              <button
                key={key}
                type="button"
                onClick={() => setFilter(key)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  filter === key
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {label} ({counts[key]})
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-6">
        {filteredWorries.length === 0 ? (
          <EmptyState
            title={`No ${filter === 'all' ? '' : filter} worries`}
            message={
              filter === 'all'
                ? "You haven't added any worries yet."
                : `You don't have any ${filter} worries.`
            }
            icon="📦"
          />
        ) : (
          <div className="space-y-3">
            {filteredWorries
              .slice()
              .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
              .map((worry) => (
                <div key={worry.id} className="relative">
                  <WorryCard
                    worry={worry}
                    onUnlockNow={worry.status === 'locked' ? handleUnlockNow : undefined}
                    onDismiss={worry.status === 'locked' ? dismissWorry : undefined}
                  />
                  {(worry.status === 'resolved' || worry.status === 'dismissed') && (
                    <button
                      type="button"
                      onClick={() => {
                        if (confirm('Are you sure you want to permanently delete this worry?')) {
                          deleteWorry(worry.id);
                        }
                      }}
                      className="absolute top-2 right-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400"
                      aria-label="Delete worry"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <title>Delete</title>
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  )}
                </div>
              ))}
          </div>
        )}
      </main>
    </div>
  );
};
