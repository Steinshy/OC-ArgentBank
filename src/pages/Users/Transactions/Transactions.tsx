import React, { useEffect } from 'react';
import { ChevronDown, ChevronUp, ArrowLeft } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router';

import { SkeletonLoader } from '@/components/Loader/SkeletonLoader';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
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
import type { EditingField } from './useTransactionEdit';
import './styles/Transactions.css';

interface TransactionContentProps {
  accountId: string;
}

interface TransactionRowProps {
  tx: Transaction;
  isExpanded: boolean;
  editingField: EditingField | null;
  editValue: string;
  onToggleRow: (id: string) => void;
  onStartEdit: (id: string, field: 'category' | 'notes', value: string) => void;
  onSaveEdit: (id: string, field: 'category' | 'notes') => void;
  onCancelEdit: () => void;
  onEditValueChange: (value: string) => void;
}

/** Memoized transaction row to prevent re-renders when other rows expand/collapse */
const TransactionRow = React.memo(({ tx, isExpanded, editingField, editValue, onToggleRow, onStartEdit, onSaveEdit, onCancelEdit, onEditValueChange }: TransactionRowProps) => (
  <React.Fragment key={tx.id}>
    <tr className="transaction-row" onClick={() => onToggleRow(tx.id)}>
      <td>
        <button
          type="button"
          className="row-toggle-btn"
          onClick={(e) => {
            e.stopPropagation();
            onToggleRow(tx.id);
          }}
          aria-expanded={isExpanded}
          aria-label={`${isExpanded ? 'Collapse' : 'Expand'} transaction ${tx.description}`}
        >
          {isExpanded ? <ChevronUp className="transaction-icon" aria-hidden strokeWidth={2} /> : <ChevronDown className="transaction-icon" aria-hidden strokeWidth={2} />}
        </button>
      </td>
      <td>{tx.date}</td>
      <td>{tx.description}</td>
      <td className={tx.type === TRANSACTION_TYPES.DEBIT ? 'amount-debit' : 'amount-credit'}>
        {tx.type === TRANSACTION_TYPES.DEBIT ? '-' : '+'}${Math.abs(tx.amount).toFixed(2)}
      </td>
      <td>${tx.balance.toFixed(2)}</td>
    </tr>
    {isExpanded && (
      <TransactionDetail
        key={`${tx.id}-detail`}
        tx={tx}
        editingField={editingField}
        editValue={editValue}
        onStartEdit={onStartEdit}
        onSaveEdit={onSaveEdit}
        onCancelEdit={onCancelEdit}
        onEditValueChange={onEditValueChange}
      />
    )}
  </React.Fragment>
));

TransactionRow.displayName = 'TransactionRow';

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

  return (
    <div className="transaction-content">
      <button className="btn btn-primary back-button" onClick={() => navigate(ROUTES.PROFILE)}>
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
              <TransactionRow
                key={tx.id}
                tx={tx}
                isExpanded={expandedRowId === tx.id}
                editingField={editingField}
                editValue={editValue}
                onToggleRow={toggleRow}
                onStartEdit={startEdit}
                onSaveEdit={saveEdit}
                onCancelEdit={cancelEdit}
                onEditValueChange={setEditValue}
              />
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

  useDocumentTitle(account ? `Transactions — ${account.title}` : 'Transactions');

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
