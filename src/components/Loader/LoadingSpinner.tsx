import './styles/LoadingSpinner.css';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  label?: string;
}

/**
 * LoadingSpinner component displays a circular loading animation
 * @param {LoadingSpinnerProps} props - Component props
 * @param {string} [props.size='md'] - Spinner size: 'sm' (24px), 'md' (40px), 'lg' (60px)
 * @param {string} [props.label] - Optional loading text to display below spinner
 * @returns {JSX.Element} Loading spinner component
 *
 * @example
 * // Small spinner with label
 * <LoadingSpinner size="sm" label="Loading..." />
 *
 * // Medium spinner (default)
 * <LoadingSpinner />
 */
export function LoadingSpinner({ size = 'md', label }: LoadingSpinnerProps) {
  const sizeClass = `spinner-${size}`;

  return (
    <div className="loading-spinner-wrapper">
      <div className={`loading-spinner ${sizeClass}`} role="status">
        <span className="sr-only">Loading...</span>
      </div>
      {label && <p className="spinner-label">{label}</p>}
    </div>
  );
}
