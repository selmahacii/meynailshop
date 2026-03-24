'use client';

import { Skeleton } from '@/components/ui/Skeleton';

export default function CategorySkeleton() {
    return (
        <div className="relative aspect-[4/5] overflow-hidden bg-encre/10 rounded-sm shadow-sm border border-or/5">
            <Skeleton className="absolute inset-0 w-full h-full" />
            <div className="absolute inset-0 flex items-end justify-center pb-8 z-20">
                <Skeleton className="h-6 w-24" />
            </div>
        </div>
    );
}
