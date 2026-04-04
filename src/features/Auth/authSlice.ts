import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { signInUser, fetchUserProfile, updateUserProfile, logoutUser } from '@/features/Auth/authThunks';
import { AuthState, UserProfile } from '@/types';
import { storage } from '@/utils/storage';

const initialState: AuthState = {
  token: storage.getAuthToken(),
  user: null,
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
    setUser: (state, action: PayloadAction<UserProfile>) => {
      state.user = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    clearAuth: (state) => {
      state.token = null;
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
      storage.removeAuthToken();
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Sign-in thunk
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
      });

    // Fetch profile thunk
    builder
      .addCase(fetchUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch profile';
        state.token = null;
        state.user = null;
        state.isAuthenticated = false;
        storage.removeAuthToken();
      });

    // Update profile thunk
    builder
      .addCase(updateUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to update profile';
      });

    // Logout thunk
    builder.addCase(logoutUser.fulfilled, (state) => {
      state.token = null;
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
    });
  },
});

export const { setLoading, setToken, setUser, setError, clearAuth, clearError } = authSlice.actions;
export default authSlice.reducer;
