'use client';

import Link from 'next/link';
import { ProductCard } from '@/components/store/products/ProductCard';
import { Skeleton } from '@/components/ui/Skeleton';
import { ArrowRight } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  slug: string;
  shortDescription?: string;
  price: number;
  images: string[];
  badge?: 'new' | 'sale' | 'bestseller';
  inStock: boolean;
  discountPercentage?: number;
}

interface FeaturedProductsProps {
  title?: string;
  products: Product[];
  loading?: boolean;
  showViewAll?: boolean;
}

export function FeaturedProducts({
  title = 'Produits Populaires',
  products,
  loading = false,
  showViewAll = true,
}: FeaturedProductsProps) {
  if (loading) {
    return (
      <section className="py-12">
        <h2 className="font-serif text-3xl font-bold text-encre mb-8">{title}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="aspect-[3/4]" />
          ))}
        </div>
      </section>
    );
  }

  if (products.length === 0) {
    return (
      <section className="py-12 text-center">
        <h2 className="font-serif text-3xl font-bold text-encre mb-4">{title}</h2>
        <p className="text-encre3">Aucun produit disponible</p>
      </section>
    );
  }

  return (
    <section className="py-12">
      <div className="flex items-center justify-between mb-8">
        <h2 className="font-serif text-3xl font-bold text-encre">{title}</h2>
        {showViewAll && (
          <Link
            href="/catalogue"
            className="flex items-center gap-2 text-rouge hover:text-rouge-mid font-outfit font-medium transition"
          >
            Voir tous
            <ArrowRight className="w-4 h-4" />
          </Link>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.slice(0, 4).map((product) => (
          <ProductCard
            key={product.id}
            product={product}
          />
        ))}
      </div>
    </section>
  );
}
