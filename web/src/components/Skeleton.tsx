interface SkeletonProps {
  className?: string;
  width?: string | number;
  height?: string | number;
  rounded?: boolean;
}

export default function Skeleton({
  className = '',
  width,
  height,
  rounded = true
}: SkeletonProps) {
  const style: React.CSSProperties = {};
  if (width) style.width = typeof width === 'number' ? `${width}px` : width;
  if (height) style.height = typeof height === 'number' ? `${height}px` : height;

  return (
    <div
      className={`animate-pulse bg-neutral-200 dark:bg-neutral-700 ${
        rounded ? 'rounded' : ''
      } ${className}`}
      style={style}
    />
  );
}

// Common skeleton patterns
export function SkeletonText({
  lines = 1,
  className = ''
}: {
  lines?: number;
  className?: string;
}) {
  if (lines === 1) {
    return <Skeleton className={`h-4 ${className}`} />;
  }

  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className="h-4"
          width={i === lines - 1 ? '60%' : '100%'}
        />
      ))}
    </div>
  );
}

export function SkeletonCard({ className = '' }: { className?: string }) {
  return (
    <div className={`card p-5 sm:p-6 ${className}`}>
      <SkeletonText lines={2} className="mb-4" />
      <Skeleton className="h-32 w-full rounded-lg" />
    </div>
  );
}

export function SkeletonList({
  items = 3,
  className = ''
}: {
  items?: number;
  className?: string;
}) {
  return (
    <div className={`space-y-3 ${className}`}>
      {Array.from({ length: items }).map((_, i) => (
        <div key={i} className="flex items-center space-x-3">
          <Skeleton className="h-8 w-8 rounded-full" />
          <div className="flex-1">
            <Skeleton className="h-4 w-3/4 mb-1" />
            <Skeleton className="h-3 w-1/2" />
          </div>
          <Skeleton className="h-6 w-16" />
        </div>
      ))}
    </div>
  );
}