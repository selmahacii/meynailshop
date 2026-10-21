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
import { formatImageUrl } from '@/lib/utils/image';
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
        inStock: false,
        isNew: searchParams.get('isNew') === 'true',
        search: searchParams.get('search') || null
    });
    const [sortBy, setSortBy] = useState(searchParams.get('badge') === 'top' ? 'popular' : 'newest');
    const [activeCategoryData, setActiveCategoryData] = useState<any>(null);
    const [allCategories, setAllCategories] = useState<any[]>([]);
    const [subCategoryFilter, setSubCategoryFilter] = useState<string>('all');
    const isSubCategoriesView = searchParams.get('view') === 'sous-categories' || searchParams.get('view') === 'subcategories';

    // Sync filters with URL when page loads or URL changes (for back button/navigation)
    useEffect(() => {
        const cat = searchParams.get('category');
        const sub = searchParams.get('subCategory');
        const isNew = searchParams.get('isNew') === 'true';
        const badge = searchParams.get('badge');
        const search = searchParams.get('search');
        
        if (cat !== filters.category || sub !== filters.subCategory || isNew !== filters.isNew || search !== filters.search) {
            setFilters(prev => ({
                ...prev,
                category: cat,
                subCategory: sub,
                isNew: isNew,
                search: search
            }));
        }

        if (badge === 'top' && sortBy !== 'popular') {
            setSortBy('popular');
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
                if (filters.search) params.search = filters.search;
                
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
                    params.sortBy = 'popular';
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

    const allSubCategories = allCategories.flatMap((cat: any) => 
        (cat.subCategories || []).map((sub: any) => ({
            ...sub,
            categoryName: cat.name,
            categorySlug: cat.slug
        }))
    );

    const filteredSubCategories = subCategoryFilter === 'all'
        ? allSubCategories
        : allSubCategories.filter((sub: any) => sub.categorySlug === subCategoryFilter);

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
                                    ...(isSubCategoriesView 
                                        ? [{ label: 'Sous-catégories' }] 
                                        : (filters.category ? [{ label: activeCategoryData?.name || 'Catégorie' }] : []))
                                ]} 
                            />
                             <h1 className="font-italiana font-normal text-4xl md:text-6xl lg:text-[5rem] text-encre tracking-wide leading-none">
                                {isSubCategoriesView 
                                    ? "Les Sous-Catégories" 
                                    : (activeCategoryData?.name || "Le Catalogue")}
                            </h1>
                            <p className="text-encre/70 text-[11px] md:text-sm max-w-xl font-playfair font-light italic leading-relaxed border-l border-gold-brand/35 pl-5 py-1">
                                {isSubCategoriesView 
                                    ? "Accédez directement à vos gammes spécialisées pour découvrir tous les produits associés." 
                                    : (activeCategoryData?.description || "Découvrez notre collection méticuleusement sélectionnée de produits d'onglerie et soins de luxe.")}
                            </p>
                        </div>

                        <div className="flex items-center gap-3">
                            {(filters.category || filters.search) && (
                                <button 
                                    onClick={() => setIsMobileFiltersOpen(true)}
                                    className="lg:hidden flex items-center gap-3 px-6 py-3 bg-encre text-creme rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-xl active:scale-95 transition-all"
                                >
                                    <Filter size={14} />
                                    Filtrer
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Universe Widgets */}
                {/* Universe Widgets / Direct Sub-categories View */}
                {isSubCategoriesView ? (
                    <div className="space-y-8 animate-in fade-in duration-500 mb-12">
                        {/* Navigation / Switch back */}
                        <div className="flex items-center justify-between flex-wrap gap-4">
                            <Link 
                                href="/catalogue"
                                className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-rouge-mid hover:text-rouge active:scale-95 transition-all py-2 px-4 bg-white rounded-full border border-or/20 shadow-sm"
                            >
                                <span>← Voir les catégories principales</span>
                            </Link>
                            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gold-brand">
                                {filteredSubCategories.length} sous-catégories
                            </span>
                        </div>

                        {/* Category Filter Tabs */}
                        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2">
                            <button
                                onClick={() => setSubCategoryFilter('all')}
                                className={cn(
                                    "px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest whitespace-nowrap transition-all",
                                    subCategoryFilter === 'all'
                                        ? "bg-encre text-gold-brand shadow-md"
                                        : "bg-white/80 text-encre3 hover:text-encre border border-creme2"
                                )}
                            >
                                Toutes les collections
                            </button>
                            {allCategories.map((cat: any) => (
                                <button
                                    key={cat.id || cat.slug}
                                    onClick={() => setSubCategoryFilter(cat.slug)}
                                    className={cn(
                                        "px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest whitespace-nowrap transition-all",
                                        subCategoryFilter === cat.slug
                                            ? "bg-encre text-gold-brand shadow-md"
                                            : "bg-white/80 text-encre3 hover:text-encre border border-creme2"
                                    )}
                                >
                                    {cat.name}
                                </button>
                            ))}
                        </div>

                        {/* Sub-categories Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                            {filteredSubCategories.map((sub: any) => {
                                const categoryImages: Record<string, string> = {
                                    'vernis--couleurs': 'https://hnnsaruuigqchikzdiro.supabase.co/storage/v1/object/public/products/e572a715-7818-4367-9127-8a6130e6b774.webp',
                                    'vernis-couleurs': 'https://hnnsaruuigqchikzdiro.supabase.co/storage/v1/object/public/products/e572a715-7818-4367-9127-8a6130e6b774.webp',
                                    'matriel': 'https://hnnsaruuigqchikzdiro.supabase.co/storage/v1/object/public/products/715de6aa-e62f-42ad-99ca-7972a199302b.webp',
                                    'materiel': 'https://hnnsaruuigqchikzdiro.supabase.co/storage/v1/object/public/products/715de6aa-e62f-42ad-99ca-7972a199302b.webp',
                                    'construction--technique': 'https://hnnsaruuigqchikzdiro.supabase.co/storage/v1/object/public/products/e4a86494-0ba6-4f74-b6d1-048d4feb8996.webp',
                                    'construction-technique': 'https://hnnsaruuigqchikzdiro.supabase.co/storage/v1/object/public/products/e4a86494-0ba6-4f74-b6d1-048d4feb8996.webp',
                                    'nail-art--dcoration': 'https://hnnsaruuigqchikzdiro.supabase.co/storage/v1/object/public/products/62b0d839-6237-4b68-843f-a0f5ce1bec9c.webp',
                                    'nail-art-decoration': 'https://hnnsaruuigqchikzdiro.supabase.co/storage/v1/object/public/products/62b0d839-6237-4b68-843f-a0f5ce1bec9c.webp'
                                };

                                const rawImg = sub.imageUrl || sub.image || '';
                                const displayImg = (!rawImg || rawImg.includes('placeholder'))
                                    ? (categoryImages[sub.categorySlug] || 'https://images.unsplash.com/photo-1632345033839-245a1e2ca9cb?q=80&w=600&auto=format&fit=crop')
                                    : formatImageUrl(rawImg);

                                return (
                                    <Link
                                        key={sub.id || sub.slug}
                                        href={`/categories/${sub.categorySlug}?subCategory=${sub.slug}`}
                                        className="w-full bg-white border border-gold-brand/15 hover:border-gold-brand/40 transition-all duration-500 rounded-[20px] sm:rounded-[24px] overflow-hidden flex flex-col group cursor-pointer hover:-translate-y-1.5 shadow-sm hover:shadow-2xl hover:shadow-gold-brand/5 active:scale-95"
                                    >
                                        <div className="relative aspect-[4/5] w-full bg-creme2 overflow-hidden border-b border-gold-brand/10">
                                            <img 
                                                src={displayImg} 
                                                alt={sub.name} 
                                                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                                                loading="lazy"
                                            />
                                            <div className="absolute inset-0 bg-[#390102]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" />
                                            
                                            {/* Parent Category Badge */}
                                            <div className="absolute top-2 left-2 z-20">
                                                <span className="text-[7px] md:text-[8px] font-black uppercase tracking-[0.15em] px-2 py-0.5 rounded-sm shadow-md bg-white/90 backdrop-blur-sm text-encre border border-gold-brand/20">
                                                    {sub.categoryName}
                                                </span>
                                            </div>

                                            <div className="absolute inset-x-0 bottom-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-rouge-brand/90 backdrop-blur-sm z-20 md:flex justify-center hidden">
                                                <span className="text-gold-brand text-[9px] font-black uppercase tracking-[0.2em]">Voir les produits</span>
                                            </div>
                                        </div>

                                        <div className="p-3.5 sm:p-4 text-center flex-grow flex flex-col justify-center bg-white">
                                            <p className="font-playfair italic text-[9px] text-gold-brand uppercase tracking-[0.2em] mb-1">Collection</p>
                                            <h3 className="font-italiana text-xs sm:text-base font-bold text-encre group-hover:text-rouge-mid transition-colors duration-300 leading-tight min-h-[2.4em] flex items-center justify-center">
                                                {sub.name}
                                            </h3>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                ) : (
                    <div className="animate-in fade-in slide-in-from-top-4 duration-1000">
                        <SubCategoryWidgets 
                            subCategories={activeCategoryData ? (activeCategoryData.subCategories || []) : allCategories}
                            activeSubSlug={activeCategoryData ? filters.subCategory : filters.category}
                            onSelect={(slug) => {
                                if (activeCategoryData) {
                                    setFilters(prev => ({ ...prev, subCategory: slug }));
                                    if (slug) {
                                        router.push(`/catalogue?category=${filters.category}&subCategory=${slug}`);
                                    } else {
                                        router.push(`/catalogue?category=${filters.category}`);
                                    }
                                } else {
                                    setFilters(prev => ({ ...prev, category: slug, subCategory: null }));
                                    if (slug) {
                                        router.push(`/categories/${slug}`);
                                    } else {
                                        router.push('/catalogue');
                                    }
                                }
                            }}
                            title={activeCategoryData ? `Collection ${activeCategoryData.name}` : "Collections Populaires"}
                            subtitle={activeCategoryData ? "Explorez par sous-catégorie" : "Explorez par univers"}
                        />
                        {(!filters.category && !filters.search) && (
                            <p className="text-center text-[10px] font-bold uppercase tracking-[0.3em] text-encre3/60 py-6 md:hidden">
                                Choisissez une catégorie pour continuer
                            </p>
                        )}
                    </div>
                )}

                {/* Return/Reset Banner */}
                {(filters.category || filters.search) && (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="mb-12 flex flex-wrap items-center gap-4 animate-in fade-in"
                    >
                        {filters.category && (
                            <div className="flex items-center gap-3 bg-white/60 backdrop-blur-md p-2 pl-6 pr-2 rounded-full border border-or/20 shadow-sm group ">
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-encre">
                                    Collection: {filters.subCategory ? activeCategoryData?.subCategories?.find((s:any) => s.slug === filters.subCategory)?.name : activeCategoryData?.name}
                                </span>
                                <button 
                                    onClick={() => {
                                        if (filters.subCategory) {
                                            setFilters(prev => ({ ...prev, subCategory: null }));
                                            const params = new URLSearchParams(searchParams.toString());
                                            params.delete('subCategory');
                                            router.push(`/catalogue?${params.toString()}`);
                                        } else {
                                            setFilters(prev => ({ ...prev, category: null, subCategory: null }));
                                            const params = new URLSearchParams(searchParams.toString());
                                            params.delete('category');
                                            router.push(`/catalogue?${params.toString()}`);
                                        }
                                    }}
                                    className="w-8 h-8 rounded-full bg-creme flex items-center justify-center text-encre hover:bg-rouge hover:text-white transition-all shadow-inner"
                                >
                                    <X size={14} />
                                </button>
                            </div>
                        )}

                        {filters.search && (
                            <div className="flex items-center gap-3 bg-white/60 backdrop-blur-md p-2 pl-6 pr-2 rounded-full border border-or/20 shadow-sm group">
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-encre">
                                    Recherche: "{filters.search}"
                                </span>
                                <button 
                                    onClick={() => {
                                        setFilters(prev => ({ ...prev, search: null }));
                                        const params = new URLSearchParams(searchParams.toString());
                                        params.delete('search');
                                        router.push(`/catalogue?${params.toString()}`);
                                    }}
                                    className="w-8 h-8 rounded-full bg-creme flex items-center justify-center text-encre hover:bg-rouge hover:text-white transition-all shadow-inner"
                                >
                                    <X size={14} />
                                </button>
                            </div>
                        )}

                        <button 
                            onClick={() => {
                                setFilters({ category: null, subCategory: null, priceRanges: [], inStock: false });
                                router.push('/catalogue');
                            }}
                            className="text-[10px] font-bold text-encre3 hover:text-rouge transition-colors uppercase tracking-widest underline underline-offset-4"
                        >
                            Tout effacer
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
                    <section className={cn("flex-grow", ((!filters.category && !filters.search) || isSubCategoriesView) && "hidden md:block")}>
                        <div className="mb-10">
                            <ProductSort
                                total={products.length}
                                currentSort={sortBy}
                                onSortChange={setSortBy}
                                onOpenFilters={() => setIsMobileFiltersOpen(true)}
                            />
                        </div>

                        {loading ? (
                            <div className="grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-8 md:gap-10">
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
                                        className="grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-8 md:gap-10"
                                    >
                                        {products.map((product) => (
                                            <ProductCard key={product.id} product={product} />
                                        ))}
                                    </motion.div>
                                ) : (
                                    <motion.div 
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="bg-white/50 backdrop-blur-sm border border-creme2 border-dashed p-20 text-center rounded-3xl shadow-sm flex flex-col items-center"
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

                                {/* Pagination Design */}
                                {products.length >= 12 && (
                                    <div className="mt-24 flex flex-col items-center space-y-6">
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
