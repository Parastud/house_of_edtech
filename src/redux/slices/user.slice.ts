import { UserState } from '@/src/types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: UserState = {
  id: null,
  username: '',
  email: '',
  avatarUrl: '',
  isEmailVerified: false,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<Partial<UserState>>) {
      return { ...state, ...action.payload };
    },
    updateAvatar(state, action: PayloadAction<string>) {
      state.avatarUrl = action.payload;
    },
    clearUser() {
      return initialState;
    },
  },
});

export const { setUser, updateAvatar, clearUser } = userSlice.actions;
export default userSlice.reducer;