import { configureStore } from '@reduxjs/toolkit';
import { useDispatch as useReduxDispatch, useSelector as useReduxSelector, TypedUseSelectorHook } from 'react-redux';

import authReducer from '@/features/Auth/authSlice';
import transactionsReducer from '@/features/Transactions/transactionsSlice';
import { argentBankApi } from '@/api/argentBankApi';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    transactions: transactionsReducer,
    [argentBankApi.reducerPath]: argentBankApi.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(argentBankApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useReduxDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useReduxSelector;
