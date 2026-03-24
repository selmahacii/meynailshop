'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Minus, Plus, Trash2, ArrowRight, ShoppingBag } from 'lucide-react';
import { useCartStore } from '@/lib/store/cartStore';
import { formatPrice } from '@/lib/utils/currency';
import { useState, useEffect } from 'react';
import CartRecommendations from '@/components/store/cart/CartRecommendations';

export default function CartPage() {
    const { items, updateQuantity, removeItem, getSubtotal, getTotal } = useCartStore();
    const [mounted, setMounted] = useState(false);

    // Prevent hydration errors with Zustand persist
    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    if (items.length === 0) {
        return (
            <div className="min-h-[70vh] flex flex-col items-center justify-center pt-32 pb-24 bg-creme">
                <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-sm mb-6">
                    <ShoppingBag size={48} className="text-encre3/30" />
                </div>
                <h1 className="font-serif text-3xl text-encre mb-4">Votre panier est vide</h1>
                <p className="text-encre3 mb-8 max-w-sm text-center">
                    Découvrez notre collection de vernis, gels et matériels professionnels pour remplir votre panier.
                </p>
                <Link
                    href="/catalogue"
                    className="bg-rouge-deep text-creme px-8 py-4 uppercase font-bold text-xs tracking-[0.2em] shadow-lg hover:bg-rouge-mid transition-all"
                >
                    Découvrir nos produits
                </Link>
            </div>
        );
    }

    return (
        <div className="pt-32 pb-24 bg-creme min-h-screen">
            <div className="container mx-auto px-4 max-w-6xl">
                <h1 className="font-serif text-4xl text-encre mb-12">Mon Panier</h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Cart Items */}
                    <div className="lg:col-span-2 space-y-6">
                        {items.map((item) => (
                            <div
                                key={item.productId}
                                className="flex flex-col sm:flex-row bg-white p-4 border border-creme2 shadow-sm gap-6 relative group"
                            >
                                <button
                                    onClick={() => removeItem(item.productId)}
                                    className="absolute top-4 right-4 text-encre3 hover:text-rouge transition-colors sm:opacity-0 group-hover:opacity-100"
                                >
                                    <Trash2 size={18} />
                                </button>

                                {/* Product Image */}
                                <Link href={`/catalogue/${item.productId}`} className="w-full sm:w-32 aspect-square relative bg-creme2 shrink-0 border border-creme2">
                                    <Image
                                        src={item.image || '/images/placeholder-product.png'}
                                        alt={item.name}
                                        fill
                                        className="object-cover"
                                    />
                                </Link>

                                {/* Info & Quantity */}
                                <div className="flex flex-col justify-between flex-grow">
                                    <div>
                                        <Link href={`/catalogue/${item.productId}`}>
                                            <h3 className="font-serif text-lg text-encre hover:text-rouge-mid transition-colors pr-8">
                                                {item.name}
                                            </h3>
                                        </Link>
                                        <p className="text-encre3 text-sm mt-1">{formatPrice(item.price)}</p>
                                    </div>

                                    <div className="flex items-center justify-between mt-6">
                                        <div className="flex items-center border border-creme2 rounded-sm h-10 w-fit">
                                            <button
                                                onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                                                className="px-3 h-full flex items-center justify-center text-encre hover:text-or transition-colors disabled:opacity-50"
                                                disabled={item.quantity <= 1}
                                            >
                                                <Minus size={14} />
                                            </button>
                                            <span className="w-8 text-center font-bold text-sm text-encre">
                                                {item.quantity}
                                            </span>
                                            <button
                                                onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                                                className="px-3 h-full flex items-center justify-center text-encre hover:text-or transition-colors disabled:opacity-50"
                                                disabled={item.quantity >= item.stock}
                                            >
                                                <Plus size={14} />
                                            </button>
                                        </div>

                                        <p className="font-bold text-lg text-encre">
                                            {formatPrice(item.price * item.quantity)}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white p-8 border border-creme2 shadow-sm sticky top-32">
                            <h2 className="font-serif text-2xl text-encre mb-6">Récapitulatif</h2>

                            <div className="space-y-4 text-sm mb-6">
                                <div className="flex justify-between text-encre3">
                                    <span>Sous-total HT</span>
                                    <span className="font-medium text-encre">{formatPrice(getSubtotal())}</span>
                                </div>
                                <div className="flex justify-between text-encre3">
                                    <span>Frais de livraison</span>
                                    <span className="text-[10px] uppercase font-bold text-or tracking-widest">Calculé à l'étape suivante</span>
                                </div>
                            </div>

                            <div className="border-t border-creme2 pt-6 mb-8">
                                <div className="flex justify-between items-end">
                                    <span className="text-sm font-bold uppercase tracking-widest text-encre">Total Estimé</span>
                                    <span className="text-2xl font-bold text-rouge-deep">{formatPrice(getTotal())}</span>
                                </div>
                                <p className="text-[10px] text-encre3 mt-2 italic">*TTC, hors frais de livraison</p>
                            </div>

                            <Link
                                href="/checkout"
                                className="w-full bg-encre hover:bg-rouge-deep text-creme py-4 font-bold uppercase tracking-widest text-xs flex items-center justify-center transition-all shadow-md group"
                            >
                                Passer la commande
                                <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                            </Link>

                            <div className="mt-6 text-center">
                                <p className="text-[10px] text-encre3 uppercase tracking-widest font-semibold flex items-center justify-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-green-500"></span>
                                    Paiement à la livraison disponible
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Upselling / Recommendations */}
                <CartRecommendations />
            </div>
        </div>
    );
}
