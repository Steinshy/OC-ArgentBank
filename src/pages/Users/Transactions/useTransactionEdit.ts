import { useCallback, useState } from 'react';

export type EditableField = 'category' | 'notes';
type FieldEdits = Partial<Record<EditableField, string>>;

/**
 * Edits are kept in local state instead of mutating STATIC_ACCOUNTS: there is no
 * backend endpoint for transactions yet (see docs/ARCHITECTURE.md), so nothing persists.
 */
export const useTransactionEdit = () => {
  const [expandedRowId, setExpandedRowId] = useState<string | null>(null);
  const [editingField, setEditingField] = useState<{ id: string; field: EditableField } | null>(null);
  const [editValue, setEditValue] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [edits, setEdits] = useState<Record<string, FieldEdits>>({});

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
        setEdits((prev) => ({ ...prev, [id]: { ...prev[id], [field]: editValue } }));
        setEditingField(null);
        setEditValue('');
        setIsSaving(false);
      }, 300);
    },
    [editValue]
  );

  const cancelEdit = useCallback(() => {
    setEditingField(null);
    setEditValue('');
  }, []);

  return { expandedRowId, editingField, editValue, isSaving, edits, setEditValue, toggleRow, startEdit, saveEdit, cancelEdit };
};
