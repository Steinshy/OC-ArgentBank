import { createAsyncThunk } from '@reduxjs/toolkit';

import { authApi } from '@/api/auth';
import { argentBankApi } from '@/api/argentBankApi';
import { SignInRequest, SignUpRequest } from '@/types';
import { extractErrorMessage, ERROR_MESSAGES } from '@/utils/errorHandler';
import { storage } from '@/utils/storage';
import type { AppDispatch } from '@/store/store';

export const signInUser = createAsyncThunk<{ token: string }, SignInRequest, { rejectValue: string }>('auth/signInUser', async (credentials, { rejectWithValue }) => {
  try {
    const response = await authApi.signIn(credentials);
    return { token: response.body.token };
  } catch (error) {
    const errorMessage = extractErrorMessage(error, ERROR_MESSAGES.SIGN_IN_FAILED);
    return rejectWithValue(errorMessage);
  }
});

export const signUpUser = createAsyncThunk<{ token: string }, SignUpRequest, { rejectValue: string }>(
  'auth/signUpUser',
  async (data, { rejectWithValue }) => {
    try {
      const response = await authApi.signUp(data);
      return { token: response.body.token };
    } catch (error) {
      return rejectWithValue(extractErrorMessage(error, ERROR_MESSAGES.SIGN_UP_FAILED));
    }
  }
);

export const logoutUser = createAsyncThunk<void, void, { dispatch: AppDispatch }>('auth/logoutUser', async (_arg, { dispatch }) => {
  storage.removeAuthToken();
  dispatch(argentBankApi.util.resetApiState());
});
