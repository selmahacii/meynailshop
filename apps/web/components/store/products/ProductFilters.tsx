'use client';

import { useState } from 'react';
import { X, ChevronDown, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

const categories = [
    { name: 'Vernis Gel', slug: 'vernis-gel' },
    { name: 'Gel UV & Résine', slug: 'gel-uv' },
    { name: 'Lampes & Appareils', slug: 'lampes' },
    { name: 'Pinceaux & Outils', slug: 'outils' },
    { name: 'Finition & Top Coat', slug: 'finition' },
];

const priceRanges = [
    { label: 'Moins de 1000 DA', value: '0-1000' },
    { label: '1000 DA - 2500 DA', value: '1000-2500' },
    { label: '2500 DA - 5000 DA', value: '2500-5000' },
    { label: 'Plus de 5000 DA', value: '5000-UP' },
];

interface ProductFiltersProps {
    onClose?: () => void;
}

export default function ProductFilters({ onClose }: ProductFiltersProps) {
    const [activeCategory, setActiveCategory] = useState<string | null>(null);

    return (
        <div className="space-y-10">
            {/* Categories */}
            <div>
                <h4 className="font-serif text-lg text-encre mb-6 flex items-center justify-between">
                    Catégories
                    <ChevronDown size={16} className="text-encre3" />
                </h4>
                <ul className="space-y-3">
                    {categories.map((cat) => (
                        <li key={cat.slug}>
                            <button
                                onClick={() => setActiveCategory(cat.slug)}
                                className={cn(
                                    "text-sm transition-colors flex items-center w-full",
                                    activeCategory === cat.slug ? "text-rouge-mid font-semibold" : "text-encre3 hover:text-encre"
                                )}
                            >
                                <span className={cn(
                                    "w-1.5 h-1.5 rounded-full mr-3 transition-all",
                                    activeCategory === cat.slug ? "bg-rouge-mid scale-100" : "bg-transparent scale-0"
                                )} />
                                {cat.name}
                            </button>
                        </li>
                    ))}
                </ul>
            </div>

            <div className="h-[1px] bg-creme2 w-full"></div>

            {/* Price */}
            <div>
                <h4 className="font-serif text-lg text-encre mb-6 flex items-center justify-between">
                    Tranche de Prix
                    <ChevronDown size={16} className="text-encre3" />
                </h4>
                <div className="space-y-4">
                    {priceRanges.map((range) => (
                        <label key={range.value} className="flex items-center group cursor-pointer">
                            <div className="relative flex items-center justify-center">
                                <input type="checkbox" className="peer appearance-none w-5 h-5 border border-creme2 rounded-sm checked:bg-or checked:border-or transition-all" />
                                <Check size={12} className="absolute text-rouge-deep opacity-0 peer-checked:opacity-100 transition-opacity" />
                            </div>
                            <span className="ml-3 text-sm text-encre3 group-hover:text-encre transition-colors">{range.label}</span>
                        </label>
                    ))}
                </div>
            </div>

            <div className="h-[1px] bg-creme2 w-full"></div>

            {/* Availability */}
            <div>
                <h4 className="font-serif text-lg text-encre mb-6 flex items-center justify-between">
                    Disponibilité
                </h4>
                <label className="flex items-center group cursor-pointer">
                    <div className="relative">
                        <input type="checkbox" className="peer sr-only" />
                        <div className="w-10 h-5 bg-creme2 rounded-full transition-colors peer-checked:bg-or"></div>
                        <div className="absolute top-1 left-1 w-3 h-3 bg-white rounded-full transition-transform peer-checked:translate-x-5"></div>
                    </div>
                    <span className="ml-3 text-sm text-encre3 uppercase tracking-widest text-[10px] font-bold">En Stock Uniquement</span>
                </label>
            </div>

            <button className="w-full bg-encre text-creme py-4 text-xs font-bold uppercase tracking-[0.2em] rounded-sm hover:bg-rouge-deep transition-colors shadow-sm">
                Réinitialiser les filtres
            </button>
        </div>
    );
}
