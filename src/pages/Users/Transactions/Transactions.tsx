import React, { useEffect } from 'react';
import { ChevronDown, ChevronUp, ArrowLeft } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router';

import { SkeletonLoader } from '@/components/Loader/SkeletonLoader';
import { ROUTES, MESSAGES, TRANSACTION_TYPES, BUTTONS } from '@/constants';
import { useGetTransactionsQuery } from '@/api/argentBankApi';
import { MOCK_ACCOUNTS } from '@/mocks/accounts';
import { Transaction } from '@/types';
import { extractErrorMessage } from '@/utils/errorHandler';
import { logoutUser } from '@/features/Auth/authThunks';
import type { AppDispatch } from '@/store/store';
import { TransactionHeader } from './TransactionHeader';
import { TransactionDetail } from './TransactionDetail';
import { useTransactionEdit } from './useTransactionEdit';
import './styles/Transactions.css';

interface TransactionContentProps {
  accountId: string;
}

const TransactionContent = ({ accountId }: TransactionContentProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { data: transactions = [], isLoading: loading, error, isError } = useGetTransactionsQuery(accountId, { refetchOnFocus: true });
  const { expandedRowId, editingField, editValue, setEditValue, toggleRow, startEdit, saveEdit, cancelEdit } = useTransactionEdit(accountId);

  useEffect(() => {
    if (isError) {
      dispatch(logoutUser());
      navigate(ROUTES.LOGIN);
    }
  }, [isError, dispatch, navigate]);

  const handleRowKeyDown = (e: React.KeyboardEvent, id: string) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggleRow(id);
    }
  };

  return (
    <div className="transaction-content">
      <button className="btn btn-primary" onClick={() => navigate(ROUTES.PROFILE)}>
        <ArrowLeft className="transaction-icon" aria-hidden strokeWidth={2} />
        {BUTTONS.BACK_TO_ACCOUNTS}
      </button>

      {error && (
        <p className="transaction-error" role="alert">
          {extractErrorMessage(error, 'Failed to load transactions. Please try again.')}
        </p>
      )}

      {loading ? (
        <SkeletonLoader variant="transaction" count={5} label="Loading transactions" />
      ) : transactions.length === 0 ? (
        <p>{MESSAGES.NO_TRANSACTIONS}</p>
      ) : (
        <table className="transaction-table">
          <thead>
            <tr>
              <th className="table-action-column">
                <span className="sr-only">Toggle</span>
              </th>
              <th className="table-date-column">DATE</th>
              <th>DESCRIPTION</th>
              <th className="table-amount-column">AMOUNT</th>
              <th className="table-balance-column">BALANCE</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx: Transaction) => (
              <React.Fragment key={tx.id}>
                <tr className="transaction-row" onClick={() => toggleRow(tx.id)} onKeyDown={(e) => handleRowKeyDown(e, tx.id)} tabIndex={0} role="button" aria-expanded={expandedRowId === tx.id}>
                  <td>
                    {expandedRowId === tx.id ? (
                      <ChevronUp className="transaction-icon" aria-hidden strokeWidth={2} />
                    ) : (
                      <ChevronDown className="transaction-icon" aria-hidden strokeWidth={2} />
                    )}
                  </td>
                  <td>{tx.date}</td>
                  <td>{tx.description}</td>
                  <td className={tx.type === TRANSACTION_TYPES.DEBIT ? 'amount-debit' : 'amount-credit'}>
                    {tx.type === TRANSACTION_TYPES.DEBIT ? '-' : '+'}${Math.abs(tx.amount).toFixed(2)}
                  </td>
                  <td>${tx.balance.toFixed(2)}</td>
                </tr>
                {expandedRowId === tx.id && (
                  <TransactionDetail
                    key={`${tx.id}-detail`}
                    tx={tx}
                    editingField={editingField}
                    editValue={editValue}
                    onStartEdit={startEdit}
                    onSaveEdit={saveEdit}
                    onCancelEdit={cancelEdit}
                    onEditValueChange={setEditValue}
                  />
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export const Transactions = () => {
  const { accountId } = useParams<{ accountId: string }>();
  const account = accountId ? MOCK_ACCOUNTS.find((a) => a.id === accountId) : undefined;

  if (!account || !accountId) {
    return <p>{MESSAGES.ACCOUNT_NOT_FOUND}</p>;
  }

  return (
    <>
      <TransactionHeader account={account} />
      <TransactionContent accountId={accountId} />
    </>
  );
};
