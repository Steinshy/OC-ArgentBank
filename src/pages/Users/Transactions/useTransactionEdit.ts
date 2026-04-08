import { useState } from 'react';

import { usePatchTransactionMutation } from '@/api/argentBankApi';

type EditableField = 'category' | 'notes';

interface EditingField {
  id: string;
  field: EditableField;
}

export const useTransactionEdit = (accountId: string) => {
  const [patchTransaction] = usePatchTransactionMutation();
  const [expandedRowId, setExpandedRowId] = useState<string | null>(null);
  const [editingField, setEditingField] = useState<EditingField | null>(null);
  const [editValue, setEditValue] = useState('');

  const toggleRow = (id: string) => {
    setExpandedRowId((prev) => (prev === id ? null : id));
    setEditingField(null);
  };

  const startEdit = (id: string, field: EditableField, currentValue: string) => {
    setEditingField({ id, field });
    setEditValue(currentValue || '');
  };

  const saveEdit = (id: string, field: EditableField) => {
    patchTransaction({ accountId, transactionId: id, data: { [field]: editValue } });
    setEditingField(null);
    setEditValue('');
  };

  const cancelEdit = () => {
    setEditingField(null);
    setEditValue('');
  };

  return { expandedRowId, editingField, editValue, setEditValue, toggleRow, startEdit, saveEdit, cancelEdit };
};
