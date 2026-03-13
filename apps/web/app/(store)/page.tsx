'use client';

import { useState, useEffect } from 'react';
import HeroSection from '@/components/store/home/HeroSection';
import Link from 'next/link';
import { StoreAPI } from '@/lib/api/client';
import ProductCard from '@/components/store/products/ProductCard';
import { Product } from '@/types/product';
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

                if (catRes.success) setCategories(catRes.data || []);
                if (featRes.success) setFeaturedProducts(featRes.data || []);
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
                    <div className="flex justify-center py-12">
                        <Loader2 className="animate-spin text-or" size={32} />
                    </div>
                ) : (
                    <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 md:gap-6">
                        {categories.map((cat) => {
                            // Nettoyage proactif des URLs cassées pour éviter les erreurs console
                            const rawImage = cat.imageUrl || cat.image || '';
                            const isPlaceholder = rawImage.includes('via.placeholder.com');
                            const displayImage = isPlaceholder 
                                ? `https://images.unsplash.com/photo-1600050218444-14309070557e?q=80&w=800&auto=format&fit=crop`
                                : rawImage;

                            return (
                                <Link 
                                    key={cat.id || cat.name} 
                                    href={`/catalogue?category=${cat.slug || cat.name.toLowerCase()}`}
                                    className="group cursor-pointer relative aspect-[4/5] overflow-hidden bg-encre2 rounded-sm shadow-sm"
                                >
                                    {displayImage ? (
                                        <img 
                                            src={displayImage} 
                                            alt={cat.name} 
                                            onError={(e) => {
                                                const target = e.target as HTMLImageElement;
                                                target.src = `https://images.unsplash.com/photo-1632345033839-245a1e2ca9cb?q=80&w=800&auto=format&fit=crop`; // Autre image de secours
                                            }}
                                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                                        />
                                    ) : (
                                        <div className="absolute inset-0 bg-gradient-to-br from-rouge-deep/20 to-rouge-mid/20" />
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-encre/90 via-encre/20 to-transparent z-10"></div>
                                    <div className="absolute inset-0 flex items-end justify-center pb-8 z-20">
                                        <span className="text-creme font-serif text-lg md:text-xl border-b border-transparent group-hover:border-or group-hover:text-or transition-all duration-300">
                                            {cat.name}
                                        </span>
                                    </div>
                                </Link>
                            );
                        })}
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
                        <div className="flex justify-center py-12">
                            <Loader2 className="animate-spin text-or" size={32} />
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
