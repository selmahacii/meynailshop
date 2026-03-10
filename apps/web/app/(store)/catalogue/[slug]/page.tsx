'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
    ShoppingBag,
    Heart,
    Share2,
    Truck,
    ShieldCheck,
    RotateCcw,
    Plus,
    Minus,
    Star,
    Check
} from 'lucide-react';
import ProductGallery from '@/components/store/products/ProductGallery';
import ProductCard from '@/components/store/products/ProductCard';
import { formatPrice } from '@/lib/utils/currency';
import { useCartStore } from '@/lib/store/cartStore';
import { toast } from 'sonner';
import { StoreAPI } from '@/lib/api/client';
import { useEffect } from 'react';

 

export default function ProductPage() {
    const { slug } = useParams();
    const [quantity, setQuantity] = useState(1);
    const addItem = useCartStore((state) => state.addItem);

    const [product, setProduct] = useState<any | null>(null);
    const [loadingProduct, setLoadingProduct] = useState(true);
    const [productError, setProductError] = useState<string | null>(null);

    useEffect(() => {
        let mounted = true;
        async function load() {
            setLoadingProduct(true);
            try {
                const res = await StoreAPI.getProductBySlug(slug as string);
                if (res.success) {
                    if (mounted) setProduct(res.data);
                } else {
                    if (mounted) setProductError(res.error || 'Produit introuvable');
                }
            } catch (err) {
                if (mounted) setProductError('Impossible de charger le produit');
                console.error('Product fetch error:', err);
            } finally {
                if (mounted) setLoadingProduct(false);
            }
        }
        load();
        return () => { mounted = false; };
    }, [slug]);

    const handleAddToCart = () => {
        if (!product) return;
        addItem({
            productId: product.id,
            name: product.name,
            price: product.price,
            image: product.images?.[0] || '',
            quantity: quantity,
            stock: product.stock
        });
        toast.success(`${quantity} ${product.name} ajoutés au panier`);
    };

    return (
        <div className="pt-32 pb-24 bg-creme min-h-screen">
            <div className="container mx-auto px-4">
                {/* Breadcrumbs */}
                <nav className="text-[10px] uppercase tracking-widest text-encre3 mb-8">
                    <Link href="/" className="hover:text-or transition-colors">Accueil</Link>
                    <span className="mx-2">/</span>
                    <Link href="/catalogue" className="hover:text-or transition-colors">Catalogue</Link>
                    <span className="mx-2">/</span>
                    <span className="text-encre font-bold">
                        {product ? product.name : 'Produit'}
                    </span>
                </nav>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-24">
                    {/* Left: Gallery */}
                    {product && <ProductGallery images={product.images || []} />}

                    {/* Right: Info */}
                    <div className="flex flex-col">
                        <div className="flex items-center space-x-2 mb-4">
                            {product && (
                                <>
                                    <div className="flex text-or">
                                        {[1, 2, 3, 4, 5].map((s) => (
                                            <Star
                                                key={s}
                                                size={14}
                                                className={s <= Math.round(product.averageRating || 5) ? 'fill-or' : 'text-creme2'}
                                            />
                                        ))}
                                    </div>
                                    <span className="text-xs font-bold text-encre3">({product.reviewCount || 0} avis)</span>
                                </>
                            )}
                        </div>

                        {loadingProduct ? (
                            <h1 className="font-serif text-4xl md:text-5xl text-encre mb-4">Chargement...</h1>
                        ) : product ? (
                            <h1 className="font-serif text-4xl md:text-5xl text-encre mb-4">{product.name}</h1>
                        ) : (
                            <h1 className="font-serif text-4xl md:text-5xl text-encre mb-4">Produit introuvable</h1>
                        )}

                        <div className="flex items-center space-x-4 mb-8">
                            {product && (
                                <>
                                    <span className="text-3xl font-bold text-rouge-deep">{formatPrice(product.price)}</span>
                                    {product.comparePrice && (
                                        <span className="text-xl text-encre3 line-through">{formatPrice(product.comparePrice)}</span>
                                    )}
                                </>
                            )}
                            {product && product.comparePrice && (
                                <span className="bg-rouge/10 text-rouge text-xs font-bold px-2 py-1 rounded-sm">
                                    -{Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)}%
                                </span>
                            )}
                        </div>

                        <p className="text-encre3 leading-relaxed mb-8 text-lg font-light">
                            {product ? product.description : 'Description indisponible.'}
                        </p>

                        {/* Inventory Status */}
                        <div className="flex items-center space-x-2 mb-8">
                            <div className={`w-2 h-2 rounded-full ${product && product.stock > 0 ? 'bg-green-500' : 'bg-red-500'}`}></div>
                            <span className="text-xs font-bold uppercase tracking-widest text-encre">
                                {product ? (product.stock > 0 ? `En Stock (${product.stock} unités)` : 'Rupture de stock') : ''}
                            </span>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 mb-10">
                            <div className="flex items-center border border-creme2 bg-white rounded-sm h-14">
                                <button
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    className="px-4 text-encre hover:text-or transition-colors"
                                >
                                    <Minus size={18} />
                                </button>
                                <span className="w-12 text-center font-bold text-encre">{quantity}</span>
                                <button
                                    onClick={() => setQuantity(Math.min(product ? product.stock : 1, quantity + 1))}
                                    className="px-4 text-encre hover:text-or transition-colors"
                                >
                                    <Plus size={18} />
                                </button>
                            </div>

                            <button
                                onClick={handleAddToCart}
                                disabled={!product || product.stock === 0}
                                className="flex-grow bg-rouge-deep hover:bg-rouge-mid text-creme h-14 rounded-sm font-bold uppercase tracking-widest text-xs flex items-center justify-center transition-all shadow-lg active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <ShoppingBag className="mr-3" size={20} />
                                Ajouter au panier
                            </button>

                            <button className="w-14 h-14 border border-creme2 flex items-center justify-center text-encre hover:text-rouge-mid hover:border-rouge-mid transition-all rounded-sm">
                                <Heart size={20} />
                            </button>
                        </div>

                        {/* Trust Badges */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 py-8 border-t border-creme2">
                            <div className="flex items-center space-x-3">
                                <Truck className="text-or" size={24} strokeWidth={1.5} />
                                <div>
                                    <p className="text-[10px] font-bold uppercase text-encre">Livraison 58 Wilayas</p>
                                    <p className="text-[10px] text-encre3">Rapide & sécurisée</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-3">
                                <ShieldCheck className="text-or" size={24} strokeWidth={1.5} />
                                <div>
                                    <p className="text-[10px] font-bold uppercase text-encre">Qualité Garantie</p>
                                    <p className="text-[10px] text-encre3">Produits 100% originaux</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-3">
                                <RotateCcw className="text-or" size={24} strokeWidth={1.5} />
                                <div>
                                    <p className="text-[10px] font-bold uppercase text-encre">Support Client</p>
                                    <p className="text-[10px] text-encre3">À votre écoute 7j/7</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Categories / Similar Products Scaffolding */}
                <div>
                    <div className="flex items-center justify-between mb-12">
                        <h2 className="font-serif text-3xl text-encre">Vous aimerez aussi</h2>
                        <Link href="/catalogue" className="text-sm font-bold text-or hover:text-rouge-mid transition-colors uppercase tracking-[0.2em]">Voir tout la collection</Link>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {/* These would be fetched from API based on category */}
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="opacity-50 grayscale hover:grayscale-0 hover:opacity-100 transition-all">
                                <div className="aspect-[4/5] bg-creme2 border border-creme2 mb-4"></div>
                                <div className="h-4 w-2/3 bg-creme2 mb-2"></div>
                                <div className="h-4 w-1/3 bg-creme2"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
