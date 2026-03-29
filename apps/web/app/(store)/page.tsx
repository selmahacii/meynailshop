'use client';

import { useState, useEffect } from 'react';
import HeroSection from '@/components/store/home/HeroSection';
import Link from 'next/link';
import { StoreAPI } from '@/lib/api/client';
import ProductCard from '@/components/store/products/ProductCard';
import { Product } from '@/types/product';
import ProductCardSkeleton from '@/components/store/products/ProductCardSkeleton';
import CategorySkeleton from '@/components/store/home/CategorySkeleton';
import { Loader2 } from 'lucide-react';

export default function HomePage() {
    const [categories, setCategories] = useState<any[]>([]);
    const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [catRes, featRes] = await Promise.all([
                    StoreAPI.getCategories(),
                    StoreAPI.getFeatured()
                ]);

                if (catRes.success) {
                    console.log('📦 Categories Data:', catRes.data);
                    setCategories(catRes.data || []);
                }
                if (featRes.success) {
                    console.log('📦 Featured Products Data:', featRes.data);
                    setFeaturedProducts(featRes.data || []);
                }
            } catch (err) {
                console.error('Home data fetch error:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    return (
        <div className="bg-creme min-h-screen">
            <HeroSection />

            {/* Nos Catégories */}
            <section className="py-12 md:py-24 container mx-auto px-4">
                <div className="flex flex-col items-center mb-10 md:mb-16">
                    <h2 className="font-serif text-3xl md:text-4xl text-encre mb-4">Nos Catégories</h2>
                    <div className="w-16 md:w-20 h-1 bg-or"></div>
                </div>

                {loading && categories.length === 0 ? (
                    <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 md:gap-6">
                        {[...Array(5)].map((_, i) => (
                            <CategorySkeleton key={i} />
                        ))}
                    </div>
                ) : categories.length > 0 ? (
                    <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 md:gap-6">
                        {categories.map((cat) => {
                            const categoryImages: Record<string, string> = {
                                'vernis-gel': 'https://images.unsplash.com/photo-1632345033839-245a1e2ca9cb?q=80&w=600&auto=format&fit=crop',
                                'gel-uv': 'https://images.unsplash.com/photo-1629193510214-cae650d37e6d?q=80&w=600&auto=format&fit=crop',
                                'decoration': 'https://images.unsplash.com/photo-1607920502013-177991b9201a?q=80&w=600&auto=format&fit=crop',
                                'materiel': 'https://images.unsplash.com/photo-1599426184804-5ec8f540bd0a?q=80&w=600&auto=format&fit=crop',
                                'finition': 'https://images.unsplash.com/photo-1604014237800-1c9102c219da?q=80&w=600&auto=format&fit=crop'
                            };

                            const rawImage = cat.imageUrl || cat.image || '';
                            const isPlaceholder = !rawImage || rawImage.includes('placeholder') || rawImage.includes('placehold.co');
                            
                            const slug = cat.slug || cat.name?.toLowerCase().replace(/\s+/g, '-');
                            const displayImage = isPlaceholder 
                                ? (categoryImages[slug] || categoryImages['vernis-gel'])
                                : rawImage;

                            return (
                                <Link 
                                    key={cat.id || cat.name} 
                                    href={`/categories/${slug}`}
                                    className="w-full bg-white border-2 border-rouge-brand shadow-sm hover:shadow-2xl hover:border-rouge-brand/50 rounded-[24px] overflow-hidden flex flex-col group cursor-pointer transition-all duration-500"
                                >
                                    <div className="relative aspect-[4/5] w-full bg-creme2 overflow-hidden border-b-2 border-rouge-brand/10">
                                        <img 
                                            src={displayImage} 
                                            alt={cat.name} 
                                            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                                            loading="eager"
                                        />
                                        <div className="absolute inset-x-0 bottom-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-gradient-to-t from-encre/80 via-encre/40 to-transparent z-20 md:flex justify-center hidden">
                                            <span className="text-creme text-[9px] font-bold uppercase tracking-widest">Explorer</span>
                                        </div>
                                    </div>
                                    <div className="p-4 text-center flex-grow flex flex-col justify-center">
                                        <p className="font-serif text-[14px] md:text-lg text-encre group-hover:text-rouge-mid transition-colors line-clamp-2 md:line-clamp-1 mb-1 leading-tight">
                                            {cat.name}
                                        </p>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-creme2/50 rounded-lg border border-dashed border-or/20">
                        <p className="text-encre/50 italic mb-4">Aucune catégorie n'est disponible pour le moment.</p>
                        <button onClick={() => window.location.reload()} className="text-or text-sm font-bold underline">Actualiser la page</button>
                    </div>
                )}
            </section>

            {/* Meilleures Ventes */}
            <section className="py-12 md:py-24 bg-creme2">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-10 md:mb-12 gap-4">
                        <div>
                            <h2 className="font-serif text-3xl md:text-4xl text-encre mb-2">Meilleures Ventes</h2>
                            <p className="text-encre3 text-xs">Les indispensables plébiscités par nos clientes</p>
                        </div>
                        <Link href="/catalogue" className="text-rouge-mid font-medium hover:text-rouge hover:underline text-sm md:text-base">
                            Tout voir →
                        </Link>
                    </div>

                    {loading && featuredProducts.length === 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                            {[...Array(4)].map((_, i) => (
                                <ProductCardSkeleton key={i} />
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                            {featuredProducts.length > 0 ? (
                                featuredProducts.slice(0, 4).map((product) => (
                                    <ProductCard key={product.id} product={product} />
                                ))
                            ) : (
                                <div className="col-span-full text-center py-12 text-encre3 italic">
                                    Aucun produit disponible pour le moment.
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}
