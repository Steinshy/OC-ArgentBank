import { createAsyncThunk } from '@reduxjs/toolkit';

import { authApi } from '@/services/authApi';
import { LoginRequest, UserProfile } from '@/types';

export const loginUser = createAsyncThunk<
  { token: string },
  LoginRequest,
  { rejectValue: string }
>('auth/loginUser', async (credentials, { rejectWithValue }) => {
  try {
    const response = await authApi.login(credentials);
    return { token: response.body.token };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Login failed';
    return rejectWithValue(errorMessage);
  }
});

export const fetchUserProfile = createAsyncThunk<
  UserProfile,
  string, // token
  { rejectValue: string }
>('auth/fetchUserProfile', async (token, { rejectWithValue }) => {
  try {
    const response = await authApi.getProfile(token);
    return response.body;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch profile';
    return rejectWithValue(errorMessage);
  }
});

export const logoutUser = createAsyncThunk<void>('auth/logoutUser', async () => {
  // Perform any cleanup if needed
  localStorage.removeItem('authToken');
});
