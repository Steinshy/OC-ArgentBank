import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { MESSAGES } from '@/constants';
import { fetchTransactions } from '@/features/Transactions/transactionsThunks';
import { updateMockTransaction } from '@/mocks/accounts';
import { TransactionState } from '@/types';

const initialState: TransactionState = {
  currentAccountId: null,
  transactions: [],
  loading: false,
  error: null,
};

const transactionsSlice = createSlice({
  name: 'transactions',
  initialState,
  reducers: {
    clearTransactions: (state) => {
      state.currentAccountId = null;
      state.transactions = [];
      state.error = null;
    },
    updateTransaction: (state, action: PayloadAction<{ id: string; category?: string; notes?: string }>) => {
      const { id, category, notes } = action.payload;
      const tx = state.transactions.find((t) => t.id === id);
      if (tx) {
        if (category !== undefined) tx.category = category;
        if (notes !== undefined) tx.notes = notes;
      }

      if (state.currentAccountId) {
        updateMockTransaction(state.currentAccountId, id, { category, notes });
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTransactions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTransactions.fulfilled, (state, action) => {
        state.loading = false;
        state.transactions = action.payload.transactions;
        state.currentAccountId = action.payload.accountId;
      })
      .addCase(fetchTransactions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? MESSAGES.LOADING_TRANSACTIONS;
      });
  },
});

export const { clearTransactions, updateTransaction } = transactionsSlice.actions;
export default transactionsSlice.reducer;
