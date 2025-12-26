/**
 * Centralized language configuration
 * Keep tone neutral, helpful, and professional
 */

export const lang = {
  // App metadata
  app: {
    name: 'Worry Box',
    tagline: 'Store your worries until you can act',
  },

  // Onboarding
  onboarding: {
    title: 'Welcome to Worry Box',
    quote: "You can't always control what happens, but you can control when you worry about it.",
    features: {
      lock: {
        title: 'Lock Away Worries',
        description: 'Set a future date when you can actually act on them',
      },
      remind: {
        title: 'Get Reminded',
        description: 'Receive notifications when your worries unlock',
      },
      calm: {
        title: 'Stay Focused',
        description: 'Deal with things when the time is right',
      },
    },
    cta: 'Get Started',
  },

  // Add worry sheet
  addWorry: {
    title: 'Add Worry',
    fields: {
      content: {
        label: "What's worrying you?",
        placeholder: "I'm worried about...",
      },
      action: {
        label: 'What will you do about it?',
        optional: '(optional)',
        placeholder: 'I will...',
      },
      unlockAt: {
        label: 'When can you act on this?',
        quickOptions: 'Quick options:',
      },
    },
    buttons: {
      cancel: 'Cancel',
      submit: 'Lock Away Worry',
      release: "I Can't Control This — Release It",
    },
    validation: {
      contentRequired: "Please describe what's worrying you",
    },
  },

  // Date quick options
  dateOptions: {
    tomorrow: 'Tomorrow',
    monday: 'Monday',
    nextWeek: 'Next Week',
  },

  // Home page
  home: {
    empty: {
      title: 'No worries yet',
      message: 'Add your first worry and lock it away until you can act on it.',
    },
    sections: {
      ready: 'Ready to Act',
      locked: {
        title: (count: number) => `${count} ${count === 1 ? 'Worry' : 'Worries'} Locked Away`,
        subtitle: 'Check back when they unlock.',
        viewAll: 'View locked & previous worries →',
      },
    },
  },

  // History page
  history: {
    title: 'Worry History',
    subtitle: 'View all your worries',
    filters: {
      all: 'All',
      locked: 'Locked',
      unlocked: 'Unlocked',
      resolved: 'Resolved',
      dismissed: 'Dismissed',
      released: 'Released',
    },
    search: {
      placeholder: 'Search worries...',
    },
    empty: {
      title: (filter: string) => `No ${filter === 'all' ? '' : filter} worries`,
      messageAll: "You haven't added any worries yet.",
      messageFiltered: (filter: string) => `You don't have any ${filter} worries.`,
    },
    deleteDialog: {
      title: 'Delete Worry?',
      description:
        'This action cannot be undone. This will permanently delete this worry from your history.',
      cancel: 'Cancel',
      confirm: 'Delete',
    },
    dismissDialog: {
      title: 'Dismiss Worry?',
      description:
        'This will move the worry to your dismissed list. You can find it in your history later.',
      cancel: 'Cancel',
      confirm: 'Dismiss',
    },
    releaseDialog: {
      title: 'Release This Worry?',
      description:
        "You're letting go of something you can't control. This worry will be immediately dismissed.",
      cancel: 'Cancel',
      confirm: 'Release',
    },
  },

  // Insights page
  insights: {
    title: 'Insights',
    subtitle: 'Track your worry patterns',
    empty: {
      title: 'No data yet',
      message: 'Add some worries to see your insights and patterns.',
    },
    stats: {
      total: 'Total Worries',
      completed: 'Completed',
      locked: 'Locked',
      unlocked: 'Unlocked',
    },
    keyInsights: {
      title: 'Key Insights',
      completionRate: {
        title: 'Completion Rate',
        description: (completed: number, total: number) =>
          `You've completed ${completed} out of ${total} worries`,
      },
      resolutionRate: {
        title: 'Action Taken',
        description: (resolved: number, dismissed: number) =>
          `${resolved} resolved, ${dismissed} dismissed`,
        insight: 'Most of your worries were dismissed. Consider if they needed action after all.',
      },
      avgTimeToResolve: {
        title: 'Average Time to Resolve',
        description: 'Time from unlock to resolution',
      },
    },
    thisWeek: {
      title: 'This Week',
      description: (total: number, resolved: number) =>
        `${total} worries added, ${resolved} resolved`,
    },
    weeklyStreak: {
      title: (count: number) => `${count} ${count === 1 ? 'worry' : 'worries'} resolved this week!`,
      message: "You're on a roll! Keep up the great work.",
    },
    timeUnits: {
      day: (count: number) => `${count} ${count === 1 ? 'day' : 'days'}`,
      hour: (count: number) => `${count} ${count === 1 ? 'hour' : 'hours'}`,
    },
  },

  // Settings page
  settings: {
    title: 'Settings',
    subtitle: 'Customize your experience',
    sections: {
      defaultTime: {
        title: 'Default Unlock Time',
        description: 'When using quick options (Tomorrow, Monday, etc.)',
      },
      hapticFeedback: {
        title: 'Haptic Feedback',
        description: 'Tactile feedback when locking/unlocking worries',
      },
      encouragingMessages: {
        title: 'Encouraging Messages',
        description: 'Show supportive text in notifications',
      },
    },
    dangerZone: {
      title: 'Danger Zone',
      reset: {
        title: 'Reset All Data',
        description: 'Remove all worries and start fresh',
        button: 'Remove All Content',
      },
      resetDialog: {
        title: 'Reset All Data?',
        description:
          'This will permanently delete all your worries and cannot be undone. Your settings will be preserved.',
        cancel: 'Cancel',
        confirm: 'Reset Everything',
      },
    },
    about: {
      title: 'About Worry Box',
      version: (version: string) => `Version ${version}`,
    },
  },

  // Worry card
  worryCard: {
    status: {
      locked: 'Locked',
      ready: 'Ready',
      resolved: 'Resolved',
      dismissed: 'Dismissed',
      released: 'Released',
    },
    labels: {
      action: 'Action:',
      resolution: 'Resolution:',
      unlocks: (time: string) => `Unlocks ${time}`,
      unlocked: (time: string) => `Unlocked ${time}`,
      resolved: (time: string) => `Resolved ${time}`,
    },
    buttons: {
      unlockNow: 'Unlock Now',
      dismiss: 'Dismiss',
      markDone: 'Mark Done',
      snooze: 'Snooze',
      snoozeOptions: 'Snooze for...',
    },
    snooze: {
      thirtyMin: '30 minutes',
      oneHour: '1 hour',
      fourHours: '4 hours',
      oneDay: '1 day',
    },
  },

  // Toast messages
  toasts: {
    success: {
      worryAdded: 'Worry locked away',
      worryUpdated: 'Worry updated',
      worryResolved: 'Worry resolved',
      worryDismissed: 'Worry dismissed',
      worryDeleted: 'Worry deleted',
      worryUnlocked: 'Worry unlocked',
      worryReleased: "Worry released. You've let go of what you can't control.",
      worrySelected: (count: number) => `${count} ${count === 1 ? 'worry' : 'worries'} snoozed`,
      snoozed: (duration: string) => `Snoozed for ${duration}`,
      dataCleared: 'All worries have been removed',
    },
    error: {
      saveWorry: 'Could not save worry. Please try again.',
      updateWorry: 'Could not update worry. Please try again.',
      resolveWorry: 'Could not resolve worry. Please try again.',
      dismissWorry: 'Could not dismiss worry. Please try again.',
      deleteWorry: 'Could not delete worry. Please try again.',
      unlockWorry: 'Could not unlock worry. Please try again.',
      releaseWorry: 'Could not release worry. Please try again.',
      snoozeWorry: 'Could not snooze worry. Please try again.',
    },
  },

  // Accessibility labels
  aria: {
    close: 'Close',
    back: 'Back to home',
    settings: 'Settings',
    insights: 'Insights',
    delete: 'Delete worry',
    addWorry: 'Add worry',
    editWorry: 'Edit worry',
    search: 'Search',
  },

  // Edit worry
  editWorry: {
    title: 'Edit Worry',
    save: 'Save Changes',
  },

  // Resolve worry dialog
  resolveWorry: {
    title: 'Mark as Done',
    noteLabel: 'What did you do?',
    notePlaceholder: 'How did you handle this worry? (optional)',
    cancel: 'Cancel',
    confirm: 'Mark Done',
  },

  // Animations
  animations: {
    lockAway: 'Worry locked away safely',
  },

  // Debug error dialog
  debugErrorDialog: {
    title: 'Debug: Error Occurred',
    description: 'This dialog is for debugging purposes. It will be hidden in production.',
    labels: {
      errorMessage: 'Error Message:',
      details: 'Details:',
      stackTrace: 'Stack Trace:',
    },
    actions: {
      close: 'Close',
    },
  },

  // Error boundary
  errorBoundary: {
    title: 'Something went wrong',
    message:
      "We're sorry, but something unexpected happened. This error has been logged and we'll look into it.",
    devDetails: 'Error Details (Development Only)',
    actions: {
      tryAgain: 'Try Again',
      reload: 'Reload App',
    },
  },
} as const;

// Helper to format duration with better precision
export function formatDuration(milliseconds: number): string {
  const totalMinutes = Math.floor(milliseconds / (60 * 1000));
  const totalHours = Math.floor(totalMinutes / 60);
  const totalDays = Math.floor(totalHours / 24);

  if (totalDays >= 1) {
    const remainingHours = totalHours % 24;
    if (remainingHours > 0) {
      return `${totalDays} ${totalDays === 1 ? 'day' : 'days'}, ${remainingHours} ${remainingHours === 1 ? 'hour' : 'hours'}`;
    }
    return `${totalDays} ${totalDays === 1 ? 'day' : 'days'}`;
  }
  if (totalHours >= 1) {
    const remainingMinutes = totalMinutes % 60;
    if (remainingMinutes > 0) {
      return `${totalHours} ${totalHours === 1 ? 'hour' : 'hours'}, ${remainingMinutes} ${remainingMinutes === 1 ? 'minute' : 'minutes'}`;
    }
    return `${totalHours} ${totalHours === 1 ? 'hour' : 'hours'}`;
  }
  return `${totalMinutes} ${totalMinutes === 1 ? 'minute' : 'minutes'}`;
}
