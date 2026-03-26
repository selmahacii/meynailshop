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

export default function SubCategoryPage() {
    const { slug, subSlug } = useParams();
    const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
    const [title, setTitle] = useState('Chargement...');
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState<FilterState>({
        category: slug as string,
        subCategory: subSlug as string,
        priceRanges: [],
        inStock: false
    });
    const [sortBy, setSortBy] = useState('newest');

    useEffect(() => {
        async function load() {
            setLoading(true);
            try {
                // Prepare params for API
                // Our API expects 'category' and optionally 'subCategory' (by slug)
                const params: any = { 
                    category: slug as string,
                    subCategory: subSlug as string 
                };
                
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
                }

                const res = await StoreAPI.getProducts(1, 48, params);
                if (res.success) {
                    const paginated = res.data?.data || res.data;
                    setProducts(paginated?.items || paginated || []);
                }

                // Get titles
                const catRes = await StoreAPI.getCategories();
                if (catRes.success) {
                    const cat = catRes.data.find((c: any) => c.slug === slug);
                    if (cat) {
                        const sub = cat.subCategories?.find((s: any) => s.slug === subSlug);
                        setTitle(`${cat.name} — ${sub?.name || subSlug}`);
                    }
                }
            } catch (err) {
                console.error('SubCategory load error:', err);
            } finally {
                setLoading(false);
            }
        }
        load();
    }, [filters, sortBy, slug, subSlug]);

    return (
        <div className="pt-32 pb-24 bg-creme min-h-screen">
            <div className="container mx-auto px-4">
                <div className="mb-8 flex items-center justify-between">
                    <nav className="text-[10px] uppercase tracking-[0.2em] text-encre3 flex items-center space-x-2 font-black">
                        <Link href="/" className="hover:text-or transition-colors">Accueil</Link>
                        <span className="opacity-30">/</span>
                        <Link href={`/categories/${slug}`} className="hover:text-or transition-colors uppercase">{slug}</Link>
                        <span className="opacity-30">/</span>
                        <span className="text-encre underline decoration-or/40 underline-offset-4">{subSlug}</span>
                    </nav>
                </div>

                <div className="flex flex-col lg:flex-row gap-12">
                    <aside className="hidden lg:block w-72 shrink-0">
                        <div className="sticky top-32">
                            <ProductFilters currentFilters={filters} onFilterChange={setFilters} />
                        </div>
                    </aside>

                    <section className="flex-grow">
                        <div className="mb-8">
                           <h1 className="text-4xl font-serif text-encre mb-2">{title}</h1>
                           <div className="h-1 w-20 bg-or"></div>
                        </div>

                        <ProductSort 
                            total={products.length}
                            currentSort={sortBy}
                            onSortChange={setSortBy}
                            onOpenFilters={() => setIsMobileFiltersOpen(true)}
                        />

                        {loading ? (
                            <div className="flex flex-col items-center justify-center h-96">
                                <Loader2 size={40} className="animate-spin text-or mb-4" />
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
                                {products.map((p) => <ProductCard key={p.id} product={p} />)}
                            </div>
                        )}
                    </section>
                </div>
            </div>
        </div>
    );
}
