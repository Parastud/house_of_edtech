# 🎓 House of EdTech — Mini LMS Mobile App

A production-grade Learning Management System built with React Native Expo, TypeScript, Redux Toolkit, and OpenAI — submitted as part of the House of EdTech React Native Developer assignment.

---

## 📱 Demo

| | |
|---|---|
| **Demo Video** | [Watch on YouTube](#) ← paste your link here |
| **APK Download** | [Download APK](#) ← paste your EAS / Drive link here |
| **GitHub** | [github.com/Parastud/house_of_edtech](https://github.com/Parastud/house_of_edtech) |

---

## 📸 Screenshots

| Splash | Login | Courses |
|--------|-------|---------|
| ![Splash](https://media.discordapp.net/attachments/717998252602949632/1500845330139185252/Screenshot_2026-05-04-18-28-26-728_com.parastud.houseofedtech.jpg?ex=6a012ae3&is=69ffd963&hm=6b9f6107df92e8d37edf3bae796a53f846ca0e1e5b774ed15a47ce7d49e6e340&=&format=webp&width=401&height=890) | ![Login](https://media.discordapp.net/attachments/717998252602949632/1500845330592301277/Screenshot_2026-05-04-18-28-40-054_com.parastud.houseofedtech.jpg?ex=69f9eaa3&is=69f89923&hm=08f25c60752d20ab305db7170cb81ae7e6ced126e7aea06b55b4a8aef485b13e&=&format=webp&width=401&height=890) | ![Courses](https://media.discordapp.net/attachments/717998252602949632/1500845331037028382/Screenshot_2026-05-04-18-29-48-648_com.parastud.houseofedtech.jpg?ex=69f9eaa3&is=69f89923&hm=6b82482e13fe5724f58face0b9dc28b715893816dd29667e870711c274d8dd8d&=&format=webp&width=401&height=890) |

| Course Detail | WebView | AI Mentor |
|---------------|---------|-----------|
| ![Detail](https://media.discordapp.net/attachments/717998252602949632/1500845331653333144/Screenshot_2026-05-04-18-30-13-853_com.parastud.houseofedtech.jpg?ex=69f9eaa3&is=69f89923&hm=2370a296fb976451bcb0d1ddb4bbdba5798ed0e4fc31adcf864f0c15dd9bc60e&=&format=webp&width=401&height=890) | ![WebView](https://media.discordapp.net/attachments/717998252602949632/1500845328570650764/Screenshot_2026-05-04-18-30-22-855_com.parastud.houseofedtech.jpg?ex=69f9eaa2&is=69f89922&hm=4fc70b8d9f8a39700ff119c1682a4eadf02245bf759532d80697c2508999c93a&=&format=webp&width=401&height=890) | ![AI](https://media.discordapp.net/attachments/717998252602949632/1500845328923099346/Screenshot_2026-05-04-18-30-31-598_com.parastud.houseofedtech.jpg?ex=69f9eaa2&is=69f89922&hm=034fde20bd749f06b94b50612be7c4d2375a5bddc9974907f02ca5444fdac62e&=&format=webp&width=401&height=890) |

| Bookmarks | Profile | Offline Banner |
|-----------|---------|----------------|
| ![Bookmarks](https://media.discordapp.net/attachments/717998252602949632/1500845329224831076/Screenshot_2026-05-04-18-30-57-591_com.parastud.houseofedtech.jpg?ex=69f9eaa2&is=69f89922&hm=efcf6b251de8e96becb9f2ae28c42218388c4054bfbef2d558ed3aec80888d08&=&format=webp&width=401&height=890) | ![Profile](https://media.discordapp.net/attachments/717998252602949632/1500845329644388482/Screenshot_2026-05-04-18-31-02-126_com.parastud.houseofedtech.jpg?ex=69f9eaa2&is=69f89922&hm=b67fee180ab7a066d67045b3d40c15e2550f6744645188a63ded6d452fd9a4dd&=&format=webp&width=401&height=890) | ![Offline](https://media.discordapp.net/attachments/717998252602949632/1500845329904570518/Screenshot_2026-05-04-18-31-20-825_com.parastud.houseofedtech.jpg?ex=69f9eaa3&is=69f89923&hm=da178ced02971310922c2b3e8bc313000f32be72a19c6d2a1bb9d2e66bc03897&=&format=webp&width=401&height=890) |

---

## ⚙️ Setup Instructions

### Prerequisites

- Node.js 18+
- Expo CLI — `npm install -g expo-cli`
- EAS CLI (for APK builds) — `npm install -g eas-cli`
- An Android device or emulator / iOS simulator

### 1. Clone the repo

```bash
git clone https://github.com/Parastud/house_of_edtech.git
cd house_of_edtech
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env` file in the root of the project:

```env
EXPO_PUBLIC_BASE_URL=https://api.freeapi.app
EXPO_PUBLIC_OPENAI_KEY=sk-your-openai-key-here
```

> The `EXPO_PUBLIC_` prefix is required by Expo — it makes the variable available in the JavaScript bundle. Never put secrets without this prefix in `.env` if they need to reach the client.

### 4. Start the development server

```bash
npx expo start
```

Scan the QR code with Expo Go (Android) or the Camera app (iOS).

### 5. Run on a specific platform

```bash
npx expo start --android
npx expo start --ios
```

---

## 🏗️ Build APK

### Development build (recommended for testing)

```bash
eas build --platform android --profile development
```

### Preview APK (shareable, no store)

```bash
eas build --platform android --profile preview
```

After the build finishes, EAS will give you a download link. You can also find all builds at [expo.dev](https://expo.dev).

> Make sure you're logged into EAS: `eas login`

---

## 🌍 Environment Variables

| Variable | Required | Description |
|---|---|---|
| `EXPO_PUBLIC_BASE_URL` | ✅ Yes | FreeAPI base URL — `https://api.freeapi.app` |
| `EXPO_PUBLIC_OPENAI_KEY` | ✅ Yes | OpenAI API key for the AI Mentor feature |

---

## 🗂️ Folder Structure

```
house_of_edtech/
│
├── app/                          # Expo Router pages (thin wrappers)
│   ├── _layout.tsx               # Root layout — Redux, fonts, SafeArea
│   ├── index.tsx                 # Entry point redirect
│   ├── (auth)/
│   │   ├── _layout.tsx
│   │   ├── login.tsx
│   │   └── register.tsx
│   └── (tabs)/
│       ├── _layout.tsx           # Tab bar + AI Mentor FAB + Sheet
│       ├── index.tsx             # Home screen
│       ├── bookmarks.tsx         # Saved courses
│       ├── profile.tsx           # User profile
│       └── courses/
│           ├── _layout.tsx
│           ├── index.tsx         # Course list
│           ├── [id].tsx          # Course detail
│           └── webview/
│               └── course.tsx    # WebView screen
│
├── src/
│   ├── components/
│   │   ├── AIMentor/             # AI Mentor FAB + bottom sheet
│   │   │   ├── MentorFAB.tsx
│   │   │   ├── MentorSheet.tsx
│   │   │   └── MentorMessage.tsx
│   │   ├── common/               # Shared components
│   │   │   ├── AppText.tsx       # All text goes through this
│   │   │   ├── AppButton.tsx
│   │   │   ├── AppInput.tsx
│   │   │   ├── SnackBar.tsx
│   │   │   ├── OfflineBanner.tsx
│   │   │   ├── ScreenWrapper.tsx
│   │   │   ├── CustomSplash.tsx
│   │   │   ├── ErrorBoundary.tsx
│   │   │   ├── SkeletonCard.tsx
│   │   │   └── LoadingOverlay.tsx
│   │   └── course/
│   │       ├── CourseCard.tsx    # Memoized with custom comparator
│   │       └── SearchBar.tsx
│   │
│   ├── constants/
│   │   ├── api.constants.ts      # All endpoint strings
│   │   ├── app.constants.ts      # Timeouts, cache TTL, thresholds
│   │   └── storage.keys.ts       # SecureStore + AsyncStorage key names
│   │
│   ├── hooks/
│   │   ├── useAuthApi.ts         # Login, register, logout, auto-login
│   │   ├── useCourseApi.ts       # Fetch, refresh, paginate courses
│   │   ├── useBookmarks.ts       # Toggle, persist, hydrate bookmarks
│   │   ├── useNetworkStatus.ts   # NetInfo → Redux network slice
│   │   ├── useNotifications.ts   # Permissions, listeners, inactivity tracker
│   │   └── useAIMentor.ts        # OpenAI chat, context building, streaming
│   │
│   ├── redux/
│   │   ├── store.ts              # Store config + bookmark milestone middleware
│   │   ├── hook.ts               # useAppDispatch, useAppSelector
│   │   └── slices/
│   │       ├── auth.slice.ts
│   │       ├── user.slice.ts
│   │       ├── course.slice.ts
│   │       ├── bookmark.slice.ts
│   │       ├── network.slice.ts
│   │       ├── snackbar.slice.ts
│   │       └── aiMentor.slice.ts
│   │
│   ├── services/
│   │   ├── api.ts                # Axios instance — interceptors, retry, refresh
│   │   ├── auth.service.ts
│   │   ├── course.service.ts
│   │   ├── notification.service.ts
│   │   └── ai.service.ts         # OpenAI call + system prompt builder
│   │
│   ├── theme/
│   │   ├── colors.ts             # Semantic color tokens 
│   │   ├── fonts.ts              # FONTS constant + FontSize scale
│   │   ├── icons.ts              # Centralized Icon component + ICON_NAMES
│   │   ├── images.ts             # Asset registry
│   │   └── styles.global.ts      # Shared StyleSheet objects
│   │
│   ├── types/
│   │   ├── auth.types.ts
│   │   ├── course.types.ts
│   │   ├── user.types.ts
│   │   └── navigation.types.ts
│   │
│   └── utils/
│       ├── localStorageKey.ts    # SecureStore + AsyncStorage helpers
│       ├── utils.ts              
│       └── webviewTemplate.ts    # Local HTML template builder for WebView
│
├── assets/
│   └── fonts/                    # Poppins font files
│
├── app.env.ts                    # Typed env variable exports
├── app.json                      # Expo config
├── babel.config.js
├── metro.config.js
├── tailwind.config.js
└── tsconfig.json
```

---

## 🧠 Key Architectural Decisions

### 1. Expo SecureStore for tokens — not AsyncStorage

Access tokens and refresh tokens are stored exclusively in Expo SecureStore, which uses the device's hardware-backed keystore (Android Keystore / iOS Keychain). AsyncStorage writes plaintext to disk. For anything auth-related, that's not acceptable.

### 2. Token refresh with a parallel request queue

When a 401 comes back, the axios interceptor doesn't just retry naively. It sets a `isRefreshing` flag and queues any other requests that arrive during the refresh. Once the new token is returned, the queue is flushed. Without this, two simultaneous 401s would fire two refresh calls and create a race condition.

```
Request A → 401 → starts refresh
Request B → 401 → sees isRefreshing → joins queue
Refresh completes → both A and B retry with new token
```

### 3. Axios retry with exponential backoff

Network errors and 5xx responses are retried up to 3 times with delays of 500ms, 1000ms, and 2000ms. 4xx errors are not retried — they're client errors that won't resolve by retrying.

### 4. Bookmark milestone notification in Redux middleware — not useEffect

The 5-bookmark notification trigger lives in a custom Redux middleware, not in a component or hook. This means it fires regardless of which screen the user is on, and it's not tied to any component's lifecycle. A `milestoneNotified` flag in the bookmark slice ensures it only fires once, not every time the count crosses 5.

### 5. Course cache with TTL

On first load, courses are fetched from the API and written to AsyncStorage with a timestamp. On subsequent loads, the timestamp is checked — if it's under 5 minutes old, the cache is used directly. Pull-to-refresh always bypasses the cache. This means returning users see content instantly without a network round trip.

### 6. LegendList over FlatList

The course list uses `@legendapp/list` (LegendList) with `recycleItems` enabled. FlatList unmounts and remounts cells as the user scrolls, which causes GC pressure at scale. LegendList recycles the cell instances instead, keeping memory flat regardless of list length.

### 7. CourseCard memoized with a custom comparator

`CourseCard` is wrapped in `React.memo` with a custom comparator that only re-renders when the fields actually visible on the card change — title, thumbnail, instructor name, price, or bookmark state. Without this, every Redux state change would re-render every card in the list.

### 8. AI Mentor with live Redux context

The AI Mentor's system prompt is not static. On every message, `useAIMentor` pulls the current Redux state — course catalog, bookmarked IDs, enrolled IDs, username — and builds the system prompt fresh. This makes the AI genuinely contextual: it knows what the user has saved and enrolled in, and it only recommends courses that actually exist in the catalog.

### 9. Mixed NativeWind + StyleSheet styling

Static layout, spacing, and flex → `className` (NativeWind).  
Complex multi-property groups like card shadows and tab bar styles → `StyleSheet.create()`.  
Custom font families always → `style={{ fontFamily: FONTS.BOLD }}` because NativeWind doesn't resolve custom fonts.  
Dynamic colors driven by JS state → inline `style={{ color: isActive ? Colors.primary : Colors.muted }}`.

### 10. Theme system — nothing hardcoded in components

Every color goes through `Colors` from `src/theme/colors.ts`. Every font family goes through `FONTS` from `src/theme/fonts.ts`. Every icon goes through `ICON_NAMES` from `src/theme/icons.ts`. No component ever contains a raw hex value, a hardcoded font string, or an inline `require()` for an asset. This means changing the entire app's color scheme is a single-file change.

---

## ✅ Requirements Coverage

### Part 1 — Authentication & User Management
- ✅ Login and register via `/api/v1/users` endpoints
- ✅ Access + refresh tokens stored in Expo SecureStore
- ✅ Auto-login on app restart — token validated silently against `/current-user`
- ✅ Logout — clears SecureStore, AsyncStorage, and all Redux slices
- ✅ Token refresh — interceptor with parallel queue pattern
- ✅ Profile screen — username, email, verified badge, stats
- ✅ Avatar update — image picker → multipart upload to `/api/v1/users/avatar`

### Part 2 — Course Catalog
- ✅ Fetches instructors from `/api/v1/public/randomusers`
- ✅ Fetches courses from `/api/v1/public/randomproducts`
- ✅ Paired by index — every course has a real instructor
- ✅ Course card: thumbnail, instructor, title, description, bookmark icon
- ✅ Pull-to-refresh — always bypasses cache
- ✅ Search — debounced, filters across title, description, category, instructor
- ✅ Infinite scroll pagination
- ✅ Skeleton loading on initial fetch
- ✅ Error state with retry button
- ✅ AsyncStorage cache with 5-minute TTL
- ✅ Course detail — full info, enroll button, bookmark toggle, WebView link

### Part 3 — WebView
- ✅ Local HTML template — no external URL
- ✅ Template built from course data passed by native
- ✅ Native → WebView: bookmark state injected via `injectJavaScript`
- ✅ WebView → Native: `postMessage` for enroll action
- ✅ WebView error fallback UI with retry button

### Part 4 — Native Features
- ✅ Notification permission request
- ✅ Android notification channel setup
- ✅ Bookmark milestone notification at 5 bookmarks (fires once via `milestoneNotified` flag)
- ✅ Inactivity notification scheduled 24 hours after last app open
- ✅ AppState listener resets the 24hr window every time app foregrounds
- ✅ Notification tap routes to correct tab (Bookmarks or Courses)

### Part 5 — State Management & Performance
- ✅ Auth, user, courses, bookmarks, network, snackbar, aiMentor — all in Redux
- ✅ Tokens in SecureStore, bookmarks and enrolled IDs in AsyncStorage
- ✅ LegendList with `recycleItems`, `estimatedItemSize`, `keyExtractor`
- ✅ CourseCard in `React.memo` with custom comparator
- ✅ Pull-to-refresh via RefreshControl without UI jank

### Part 6 — Error Handling
- ✅ Axios retry — 3 attempts, exponential backoff (500ms, 1000ms, 2000ms)
- ✅ 10 second request timeout
- ✅ User-friendly error messages extracted from server response
- ✅ Offline banner driven by NetInfo → Redux → animated component
- ✅ WebView error fallback

### Bonus — AI Integration
- ✅ OpenAI GPT-4o Mini — AI Mentor feature
- ✅ System prompt built dynamically from live Redux state
- ✅ Rate limit guard — prevents rapid duplicate requests
- ✅ Offline awareness — blocked when network slice says disconnected
- ✅ Word-by-word progressive response delivery

---

## 📦 Key Dependencies

| Package | Purpose |
|---|---|
| `expo` (SDK 52) | Core framework |
| `expo-router` | File-based navigation |
| `@reduxjs/toolkit` | State management |
| `react-redux` | React bindings for Redux |
| `axios` | HTTP client with interceptors |
| `expo-secure-store` | Hardware-backed token storage |
| `@react-native-async-storage/async-storage` | App data persistence |
| `@legendapp/list` | High-performance virtualized list |
| `expo-notifications` | Local push notifications |
| `expo-background-fetch` | Background inactivity check |
| `react-native-webview` | Embedded WebView |
| `nativewind` | Tailwind CSS for React Native |
| `@react-native-community/netinfo` | Network connectivity monitoring |
| `expo-image-picker` | Avatar photo selection |
| `react-native-safe-area-context` | Safe area insets |

---

## ⚠️ Known Issues / Limitations

- **WebView streaming** — React Native's `fetch` does not support the browser Web Streams API (`response.body.getReader()`). The AI Mentor response is buffered and emitted word-by-word at 18ms intervals to simulate streaming. The UX is identical; only the underlying mechanism differs.
- **Background fetch on iOS** — Expo's background fetch on iOS requires a development build and specific entitlements. It works on Android. In Expo Go on iOS, background tasks are simulated.
- **Inactivity notification** — requires the user to have granted notification permission. If denied, the notification is silently skipped.
- **FreeAPI rate limits** — the public FreeAPI endpoints have rate limits. Rapid pull-to-refresh may return cached data from the server side.

---

## 👤 Author

**Parth Sharma**  
React Native Developer  
GitHub: [@Parastud](https://github.com/Parastud)
