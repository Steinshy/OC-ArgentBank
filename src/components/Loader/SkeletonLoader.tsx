import './styles/SkeletonLoader.css';

interface SkeletonLoaderProps {
  variant?: 'text' | 'circular' | 'rectangular';
  count?: number;
  height?: string;
  width?: string;
}

/**
 * SkeletonLoader component displays placeholder elements while data is loading
 * @param {SkeletonLoaderProps} props - Component props
 * @param {string} [props.variant='rectangular'] - Skeleton shape: 'text' (narrow bar), 'circular' (circle), 'rectangular' (block)
 * @param {number} [props.count=1] - Number of skeleton items to display
 * @param {string} [props.height] - Custom height for skeleton (CSS value, e.g., '20px', '100%')
 * @param {string} [props.width] - Custom width for skeleton (CSS value, e.g., '100%', '200px')
 * @returns {JSX.Element} Skeleton placeholder component
 *
 * @example
 * // Text skeleton (default, multiple lines)
 * <SkeletonLoader variant="text" count={3} />
 *
 * // Circular skeleton for profile picture
 * <SkeletonLoader variant="circular" />
 *
 * // Rectangular skeleton with custom dimensions
 * <SkeletonLoader variant="rectangular" height="200px" width="100%" />
 */
export function SkeletonLoader({ variant = 'rectangular', count = 1, height, width }: SkeletonLoaderProps) {
  const items = Array.from({ length: count }, (_, i) => i);

  const skeletonStyle: React.CSSProperties = {};
  if (height) skeletonStyle.height = height;
  if (width) skeletonStyle.width = width;

  return (
    <div className="skeleton-wrapper">
      {items.map((i) => (
        <div key={i} className={`skeleton skeleton-${variant}`} style={skeletonStyle} role="status" aria-label="Loading" />
      ))}
    </div>
  );
}
