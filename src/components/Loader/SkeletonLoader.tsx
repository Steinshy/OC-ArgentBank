import './styles/SkeletonLoader.css';

type SkeletonVariant = 'text' | 'circular' | 'rectangular' | 'heading' | 'avatar' | 'card' | 'button' | 'account' | 'transaction' | 'transaction-detail' | 'form-field' | 'settings';

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
        // Account card skeleton layout - multiple cards
        items.map((i) => (
          <div key={i} className="skeleton-account-card">
            <div className="skeleton-account-content">
              <div className="skeleton skeleton-account-title" />
              <div className="skeleton skeleton-account-amount" />
              <div className="skeleton skeleton-account-description" />
            </div>
            <div className="skeleton-account-button">
              <div className="skeleton skeleton-button" />
            </div>
          </div>
        ))
      ) : variant === 'transaction' ? (
        // Transaction rows skeleton with header and footer
        <div className="skeleton-transaction-block">
          <div className="skeleton-transaction-header">
            <div className="skeleton skeleton-header-col" />
            <div className="skeleton skeleton-header-col" />
            <div className="skeleton skeleton-header-col" />
            <div className="skeleton skeleton-header-col" />
          </div>
          <div className="skeleton-transaction-wrapper">
            {items.map((i) => (
              <div key={i} className="skeleton-transaction-row">
                <div className="skeleton skeleton-transaction-col" />
                <div className="skeleton skeleton-transaction-col" />
                <div className="skeleton skeleton-transaction-col" />
                <div className="skeleton skeleton-transaction-col" />
                <div className="skeleton skeleton-transaction-col" />
              </div>
            ))}
          </div>
          <div className="skeleton-transaction-footer">
            <div className="skeleton skeleton-footer-bar" />
          </div>
        </div>
      ) : variant === 'transaction-detail' ? (
        // Transaction detail skeleton
        <div className="skeleton-transaction-detail">
          <div className="skeleton-detail-field">
            <div className="skeleton skeleton-detail-label" />
            <div className="skeleton skeleton-detail-value" />
          </div>
          <div className="skeleton-detail-field">
            <div className="skeleton skeleton-detail-label" />
            <div className="skeleton skeleton-detail-value" />
          </div>
        </div>
      ) : variant === 'form-field' ? (
        // Form field skeleton
        items.map((i) => (
          <div key={i} className="skeleton-form-field">
            <div className="skeleton skeleton-label" />
            <div className="skeleton skeleton-input" />
          </div>
        ))
      ) : variant === 'settings' ? (
        // Settings page skeleton with header and form
        <div className="skeleton-settings-block">
          <div className="skeleton-settings-header">
            <div className="skeleton skeleton-settings-avatar" />
            <div className="skeleton-settings-header-info">
              <div className="skeleton skeleton-settings-title" />
              <div className="skeleton skeleton-settings-email" />
            </div>
          </div>
          <div className="skeleton-settings-form">
            <div className="skeleton skeleton-settings-section-title" />
            <div className="skeleton-settings-form-field">
              <div className="skeleton skeleton-label" />
              <div className="skeleton skeleton-input" />
            </div>
            <div className="skeleton-settings-form-row">
              <div className="skeleton-settings-form-field">
                <div className="skeleton skeleton-label" />
                <div className="skeleton skeleton-input" />
              </div>
              <div className="skeleton-settings-form-field">
                <div className="skeleton skeleton-label" />
                <div className="skeleton skeleton-input" />
              </div>
            </div>
            <div className="skeleton-settings-actions">
              <div className="skeleton skeleton-button" />
              <div className="skeleton skeleton-button" />
            </div>
          </div>
        </div>
      ) : (
        // Standard skeleton variants
        items.map((i) => <div key={i} className={`skeleton skeleton-${mappedVariant}`} style={skeletonStyle} />)
      )}
    </div>
  );
};
