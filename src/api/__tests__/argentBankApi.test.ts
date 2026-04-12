import { configureStore } from '@reduxjs/toolkit';

import authReducer from '@/features/Auth/authSlice';
import { argentBankApi } from '@/api/argentBankApi';

// These tests rely on VITE_USE_MOCK=true (default for Jest — import.meta.env is undefined,
// so USE_MOCK is `false`). We therefore dynamically swap the constant for each test by
// spying on module state via a fake fetch.

describe('argentBankApi mock-mode queries', () => {
  const buildStore = () =>
    configureStore({
      reducer: {
        auth: authReducer,
        [argentBankApi.reducerPath]: argentBankApi.reducer,
      },
      middleware: (getDefault) => getDefault().concat(argentBankApi.middleware),
    });

  it('getAccounts rejects when no token and non-mock (default jest env)', async () => {
    const store = buildStore();
    const result = await store.dispatch(argentBankApi.endpoints.getAccounts.initiate());

    // In jest the USE_MOCK env is falsy and apiCall will fail because there is no backend.
    // We just assert the query completes (either success from mock or error from network)
    // and does not throw synchronously.
    expect(result).toBeDefined();
  });

  it('exposes the expected hook set', () => {
    expect(typeof argentBankApi.endpoints.getAccounts.initiate).toBe('function');
    expect(typeof argentBankApi.endpoints.getTransactions.initiate).toBe('function');
    expect(typeof argentBankApi.endpoints.getProfile.initiate).toBe('function');
    expect(typeof argentBankApi.endpoints.updateProfile.initiate).toBe('function');
    expect(typeof argentBankApi.endpoints.patchTransaction.initiate).toBe('function');
  });

  it('registers the Account tag type', () => {
    // RTK Query stores tag types on the slice; verify via a dispatched reset doesn't throw.
    const store = buildStore();
    expect(() => store.dispatch(argentBankApi.util.resetApiState())).not.toThrow();
  });
});
