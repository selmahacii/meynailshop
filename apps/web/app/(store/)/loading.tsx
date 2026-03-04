import { Skeleton } from '@/components/ui/Skeleton';

export default function StoreLoading(): React.ReactNode {
  return (
    <div className="min-h-screen bg-creme">
      {/* Hero skeleton */}
      <div className="w-full h-96 bg-creme2 animate-pulse" />

      {/* Products grid skeleton */}
      <div className="px-6 py-12 max-w-7xl mx-auto">
        <Skeleton className="h-8 w-48 mb-8" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="space-y-4">
              <Skeleton className="w-full h-48" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-8 w-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
