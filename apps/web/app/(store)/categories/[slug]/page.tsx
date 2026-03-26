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
import { cn } from '@/lib/utils';

const FALLBACK_CATEGORY = { name: 'Catégorie', description: 'Découvrez notre sélection.' };

export default function CategoryPage() {
    const { slug } = useParams();
    const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
    const [categoryInfo, setCategoryInfo] = useState<any>(FALLBACK_CATEGORY);
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState<FilterState>({
        category: slug as string,
        subCategory: null,
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
                // Fetch category info once or when slug changes
                if (mounted && (categoryInfo.name === 'Catégorie' || categoryInfo.slug !== slug)) {
                    const catRes = await StoreAPI.getCategoryBySlug(slug as string);
                    if (catRes.success) {
                        if (mounted) setCategoryInfo(catRes.data);
                    }
                }

                // Prepare params for API
                const params: any = { category: filters.category };
                if (filters.subCategory) params.subCategory = filters.subCategory;
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
            } catch (err) {
                console.error('Category load error:', err);
            } finally {
                if (mounted) setLoading(false);
            }
        }
        load();
        return () => { mounted = false; };
    }, [filters, sortBy, slug, categoryInfo.slug]);

    const activeSubCategory = categoryInfo.subCategories?.find((s: any) => s.slug === filters.subCategory);

    return (
        <div className="pt-32 pb-24 bg-creme min-h-screen">
            <div className="container mx-auto px-4">
                {/* Header / Breadcrumbs */}
                <div className="mb-12">
                    <nav className="text-[10px] uppercase tracking-[0.2em] text-encre3 flex items-center space-x-2 font-black mb-6">
                        <Link href="/" className="hover:text-or transition-colors">Accueil</Link>
                        <span className="opacity-30">/</span>
                        <Link href="/catalogue" className="hover:text-or transition-colors">Catalogue</Link>
                        <span className="opacity-30">/</span>
                        <span className={cn(
                            "transition-all cursor-pointer",
                            filters.subCategory ? "text-encre3 hover:text-encre" : "text-encre underline decoration-or/40 underline-offset-4"
                        )} onClick={() => setFilters(prev => ({ ...prev, subCategory: null }))}>
                            {categoryInfo.name}
                        </span>
                        {filters.subCategory && (
                            <>
                                <span className="opacity-30">/</span>
                                <span className="text-encre underline decoration-or/40 underline-offset-4">{activeSubCategory?.name}</span>
                            </>
                        )}
                    </nav>

                    <h1 className="font-serif text-4xl md:text-5xl text-encre mb-4">{activeSubCategory?.name || categoryInfo.name}</h1>
                    <p className="text-encre3 text-sm max-w-2xl leading-relaxed italic">{activeSubCategory?.description || categoryInfo.description}</p>
                </div>

                {/* Sub-categories Section (Only if no sub-category selected or as a header) */}
                {categoryInfo.subCategories && categoryInfo.subCategories.length > 0 && (
                    <div className="mb-16">
                        <div className="flex items-center justify-between mb-8 border-b border-creme2 pb-4">
                            <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-encre">Découvrir l'univers</h2>
                            <button 
                                onClick={() => setFilters(prev => ({ ...prev, subCategory: null }))}
                                className={cn(
                                    "text-[9px] font-black uppercase tracking-widest text-encre3 hover:text-or transition-all",
                                    !filters.subCategory && "hidden"
                                )}
                            >
                                Voir tout {categoryInfo.name}
                            </button>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
                            {categoryInfo.subCategories.map((sub: any) => (
                                <motion.div
                                    key={sub.id}
                                    whileHover={{ y: -5 }}
                                    onClick={() => setFilters(prev => ({ ...prev, subCategory: sub.slug }))}
                                    className={cn(
                                        "group cursor-pointer relative bg-white border border-creme2 p-4 md:p-6 transition-all shadow-sm hover:shadow-xl",
                                        filters.subCategory === sub.slug ? "ring-2 ring-or border-transparent" : "hover:border-or/40"
                                    )}
                                >
                                    <div className="aspect-[4/5] bg-creme2 mb-4 overflow-hidden relative">
                                        {sub.imageUrl ? (
                                            <img 
                                                src={sub.imageUrl} 
                                                alt={sub.name} 
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-creme3 font-serif italic text-4xl">M</div>
                                        )}
                                        {sub.hasNewArrivals && (
                                            <div className="absolute top-2 right-2 px-2 py-1 bg-rouge-deep text-white text-[8px] font-black uppercase tracking-widest shadow-lg">
                                                Nouveau
                                            </div>
                                        )}
                                    </div>
                                    <div className="space-y-1">
                                        <h3 className="font-serif text-lg text-encre group-hover:text-or transition-colors">{sub.name}</h3>
                                        <div className="flex items-center justify-between">
                                            <span className="text-[9px] font-black uppercase tracking-widest text-or">{sub.productCount || 0} Articles</span>
                                            <span className="text-[10px] text-encre font-bold group-hover:translate-x-1 transition-transform">→</span>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                )}

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
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-encre">
                                {filters.subCategory ? `Produits ${activeSubCategory?.name}` : `Tous les produits ${categoryInfo.name}`}
                            </h2>
                        </div>
                        
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
                                        <button 
                                            onClick={() => setFilters({ category: slug as string, subCategory: null, priceRanges: [], inStock: false })}
                                            className="text-or font-black uppercase tracking-[0.2em] text-[10px] border-b-2 border-or/20 pb-1 hover:border-or transition-all"
                                        >
                                            Effacer les filtres
                                        </button>
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
