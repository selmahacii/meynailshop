'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import ProductCard from '@/components/store/products/ProductCard';
import ProductFilters from '@/components/store/products/ProductFilters';
import ProductSort from '@/components/store/products/ProductSort';
import { Product } from '@/types/product';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2 } from 'lucide-react';

// Fallback mock data in case API is unavailable
const MOCK_PRODUCTS: Product[] = [
    {
        id: '1',
        name: 'Vernis Gel "Royal Red"',
        slug: 'vernis-gel-royal-red',
        description: 'Un rouge profond et élégant pour des ongles majestueux.',
        shortDescription: 'Rouge royal intense, 15ml.',
        sku: 'VG-RR-001',
        price: 1800,
        comparePrice: 2200,
        stock: 25,
        images: [],
        categoryId: 'cat1',
        category: { id: 'cat1', name: 'Vernis Gel', slug: 'vernis-gel', description: '', imageUrl: '', displayOrder: 1, isActive: true },
        badge: 'top',
        isActive: true,
        isFeatured: true,
        weight: 100,
        tags: ['rouge', 'premium'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        averageRating: 4.8
    },
    {
        id: '2',
        name: 'Gel UV de Construction - Rose Pastel',
        slug: 'gel-uv-pastel-pink',
        description: 'Gel auto-égalisant haute performance.',
        shortDescription: 'Pastel doux, 30g.',
        sku: 'GUV-PP-002',
        price: 3500,
        stock: 12,
        images: [],
        categoryId: 'cat2',
        category: { id: 'cat2', name: 'Gel UV', slug: 'gel-uv', description: '', imageUrl: '', displayOrder: 2, isActive: true },
        badge: 'new',
        isActive: true,
        isFeatured: false,
        weight: 150,
        tags: ['gel', 'construction'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        averageRating: 4.9
    },
    {
        id: '3',
        name: 'Finition "Mirror Shine" Ultra-Brillante',
        slug: 'top-coat-mirror-shine',
        description: 'Une brillance miroir qui dure 4 semaines.',
        shortDescription: 'High gloss top coat, 15ml.',
        sku: 'TC-MS-003',
        price: 1500,
        comparePrice: 1800,
        stock: 50,
        images: [],
        categoryId: 'cat3',
        category: { id: 'cat3', name: 'Finition', slug: 'finition', description: '', imageUrl: '', displayOrder: 3, isActive: true },
        badge: 'promo',
        isActive: true,
        isFeatured: true,
        weight: 100,
        tags: ['topcoat', 'brillance'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        averageRating: 5.0
    },
    {
        id: '4',
        name: 'Lampe UV/LED Professionnelle 48W',
        slug: 'lampe-led-48w',
        description: 'Séchage ultra-rapide pour tous les types de gels.',
        shortDescription: 'Pro LED lamp, sensor system.',
        sku: 'MAT-LP-004',
        price: 8500,
        stock: 8,
        images: [],
        categoryId: 'cat4',
        category: { id: 'cat4', name: 'Matériel', slug: 'materiel', description: '', imageUrl: '', displayOrder: 4, isActive: true },
        isActive: true,
        isFeatured: false,
        weight: 800,
        tags: ['lampe', 'professionnel'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    }
];

export default function CataloguePage() {
    const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const { productsApi } = await import('@/lib/api/products');
                const response = await productsApi.getAll({ limit: 50 });
                const data = response?.data;
                // Handle both paginated { items: [...] } and plain array responses
                const items = Array.isArray(data) ? data : (data?.items ?? []);
                setProducts(items.length > 0 ? items : MOCK_PRODUCTS);
            } catch {
                // API not available — use mock data
                setProducts(MOCK_PRODUCTS);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    return (
        <div className="pt-32 pb-24 bg-creme min-h-screen">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="mb-12">
                    <nav className="text-[10px] uppercase tracking-widest text-encre3 mb-4 flex items-center space-x-2">
                        <Link href="/" className="hover:text-or transition-colors">Accueil</Link>
                        <span>/</span>
                        <span className="text-encre font-bold">Catalogue</span>
                    </nav>
                    <h1 className="font-serif text-4xl md:text-5xl text-encre">Toute la Collection</h1>
                    <p className="text-encre3 text-sm mt-3 max-w-2xl leading-relaxed">
                        Explorez notre sélection de produits haut de gamme conçus pour révéler la beauté de chaque ongle.
                        Des vernis vibrants aux outils haute précision.
                    </p>
                </div>

                <div className="flex flex-col lg:flex-row gap-12">
                    {/* Desktop Sidebar */}
                    <aside className="hidden lg:block w-72 shrink-0">
                        <div className="sticky top-32">
                            <ProductFilters />
                        </div>
                    </aside>

                    {/* Main Content */}
                    <section className="flex-grow">
                        <ProductSort
                            total={products.length}
                            onOpenFilters={() => setIsMobileFiltersOpen(true)}
                        />

                        {loading ? (
                            <div className="flex items-center justify-center h-64">
                                <Loader2 size={32} className="animate-spin text-or" />
                            </div>
                        ) : (
                            <>
                                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
                                    {products.map((product) => (
                                        <ProductCard key={product.id} product={product} />
                                    ))}
                                </div>

                                {/* Pagination */}
                                <div className="mt-16 flex justify-center">
                                    <div className="flex space-x-2">
                                        <button className="w-10 h-10 border border-or bg-or text-rouge-deep flex items-center justify-center text-sm font-bold">1</button>
                                        <button className="w-10 h-10 border border-creme2 text-encre3 hover:border-or hover:text-or transition-colors flex items-center justify-center text-sm font-bold">2</button>
                                        <button className="w-10 h-10 border border-creme2 text-encre3 hover:border-or hover:text-or transition-colors flex items-center justify-center text-sm font-bold">3</button>
                                    </div>
                                </div>
                            </>
                        )}
                    </section>
                </div>
            </div>

            {/* Mobile Filters Drawer */}
            <AnimatePresence>
                {isMobileFiltersOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsMobileFiltersOpen(false)}
                            className="fixed inset-0 bg-encre/60 backdrop-blur-sm z-[100]"
                        />
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed top-0 right-0 h-full w-[85%] max-w-sm bg-creme z-[110] p-8 overflow-y-auto"
                        >
                            <div className="flex justify-between items-center mb-10">
                                <h3 className="font-serif text-2xl text-encre">Filtres</h3>
                                <button onClick={() => setIsMobileFiltersOpen(false)} className="text-encre">
                                    <X size={24} />
                                </button>
                            </div>
                            <ProductFilters onClose={() => setIsMobileFiltersOpen(false)} />
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
