import './styles/SkeletonLoader.css';

interface SkeletonLoaderProps {
  variant?: 'text' | 'circular' | 'rectangular';
  count?: number;
  height?: string;
  width?: string;
}

export const SkeletonLoader = ({ variant = 'rectangular', count = 1, height, width }: SkeletonLoaderProps) => {
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
};
