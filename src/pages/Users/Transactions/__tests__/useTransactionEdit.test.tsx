import { act, renderHook } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import type { ReactNode } from 'react';

import authReducer from '@/features/Auth/authSlice';
import { argentBankApi } from '@/api/argentBankApi';
import { useTransactionEdit } from '../useTransactionEdit';

const buildStore = () =>
  configureStore({
    reducer: {
      auth: authReducer,
      [argentBankApi.reducerPath]: argentBankApi.reducer,
    },
    middleware: (getDefault) => getDefault().concat(argentBankApi.middleware),
  });

const makeWrapper = () => {
  const store = buildStore();
  const Wrapper = ({ children }: { children: ReactNode }) => <Provider store={store}>{children}</Provider>;
  return { Wrapper, store };
};

describe('useTransactionEdit', () => {
  it('toggleRow toggles expandedRowId', () => {
    const { Wrapper } = makeWrapper();
    const { result } = renderHook(() => useTransactionEdit('1'), { wrapper: Wrapper });

    expect(result.current.expandedRowId).toBeNull();
    act(() => result.current.toggleRow('tx-1'));
    expect(result.current.expandedRowId).toBe('tx-1');
    act(() => result.current.toggleRow('tx-1'));
    expect(result.current.expandedRowId).toBeNull();
  });

  it('startEdit seeds editingField and editValue', () => {
    const { Wrapper } = makeWrapper();
    const { result } = renderHook(() => useTransactionEdit('1'), { wrapper: Wrapper });

    act(() => result.current.startEdit('tx-1', 'category', 'Food'));
    expect(result.current.editingField).toEqual({ id: 'tx-1', field: 'category' });
    expect(result.current.editValue).toBe('Food');
  });

  it('cancelEdit clears editing state', () => {
    const { Wrapper } = makeWrapper();
    const { result } = renderHook(() => useTransactionEdit('1'), { wrapper: Wrapper });

    act(() => result.current.startEdit('tx-1', 'notes', 'hello'));
    act(() => result.current.cancelEdit());
    expect(result.current.editingField).toBeNull();
    expect(result.current.editValue).toBe('');
  });
});
