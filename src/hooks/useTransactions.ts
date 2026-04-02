import { useDispatch, useSelector } from 'react-redux';

import { fetchTransactions, updateTransaction, clearTransactions } from '@/features/Transactions';
import { AppDispatch, RootState } from '@/store/store';

interface UpdateTransactionData {
  category?: string;
  notes?: string;
}

export const useTransactions = () => {
  const dispatch = useDispatch<AppDispatch>();
  const transactions = useSelector((state: RootState) => state.transactions);

  return {
    ...transactions,
    fetch: (accountId: string) => dispatch(fetchTransactions(accountId)),
    update: (id: string, data: UpdateTransactionData) => dispatch(updateTransaction({ id, ...data })),
    clear: () => dispatch(clearTransactions()),
  };
};
