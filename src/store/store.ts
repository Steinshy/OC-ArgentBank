import { configureStore } from '@reduxjs/toolkit';
import type { TypedUseSelectorHook } from 'react-redux';
import { useDispatch as useReduxDispatch, useSelector as useReduxSelector } from 'react-redux';

import { argentBankApi } from '@/api/argentBankApi';
import authReducer from '@/features/Auth/authSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [argentBankApi.reducerPath]: argentBankApi.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(argentBankApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useReduxDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useReduxSelector;
