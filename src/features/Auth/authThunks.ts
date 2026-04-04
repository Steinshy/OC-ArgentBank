import { createAsyncThunk } from '@reduxjs/toolkit';

import { authApi } from '@/api/auth';
import { SignInRequest, UserProfile } from '@/types';
import { extractErrorMessage, ERROR_MESSAGES } from '@/utils/errorHandler';
import { storage } from '@/utils/storage';

export const signInUser = createAsyncThunk<{ token: string }, SignInRequest, { rejectValue: string }>('auth/signInUser', async (credentials, { rejectWithValue }) => {
  try {
    const response = await authApi.signIn(credentials);
    return { token: response.body.token };
  } catch (error) {
    const errorMessage = extractErrorMessage(error, ERROR_MESSAGES.SIGN_IN_FAILED);
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
    const errorMessage = extractErrorMessage(error, ERROR_MESSAGES.PROFILE_FETCH_FAILED);
    return rejectWithValue(errorMessage);
  }
});

export const updateUserProfile = createAsyncThunk<UserProfile, { token: string; firstName: string; lastName: string }, { rejectValue: string }>(
  'auth/updateUserProfile',
  async ({ token, firstName, lastName }, { rejectWithValue }) => {
    try {
      const response = await authApi.updateProfile(token, { firstName, lastName });
      return response.body;
    } catch (error) {
      const errorMessage = extractErrorMessage(error, ERROR_MESSAGES.PROFILE_UPDATE_FAILED);
      return rejectWithValue(errorMessage);
    }
  }
);

export const logoutUser = createAsyncThunk<void>('auth/logoutUser', async () => {
  // Perform any cleanup if needed
  storage.removeAuthToken();
});
