import { Course, CoursesState } from '@/src/types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: CoursesState = {
  items: [],
  page: 1,
  hasNextPage: false,
  isLoading: false,
  isRefreshing: false,
  isFetchingMore: false,
  error: null,
  filters: {
    search: '',
    category: null,
  },
  lastFetchedAt: null,
};

const courseSlice = createSlice({
  name: 'courses',
  initialState,
  reducers: {
    fetchCoursesStart(state) {
      state.isLoading = true;
      state.error = null;
    },
    fetchCoursesSuccess(
      state,
      action: PayloadAction<{ items: Course[]; hasNextPage: boolean; page: number }>,
    ) {
      state.isLoading = false;
      state.isRefreshing = false;
      state.items = action.payload.items;
      state.hasNextPage = action.payload.hasNextPage;
      state.page = action.payload.page;
      state.lastFetchedAt = Date.now();
      state.error = null;
    },
    fetchCoursesFailure(state, action: PayloadAction<string>) {
      state.isLoading = false;
      state.isRefreshing = false;
      state.isFetchingMore = false;
      state.error = action.payload;
    },
    fetchMoreCoursesStart(state) {
      state.isFetchingMore = true;
    },
    fetchMoreCoursesSuccess(
      state,
      action: PayloadAction<{ items: Course[]; hasNextPage: boolean; page: number }>,
    ) {
      state.isFetchingMore = false;
      // Avoid duplicates by id
      const existingIds = new Set(state.items.map((c) => c.id));
      const newItems = action.payload.items.filter(
        (c) => !existingIds.has(c.id),
      );
      state.items = [...state.items, ...newItems];
      state.hasNextPage = action.payload.hasNextPage;
      state.page = action.payload.page;
    },
    refreshCoursesStart(state) {
      state.isRefreshing = true;
      state.error = null;
    },
    setSearch(state, action: PayloadAction<string>) {
      state.filters.search = action.payload;
    },
    setCategory(state, action: PayloadAction<string | null>) {
      state.filters.category = action.payload;
    },
    updateCourseBookmark(
      state,
      action: PayloadAction<{ courseId: string; isBookmarked: boolean }>,
    ) {
      const course = state.items.find((c) => c.id === action.payload.courseId);
      if (course) course.isBookmarked = action.payload.isBookmarked;
    },
    updateCourseEnrollment(
      state,
      action: PayloadAction<{ courseId: string; isEnrolled: boolean }>,
    ) {
      const course = state.items.find((c) => c.id === action.payload.courseId);
      if (course) course.isEnrolled = action.payload.isEnrolled;
    },
    clearCourses() {
      return initialState;
    },
  },
});

export const {
  fetchCoursesStart,
  fetchCoursesSuccess,
  fetchCoursesFailure,
  fetchMoreCoursesStart,
  fetchMoreCoursesSuccess,
  refreshCoursesStart,
  setSearch,
  setCategory,
  updateCourseBookmark,
  updateCourseEnrollment,
  clearCourses,
} = courseSlice.actions;
export default courseSlice.reducer;