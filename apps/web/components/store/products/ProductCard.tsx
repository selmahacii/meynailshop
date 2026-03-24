'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Heart, ShoppingBag, Star } from 'lucide-react';
import { Product } from '@/types/product';
import { formatPrice } from '@/lib/utils/currency';
import { useCartStore } from '@/lib/store/cartStore';
import { useWishlistStore } from '@/lib/store/wishlistStore';
import { toast } from 'sonner';

interface ProductCardProps {
    product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
    const addItem = useCartStore((state) => state.addItem);
    const { toggleItem, isInWishlist } = useWishlistStore();
    const inWishlist = isInWishlist(product.id);

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();
        addItem({
            productId: product.id,
            name: product.name,
            price: product.price,
            image: product.images?.[0] || '',
            quantity: 1,
            stock: product.stock
        });
        toast.success(`${product.name} ajouté au panier`);
    };

    const handleWishlist = (e: React.MouseEvent) => {
        e.preventDefault();
        toggleItem({
            productId: product.id,
            name: product.name,
            price: product.price,
            comparePrice: product.comparePrice,
            image: product.images?.[0] || '',
            slug: product.slug,
            stock: product.stock,
            category: product.category?.name,
        });
        if (inWishlist) {
            toast.success('Retiré des favoris');
        } else {
            toast.success('Ajouté aux favoris ❤️');
        }
    };

    const mainImage = product.images?.[0] || '/images/placeholder-product.png';

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="group bg-white border border-creme2 shadow-sm hover:shadow-md transition-all duration-300"
        >
            <Link href={`/catalogue/${product.slug}`} className="block relative aspect-[4/5] overflow-hidden bg-creme2">
                {/* Badge */}
                {product.badge && (
                    <div className="absolute top-4 left-4 z-10">
                        <span className={`text-[9px] font-black uppercase tracking-[0.2em] px-3 py-1.5 rounded-sm shadow-md ${
                            product.badge === 'promo' ? 'bg-rouge-mid text-creme' :
                            product.badge === 'new' ? 'bg-[#3D1414] text-creme' : // NOUVEAU style
                            'bg-[#3D1414] text-creme' // BESTSELLER style
                        }`}>
                            {product.badge === 'new' ? 'Nouveau' : 
                             product.badge === 'top' ? 'Bestseller' : product.badge}
                        </span>
                    </div>
                )}

                {/* Wishlist Button */}
                <button
                    onClick={handleWishlist}
                    className={`absolute top-4 right-4 z-10 p-2.5 rounded-full bg-white text-encre hover:scale-110 transition-all shadow-md ${
                        inWishlist ? 'text-rouge-deep' : 'hover:text-rouge-mid'
                    }`}
                >
                    <Heart size={16} strokeWidth={2} className={inWishlist ? 'fill-rouge-deep' : ''} />
                </button>

                {/* Image */}
                <div className="relative w-full h-full group-hover:scale-105 transition-transform duration-700 ease-out">
                    {/* Utilisation de img standard pour garantir la visibilité en dev */}
                    <img
                        src={mainImage && !mainImage.includes('placeholder') && !mainImage.includes('placehold.co')
                            ? mainImage 
                            : 'https://images.unsplash.com/photo-1632345033839-245a1e2ca9cb?q=80&w=800&auto=format&fit=crop'
                        }
                        alt={product.name}
                        className="absolute inset-0 w-full h-full object-cover"
                        loading="lazy"
                    />
                </div>

                {/* Quick Add Overlay */}
                <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-gradient-to-t from-encre/80 via-encre/40 to-transparent z-20">
                    <button
                        onClick={handleAddToCart}
                        className="w-full bg-creme text-encre py-3 text-xs font-bold uppercase tracking-widest rounded-sm hover:bg-or hover:text-rouge-deep transition-colors flex items-center justify-center"
                    >
                        <ShoppingBag size={14} className="mr-2" />
                        Ajouter au panier
                    </button>
                </div>
            </Link>

            <div className="p-6">
                <div className="mb-2">
                    <Link href={`/categories/${product.category?.slug || '#'}`} className="text-[9px] font-black text-or uppercase tracking-[0.2em] hover:text-rouge-deep transition-colors">
                        {product.category?.name || 'Onglerie'}
                    </Link>
                </div>

                <Link href={`/catalogue/${product.slug}`} className="block mb-3">
                    <h3 className="font-serif text-xl text-encre hover:text-rouge-mid transition-colors line-clamp-1 leading-tight">
                        {product.name}
                    </h3>
                </Link>

                <div className="flex items-center justify-between mt-4">
                    <div className="flex items-baseline space-x-3">
                        <span className="text-xl font-bold text-encre">{formatPrice(product.price)}</span>
                        {product.comparePrice && (
                            <span className="text-sm text-encre3 line-through">{formatPrice(product.comparePrice)}</span>
                        )}
                    </div>
                    <div className="flex items-center text-encre3">
                        <Star size={12} className="fill-or text-or mr-1.5" />
                        <span className="text-[11px] font-bold">{product.averageRating?.toFixed(1) || '5.0'}</span>
                        <span className="text-[9px] ml-1 opacity-50">({product.reviewCount || 0})</span>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
