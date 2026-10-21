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
import { useSettings } from '@/lib/hooks/useSettings';

export default function HomePage() {
    const { settings } = useSettings();
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

                {loading && categories.length === 0 ? (
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                        {[...Array(4)].map((_, i) => (
                            <CategorySkeleton key={i} />
                        ))}
                    </div>
                ) : categories.length > 0 ? (
                    <>
                        {/* Mobile Only: Single Container for "PRODUITS ONGLERIE" */}
                        <div className="md:hidden flex justify-center px-4">
                            <Link 
                                href="/catalogue"
                                className="w-full max-w-[230px] bg-white border border-gold-brand/15 hover:border-gold-brand/40 transition-all duration-500 rounded-[20px] overflow-hidden flex flex-col group cursor-pointer shadow-md hover:shadow-xl hover:shadow-gold-brand/10 active:scale-95"
                            >
                                <div className="relative aspect-[4/5] w-full bg-creme2 overflow-hidden border-b border-gold-brand/10">
                                    <img 
                                        src={settings?.onglerieCollectionImage || "https://images.unsplash.com/photo-1632345033839-245a1e2ca9cb?q=80&w=800&auto=format&fit=crop"} 
                                        alt="Produits Onglerie" 
                                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                                        loading="eager"
                                    />
                                    <div className="absolute inset-0 bg-[#390102]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" />
                                    <div className="absolute inset-x-0 bottom-0 p-2.5 bg-rouge-brand/90 backdrop-blur-sm z-20 flex justify-center">
                                        <span className="text-gold-brand text-[8px] font-black uppercase tracking-[0.2em]">Découvrir les catégories</span>
                                    </div>
                                </div>
                                <div className="p-3.5 text-center flex-grow flex flex-col justify-center bg-white">
                                    <p className="font-playfair italic text-[9px] text-gold-brand uppercase tracking-[0.2em] mb-0.5">Collection</p>
                                    <h3 className="font-italiana text-sm font-bold text-encre group-hover:text-rouge-mid transition-colors duration-300 leading-tight">
                                        Produits Onglerie
                                    </h3>
                                </div>
                            </Link>
                        </div>

                        {/* Desktop Only: Categories Grid */}
                        <div className="hidden md:grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                            {categories.map((cat) => {
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

                                const rawImage = cat.imageUrl || cat.image || '';
                                const isPlaceholder = !rawImage || rawImage.includes('placeholder') || rawImage.includes('placehold.co');
                                
                                const slug = cat.slug || cat.name?.toLowerCase().replace(/\s+/g, '-');
                                const displayImage = isPlaceholder 
                                    ? (categoryImages[slug] || 'https://images.unsplash.com/photo-1632345033839-245a1e2ca9cb?q=80&w=600&auto=format&fit=crop')
                                    : rawImage;

                                return (
                                    <Link 
                                        key={cat.id || cat.name} 
                                        href={`/categories/${slug}`}
                                        className="w-full bg-white border border-gold-brand/10 hover:border-gold-brand/35 transition-all duration-500 rounded-[20px] sm:rounded-[24px] overflow-hidden flex flex-col group cursor-pointer hover:-translate-y-1.5 shadow-sm hover:shadow-2xl hover:shadow-gold-brand/5 active:scale-95"
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
                                            <h3 className="font-italiana text-xs sm:text-base md:text-lg text-encre group-hover:text-rouge-mid transition-colors duration-300 font-bold leading-tight min-h-[2.4em] flex items-center justify-center">
                                                {cat.name}
                                            </h3>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    </>
                ) : (
                    <div className="text-center py-20 bg-creme2/50 rounded-2xl border border-dashed border-or/20">
                        <p className="text-encre/50 italic mb-4">Aucune catégorie n'est disponible pour le moment.</p>
                        <button onClick={() => window.location.reload()} className="text-or text-sm font-bold underline">Actualiser la page</button>
                    </div>
                )}
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
