import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { AuthState, UserProfile } from '@/types';

const initialState: AuthState = {
  token: localStorage.getItem('authToken'),
  user: null,
  loading: false,
  error: null,
  isAuthenticated: !!localStorage.getItem('authToken'),
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
      localStorage.setItem('authToken', action.payload);
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
      localStorage.removeItem('authToken');
    },
  },
});

export const { setLoading, setToken, setUser, setError, clearAuth } = authSlice.actions;
export default authSlice.reducer;
