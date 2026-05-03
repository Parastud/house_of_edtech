import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { saveBookmarks } from '../../utils/localStorageKey';

interface BookmarkState {
  ids: string[];
  milestoneNotified: boolean; // prevents double-firing the 5-bookmark notification
}

const initialState: BookmarkState = {
  ids: [],
  milestoneNotified: false,
};

const bookmarkSlice = createSlice({
  name: 'bookmarks',
  initialState,
  reducers: {
    // Hydrate from AsyncStorage on app boot
    hydrateBookmarks(state, action: PayloadAction<string[]>) {
      state.ids = action.payload;
    },

    addBookmark(state, action: PayloadAction<string>) {
      if (!state.ids.includes(action.payload)) {
        state.ids.push(action.payload);
        // Persist side-effect — fire-and-forget
        saveBookmarks(state.ids).catch(() => {});
      }
    },

    removeBookmark(state, action: PayloadAction<string>) {
      state.ids = state.ids.filter((id) => id !== action.payload);
      saveBookmarks(state.ids).catch(() => {});
    },

    toggleBookmark(state, action: PayloadAction<string>) {
      const id = action.payload;
      const exists = state.ids.includes(id);
      if (exists) {
        state.ids = state.ids.filter((b) => b !== id);
      } else {
        state.ids.push(id);
      }
      saveBookmarks(state.ids).catch(() => {});
    },

    setMilestoneNotified(state, action: PayloadAction<boolean>) {
      state.milestoneNotified = action.payload;
    },

    clearBookmarks(state) {
      state.ids = [];
      state.milestoneNotified = false;
      saveBookmarks([]).catch(() => {});
    },
  },
});

export const {
  hydrateBookmarks,
  addBookmark,
  removeBookmark,
  toggleBookmark,
  setMilestoneNotified,
  clearBookmarks,
} = bookmarkSlice.actions;
export default bookmarkSlice.reducer;