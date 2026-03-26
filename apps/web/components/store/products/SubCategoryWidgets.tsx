'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';

interface SubCategory {
    id: string;
    name: string;
    slug: string;
    imageUrl?: string;
    productCount?: number;
    hasNewArrivals?: boolean;
}

interface SubCategoryWidgetsProps {
    subCategories: SubCategory[];
    activeSubSlug: string | null;
    onSelect: (slug: string | null) => void;
    title?: string;
    subtitle?: string;
}

export default function SubCategoryWidgets({ 
    subCategories, 
    activeSubSlug, 
    onSelect,
    title = "Explorez nos univers",
    subtitle = "Nos spécialités"
}: SubCategoryWidgetsProps) {
    if (!subCategories || subCategories.length === 0) return null;

    return (
        <div className="mb-16 -mx-4 px-4 sm:mx-0 sm:px-0">
            <div className="flex items-center justify-between mb-10 border-b border-creme2 pb-4">
                <div className="flex flex-col">
                    <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-encre">{title}</h2>
                    <p className="text-[9px] text-or font-bold uppercase tracking-widest mt-1">{subtitle}</p>
                </div>
                <button 
                    onClick={() => onSelect(null)}
                    className={cn(
                        "flex items-center gap-2 group transition-all",
                        !activeSubSlug && "opacity-0 pointer-events-none"
                    )}
                >
                    <span className="text-[10px] font-black uppercase tracking-widest text-encre3 group-hover:text-rouge-mid">Tout voir</span>
                    <div className="w-5 h-5 rounded-full border border-creme2 flex items-center justify-center group-hover:bg-creme transition-colors">
                        <X size={10} className="text-encre3" />
                    </div>
                </button>
            </div>
            
            <div className="flex items-start gap-6 md:gap-10 overflow-x-auto no-scrollbar pb-6 snap-x">
                {/* "All" Widget */}
                <div 
                    onClick={() => onSelect(null)}
                    className="flex flex-col items-center gap-4 cursor-pointer group flex-shrink-0 snap-start"
                >
                    <div className={cn(
                        "w-20 h-20 md:w-24 md:h-24 rounded-full border-2 p-1.5 transition-all duration-500",
                        !activeSubSlug 
                            ? "border-or scale-110 shadow-lg shadow-or/10 ring-4 ring-or/5" 
                            : "border-creme2 group-hover:border-or/40"
                    )}>
                        <div className="w-full h-full rounded-full bg-encre flex items-center justify-center overflow-hidden">
                             <div className="text-creme text-[8px] font-black uppercase tracking-widest text-center px-2">TOUT</div>
                        </div>
                    </div>
                    <span className={cn(
                        "text-[10px] font-black uppercase tracking-widest transition-colors",
                        !activeSubSlug ? "text-encre" : "text-encre3"
                    )}>VOIR TOUT</span>
                </div>

                {subCategories.map((sub: any) => (
                    <div
                        key={sub.id}
                        onClick={() => onSelect(sub.slug)}
                        className="flex flex-col items-center gap-4 cursor-pointer group flex-shrink-0 snap-start max-w-[100px]"
                    >
                        <div className={cn(
                            "w-20 h-20 md:w-24 md:h-24 rounded-full border-2 p-1.5 transition-all duration-500 relative",
                            activeSubSlug === sub.slug 
                                ? "border-or scale-110 shadow-lg shadow-or/10 ring-4 ring-or/5" 
                                : "border-creme2 group-hover:border-or/40"
                        )}>
                            <div className="w-full h-full rounded-full bg-creme2 overflow-hidden relative">
                                {sub.imageUrl ? (
                                    <img 
                                        src={sub.imageUrl} 
                                        alt={sub.name} 
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                                    />
                                ) : (
                                    <img 
                                        src={`https://images.unsplash.com/photo-1632345033839-245a1e2ca9cb?q=80&w=200`}
                                        alt={sub.name}
                                        className="w-full h-full object-cover opacity-50 grayscale"
                                    />
                                )}
                            </div>
                            {sub.hasNewArrivals && (
                                <div className="absolute -top-1 -right-1 w-4 h-4 bg-rouge-deep rounded-full border-2 border-creme animate-pulse shadow-lg" />
                            )}
                        </div>
                        <div className="text-center">
                            <p className={cn(
                                "text-[10px] font-black uppercase tracking-widest transition-colors truncate w-full",
                                activeSubSlug === sub.slug ? "text-encre" : "text-encre3 group-hover:text-encre"
                            )}>
                                {sub.name}
                            </p>
                            <p className="text-[8px] font-bold text-or/60 group-hover:text-or transition-colors uppercase">{sub.productCount || 0} modèles</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
