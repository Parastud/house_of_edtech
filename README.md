# House of EdTech - Mini LMS (Expo)

Mini LMS mobile app built with Expo Router, Redux Toolkit, and TypeScript. This repo includes auth, course catalog, bookmarks, WebView content, notifications, offline handling, and performance-focused list rendering.

## Stack

- Expo (SDK 54)
- React Native 0.81
- Expo Router (file-based navigation)
- Redux Toolkit
- TypeScript (strict)
- Axios + interceptors + retry
- Expo SecureStore + AsyncStorage
- NativeWind + StyleSheet
- @legendapp/list (virtualized lists)
- expo-notifications + expo-background-fetch
- react-native-webview

## Project Structure

- app/ - Expo Router pages and layouts
- src/components/ - UI components
   - common/ - AppText, AppButton, AppInput, SnackBar, OfflineBanner, ScreenWrapper, etc.
   - course/ - CourseCard, SearchBar
- src/constants/ - API endpoints, app constants, storage keys
- src/hooks/ - Business logic hooks
- src/redux/ - Store, slices, typed hooks
- src/services/ - API services
- src/theme/ - Colors, fonts, icons, images, global styles
- src/types/ - Shared types and API shapes
- src/utils/ - Helpers and WebView template

## Environment

- Base API URL is defined in app.env.ts
   - BASEURL = https://api.freeapi.app

## Scripts

- npm run start - Start Expo dev server
- npm run android - Run on Android device/emulator
- npm run ios - Run on iOS simulator
- npm run web - Run on web
- npm run lint - Lint with Expo ESLint config

## Feature Overview

- Auth
   - Login and registration via REST endpoints
   - Access and refresh tokens stored in SecureStore
   - Auto-login on app restart with current-user fetch
   - Axios 401 interceptor with refresh + retry
- Profile
   - Displays user data from Redux
   - Avatar update with image picker and multipart upload
   - Enrolled and bookmarked counts
- Courses
   - Fetches random instructors and products
   - Client-side pairing of instructor to course (index modulo)
   - Search with debounced input
   - Pull-to-refresh and pagination
   - AsyncStorage cache with TTL
- Bookmarks
   - Stored in Redux and persisted to AsyncStorage
   - Snackbar feedback on toggle
- WebView
   - Local HTML template built from course data
   - Native-to-WebView messaging for bookmark state
   - WebView-to-native messaging for enroll actions
- Notifications
   - Bookmark milestone notification via Redux middleware
   - Inactivity reminder scheduled and rescheduled on app open
   - Background fetch task for inactivity checks
- Offline
   - Network status in Redux
   - Animated offline banner when disconnected

## App Architecture

### Data Flow

1) UI components trigger actions (press, submit, toggle).
2) Hooks orchestrate async operations and business logic.
3) Services perform API calls through the shared Axios instance.
4) Redux slices update state and drive UI updates.
5) Storage helpers persist tokens and app data as needed.

### Redux State

- auth
   - isAuthorized, isBootstrapping
- user
   - id, username, email, avatarUrl, isEmailVerified
- courses
   - items, pagination, loading flags, filters, error
- bookmarks
   - ids, milestoneNotified
- network
   - isConnected, isInternetReachable
- snackbar
   - message, type, visibility

## Routing

- Root layout mounts providers, error boundary, network hooks, and global UI
- Auth stack includes login and register
- Tabs include home, courses, bookmarks, and profile
- Course details and WebView screens live under courses

## API Integration

### Axios Setup

- Base URL from app.env.ts
- 10s timeout
- Retry on network errors and 5xx with exponential backoff
- 401 interceptor refreshes token and retries queued requests

### Endpoints Used

- POST /api/v1/users/login
- POST /api/v1/users/register
- POST /api/v1/users/logout
- POST /api/v1/users/refresh-token
- GET /api/v1/users/current-user
- PATCH /api/v1/users/avatar
- GET /api/v1/public/randomusers
- GET /api/v1/public/randomproducts

## Storage

### SecureStore

- Access token
- Refresh token

### AsyncStorage

- Bookmarks
- Enrolled courses
- Last active timestamp
- Courses cache and cache TTL

## List Performance

- LegendList with recycleItems and estimatedItemSize
- Stable keyExtractor per item
- CourseCard memoized with custom comparator
- Search input debounced to reduce renders

## Notifications

- Permission requested on app load
- Android notification channel created
- Bookmark milestone notification fired once via middleware
- Inactivity reminder scheduled 24h after last active
- Background task re-schedules reminders if inactive
- Notification taps route to Bookmarks or Courses tabs

## WebView Messaging

### Native -> WebView

- Sends bookmark state after WEBVIEW_READY
- Sends updates when bookmark toggles

### WebView -> Native

- WEBVIEW_READY signals when HTML is ready
- ENROLL triggers Redux updates and persistence

## Styling Rules

- Use AppText for all text rendering
- Colors from theme tokens only
- Fonts from FONTS constants
- Icons via Icon and ICON_NAMES only
- Images via Images registry only
- NativeWind for layout, StyleSheet for complex styles

## Development Notes

- Expo Go does not support some background tasks; app handles gracefully
- WebView loads local HTML; no shell network request required
- Global error handling via ErrorBoundary

## Quick Start

1) Install dependencies
    - npm install
2) Start the app
    - npm run start
3) Open on your target platform
    - Android: press a
    - iOS: press i
    - Web: press w
