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
                {/* "All" Widget - Always Horizontal if activeSubSlug */}
                <div 
                    onClick={() => onSelect(null)}
                    className={cn(
                        "cursor-pointer group transition-all duration-500",
                        !activeSubSlug 
                            ? "hidden md:flex flex-col items-center flex-shrink-0 snap-start" 
                            : "flex flex-col flex-shrink-0 snap-start max-w-[120px] md:max-w-[200px]"
                    )}
                >
                    <div className={cn(
                        "w-full bg-white shadow-sm hover:shadow-lg rounded-[24px] overflow-hidden flex flex-col border-2",
                        !activeSubSlug ? "border-or shadow-or/10 ring-4 ring-or/5" : "border-rouge-brand/20 hover:border-rouge-brand/50"
                    )}>
                        <div className="relative aspect-[4/5] w-full bg-encre flex items-center justify-center overflow-hidden border-b-2 border-rouge-brand/10">
                            <span className="text-creme text-[10px] md:text-xs font-black uppercase tracking-widest text-center px-4">TOUT VOIR</span>
                        </div>
                        <div className="p-3 md:p-4 text-center flex-grow flex flex-col justify-center">
                            <p className={cn(
                                "font-serif text-[12px] md:text-lg transition-colors line-clamp-2 md:line-clamp-1 leading-tight",
                                !activeSubSlug ? "text-or font-bold" : "text-encre group-hover:text-rouge-mid"
                            )}>
                                Général
                            </p>
                        </div>
                    </div>
                </div>

                {subCategories.map((sub: any) => {
                    const isActive = activeSubSlug === sub.slug;
                    return (
                        <div
                            key={sub.id}
                            onClick={() => onSelect(sub.slug)}
                            className={cn(
                                "cursor-pointer group transition-all duration-500",
                                !activeSubSlug
                                    ? "w-full flex flex-col md:max-w-[200px] md:flex-shrink-0 md:snap-start mb-6"
                                    : "flex flex-col flex-shrink-0 snap-start w-[140px] md:max-w-[200px]" // Use reasonable width in horizontal scroll
                            )}
                        >
                            <div className={cn(
                                "w-full bg-white shadow-sm hover:shadow-2xl rounded-[24px] overflow-hidden flex flex-col transition-all duration-500 border-2",
                                isActive 
                                    ? "border-or scale-[1.02] md:scale-105 shadow-xl shadow-or/10 ring-4 ring-or/10" 
                                    : "border-rouge-brand hover:border-rouge-brand/50"
                            )}>
                                <div className="relative aspect-[4/5] w-full bg-creme2 overflow-hidden border-b-2 border-rouge-brand/10">
                                    {sub.imageUrl ? (
                                        <img 
                                            src={sub.imageUrl} 
                                            alt={sub.name} 
                                            className={cn(
                                                "absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out",
                                                !isActive && "group-hover:scale-105"
                                            )} 
                                        />
                                    ) : (
                                        <img 
                                            src={`https://images.unsplash.com/photo-1632345033839-245a1e2ca9cb?q=80&w=200`}
                                            alt={sub.name}
                                            className={cn(
                                                "absolute inset-0 w-full h-full object-cover opacity-50 grayscale transition-transform duration-700 ease-out",
                                                !isActive && "group-hover:scale-105"
                                            )}
                                        />
                                    )}
                                    {sub.hasNewArrivals && (
                                        <div className="absolute top-2 left-2 md:top-3 md:left-3 z-10">
                                            <span className="text-[7px] md:text-[8px] font-black uppercase tracking-[0.2em] px-1.5 md:px-2 py-0.5 md:py-1 rounded-sm shadow-md bg-rouge-brand text-gold-brand border border-gold-brand/20">
                                                Nouveau
                                            </span>
                                        </div>
                                    )}
                                    <div className="absolute inset-x-0 bottom-0 p-2 md:p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-gradient-to-t from-encre/80 via-encre/40 to-transparent z-20 flex justify-center hidden md:flex">
                                        <span className="text-creme text-[8px] md:text-[9px] font-bold uppercase tracking-widest">{isActive ? "Séléctionné" : "Explorer"}</span>
                                    </div>
                                </div>
                                <div className="p-2 md:p-4 text-center flex-grow flex flex-col justify-center">
                                    <p className={cn(
                                        "font-serif text-[12px] md:text-lg transition-colors line-clamp-2 md:line-clamp-1 mb-0.5 md:mb-1 leading-tight",
                                        isActive ? "text-or font-bold" : "text-encre group-hover:text-rouge-mid"
                                    )}>
                                        {sub.name}
                                    </p>
                                    <p className="text-[7px] md:text-[8px] font-bold text-or/80 uppercase tracking-widest">
                                        {sub.productCount || 0} modèles
                                    </p>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
