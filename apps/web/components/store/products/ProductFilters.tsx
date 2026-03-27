'use client';

import { useEffect, useState } from 'react';
import { X, ChevronDown, Check, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { StoreAPI } from '@/lib/api/client';

interface Category {
    name: string;
    slug: string;
    imageUrl?: string;
    subCategories?: {
        id: string;
        name: string;
        slug: string;
        imageUrl?: string;
    }[];
}

export type FilterState = {
    category: string | null;
    subCategory: string | null;
    priceRanges: string[];
    inStock: boolean;
    isNew?: boolean;
};

const priceRanges = [
    { label: 'Moins de 1000 DA', value: '0-1000' },
    { label: '1000 DA - 2500 DA', value: '1000-2500' },
    { label: '2500 DA - 5000 DA', value: '2500-5000' },
    { label: 'Plus de 5000 DA', value: '5000-UP' },
];

interface ProductFiltersProps {
    onClose?: () => void;
    currentFilters: FilterState;
    onFilterChange: (filters: FilterState) => void;
}

export default function ProductFilters({ onClose, currentFilters, onFilterChange }: ProductFiltersProps) {
    const togglePriceRange = (range: string) => {
        const newRanges = currentFilters.priceRanges.includes(range)
            ? currentFilters.priceRanges.filter(r => r !== range)
            : [...currentFilters.priceRanges, range];
        onFilterChange({ ...currentFilters, priceRanges: newRanges });
    };

    const toggleStock = () => {
        onFilterChange({ ...currentFilters, inStock: !currentFilters.inStock });
    };

    const toggleNew = () => {
        onFilterChange({ ...currentFilters, isNew: !currentFilters.isNew });
    };

    const resetFilters = () => {
        onFilterChange({
            category: currentFilters.category, // Keep the active category from the universe
            subCategory: currentFilters.subCategory,
            priceRanges: [],
            inStock: false,
            isNew: false
        });
    };

    return (
        <div className="space-y-10">
            {/* Availability & Newness */}
            <div className="bg-white p-6 md:p-8 rounded-2xl border border-creme2 shadow-sm space-y-8">
                <h4 className="font-serif text-lg text-encre border-b border-creme2 pb-4 mb-2">Disponibilité</h4>
                
                <label className="flex items-center justify-between group cursor-pointer">
                    <span className="text-[10px] md:text-[11px] font-black uppercase tracking-[0.2em] text-encre3 group-hover:text-encre transition-colors">En Stock</span>
                    <div className="relative">
                        <input 
                            type="checkbox" 
                            checked={currentFilters.inStock}
                            onChange={toggleStock}
                            className="peer sr-only" 
                        />
                        <div className="w-12 h-6 bg-creme2 rounded-full transition-colors peer-checked:bg-rouge-brand"></div>
                        <div className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-6 shadow-sm"></div>
                    </div>
                </label>

                <label className="flex items-center justify-between group cursor-pointer pt-2">
                    <span className="text-[10px] md:text-[11px] font-black uppercase tracking-[0.2em] text-encre3 group-hover:text-encre transition-colors">Nouveautés</span>
                    <div className="relative">
                        <input 
                            type="checkbox" 
                            checked={currentFilters.isNew}
                            onChange={toggleNew}
                            className="peer sr-only" 
                        />
                        <div className="w-12 h-6 bg-creme2 rounded-full transition-colors peer-checked:bg-rouge-brand"></div>
                        <div className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-6 shadow-sm"></div>
                    </div>
                </label>
            </div>

            {/* Price */}
            <div className="bg-white p-6 md:p-8 rounded-2xl border border-creme2 shadow-sm">
                <h4 className="font-serif text-lg text-encre mb-8 flex items-center justify-between border-b border-creme2 pb-4">
                    Prix
                    <ChevronDown size={14} className="text-encre3" />
                </h4>
                <div className="space-y-6">
                    {priceRanges.map((range) => (
                        <label key={range.value} className="flex items-center group cursor-pointer">
                            <div className="relative flex items-center justify-center">
                                <input 
                                    type="checkbox" 
                                    checked={currentFilters.priceRanges.includes(range.value)}
                                    onChange={() => togglePriceRange(range.value)}
                                    className="peer appearance-none w-6 h-6 border border-creme2 rounded-sm checked:bg-rouge-brand checked:border-rouge-brand transition-all bg-white" 
                                />
                                <Check size={14} className="absolute text-creme opacity-0 peer-checked:opacity-100 transition-opacity" />
                            </div>
                            <span className="ml-4 text-xs md:text-sm text-encre3 group-hover:text-encre transition-colors font-medium">{range.label}</span>
                        </label>
                    ))}
                </div>
            </div>

            <button 
                onClick={resetFilters}
                className="w-full bg-rouge-brand text-creme py-5 text-[10px] font-black uppercase tracking-[0.3em] rounded-xl hover:bg-black transition-all shadow-xl border border-gold-brand/20 active:scale-95 leading-none"
            >
                Réinitialiser
            </button>
        </div>
    );
}
