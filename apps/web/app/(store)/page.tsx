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
            <section className="py-20 md:py-32 container mx-auto px-6 sm:px-12 md:px-16">
                <div className="flex flex-col items-center mb-16 md:mb-24 text-center">
                    <div className="flex items-center gap-3 mb-4">
                        <span className="text-[10px] font-bold tracking-[0.4em] text-gold-brand">01</span>
                        <div className="w-8 h-[1px] bg-gold-brand/30"></div>
                        <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-gold-brand">LES COLLECTIONS</span>
                    </div>
                    <h2 className="font-italiana text-4xl md:text-6xl text-[#390102] tracking-[0.08em] uppercase">
                        Nos Univers <span className="font-playfair italic lowercase text-gold-brand">de</span> Beauté
                    </h2>
                    <p className="font-playfair italic font-light text-sm md:text-base text-encre3 mt-4 max-w-md mx-auto leading-relaxed">
                        Chaque gamme incarne notre quête absolue d'excellence et d'innovation pour vos créations d'exception.
                    </p>
                </div>

                {/* Un seul container identique au style des catégories */}
                <div className="flex justify-center">
                    <Link 
                        href="/catalogue"
                        className="w-full max-w-xs sm:max-w-sm bg-white border border-gold-brand/10 hover:border-gold-brand/35 transition-all duration-500 rounded-[20px] sm:rounded-[24px] overflow-hidden flex flex-col group cursor-pointer hover:-translate-y-1.5 shadow-sm hover:shadow-2xl hover:shadow-gold-brand/5 active:scale-95"
                    >
                        <div className="relative aspect-[4/5] w-full bg-creme2 overflow-hidden border-b border-gold-brand/5">
                            <img 
                                src="https://images.unsplash.com/photo-1632345033839-245a1e2ca9cb?q=80&w=800&auto=format&fit=crop" 
                                alt="Voir toutes les catégories" 
                                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                                loading="eager"
                            />
                            <div className="absolute inset-0 bg-[#390102]/15 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" />
                            <div className="absolute inset-x-0 bottom-0 p-3 sm:p-4 bg-gradient-to-t from-black/70 via-black/30 to-transparent z-20 flex justify-center">
                                <span className="text-gold-brand text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] bg-rouge-brand/90 backdrop-blur-sm px-4 py-1.5 rounded-full border border-gold-brand/30 shadow-md flex items-center gap-1.5">
                                    Découvrir les collections →
                                </span>
                            </div>
                        </div>
                        <div className="p-5 sm:p-6 text-center flex-grow flex flex-col justify-center bg-white">
                            <p className="font-playfair italic text-[10px] sm:text-[11px] text-gold-brand uppercase tracking-[0.2em] mb-1">Collections</p>
                            <h3 className="font-italiana text-base sm:text-xl text-encre group-hover:text-rouge-mid transition-colors duration-300 font-bold leading-tight">
                                Voir toutes les catégories
                            </h3>
                            <p className="text-[11px] font-playfair italic text-encre3 mt-2">
                                Vernis, Matériel, Construction & Nail Art
                            </p>
                        </div>
                    </Link>
                </div>
            </section>

            {/* Meilleures Ventes */}
            <section className="py-20 md:py-32 bg-gradient-to-b from-creme2/40 via-white to-creme border-t border-gold-brand/5">
                <div className="container mx-auto px-6 sm:px-12 md:px-16">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-8">
                        <div>
                            <div className="flex items-center gap-3 mb-4">
                                <span className="text-[10px] font-bold tracking-[0.4em] text-gold-brand">02</span>
                                <div className="w-8 h-[1px] bg-gold-brand/30"></div>
                                <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-gold-brand">ICÔNES DE LA MAISON</span>
                            </div>
                            <h2 className="font-italiana text-4xl md:text-5xl text-[#390102] tracking-[0.08em] uppercase leading-tight">
                                Les Meilleures <span className="font-playfair italic lowercase text-gold-brand">ventes</span>
                            </h2>
                            <p className="font-playfair italic font-light text-sm text-encre3 mt-3">
                                Les indispensables et favoris plébiscités par nos artistes les plus exigeants.
                            </p>
                        </div>
                        <Link href="/catalogue" className="group/btn text-rouge-mid font-black uppercase tracking-[0.2em] text-xs hover:text-rouge transition-all flex items-center gap-1.5 py-1">
                            <span className="relative">
                                Voir tout
                                <span className="absolute bottom-0 left-0 right-0 h-[1px] bg-rouge-mid scale-x-100 group-hover/btn:scale-x-0 transition-transform duration-300 origin-left" />
                                <span className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-gold-brand scale-x-0 group-hover/btn:scale-x-100 transition-transform duration-300 origin-left" />
                            </span>
                            <span className="group-hover/btn:translate-x-1 transition-transform">→</span>
                        </Link>
                    </div>

                    {/* Luxurious Product Showcase Container */}
                    <div className="relative p-6 sm:p-10 rounded-[32px] bg-white/60 backdrop-blur-md border border-gold-brand/10 shadow-2xl shadow-gold-brand/5 overflow-hidden">
                        {loading && featuredProducts.length === 0 ? (
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                                {[...Array(4)].map((_, i) => (
                                    <ProductCardSkeleton key={i} />
                                ))}
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 relative z-10">
                                {featuredProducts.length > 0 ? (
                                    featuredProducts.slice(0, 4).map((product) => (
                                        <ProductCard key={product.id} product={product} />
                                    ))
                                ) : (
                                    <div className="col-span-full text-center py-16 text-encre3 italic font-playfair">
                                        Aucun produit d'exception disponible pour le moment.
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </section>
        </div>
    );
}
