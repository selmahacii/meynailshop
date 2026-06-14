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
    ChevronLeft,
    ChevronRight,
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
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const ITEMS_PER_PAGE = 12;

    useEffect(() => {
        fetchProducts();
        fetchStats();
    }, [activeTab, search, page]);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const result = await ProductsAPI.getAll(page, ITEMS_PER_PAGE, search);

            if (result.success && result.data) {
                let items = result.data.items || [];
                
                // Server-side filtering is better, but keeping activeTab logic for compatibility
                if (activeTab === 'low') {
                    items = items.filter((p: AdminProduct) => p.status === 'low_stock');
                }

                setProducts(items);
                setTotalPages(result.data.totalPages || 1);
            } else {
                setError(result.error || 'Erreur lors du chargement des produits');
            }
        } catch (err) {
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
            return { text: 'Gérer', style: 'bg-rose-50 text-rouge-mid border border-rose-100 hover:bg-rouge-mid hover:text-white rounded-xl' };
        } else if (product.stock <= product.alertThreshold) {
            return { text: 'Gérer', style: 'bg-amber-50 text-or border border-amber-100 hover:bg-or hover:text-rouge-brand rounded-xl' };
        } else {
            return { text: 'Éditer', style: 'bg-rouge-brand text-creme hover:bg-or hover:text-rouge-brand rounded-xl' };
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
                            value={search}
                            onChange={(e) => {
                                setSearch(e.target.value);
                                setPage(1); // Reset to first page on search
                            }}
                            className="pl-10 pr-4 py-2 bg-white border border-gold-brand/20 rounded-xl text-sm focus:outline-none focus:border-or focus:ring-1 focus:ring-or w-full sm:w-48 xl:w-64 shadow-sm transition-all"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <Link 
                            href="/admin/categories"
                            className="p-2.5 bg-white border border-gold-brand/20 rounded-xl text-encre3 hover:text-or hover:border-or transition-all shadow-sm flex items-center space-x-2"
                            title="Gérer les catégories"
                        >
                            <Tag size={18} className="text-or" />
                            <span className="hidden lg:inline text-[9px] uppercase font-black tracking-widest">Catégories</span>
                        </Link>
                    </div>
                    <Link 
                        href="/admin/produits/nouveau"
                        className="flex items-center justify-center space-x-2 px-6 py-2.5 bg-rouge-brand text-creme rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-or hover:text-rouge-brand hover:shadow-xl hover:shadow-rouge-brand/10 transition-all shadow-md flex-grow sm:flex-grow-0"
                    >
                        <Plus size={16} />
                        <span>Nouveau</span>
                    </Link>
                </div>
            </div>

            {/* Summary Stats */}
            {stats && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                    {[
                        { label: 'Stock faible', value: stats.lowStockProducts.toString(), icon: AlertCircle, color: 'text-or', bg: 'bg-or/10' },
                        { label: 'Total produits', value: stats.totalProducts.toString(), icon: ShoppingBag, color: 'text-encre3', bg: 'bg-creme2/20' },
                        { label: 'Ruptures totales', value: products.filter((p: AdminProduct) => p.status === 'out_of_stock').length.toString(), icon: AlertCircle, color: 'text-rouge', bg: 'bg-rouge/10' },
                    ].map((stat, i) => (
                        <div key={i} className="bg-white rounded-[2rem] border border-gold-brand/10 p-4 md:p-6 flex items-center space-x-4 shadow-sm hover:shadow-2xl hover:shadow-black/[0.02] hover:border-gold-brand/35 transition-all">
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
                <div className="flex items-center bg-white p-1.5 rounded-2xl border border-gold-brand/10 shadow-sm overflow-x-auto custom-scrollbar">
                    {tabs.map((tab) => (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key)}
                            className={cn(
                                "px-4 md:px-6 py-2 text-[9px] md:text-[10px] font-black uppercase tracking-widest rounded-xl transition-all whitespace-nowrap",
                                activeTab === tab.key
                                    ? "bg-rouge-brand text-creme shadow-md shadow-black/10 sm:scale-105"
                                    : "text-encre3 hover:bg-creme/50"
                            )}
                        >
                            {tab.name}
                        </button>
                    ))}
                </div>

                <div className="flex items-center space-x-2">
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
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-8">
                    {products.map((product) => {
                        const statusBadge = getStatusBadge(product);
                        const actionButton = getActionButton(product);

                        return (
                            <div key={product.id} className="bg-white rounded-2xl sm:rounded-[2rem] border border-gold-brand/10 hover:shadow-2xl hover:shadow-black/[0.02] overflow-hidden group hover:border-gold-brand/40 transition-all duration-500 shadow-sm">
                                {/* Image / Color Preview */}
                                <div className="relative aspect-[4/3] p-2.5 sm:p-6 bg-creme/10 flex items-center justify-center overflow-hidden">
                                    <div className="w-full h-full relative group-hover:scale-110 transition-transform duration-700">
                                        <Image
                                            src={product.images?.[0] || '/images/placeholder-product.png'} 
                                            alt={product.name} 
                                            fill
                                            className="object-cover"
                                        />
                                    </div>

                                    {/* Badges */}
                                    <div className="absolute top-2 right-2 sm:top-4 sm:right-4 flex flex-col items-end space-y-1 sm:space-y-2">
                                        <span className="bg-white/90 backdrop-blur-sm text-encre px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-lg sm:rounded-xl text-[8px] sm:text-[10px] font-black uppercase border border-creme2 shadow-sm">
                                            {product.stock} u.
                                        </span>
                                        {product.status === 'low_stock' && (
                                            <span className="bg-or text-encre px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-lg sm:rounded-xl text-[7px] sm:text-[8px] font-black uppercase shadow-sm">
                                                Stock faible
                                            </span>
                                        )}
                                        {product.status === 'out_of_stock' && (
                                            <span className="bg-rouge text-creme px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-lg sm:rounded-xl text-[7px] sm:text-[8px] font-black uppercase shadow-sm">
                                                Épuisé
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Info Section */}
                                <div className="p-3 sm:p-6 border-t border-creme2">
                                    <div className="flex justify-between items-start mb-2 sm:mb-4">
                                        <div>
                                            <div className="flex items-center space-x-1.5 sm:space-x-2 mb-1">
                                                <p className="text-[8px] sm:text-[10px] uppercase font-bold text-or tracking-[0.15em] sm:tracking-[0.2em]">{product.category}</p>
                                                {product.badge && (
                                                    <span className={cn(
                                                        "text-[6px] sm:text-[7px] font-black uppercase px-1 sm:px-1.5 py-0.5 rounded-lg sm:rounded-xl",
                                                        product.badge === 'promo' ? "bg-rouge text-creme" : "bg-encre text-or"
                                                    )}>
                                                        {product.badge}
                                                    </span>
                                                )}
                                            </div>
                                            <h3 className="font-serif text-xs sm:text-lg text-encre group-hover:text-rouge-deep transition-colors line-clamp-1">{product.name}</h3>
                                            <p className="text-[8px] sm:text-[9px] font-mono text-encre3 mt-0.5 sm:mt-1 leading-none">{product.sku}</p>
                                        </div>
                                    </div>

                                    <div className="flex flex-col mt-3 sm:mt-6">
                                        <div className="flex items-baseline space-x-1.5 sm:space-x-2">
                                            <span className="text-sm sm:text-xl font-black text-encre">{product.price} DA</span>
                                            {product.comparePrice && product.comparePrice > product.price && (
                                                <span className="text-[10px] sm:text-xs text-encre3 line-through opacity-50">{product.comparePrice} DA</span>
                                            )}
                                        </div>
                                        
                                        <div className="flex items-center justify-between mt-2 sm:mt-4">

                                            <div className="flex space-x-1 sm:space-x-2 ml-auto">
                                                <Link 
                                                    href={`/admin/produits/${product.id}`}
                                                    className={cn("px-2 py-1.5 sm:px-4 sm:py-2 text-[8px] sm:text-[10px] font-black uppercase tracking-wider sm:tracking-widest rounded-lg sm:rounded-xl transition-all", actionButton.style)}
                                                >
                                                    {actionButton.text}
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Pagination UI */}
            {!loading && !error && products.length > 0 && totalPages > 1 && (
                <div className="flex items-center justify-center space-x-2 mt-12 py-8 border-t border-creme2">
                    <button
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        disabled={page === 1}
                        className="p-2 border border-creme2 rounded-xl text-encre3 hover:text-or hover:border-or disabled:opacity-30 disabled:hover:text-encre3 disabled:hover:border-creme2 transition-all"
                    >
                        <ChevronLeft size={20} />
                    </button>
                    
                    <div className="flex items-center space-x-1">
                        {[...Array(totalPages)].map((_, i) => {
                            const p = i + 1;
                            // Basic pagination logic: show first, last, and pages around current
                            if (p === 1 || p === totalPages || (p >= page - 1 && p <= page + 1)) {
                                return (
                                    <button
                                        key={p}
                                        onClick={() => setPage(p)}
                                        className={cn(
                                            "w-10 h-10 flex items-center justify-center text-xs font-bold rounded-xl transition-all",
                                            page === p 
                                                ? "bg-encre text-creme shadow-md" 
                                                : "bg-white border border-creme2 text-encre3 hover:border-or hover:text-or"
                                        )}
                                    >
                                        {p}
                                    </button>
                                );
                            } else if (p === page - 2 || p === page + 2) {
                                return <span key={p} className="px-1 text-encre3">...</span>;
                            }
                            return null;
                        })}
                    </div>

                    <button
                        onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                        disabled={page === totalPages}
                        className="p-2 border border-creme2 rounded-xl text-encre3 hover:text-or hover:border-or disabled:opacity-30 disabled:hover:text-encre3 disabled:hover:border-creme2 transition-all"
                    >
                        <ChevronRight size={20} />
                    </button>
                </div>
            )}

            {/* Empty States / Loading Scaffolding */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 opacity-40">
                <div className="border border-dashed border-creme2 rounded-xl p-12 flex flex-col items-center justify-center text-encre3 space-y-4">
                    <ShoppingBag size={48} strokeWidth={1} />
                    <p className="font-serif text-lg">Ajouter une nouvelle variante</p>
                </div>
                <div className="border border-dashed border-creme2 rounded-xl p-12 flex flex-col items-center justify-center text-encre3 space-y-4">
                    <AlertCircle size={48} strokeWidth={1} />
                    <p className="font-serif text-lg">Gérer les alertes globales</p>
                </div>
            </div>
        </div>
    );
}
