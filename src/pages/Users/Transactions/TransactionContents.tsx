import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, ArrowLeft, Edit } from 'lucide-react';
import { useNavigate } from 'react-router';

import { SkeletonLoader } from '@/components/Loader/SkeletonLoader';
import { Pagination } from '@/components/Pagination/Pagination';
import { ROUTES, MESSAGES, TRANSACTION_TYPES, BUTTONS, FORMS, TRANSACTION_CATEGORIES } from '@/constants';
import { Transaction, UserAccountId } from '@/types';
import { useTransactionEdit, type EditableField } from './useTransactionEdit';
import { STATIC_ACCOUNTS } from './staticAccounts';

interface TransactionsRowProps {
  tx: Transaction;
  isExpanded: boolean;
  editingField: { id: string; field: EditableField } | null;
  editValue: string;
  isSaving: boolean;
  onToggleRow: (id: string) => void;
  onStartEdit: (id: string, field: 'category' | 'notes', value: string) => void;
  onSaveEdit: (id: string, field: 'category' | 'notes') => void;
  onCancelEdit: () => void;
  onEditValueChange: (value: string) => void;
}

interface TransactionsDetailProps {
  tx: Transaction;
  editingField: { id: string; field: EditableField } | null;
  editValue: string;
  isSaving?: boolean;
  isLoading?: boolean;
  onStartEdit: (id: string, field: 'category' | 'notes', currentValue: string) => void;
  onSaveEdit: (id: string, field: 'category' | 'notes') => void;
  onCancelEdit: () => void;
  onEditValueChange: (value: string) => void;
}

export const TransactionsTable = ({ accountId }: { accountId: UserAccountId }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const account = STATIC_ACCOUNTS.find((a) => a.id === accountId);
  const transactions = account?.transactions || [];
  const { expandedRowId, editingField, editValue, isSaving, setEditValue, toggleRow, startEdit, saveEdit, cancelEdit } = useTransactionEdit(accountId);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="transaction-content">
      <button className="btn btn-secondary back-button" onClick={() => navigate(ROUTES.PROFILE)}>
        <ArrowLeft className="transaction-icon" aria-hidden strokeWidth={2} />
        {BUTTONS.BACK_TO_ACCOUNTS}
      </button>

      {loading ? (
        <SkeletonLoader variant="transaction" count={5} label="Loading transactions" />
      ) : transactions.length === 0 ? (
        <p>{MESSAGES.NO_TRANSACTIONS}</p>
      ) : (
        <>
          <table className="transaction-table">
            <thead>
              <tr>
                <th className="table-date-column">DATE</th>
                <th>DESCRIPTION</th>
                <th className="table-amount-column">AMOUNT</th>
                <th className="table-balance-column">BALANCE</th>
                <th className="table-action-column">
                  <span className="sr-only">Toggle</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx: Transaction) => (
                <TransactionsRow
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
          <Pagination currentPage={1} totalPages={5} totalItems={transactions.length} />
        </>
      )}
    </div>
  );
};

export const TransactionsRow = React.memo(({ tx, isExpanded, editingField, editValue, isSaving, onToggleRow, onStartEdit, onSaveEdit, onCancelEdit, onEditValueChange }: TransactionsRowProps) => (
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
      <td>{tx.date}</td>
      <td>{tx.description}</td>
      <td className={tx.type === TRANSACTION_TYPES.DEBIT ? 'amount-debit' : 'amount-credit'}>
        {tx.type === TRANSACTION_TYPES.DEBIT ? '-' : '+'}${Math.abs(tx.amount).toFixed(2)}
      </td>
      <td className={tx.balance < 0 ? 'amount-debit' : ''}>${tx.balance.toFixed(2)}</td>
      <td className="table-action-column">
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
    </tr>
    {isExpanded && (
      <TransactionsDetail
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

TransactionsRow.displayName = 'TransactionsRow';

export const TransactionsDetail = ({ tx, editingField, editValue, isSaving = false, isLoading = false, onStartEdit, onSaveEdit, onCancelEdit, onEditValueChange }: TransactionsDetailProps) => (
  <tr className="transaction-detail-row">
    <td colSpan={5}>
      {isLoading ? (
        <SkeletonLoader variant="transaction-detail" />
      ) : (
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
                  <button className="btn btn-primary btn-sm" onClick={() => onSaveEdit(tx.id, 'category')} disabled={isSaving} aria-busy={isSaving}>
                    {isSaving ? '…' : BUTTONS.SAVE}
                  </button>
                  <button className="btn btn-secondary btn-sm" onClick={onCancelEdit} disabled={isSaving}>
                    {BUTTONS.CANCEL}
                  </button>
                </div>
              ) : (
                <>
                  {tx.category}
                  <button className="edit-pencil" onClick={() => onStartEdit(tx.id, 'category', tx.category)} aria-label={FORMS.EDIT_CATEGORY_TITLE}>
                    <Edit className="edit-pencil-icon" aria-hidden strokeWidth={2} />
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
                  <button className="btn btn-primary btn-sm" onClick={() => onSaveEdit(tx.id, 'notes')} disabled={isSaving} aria-busy={isSaving}>
                    {isSaving ? '…' : BUTTONS.SAVE}
                  </button>
                  <button className="btn btn-secondary btn-sm" onClick={onCancelEdit} disabled={isSaving}>
                    {BUTTONS.CANCEL}
                  </button>
                </div>
              ) : (
                <>
                  {tx.notes || '-'}
                  <button className="edit-pencil" onClick={() => onStartEdit(tx.id, 'notes', tx.notes || '')} aria-label={FORMS.EDIT_NOTES_TITLE}>
                    <Edit className="edit-pencil-icon" aria-hidden strokeWidth={2} />
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </td>
  </tr>
);
