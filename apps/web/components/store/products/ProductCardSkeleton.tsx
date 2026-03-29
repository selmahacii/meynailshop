'use client';

import { Skeleton } from '@/components/ui/Skeleton';

export default function ProductCardSkeleton() {
    return (
        <div className="bg-white border-2 border-rouge-brand/20 shadow-sm rounded-[20px] sm:rounded-[30px] overflow-hidden">
            {/* Image Placeholder */}
            <Skeleton className="aspect-[4/5] w-full rounded-none" />

            <div className="p-3 sm:p-6">
                {/* Category Placeholder */}
                <Skeleton className="h-2.5 sm:h-3 w-14 sm:w-20 mb-2 sm:mb-3" />
                
                {/* Title Placeholder */}
                <Skeleton className="h-4 sm:h-5 w-full mb-2 sm:mb-4" />
                
                {/* Price & Rating Placeholder */}
                <div className="flex items-center justify-between mt-2 sm:mt-4">
                    <Skeleton className="h-5 sm:h-6 w-16 sm:w-24" />
                    <Skeleton className="h-3 sm:h-4 w-8 sm:w-10" />
                </div>
            </div>
        </div>
    );
}
