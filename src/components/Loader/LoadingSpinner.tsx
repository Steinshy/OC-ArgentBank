import './styles/LoadingSpinner.css';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  label?: string;
}

export const LoadingSpinner = ({ size = 'md', label }: LoadingSpinnerProps) => {
  const sizeClass = `spinner-${size}`;
  const ariaLabel = label || 'Loading...';

  return (
    <div className="loading-spinner-wrapper" role="status" aria-label={ariaLabel}>
      <div className={`loading-spinner ${sizeClass}`} />
      {label && <p className="spinner-label">{label}</p>}
    </div>
  );
};
