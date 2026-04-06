import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { signInUser, logoutUser } from '@/features/Auth/authThunks';
import { AuthState } from '@/types';
import { storage } from '@/utils/storage';

const initialState: AuthState = {
  token: storage.getAuthToken(),
  loading: false,
  error: null,
  isAuthenticated: !!storage.getAuthToken(),
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
      state.isAuthenticated = true;
      storage.setAuthToken(action.payload);
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    clearAuth: (state) => {
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      storage.removeAuthToken();
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signInUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signInUser.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        storage.setAuthToken(action.payload.token);
      })
      .addCase(signInUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Sign in failed';
        state.isAuthenticated = false;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.token = null;
        state.isAuthenticated = false;
        state.error = null;
      });
  },
});

export const { setLoading, setToken, setError, clearAuth, clearError } = authSlice.actions;
export default authSlice.reducer;
