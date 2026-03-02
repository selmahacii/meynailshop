'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Heart, ShoppingBag, Star } from 'lucide-react';
import { Product } from '@/types/product';
import { formatPrice } from '@/lib/utils/currency';
import { useCartStore } from '@/lib/store/cartStore';
import { toast } from 'sonner';

interface ProductCardProps {
    product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
    const addItem = useCartStore((state) => state.addItem);

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();
        addItem({
            productId: product.id,
            name: product.name,
            price: product.price,
            image: product.images[0] || '',
            quantity: 1,
            stock: product.stock
        });
        toast.success(`${product.name} ajouté au panier`);
    };

    const mainImage = product.images[0] || '/images/placeholder-product.webp';

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
                        <span className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-sm shadow-sm ${product.badge === 'promo' ? 'bg-rouge text-creme' :
                                product.badge === 'new' ? 'bg-or text-rouge-deep' :
                                    'bg-encre text-creme'
                            }`}>
                            {product.badge}
                        </span>
                    </div>
                )}

                {/* Wishlist Button */}
                <button className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/80 backdrop-blur-sm text-encre hover:text-rouge-mid transition-colors shadow-sm">
                    <Heart size={16} strokeWidth={1.5} />
                </button>

                {/* Image */}
                <div className="relative w-full h-full group-hover:scale-105 transition-transform duration-700 ease-out">
                    {/* Fallback pattern if no image */}
                    {!product.images[0] && (
                        <div className="absolute inset-0 flex items-center justify-center opacity-10">
                            <span className="font-serif text-8xl">M</span>
                        </div>
                    )}
                    <Image
                        src={mainImage}
                        alt={product.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
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

            <div className="p-5">
                <div className="flex justify-between items-start mb-2">
                    <Link href={`/categories/${product.category?.slug || '#'}`} className="text-[10px] font-bold text-or uppercase tracking-widest hover:underline">
                        {product.category?.name || 'Onglerie'}
                    </Link>
                    <div className="flex items-center text-encre3">
                        <Star size={10} className="fill-or text-or mr-1" />
                        <span className="text-[10px] font-bold">{product.averageRating?.toFixed(1) || '5.0'}</span>
                    </div>
                </div>

                <Link href={`/catalogue/${product.slug}`} className="block mb-3">
                    <h3 className="font-serif text-lg text-encre group-hover:text-rouge-mid transition-colors line-clamp-1">
                        {product.name}
                    </h3>
                </Link>

                <div className="flex items-center space-x-3">
                    <span className="text-lg font-bold text-encre">{formatPrice(product.price)}</span>
                    {product.comparePrice && (
                        <span className="text-xs text-encre3 line-through">{formatPrice(product.comparePrice)}</span>
                    )}
                </div>
            </div>
        </motion.div>
    );
}
