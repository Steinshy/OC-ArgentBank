import { createAsyncThunk } from '@reduxjs/toolkit';

import { apiCall } from '@/api/client';
import { argentBankApi } from '@/api/argentBankApi';
import { mockAuthApi } from '@/mocks';
import { SignInRequest, SignUpRequest, SignInResponse, SignUpResponse } from '@/types';
import { extractErrorMessage, ERROR_MESSAGES } from '@/utils/errorHandler';
import { USE_MOCK, API_ENDPOINTS } from '@/constants';
import { storage } from '@/utils/storage';
import type { AppDispatch } from '@/store/store';

export const signInUser = createAsyncThunk<{ token: string }, SignInRequest, { rejectValue: string }>('auth/signInUser', async (credentials, { rejectWithValue }) => {
  try {
    const response = USE_MOCK ? await mockAuthApi.signIn(credentials) : await apiCall<SignInResponse>(API_ENDPOINTS.AUTH_LOGIN, { method: 'POST', body: JSON.stringify(credentials) });
    return { token: response.body.token };
  } catch (error) {
    return rejectWithValue(extractErrorMessage(error, ERROR_MESSAGES.SIGN_IN_FAILED));
  }
});

export const signUpUser = createAsyncThunk<{ token: string }, SignUpRequest, { rejectValue: string }>('auth/signUpUser', async (data, { rejectWithValue }) => {
  try {
    const response = USE_MOCK ? await mockAuthApi.signUp(data) : await apiCall<SignUpResponse>(API_ENDPOINTS.AUTH_SIGNUP, { method: 'POST', body: JSON.stringify(data) });
    return { token: response.body.token };
  } catch (error) {
    return rejectWithValue(extractErrorMessage(error, ERROR_MESSAGES.SIGN_UP_FAILED));
  }
});

export const logoutUser = createAsyncThunk<void, void, { dispatch: AppDispatch }>('auth/logoutUser', async (_arg, { dispatch }) => {
  storage.removeAuthToken();
  dispatch(argentBankApi.util.resetApiState());
});
