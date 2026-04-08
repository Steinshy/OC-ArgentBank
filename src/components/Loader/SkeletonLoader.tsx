import './styles/SkeletonLoader.css';

type SkeletonVariant = 'text' | 'circular' | 'rectangular' | 'heading' | 'avatar' | 'card' | 'button' | 'account' | 'transaction' | 'form-field';

interface SkeletonLoaderProps {
  variant?: SkeletonVariant;
  count?: number;
  height?: string;
  width?: string;
  label?: string;
  animated?: boolean;
}

export const SkeletonLoader = ({ variant = 'rectangular', count = 1, height, width, label = 'Loading content', animated = true }: SkeletonLoaderProps) => {
  const items = Array.from({ length: count }, (_, i) => i);

  const skeletonStyle: React.CSSProperties = {};
  if (height) skeletonStyle.height = height;
  if (width) skeletonStyle.width = width;

  // Map old variants to new ones for backward compatibility
  const variantMap: Record<string, SkeletonVariant> = {
    circular: 'avatar',
    rectangular: 'card',
  };

  const mappedVariant = variantMap[variant] || variant;

  return (
    <div className="skeleton-wrapper" role="status" aria-busy={animated} aria-label={label}>
      {variant === 'account' ? (
        // Account card skeleton layout
        <div className="skeleton-account">
          <div className="skeleton skeleton-avatar" />
          <div className="skeleton skeleton-title" />
          <div className="skeleton skeleton-amount" />
        </div>
      ) : variant === 'transaction' ? (
        // Transaction row skeleton
        items.map((i) => (
          <div key={i} className="skeleton-transaction-row">
            <div className="skeleton" />
            <div className="skeleton" />
            <div className="skeleton" />
            <div className="skeleton" />
            <div className="skeleton" />
          </div>
        ))
      ) : variant === 'form-field' ? (
        // Form field skeleton
        items.map((i) => (
          <div key={i} className="skeleton-form-field">
            <div className="skeleton skeleton-label" />
            <div className="skeleton skeleton-input" />
          </div>
        ))
      ) : (
        // Standard skeleton variants
        items.map((i) => <div key={i} className={`skeleton skeleton-${mappedVariant}`} style={skeletonStyle} />)
      )}
    </div>
  );
};
