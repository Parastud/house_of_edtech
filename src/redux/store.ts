import { BOOKMARK_MILESTONE } from '@/src/constants/app.constants';
import {
  scheduleBookmarkMilestoneNotification,
} from '@/src/services/notification.service';
import { configureStore, Middleware } from '@reduxjs/toolkit';
import aiMentorReducer from './slices/aiMentor.slice';
import authReducer from './slices/auth.slice';
import bookmarkReducer, {
  addBookmark,
  setMilestoneNotified,
  toggleBookmark,
} from './slices/bookmark.slice';
import courseReducer from './slices/course.slice';
import networkReducer from './slices/network.slice';
import snackbarReducer from './slices/snackbar.slice';
import userReducer from './slices/user.slice';

// ─── Bookmark Milestone Middleware ────────────────────────────────────────────
// Watches for bookmark add actions and fires a notification at the threshold.
// Using middleware keeps this logic out of components and hooks.
const bookmarkMilestoneMiddleware: Middleware =
  (store) => (next) => (action) => {
    const result = next(action);

    if (
      toggleBookmark.match(action) ||
      addBookmark.match(action)
    ) {
      const state = store.getState() as RootState;
      const { ids, milestoneNotified } = state.bookmarks;

      if (ids.length >= BOOKMARK_MILESTONE && !milestoneNotified) {
        store.dispatch(setMilestoneNotified(true));
        scheduleBookmarkMilestoneNotification().catch(() => {});
      }
    }

    return result;
  };

// ─── Store ────────────────────────────────────────────────────────────────────
export const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    snackbar: snackbarReducer,
    bookmarks: bookmarkReducer,
    courses: courseReducer,
    network: networkReducer,
    aiMentor: aiMentorReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action paths for serializable check
        ignoredActions: ['bookmarks/hydrateBookmarks'],
      },
    }).concat(bookmarkMilestoneMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;