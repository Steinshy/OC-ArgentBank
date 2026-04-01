/**
 * Transaction-related constants and configuration
 */

// Table column widths for transaction table
export const TABLE_STYLES = {
  ACTION_COLUMN_WIDTH: '30px',
  CATEGORY_COLUMN_WIDTH: '100px',
  AMOUNT_COLUMN_WIDTH: '80px',
  DATE_COLUMN_WIDTH: '100px',
} as const;

// Button styles (reusable across components)
export const BUTTON_STYLES = {
  UNSTYLED: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: 0,
  } as const,
} as const;
