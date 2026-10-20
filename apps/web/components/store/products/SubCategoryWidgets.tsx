'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';
import { formatImageUrl } from '@/lib/utils/image';

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
    showAllButton?: boolean;
}

const CATEGORY_DEFAULT_IMAGES: Record<string, string> = {
    'vernis--couleurs': 'https://hnnsaruuigqchikzdiro.supabase.co/storage/v1/object/public/products/e572a715-7818-4367-9127-8a6130e6b774.webp',
    'matriel': 'https://hnnsaruuigqchikzdiro.supabase.co/storage/v1/object/public/products/715de6aa-e62f-42ad-99ca-7972a199302b.webp',
    'construction--technique': 'https://hnnsaruuigqchikzdiro.supabase.co/storage/v1/object/public/products/e4a86494-0ba6-4f74-b6d1-048d4feb8996.webp',
    'nail-art--dcoration': 'https://hnnsaruuigqchikzdiro.supabase.co/storage/v1/object/public/products/62b0d839-6237-4b68-843f-a0f5ce1bec9c.webp'
};

export default function SubCategoryWidgets({ 
    subCategories, 
    activeSubSlug, 
    onSelect,
    title = "Explorez nos univers",
    subtitle = "Collections Principales",
    showAllButton = true,
}: SubCategoryWidgetsProps) {
    if (!subCategories || subCategories.length === 0) return null;

    return (
        <div className="mb-12 -mx-4 px-4 sm:mx-0 sm:px-0">
            <div className="flex items-center justify-between mb-6 md:mb-8 border-b border-creme2 pb-3">
                <div className="flex flex-col">
                    <h2 className="text-[10px] md:text-xs font-black uppercase tracking-[0.3em] text-encre">{title}</h2>
                    <p className="text-[8px] md:text-[9px] text-or font-bold uppercase tracking-widest mt-1">{subtitle}</p>
                </div>
                {activeSubSlug && (
                    <button 
                        onClick={() => onSelect(null)}
                        className="flex items-center gap-2 group transition-all"
                    >
                        <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-encre3 group-hover:text-rouge-mid">Tout voir</span>
                        <div className="w-5 h-5 rounded-full border border-creme2 flex items-center justify-center group-hover:bg-creme transition-colors">
                            <X size={10} className="text-encre3" />
                        </div>
                    </button>
                )}
            </div>
            
            <div className="flex items-start gap-4 md:gap-6 overflow-x-auto no-scrollbar pb-4 snap-x">
                {/* "Tout Voir" General Card */}
                {showAllButton && (
                    <div 
                        onClick={() => onSelect(null)}
                        className="flex flex-col flex-shrink-0 snap-start w-[110px] sm:w-[130px] md:w-[160px] cursor-pointer group transition-all duration-300"
                    >
                        <div className={cn(
                            "w-full bg-white shadow-sm hover:shadow-lg rounded-[20px] overflow-hidden flex flex-col border-2 transition-all duration-300",
                            !activeSubSlug ? "border-or shadow-or/15 ring-2 ring-or/10" : "border-gold-brand/15 hover:border-gold-brand/40"
                        )}>
                            <div className="relative aspect-[4/5] w-full bg-encre flex items-center justify-center overflow-hidden border-b border-gold-brand/15">
                                <span className="text-creme text-[9px] md:text-[11px] font-black uppercase tracking-widest text-center px-2">TOUT VOIR</span>
                            </div>
                            <div className="p-2 sm:p-3 text-center flex-grow flex flex-col justify-center bg-white">
                                <p className={cn(
                                    "font-italiana text-xs md:text-sm font-bold tracking-wide transition-colors line-clamp-1 leading-tight",
                                    !activeSubSlug ? "text-or font-bold" : "text-encre group-hover:text-rouge-mid"
                                )}>
                                    Toutes
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {subCategories.map((sub: any) => {
                    const isActive = activeSubSlug === sub.slug;
                    const rawImg = sub.imageUrl || sub.image || '';
                    const displayImg = (!rawImg || rawImg.includes('placeholder'))
                        ? (CATEGORY_DEFAULT_IMAGES[sub.slug] || 'https://images.unsplash.com/photo-1632345033839-245a1e2ca9cb?q=80&w=400')
                        : formatImageUrl(rawImg);

                    return (
                        <div
                            key={sub.id || sub.slug}
                            onClick={() => onSelect(sub.slug)}
                            className="flex flex-col flex-shrink-0 snap-start w-[125px] sm:w-[145px] md:w-[180px] cursor-pointer group transition-all duration-300"
                        >
                            <div className={cn(
                                "w-full bg-white shadow-sm hover:shadow-2xl rounded-[20px] overflow-hidden flex flex-col transition-all duration-300 border-2",
                                isActive 
                                    ? "border-or scale-[1.02] shadow-xl shadow-or/15 ring-2 ring-or/15" 
                                    : "border-gold-brand/15 hover:border-gold-brand/40"
                            )}>
                                <div className="relative aspect-[4/5] w-full bg-creme2 overflow-hidden border-b border-gold-brand/15">
                                    <img 
                                        src={displayImg} 
                                        alt={sub.name} 
                                        className={cn(
                                            "absolute inset-0 w-full h-full object-cover transition-transform duration-500 ease-out",
                                            !isActive && "group-hover:scale-105"
                                        )} 
                                        loading="lazy"
                                    />
                                    {sub.hasNewArrivals && (
                                        <div className="absolute top-2 left-2 z-10">
                                            <span className="text-[7px] font-black uppercase tracking-[0.2em] px-1.5 py-0.5 rounded-sm shadow-md bg-rouge-brand text-gold-brand border border-gold-brand/20">
                                                Nouveau
                                            </span>
                                        </div>
                                    )}
                                    <div className="absolute inset-x-0 bottom-0 p-2 translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-gradient-to-t from-encre/80 via-encre/40 to-transparent z-20 hidden md:flex justify-center">
                                        <span className="text-creme text-[8px] font-bold uppercase tracking-widest">{isActive ? "Sélectionné" : "Explorer"}</span>
                                    </div>
                                </div>
                                <div className="p-2 sm:p-3 text-center flex-grow flex flex-col justify-center bg-white">
                                    <p className="font-playfair italic text-[8px] md:text-[9px] text-gold-brand uppercase tracking-[0.2em] mb-0.5">Collection</p>
                                    <h3 className={cn(
                                        "font-italiana text-xs md:text-sm font-bold tracking-wide transition-colors line-clamp-1 leading-tight",
                                        isActive ? "text-or font-bold" : "text-encre group-hover:text-rouge-mid"
                                    )}>
                                        {sub.name}
                                    </h3>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
