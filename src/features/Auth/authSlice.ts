import { createSlice } from '@reduxjs/toolkit';

import { signInUser, signUpUser, logoutUser } from '@/features/Auth/authThunks';
import { AuthState } from '@/types';
import { storage } from '@/utils/storage';

const initializeAuthState = (): AuthState => {
  const detectedStrategy = storage.detectTokenLocation();
  storage.setStrategy(detectedStrategy);
  const token = storage.getAuthToken();
  return {
    token,
    loading: false,
    error: null,
    isAuthenticated: !!token,
  };
};

const initialState: AuthState = initializeAuthState();

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
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
        const { token } = action.payload;
        if (token) {
          state.token = token;
          state.isAuthenticated = true;
          storage.setAuthToken(token);
        } else {
          state.isAuthenticated = false;
        }
      })
      .addCase(signInUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Sign in failed';
        state.isAuthenticated = false;
      })
      .addCase(signUpUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signUpUser.fulfilled, (state, action) => {
        state.loading = false;
        const { token } = action.payload;
        if (token) {
          state.token = token;
          state.isAuthenticated = true;
          storage.setAuthToken(token);
        } else {
          state.isAuthenticated = false;
        }
      })
      .addCase(signUpUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Registration failed';
        state.isAuthenticated = false;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.token = null;
        state.isAuthenticated = false;
        state.error = null;
      });
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;
