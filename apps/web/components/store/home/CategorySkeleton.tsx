'use client';

import { Skeleton } from '@/components/ui/Skeleton';

export default function CategorySkeleton() {
    return (
        <div className="w-full bg-white border-2 border-rouge-brand/20 shadow-sm rounded-[24px] overflow-hidden flex flex-col">
            <div className="relative aspect-[4/5] w-full bg-creme2 overflow-hidden border-b-2 border-rouge-brand/10">
                <Skeleton className="absolute inset-0 w-full h-full rounded-none" />
            </div>
            <div className="p-4 flex-grow flex items-center justify-center min-h-[50px] md:min-h-[60px]">
                <Skeleton className="h-4 w-20 md:h-5 md:w-24" />
            </div>
        </div>
    );
}
