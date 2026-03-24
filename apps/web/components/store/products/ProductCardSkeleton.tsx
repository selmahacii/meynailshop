'use client';

import { Skeleton } from '@/components/ui/Skeleton';

export default function ProductCardSkeleton() {
    return (
        <div className="bg-white border border-creme2 shadow-sm">
            {/* Image Placeholder */}
            <Skeleton className="aspect-[4/5] w-full" />

            <div className="p-6">
                {/* Category Placeholder */}
                <Skeleton className="h-3 w-20 mb-3" />
                
                {/* Title Placeholder */}
                <Skeleton className="h-5 w-full mb-4" />
                
                {/* Price & Rating Placeholder */}
                <div className="flex items-center justify-between mt-4">
                    <Skeleton className="h-6 w-24" />
                    <Skeleton className="h-4 w-10" />
                </div>
            </div>
        </div>
    );
}
