'use client';

import { useState, useEffect } from 'react';
import { Product } from '@/types/product';
import { StoreAPI } from '@/lib/api/client';
import ProductCard from '@/components/store/products/ProductCard';
import ProductCardSkeleton from '@/components/store/products/ProductCardSkeleton';

export default function CartRecommendations() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRecs = async () => {
            try {
                const res = await StoreAPI.getFeatured();
                if (res.success) {
                    setProducts(res.data?.slice(0, 4) || []);
                }
            } catch (err) {
                console.error('Failed to fetch recommendations:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchRecs();
    }, []);

    if (!loading && products.length === 0) return null;

    return (
        <div className="mt-20 border-t border-creme2 pt-16">
            <div className="flex flex-col mb-10">
                <h2 className="font-serif text-3xl text-encre mb-2">Complétez votre routine</h2>
                <div className="w-12 h-0.5 bg-or"></div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {loading ? (
                    Array(4).fill(0).map((_, i) => <ProductCardSkeleton key={i} />)
                ) : (
                    products.map(product => (
                        <ProductCard key={product.id} product={product} />
                    ))
                )}
            </div>
        </div>
    );
}
