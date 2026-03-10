'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import ProductCard from '@/components/store/products/ProductCard';
import ProductFilters from '@/components/store/products/ProductFilters';
import { useEffect, useState } from 'react';
import { StoreAPI } from '@/lib/api/client';

const FALLBACK_CATEGORY = { name: 'Catégorie', description: 'Découvrez notre sélection.' };

export default function CategoryPage() {
    const { slug } = useParams();
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
                {/* Header Section */}
                <div className="max-w-4xl mb-16">
                    <nav className="text-[10px] uppercase tracking-widest text-encre3 mb-6 flex items-center">
                        <Link href="/" className="hover:text-or transition-colors">Accueil</Link>
                        <ChevronRight size={10} className="mx-2" />
                        <Link href="/catalogue" className="hover:text-or transition-colors">Catalogue</Link>
                        <ChevronRight size={10} className="mx-2" />
                        <span className="text-encre font-bold">{categoryInfo.name}</span>
                    </nav>

                    <h1 className="font-serif text-5xl md:text-6xl text-encre mb-6">{categoryInfo.name}</h1>
                    <p className="text-encre3 text-lg font-light max-w-2xl leading-relaxed">
                        {categoryInfo.description}
                    </p>
                </div>

                <div className="flex flex-col lg:flex-row gap-12">
                    {/* Filters Sidebar */}
                    <aside className="w-full lg:w-64 shrink-0">
                        <div className="sticky top-32">
                            <ProductFilters />
                        </div>
                    </aside>

                    {/* Product Grid */}
                    <div className="flex-grow">
                        {products.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
                                {products.map((product) => (
                                    <ProductCard key={product.id} product={product as any} />
                                ))}
                            </div>
                        ) : (
                            <div className="bg-white border border-creme2 p-16 text-center rounded-sm">
                                <p className="text-encre3 mb-6">Aucun produit trouvé dans cette catégorie pour le moment.</p>
                                <Link href="/catalogue" className="text-or font-bold uppercase tracking-widest text-xs underline">
                                    Voir tout le catalogue
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
