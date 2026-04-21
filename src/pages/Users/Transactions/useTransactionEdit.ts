import { useCallback, useState } from 'react';
import { UserAccountId } from '@/types';
import { STATIC_ACCOUNTS } from './staticAccounts';

export type EditableField = 'category' | 'notes';

export const useTransactionEdit = (accountId: UserAccountId) => {
  const [expandedRowId, setExpandedRowId] = useState<string | null>(null);
  const [editingField, setEditingField] = useState<{ id: string; field: EditableField } | null>(null);
  const [editValue, setEditValue] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const toggleRow = useCallback((id: string) => {
    setExpandedRowId((prev) => (prev === id ? null : id));
    setEditingField(null);
  }, []);

  const startEdit = useCallback((id: string, field: EditableField, currentValue: string) => {
    setEditingField({ id, field });
    setEditValue(currentValue || '');
  }, []);

  const saveEdit = useCallback(
    (id: string, field: EditableField) => {
      setIsSaving(true);
      setTimeout(() => {
        const account = STATIC_ACCOUNTS.find((a) => a.id === accountId);
        if (account?.transactions) {
          const transaction = account.transactions.find((t) => t.id === id);
          if (transaction && (field === 'category' || field === 'notes')) {
            transaction[field] = editValue;
          }
        }
        setEditingField(null);
        setEditValue('');
        setIsSaving(false);
      }, 300);
    },
    [accountId, editValue]
  );

  const cancelEdit = useCallback(() => {
    setEditingField(null);
    setEditValue('');
  }, []);

  return { expandedRowId, editingField, editValue, isSaving, setEditValue, toggleRow, startEdit, saveEdit, cancelEdit };
};
