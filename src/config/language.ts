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
      category: {
        label: 'Category',
        optional: '(optional)',
        placeholder: 'Select a category...',
      },
      bestOutcome: {
        label: "What's the best possible outcome?",
        optional: '(optional)',
        placeholder: 'In an ideal world, this would...',
        guidance: [
          'Talking it through with someone you trust',
          'Understanding the situation more clearly',
          "Accepting what can't be controlled",
          'Feeling calmer or more at ease',
        ],
      },
    },
    buttons: {
      cancel: 'Cancel',
      submit: 'Lock Away Worry',
      release: 'Let this go for now',
    },
    validation: {
      contentRequired: "Please describe what's worrying you",
    },
  },

  // Worry categories
  categories: {
    work: 'Work',
    health: 'Health',
    relationships: 'Relationships',
    finance: 'Finance',
    personal: 'Personal',
    other: 'Other',
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
    empty: {
      title: 'No worries',
      message: "You haven't added any worries yet.",
    },
    deleteDialog: {
      title: 'Delete Worry?',
      description:
        'This action cannot be undone. This will permanently delete this worry from your history.',
      cancel: 'Cancel',
      confirm: 'Delete',
    },
    releaseDialog: {
      title: 'Release This Worry?',
      description:
        "You're choosing to let go of this worry. It will be moved to your released list.",
      cancel: 'Keep It',
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
      completed: 'Closed',
      locked: 'Locked',
      unlocked: 'Unlocked',
    },
    keyInsights: {
      title: 'Key Insights',
      completionRate: {
        title: 'Worries Closed',
        description: (completed: number, total: number) =>
          `${completed} of ${total} worries closed — no pressure, this is just a snapshot`,
      },
      resolutionRate: {
        title: 'How They Ended',
        description: (resolved: number, dismissed: number) =>
          `${resolved} closed, ${dismissed} released`,
        insight: "Many worries didn't need action — noticing that is progress.",
      },
      avgTimeToResolve: {
        title: 'Average Time to Close',
        description: 'Time from unlock to closure',
      },
    },
    thisWeek: {
      title: 'This Week',
      description: (total: number, resolved: number) =>
        `${total} worries added, ${resolved} closed`,
    },
    weeklyStreak: {
      title: (count: number) => `${count} ${count === 1 ? 'worry' : 'worries'} closed this week!`,
      message: "You're on a roll! Keep up the great work.",
    },
    timeUnits: {
      day: (count: number) => `${count} ${count === 1 ? 'day' : 'days'}`,
      hour: (count: number) => `${count} ${count === 1 ? 'hour' : 'hours'}`,
    },
    categoryBreakdown: {
      title: 'Worries by Category',
      uncategorized: 'Uncategorized',
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
    formFields: {
      title: 'Form Fields',
      description: 'Choose which optional fields appear when adding worries',
      showCategory: {
        title: 'Category',
        description: 'Organize worries by life area (Work, Health, etc.)',
      },
      showBestOutcome: {
        title: 'Best Outcome',
        description: 'Imagine the best possible outcome for perspective',
      },
      showTalkedToSomeone: {
        title: 'Discussed with Someone',
        description: "Track if you've talked about this worry",
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
      resolved: 'Closed',
      dismissed: 'Released',
      released: 'Released',
    },
    labels: {
      action: 'Action:',
      resolution: 'Resolution:',
      unlocks: (time: string) => `Unlocks ${time}`,
      unlocked: (time: string) => `Unlocked ${time}`,
      resolved: (time: string) => `Closed ${time}`,
    },
    buttons: {
      unlockNow: 'Unlock Now',
      release: 'Release',
      markDone: 'Close Worry',
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
      worryResolved: 'Worry closed',
      worryReleased: 'Worry released',
      worryDeleted: 'Worry deleted',
      worryUnlocked: 'Worry unlocked',
      worrySelected: (count: number) => `${count} ${count === 1 ? 'worry' : 'worries'} snoozed`,
      snoozed: (duration: string) => `Snoozed for ${duration}`,
      dataCleared: 'All worries have been removed',
    },
    error: {
      saveWorry: 'Could not save worry. Please try again.',
      updateWorry: 'Could not update worry. Please try again.',
      resolveWorry: 'Could not close worry. Please try again.',
      releaseWorry: 'Could not release worry. Please try again.',
      deleteWorry: 'Could not delete worry. Please try again.',
      unlockWorry: 'Could not unlock worry. Please try again.',
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
    title: 'Close Worry',
    noteLabel: 'How did this turn out?',
    notePlaceholder: 'What happened with this worry? (optional)',
    cancel: 'Cancel',
    confirm: 'Close Worry',
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

  // Date formatting
  dates: {
    invalid: 'Invalid date',
  },

  // Validation errors
  validation: {
    unlockTimeRequired: 'Please select when you can act on this worry',
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
