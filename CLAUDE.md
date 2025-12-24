# Claude Code Context - Worry Box

This document provides comprehensive context for Claude Code when working on this project.

## Project Overview

**Worry Box** is a mobile-first mental health app that helps users manage anxiety about things they can't immediately act on. Users log worries with a "locked until" date, receiving actionable reminders when they can actually do something about them.

**Core Philosophy:** "You can't always control what happens, but you can control when you worry about it."

## Current Version: 0.1.4

Recent work completed:
1. **Code review fixes** - Fixed critical issues (notification ID collisions, type safety, error handling)
2. **Design token system** - Complete migration to Tailwind v4 @theme directive
3. **Insights Dashboard** - Retention feature showing user metrics and patterns

## Tech Stack

- **React 19** + **TypeScript 5.9** + **Vite 7**
- **Capacitor 8** (native iOS/Android bridge)
- **Tailwind CSS v4** (CSS-first @theme configuration)
- **shadcn/ui** (accessible component library)
- **Zustand** (lightweight state management)
- **Biome** (fast linter and formatter)

## Architecture

### Directory Structure

```
src/
├── components/       # Reusable UI components
│   ├── ui/          # shadcn/ui components
│   ├── AddWorrySheet.tsx
│   ├── DateTimePicker.tsx
│   ├── EditWorrySheet.tsx
│   ├── EmptyState.tsx
│   ├── LockAnimation.tsx
│   ├── Onboarding.tsx
│   └── WorryCard.tsx
├── config/          # Configuration and constants
│   ├── constants.ts  # Magic numbers, durations, sizes
│   └── language.ts   # All user-facing text (i18n-ready)
├── hooks/           # Custom React hooks
│   ├── useEscapeKey.ts
│   └── useHaptics.ts
├── pages/           # Route components
│   ├── History.tsx   # View all worries
│   ├── Home.tsx      # Main dashboard
│   ├── Insights.tsx  # Metrics and patterns (NEW)
│   └── Settings.tsx  # User preferences
├── services/        # External integrations
│   ├── notifications.ts  # Capacitor LocalNotifications
│   └── storage.ts        # Capacitor Preferences
├── store/           # Zustand state management
│   ├── preferencesStore.ts
│   └── worryStore.ts
├── types/           # TypeScript definitions
│   └── index.ts
└── utils/           # Helper functions
    ├── dates.ts
    └── encouragement.ts
```

## Design System

### Tailwind v4 Design Tokens (@theme directive)

All design tokens are defined in `src/index.css` using the @theme directive:

**Spacing:**
- `spacing-xs` (0.5rem), `spacing-sm` (0.75rem), `spacing-md` (1rem), `spacing-lg` (1.5rem), `spacing-xl` (2rem)

**Icons:**
- `size-icon-xs` (12px), `size-icon-sm` (16px), `size-icon` (20px), `size-icon-md` (24px), `size-icon-lg` (32px), `size-icon-xl` (64px)

**Components:**
- `size-fab` (56px) - Floating action button
- `size-touch-target` (44px) - Minimum accessible touch target
- `size-button-icon` (40px) - Icon button size

**Shadows:**
- `shadow-sm`, `shadow-card`, `shadow-dialog`, `shadow-lg`

**Usage:** `className="p-md gap-sm size-icon-md min-h-touch-target"`

### Color Tokens (CSS Variables)

Colors use CSS variables in `:root` for light/dark mode support (shadcn/ui pattern):
- `--background`, `--foreground`
- `--card`, `--card-foreground`
- `--primary`, `--primary-foreground`
- `--muted`, `--muted-foreground`
- etc.

**Usage:** `className="bg-background text-foreground"`

## Code Standards

### 1. NO Hardcoded Strings
❌ BAD: `<Button>Save Changes</Button>`
✅ GOOD: `<Button>{lang.editWorry.save}</Button>`

All text must be in `src/config/language.ts` (i18n-ready).

### 2. NO Magic Numbers
❌ BAD: `setTimeout(() => {}, 2000)`
✅ GOOD: `setTimeout(() => {}, ANIMATION_DURATIONS.LOCK_ANIMATION)`

Extract to `src/config/constants.ts`.

### 3. Use Design Tokens
❌ BAD: `className="p-4 gap-3 w-6 h-6"`
✅ GOOD: `className="p-md gap-sm size-icon-md"`

### 4. Touch Targets
All interactive elements must be minimum 44px (WCAG AAA):
✅ `className="min-h-touch-target min-w-touch-target"`

### 5. Type Safety
- No `any` types (use `unknown` and type guards)
- No non-null assertions (`!`) without null checks
- Import types with `import type`

### 6. Component Patterns
- Use React.FC for all components
- Export as named exports
- Props interfaces above component
- useMemo for expensive calculations
- useCallback for event handlers passed to children

### 7. State Management
- Zustand for global state (worries, preferences)
- Local state (useState) for UI-only state
- Never mutate state directly

## Key Features

### 1. Worry Lifecycle
```
Created → Locked → Unlocked → (Resolved | Dismissed)
                          ↓
                      Released (special dismiss)
```

### 2. Notifications
- Scheduled via Capacitor LocalNotifications
- Fire at user-specified unlock times
- Quick actions: "Done ✓" and "Snooze 1hr"

### 3. Storage
All data stored locally via Capacitor Preferences:
- `worry_box_worries` - Worry[]
- `worry_box_prefs` - UserPreferences
- `worry_box_stats` - WorryStats
- `worry_box_onboarding_complete` - boolean

### 4. Insights Dashboard (NEW)
Location: `src/pages/Insights.tsx`
- Total worries, completed, locked, unlocked counts
- Completion rate percentage
- Resolution vs dismissal breakdown
- Average time to resolve
- Weekly activity summary

## Common Tasks

### Adding a New Page
1. Create component in `src/pages/`
2. Add route in `src/App.tsx`
3. Add language strings in `src/config/language.ts`
4. Add navigation link in relevant pages
5. Add aria-label to `lang.aria`

### Adding Language Strings
```typescript
// In src/config/language.ts
export const lang = {
  // ...
  newFeature: {
    title: 'Feature Title',
    description: 'Feature description',
    button: 'Action Text',
  },
} as const;
```

### Adding Design Tokens
```css
/* In src/index.css @theme block */
@theme {
  --spacing-custom: 1.25rem;
  --size-custom: 3rem;
}
```

### Creating a Component
```typescript
import type React from 'react';
import { lang } from '../config/language';

interface MyComponentProps {
  title: string;
  onAction: () => void;
}

export const MyComponent: React.FC<MyComponentProps> = ({ title, onAction }) => {
  return (
    <div className="p-md gap-sm">
      <h2>{title}</h2>
      <button onClick={onAction} className="min-h-touch-target">
        {lang.myComponent.action}
      </button>
    </div>
  );
};
```

## Testing

- **Framework:** Vitest
- **Current coverage:** worryStore.test.ts, dates.test.ts
- **Run tests:** `npm test`
- **Pre-commit:** Tests run automatically via Lefthook

## Git Workflow

- **Main branch:** Development happens here
- **Feature branches:** `claude/feature-name-{sessionId}` format
- **Pre-commit hooks:** Biome format, Biome check, TypeScript check
- **Pre-push hooks:** Tests + Build

## Common Gotchas

1. **Read before Edit** - Always use Read tool before Edit tool
2. **Design tokens over hardcoded** - Use `p-md` not `p-4`
3. **Language strings** - All text in `lang`, including aria-labels
4. **Type imports** - Use `import type` for type-only imports
5. **Capacitor APIs** - Must be awaited, may fail on web
6. **useMemo dependencies** - Include all values used in calculation

## Recent Changes

### v0.1.4 Latest (Dec 2024)
1. **Critical Fixes:**
   - Fixed notification ID collisions (use random instead of Date.now)
   - Added type safety (PluginListenerHandle instead of any)
   - Added error handling to App.tsx init()
   - Added JSON.parse error handling in storage.ts

2. **Design Token System:**
   - Complete migration to Tailwind v4 @theme
   - Added size-icon-xl (64px)
   - Added ANIMATION_DURATIONS constants
   - Moved hardcoded animation text to lang config
   - 100% design token coverage

3. **Insights Dashboard:**
   - New /insights route with metrics
   - Completion rate, resolution rate, avg time to resolve
   - Weekly activity tracking
   - Empty state for new users
   - Navigation icon in Home header

## When to Ask for Clarification

1. **Unclear requirements** - Multiple valid approaches exist
2. **Architectural decisions** - Significant changes to patterns
3. **Breaking changes** - Would affect existing functionality
4. **New dependencies** - Before adding npm packages
5. **Large refactors** - Touch many files or change structure

## Priority Guidelines

**Code Quality over Speed:**
- Use design tokens consistently
- Extract magic numbers
- Add proper types
- Write accessible HTML

**User Experience:**
- Loading states for async operations
- Error messages with recovery options
- Confirmation dialogs for destructive actions
- Touch-friendly UI (44px minimum)

**Maintainability:**
- Clear variable names
- Small, focused functions
- DRY (extract duplicates)
- Document complex logic

## Links

- **Tailwind v4 docs:** https://tailwindcss.com/docs/theme
- **shadcn/ui:** https://ui.shadcn.com/
- **Capacitor:** https://capacitorjs.com/docs
- **Zustand:** https://docs.pmnd.rs/zustand/getting-started/introduction

## Questions?

When uncertain, prefer:
1. Reading existing code for patterns
2. Checking `src/config/language.ts` for string patterns
3. Looking at similar components for structure
4. Using Task tool to explore codebase
5. Asking user for clarification on ambiguous requirements
