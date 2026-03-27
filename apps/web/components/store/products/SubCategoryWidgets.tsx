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
            
            <div className={cn(
                "pb-6 snap-x",
                !activeSubSlug 
                    ? "grid grid-cols-2 gap-6 sm:gap-8 md:flex md:items-start md:gap-10 md:overflow-x-auto md:no-scrollbar" 
                    : "flex items-start gap-6 md:gap-10 overflow-x-auto no-scrollbar"
            )}>
                {/* "All" Widget - Hide in Mobile Grid to save space for specific universes */}
                <div 
                    onClick={() => onSelect(null)}
                    className={cn(
                        "flex flex-col items-center gap-4 cursor-pointer group flex-shrink-0 snap-start",
                        !activeSubSlug && "hidden md:flex"
                    )}
                >
                    <div className={cn(
                        "w-20 h-20 md:w-24 md:h-24 transition-all duration-500 rounded-sm md:rounded-full border-2 p-1.5",
                        !activeSubSlug 
                            ? "border-or scale-110 shadow-lg shadow-or/10 ring-4 ring-or/5" 
                            : "border-creme2 group-hover:border-or/40"
                    )}>
                        <div className="w-full h-full rounded-[2px] md:rounded-full bg-encre flex items-center justify-center overflow-hidden">
                             <div className="text-creme text-[8px] font-black uppercase tracking-widest text-center px-2">TOUT</div>
                        </div>
                    </div>
                </div>

                {subCategories.map((sub: any) => (
                    <div
                        key={sub.id}
                        onClick={() => onSelect(sub.slug)}
                        className={cn(
                            "flex flex-col items-center cursor-pointer group transition-all duration-500",
                            !activeSubSlug 
                                ? "w-full md:w-auto md:flex-shrink-0 md:snap-start mb-6" 
                                : "flex-shrink-0 snap-start max-w-[120px]"
                        )}
                    >
                        <div className={cn(
                            "transition-all duration-500 relative border-2 p-1.5",
                            !activeSubSlug 
                                ? "w-full aspect-square rounded-[50px] md:rounded-[40px]" 
                                : "w-24 h-24 md:w-28 md:h-28 rounded-[35px]",
                            activeSubSlug === sub.slug 
                                ? "border-or scale-110 shadow-lg shadow-or/10 ring-4 ring-or/5" 
                                : "border-creme2 group-hover:border-or/40"
                        )}>
                            <div className={cn(
                                "w-full h-full bg-creme2 overflow-hidden relative",
                                !activeSubSlug ? "rounded-[44px] md:rounded-[34px]" : "rounded-[29px]"
                            )}>
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
                                <div className="absolute top-2 right-2 w-5 h-5 bg-rouge-deep rounded-full border-4 border-white shadow-lg animate-pulse" />
                            )}
                        </div>
                        <div className="text-center mt-4 flex flex-col items-center justify-start min-h-[44px] w-full px-1">
                            <p className={cn(
                                "font-black uppercase tracking-[0.1em] transition-colors leading-tight mb-1",
                                !activeSubSlug ? "text-[12px] md:text-[9px]" : "text-[10px]",
                                activeSubSlug === sub.slug ? "text-encre font-black" : "text-encre3 group-hover:text-encre"
                            )}>
                                {sub.name}
                            </p>
                            <p className="text-[9px] font-bold text-or/60 group-hover:text-or transition-colors uppercase whitespace-nowrap">{sub.productCount || 0} modèles</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
