
export const SECURE_STORE_KEYS = {
  ACCESS_TOKEN: 'lms_access_token',
  REFRESH_TOKEN: 'lms_refresh_token',
} as const;


export const ASYNC_STORAGE_KEYS = {
  BOOKMARKS: 'lms_bookmarks',
  ENROLLED_COURSES: 'lms_enrolled_courses',
  USER_PREFERENCES: 'lms_user_preferences',
  LAST_ACTIVE_AT: 'lms_last_active_at',
  COURSES_CACHE: 'lms_courses_cache',
  COURSES_CACHE_TTL: 'lms_courses_cache_ttl',
  INSTRUCTORS_CACHE: 'lms_instructors_cache',
} as const;

export type SecureStoreKey =
  (typeof SECURE_STORE_KEYS)[keyof typeof SECURE_STORE_KEYS];
export type AsyncStorageKey =
  (typeof ASYNC_STORAGE_KEYS)[keyof typeof ASYNC_STORAGE_KEYS];