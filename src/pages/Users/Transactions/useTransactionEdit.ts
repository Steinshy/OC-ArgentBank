import { useCallback, useState } from 'react';

import { usePatchTransactionMutation } from '@/api/argentBankApi';

export type EditableField = 'category' | 'notes';

export interface EditingField {
  id: string;
  field: EditableField;
}

export const useTransactionEdit = (accountId: string) => {
  const [patchTransaction, { isLoading: isSaving }] = usePatchTransactionMutation();
  const [expandedRowId, setExpandedRowId] = useState<string | null>(null);
  const [editingField, setEditingField] = useState<EditingField | null>(null);
  const [editValue, setEditValue] = useState('');

  const toggleRow = useCallback((id: string) => {
    setExpandedRowId((prev) => (prev === id ? null : id));
    setEditingField(null);
  }, []);

  const startEdit = useCallback((id: string, field: EditableField, currentValue: string) => {
    setEditingField({ id, field });
    setEditValue(currentValue || '');
  }, []);

  const saveEdit = useCallback(
    async (id: string, field: EditableField) => {
      try {
        await patchTransaction({ accountId, transactionId: id, data: { [field]: editValue } }).unwrap();
      } finally {
        setEditingField(null);
        setEditValue('');
      }
    },
    [accountId, editValue, patchTransaction]
  );

  const cancelEdit = useCallback(() => {
    setEditingField(null);
    setEditValue('');
  }, []);

  return { expandedRowId, editingField, editValue, isSaving, setEditValue, toggleRow, startEdit, saveEdit, cancelEdit };
};
