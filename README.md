# Worry Box - MVP

> "You can't always control what happens, but you can control when you worry about it."

A mobile app that helps users manage anxiety about things they can't immediately act on. Log worries with a "locked until" date, and get actionable reminders when you can actually do something.

## Overview

Worry Box is built with:
- **Vite** + **React 19** + **TypeScript** for a modern development experience
- **Capacitor 8** for native iOS and Android functionality
- **Tailwind CSS v4** for styling (CSS-first configuration)
- **shadcn/ui** for accessible, polished UI components
- **Zustand** for state management
- **Biome** for linting and formatting

## Features

### Core Functionality (v1.0)
- ✅ Add worries with custom unlock dates/times
- ✅ Quick date selection (Tomorrow, Monday, Next Week)
- ✅ Local notifications when worries unlock
- ✅ Haptic feedback for tactile responses
- ✅ Worry lifecycle: Locked → Unlocked → Resolved/Dismissed
- ✅ Complete history view with filtering
- ✅ Dark mode support

### New in v1.1
- ✅ **Insights Dashboard** - Metrics showing progress, patterns, and completion rates
- ✅ **Complete Design Token System** - All spacing, sizing, and touch targets use semantic tokens
- ✅ **Toast notifications** - Instant feedback for all actions (via Sonner)
- ✅ **Lock animation** - Satisfying visual feedback when locking worries
- ✅ **Keyboard shortcuts** - Ctrl/Cmd+Enter to submit, Escape to close modals
- ✅ **Search in History** - Find worries by content or action text
- ✅ **Onboarding flow** - Welcoming first-time user experience
- ✅ **Error handling** - Graceful error messages with recovery options
- ✅ **Production-ready code quality** - Fixed all critical issues from code review

### Technical Highlights
- Local-first storage (no backend required)
- Full offline functionality
- Type-safe with TypeScript
- Accessible UI components
- Clean separation of concerns (services, stores, components, utils)
- Toast notifications via Sonner
- Optimistic updates with error handling

## Project Structure

```
worry-app/
├── src/
│   ├── components/        # Reusable UI components
│   │   ├── ui/           # shadcn/ui base components
│   │   ├── AddWorrySheet.tsx
│   │   ├── DateTimePicker.tsx
│   │   ├── EditWorrySheet.tsx
│   │   ├── EmptyState.tsx
│   │   ├── LockAnimation.tsx
│   │   ├── Onboarding.tsx
│   │   └── WorryCard.tsx
│   ├── config/           # Configuration and constants
│   │   ├── constants.ts  # Magic numbers, durations, sizes
│   │   └── language.ts   # All user-facing text (i18n-ready)
│   ├── pages/            # Route pages
│   │   ├── Home.tsx      # Main dashboard
│   │   ├── History.tsx   # All worries with search/filter
│   │   ├── Insights.tsx  # Metrics and patterns (NEW)
│   │   └── Settings.tsx  # User preferences
│   ├── hooks/            # Custom React hooks
│   │   ├── useEscapeKey.ts
│   │   └── useHaptics.ts
│   ├── services/         # External integrations
│   │   ├── storage.ts        # Capacitor Preferences
│   │   └── notifications.ts  # Capacitor LocalNotifications
│   ├── store/            # Zustand stores
│   │   ├── worryStore.ts
│   │   └── preferencesStore.ts
│   ├── types/            # TypeScript types
│   │   └── index.ts
│   └── utils/            # Helper functions
│       ├── dates.ts
│       └── encouragement.ts
├── ios/                  # iOS native project
├── android/              # Android native project
├── CLAUDE.md             # Context for AI development
└── capacitor.config.ts   # Capacitor configuration
```

## Getting Started

### Prerequisites
- Node.js 18+ and npm
- Xcode (for iOS development)
- Android Studio (for Android development)

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

### Development Commands

```bash
# Linting and formatting
npm run lint          # Check code quality
npm run lint:fix      # Auto-fix issues
npm run format        # Format code

# Build
npm run build         # TypeScript + Vite build
npm run preview       # Preview production build
```

### Running on Mobile

```bash
# Build web assets
npm run build

# Sync to native projects
npx cap sync

# Open in IDEs
npx cap open ios       # Opens Xcode
npx cap open android   # Opens Android Studio

# Run on device/simulator
npx cap run ios
npx cap run android
```

## Debugging

### Chrome DevTools (Recommended)

The easiest way to debug on Android:

1. Run the app on an Android device/emulator
2. Open Chrome and navigate to `chrome://inspect`
3. Click "inspect" under your app name
4. Access full console logs, network activity, and Application storage

**What you'll see:**
- `[Store]` and `[Storage]` debug logs (development only)
- Full error details via debug error dialog
- Application → Local Storage to inspect Capacitor Preferences data

### Android Studio Logcat

View native Android logs:

```bash
# In Android Studio: View → Tool Windows → Logcat

# Or via command line:
adb logcat

# Filter for app-specific logs:
adb logcat | grep -i capacitor
adb logcat | grep -i chromium
```

### Inspect Android Storage Directly

View SharedPreferences data (where Capacitor stores data):

```bash
# Replace YOUR.PACKAGE.NAME with your app's package (check android/app/build.gradle)
adb shell run-as YOUR.PACKAGE.NAME ls /data/data/YOUR.PACKAGE.NAME/shared_prefs/

# View Capacitor storage file:
adb shell run-as YOUR.PACKAGE.NAME cat /data/data/YOUR.PACKAGE.NAME/shared_prefs/CapacitorStorage.xml
```

### Debug Error System

The app includes a development-only debug error dialog that shows:
- Full error messages
- Operation context (what was being attempted)
- Stack traces

**Production behavior:**
- Debug dialogs are automatically disabled
- Errors still logged to console
- Ready for integration with error tracking services (Sentry, LogRocket)

### Development vs Production Logging

**Development (`npm run dev`):**
- All `[Store]` and `[Storage]` logs visible
- Debug error dialogs enabled
- Full stack traces

**Production (`npm run build`):**
- Debug logs stripped from bundle
- Debug dialogs disabled
- Only errors logged to console
- Smaller bundle size

## Technology Stack

| Layer | Technology | Version | Purpose |
|-------|-----------|---------|---------|
| Runtime | Capacitor | 8.x | Native mobile bridge |
| UI Framework | React | 19.x | Component library |
| Language | TypeScript | 5.9.x | Type safety |
| Styling | Tailwind CSS | 4.x | Utility-first CSS |
| State | Zustand | 5.x | Lightweight state management |
| Build | Vite | 7.x | Fast bundler |
| Linting | Biome | 2.x | Fast linter & formatter |

### Capacitor Plugins

- `@capacitor/local-notifications` - Schedule unlock reminders
- `@capacitor/preferences` - Persist worries locally
- `@capacitor/haptics` - Tactile feedback
- `@capacitor/splash-screen` - Launch screen
- `@capacitor/status-bar` - Status bar styling
- `@capacitor/app` - App lifecycle & deep links

## Data Model

### Worry
```typescript
interface Worry {
  id: string;                    // UUID v4
  content: string;               // What the user is worried about
  action?: string;               // Optional: what to do when unlocked
  unlockAt: string;              // ISO 8601 - when notification fires
  status: 'locked' | 'unlocked' | 'resolved' | 'dismissed';
  notificationId: number;        // Capacitor notification ID
  createdAt: string;             // ISO 8601
  unlockedAt?: string;           // ISO 8601
  resolvedAt?: string;           // ISO 8601
}
```

### Storage
All data is stored locally using Capacitor Preferences API:
- `worry_box_worries` - Array of Worry objects
- `worry_box_prefs` - User preferences
- `worry_box_stats` - Usage statistics

## Configuration

### Tailwind CSS v4
Tailwind v4 uses CSS-first configuration. All configuration is in `src/index.css`:

```css
@import "tailwindcss";

/* Custom theme variables can be added here */
```

### Biome
Configuration in `biome.json`:
- 2-space indentation
- Single quotes
- 100 character line width
- ES5 trailing commas

## Features in Detail

### Notification System
- Notifications fire at user-specified unlock times
- Includes quick actions: "Done ✓" and "Snooze 1hr"
- Respects quiet hours (configurable in settings)
- Encouraging messages can be toggled

### Haptic Feedback
- Heavy impact when locking a worry
- Success notification when unlocking/resolving
- Light impact for button taps
- Can be disabled in settings

### Theme Support
- System (follows OS preference)
- Light mode
- Dark mode
- Smooth transitions between themes

## Roadmap

### Future Enhancements (V2+)
- [ ] Worry patterns analytics
- [ ] Breathing exercise integration
- [ ] iCloud/Google Drive sync
- [ ] Home screen widgets
- [ ] Apple Watch complications
- [ ] Custom themes
- [ ] Export/backup functionality
- [ ] Worry tagging and categories

## Contributing

This is an MVP built according to the technical specification v0.1.0.

### Development Workflow
1. Make changes in `src/`
2. Run `npm run lint:fix` to format code
3. Test in browser: `npm run dev`
4. Build: `npm run build`
5. Sync to native: `npx cap sync`
6. Test on device

## License

Private - Luke & Jack Tondeur (60/40 equity split)

## Version

**0.1.4** - Testing & Quality Assurance (Current)
- **shadcn/ui enhancements** - Added Switch, Select, Separator, Badge components
- **Settings redesign** - Upgraded to use shadcn Switch and Select for better UX
- **WorryCard polish** - Enhanced with shadcn Card, Badge, and Button components
- **Vitest testing** - Comprehensive test suite for state management and utilities
- **Lefthook integration** - Pre-commit hooks for type checking and linting
- **GitHub Actions CI** - Automated testing and build verification

0.1.3 - Release & Let Go
- **"I Can't Control This"** quick action - Release worries you can't control directly into the box
- Metaphorical "worry release" for accepting what's beyond your control
- Special encouraging message when releasing worries
- Updated addWorry to return the created worry for better composability

0.1.2 - Calming Design Update
- shadcn/ui component library integration
- Calming color palette with soft blues and lavenders
- Semantic color tokens for consistent theming
- Enhanced accessibility and visual polish

0.1.1 - Enhanced UX Release
- Toast notifications for instant feedback
- Lock animation for visual delight
- Keyboard shortcuts for power users
- Search functionality in History
- Onboarding for new users
- Better error handling

0.1.0 - Initial MVP Release

---

Built with ❤️ using Capacitor, React, and Tailwind CSS
