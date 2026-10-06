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
        e.stopPropagation();

        if (!product.stock || product.stock <= 0) {
            toast.error("Ce produit est en rupture de stock");
            return;
        }
        
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
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="group bg-white border border-gold-brand/15 hover:border-gold-brand/45 transition-all duration-500 rounded-[20px] sm:rounded-[24px] overflow-hidden hover:-translate-y-1.5 shadow-sm hover:shadow-[0_20px_50px_rgba(191,168,147,0.15)]"
        >
            <Link href={`/catalogue/${product.slug}`} className="block relative aspect-[4/5] overflow-hidden bg-creme2">
                {/* Badges */}
                <div className="absolute top-2 left-2 sm:top-4 sm:left-4 z-10 flex flex-col gap-1.5">
                    {Number(product.comparePrice) > Number(product.price) && Number(product.comparePrice) > 0 && (
                        <span className="text-[7px] sm:text-[9px] font-black uppercase tracking-[0.2em] px-2.5 py-1 rounded-full shadow-lg bg-rouge-brand text-gold-brand border border-gold-brand/20 backdrop-blur-md">
                            -{Math.round(((Number(product.comparePrice) - Number(product.price)) / Number(product.comparePrice)) * 100)}%
                        </span>
                    )}
                    {product.badge && (
                        <span className={cn(
                            "text-[7px] sm:text-[9px] font-black uppercase tracking-[0.2em] px-2.5 py-1 rounded-full shadow-lg bg-rouge-brand text-gold-brand border border-gold-brand/20 backdrop-blur-md",
                        )}>
                            {product.badge === 'new' ? 'Nouveau' : 
                             product.badge === 'top' ? 'Best' : product.badge}
                        </span>
                    )}
                </div>
 
                {/* Wishlist Button */}
                <button
                    onClick={handleWishlist}
                    className={`absolute top-2 right-2 sm:top-4 sm:right-4 z-10 p-2 sm:p-2.5 rounded-full bg-white/80 hover:bg-white text-encre hover:scale-105 active:scale-95 transition-all shadow-md backdrop-blur-md ${
                        inWishlist ? 'text-rouge-deep' : 'hover:text-rouge-mid'
                    }`}
                >
                    <Heart size={13} strokeWidth={2} className={cn('sm:hidden', inWishlist ? 'fill-rouge-deep' : '')} />
                    <Heart size={15} strokeWidth={2} className={cn('hidden sm:block', inWishlist ? 'fill-rouge-deep' : '')} />
                </button>

                {/* Mobile Floating Quick Add Button (Permanently visible on mobile/tablet) */}
                <div className="absolute bottom-2 right-2 z-10 sm:hidden">
                    {product.hasVariants ? (
                        <button
                            onClick={(e) => {
                                // Nested button inside Link -> click will trigger standard link navigation
                            }}
                            className="p-2.5 rounded-full bg-gold-brand text-rouge-brand shadow-lg active:scale-95 transition-all flex items-center justify-center backdrop-blur-md"
                        >
                            <ShoppingBag size={14} />
                        </button>
                    ) : (
                        <button
                            onClick={handleAddToCart}
                            disabled={!product.stock || product.stock <= 0}
                            className="p-2.5 rounded-full bg-gold-brand text-rouge-brand shadow-lg active:scale-95 transition-all flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed backdrop-blur-md"
                        >
                            <ShoppingBag size={14} />
                        </button>
                    )}
                </div>
 
                {/* Image */}
                <div className="relative w-full h-full group-hover:scale-105 transition-transform duration-700 ease-out">
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
 
                {/* Quick Add Overlay (Desktop Only) */}
                <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-rouge-brand/95 backdrop-blur-md z-20 hidden sm:block">
                    {product.hasVariants ? (
                        <Link
                            href={`/catalogue/${product.slug}`}
                            className="w-full bg-gold-brand hover:bg-creme text-rouge-brand py-3 text-[10px] font-black uppercase tracking-[0.2em] rounded-[4px] hover:shadow-lg transition-all flex items-center justify-center"
                        >
                            <ShoppingBag size={13} className="mr-2" />
                            Choisir options
                        </Link>
                    ) : (
                        <button
                            onClick={handleAddToCart}
                            disabled={!product.stock || product.stock <= 0}
                            className="w-full bg-gold-brand hover:bg-creme text-rouge-brand py-3 text-[10px] font-black uppercase tracking-[0.2em] rounded-[4px] hover:shadow-lg transition-all flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <ShoppingBag size={13} className="mr-2" />
                            {(!product.stock || product.stock <= 0) ? 'Épuisé' : 'Ajouter au panier'}
                        </button>
                    )}
                </div>
            </Link>
 
            <div className="p-4 sm:p-6">
                <div className="mb-1.5">
                    <Link href={`/categories/${product.category?.slug || '#'}`} className="text-[8px] sm:text-[9px] font-bold text-or uppercase tracking-[0.2em] hover:text-rouge-deep transition-colors">
                        {product.category?.name || 'Onglerie'}
                    </Link>
                </div>
 
                <Link href={`/catalogue/${product.slug}`} className="block mb-2 sm:mb-3">
                    <h3 className="font-italiana text-[16px] sm:text-2xl text-encre hover:text-rouge-mid transition-colors line-clamp-1 font-normal tracking-wide leading-tight">
                        {product.name}
                    </h3>
                </Link>
 
                <div className="flex items-center justify-between mt-3 sm:mt-4">
                    <div className="flex items-baseline gap-2">
                        <span className="text-[14px] sm:text-lg font-bold text-encre">{formatPrice(product.price)}</span>
                        {product.comparePrice && (
                            <span className="text-[10px] sm:text-xs text-encre3 line-through opacity-70">{formatPrice(product.comparePrice)}</span>
                        )}
                    </div>
                    <div className="flex items-center text-encre3 gap-1">
                        <Star size={10} className="fill-or text-or" />
                        <span className="text-[10px] sm:text-xs font-bold text-encre">{product.averageRating?.toFixed(1) || '5.0'}</span>
                        <span className="text-[9px] opacity-40">({product.reviewCount || 0})</span>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
