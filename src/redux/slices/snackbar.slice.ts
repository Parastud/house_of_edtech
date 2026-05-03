import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type SnackbarType = 'success' | 'error' | 'info';

interface SnackbarState {
  visible: boolean;
  message: string;
  type: SnackbarType;
}

const initialState: SnackbarState = {
  visible: false,
  message: '',
  type: 'info',
};

const snackbarSlice = createSlice({
  name: 'snackbar',
  initialState,
  reducers: {
    showSnackbarSuccess(state, action: PayloadAction<{ message: string }>) {
      state.visible = true;
      state.message = action.payload.message;
      state.type = 'success';
    },
    showSnackbarError(state, action: PayloadAction<{ message: string }>) {
      state.visible = true;
      state.message = action.payload.message;
      state.type = 'error';
    },
    showSnackbarInfo(state, action: PayloadAction<{ message: string }>) {
      state.visible = true;
      state.message = action.payload.message;
      state.type = 'info';
    },
    hideSnackbar(state) {
      state.visible = false;
    },
  },
});

export const {
  showSnackbarSuccess,
  showSnackbarError,
  showSnackbarInfo,
  hideSnackbar,
} = snackbarSlice.actions;
export default snackbarSlice.reducer;