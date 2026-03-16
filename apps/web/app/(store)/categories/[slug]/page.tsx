'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import ProductCard from '@/components/store/products/ProductCard';
import ProductFilters, { FilterState } from '@/components/store/products/ProductFilters';
import { useEffect, useState } from 'react';
import { StoreAPI } from '@/lib/api/client';
import ProductSort from '@/components/store/products/ProductSort';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2, AlertCircle } from 'lucide-react';

const FALLBACK_CATEGORY = { name: 'Catégorie', description: 'Découvrez notre sélection.' };

export default function CategoryPage() {
    const { slug } = useParams();
    const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
    const [categoryInfo, setCategoryInfo] = useState<any>(FALLBACK_CATEGORY);
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState<FilterState>({
        category: slug as string,
        priceRanges: [],
        inStock: false
    });
    const [sortBy, setSortBy] = useState('newest');

    // Update internal category filter when URL slug changes
    useEffect(() => {
        if (slug) {
            setFilters(prev => ({ ...prev, category: slug as string }));
        }
    }, [slug]);

    useEffect(() => {
        let mounted = true;
        async function load() {
            setLoading(true);
            try {
                // Prepare params for API
                const params: any = { category: filters.category };
                if (filters.inStock) params.inStock = 'true';
                
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

                if (sortBy === 'price-asc') {
                    params.sortBy = 'price';
                    params.order = 'asc';
                } else if (sortBy === 'price-desc') {
                    params.sortBy = 'price';
                    params.order = 'desc';
                } else if (sortBy === 'popular') {
                    params.badge = 'top';
                }

                const res = await StoreAPI.getProducts(1, 24, params);
                if (res.success) {
                    const paginated = res.data?.data || res.data;
                    const items = paginated?.items || paginated || [];
                    if (mounted) setProducts(items);
                }

                // Fetch category info once
                if (mounted && categoryInfo.name === 'Catégorie') {
                    const catRes = await StoreAPI.getCategories();
                    if (catRes.success) {
                        const catList = catRes.data || [];
                        const found = catList.find((c: any) => c.slug === slug);
                        if (found && mounted) setCategoryInfo(found);
                    }
                }
            } catch (err) {
                console.error('Category load error:', err);
            } finally {
                if (mounted) setLoading(false);
            }
        }
        load();
        return () => { mounted = false; };
    }, [filters, sortBy, slug]);

    return (
        <div className="pt-32 pb-24 bg-creme min-h-screen">
            <div className="container mx-auto px-4">
                {/* Header / Breadcrumbs */}
                <div className="mb-8 flex items-center justify-between">
                    <nav className="text-[10px] uppercase tracking-[0.2em] text-encre3 flex items-center space-x-2 font-black">
                        <Link href="/" className="hover:text-or transition-colors">Accueil</Link>
                        <span className="opacity-30">/</span>
                        <Link href="/catalogue" className="hover:text-or transition-colors">Catalogue</Link>
                        <span className="opacity-30">/</span>
                        <span className="text-encre underline decoration-or/40 underline-offset-4">{categoryInfo.name}</span>
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
                                <Loader2 size={40} className="animate-spin text-or mb-4" />
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-encre3">Chargement de la collection...</p>
                            </div>
                        ) : (
                            <>
                                {products.length > 0 ? (
                                    <motion.div 
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8"
                                    >
                                        {products.map((product) => (
                                            <ProductCard key={product.id} product={product as any} />
                                        ))}
                                    </motion.div>
                                ) : (
                                    <div className="bg-white border border-creme2 p-20 text-center rounded-sm shadow-xl flex flex-col items-center">
                                        <div className="w-16 h-16 bg-creme rounded-full flex items-center justify-center mb-6">
                                            <AlertCircle size={32} className="text-encre3" strokeWidth={1} />
                                        </div>
                                        <h3 className="font-serif text-2xl text-encre mb-4">La collection est vide</h3>
                                        <p className="text-encre3 text-sm max-w-sm mb-8 leading-relaxed">
                                            Nous n'avons trouvé aucun produit dans cette catégorie avec les filtres sélectionnés.
                                        </p>
                                        <Link href="/catalogue" className="text-or font-black uppercase tracking-[0.2em] text-[10px] border-b-2 border-or/20 pb-1 hover:border-or transition-all">
                                            Explorer tout le catalogue
                                        </Link>
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
                                <button onClick={() => setIsMobileFiltersOpen(false)} className="text-encre">
                                    <X size={24} />
                                </button>
                            </div>
                            <ProductFilters 
                                currentFilters={filters}
                                onFilterChange={setFilters}
                                onClose={() => setIsMobileFiltersOpen(false)} 
                            />
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
