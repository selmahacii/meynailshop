'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import ProductCard from '@/components/store/products/ProductCard';
import ProductFilters, { FilterState } from '@/components/store/products/ProductFilters';
import ProductSort from '@/components/store/products/ProductSort';
import { Product } from '@/types/product';
import { StoreAPI } from '@/lib/api/client';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2, AlertCircle } from 'lucide-react';

export default function CataloguePage() {
    const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState<FilterState>({
        category: null,
        priceRanges: [],
        inStock: false
    });
    const [sortBy, setSortBy] = useState('newest');

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                // Prepare params for API
                const params: any = {};
                
                if (filters.category) params.category = filters.category;
                if (filters.inStock) params.inStock = 'true';
                
                // Handle price ranges (simplified to take min/max of all selected)
                if (filters.priceRanges.length > 0) {
                    let min = Infinity;
                    let max = 0;
                    filters.priceRanges.forEach(range => {
                        const [rMin, rMax] = range.split('-');
                        min = Math.min(min, parseInt(rMin));
                        if (rMax === 'UP') max = 999999;
                        else max = Math.max(max, parseInt(rMax));
                    });
                    params.minPrice = min === Infinity ? 0 : min;
                    params.maxPrice = max;
                }

                // Handle sorting
                if (sortBy === 'price-asc') {
                    params.sortBy = 'price';
                    params.order = 'asc';
                } else if (sortBy === 'price-desc') {
                    params.sortBy = 'price';
                    params.order = 'desc';
                } else if (sortBy === 'popular') {
                    params.badge = 'top';
                }

                const res = await StoreAPI.getProducts(1, 50, params);
                if (res.success) {
                    const paginated = res.data?.data || res.data;
                    const items = paginated?.items || paginated || [];
                    setProducts(items);
                } else {
                    setProducts([]);
                }
            } catch (err) {
                console.error('Catalogue fetch error:', err);
                setProducts([]);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, [filters, sortBy]);

    return (
        <div className="pt-32 pb-24 bg-creme min-h-screen font-sans">
            <div className="container mx-auto px-4">
                {/* Header / Breadcrumbs */}
                <div className="mb-8 flex items-center justify-between">
                    <nav className="text-[10px] uppercase tracking-[0.2em] text-encre3 flex items-center space-x-2 font-black">
                        <Link href="/" className="hover:text-or transition-colors">Accueil</Link>
                        <span className="opacity-30">/</span>
                        <span className="text-encre underline decoration-or/40 underline-offset-4">Catalogue</span>
                    </nav>
                </div>

                <div className="flex flex-col lg:flex-row gap-12">
                    {/* Desktop Sidebar */}
                    <aside className="hidden lg:block w-72 shrink-0">
                        <div className="sticky top-32">
                            <ProductFilters 
                                currentFilters={filters}
                                onFilterChange={setFilters}
                            />
                        </div>
                    </aside>

                    {/* Main Content */}
                    <section className="flex-grow">
                        <ProductSort
                            total={products.length}
                            currentSort={sortBy}
                            onSortChange={setSortBy}
                            onOpenFilters={() => setIsMobileFiltersOpen(true)}
                        />

                        {loading ? (
                            <div className="flex flex-col items-center justify-center h-96 bg-white/50 rounded-sm border border-creme2 border-dashed">
                                <Loader2 size={40} className="animate-spin text-or mb-4" strokeWidth={1.5} />
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-encre3">Exploration du catalogue...</p>
                            </div>
                        ) : (
                            <>
                                {products.length > 0 ? (
                                    <motion.div 
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8 md:gap-10"
                                    >
                                        {products.map((product) => (
                                            <ProductCard key={product.id} product={product} />
                                        ))}
                                    </motion.div>
                                ) : (
                                    <div className="bg-white border border-creme2 p-20 text-center rounded-sm shadow-xl flex flex-col items-center">
                                        <div className="w-16 h-16 bg-creme rounded-full flex items-center justify-center mb-6">
                                            <AlertCircle size={32} className="text-encre3" strokeWidth={1} />
                                        </div>
                                        <h3 className="font-serif text-2xl text-encre mb-4">Aucun produit trouvé</h3>
                                        <p className="text-encre3 text-sm max-w-sm mb-8 leading-relaxed">
                                            Nous n'avons trouvé aucun produit correspondant à vos critères de recherche. Essayez de modifier vos filtres.
                                        </p>
                                        <button 
                                            onClick={() => setFilters({ category: null, priceRanges: [], inStock: false })}
                                            className="text-or font-black uppercase tracking-[0.2em] text-[10px] border-b-2 border-or/20 pb-1 hover:border-or transition-all"
                                        >
                                            Réinitialiser les filtres
                                        </button>
                                    </div>
                                )}

                                {/* Pagination (Simplified for now) */}
                                {products.length >= 12 && (
                                    <div className="mt-20 flex justify-center">
                                        <div className="p-1 bg-white border border-creme2 rounded-sm shadow-lg flex space-x-1">
                                            <button className="w-10 h-10 bg-[#1A0A0A] text-or flex items-center justify-center text-[10px] font-bold">01</button>
                                            <button className="w-10 h-10 text-encre3 hover:bg-creme transition-colors flex items-center justify-center text-[10px] font-bold">02</button>
                                            <button className="w-10 h-10 text-encre3 hover:bg-creme transition-colors flex items-center justify-center text-[10px] font-bold">03</button>
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </section>
                </div>
            </div>

            {/* Mobile Filters Drawer */}
            <AnimatePresence>
                {isMobileFiltersOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsMobileFiltersOpen(false)}
                            className="fixed inset-0 bg-encre/60 backdrop-blur-sm z-[100]"
                        />
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed top-0 right-0 h-full w-[85%] max-w-sm bg-creme z-[110] p-8 overflow-y-auto"
                        >
                            <div className="flex justify-between items-center mb-10">
                                <h3 className="font-serif text-2xl text-encre">Filtres</h3>
                                <button onClick={() => setIsMobileFiltersOpen(false)} className="text-encre hover:rotate-90 transition-transform">
                                    <X size={24} />
                                </button>
                            </div>
                            <ProductFilters 
                                currentFilters={filters}
                                onFilterChange={(newFilters) => {
                                    setFilters(newFilters);
                                    // Optionally keep drawer open or close on category change
                                }}
                                onClose={() => setIsMobileFiltersOpen(false)} 
                            />
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
