import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router';

import { LoadingSpinner } from '@/components/Loader';
import { ROUTES, MESSAGES, TRANSACTION_CATEGORIES, TRANSACTION_TYPES, BUTTONS, FORMS } from '@/constants';
import { fetchTransactions, updateTransaction } from '@/features/Transactions';
import { MOCK_ACCOUNTS } from '@/mocks/accounts';
import { AppDispatch, RootState } from '@/store/store';
import { Account, Transaction } from '@/types';
import './styles/Transactions.css';

interface TransactionHeaderProps {
  account: Account;
}

const TransactionHeader = ({ account }: TransactionHeaderProps) => (
  <div className="transaction-header">
    <h2>{account.title}</h2>
    <p className="transaction-balance">${account.amount.toFixed(2)}</p>
    <p className="transaction-balance-label">{account.description}</p>
  </div>
);

interface TransactionDetailProps {
  tx: Transaction;
  editingField: { id: string; field: 'category' | 'notes' } | null;
  editValue: string;
  onStartEdit: (id: string, field: 'category' | 'notes', currentValue: string) => void;
  onSaveEdit: (id: string, field: 'category' | 'notes') => void;
  onCancelEdit: () => void;
  onEditValueChange: (value: string) => void;
}

const TransactionDetail = ({ tx, editingField, editValue, onStartEdit, onSaveEdit, onCancelEdit, onEditValueChange }: TransactionDetailProps) => (
  <tr className="transaction-detail-row">
    <td colSpan={5}>
      <div className="transaction-detail-content">
        <div className="detail-row">
          <div className="detail-label">Transaction Type:</div>
          <div className="detail-value">{tx.type}</div>
        </div>

        <div className="detail-row">
          <div className="detail-label" id={`category-label-${tx.id}`}>
            Category:
          </div>
          <div className="detail-value">
            {editingField?.id === tx.id && editingField?.field === 'category' ? (
              <div className="edit-controls">
                <select
                  id={`transaction-category-${tx.id}`}
                  name={`transaction-category-${tx.id}`}
                  className="edit-inline-select"
                  value={editValue}
                  onChange={(e) => onEditValueChange(e.target.value)}
                  aria-labelledby={`category-label-${tx.id}`}
                >
                  {TRANSACTION_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
                <button className="edit-save-btn" onClick={() => onSaveEdit(tx.id, 'category')}>
                  {BUTTONS.SAVE}
                </button>
                <button className="edit-cancel-btn" onClick={onCancelEdit}>
                  {BUTTONS.CANCEL}
                </button>
              </div>
            ) : (
              <>
                {tx.category}
                <button className="edit-pencil" onClick={() => onStartEdit(tx.id, 'category', tx.category)} aria-label={FORMS.EDIT_CATEGORY_TITLE}>
                  ✎
                </button>
              </>
            )}
          </div>
        </div>

        <div className="detail-row">
          <div className="detail-label" id={`notes-label-${tx.id}`}>
            Notes:
          </div>
          <div className="detail-value">
            {editingField?.id === tx.id && editingField?.field === 'notes' ? (
              <div className="edit-controls">
                <input
                  id={`transaction-notes-${tx.id}`}
                  name={`transaction-notes-${tx.id}`}
                  type="text"
                  className="edit-inline-input"
                  value={editValue}
                  onChange={(e) => onEditValueChange(e.target.value)}
                  aria-labelledby={`notes-label-${tx.id}`}
                  placeholder={FORMS.ADD_NOTE_PLACEHOLDER}
                />
                <button className="edit-save-btn" onClick={() => onSaveEdit(tx.id, 'notes')}>
                  {BUTTONS.SAVE}
                </button>
                <button className="edit-cancel-btn" onClick={onCancelEdit}>
                  {BUTTONS.CANCEL}
                </button>
              </div>
            ) : (
              <>
                {tx.notes || '-'}
                <button className="edit-pencil" onClick={() => onStartEdit(tx.id, 'notes', tx.notes || '')} aria-label={FORMS.EDIT_NOTES_TITLE}>
                  ✎
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </td>
  </tr>
);

interface TransactionContentProps {
  accountId: string;
}

const TransactionContent = ({ accountId }: TransactionContentProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { transactions, loading, error } = useSelector((state: RootState) => state.transactions);
  const [expandedRowId, setExpandedRowId] = useState<string | null>(null);
  const [editingField, setEditingField] = useState<{ id: string; field: 'category' | 'notes' } | null>(null);
  const [editValue, setEditValue] = useState('');

  useEffect(() => {
    dispatch(fetchTransactions(accountId));
  }, [accountId, dispatch]);

  const handleToggleRow = (id: string) => {
    setExpandedRowId((prev) => (prev === id ? null : id));
    setEditingField(null);
  };

  const handleRowKeyDown = (e: React.KeyboardEvent, id: string) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleToggleRow(id);
    }
  };

  const handleStartEdit = (id: string, field: 'category' | 'notes', currentValue: string) => {
    setEditingField({ id, field });
    setEditValue(currentValue || '');
  };

  const handleSaveEdit = (id: string, field: 'category' | 'notes') => {
    dispatch(updateTransaction({ id, [field]: editValue }));
    setEditingField(null);
    setEditValue('');
  };

  const handleCancelEdit = () => {
    setEditingField(null);
    setEditValue('');
  };

  return (
    <div className="transaction-content">
      <button className="back-button" onClick={() => navigate(ROUTES.PROFILE)}>
        {BUTTONS.BACK_TO_ACCOUNTS}
      </button>

      {loading && <LoadingSpinner size="md" label={MESSAGES.LOADING_TRANSACTIONS} />}
      {error && (
        <p className="transaction-error" role="alert">
          {error}
        </p>
      )}

      {!loading && transactions.length === 0 && <p>{MESSAGES.NO_TRANSACTIONS}</p>}

      {!loading && transactions.length > 0 && (
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
            {transactions.map((tx) => (
              <React.Fragment key={tx.id}>
                <tr className="transaction-row" onClick={() => handleToggleRow(tx.id)} onKeyDown={(e) => handleRowKeyDown(e, tx.id)} tabIndex={0} role="button" aria-expanded={expandedRowId === tx.id}>
                  <td>
                    <span className={`arrow ${expandedRowId === tx.id ? 'arrow-up' : 'arrow-down'}`} aria-hidden="true" />
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
                    onStartEdit={handleStartEdit}
                    onSaveEdit={handleSaveEdit}
                    onCancelEdit={handleCancelEdit}
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
