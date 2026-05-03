import {
  hydrateBookmarks,
  toggleBookmark,
} from '@/src/redux/slices/bookmark.slice';
import {
  updateCourseBookmark,
} from '@/src/redux/slices/course.slice';
import {
  showSnackbarInfo,
  showSnackbarSuccess,
} from '@/src/redux/slices/snackbar.slice';
import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../redux/hook';
import { requestNotificationPermission } from '../services';
import { loadBookmarks } from '../utils/localStorageKey';

export const useBookmarks = () => {
  const dispatch = useAppDispatch();
  const bookmarkIds = useAppSelector((s) => s.bookmarks.ids);

  // Called once on app boot to restore persisted bookmarks
  const hydrateFromStorage = useCallback(async (): Promise<void> => {
    const ids = await loadBookmarks();
    dispatch(hydrateBookmarks(ids));
  }, [dispatch]);

  const toggle = useCallback(
    async (courseId: string, courseTitle: string): Promise<void> => {
      // Ensure notification permission when user first bookmarks
      await requestNotificationPermission().catch(() => {});

      const isCurrentlyBookmarked = bookmarkIds.includes(courseId);
      dispatch(toggleBookmark(courseId));
      // Keep course list in sync
      dispatch(
        updateCourseBookmark({
          courseId,
          isBookmarked: !isCurrentlyBookmarked,
        }),
      );

      if (!isCurrentlyBookmarked) {
        dispatch(
          showSnackbarSuccess({ message: `"${courseTitle}" bookmarked!` }),
        );
      } else {
        dispatch(
          showSnackbarInfo({ message: `"${courseTitle}" removed from bookmarks` }),
        );
      }
    },
    [dispatch, bookmarkIds],
  );

  const isBookmarked = useCallback(
    (courseId: string): boolean => bookmarkIds.includes(courseId),
    [bookmarkIds],
  );

  return { bookmarkIds, toggle, isBookmarked, hydrateFromStorage };
};