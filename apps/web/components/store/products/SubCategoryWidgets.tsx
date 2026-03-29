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

                {subCategories.map((sub: any) => {
                    const isCardStyle = !activeSubSlug;
                    return (
                        <div
                            key={sub.id}
                            onClick={() => onSelect(sub.slug)}
                            className={cn(
                                "cursor-pointer group transition-all duration-500",
                                isCardStyle
                                    ? "w-full bg-white border-2 border-rouge-brand shadow-sm hover:shadow-2xl hover:border-rouge-brand/50 rounded-[24px] overflow-hidden flex flex-col md:max-w-[200px] md:flex-shrink-0 md:snap-start mb-6"
                                    : "flex flex-col items-center flex-shrink-0 snap-start max-w-[100px]"
                            )}
                        >
                            {isCardStyle ? (
                                <>
                                    <div className="relative aspect-[4/5] w-full bg-creme2 overflow-hidden border-b-2 border-rouge-brand/10">
                                        {sub.imageUrl ? (
                                            <img 
                                                src={sub.imageUrl} 
                                                alt={sub.name} 
                                                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" 
                                            />
                                        ) : (
                                            <img 
                                                src={`https://images.unsplash.com/photo-1632345033839-245a1e2ca9cb?q=80&w=200`}
                                                alt={sub.name}
                                                className="absolute inset-0 w-full h-full object-cover opacity-50 grayscale group-hover:scale-105 transition-transform duration-700 ease-out"
                                            />
                                        )}
                                        {sub.hasNewArrivals && (
                                            <div className="absolute top-3 left-3 z-10">
                                                <span className="text-[8px] font-black uppercase tracking-[0.2em] px-2 py-1 rounded-sm shadow-md bg-rouge-brand text-gold-brand border border-gold-brand/20">
                                                    Nouveau
                                                </span>
                                            </div>
                                        )}
                                        <div className="absolute inset-x-0 bottom-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-gradient-to-t from-encre/80 via-encre/40 to-transparent z-20 md:flex justify-center hidden">
                                            <span className="text-creme text-[9px] font-bold uppercase tracking-widest">Explorer</span>
                                        </div>
                                    </div>
                                    <div className="p-4 text-center flex-grow flex flex-col justify-center">
                                        <p className="font-serif text-[14px] md:text-lg text-encre group-hover:text-rouge-mid transition-colors line-clamp-2 md:line-clamp-1 mb-1 leading-tight">
                                            {sub.name}
                                        </p>
                                        <p className="text-[8px] md:text-[9px] font-bold text-or/80 uppercase tracking-widest">
                                            {sub.productCount || 0} modèles
                                        </p>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className={cn(
                                        "transition-all duration-500 relative border-2 p-1 w-24 h-24 md:w-24 md:h-24 rounded-[35px]",
                                        activeSubSlug === sub.slug 
                                            ? "border-or scale-110 shadow-lg shadow-or/10 ring-4 ring-or/5" 
                                            : "border-rouge-brand group-hover:border-rouge-brand/40"
                                    )}>
                                        <div className="w-full h-full bg-creme2 overflow-hidden relative rounded-[31px]">
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
                                            <div className="absolute top-1 right-1 w-4 h-4 bg-rouge-deep rounded-full border-2 border-white shadow-lg animate-pulse" />
                                        )}
                                    </div>
                                    <div className="text-center mt-3 flex flex-col items-center">
                                        <p className={cn(
                                            "text-[9px] md:text-[10px] font-black uppercase tracking-[0.1em] transition-colors leading-tight mb-1",
                                            activeSubSlug === sub.slug ? "text-encre" : "text-encre3 group-hover:text-encre"
                                        )}>
                                            {sub.name}
                                        </p>
                                    </div>
                                </>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
