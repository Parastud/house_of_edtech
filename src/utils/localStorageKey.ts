import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { ASYNC_STORAGE_KEYS, SECURE_STORE_KEYS } from '../constants/storage.keys';

// ─── SecureStore — tokens ─────────────────────────────────────────────────────

export const saveAccessToken = async (token: string): Promise<void> => {
  await SecureStore.setItemAsync(SECURE_STORE_KEYS.ACCESS_TOKEN, token);
};

export const getAccessToken = async (): Promise<string | null> => {
  return SecureStore.getItemAsync(SECURE_STORE_KEYS.ACCESS_TOKEN);
};

export const saveRefreshToken = async (token: string): Promise<void> => {
  await SecureStore.setItemAsync(SECURE_STORE_KEYS.REFRESH_TOKEN, token);
};

export const getRefreshToken = async (): Promise<string | null> => {
  return SecureStore.getItemAsync(SECURE_STORE_KEYS.REFRESH_TOKEN);
};

export const clearAuthTokens = async (): Promise<void> => {
  await Promise.all([
    SecureStore.deleteItemAsync(SECURE_STORE_KEYS.ACCESS_TOKEN),
    SecureStore.deleteItemAsync(SECURE_STORE_KEYS.REFRESH_TOKEN),
  ]);
};

// ─── AsyncStorage — app data ──────────────────────────────────────────────────

export const saveBookmarks = async (ids: string[]): Promise<void> => {
  await AsyncStorage.setItem(
    ASYNC_STORAGE_KEYS.BOOKMARKS,
    JSON.stringify(ids),
  );
};

export const loadBookmarks = async (): Promise<string[]> => {
  const raw = await AsyncStorage.getItem(ASYNC_STORAGE_KEYS.BOOKMARKS);
  return raw ? (JSON.parse(raw) as string[]) : [];
};

export const saveEnrolledCourses = async (ids: string[]): Promise<void> => {
  await AsyncStorage.setItem(
    ASYNC_STORAGE_KEYS.ENROLLED_COURSES,
    JSON.stringify(ids),
  );
};

export const loadEnrolledCourses = async (): Promise<string[]> => {
  const raw = await AsyncStorage.getItem(ASYNC_STORAGE_KEYS.ENROLLED_COURSES);
  return raw ? (JSON.parse(raw) as string[]) : [];
};

export const saveLastActiveAt = async (): Promise<void> => {
  await AsyncStorage.setItem(
    ASYNC_STORAGE_KEYS.LAST_ACTIVE_AT,
    Date.now().toString(),
  );
};

export const loadLastActiveAt = async (): Promise<number | null> => {
  const raw = await AsyncStorage.getItem(ASYNC_STORAGE_KEYS.LAST_ACTIVE_AT);
  return raw ? parseInt(raw, 10) : null;
};

export const saveCoursesCache = async <T>(data: T): Promise<void> => {
  await AsyncStorage.setItem(
    ASYNC_STORAGE_KEYS.COURSES_CACHE,
    JSON.stringify(data),
  );
  await AsyncStorage.setItem(
    ASYNC_STORAGE_KEYS.COURSES_CACHE_TTL,
    Date.now().toString(),
  );
};

export const loadCoursesCache = async <T>(): Promise<T | null> => {
  const raw = await AsyncStorage.getItem(ASYNC_STORAGE_KEYS.COURSES_CACHE);
  return raw ? (JSON.parse(raw) as T) : null;
};

export const loadCoursesCacheTTL = async (): Promise<number | null> => {
  const raw = await AsyncStorage.getItem(ASYNC_STORAGE_KEYS.COURSES_CACHE_TTL);
  return raw ? parseInt(raw, 10) : null;
};

export const clearAppData = async (): Promise<void> => {
  await AsyncStorage.multiRemove([
    ASYNC_STORAGE_KEYS.BOOKMARKS,
    ASYNC_STORAGE_KEYS.ENROLLED_COURSES,
    ASYNC_STORAGE_KEYS.USER_PREFERENCES,
    ASYNC_STORAGE_KEYS.COURSES_CACHE,
    ASYNC_STORAGE_KEYS.COURSES_CACHE_TTL,
  ]);
};