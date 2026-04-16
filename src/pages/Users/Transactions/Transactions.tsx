import React, { useEffect } from 'react';
import { ChevronDown, ChevronUp, ArrowLeft } from 'lucide-react';
import { useNavigate, useParams } from 'react-router';

import { SkeletonLoader } from '@/components/Loader/SkeletonLoader';
import { ROUTES, MESSAGES, TRANSACTION_TYPES, BUTTONS } from '@/constants';
import { useGetTransactionsQuery } from '@/api/argentBankApi';
import { Transaction } from '@/types';
import { extractErrorMessage, ERROR_MESSAGES } from '@/utils/errorHandler';
import { logoutUser } from '@/features/Auth/authThunks';
import { useAppDispatch } from '@/store/store';
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
  isSaving: boolean;
  onToggleRow: (id: string) => void;
  onStartEdit: (id: string, field: 'category' | 'notes', value: string) => void;
  onSaveEdit: (id: string, field: 'category' | 'notes') => void;
  onCancelEdit: () => void;
  onEditValueChange: (value: string) => void;
}

/** Memoized transaction row to prevent re-renders when other rows expand/collapse */
const TransactionRow = React.memo(({ tx, isExpanded, editingField, editValue, isSaving, onToggleRow, onStartEdit, onSaveEdit, onCancelEdit, onEditValueChange }: TransactionRowProps) => (
  <React.Fragment key={tx.id}>
    <tr
      className="transaction-row"
      onClick={() => onToggleRow(tx.id)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onToggleRow(tx.id);
        }
      }}
      tabIndex={0}
      role="button"
      aria-expanded={isExpanded}
    >
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
        isSaving={isSaving && editingField?.id === tx.id}
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
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { data: transactions = [], isLoading: loading, error, isError } = useGetTransactionsQuery(accountId, { refetchOnFocus: true });
  const { expandedRowId, editingField, editValue, isSaving, setEditValue, toggleRow, startEdit, saveEdit, cancelEdit } = useTransactionEdit(accountId);

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
          {extractErrorMessage(error, ERROR_MESSAGES.TRANSACTIONS_LOAD_FAILED)}
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
                isSaving={isSaving}
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

  if (!accountId) {
    return <p>{MESSAGES.ACCOUNT_NOT_FOUND}</p>;
  }

  return <TransactionContent accountId={accountId} />;
};
