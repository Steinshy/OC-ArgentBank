import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router';

import { ROUTES, MESSAGES, TRANSACTION_CATEGORIES, TRANSACTION_TYPES, BUTTONS, FORMS } from '@/constants';
import { fetchTransactions, updateTransaction } from '@/features/Transactions';
import { MOCK_ACCOUNTS } from '@/mocks/accounts';
import { AppDispatch, RootState } from '@/store/store';
import './styles/Transactions.css';

export function Transactions() {
  const { accountId } = useParams<{ accountId: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { transactions, loading, error } = useSelector((state: RootState) => state.transactions);
  const [expandedRowId, setExpandedRowId] = useState<string | null>(null);
  const [editingField, setEditingField] = useState<{ id: string; field: 'category' | 'notes' } | null>(null);
  const [editValue, setEditValue] = useState('');

  const account = accountId ? MOCK_ACCOUNTS.find((a) => a.id === accountId) : undefined;

  useEffect(() => {
    if (accountId) {
      dispatch(fetchTransactions(accountId));
    }
  }, [accountId, dispatch]);

  const handleToggleRow = (id: string) => {
    setExpandedRowId((prev) => (prev === id ? null : id));
    setEditingField(null);
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

  if (!account) {
    return <p>{MESSAGES.ACCOUNT_NOT_FOUND}</p>;
  }

  return (
    <>
      <div className="transaction-header">
        <h2>{account.title}</h2>
        <p className="transaction-balance">${account.amount.toFixed(2)}</p>
        <p className="transaction-balance-label">{account.description}</p>
      </div>

      <div className="transaction-content">
        <button className="back-button" onClick={() => navigate(ROUTES.PROFILE)}>
          {BUTTONS.BACK_TO_ACCOUNTS}
        </button>

        {loading && <p>{MESSAGES.LOADING_TRANSACTIONS}</p>}
        {error && <p className="transaction-error">{error}</p>}

        {!loading && transactions.length === 0 && <p>{MESSAGES.NO_TRANSACTIONS}</p>}

        {!loading && transactions.length > 0 && (
          <table className="transaction-table">
            <thead>
              <tr>
                <th className="table-action-column"></th>
                <th className="table-date-column">DATE</th>
                <th>DESCRIPTION</th>
                <th className="table-amount-column">AMOUNT</th>
                <th className="table-category-column">BALANCE</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx) => (
                <React.Fragment key={tx.id}>
                  <tr className="transaction-row" onClick={() => handleToggleRow(tx.id)}>
                    <td>
                      <span className={`arrow ${expandedRowId === tx.id ? 'arrow-up' : 'arrow-down'}`} />
                    </td>
                    <td>{tx.date}</td>
                    <td>{tx.description}</td>
                    <td className={tx.type === TRANSACTION_TYPES.DEBIT ? 'amount-debit' : 'amount-credit'}>
                      {tx.type === TRANSACTION_TYPES.DEBIT ? '-' : '+'}${Math.abs(tx.amount).toFixed(2)}
                    </td>
                    <td>${tx.balance.toFixed(2)}</td>
                  </tr>
                  {expandedRowId === tx.id && (
                    <tr key={`${tx.id}-detail`} className="transaction-detail-row">
                      <td colSpan={5}>
                        <div className="transaction-detail-content">
                          {/* Transaction Type - Read Only */}
                          <div className="detail-row">
                            <div className="detail-label">Transaction Type:</div>
                            <div className="detail-value">{tx.type}</div>
                          </div>

                          {/* Category - Editable */}
                          <div className="detail-row">
                            <div className="detail-label">Category:</div>
                            <div className="detail-value">
                              {editingField?.id === tx.id && editingField?.field === 'category' ? (
                                <div className="edit-controls">
                                  <select className="edit-inline-select" value={editValue} onChange={(e) => setEditValue(e.target.value)}>
                                    {TRANSACTION_CATEGORIES.map((cat) => (
                                      <option key={cat} value={cat}>
                                        {cat}
                                      </option>
                                    ))}
                                  </select>
                                  <button className="edit-save-btn" onClick={() => handleSaveEdit(tx.id, 'category')}>
                                    {BUTTONS.SAVE}
                                  </button>
                                  <button className="edit-cancel-btn" onClick={handleCancelEdit}>
                                    {BUTTONS.CANCEL}
                                  </button>
                                </div>
                              ) : (
                                <>
                                  {tx.category}
                                  <button className="edit-pencil" onClick={() => handleStartEdit(tx.id, 'category', tx.category)} title={FORMS.EDIT_CATEGORY_TITLE}>
                                    ✎
                                  </button>
                                </>
                              )}
                            </div>
                          </div>

                          {/* Notes - Editable */}
                          <div className="detail-row">
                            <div className="detail-label">Notes:</div>
                            <div className="detail-value">
                              {editingField?.id === tx.id && editingField?.field === 'notes' ? (
                                <div className="edit-controls">
                                  <input type="text" className="edit-inline-input" value={editValue} onChange={(e) => setEditValue(e.target.value)} placeholder={FORMS.ADD_NOTE_PLACEHOLDER} />
                                  <button className="edit-save-btn" onClick={() => handleSaveEdit(tx.id, 'notes')}>
                                    {BUTTONS.SAVE}
                                  </button>
                                  <button className="edit-cancel-btn" onClick={handleCancelEdit}>
                                    {BUTTONS.CANCEL}
                                  </button>
                                </div>
                              ) : (
                                <>
                                  {tx.notes || '-'}
                                  <button className="edit-pencil" onClick={() => handleStartEdit(tx.id, 'notes', tx.notes || '')} title={FORMS.EDIT_NOTES_TITLE}>
                                    ✎
                                  </button>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}
