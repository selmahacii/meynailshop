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
import { cn } from '@/lib/utils';

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
            className="group bg-white border-2 border-rouge-brand shadow-sm hover:shadow-2xl hover:border-rouge-brand/50 transition-all duration-500 rounded-[20px] sm:rounded-[30px] overflow-hidden"
        >
            <Link href={`/catalogue/${product.slug}`} className="block relative aspect-[4/5] overflow-hidden bg-creme2">
                {/* Badges */}
                <div className="absolute top-2 left-2 sm:top-4 sm:left-4 z-10 flex flex-col gap-1.5">
                    {product.comparePrice && product.comparePrice > product.price && (
                        <span className="text-[8px] sm:text-[10px] font-black uppercase tracking-[0.1em] sm:tracking-[0.2em] px-2 py-1 sm:px-3 sm:py-1.5 rounded-sm shadow-md bg-rouge-brand text-gold-brand border border-gold-brand/30">
                            -{Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)}%
                        </span>
                    )}
                    {product.badge && (
                        <span className={cn(
                            "text-[7px] sm:text-[9px] font-black uppercase tracking-[0.1em] sm:tracking-[0.2em] px-2 py-1 sm:px-3 sm:py-1.5 rounded-sm shadow-md bg-rouge-brand text-gold-brand border border-gold-brand/20",
                        )}>
                            {product.badge === 'new' ? 'Nouveau' : 
                             product.badge === 'top' ? 'Best' : product.badge}
                        </span>
                    )}
                </div>

                {/* Wishlist Button */}
                <button
                    onClick={handleWishlist}
                    className={`absolute top-2 right-2 sm:top-4 sm:right-4 z-10 p-1.5 sm:p-2.5 rounded-full bg-white text-encre hover:scale-110 transition-all shadow-md ${
                        inWishlist ? 'text-rouge-deep' : 'hover:text-rouge-mid'
                    }`}
                >
                    <Heart size={13} strokeWidth={2} className={cn('sm:hidden', inWishlist ? 'fill-rouge-deep' : '')} />
                    <Heart size={16} strokeWidth={2} className={cn('hidden sm:block', inWishlist ? 'fill-rouge-deep' : '')} />
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
                    {product.hasVariants ? (
                        <Link
                            href={`/catalogue/${product.slug}`}
                            className="w-full bg-creme text-encre py-3 text-xs font-bold uppercase tracking-widest rounded-sm hover:bg-or hover:text-rouge-deep transition-colors flex items-center justify-center"
                        >
                            <ShoppingBag size={14} className="mr-2" />
                            Choisir options
                        </Link>
                    ) : (
                        <button
                            onClick={handleAddToCart}
                            disabled={product.stock === 0}
                            className="w-full bg-creme text-encre py-3 text-xs font-bold uppercase tracking-widest rounded-sm hover:bg-or hover:text-rouge-deep transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <ShoppingBag size={14} className="mr-2" />
                            {product.stock === 0 ? 'Épuisé' : 'Ajouter au panier'}
                        </button>
                    )}
                </div>
            </Link>

            <div className="p-3 sm:p-6">
                <div className="mb-1 sm:mb-2">
                    <Link href={`/categories/${product.category?.slug || '#'}`} className="text-[8px] sm:text-[9px] font-black text-or uppercase tracking-[0.15em] sm:tracking-[0.2em] hover:text-rouge-deep transition-colors">
                        {product.category?.name || 'Onglerie'}
                    </Link>
                </div>

                <Link href={`/catalogue/${product.slug}`} className="block mb-2 sm:mb-3">
                    <h3 className="font-serif text-[14px] sm:text-xl text-encre hover:text-rouge-mid transition-colors line-clamp-2 sm:line-clamp-1 leading-tight">
                        {product.name}
                    </h3>
                </Link>

                <div className="flex items-center justify-between mt-2 sm:mt-4">
                    <div className="flex flex-col sm:flex-row sm:items-baseline sm:space-x-3">
                        <span className="text-[14px] sm:text-xl font-bold text-encre">{formatPrice(product.price)}</span>
                        {product.comparePrice && (
                            <span className="text-[10px] sm:text-sm text-encre3 line-through">{formatPrice(product.comparePrice)}</span>
                        )}
                    </div>
                    <div className="flex items-center text-encre3">
                        <Star size={10} className="fill-or text-or mr-1" />
                        <span className="text-[10px] sm:text-[11px] font-bold">{product.averageRating?.toFixed(1) || '5.0'}</span>
                        <span className="hidden sm:inline text-[9px] ml-1 opacity-50">({product.reviewCount || 0})</span>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
