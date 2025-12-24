// Encouraging messages for Worry Box

const encouragingMessages = [
  "You've got this.",
  'One step at a time.',
  "You're doing great.",
  'Take a deep breath.',
  "You're stronger than you think.",
  'This too shall pass.',
  "You're not alone.",
  'Be kind to yourself.',
  'Progress, not perfection.',
  "You're capable of handling this.",
  'Trust the process.',
  "You're making progress.",
  'Keep going.',
  "You're doing the best you can.",
  "It's okay to take your time.",
];

export function getRandomEncouragement(): string {
  return encouragingMessages[Math.floor(Math.random() * encouragingMessages.length)];
}

export function getEncouragementForStatus(status: string): string {
  switch (status) {
    case 'locked':
      return 'Your worries are safely stored. Rest easy.';
    case 'unlocked':
      return "You've got this.";
    case 'resolved':
      return 'Well done! You handled it.';
    case 'dismissed':
      return 'Sometimes letting go is the right choice.';
    default:
      return getRandomEncouragement();
  }
}
