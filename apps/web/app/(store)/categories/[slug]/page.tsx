'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import ProductCard from '@/components/store/products/ProductCard';
import ProductFilters, { FilterState } from '@/components/store/products/ProductFilters';
import { useEffect, useState } from 'react';
import { StoreAPI } from '@/lib/api/client';
import ProductSort from '@/components/store/products/ProductSort';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2, AlertCircle, SlidersHorizontal, ArrowRight, Filter } from 'lucide-react';
import { cn } from '@/lib/utils';
import SubCategoryWidgets from '@/components/store/products/SubCategoryWidgets';
import ProductCardSkeleton from '@/components/store/products/ProductCardSkeleton';

const FALLBACK_CATEGORY = { name: 'Catégorie', description: 'Découvrez notre sélection méticuleusement choisie.' };

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
                if (mounted && (categoryInfo.name === 'Catégorie' || categoryInfo.slug !== slug)) {
                    const catRes = await StoreAPI.getCategoryBySlug(slug as string);
                    if (catRes.success) {
                        if (mounted) setCategoryInfo(catRes.data);
                    }
                }

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

                const res = await StoreAPI.getProducts(1, 48, params);
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

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    return (
        <div className="pt-32 pb-24 bg-creme min-h-screen selection:bg-or selection:text-white">
            <div className="container mx-auto px-4">
                {/* Header Section */}
                <div className="mb-12">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div className="space-y-4">
                            <nav className="text-[9px] uppercase tracking-[0.3em] text-encre3 flex items-center space-x-3 font-black">
                                <Link href="/" className="hover:text-or transition-colors">Accueil</Link>
                                <span className="opacity-20">/</span>
                                <Link href="/catalogue" className="hover:text-or transition-colors">Catalogue</Link>
                                <span className="opacity-20">/</span>
                                <span className={cn(
                                    "transition-all cursor-pointer",
                                    filters.subCategory ? "text-encre3 hover:text-encre" : "text-or underline-offset-4"
                                )} onClick={() => setFilters(prev => ({ ...prev, subCategory: null }))}>
                                    {categoryInfo.name}
                                </span>
                                {filters.subCategory && (
                                    <>
                                        <span className="opacity-20">/</span>
                                        <span className="text-or">{activeSubCategory?.name}</span>
                                    </>
                                )}
                            </nav>
                            <h1 className="font-serif text-4xl md:text-6xl text-encre tracking-tight leading-none">
                                {activeSubCategory?.name || categoryInfo.name}
                            </h1>
                            <p className="text-encre3 text-sm max-w-2xl leading-relaxed italic border-l-2 border-or/20 pl-6 py-1">
                                {activeSubCategory?.description || categoryInfo.description}
                            </p>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="hidden lg:flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-creme2 shadow-sm text-[10px] font-black uppercase tracking-widest text-encre3">
                                <SlidersHorizontal size={12} className="text-or" />
                                {products.length} Items disponible
                            </div>
                            <button 
                                onClick={() => setIsMobileFiltersOpen(true)}
                                className="lg:hidden flex items-center gap-3 px-6 py-3 bg-encre text-creme rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-xl active:scale-95 transition-all"
                            >
                                <Filter size={14} />
                                Filtrer
                            </button>
                        </div>
                    </div>
                </div>

                {/* Sub-categories Universe Section */}
                <div className="animate-in fade-in slide-in-from-top-4 duration-1000">
                    <SubCategoryWidgets 
                        subCategories={categoryInfo.subCategories || []}
                        activeSubSlug={filters.subCategory}
                        onSelect={(slug) => setFilters(prev => ({ ...prev, subCategory: slug }))}
                        title={`L'Univers ${categoryInfo.name}`}
                        subtitle="Plus de précision"
                    />
                </div>

                <div className="flex flex-col lg:flex-row gap-12 items-start mt-4">
                    {/* Desktop Sidebar */}
                    <aside className="hidden lg:block w-72 shrink-0 sticky top-32 group">
                        <div className="bg-white/40 backdrop-blur-xl p-8 rounded-2xl border border-white/60 shadow-xl shadow-encre/5 ring-1 ring-black/[0.02]">
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-encre select-none">Filtres Artisanal</h3>
                                <div className="w-1.5 h-1.5 rounded-full bg-or animate-pulse" />
                            </div>
                            <ProductFilters 
                                currentFilters={filters}
                                onFilterChange={setFilters}
                            />
                        </div>

                        {/* Help Widget */}
                        <div className="mt-8 p-6 bg-white border border-creme2 rounded-2xl overflow-hidden relative group shadow-sm hover:shadow-md transition-shadow">
                            <h4 className="font-serif text-lg mb-2 text-encre">Service Client</h4>
                            <p className="text-[10px] text-encre3 leading-relaxed mb-4 uppercase tracking-widest font-bold">Conseils & Disponibilité</p>
                            <Link href="/contact" className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-or hover:gap-4 transition-all">
                                Nous parler <ArrowRight size={12} />
                            </Link>
                        </div>
                    </aside>

                    {/* Main Content Area */}
                    <section className="flex-grow">
                        <div className="mb-10">
                            <ProductSort 
                                total={products.length}
                                currentSort={sortBy}
                                onSortChange={setSortBy}
                                onOpenFilters={() => setIsMobileFiltersOpen(true)}
                            />
                        </div>

                        {loading ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8 md:gap-10">
                                {[...Array(6)].map((_, i) => (
                                    <ProductCardSkeleton key={i} />
                                ))}
                            </div>
                        ) : (
                            <>
                                {products.length > 0 ? (
                                    <motion.div 
                                        variants={container}
                                        initial="hidden"
                                        animate="show"
                                        className={cn(
                                            "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8 md:gap-10",
                                            !filters.subCategory && "hidden md:grid" // Hide on mobile if no sub
                                        )}
                                    >
                                        {products.map((product) => (
                                            <ProductCard key={product.id} product={product as any} />
                                        ))}
                                    </motion.div>
                                ) : (
                                    <motion.div 
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className={cn(
                                            "bg-white/50 backdrop-blur-sm border border-creme2 border-dashed p-20 text-center rounded-3xl shadow-sm flex flex-col items-center",
                                            !filters.subCategory && "hidden md:flex"
                                        )}
                                    >
                                        <div className="w-20 h-20 bg-creme rounded-full flex items-center justify-center mb-8 shadow-inner ring-8 ring-creme/50">
                                            <AlertCircle size={40} className="text-encre3" strokeWidth={1} />
                                        </div>
                                        <h3 className="font-serif text-3xl text-encre mb-4">Un désert de beauté?</h3>
                                        <p className="text-encre3 text-sm max-w-sm mb-10 leading-relaxed font-medium">
                                            Aucun produit ne correspond à ces filtres. Essayez d'élargir vos horizons.
                                        </p>
                                        <button 
                                            onClick={() => setFilters({ category: slug as string, subCategory: null, priceRanges: [], inStock: false })}
                                            className="px-8 py-4 bg-encre text-creme text-[10px] font-black uppercase tracking-[0.3em] rounded-full hover:bg-black transition-all shadow-xl -mt-4 active:scale-95"
                                        >
                                            Effacer tout
                                        </button>
                                    </motion.div>
                                )}

                                {/* Mobile Selection Message if no sub-category */}
                                {!filters.subCategory && (
                                    <div className="md:hidden flex flex-col items-center justify-center p-12 text-center bg-white/30 backdrop-blur-md rounded-3xl border border-creme2 border-dashed">
                                        <div className="w-12 h-12 bg-or/10 rounded-full flex items-center justify-center mb-4">
                                            <ArrowRight size={20} className="text-or" />
                                        </div>
                                        <h4 className="font-serif text-xl text-encre mb-2">Explorez la collection</h4>
                                        <p className="text-[10px] text-encre3 uppercase tracking-widest font-bold">Choisissez un univers ci-dessus pour voir les produits</p>
                                    </div>
                                )}

                                {/* Pagination */}
                                {products.length >= 12 && (
                                    <div className={cn(
                                        "mt-24 flex flex-col items-center space-y-6",
                                        !filters.subCategory && "hidden md:flex"
                                    )}>
                                        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-encre/30 font-serif italic">Défilement continu de luxe</p>
                                        <div className="flex items-center gap-2 p-1.5 bg-white rounded-full border border-creme2 shadow-sm">
                                            <button className="w-12 h-12 rounded-full bg-encre text-or flex items-center justify-center text-xs font-black shadow-lg">01</button>
                                            <button className="w-12 h-12 rounded-full text-encre3 hover:bg-creme transition-colors flex items-center justify-center text-xs font-bold hover:scale-110">02</button>
                                            <button className="w-12 h-12 rounded-full text-encre3 hover:bg-creme transition-colors flex items-center justify-center text-xs font-bold hover:scale-110">03</button>
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
                            className="fixed inset-0 bg-encre/80 backdrop-blur-md z-[100]"
                        />
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                            className="fixed top-0 right-0 h-full w-[90%] max-w-md bg-creme z-[110] shadow-2xl overflow-y-auto"
                        >
                            <div className="flex flex-col h-full">
                                <div className="flex justify-between items-center p-8 sticky top-0 bg-creme/90 backdrop-blur-md z-10 border-b border-creme2">
                                    <div className="flex flex-col">
                                        <h3 className="font-serif text-3xl text-encre leading-none">Filtres</h3>
                                        <span className="text-[9px] font-black uppercase tracking-widest text-or mt-2">Affinez votre sélection</span>
                                    </div>
                                    <button 
                                        onClick={() => setIsMobileFiltersOpen(false)} 
                                        className="w-10 h-10 rounded-full border border-creme2 flex items-center justify-center text-encre hover:rotate-90 transition-transform active:scale-90"
                                    >
                                        <X size={20} />
                                    </button>
                                </div>
                                <div className="p-8 flex-grow">
                                    <ProductFilters 
                                        currentFilters={filters}
                                        onFilterChange={setFilters}
                                        onClose={() => setIsMobileFiltersOpen(false)} 
                                    />
                                </div>
                                <div className="p-8 bg-white border-t border-creme2 sticky bottom-0">
                                    <button 
                                        onClick={() => setIsMobileFiltersOpen(false)}
                                        className="w-full bg-encre text-creme py-5 text-[10px] font-black uppercase tracking-[0.3em] rounded-full shadow-2xl active:scale-95 transition-all"
                                    >
                                        Valider
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
