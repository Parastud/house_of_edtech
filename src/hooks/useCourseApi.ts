import { COURSES_CACHE_TTL_MS, PAGE_SIZE } from '@/src/constants/app.constants';
import {
  fetchCoursesFailure,
  fetchCoursesStart,
  fetchCoursesSuccess,
  fetchMoreCoursesStart,
  fetchMoreCoursesSuccess,
  refreshCoursesStart,
} from '@/src/redux/slices/course.slice';
import {
  showSnackbarError,
} from '@/src/redux/slices/snackbar.slice';
import {
  fetchInstructorsService,
  fetchProductsService,
} from '@/src/services';
import { Course } from '@/src/types';
import {
  getErrorMessage,
  isCacheExpired,
  normalizeCourse,
  normalizeInstructor
} from '@/src/utils/utils';
import { useCallback, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '../redux/hook';
import {
  loadCoursesCache,
  loadCoursesCacheTTL,
  saveCoursesCache,
} from '../utils/localStorageKey';

export const useCourseApi = () => {
  const dispatch = useAppDispatch();
  const bookmarkIds = useAppSelector((s) => s.bookmarks.ids);
  const courseItems = useAppSelector((s) => s.courses.items);

  const enrolledIds = useMemo(() => {
    return courseItems.filter((c: Course) => c.isEnrolled).map((c: Course) => c.id);
  }, [courseItems]);
  const { page, hasNextPage, isFetchingMore, isLoading } = useAppSelector(
    (s) => s.courses,
  );

  // ── Core fetch logic ────────────────────────────────────────────────────
  const buildCourses = useCallback(
    async (pageNum: number): Promise<{ items: Course[]; hasNextPage: boolean; page: number }> => {
      const [productsRes, usersRes] = await Promise.all([
        fetchProductsService({ page: pageNum, limit: PAGE_SIZE }),
        fetchInstructorsService({ page: pageNum, limit: PAGE_SIZE }),
      ]);

      const instructors = usersRes.data.data.map(normalizeInstructor);
      const items = productsRes.data.data.map((product: any, index: number) => {
        const instructor = instructors[index % instructors.length];
        return normalizeCourse(product, instructor, bookmarkIds, enrolledIds);
      });

      return {
        items,
        hasNextPage: productsRes.data.hasNextPage,
        page: pageNum,
      };
    },
    [bookmarkIds, enrolledIds],
  );

  // ── Initial load — checks cache first ──────────────────────────────────
  const fetchCourses = useCallback(async (): Promise<void> => {
    try {
      dispatch(fetchCoursesStart());

      // Check if we have a fresh cache
      const cachedAt = await loadCoursesCacheTTL();
      if (!isCacheExpired(cachedAt, COURSES_CACHE_TTL_MS)) {
        const cached = await loadCoursesCache<Course[]>();
        if (cached && cached.length > 0) {
          dispatch(
            fetchCoursesSuccess({ items: cached, hasNextPage: true, page: 1 }),
          );
          return;
        }
      }

      const result = await buildCourses(1);
      await saveCoursesCache(result.items);
      dispatch(fetchCoursesSuccess(result));
    } catch (error) {
      const msg = getErrorMessage(error);
      dispatch(fetchCoursesFailure(msg));
      dispatch(showSnackbarError({ message: msg }));
    }
  }, [dispatch, buildCourses]);

  // ── Pull-to-refresh — always bypasses cache ─────────────────────────────
  const refreshCourses = useCallback(async (): Promise<void> => {
    try {
      dispatch(refreshCoursesStart());
      const result = await buildCourses(1);
      await saveCoursesCache(result.items);
      dispatch(fetchCoursesSuccess(result));
    } catch (error) {
      const msg = getErrorMessage(error);
      dispatch(fetchCoursesFailure(msg));
      dispatch(showSnackbarError({ message: msg }));
    }
  }, [dispatch, buildCourses]);

  // ── Pagination — appends next page ─────────────────────────────────────
  const fetchMoreCourses = useCallback(async (): Promise<void> => {
    if (isFetchingMore || isLoading || !hasNextPage) return;

    try {
      dispatch(fetchMoreCoursesStart());
      const nextPage = page + 1;
      const result = await buildCourses(nextPage);
      dispatch(fetchMoreCoursesSuccess(result));
    } catch (error) {
      dispatch(
        fetchCoursesFailure(getErrorMessage(error)),
      );
    }
  }, [dispatch, buildCourses, page, hasNextPage, isFetchingMore, isLoading]);

  return { fetchCourses, refreshCourses, fetchMoreCourses };
};