# 📚 House of EdTech — Mini LMS Mobile App

> **React Native Expo Developer Assignment Submission**
> Submitted by **Parth Sharma**

---

## 📋 Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Architecture Decisions](#architecture-decisions)
- [Project Structure](#project-structure)
- [Setup & Installation](#setup--installation)
- [Environment Variables](#environment-variables)
- [Features Implemented](#features-implemented)
- [Screenshots](#screenshots)
- [APK Build](#apk-build)
- [Demo Video](#demo-video)
- [Known Issues & Limitations](#known-issues--limitations)

---

## Overview

House of EdTech is a production-grade Mini Learning Management System built as part of the React Native Expo developer technical assignment. The app demonstrates end-to-end mobile development proficiency — from authentication and native integrations to WebView communication, state management, and performance optimization.

The API used is [api.freeapi.app](https://api.freeapi.app), where:
- `/api/v1/public/randomproducts` is treated as the **course catalog**
- `/api/v1/public/randomusers` is treated as **course instructors**

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React Native + Expo SDK 52 |
| Language | TypeScript (strict mode) |
| Navigation | Expo Router v4 (file-based) |
| State Management | Redux Toolkit |
| Styling | NativeWind v4 + StyleSheet (mixed) |
| Sensitive Storage | Expo SecureStore |
| App Data Storage | AsyncStorage |
| HTTP Client | Axios (interceptors + retry) |
| Images | expo-image (built-in caching) |
| List Virtualization | @legendapp/list |
| Notifications | expo-notifications + expo-background-fetch |
| WebView | react-native-webview |
| Network Monitoring | @react-native-community/netinfo |

---

## Architecture Decisions

### 1. Mixed Styling Strategy (NativeWind + StyleSheet)

Rather than committing exclusively to one approach, a deliberate mixed strategy is used:

- **NativeWind `className`** — static layout, spacing, flex, padding, border radius
- **`StyleSheet.create()`** — complex multi-property groups reused across 3+ components, cross-platform shadows (iOS `shadowColor` + Android `elevation` cannot be expressed cleanly in Tailwind)
- **`style={{ fontFamily: FONTS.X }}`** — always inline for custom fonts, since NativeWind does not load or resolve custom font families

### 2. Centralized Theme System

All design tokens live in `src/theme/` and are the **single source of truth**:

```
src/theme/
├── colors.ts       → Colors.primary, Colors.error, etc.
├── fonts.ts        → FONTS.BOLD, FONTS.SEMIBOLD, FontSize.md, etc.
├── icons.ts        → ICON_NAMES.home, <Icon name={...} />, etc.
├── images.ts       → Images.avatarPlaceholder, etc.
└── styles.global.ts → GlobalStyles.cardShadow, GlobalStyles.screen, etc.
```

Components never hardcode hex values, font strings, or icon names. This makes design-wide changes a single-file edit.

### 3. Typography via AppText

All text in the app flows through `<AppText variant="...">`. The `variant` prop maps to a complete style preset (font family + size + color + line height). This enforces consistency and makes font changes trivially easy.

```tsx
// ✅ Always this
<AppText variant="h2">Title</AppText>
<AppText variant="bodySm" color={Colors.textSecondary}>Subtitle</AppText>

// ❌ Never this
<Text style={{ fontFamily: 'Poppins-Bold', fontSize: 24 }}>Title</Text>
```

### 4. Service → Hook → Redux Flow

API calls follow a strict one-way data flow:

```
Service (API call) → Hook (business logic + dispatch) → Redux Slice (state) → Component (render)
```

- **Services** (`src/services/`) — pure Axios calls, no business logic
- **Hooks** (`src/hooks/`) — orchestrate services, dispatch Redux actions, manage local loading state
- **Slices** (`src/redux/slices/`) — pure reducers, no side effects
- **Components/Screens** — consume Redux state, call hooks, render UI

### 5. Token Storage Strategy

| Data | Storage | Reason |
|---|---|---|
| Access token | Expo SecureStore | Encrypted, OS-level protection |
| Refresh token | Expo SecureStore | Same — sensitive credential |
| Bookmarks | AsyncStorage + Redux | Non-sensitive, needs fast reads |
| Enrolled courses | AsyncStorage + Redux | Non-sensitive app data |
| Course cache | AsyncStorage | Non-sensitive, 5-min TTL |
| UI state | Redux only | Never needs to persist |

### 6. Axios Retry with Exponential Backoff

The `api.ts` instance handles three failure scenarios automatically:

- **401** → attempts token refresh once, queues parallel requests during refresh (race condition safe), retries original request with new token
- **Network errors / 5xx** → retries up to 3 times with delays of 500ms → 1000ms → 2000ms
- **4xx client errors** → no retry (not transient)

### 7. Bookmark Milestone Notification via Redux Middleware

The 5-bookmark notification trigger is implemented as a **Redux middleware**, not a `useEffect`. This means:
- Logic is completely decoupled from any component
- It fires reliably regardless of which screen the user is on
- No cleanup or dependency array concerns

### 8. LegendList for Course Lists

`@legendapp/list` is used instead of React Native's built-in `FlatList` for both the course catalog and bookmarks screen. All performance props are set:

```tsx
<LegendList
  recycleItems          // recycles item instances instead of unmounting
  estimatedItemSize={320}
  keyExtractor={(item) => item.id}
  renderItem={renderItem}  // wrapped in React.memo with custom comparator
/>
```

`CourseCard` uses a custom `memo` comparator that only re-renders when `isBookmarked`, `isEnrolled`, or handlers actually change — not on every parent render.

### 9. WebView Bidirectional Communication

```
Native → WebView:  webViewRef.current?.injectJavaScript(...)
WebView → Native:  window.ReactNativeWebView.postMessage(JSON.stringify(payload))
```

Message types:
- `WEBVIEW_READY` — WebView signals it's loaded; native sends initial bookmark state
- `BOOKMARK_UPDATE` — native sends when user toggles bookmark; WebView updates UI
- `ENROLL` — WebView sends when user taps Enroll; native updates Redux + AsyncStorage

---

## Project Structure

```
house_of_edtech/
├── app/                              ← Expo Router pages (thin wrappers)
│   ├── _layout.tsx                   ← Root layout: fonts, Redux, ErrorBoundary
│   ├── index.tsx                     ← Splash + auth bootstrap + redirect guard
│   ├── (auth)/
│   │   ├── _layout.tsx
│   │   ├── login.tsx
│   │   └── register.tsx
│   └── (tabs)/
│       ├── _layout.tsx               ← Custom tab bar with badge support
│       ├── index.tsx                 ← Home screen
│       ├── bookmarks.tsx             ← Saved courses
│       ├── profile.tsx               ← User profile
│       └── courses/
│           ├── _layout.tsx           ← Stack navigator for course flow
│           ├── index.tsx             ← Course list
│           ├── [id].tsx              ← Course detail
│           └── webview/
│               └── course.tsx        ← WebView screen
│
├── src/
│   ├── theme/
│   │   ├── colors.ts                 ← Semantic color tokens
│   │   ├── fonts.ts                  ← FONTS constant + FontSize scale
│   │   ├── icons.ts                  ← ICON_NAMES + <Icon /> component
│   │   ├── images.ts                 ← Static asset registry
│   │   └── styles.global.ts          ← Shared StyleSheet objects
│   │
│   ├── constants/
│   │   ├── api.constants.ts          ← All endpoint strings
│   │   ├── storage.keys.ts           ← All AsyncStorage / SecureStore keys
│   │   └── app.constants.ts          ← Timeout, retry count, cache TTL, etc.
│   │
│   ├── types/
│   │   ├── auth.types.ts
│   │   ├── course.types.ts
│   │   ├── user.types.ts
│   │   └── navigation.types.ts
│   │
│   ├── services/
│   │   ├── api.ts                    ← Axios instance: interceptors, retry, refresh
│   │   ├── auth.service.ts
│   │   ├── course.service.ts
│   │   └── notification.service.ts
│   │
│   ├── redux/
│   │   ├── store.ts                  ← Store + bookmark milestone middleware
│   │   ├── hook.ts                   ← Typed useAppDispatch / useAppSelector
│   │   └── slices/
│   │       ├── auth.slice.ts
│   │       ├── user.slice.ts
│   │       ├── course.slice.ts
│   │       ├── bookmark.slice.ts
│   │       ├── snackbar.slice.ts
│   │       └── network.slice.ts
│   │
│   ├── hooks/
│   │   ├── useAuthApi.ts             ← Login, register, logout, avatar update
│   │   ├── useCourseApi.ts           ← Fetch, refresh, paginate courses
│   │   ├── useBookmarks.ts           ← Toggle, hydrate, check bookmark state
│   │   ├── useNetworkStatus.ts       ← NetInfo → Redux network slice
│   │   └── useNotifications.ts       ← Permission, scheduling, tap handlers
│   │
│   ├── components/
│   │   ├── common/
│   │   │   ├── AppText.tsx           ← Typography system (all text goes here)
│   │   │   ├── AppButton.tsx
│   │   │   ├── AppInput.tsx
│   │   │   ├── ScreenWrapper.tsx     ← Root container for all screens
│   │   │   ├── CustomSplash.tsx      ← Animated splash screen
│   │   │   ├── SnackBar.tsx          ← Redux-driven toast (animated)
│   │   │   ├── OfflineBanner.tsx     ← Network status banner (animated)
│   │   │   ├── ErrorBoundary.tsx     ← React class error boundary
│   │   │   ├── SkeletonCard.tsx      ← Shimmer loading placeholder
│   │   │   └── LoadingOverlay.tsx
│   │   └── course/
│   │       ├── CourseCard.tsx        ← Memoized list item with custom comparator
│   │       └── SearchBar.tsx         ← Debounced search input
│   │
│   ├── screens/
│   │   ├── auth/
│   │   │   ├── LoginScreen.tsx
│   │   │   └── RegisterScreen.tsx
│   │   ├── courses/
│   │   │   ├── CourseListScreen.tsx
│   │   │   └── CourseDetailScreen.tsx
│   │   ├── profile/
│   │   │   └── ProfileScreen.tsx
│   │   └── webview/
│   │       └── WebViewScreen.tsx
│   │
│   └── utils/
│       ├── localStorageKey.ts        ← SecureStore + AsyncStorage helpers
│       ├── utils.ts                  ← getErrorMessage, normalizers, debounce
│       └── webviewTemplate.ts        ← HTML template builder for WebView
│
├── assets/
│   └── fonts/                        ← Poppins font files (.ttf)
│
├── app.json
├── app.env.ts
├── babel.config.js
├── metro.config.js
├── tailwind.config.js
├── tsconfig.json
├── global.css
└── package.json
```

---

## Setup & Installation

### Prerequisites

- Node.js 18+
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- EAS CLI for builds (`npm install -g eas-cli`)
- Android Studio or Xcode (for simulators)

### Steps

```bash
# 1. Clone the repository
git clone https://github.com/Parastud/house_of_edtech.git
cd house_of_edtech

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env
# Edit .env with your values (see Environment Variables section)

# 4. Add Poppins fonts to assets/fonts/
# Download from https://fonts.google.com/specimen/Poppins
# Required files:
#   Poppins-Regular.ttf
#   Poppins-Medium.ttf
#   Poppins-SemiBold.ttf
#   Poppins-Bold.ttf
#   Poppins-ExtraBold.ttf

# 5. Start the development server
npx expo start

# 6. Run on device/emulator
npx expo start --android    # Android
npx expo start --ios        # iOS (macOS only)
```

---

## Environment Variables

Create a `.env` file in the project root:

```env
EXPO_PUBLIC_BASE_URL=https://api.freeapi.app
EXPO_PUBLIC_APP_ENV=development
```

All environment variables use the `EXPO_PUBLIC_` prefix so they are accessible client-side in Expo.

---

## Features Implemented

### ✅ Part 1 — Authentication & User Management

| Feature | Details |
|---|---|
| Login | Email + password via `/api/v1/users/login` |
| Register | Username + email + password via `/api/v1/users/register` |
| Token storage | Access + refresh tokens in Expo SecureStore |
| Auto-login | On app start: reads token → validates via `/api/v1/users/current-user` → sets Redux state |
| Auth guard | `app/index.tsx` redirects based on `isAuthorized` state |
| Logout | Server logout (best-effort) + clears SecureStore + AsyncStorage + Redux |
| Token refresh | Axios interceptor: 401 → refresh → retry with queue to handle parallel requests |
| Profile screen | Avatar, username, email, enrolled count, bookmarks count |
| Avatar update | Image picker → `PATCH /api/v1/users/avatar` (multipart/form-data) |

### ✅ Part 2 — Course Catalog

| Feature | Details |
|---|---|
| Course list | Fetches products + users in parallel, pairs by index modulo |
| Course card | Thumbnail, instructor avatar + name, title, description, category badge, bookmark icon |
| Pull-to-refresh | Bypasses cache, always hits API |
| Infinite scroll | Fetches next page on `onEndReached` |
| Search | Client-side, debounced 350ms, filters title / description / category / instructor |
| Skeleton loading | Shimmer cards shown on initial load |
| Empty state | Shown when search returns no results |
| Error state | Shown with retry option when API fails |
| Cache | Course data cached in AsyncStorage with 5-minute TTL |
| Course detail | Full info: title, description, category, rating, price + discount, brand |
| Instructor card | Avatar, name, location, email |
| Enroll | Updates Redux + persists to AsyncStorage, button disabled after enrollment |
| Bookmark toggle | Updates Redux + AsyncStorage, shows snackbar |

### ✅ Part 3 — WebView Integration

| Feature | Details |
|---|---|
| Local HTML shell | Built from course data via `buildCourseWebViewHTML()` — no network request |
| Course data in WebView | Title, description, instructor, price, rating, category all rendered |
| Native → WebView | Bookmark state sent via `injectJavaScript` on load and on toggle |
| WebView → Native | `WEBVIEW_READY` and `ENROLL` messages handled |
| Enroll from WebView | Updates Redux state + persists AsyncStorage |
| Loading indicator | `ActivityIndicator` shown while HTML renders |
| Error fallback | Full error UI with retry button on `onError` |

### ✅ Part 4 — Native Features

| Feature | Details |
|---|---|
| Notification permission | Requested on first bookmark |
| Android channel | Created at app start via `setupAndroidNotificationChannel()` |
| Bookmark milestone | Fires once at 5+ bookmarks — implemented in Redux middleware |
| Milestone guard | `milestoneNotified` flag in Redux prevents re-firing |
| Inactivity notification | Scheduled 24hrs after last open, cancelled + rescheduled on every open |
| Background fetch | `expo-background-fetch` task registered for inactivity check |
| Notification tap | Bookmark milestone → Bookmarks tab, Inactivity → Courses tab |

### ✅ Part 5 — State Management & Performance

| Feature | Details |
|---|---|
| Redux slices | auth, user, courses, bookmarks, snackbar, network |
| Persistence | Tokens → SecureStore, bookmarks + enrolled → AsyncStorage |
| Network state | `NetInfo` listener → `network.slice` → `OfflineBanner` |
| LegendList | Used on course list + bookmarks, with `recycleItems` + `estimatedItemSize` |
| CourseCard memo | Custom comparator — only re-renders on `isBookmarked`, `isEnrolled`, handler changes |
| Debounced search | 350ms debounce via custom `debounce` util |

### ✅ Part 6 — Error Handling

| Feature | Details |
|---|---|
| API retry | 3 attempts, exponential backoff: 500ms → 1000ms → 2000ms |
| Timeout | 10 seconds on all requests |
| Error messages | Extracted from server response or error type via `getErrorMessage()` |
| Offline banner | Animated slide-in/out driven by Redux network slice |
| WebView error | Error UI with retry button on `onError` |
| Error boundary | Class component wraps entire app tree |

---

## Screenshots

> **Note:** Replace the placeholders below with actual screenshots before final submission.

### Authentication

| Login Screen | Register Screen |
|---|---|
| ![Login](./assets/screenshots/login.png) | ![Register](./assets/screenshots/register.png) |

### Course Catalog

| Course List | Search Active | Course Detail |
|---|---|---|
| ![Course List](./assets/screenshots/course_list.png) | ![Search](./assets/screenshots/search.png) | ![Course Detail](./assets/screenshots/course_detail.png) |

### WebView & Bookmarks

| WebView Screen | Bookmarks Tab |
|---|---|
| ![WebView](./assets/screenshots/webview.png) | ![Bookmarks](./assets/screenshots/bookmarks.png) |

### Profile & States

| Profile Screen | Offline Banner | Skeleton Loading |
|---|---|---|
| ![Profile](./assets/screenshots/profile.png) | ![Offline](./assets/screenshots/offline_banner.png) | ![Skeleton](./assets/screenshots/skeleton.png) |

---

## APK Build

### Download APK

> 🔗 **APK Download:** _(Add your EAS build link or Google Drive link here)_

### Build Instructions

```bash
# Install EAS CLI
npm install -g eas-cli

# Login to Expo account
eas login

# Build Android APK (development build)
eas build --platform android --profile preview

# Build Android APK (production)
eas build --platform android --profile production
```

**eas.json** (add to project root if not present):

```json
{
  "build": {
    "preview": {
      "android": {
        "buildType": "apk"
      }
    },
    "production": {
      "android": {
        "buildType": "apk"
      }
    }
  }
}
```

---

## Demo Video

> 🎥 **Demo Video:** _(Add your YouTube or Google Drive link here)_

The demo covers:
- App launch → splash → auto-login flow
- Register + login flow with validation
- Course list: loading skeletons → data → search → pull-to-refresh
- Course detail: enroll + bookmark
- WebView: course content, enroll from WebView, bookmark sync
- Bookmarks tab with badge counter
- Profile screen: avatar update, stats
- Offline banner when network is lost
- Notification on 5th bookmark

---

## Known Issues & Limitations

| Issue | Detail |
|---|---|
| Background fetch in Expo Go | `expo-background-fetch` is not supported in Expo Go — test on a development build or production APK |
| Instructor-course pairing | The API returns unrelated random data — instructors are paired with courses by index modulo, so there is no real semantic relationship |
| Landscape mode | The app is functional in landscape but the list layout is optimized for portrait |
| Image assets | Placeholder images in `src/assets/images/` need to be added manually — they are not committed to the repo |
| Token refresh on register | The `api.freeapi.app` register endpoint may not return tokens on all environments — the app handles this gracefully by showing a success message without auto-login if no token is returned |

---

## Submission Details

| Field | Value |
|---|---|
| Candidate | Parth Sharma |
| Position | React Native Expo Developer |
| Company | House of EdTech |
| Repository | https://github.com/Parastud/house_of_edtech |
| APK | _(link)_ |
| Demo Video | _(link)_ |
| Submission Deadline | 6th May 2026, 2:00 PM |