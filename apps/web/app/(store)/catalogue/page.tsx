'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import ProductCard from '@/components/store/products/ProductCard';
import ProductFilters, { FilterState } from '@/components/store/products/ProductFilters';
import ProductSort from '@/components/store/products/ProductSort';
import { Product } from '@/types/product';
import { StoreAPI } from '@/lib/api/client';
import { motion, AnimatePresence } from 'framer-motion';
import ProductCardSkeleton from '@/components/store/products/ProductCardSkeleton';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import { X, Loader2, AlertCircle, Filter, SlidersHorizontal, ArrowRight } from 'lucide-react';
import SubCategoryWidgets from '@/components/store/products/SubCategoryWidgets';
import { cn } from '@/lib/utils';
import { useSearchParams, useRouter } from 'next/navigation';

import { Suspense } from 'react';

function CatalogueContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState<FilterState>({
        category: searchParams.get('category') || null,
        subCategory: searchParams.get('subCategory') || null,
        priceRanges: [],
        inStock: false
    });
    const [sortBy, setSortBy] = useState('newest');
    const [activeCategoryData, setActiveCategoryData] = useState<any>(null);
    const [allCategories, setAllCategories] = useState<any[]>([]);

    // Sync filters with URL when page loads or URL changes (for back button/navigation)
    useEffect(() => {
        const cat = searchParams.get('category');
        const sub = searchParams.get('subCategory');
        
        if (cat !== filters.category || sub !== filters.subCategory) {
            setFilters(prev => ({
                ...prev,
                category: cat,
                subCategory: sub
            }));
        }
    }, [searchParams]);

    useEffect(() => {
        const fetchCategoryData = async () => {
            try {
                const res = await StoreAPI.getCategories();
                if (res.success) {
                    setAllCategories(res.data);
                    if (filters.category) {
                        const cat = res.data.find((c: any) => c.slug === filters.category);
                        setActiveCategoryData(cat);
                    } else {
                        setActiveCategoryData(null);
                    }
                }
            } catch (err) {
                console.error(err);
            }
        };
        fetchCategoryData();
    }, [filters.category]);

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                // Prepare params for API
                const params: any = {};
                
                if (filters.category) params.category = filters.category;
                if (filters.subCategory) params.subCategory = filters.subCategory;
                if (filters.inStock) params.inStock = 'true';
                if (filters.isNew) params.badge = 'new';
                
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
        <div className="pt-32 pb-24 bg-creme min-h-screen font-sans selection:bg-or selection:text-white">
            <div className="container mx-auto px-4">
                {/* Header Section */}
                <div className="mb-12">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div className="space-y-4">
                            <Breadcrumbs 
                                items={[
                                    { label: 'Catalogue', href: '/catalogue' }, 
                                    ...(filters.category ? [{ label: activeCategoryData?.name || 'Catégorie' }] : [])
                                ]} 
                            />
                            <h1 className="font-serif text-3xl md:text-5xl lg:text-7xl text-encre tracking-tight leading-none">
                                {activeCategoryData?.name || "Le Catalogue"}
                            </h1>
                            <p className="text-encre3 text-[11px] md:text-sm max-w-xl italic leading-relaxed border-l-2 border-or/20 pl-4 py-1">
                                {activeCategoryData?.description || "Découvrez notre collection méticuleusement sélectionnée de produits d'onglerie et soins de luxe."}
                            </p>
                        </div>

                        <div className={cn(
                            "flex items-center gap-3",
                            !filters.subCategory && "hidden md:flex" // Hide counts/mobile-filter-btn on mobile if no sub-category
                        )}>
                            <div className="hidden lg:flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-creme2 shadow-sm text-[10px] font-black uppercase tracking-widest text-encre3">
                                <SlidersHorizontal size={12} className="text-or" />
                                {products.length} Produits trouvés
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

                {/* Universe Widgets */}
                <div className="animate-in fade-in slide-in-from-top-4 duration-1000">
                    <SubCategoryWidgets 
                        subCategories={activeCategoryData ? (activeCategoryData.subCategories || []) : allCategories}
                        activeSubSlug={activeCategoryData ? filters.subCategory : filters.category}
                        onSelect={(slug) => {
                            if (activeCategoryData) {
                                setFilters(prev => ({ ...prev, subCategory: slug }));
                                router.push(`/catalogue?category=${filters.category}${slug ? `&subCategory=${slug}` : ''}`);
                            } else {
                                setFilters(prev => ({ ...prev, category: slug, subCategory: null }));
                                router.push(`/catalogue?category=${slug}`);
                            }
                        }}
                        title={activeCategoryData ? `Collection ${activeCategoryData.name}` : "Collections Populaires"}
                        subtitle={activeCategoryData ? "Explorez par sous-catégorie" : "Explorez par univers"}
                    />
                </div>

                {/* Return/Reset Banner */}
                {filters.category && (
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-12 flex items-center gap-3 bg-white/60 backdrop-blur-md p-2 pl-6 pr-2 rounded-full border border-or/20 shadow-sm w-fit mx-auto lg:mx-0 group cursor-pointer hover:border-or/60 transition-all"
                    >
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-encre">
                            {filters.subCategory ? activeCategoryData?.subCategories?.find((s:any) => s.slug === filters.subCategory)?.name : activeCategoryData?.name}
                        </span>
                        <button 
                            onClick={() => {
                                if (filters.subCategory) {
                                    setFilters(prev => ({ ...prev, subCategory: null }));
                                } else {
                                    setFilters(prev => ({ ...prev, category: null, subCategory: null }));
                                }
                            }}
                            className="w-8 h-8 rounded-full bg-creme flex items-center justify-center text-encre hover:bg-rouge hover:text-white transition-all shadow-inner"
                        >
                            <X size={14} />
                        </button>
                    </motion.div>
                )}

                <div className="flex flex-col lg:flex-row gap-12 items-start">
                    {/* Desktop Sidebar - Premium Style */}
                    <aside className="hidden lg:block w-72 shrink-0 sticky top-32 group">
                        <div className="bg-white/40 backdrop-blur-xl p-8 rounded-2xl border border-white/60 shadow-xl shadow-encre/5 ring-1 ring-black/[0.02]">
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-encre select-none">Filtres Raffinés</h3>
                                <div className="w-1.5 h-1.5 rounded-full bg-or animate-pulse" />
                            </div>
                            <ProductFilters 
                                currentFilters={filters}
                                onFilterChange={setFilters}
                            />
                        </div>
                        
                        {/* Help Widget */}
                        <div className="mt-8 p-6 bg-encre rounded-2xl text-creme overflow-hidden relative group">
                            <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/3 w-32 h-32 bg-or/30 blur-3xl rounded-full" />
                            <h4 className="font-serif text-lg mb-2 relative z-10">Besoin d'aide ?</h4>
                            <p className="text-[10px] text-creme/60 leading-relaxed mb-4 relative z-10 uppercase tracking-widest font-bold">Nos expertes sont là pour vous guider.</p>
                            <Link href="/contact" className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-or hover:gap-4 transition-all relative z-10">
                                Contactez-nous <ArrowRight size={12} />
                            </Link>
                        </div>
                    </aside>

                    {/* Main Content Area */}
                    <section className="flex-grow">
                        <div className={cn(
                            "mb-10",
                            !filters.subCategory && "hidden md:block" // Hide sort/filter on mobile if no sub-category
                        )}>
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
                                            !filters.subCategory && filters.category && "hidden" // Hide products completely if category selected but no sub-selected
                                        )}
                                    >
                                        {products.map((product) => (
                                            <ProductCard key={product.id} product={product} />
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
                                        <h3 className="font-serif text-3xl text-encre mb-4">Collection Introuvable</h3>
                                        <p className="text-encre3 text-sm max-w-sm mb-10 leading-relaxed font-medium">
                                            Nos expertes n'ont pas trouvé de produits correspondant à vos critères actuels.
                                        </p>
                                        <button 
                                            onClick={() => setFilters({ category: null, subCategory: null, priceRanges: [], inStock: false })}
                                            className="px-8 py-4 bg-encre text-creme text-[10px] font-black uppercase tracking-[0.3em] rounded-full hover:bg-black transition-all shadow-xl -mt-4 active:scale-95"
                                        >
                                            Réinitialiser la vue
                                        </button>
                                    </motion.div>
                                )}

                                {/* Selection Message if no sub-category */}
                                {!filters.subCategory && filters.category && (
                                    <div className="flex flex-col items-center justify-center p-12 md:p-24 text-center bg-white/30 backdrop-blur-md rounded-[40px] border border-creme2 border-dashed shadow-inner w-full">
                                        <div className="w-16 h-16 bg-or/10 rounded-full flex items-center justify-center mb-6 ring-8 ring-or/5">
                                            <ArrowRight size={24} className="text-or animate-bounce-x" />
                                        </div>
                                        <h4 className="font-serif text-2xl md:text-4xl text-encre mb-4">
                                            Découvrez nos collections
                                        </h4>
                                        <p className="text-[10px] md:text-sm text-encre3 uppercase tracking-widest font-bold max-w-sm leading-relaxed">
                                            Sélectionnez une sous-catégorie ci-dessus pour explorer les produits de la collection {activeCategoryData?.name}
                                        </p>
                                    </div>
                                )}

                                {/* Pagination Design */}
                                {products.length >= 12 && (
                                    <div className={cn(
                                        "mt-24 flex flex-col items-center space-y-6",
                                        !filters.subCategory && "hidden md:flex"
                                    )}>
                                        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-encre/30">Continuez l'exploration</p>
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

            {/* Mobile Filters Overlay - Premium Drawer */}
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
                                        <span className="text-[9px] font-black uppercase tracking-widest text-or mt-2">Personnalisez votre boutique</span>
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
                                        onFilterChange={(newFilters) => {
                                            setFilters(newFilters);
                                        }}
                                        onClose={() => setIsMobileFiltersOpen(false)} 
                                    />
                                </div>
                                <div className="p-8 bg-white border-t border-creme2 sticky bottom-0">
                                    <button 
                                        onClick={() => setIsMobileFiltersOpen(false)}
                                        className="w-full bg-encre text-creme py-5 text-[10px] font-black uppercase tracking-[0.3em] rounded-full shadow-2xl active:scale-95 transition-all"
                                    >
                                        Appliquer les changements
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

export default function CataloguePage() {
    return (
        <Suspense fallback={
            <div className="pt-32 pb-24 flex items-center justify-center min-h-screen">
                <Loader2 className="animate-spin text-or" size={40} />
            </div>
        }>
            <CatalogueContent />
        </Suspense>
    );
}
