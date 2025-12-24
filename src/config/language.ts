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
        viewAll: 'View all locked worries →',
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
  },

  // Settings page
  settings: {
    title: 'Settings',
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
      theme: {
        title: 'Theme',
        description: 'Choose your app appearance',
        options: {
          light: 'Light',
          dark: 'Dark',
          system: 'System',
        },
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
      released: 'Released',
    },
    labels: {
      action: 'Action:',
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
} as const;

// Helper to format duration
export function formatDuration(milliseconds: number): string {
  const minutes = milliseconds / (60 * 1000);
  const hours = minutes / 60;
  const days = hours / 24;

  if (days >= 1) {
    return `${days} ${days === 1 ? 'day' : 'days'}`;
  }
  if (hours >= 1) {
    return `${hours} ${hours === 1 ? 'hour' : 'hours'}`;
  }
  return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'}`;
}
