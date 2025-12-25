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
│   ├── DebugErrorDialog.tsx  # Debug error display (NEW)
│   ├── EditWorrySheet.tsx
│   ├── EmptyState.tsx
│   ├── LockAnimation.tsx
│   ├── Onboarding.tsx
│   └── WorryCard.tsx
├── config/          # Configuration and constants
│   ├── constants.ts  # Magic numbers, durations, sizes
│   └── language.ts   # All user-facing text (i18n-ready)
├── hooks/           # Custom React hooks
│   ├── useDebugError.ts  # Centralized error handling (NEW)
│   ├── useEscapeKey.ts
│   └── useHaptics.ts
├── pages/           # Route components
│   ├── History.tsx   # View all worries
│   ├── Home.tsx      # Main dashboard
│   ├── Insights.tsx  # Metrics and patterns
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
    ├── encouragement.ts
    ├── logger.ts     # Conditional debug logging (NEW)
    └── uuid.ts       # Android WebView-compatible UUID (NEW)
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

## Debugging & Build

### Error Handling Architecture

The app uses a centralized error handling system designed for easy debugging in development and production readiness.

**Key Components:**

1. **`useDebugError` Hook** (`src/hooks/useDebugError.ts`)
   - Centralized error state management
   - Automatic production mode detection
   - Returns: `{ debugError, handleError, clearError }`
   - In production: Logs errors to console only (no debug dialogs)
   - In development: Shows full error details in dialog

2. **`DebugErrorDialog` Component** (`src/components/DebugErrorDialog.tsx`)
   - Reusable shadcn/ui Dialog for displaying errors
   - Shows error message, details JSON, and stack trace
   - Only renders in development mode
   - Usage: `<DebugErrorDialog error={debugError} onClose={clearError} />`

3. **`logger` Utility** (`src/utils/logger.ts`)
   - Conditional logging based on environment
   - `logger.log()` and `logger.warn()` - Development only
   - `logger.error()` - Always logs (even in production)
   - Reduces bundle size by removing debug logs in production

**Error Handler Pattern:**
```typescript
import { useDebugError } from '../hooks/useDebugError';
import { DebugErrorDialog } from '../components/DebugErrorDialog';

const { debugError, handleError, clearError } = useDebugError();

const handleOperation = async () => {
  try {
    await someAsyncOperation();
  } catch (error) {
    handleError(error, {
      operation: 'operationName',
      additionalContext: 'contextValue',
    });
    toast.error('User-friendly error message');
  }
};

// In JSX:
<DebugErrorDialog error={debugError} onClose={clearError} />
```

**Files using this pattern:**
- `src/App.tsx` - App initialization errors
- `src/pages/Home.tsx` - Add/resolve/snooze/dismiss/release/edit operations
- `src/pages/History.tsx` - Unlock/dismiss/delete/edit operations

### Debugging on Android

**1. Chrome DevTools (Recommended)**

The easiest way to debug Android apps:

```bash
# 1. Run app on Android device/emulator
npx cap run android

# 2. Open Chrome and navigate to:
chrome://inspect

# 3. Click "inspect" under your app name
# 4. Full DevTools access: Console, Network, Application, etc.
```

**What you'll see:**
- `[Store]` and `[Storage]` debug logs (development only)
- Full error details in debug error dialog
- Application → Local Storage to inspect Capacitor Preferences
- Network requests and timing
- Complete React component tree

**2. Android Studio Logcat**

View native Android logs:

```bash
# In Android Studio: View → Tool Windows → Logcat

# Or via command line:
adb logcat

# Filter for app-specific logs:
adb logcat | grep -i capacitor
adb logcat | grep -i chromium
```

**3. Direct Storage Inspection**

View SharedPreferences data (where Capacitor Preferences stores data):

```bash
# Replace YOUR.PACKAGE.NAME with app package (check android/app/build.gradle)
adb shell run-as YOUR.PACKAGE.NAME ls /data/data/YOUR.PACKAGE.NAME/shared_prefs/

# View Capacitor storage file:
adb shell run-as YOUR.PACKAGE.NAME cat /data/data/YOUR.PACKAGE.NAME/shared_prefs/CapacitorStorage.xml
```

### Development vs Production Builds

**Development Mode (`npm run dev`):**
- All `[Store]` and `[Storage]` logs visible via `logger`
- Debug error dialogs enabled
- Full stack traces in error dialogs
- Larger bundle size
- Source maps enabled
- Hot module replacement

**Production Mode (`npm run build`):**
- Debug logs stripped from bundle (tree-shaking)
- Debug dialogs disabled (errors still logged to console)
- Smaller bundle size
- Optimized and minified code
- Ready for error tracking integration (Sentry, LogRocket)

**Environment Detection:**
```typescript
import.meta.env.DEV   // true in development
import.meta.env.PROD  // true in production
```

### Build Commands

```bash
# Development
npm run dev           # Start dev server with HMR
npm run lint          # Run Biome linter
npm run lint:fix      # Auto-fix linting issues
npm run format        # Format code with Biome

# Testing
npm test              # Run Vitest tests
npm run test:ui       # Run tests with UI

# Production
npm run build         # TypeScript + Vite production build
npm run preview       # Preview production build locally

# Mobile
npx cap sync          # Sync web assets to native projects
npx cap open ios      # Open in Xcode
npx cap open android  # Open in Android Studio
npx cap run ios       # Build and run on iOS
npx cap run android   # Build and run on Android
```

### Common Debug Scenarios

**1. Storage Failures**
- Check Chrome DevTools console for `[Storage]` logs
- Look for serialization errors in debug dialog
- Inspect Application → Local Storage → CapacitorStorage
- Use ADB to view SharedPreferences directly

**2. Notification Issues**
- Check for notification permission prompts
- Look for `[Notifications]` logs in console
- Verify notification IDs are unique (random generation)
- Check Android notification settings for app

**3. UUID Generation**
- `crypto.randomUUID()` not available in older Android WebViews
- Fallback implementation in `src/utils/uuid.ts`
- Check console for `[UUID]` fallback warnings

**4. State Management**
- Zustand store changes logged with `[Store]` prefix
- Use React DevTools to inspect component state
- Check for state mutation (should never mutate directly)

### Future: Error Tracking Integration

The error handling system is designed for easy integration with error tracking services:

```typescript
// In src/hooks/useDebugError.ts
if (import.meta.env.PROD) {
  console.error('Error occurred:', error, context);

  // TODO: Integrate error tracking
  // Sentry.captureException(error, { extra: context });
  // LogRocket.captureException(error, { extra: context });

  return;
}
```

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

4. **Error Handling & Debugging Infrastructure:**
   - Created `useDebugError` hook for centralized error handling
   - Built `DebugErrorDialog` component for on-screen error display
   - Implemented `logger` utility for conditional logging
   - Added comprehensive error context to all async operations
   - Production mode automatically disables debug features
   - Android WebView UUID fallback (`src/utils/uuid.ts`)
   - Added detailed logging to storage and store layers
   - Updated documentation with debugging workflows

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
