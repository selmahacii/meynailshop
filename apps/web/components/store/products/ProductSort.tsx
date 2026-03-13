'use client';

import { ListFilter, ChevronDown } from 'lucide-react';

interface ProductSortProps {
    total: number;
    onOpenFilters: () => void;
}

export default function ProductSort({ total, onOpenFilters }: ProductSortProps) {
    return (
        <div className="flex flex-col md:flex-row justify-between items-center py-8 mb-12 space-y-4 md:space-y-0">
            <div className="text-[11px] md:text-xs text-encre3 font-medium">
                Affichage de <span className="text-encre font-bold">{total}</span> produits
            </div>

            <div className="flex items-center space-x-6">
                <button
                    onClick={onOpenFilters}
                    className="lg:hidden flex items-center text-[10px] font-black uppercase tracking-[0.2em] text-encre hover:text-or transition-colors"
                >
                    <ListFilter size={16} className="mr-2" />
                    Filtres
                </button>

                <div className="flex items-center space-x-4 bg-white px-6 py-2 border border-creme2 rounded-sm shadow-sm">
                    <label htmlFor="sort" className="text-[10px] uppercase tracking-[0.2em] font-black text-encre3 whitespace-nowrap">Trier par</label>
                    <div className="relative">
                        <select
                            id="sort"
                            className="text-xs md:text-sm border-none bg-transparent focus:ring-0 font-bold text-encre cursor-pointer pr-8 py-1 appearance-none"
                        >
                            <option value="newest">Nouveautés</option>
                            <option value="price-asc">Prix : Croissant</option>
                            <option value="price-desc">Prix : Décroissant</option>
                            <option value="popular">Populaires</option>
                        </select>
                        <ChevronDown size={14} className="absolute right-0 top-1/2 -translate-y-1/2 text-encre/40 pointer-events-none" />
                    </div>
                </div>
            </div>
        </div>
    );
}
