import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { TransactionState } from '@/types';

const initialState: TransactionState = {
  currentAccountId: null,
};

const transactionsSlice = createSlice({
  name: 'transactions',
  initialState,
  reducers: {
    setCurrentAccountId: (state, action: PayloadAction<string | null>) => {
      state.currentAccountId = action.payload;
    },
    clearTransactions: (state) => {
      state.currentAccountId = null;
    },
  },
});

export const { setCurrentAccountId, clearTransactions } = transactionsSlice.actions;
export default transactionsSlice.reducer;
