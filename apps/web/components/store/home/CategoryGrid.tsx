'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Skeleton } from '@/components/ui/Skeleton';

interface Category {
  id: string;
  name: string;
  slug: string;
  image?: string;
  productCount?: number;
}

interface CategoryGridProps {
  categories: Category[];
  loading?: boolean;
  columns?: number;
}

const CATEGORY_COLORS = [
  { bg: 'bg-rouge/10', text: 'text-rouge', border: 'border-rouge/20' },
  { bg: 'bg-or/10', text: 'text-or', border: 'border-or/20' },
  { bg: 'bg-encre/10', text: 'text-encre', border: 'border-encre/20' },
  { bg: 'bg-encre3/10', text: 'text-encre3', border: 'border-encre3/20' },
];

export function CategoryGrid({
  categories,
  loading = false,
  columns = 4,
}: CategoryGridProps) {
  const colsClass = {
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
  }[columns] || 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4';

  if (loading) {
    return (
      <div className={`grid ${colsClass} gap-6`}>
        {[...Array(columns)].map((_, i) => (
          <Skeleton key={i} className="aspect-square rounded-lg" />
        ))}
      </div>
    );
  }

  if (categories.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-encre3 font-outfit">Aucune catégorie disponible</p>
      </div>
    );
  }

  return (
    <div className={`grid ${colsClass} gap-6`}>
      {categories.map((category, idx) => {
        const color = CATEGORY_COLORS[idx % CATEGORY_COLORS.length];

        return (
          <Link
            key={category.id}
            href={`/catalogue?category=${category.slug}`}
            className={`group relative aspect-square rounded-lg overflow-hidden border-2 transition hover:shadow-lg ${color.bg} ${color.border}`}
          >
            {/* Background image if available */}
            {category.image && (
              <Image
                src={category.image}
                alt={category.name}
                fill
                className="object-cover group-hover:scale-110 transition duration-500"
              />
            )}

            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition" />

            {/* Content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
              <h3 className="font-serif font-bold text-xl mb-2 group-hover:text-white transition">
                {category.name}
              </h3>



              <div className="mt-4 opacity-0 group-hover:opacity-100 transition">
                <span className="inline-block px-4 py-2 bg-rouge hover:bg-rouge-mid text-white rounded font-outfit font-medium text-sm">
                  Parcourir
                </span>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
