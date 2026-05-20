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

                    setCategories(catRes.data || []);
                }
                if (featRes.success) {

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
            <section className="py-16 md:py-28 container mx-auto px-6 sm:px-12 md:px-16">
                <div className="flex flex-col items-center mb-12 md:mb-20 text-center">
                    <span className="text-gold-brand/80 text-[10px] font-bold uppercase tracking-[0.3em] mb-3">L'excellence au bout des doigts</span>
                    <h2 className="font-italiana text-4xl md:text-5xl lg:text-6xl text-encre tracking-[0.05em] uppercase">Nos Collections</h2>
                    <div className="w-12 h-[1px] bg-gold-brand/50 mt-4"></div>
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
                                    className="w-full bg-white border border-gold-brand/10 hover:border-gold-brand/35 transition-all duration-500 rounded-[20px] sm:rounded-[24px] overflow-hidden flex flex-col group cursor-pointer hover:-translate-y-1.5 shadow-sm hover:shadow-2xl hover:shadow-gold-brand/5"
                                >
                                    <div className="relative aspect-[4/5] w-full bg-creme2 overflow-hidden border-b border-gold-brand/5">
                                        <img 
                                            src={displayImage} 
                                            alt={cat.name} 
                                            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                                            loading="eager"
                                        />
                                        <div className="absolute inset-0 bg-[#390102]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" />
                                        <div className="absolute inset-x-0 bottom-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-rouge-brand/90 backdrop-blur-sm z-20 md:flex justify-center hidden">
                                            <span className="text-gold-brand text-[9px] font-black uppercase tracking-[0.2em]">Découvrir la collection</span>
                                        </div>
                                    </div>
                                    <div className="p-4 sm:p-5 text-center flex-grow flex flex-col justify-center bg-white">
                                        <p className="font-playfair italic text-[10px] text-gold-brand uppercase tracking-[0.2em] mb-1">Collection</p>
                                        <h3 className="font-italiana text-sm sm:text-lg text-encre group-hover:text-rouge-mid transition-colors duration-300 font-bold leading-tight line-clamp-1">
                                            {cat.name}
                                        </h3>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-creme2/50 rounded-2xl border border-dashed border-or/20">
                        <p className="text-encre/50 italic mb-4">Aucune catégorie n'est disponible pour le moment.</p>
                        <button onClick={() => window.location.reload()} className="text-or text-sm font-bold underline">Actualiser la page</button>
                    </div>
                )}
            </section>

            {/* Meilleures Ventes */}
            <section className="py-16 md:py-28 bg-gradient-to-b from-creme2/50 to-creme border-t border-gold-brand/5">
                <div className="container mx-auto px-6 sm:px-12 md:px-16">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-12 md:mb-16 gap-6">
                        <div>
                            <span className="text-gold-brand/80 text-[10px] font-bold uppercase tracking-[0.3em] mb-2 block">Vos coups de cœur</span>
                            <h2 className="font-italiana text-4xl md:text-5xl text-encre tracking-[0.05em] uppercase leading-tight">Meilleures Ventes</h2>
                            <p className="font-playfair italic font-light text-sm text-encre3 mt-2">Les indispensables plébiscités par nos artistes</p>
                        </div>
                        <Link href="/catalogue?badge=top" className="group/btn text-rouge-mid font-black uppercase tracking-[0.2em] text-xs hover:text-rouge transition-all flex items-center gap-1.5 py-1">
                            <span className="relative">
                                Voir tout
                                <span className="absolute bottom-0 left-0 right-0 h-[1px] bg-rouge-mid scale-x-100 group-hover/btn:scale-x-0 transition-transform duration-300 origin-left" />
                                <span className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-gold-brand scale-x-0 group-hover/btn:scale-x-100 transition-transform duration-300 origin-left" />
                            </span>
                            <span className="group-hover/btn:translate-x-1 transition-transform">→</span>
                        </Link>
                    </div>

                    {loading && featuredProducts.length === 0 ? (
                        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
                            {[...Array(4)].map((_, i) => (
                                <ProductCardSkeleton key={i} />
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
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
