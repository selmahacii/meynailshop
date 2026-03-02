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

// Mock data (same as catalogue for simplicity)
const MOCK_PRODUCTS = [
    {
        id: '1',
        name: 'Vernis Gel "Royal Red"',
        slug: 'vernis-gel-royal-red',
        description: 'Notre collection "Royal Edition" offre une pigmentation intense et une tenue irréprochable jusqu\'à 4 semaines. Ce rouge profond capture l\'élégance intemporelle pour des manucures de prestige.',
        shortDescription: 'Rouge royal intense, formule haute viscosité, 15ml.',
        sku: 'VG-RR-001',
        price: 1800,
        comparePrice: 2200,
        stock: 25,
        images: [],
        categoryId: 'cat1',
        category: { id: 'cat1', name: 'Vernis Gel', slug: 'vernis-gel' },
        badge: 'top',
        averageRating: 4.8,
        reviewCount: 12
    }
];

export default function ProductPage() {
    const { slug } = useParams();
    const [quantity, setQuantity] = useState(1);
    const addItem = useCartStore((state) => state.addItem);

    // Find product by slug (fallback to first mock if not found)
    const product = MOCK_PRODUCTS.find(p => p.slug === slug) || MOCK_PRODUCTS[0];

    const handleAddToCart = () => {
        addItem({
            productId: product.id,
            name: product.name,
            price: product.price,
            image: product.images[0] || '',
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
                    <span className="text-encre font-bold">{product.name}</span>
                </nav>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-24">
                    {/* Left: Gallery */}
                    <ProductGallery images={product.images} />

                    {/* Right: Info */}
                    <div className="flex flex-col">
                        <div className="flex items-center space-x-2 mb-4">
                            <div className="flex text-or">
                                {[1, 2, 3, 4, 5].map((s) => (
                                    <Star key={s} size={14} className={s <= Math.round(product.averageRating || 5) ? 'fill-or' : 'text-creme2'} />
                                ))}
                            </div>
                            <span className="text-xs font-bold text-encre3">({product.reviewCount || 0} avis)</span>
                        </div>

                        <h1 className="font-serif text-4xl md:text-5xl text-encre mb-4">{product.name}</h1>

                        <div className="flex items-center space-x-4 mb-8">
                            <span className="text-3xl font-bold text-rouge-deep">{formatPrice(product.price)}</span>
                            {product.comparePrice && (
                                <span className="text-xl text-encre3 line-through">{formatPrice(product.comparePrice)}</span>
                            )}
                            {product.comparePrice && (
                                <span className="bg-rouge/10 text-rouge text-xs font-bold px-2 py-1 rounded-sm">
                                    -{Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)}%
                                </span>
                            )}
                        </div>

                        <p className="text-encre3 leading-relaxed mb-8 text-lg font-light">
                            {product.description}
                        </p>

                        {/* Inventory Status */}
                        <div className="flex items-center space-x-2 mb-8">
                            <div className={`w-2 h-2 rounded-full ${product.stock > 0 ? 'bg-green-500' : 'bg-red-500'}`}></div>
                            <span className="text-xs font-bold uppercase tracking-widest text-encre">
                                {product.stock > 0 ? `En Stock (${product.stock} unités)` : 'Rupture de stock'}
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
                                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                                    className="px-4 text-encre hover:text-or transition-colors"
                                >
                                    <Plus size={18} />
                                </button>
                            </div>

                            <button
                                onClick={handleAddToCart}
                                disabled={product.stock === 0}
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
