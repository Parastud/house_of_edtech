import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  isAuthorized: boolean;
  isBootstrapping: boolean; // true while checking stored token on app start
}

const initialState: AuthState = {
  isAuthorized: false,
  isBootstrapping: true,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthorizationStatus(state, action: PayloadAction<boolean>) {
      state.isAuthorized = action.payload;
    },
    setBootstrapping(state, action: PayloadAction<boolean>) {
      state.isBootstrapping = action.payload;
    },
    logout(state) {
      state.isAuthorized = false;
    },
  },
});

export const { setAuthorizationStatus, setBootstrapping, logout } =
  authSlice.actions;
export default authSlice.reducer;