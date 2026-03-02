import { Skeleton } from '@/components/ui/Skeleton';

export default function AdminLoading() {
  return (
    <div className="min-h-screen bg-creme">
      <div className="flex">
        {/* Sidebar skeleton */}
        <div className="w-64 bg-creme2 p-6 space-y-4">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-10 w-full" />
          ))}
        </div>

        {/* Main content skeleton */}
        <div className="flex-1 p-8">
          <Skeleton className="h-12 w-64 mb-8" />

          <div className="grid grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-24" />
            ))}
          </div>

          <div className="bg-white rounded-lg p-6">
            <Skeleton className="h-8 w-48 mb-4" />
            <table className="w-full">
              <tbody>
                {[...Array(5)].map((_, i) => (
                  <tr key={i} className="border-b">
                    <td className="py-4">
                      <Skeleton className="h-4 w-full" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
