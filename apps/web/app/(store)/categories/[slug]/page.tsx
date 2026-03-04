'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import ProductCard from '@/components/store/products/ProductCard';
import ProductFilters from '@/components/store/products/ProductFilters';

// Mock data for categories and products (shared with catalogue for consistency)
const CATEGORIES = {
    'vernis-gel': { name: 'Vernis Gel', description: 'Une pigmentation intense et une tenue irréprochable.' },
    'gel-uv': { name: 'Gel UV & Résine', description: 'La base solide pour des extensions parfaites.' },
    'materiel': { name: 'Matériel & Lampes', description: 'Outils professionnels pour des résultats salon.' },
    'outils': { name: 'Pinceaux & Outils', description: 'Précision et confort pour chaque détail.' },
    'finition': { name: 'Finition & Top Coat', description: 'La touche finale pour une brillance miroir.' },
};

const MOCK_PRODUCTS = [
    {
        id: '1',
        name: 'Vernis Gel "Royal Red"',
        slug: 'vernis-gel-royal-red',
        price: 1800,
        comparePrice: 2200,
        images: [],
        category: { id: 'cat1', name: 'Vernis Gel', slug: 'vernis-gel' },
        badge: 'top',
        averageRating: 4.8,
        stock: 25
    },
    {
        id: '2',
        name: 'Gel Builder Clear 50g',
        slug: 'gel-builder-clear',
        price: 3200,
        comparePrice: 3800,
        images: [],
        category: { id: 'cat2', name: 'Gel UV', slug: 'gel-uv' },
        badge: 'new',
        averageRating: 4.9,
        stock: 12
    },
    {
        id: '3',
        name: 'Lampe UV/LED Pro 48W',
        slug: 'lampe-pro-48w',
        price: 6500,
        images: [],
        category: { id: 'cat3', name: 'Matériel', slug: 'materiel' },
        averageRating: 4.7,
        stock: 8
    }
];

export default function CategoryPage() {
    const { slug } = useParams();
    const categoryKey = slug as keyof typeof CATEGORIES;
    const categoryInfo = CATEGORIES[categoryKey] || { name: 'Catégorie', description: 'Découvrez notre sélection.' };

    // Filter products by category slug
    const filteredProducts = MOCK_PRODUCTS.filter(p => p.category.slug === slug);

    return (
        <div className="pt-32 pb-24 bg-creme min-h-screen">
            <div className="container mx-auto px-4">
                {/* Header Section */}
                <div className="max-w-4xl mb-16">
                    <nav className="text-[10px] uppercase tracking-widest text-encre3 mb-6 flex items-center">
                        <Link href="/" className="hover:text-or transition-colors">Accueil</Link>
                        <ChevronRight size={10} className="mx-2" />
                        <Link href="/catalogue" className="hover:text-or transition-colors">Catalogue</Link>
                        <ChevronRight size={10} className="mx-2" />
                        <span className="text-encre font-bold">{categoryInfo.name}</span>
                    </nav>

                    <h1 className="font-serif text-5xl md:text-6xl text-encre mb-6">{categoryInfo.name}</h1>
                    <p className="text-encre3 text-lg font-light max-w-2xl leading-relaxed">
                        {categoryInfo.description}
                    </p>
                </div>

                <div className="flex flex-col lg:flex-row gap-12">
                    {/* Filters Sidebar */}
                    <aside className="w-full lg:w-64 shrink-0">
                        <div className="sticky top-32">
                            <ProductFilters />
                        </div>
                    </aside>

                    {/* Product Grid */}
                    <div className="flex-grow">
                        {filteredProducts.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
                                {filteredProducts.map((product) => (
                                    <ProductCard key={product.id} product={product as any} />
                                ))}
                            </div>
                        ) : (
                            <div className="bg-white border border-creme2 p-16 text-center rounded-sm">
                                <p className="text-encre3 mb-6">Aucun produit trouvé dans cette catégorie pour le moment.</p>
                                <Link href="/catalogue" className="text-or font-bold uppercase tracking-widest text-xs underline">
                                    Voir tout le catalogue
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
