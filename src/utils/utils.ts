import { AxiosError } from 'axios';
import { Course, Instructor, RawProduct, RawUser } from '../types';

// ─── Error extraction ─────────────────────────────────────────────────────────

export const getErrorMessage = (error: unknown): string => {
  if (error instanceof AxiosError) {
    // Prefer server-sent message
    const serverMsg =
      error.response?.data?.message ||
      error.response?.data?.error;
    if (serverMsg && typeof serverMsg === 'string') return serverMsg;

    if (error.code === 'ECONNABORTED') return 'Request timed out. Please try again.';
    if (error.code === 'ERR_NETWORK') return 'No internet connection.';
    if (error.response?.status === 401) return 'Session expired. Please log in again.';
    if (error.response?.status === 404) return 'Resource not found.';
    if (error.response?.status === 429) return 'Too many requests. Please slow down.';
    if ((error.response?.status ?? 0) >= 500) return 'Server error. Please try again later.';
  }

  if (error instanceof Error) return error.message;
  return 'Something went wrong. Please try again.';
};

// ─── Data normalizers ─────────────────────────────────────────────────────────

export const normalizeInstructor = (raw: RawUser): Instructor => ({
  id: raw.login?.uuid ?? String(raw.id),
  name: `${raw.name.first} ${raw.name.last}`,
  email: raw.email,
  avatarUrl: raw.picture.large,
  location: `${raw.location.city}, ${raw.location.country}`,
});

export const normalizeCourse = (
  raw: RawProduct,
  instructor: Instructor,
  bookmarkedIds: string[],
  enrolledIds: string[],
): Course => {
  const id = String(raw.id);
  return {
    id,
    title: raw.title,
    description: raw.description,
    price: raw.price,
    discountPercentage: raw.discountPercentage,
    rating: raw.rating,
    category: raw.category,
    brand: raw.brand,
    thumbnailUrl: raw.thumbnail,
    images: raw.images,
    instructor,
    isBookmarked: bookmarkedIds.includes(id),
    isEnrolled: enrolledIds.includes(id),
  };
};

// ─── Formatters ───────────────────────────────────────────────────────────────

export const formatPrice = (price: number, discount: number): string => {
  const final = price - (price * discount) / 100;
  return `$${final.toFixed(2)}`;
};

export const formatRating = (rating: number): string => rating.toFixed(1);

// ─── Debounce ─────────────────────────────────────────────────────────────────

export const debounce = <T extends (...args: unknown[]) => void>(
  fn: T,
  delay: number,
): ((...args: Parameters<T>) => void) => {
  let timer: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
};

// ─── Cache helpers ────────────────────────────────────────────────────────────

export const isCacheExpired = (
  cachedAt: number | null,
  ttlMs: number,
): boolean => {
  if (!cachedAt) return true;
  return Date.now() - cachedAt > ttlMs;
};

export const JSON_OBJ_LOG = (value: any) => {
  console.log(JSON.stringify(value, null, 2));
};
