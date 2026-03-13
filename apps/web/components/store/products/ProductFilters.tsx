'use client';

import { useEffect, useState } from 'react';
import { X, ChevronDown, Check, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { StoreAPI } from '@/lib/api/client';

interface Category {
    name: string;
    slug: string;
}

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
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await StoreAPI.getCategories();
                if (res.success) {
                    setCategories(res.data || []);
                }
            } catch (err) {
                console.error('Failed to fetch categories:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchCategories();
    }, []);

    return (
        <div className="space-y-12">
            {/* Categories */}
            <div className="bg-white p-6 md:p-8 rounded-sm border border-creme2 shadow-sm">
                <h4 className="font-serif text-lg text-encre mb-8 flex items-center justify-between border-b border-creme2 pb-4">
                    Catégories
                    <ChevronDown size={14} className="text-encre3" />
                </h4>
                {loading ? (
                    <div className="flex justify-center py-6">
                        <Loader2 size={24} className="animate-spin text-or" />
                    </div>
                ) : (
                    <div className="space-y-4">
                        <button
                            onClick={() => setActiveCategory(null)}
                            className={cn(
                                "text-[11px] font-black uppercase tracking-[0.2em] w-full text-left px-5 py-3 transition-all rounded-sm",
                                activeCategory === null ? "bg-creme text-rouge-mid shadow-sm" : "text-encre3 hover:bg-creme/30"
                            )}
                        >
                            • Tous les produits
                        </button>
                        <ul className="space-y-1 pl-4">
                            {categories.map((cat) => (
                                <li key={cat.slug}>
                                    <button
                                        onClick={() => setActiveCategory(cat.slug)}
                                        className={cn(
                                            "text-xs md:text-[13px] transition-all py-2.5 px-4 w-full text-left rounded-sm font-medium",
                                            activeCategory === cat.slug ? "text-rouge-mid font-bold" : "text-encre3 hover:text-encre hover:bg-creme/20"
                                        )}
                                    >
                                        {cat.name}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>

            {/* Price */}
            <div className="bg-white p-6 md:p-8 rounded-sm border border-creme2 shadow-sm">
                <h4 className="font-serif text-lg text-encre mb-8 flex items-center justify-between border-b border-creme2 pb-4">
                    Tranche de Prix
                    <ChevronDown size={14} className="text-encre3" />
                </h4>
                <div className="space-y-6">
                    {priceRanges.map((range) => (
                        <label key={range.value} className="flex items-center group cursor-pointer">
                            <div className="relative flex items-center justify-center">
                                <input type="checkbox" className="peer appearance-none w-6 h-6 border border-creme2 rounded-sm checked:bg-[#3D1414] checked:border-[#3D1414] transition-all bg-white" />
                                <Check size={14} className="absolute text-creme opacity-0 peer-checked:opacity-100 transition-opacity" />
                            </div>
                            <span className="ml-4 text-xs md:text-sm text-encre3 group-hover:text-encre transition-colors font-medium">{range.label}</span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Availability */}
            <div className="bg-white p-6 md:p-8 rounded-sm border border-creme2 shadow-sm">
                <h4 className="font-serif text-lg text-encre mb-8 flex items-center justify-between border-b border-creme2 pb-4">
                    Disponibilité
                </h4>
                <label className="flex items-center justify-between group cursor-pointer">
                    <span className="text-[10px] md:text-[11px] font-black uppercase tracking-[0.2em] text-encre3 group-hover:text-encre transition-colors">En Stock Uniquement</span>
                    <div className="relative">
                        <input type="checkbox" className="peer sr-only" />
                        <div className="w-12 h-6 bg-creme2 rounded-full transition-colors peer-checked:bg-[#3D1414]"></div>
                        <div className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-6 shadow-sm"></div>
                    </div>
                </label>
            </div>

            <button className="w-full bg-[#3D1414] text-creme py-5 text-[10px] font-black uppercase tracking-[0.3em] rounded-sm hover:bg-black transition-all shadow-xl border border-or/20 active:scale-95 leading-none">
                Réinitialiser
            </button>
        </div>
    );
}
