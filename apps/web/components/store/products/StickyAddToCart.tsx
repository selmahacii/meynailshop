'use client';

import { useState, useEffect } from 'react';
import { ShoppingBag, ChevronUp } from 'lucide-react';
import { formatPrice } from '@/lib/utils/currency';
import { cn } from '@/lib/utils';
import Image from 'next/image';

interface StickyAddToCartProps {
    product: any;
    onAdd: () => void;
    visible: boolean;
    selectedVariantIndex?: number | null;
}

export default function StickyAddToCart({ product, onAdd, visible, selectedVariantIndex }: StickyAddToCartProps) {
    if (!product || product.stock === 0) return null;

    const variant = (selectedVariantIndex !== undefined && selectedVariantIndex !== null && product.variants)
        ? product.variants[selectedVariantIndex]
        : null;

    const activeImage = variant?.image || product.images?.[0] || '/images/placeholder.png';
    const activePrice = (variant && variant.price !== undefined && variant.price !== null)
        ? variant.price
        : product.price;

    return (
        <div className={cn(
            "fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-creme2 p-4 transition-all duration-500 transform lg:hidden",
            visible ? "translate-y-0 opacity-100 shadow-[0_-10px_30px_rgba(0,0,0,0.1)]" : "translate-y-full opacity-0"
        )}>
            <div className="flex items-center gap-4">
                <div className="relative w-12 h-12 rounded-sm overflow-hidden bg-creme flex-shrink-0">
                    <Image 
                        src={activeImage} 
                        alt={product.name}
                        fill
                        className="object-cover"
                    />
                </div>
                
                <div className="flex-grow min-w-0">
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-encre truncate">
                        {product.name}
                        {variant?.sku && <span className="text-rouge-deep font-mono ml-1">({variant.sku})</span>}
                    </h4>
                    <p className="text-sm font-bold text-rouge-deep">{formatPrice(activePrice)}</p>
                </div>

                <button
                    onClick={onAdd}
                    className="bg-rouge-deep text-white px-6 py-3 rounded-sm text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-lg active:scale-95 transition-all"
                >
                    <ShoppingBag size={16} />
                    Ajouter
                </button>
            </div>
        </div>
    );
}
