# Changelog

All notable changes to Worry Box are documented here.

## [0.1.5] - 2024-12-26

### Added
- **App Icons & Splash Screens** - Custom app icon with Package symbol, generated for all densities via @capacitor/assets
- **Dark mode splash screens** - Automatic dark mode support for splash screens
- **PWA support** - Web app manifest and PWA icons
- **Reset Data feature** - "Remove All Content" button in Settings to clear all worries and reset onboarding
- **Confirmation dialogs** - ConfirmationDialog component for destructive actions

### Changed
- **Unified form components** - Merged AddWorrySheet and EditWorrySheet into single WorryFormSheet
- **Onboarding modal** - Rewritten using shadcn Dialog for better mobile layout
- **Settings page** - Improved layout with shadcn Input component for time picker
- **Error display** - ErrorBoundary now shows error details in all builds (not just development)
- **History sorting** - Active (unlocked) worries now appear first

### Fixed
- **Design audit fixes** - Replaced inline SVGs with lucide-react icons (ChevronLeft, Settings, Search)
- **Hardcoded strings** - Moved remaining strings to language.ts (validation messages, insights text)
- **Backdrop opacity** - Standardized to bg-black/50 across all modals
- **Onboarding modal layout** - Fixed thin vertical strip rendering issue on mobile

## [0.1.4] - 2024-12-24

### Added
- **Insights Dashboard** - New /insights page with metrics and patterns
  - Total worries, completion rate, resolution rate
  - Average time to resolve
  - Weekly activity tracking
  - Empty state for new users
- **Debug error handling** - useDebugError hook and DebugErrorDialog component
- **Conditional logging** - logger utility for dev-only console output
- **UUID fallback** - Android WebView-compatible UUID generation

### Changed
- **Design token system** - Complete migration to Tailwind v4 @theme directive
- **Icon sizes** - Added size-icon-xl (64px) token
- **Animation constants** - Extracted to ANIMATION_DURATIONS in constants.ts

### Fixed
- **Notification ID collisions** - Use random IDs instead of Date.now()
- **Type safety** - PluginListenerHandle instead of any
- **Error handling** - Added try/catch to App.tsx init() and storage.ts JSON.parse

## [0.1.3] - 2024-12-22

### Added
- **"I Can't Control This" feature** - Quick action to release worries you can't control
- **Worry release flow** - Metaphorical release for accepting what's beyond your control
- **Special encouragement** - Unique message when releasing worries

### Changed
- **addWorry return value** - Now returns the created worry for better composability

## [0.1.2] - 2024-12-20

### Added
- **shadcn/ui integration** - Complete component library integration
- **Calming color palette** - Soft blues and lavenders for a peaceful experience
- **Semantic color tokens** - Consistent theming with CSS variables

### Changed
- **Visual polish** - Enhanced accessibility and visual refinements

## [0.1.1] - 2024-12-18

### Added
- **Toast notifications** - Instant feedback via Sonner
- **Lock animation** - Satisfying visual feedback when locking worries
- **Keyboard shortcuts** - Ctrl/Cmd+Enter to submit, Escape to close
- **History search** - Find worries by content or action text
- **Onboarding flow** - Welcome experience for new users

### Changed
- **Error handling** - Graceful error messages with recovery options

## [0.1.0] - 2024-12-15

### Added
- Initial MVP release
- Add worries with custom unlock dates/times
- Quick date selection (Tomorrow, Monday, Next Week)
- Local notifications when worries unlock
- Haptic feedback for tactile responses
- Worry lifecycle: Locked → Unlocked → Resolved/Dismissed
- Complete history view with filtering
- Dark mode support
- Settings page with preferences
