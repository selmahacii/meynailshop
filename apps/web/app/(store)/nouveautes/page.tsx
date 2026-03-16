'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Sparkles, ShoppingBag, Heart, ArrowRight, Loader2, PackageOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatPrice } from '@/lib/utils/currency';
import { cn } from '@/lib/utils';
import { productsApi } from '@/lib/api/products';
import { toast } from 'sonner';

// Fallback products in case API is empty or failing
const fallbackProducts = [
    {
        id: '1',
        name: 'Vernis Gel Premium Rose',
        category: 'Vernis Gel',
        price: 850,
        comparePrice: 950,
        image: '/images/products/placeholder.png',
        badge: 'Nouveau',
        discount: 10,
        slug: 'vernis-gel-premium-rose'
    },
    {
        id: '2',
        name: 'Gel UV Construction Clair',
        category: 'Gel UV',
        price: 1800,
        image: '/images/products/placeholder.png',
        badge: 'Top',
        slug: 'gel-uv-clair'
    },
    {
        id: '3',
        name: 'Lampe UV/LED Pro 48W',
        category: 'Materiel',
        price: 12500,
        image: '/images/products/placeholder.png',
        badge: 'Equipement',
        slug: 'lampe-pro-48w'
    },
    {
        id: '4',
        name: 'Kit Ongles Naturels',
        category: 'Soin',
        price: 2200,
        image: '/images/products/placeholder.png',
        badge: 'Bio',
        slug: 'kit-ongles-naturels'
    }
];

export default function NouveautesPage() {
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [hoveredId, setHoveredId] = useState<string | null>(null);

    useEffect(() => {
        const fetchNewProducts = async () => {
            try {
                // Fetch products with the 'new' badge
                const res = await productsApi.getAll({ badge: 'new', limit: 20 });
                if (res.success && res.data && res.data.data && res.data.data.items && res.data.data.items.length > 0) {
                    setProducts(res.data.data.items);
                } else {
                    // If no new products in DB yet, use our cleaned up list
                    setProducts(fallbackProducts);
                }
            } catch (err) {
                console.error('Failed to fetch new products:', err);
                setProducts(fallbackProducts);
            } finally {
                setLoading(false);
            }
        };

        fetchNewProducts();
    }, []);

    return (
        <div className="min-h-screen bg-creme pt-32 pb-24">
            <div className="container mx-auto px-4 md:px-8 max-w-7xl">
                {/* Hero / Header Section */}
                <div className="relative mb-20 text-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-rouge-brand/5 rounded-full text-rouge-brand text-xs font-black uppercase tracking-[0.3em] mb-6"
                    >
                        <Sparkles size={14} className="animate-pulse" />
                        Exclusivement Chez MEEY
                    </motion.div>
                    
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-5xl md:text-7xl font-serif text-encre mb-8 leading-tight"
                    >
                        Nos <span className="text-rouge-brand italic">Nouveau</span>tés
                    </motion.h1>
                    
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="max-w-2xl mx-auto text-encre3 text-lg font-medium leading-relaxed"
                    >
                        Découvrez nos dernières créations et innovations en matière de beauté des ongles. 
                        Des produits exclusifs pensés pour vous offrir le meilleur de l'onglerie professionnelle.
                    </motion.p>
                </div>

                {/* Grid Section */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-32 space-y-4">
                        <Loader2 className="w-12 h-12 text-rouge-brand animate-spin" />
                        <p className="text-encre3 font-bold uppercase tracking-widest text-xs">Chargement de la collection...</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-10">
                        <AnimatePresence>
                            {products.map((product, index) => (
                                <motion.div
                                    key={product.id}
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="group relative"
                                    onMouseEnter={() => setHoveredId(product.id)}
                                    onMouseLeave={() => setHoveredId(null)}
                                >
                                    {/* Product Image Container */}
                                    <div className="relative aspect-[4/5] bg-white rounded-[30px] overflow-hidden shadow-sm group-hover:shadow-2xl transition-all duration-500 border border-gold-brand/10">
                                        <Image
                                            src={product.image || '/images/products/placeholder.png'}
                                            alt={product.name}
                                            fill
                                            className="object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
                                        />
                                        
                                        {/* Badges */}
                                        <div className="absolute top-6 left-6 flex flex-col gap-2 z-10">
                                            {product.badge && (
                                                <span className="bg-rouge-brand text-creme px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg">
                                                    {product.badge}
                                                </span>
                                            )}
                                            {product.discount && (
                                                <span className="bg-gold-brand text-encre px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg">
                                                    -{product.discount}%
                                                </span>
                                            )}
                                        </div>

                                        {/* Actions Overlay */}
                                        <div className={cn(
                                            "absolute inset-0 bg-encre/10 backdrop-blur-sm flex items-center justify-center gap-4 transition-all duration-300",
                                            hoveredId === product.id ? "opacity-100" : "opacity-0"
                                        )}>
                                            <button className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-encre hover:bg-gold-brand hover:text-white transition-all shadow-xl hover:scale-110">
                                                <Heart size={20} />
                                            </button>
                                            <Link 
                                                href={`/catalogue/${product.slug}`}
                                                className="w-14 h-14 bg-rouge-brand rounded-full flex items-center justify-center text-creme hover:bg-rouge-mid transition-all shadow-xl hover:scale-110"
                                            >
                                                <ShoppingBag size={24} />
                                            </Link>
                                        </div>
                                    </div>

                                    {/* Product Details */}
                                    <div className="mt-8 text-center px-4">
                                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gold-brand mb-2">
                                            {product.category || product.category?.name || "Nouveauté"}
                                        </p>
                                        <h3 className="text-xl md:text-2xl font-serif text-encre mb-3 group-hover:text-rouge-brand transition-colors">
                                            {product.name}
                                        </h3>
                                        <div className="flex items-center justify-center gap-4">
                                            <span className="text-2xl font-black text-rouge-brand">
                                                {formatPrice(product.price)}
                                            </span>
                                            {(product.comparePrice || product.originalPrice) && (
                                                <span className="text-sm text-encre3/60 line-through font-medium">
                                                    {formatPrice(product.comparePrice || product.originalPrice)}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                )}

                {/* Empty State if no products */}
                {!loading && products.length === 0 && (
                    <div className="py-32 text-center bg-white rounded-[50px] border-2 border-dashed border-gold-brand/20">
                        <PackageOpen className="w-16 h-16 text-gold-brand/30 mx-auto mb-6" />
                        <h3 className="text-2xl font-serif text-encre mb-2">Pas encore de nouveautés ?</h3>
                        <p className="text-encre3 max-w-sm mx-auto">Revenez bientôt pour découvrir nos prochaines pépites ou explorez notre catalogue complet.</p>
                        <Link href="/catalogue" className="inline-block mt-8 text-rouge-brand font-black uppercase tracking-widest text-xs underline">
                            Voir tout le catalogue
                        </Link>
                    </div>
                )}

                {/* Bottom CTA Section */}
                <div className="mt-32 relative bg-encre rounded-[60px] p-12 md:p-20 overflow-hidden shadow-2xl">
                    <div className="relative z-10 max-w-3xl">
                        <h2 className="text-3xl md:text-5xl font-serif text-white mb-8 leading-tight">
                            Ne manquez plus <br />
                            <span className="text-gold-brand">aucune tendance</span>.
                        </h2>
                        <p className="text-creme/60 text-lg mb-12 max-w-lg">
                            Rejoignez notre cercle privé pour recevoir en avant-première nos nouvelles collections et offres exclusives directement dans votre boîte mail.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 max-w-md">
                            <input 
                                type="email" 
                                placeholder="Votre adresse mail..."
                                className="flex-1 px-8 py-5 bg-white/5 border border-white/10 rounded-full text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-gold-brand transition-all"
                            />
                            <button className="px-10 py-5 bg-gold-brand text-encre rounded-full font-black uppercase tracking-widest text-xs hover:scale-105 transition-transform">
                                S'inscrire
                            </button>
                        </div>
                    </div>
                    
                    {/* Decorative blobs */}
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-rouge-brand/10 rounded-full -mr-32 -mt-32 blur-[120px]"></div>
                    <div className="absolute bottom-0 right-20 w-[200px] h-[200px] bg-gold-brand/5 rounded-full blur-[80px]"></div>
                </div>

                {/* Navigation Hint */}
                <div className="mt-16 text-center">
                    <Link href="/catalogue" className="inline-flex items-center gap-4 group">
                        <div className="w-12 h-12 rounded-full border border-encre2 flex items-center justify-center group-hover:bg-encre group-hover:text-creme transition-all duration-500">
                            <ArrowRight size={20} className="-rotate-45 group-hover:rotate-0 transition-transform duration-500" />
                        </div>
                        <span className="text-xs font-black uppercase tracking-[0.3em] text-encre">Accéder au catalogue complet</span>
                    </Link>
                </div>
            </div>
        </div>
    );
}
