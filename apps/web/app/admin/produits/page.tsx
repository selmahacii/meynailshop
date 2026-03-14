'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import {
    Plus,
    Search,
    Bell,
    Download,
    Filter,
    LayoutGrid,
    List,
    ChevronDown,
    MoreVertical,
    Edit2,
    ShoppingBag,
    AlertCircle,
    Loader,
    Tag
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { ProductsAPI } from '@/lib/api/client';
import { AdminProduct, AdminStats } from '@/types/admin';

const tabs = [
    { name: 'Tous', key: 'all' },
    { name: 'Vernis Gel', key: 'vernis' },
    { name: 'Gel UV', key: 'uv' },
    { name: 'Décoration', key: 'deco' },
    { name: 'Stock faible', key: 'low' },
];

export default function AdminProductsPage() {
    const [activeTab, setActiveTab] = useState('all');
    const [products, setProducts] = useState<AdminProduct[]>([]);
    const [stats, setStats] = useState<AdminStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchProducts();
        fetchStats();
    }, [activeTab]);

    const fetchProducts = async () => {
        try {
            console.log('🔄 Products: Starting data fetch');
            setLoading(true);
            const result = await ProductsAPI.getAll(1, 50); // Get first page with 50 items
            console.log('📦 Products: API result received', result);

            if (result.success && result.data) {
                console.log('✅ Products: Data loaded successfully', result.data);
                let filteredProducts = result.data.items || [];

                // Filter based on active tab
                if (activeTab === 'low') {
                    filteredProducts = filteredProducts.filter((p: AdminProduct) => p.status === 'low_stock');
                } else if (activeTab !== 'all') {
                    // For category filtering, we'd need to match category names
                    // For now, just show all products
                }

                setProducts(filteredProducts);
            } else {
                console.error('❌ Products: API returned error', result.error);
                setError(result.error || 'Erreur lors du chargement des produits');
            }
        } catch (err) {
            console.error('💥 Products: Network error', err);
            setError('Impossible de charger les produits');
        } finally {
            setLoading(false);
        }
    };

    const fetchStats = async () => {
        try {
            // Get low stock products for stats
            const lowStockResult = await ProductsAPI.getLowStock(10);
            const allProductsResult = await ProductsAPI.getAll(1, 1000); // Get all products for total count

            if (lowStockResult.success && allProductsResult.success) {
                const lowStockCount = lowStockResult.data?.items?.length || 0;
                const totalProducts = allProductsResult.data?.total || 0;

                setStats({
                    totalProducts,
                    lowStockProducts: lowStockCount,
                    totalClients: 0, // Will be set from clients page
                    vipClients: 0,
                    totalRevenue: 0,
                    averageOrdersPerClient: 0
                });
            }
        } catch (err) {
            console.error('Stats error:', err);
        }
    };

    const getStatusBadge = (product: AdminProduct) => {
        if (product.stock === 0) {
            return { text: 'Rupture', color: 'bg-rouge text-creme' };
        } else if (product.stock <= product.alertThreshold) {
            return { text: 'Stock faible', color: 'bg-or text-encre' };
        } else {
            return { text: 'En stock', color: 'bg-green-600 text-white' };
        }
    };

    const getActionButton = (product: AdminProduct) => {
        if (product.stock === 0) {
            return { text: 'Commander', style: 'bg-rouge text-creme hover:bg-rouge-deep' };
        } else if (product.stock <= product.alertThreshold) {
            return { text: 'Commander', style: 'bg-or text-encre hover:bg-encre hover:text-creme' };
        } else {
            return { text: 'Éditer', style: 'bg-[#1A0A0A] text-creme hover:bg-rouge-deep' };
        }
    };

    return (
        <div className="space-y-6 md:space-y-8 p-4 md:p-8 pb-12">
            {/* Header Section */}
            <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-serif text-encre">Produits</h1>
                    <p className="text-encre3 text-[9px] md:text-[10px] uppercase tracking-widest font-bold mt-1">Catalogue & inventaire — {new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
                </div>

                <div className="flex flex-wrap items-center gap-2 md:gap-3">
                    <div className="relative group flex-grow sm:flex-grow-0">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-encre3 group-focus-within:text-or transition-colors" size={16} />
                        <input
                            type="text"
                            placeholder="Rechercher..."
                            className="pl-10 pr-4 py-2 bg-white border border-creme2 rounded-sm text-sm focus:outline-none focus:border-or focus:ring-1 focus:ring-or w-full sm:w-48 xl:w-64 shadow-sm transition-all"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <Link 
                            href="/admin/categories"
                            className="p-2 bg-white border border-creme2 rounded-sm text-encre3 hover:text-or hover:border-or transition-all shadow-sm flex items-center space-x-2"
                            title="Gérer les catégories"
                        >
                            <Tag size={18} />
                            <span className="hidden lg:inline text-[10px] uppercase font-bold tracking-widest">Catégories</span>
                        </Link>
                        <button className="p-2 bg-white border border-creme2 rounded-sm text-encre3 hover:text-or hover:border-or transition-all shadow-sm">
                            <Bell size={18} />
                        </button>
                    </div>
                    <Link 
                        href="/admin/produits/nouveau"
                        className="flex items-center justify-center space-x-2 px-4 py-2 bg-rouge-deep text-creme rounded-sm text-xs font-bold uppercase tracking-widest hover:bg-rouge-mid transition-all shadow-md flex-grow sm:flex-grow-0"
                    >
                        <Plus size={16} />
                        <span>Nouveau</span>
                    </Link>
                    <Link href="/" className="px-4 py-2 border border-encre text-encre rounded-sm text-xs font-bold hover:bg-encre hover:text-creme transition-all text-center flex-grow sm:flex-grow-0">
                        Boutique
                    </Link>
                </div>
            </div>

            {/* Summary Stats */}
            {stats && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                    {[
                        { label: 'Stock faible', value: stats.lowStockProducts.toString(), icon: AlertCircle, color: 'text-or', bg: 'bg-or/10' },
                        { label: 'Total produits', value: stats.totalProducts.toString(), icon: ShoppingBag, color: 'text-encre3', bg: 'bg-creme' },
                        { label: 'Ruptures totales', value: products.filter((p: AdminProduct) => p.status === 'out_of_stock').length.toString(), icon: AlertCircle, color: 'text-rouge', bg: 'bg-rouge/10' },
                    ].map((stat, i) => (
                        <div key={i} className="bg-white rounded-sm border border-creme2 p-4 md:p-6 flex items-center space-x-4 shadow-sm hover:border-or transition-all">
                            <div className={cn("w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center shrink-0", stat.bg)}>
                                <stat.icon size={20} className={stat.color} />
                            </div>
                            <div>
                                <p className="text-[9px] md:text-[10px] uppercase font-black tracking-widest text-encre3">{stat.label}</p>
                                <p className="text-xl md:text-2xl font-bold text-encre mt-1">{stat.value}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Content Filters */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                <div className="flex items-center bg-white p-1 rounded-sm border border-creme2 overflow-x-auto custom-scrollbar">
                    {tabs.map((tab) => (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key)}
                            className={cn(
                                "px-4 md:px-6 py-2 text-[9px] md:text-[10px] font-black uppercase tracking-widest rounded-sm transition-all whitespace-nowrap",
                                activeTab === tab.key
                                    ? "bg-[#1A0A0A] text-creme shadow-lg sm:scale-105"
                                    : "text-encre3 hover:bg-creme/50"
                            )}
                        >
                            {tab.name}
                        </button>
                    ))}
                </div>

                <div className="flex items-center space-x-2">

                    <button className="flex-1 sm:flex-none flex items-center justify-center space-x-2 px-4 py-2 bg-[#1A0A0A] text-creme text-[10px] md:text-xs font-bold uppercase tracking-widest rounded-sm hover:bg-rouge-deep transition-all shadow-lg group">
                        <Plus size={14} className="text-or" />
                        <span>Créer</span>
                    </button>
                </div>
            </div>

            {/* Products Grid */}
            {loading ? (
                <div className="flex items-center justify-center py-12">
                    <Loader className="w-8 h-8 text-or animate-spin" />
                    <span className="ml-2 text-encre3">Chargement des produits...</span>
                </div>
            ) : error ? (
                <div className="text-center py-12">
                    <AlertCircle className="w-12 h-12 text-rouge mx-auto mb-4" />
                    <p className="text-rouge">{error}</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {products.map((product) => {
                        const statusBadge = getStatusBadge(product);
                        const actionButton = getActionButton(product);

                        return (
                            <div key={product.id} className="bg-white rounded-sm border border-creme2 shadow-lg overflow-hidden group hover:border-or transition-all duration-500">
                                {/* Image / Color Preview */}
                                <div className="relative aspect-[4/3] p-12 bg-creme/20 flex items-center justify-center overflow-hidden">
                                    <div className="w-full h-full relative group-hover:scale-110 transition-transform duration-700">
                                        <Image
                                            src={product.images?.[0] || '/images/placeholder-product.png'} 
                                            alt={product.name} 
                                            fill
                                            className="object-cover"
                                        />
                                    </div>

                                    {/* Badges */}
                                    <div className="absolute top-4 right-4 flex flex-col items-end space-y-2">
                                        <span className="bg-white/90 backdrop-blur-sm text-encre px-2 py-1 rounded-sm text-[10px] font-black uppercase border border-creme2 shadow-sm">
                                            {product.stock} u.
                                        </span>
                                        {product.status === 'low_stock' && (
                                            <span className="bg-or text-encre px-2 py-1 rounded-sm text-[8px] font-black uppercase shadow-sm">
                                                Stock faible
                                            </span>
                                        )}
                                        {product.status === 'out_of_stock' && (
                                            <span className="bg-rouge text-creme px-2 py-1 rounded-sm text-[8px] font-black uppercase shadow-sm">
                                                Épuisé
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Info Section */}
                                <div className="p-6 border-t border-creme2">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <p className="text-[10px] uppercase font-bold text-or tracking-[0.2em] mb-1">{product.category}</p>
                                            <h3 className="font-serif text-lg text-encre group-hover:text-rouge-deep transition-colors">{product.name}</h3>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between mt-6">
                                        <span className="text-lg font-black text-encre">{product.price} DA</span>
                                        <div className="flex space-x-2">
                                            <Link 
                                                href={`/admin/produits/${product.id}`}
                                                className={cn("px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-sm transition-all", actionButton.style)}
                                            >
                                                {actionButton.text}
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Empty States / Loading Scaffolding */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 opacity-40">
                <div className="border border-dashed border-creme2 rounded-sm p-12 flex flex-col items-center justify-center text-encre3 space-y-4">
                    <ShoppingBag size={48} strokeWidth={1} />
                    <p className="font-serif text-lg">Ajouter une nouvelle variante</p>
                </div>
                <div className="border border-dashed border-creme2 rounded-sm p-12 flex flex-col items-center justify-center text-encre3 space-y-4">
                    <AlertCircle size={48} strokeWidth={1} />
                    <p className="font-serif text-lg">Gérer les alertes globales</p>
                </div>
            </div>
        </div>
    );
}
