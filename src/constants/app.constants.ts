// ─── API ──────────────────────────────────────────────────────────────────────
export const API_TIMEOUT_MS = 10_000;
export const API_RETRY_COUNT = 3;
export const API_RETRY_DELAY_BASE_MS = 500; // exponential: 500, 1000, 2000

// ─── Cache ────────────────────────────────────────────────────────────────────
export const COURSES_CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

// ─── Pagination ───────────────────────────────────────────────────────────────
export const PAGE_SIZE = 10;

// ─── Notifications ────────────────────────────────────────────────────────────
export const BOOKMARK_NOTIFICATION_THRESHOLD = 5;
export const INACTIVITY_NOTIFICATION_HOURS = 24;
export const BACKGROUND_FETCH_TASK = 'LMS_INACTIVITY_CHECK';

// ─── Bookmarks ────────────────────────────────────────────────────────────────
// Fire a notification once the user hits this count
export const BOOKMARK_MILESTONE = 5;

// ─── UI ───────────────────────────────────────────────────────────────────────
export const SNACKBAR_DURATION_MS = 3000;
export const DEBOUNCE_SEARCH_MS = 350;
export const SKELETON_COUNT = 6;