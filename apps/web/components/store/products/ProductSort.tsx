'use client';

import { ListFilter } from 'lucide-react';

interface ProductSortProps {
    total: number;
    onOpenFilters: () => void;
}

export default function ProductSort({ total, onOpenFilters }: ProductSortProps) {
    return (
        <div className="flex flex-col md:flex-row justify-between items-center py-6 border-b border-creme2 mb-10 space-y-4 md:space-y-0">
            <div className="text-sm text-encre3">
                Affichage de <span className="text-encre font-bold">{total}</span> produits sélectionnés
            </div>

            <div className="flex items-center space-x-6">
                <button
                    onClick={onOpenFilters}
                    className="lg:hidden flex items-center text-sm font-bold uppercase tracking-widest text-encre hover:text-or transition-colors"
                >
                    <ListFilter size={18} className="mr-2" />
                    Filtres
                </button>

                <div className="flex items-center space-x-3">
                    <label htmlFor="sort" className="text-xs uppercase tracking-widest font-bold text-encre3">Trier par :</label>
                    <select
                        id="sort"
                        className="text-sm border-none bg-transparent focus:ring-0 font-medium text-encre cursor-pointer"
                    >
                        <option value="newest">Nouveautés</option>
                        <option value="price-asc">Prix : Croissant</option>
                        <option value="price-desc">Prix : Décroissant</option>
                        <option value="popular">Populaires</option>
                    </select>
                </div>
            </div>
        </div>
    );
}
