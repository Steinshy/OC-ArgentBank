import { createAsyncThunk } from '@reduxjs/toolkit';

import { argentBankApi } from '@/api/argentBankApi';
import { apiCall } from '@/api/client';
import { API_ENDPOINTS } from '@/constants';
import type { AppDispatch } from '@/store/store';
import type { SignInRequest, SignUpRequest, AuthTokenResponse } from '@/types';
import { extractErrorMessage, ERROR_MESSAGES } from '@/utils/errorHandler';
import { storage } from '@/utils/storage';

export const signInUser = createAsyncThunk<{ token: string }, SignInRequest, { rejectValue: string }>('auth/signInUser', async (credentials, { rejectWithValue }) => {
  try {
    const response = await apiCall<AuthTokenResponse>(API_ENDPOINTS.AUTH_LOGIN, { method: 'POST', body: JSON.stringify(credentials) });
    return { token: response.body.token };
  } catch (error) {
    return rejectWithValue(extractErrorMessage(error, ERROR_MESSAGES.SIGNIN_FAILED));
  }
});

export const signUpUser = createAsyncThunk<{ token: string }, SignUpRequest, { rejectValue: string }>('auth/signUpUser', async (data, { rejectWithValue }) => {
  try {
    const response = await apiCall<{ status: number; message: string; body: { token?: string } }>(API_ENDPOINTS.AUTH_SIGNUP, {
      method: 'POST',
      body: JSON.stringify(data),
    });

    const tokenFromSignup = response.body.token;
    if (tokenFromSignup) {
      return { token: tokenFromSignup };
    }

    const loginResponse = await apiCall<AuthTokenResponse>(API_ENDPOINTS.AUTH_LOGIN, {
      method: 'POST',
      body: JSON.stringify({ email: data.email, password: data.password }),
    });
    return { token: loginResponse.body.token };
  } catch (error) {
    return rejectWithValue(extractErrorMessage(error, ERROR_MESSAGES.SIGNUP_FAILED));
  }
});

export const logoutUser = createAsyncThunk<void, void, { dispatch: AppDispatch }>('auth/logoutUser', async (_arg, { dispatch }) => {
  storage.removeAuthToken();
  storage.setStrategy('session');
  dispatch(argentBankApi.util.resetApiState());
});
