import { Edit } from 'lucide-react';

import { TRANSACTION_CATEGORIES, BUTTONS, FORMS } from '@/constants';
import { Transaction } from '@/types';

interface Props {
  tx: Transaction;
  editingField: { id: string; field: 'category' | 'notes' } | null;
  editValue: string;
  onStartEdit: (id: string, field: 'category' | 'notes', currentValue: string) => void;
  onSaveEdit: (id: string, field: 'category' | 'notes') => void;
  onCancelEdit: () => void;
  onEditValueChange: (value: string) => void;
}

export const TransactionDetail = ({ tx, editingField, editValue, onStartEdit, onSaveEdit, onCancelEdit, onEditValueChange }: Props) => (
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
                <button className="btn btn-primary btn-sm" onClick={() => onSaveEdit(tx.id, 'category')}>
                  {BUTTONS.SAVE}
                </button>
                <button className="btn btn-secondary btn-sm" onClick={onCancelEdit}>
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
                <button className="btn btn-primary btn-sm" onClick={() => onSaveEdit(tx.id, 'notes')}>
                  {BUTTONS.SAVE}
                </button>
                <button className="btn btn-secondary btn-sm" onClick={onCancelEdit}>
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
    </td>
  </tr>
);
