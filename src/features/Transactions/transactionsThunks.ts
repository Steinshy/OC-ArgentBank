import { createAsyncThunk } from '@reduxjs/toolkit';

import { MOCK_ACCOUNTS } from '@/mocks/accounts';
import { Transaction } from '@/types';

export const fetchTransactions = createAsyncThunk<{ accountId: string; transactions: Transaction[] }, string, { rejectValue: string }>(
  'transactions/fetchTransactions',
  async (accountId, { rejectWithValue }) => {
    const account = MOCK_ACCOUNTS.find((a) => a.id === accountId);
    if (!account) {
      return rejectWithValue(`Account ${accountId} not found`);
    }
    const transactions = structuredClone(account.transactions ?? []);
    return { accountId, transactions };
  }
);
