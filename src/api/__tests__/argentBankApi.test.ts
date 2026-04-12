import { configureStore } from '@reduxjs/toolkit';

import authReducer from '@/features/Auth/authSlice';
import { argentBankApi } from '@/api/argentBankApi';

describe('argentBankApi mock-mode queries', () => {
  const buildStore = () =>
    configureStore({
      reducer: {
        auth: authReducer,
        [argentBankApi.reducerPath]: argentBankApi.reducer,
      },
      middleware: (getDefault) => getDefault().concat(argentBankApi.middleware),
    });

  it('getAccounts query completes without throwing', async () => {
    const store = buildStore();
    const result = await store.dispatch(argentBankApi.endpoints.getAccounts.initiate());
    expect(result).toBeDefined();
  });

  it('exposes the expected hook set', () => {
    expect(typeof argentBankApi.endpoints.getAccounts.initiate).toBe('function');
    expect(typeof argentBankApi.endpoints.getTransactions.initiate).toBe('function');
    expect(typeof argentBankApi.endpoints.getProfile.initiate).toBe('function');
    expect(typeof argentBankApi.endpoints.updateProfile.initiate).toBe('function');
    expect(typeof argentBankApi.endpoints.patchTransaction.initiate).toBe('function');
  });

  it('resets API state cleanly', () => {
    const store = buildStore();
    expect(() => store.dispatch(argentBankApi.util.resetApiState())).not.toThrow();
  });
});
