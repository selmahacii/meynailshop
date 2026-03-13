'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import ProductCard from '@/components/store/products/ProductCard';
import ProductFilters from '@/components/store/products/ProductFilters';
import { useEffect, useState } from 'react';
import { StoreAPI } from '@/lib/api/client';
import ProductSort from '@/components/store/products/ProductSort';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2 } from 'lucide-react';

const FALLBACK_CATEGORY = { name: 'Catégorie', description: 'Découvrez notre sélection.' };

export default function CategoryPage() {
    const { slug } = useParams();
    const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
    const [categoryInfo, setCategoryInfo] = useState<any>(FALLBACK_CATEGORY);
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let mounted = true;
        async function load() {
            setLoading(true);
            try {
                // Try to fetch products filtered by category slug
                const res = await StoreAPI.getProducts(1, 24, { category: slug });
                if (res.success) {
                    const paginated = res.data?.data || res.data;
                    const items = paginated?.items || paginated || [];
                    if (mounted) setProducts(items);
                }
                // Try to fetch categories to get description
                const catRes = await StoreAPI.getCategories();
                if (catRes.success) {
                    const catList = catRes.data || [];
                    const found = catList.find((c: any) => c.slug === slug);
                    if (found && mounted) setCategoryInfo(found);
                }
            } catch (err) {
                console.error('Category load error:', err);
            } finally {
                if (mounted) setLoading(false);
            }
        }
        load();
        return () => { mounted = false; };
    }, [slug]);

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
                        <span className="text-encre">{categoryInfo.name}</span>
                    </nav>
                </div>

                <div className="flex flex-col lg:flex-row gap-12">
                    {/* Desktop Sidebar */}
                    <aside className="hidden lg:block w-72 shrink-0">
                        <div className="sticky top-32">
                            <ProductFilters />
                        </div>
                    </aside>

                    {/* Main Content */}
                    <section className="flex-grow">
                        <ProductSort 
                            total={products.length}
                            onOpenFilters={() => setIsMobileFiltersOpen(true)}
                        />

                        {loading ? (
                            <div className="flex items-center justify-center h-64">
                                <Loader2 size={32} className="animate-spin text-or" />
                            </div>
                        ) : (
                            <>
                                {products.length > 0 ? (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
                                        {products.map((product) => (
                                            <ProductCard key={product.id} product={product as any} />
                                        ))}
                                    </div>
                                ) : (
                                    <div className="bg-white border border-creme2 p-16 text-center rounded-sm">
                                        <p className="text-encre3 mb-6 font-serif text-lg">Aucun produit trouvé dans cette catégorie.</p>
                                        <Link href="/catalogue" className="text-or font-black uppercase tracking-[0.2em] text-[10px] border-b border-or pb-1 hover:text-rouge-deep hover:border-rouge-deep transition-all">
                                            Voir tout le catalogue
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
                            <ProductFilters onClose={() => setIsMobileFiltersOpen(false)} />
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
