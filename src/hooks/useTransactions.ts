import { useDispatch } from 'react-redux';

import { clearTransactions, setCurrentAccountId } from '@/features/Transactions';
import { useGetTransactionsQuery, usePatchTransactionMutation } from '@/api/argentBankApi';
import { AppDispatch } from '@/store/store';

interface UpdateTransactionData {
  category?: string;
  notes?: string;
}

export const useTransactions = (accountId?: string) => {
  const dispatch = useDispatch<AppDispatch>();
  const { data: transactions = [], isLoading: loading, error } = useGetTransactionsQuery(accountId ?? '', { skip: !accountId });
  const [patchTransaction] = usePatchTransactionMutation();

  return {
    transactions,
    loading,
    error: error ? 'Failed to load transactions' : null,
    currentAccountId: accountId ?? null,
    fetch: (newAccountId: string) => {
      dispatch(setCurrentAccountId(newAccountId));
    },
    update: (id: string, data: UpdateTransactionData) =>
      patchTransaction({
        accountId: accountId ?? '',
        transactionId: id,
        data,
      }),
    clear: () => dispatch(clearTransactions()),
  };
};
