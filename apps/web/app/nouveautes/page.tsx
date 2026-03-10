'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Sparkles, ShoppingCart, Heart } from 'lucide-react';
import { cn } from '@/lib/utils';

const newProducts = [
    {
        id: '1',
        name: 'Vernis Gel Premium Rose',
        category: 'Vernis Gel',
        price: '850 DA',
        originalPrice: '950 DA',
        image: 'bg-gradient-to-br from-pink-200 to-pink-300',
        badge: 'Nouveau',
        badgeColor: 'bg-or text-encre',
        isNew: true,
        discount: 10
    },
    {
        id: '2',
        name: 'Lampe UV/LED Pro 48W',
        category: 'Matériel',
        price: '12 500 DA',
        image: 'bg-gradient-to-br from-blue-200 to-blue-300',
        badge: 'Équipement',
        badgeColor: 'bg-blue-600 text-white',
        isNew: true
    },
    {
        id: '3',
        name: 'Kit Ongles Naturels',
        category: 'Soin',
        price: '2 200 DA',
        image: 'bg-gradient-to-br from-green-200 to-green-300',
        badge: 'Bio',
        badgeColor: 'bg-green-600 text-white',
        isNew: true
    },
    {
        id: '4',
        name: 'Paillettes Cristal Premium',
        category: 'Décoration',
        price: '450 DA',
        image: 'bg-gradient-to-br from-purple-200 to-purple-300',
        badge: 'Limited',
        badgeColor: 'bg-purple-600 text-white',
        isNew: true
    }
];

export default function NouveautesPage() {
    const [hoveredProduct, setHoveredProduct] = useState<string | null>(null);

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#FAF5EF] to-[#F5EFEA] py-16 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="flex items-center justify-center mb-4">
                        <Sparkles className="w-8 h-8 text-or mr-3" />
                        <h1 className="text-4xl font-serif text-encre">Nouveautés</h1>
                        <Sparkles className="w-8 h-8 text-or ml-3" />
                    </div>
                    <p className="text-lg text-encre3 max-w-2xl mx-auto">
                        Découvrez nos dernières créations et innovations en matière de beauté des ongles.
                        Des produits exclusifs pensés pour vous offrir le meilleur de l'onglerie professionnelle.
                    </p>
                </div>

                {/* Products Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
                    {newProducts.map((product) => (
                        <div
                            key={product.id}
                            className="bg-white rounded-lg shadow-lg overflow-hidden group hover:shadow-xl transition-all duration-300"
                            onMouseEnter={() => setHoveredProduct(product.id)}
                            onMouseLeave={() => setHoveredProduct(null)}
                        >
                            {/* Image */}
                            <div className="relative aspect-square overflow-hidden">
                                <div className={cn(
                                    "w-full h-full flex items-center justify-center transition-transform duration-500",
                                    product.image,
                                    hoveredProduct === product.id ? "scale-110" : "scale-100"
                                )}>
                                    <div className="text-6xl opacity-20">💅</div>
                                </div>

                                {/* Badges */}
                                <div className="absolute top-4 left-4 flex flex-col space-y-2">
                                    <span className={cn(
                                        "px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-lg",
                                        product.badgeColor
                                    )}>
                                        {product.badge}
                                    </span>
                                    {product.discount && (
                                        <span className="bg-rouge text-creme px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                                            -{product.discount}%
                                        </span>
                                    )}
                                </div>

                                {/* Hover Actions */}
                                <div className={cn(
                                    "absolute inset-0 bg-black/20 flex items-center justify-center space-x-3 transition-opacity duration-300",
                                    hoveredProduct === product.id ? "opacity-100" : "opacity-0"
                                )}>
                                    <button className="bg-white text-encre p-3 rounded-full hover:bg-or hover:text-creme transition-colors shadow-lg">
                                        <Heart className="w-5 h-5" />
                                    </button>
                                    <button className="bg-or text-creme p-3 rounded-full hover:bg-rouge-deep transition-colors shadow-lg">
                                        <ShoppingCart className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>

                            {/* Info */}
                            <div className="p-6">
                                <div className="mb-2">
                                    <span className="text-xs uppercase tracking-wider text-or font-bold">
                                        {product.category}
                                    </span>
                                </div>

                                <h3 className="font-serif text-lg text-encre mb-3 group-hover:text-rouge-deep transition-colors">
                                    {product.name}
                                </h3>

                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-2">
                                        <span className="text-xl font-bold text-encre">
                                            {product.price}
                                        </span>
                                        {product.originalPrice && (
                                            <span className="text-sm text-encre3 line-through">
                                                {product.originalPrice}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Newsletter Signup */}
                <div className="bg-white rounded-lg shadow-lg p-8 text-center">
                    <h2 className="text-2xl font-serif text-encre mb-4">Restez informé des nouveautés</h2>
                    <p className="text-encre3 mb-6 max-w-md mx-auto">
                        Soyez le premier à découvrir nos nouveaux produits et offres exclusives.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                        <input
                            type="email"
                            placeholder="Votre email"
                            className="flex-1 px-4 py-3 border border-creme2 rounded-lg focus:ring-2 focus:ring-or focus:border-or transition-colors"
                        />
                        <button className="bg-or text-encre px-6 py-3 rounded-lg font-semibold hover:bg-encre hover:text-creme transition-colors whitespace-nowrap">
                            S'inscrire
                        </button>
                    </div>
                </div>

                {/* Back to Shop */}
                <div className="text-center mt-12">
                    <Link
                        href="/catalogue"
                        className="inline-flex items-center space-x-2 bg-encre text-creme px-8 py-3 rounded-lg font-semibold hover:bg-rouge-deep transition-colors"
                    >
                        <ShoppingCart className="w-5 h-5" />
                        <span>Découvrir tout le catalogue</span>
                    </Link>
                </div>
            </div>
        </div>
    );
}