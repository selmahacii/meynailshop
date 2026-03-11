'use client';

import { useState, useEffect } from 'react';
import { Search, Bell, Download, Plus, AlertTriangle, TrendingDown, Package, ChevronDown, Filter, Loader, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { ProductsAPI } from '@/lib/api/client';

const statusConfig: Record<string, { label: string; color: string }> = {
    ok: { label: 'En stock', color: 'bg-green-100 text-green-700' },
    low: { label: 'Stock faible', color: 'bg-yellow-100 text-yellow-700' },
    out: { label: 'Rupture', color: 'bg-red-100 text-red-600' },
};

function getStockStatus(stock: number, threshold: number): string {
    if (stock === 0) return 'out';
    if (stock <= threshold) return 'low';
    return 'ok';
}

export default function AdminStockPage() {
    const [filter, setFilter] = useState('all');
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            setError(null);
            const result = await ProductsAPI.getAll(1, 200);

            if (result.success && result.data) {
                const items = result.data.items || result.data || [];
                setProducts(items);
            } else {
                setError(result.error || 'Erreur lors du chargement du stock');
            }
        } catch (err) {
            console.error('Stock fetch error:', err);
            setError('Impossible de charger les données de stock');
        } finally {
            setLoading(false);
        }
    };

    const stockItems = products.map((p: any) => ({
        id: p.id,
        name: p.name,
        ref: p.sku || '—',
        category: p.category?.name || p.category || '—',
        stock: p.stock ?? 0,
        threshold: p.stockAlert || p.alertThreshold || 5,
        status: getStockStatus(p.stock ?? 0, p.stockAlert || p.alertThreshold || 5),
    }));

    const filtered = stockItems.filter(item => filter === 'all' || item.status === filter);
    const outCount = stockItems.filter(i => i.status === 'out').length;
    const lowCount = stockItems.filter(i => i.status === 'low').length;

    return (
        <div className="space-y-8 pb-12">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-serif text-encre">Stock</h1>
                    <p className="text-encre3 text-[10px] uppercase tracking-widest font-bold mt-1">
                        Gestion de l'inventaire — {new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })}
                    </p>
                </div>
                <div className="flex items-center space-x-3">
                    <div className="relative group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-encre3 group-focus-within:text-or transition-colors" size={16} />
                        <input type="text" placeholder="Rechercher..." className="pl-10 pr-4 py-2.5 bg-white border border-creme2 rounded-sm text-sm focus:outline-none focus:border-or focus:ring-1 focus:ring-or w-64 shadow-sm" />
                    </div>
                    <button className="p-2.5 bg-white border border-creme2 rounded-sm text-encre3 hover:text-or hover:border-or transition-all shadow-sm"><Bell size={18} /></button>
                    <button className="p-2.5 bg-white border border-creme2 rounded-sm text-encre3 hover:text-or hover:border-or transition-all shadow-sm"><Download size={18} /></button>
                    <button className="flex items-center space-x-2 px-5 py-2.5 bg-rouge-deep text-creme rounded-sm text-sm font-bold uppercase tracking-widest hover:bg-rouge-mid transition-all shadow-md">
                        <Plus size={16} /><span>Nouveau</span>
                    </button>
                    <Link href="/" className="px-5 py-2.5 border border-encre text-encre rounded-sm text-sm font-bold hover:bg-encre hover:text-creme transition-all">Voir la boutique</Link>
                </div>
            </div>

            {/* Alert Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-red-50 border border-red-200 rounded-sm p-6 flex items-center space-x-4 shadow-sm">
                    <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                        <TrendingDown size={24} className="text-red-600" />
                    </div>
                    <div>
                        <p className="text-[10px] uppercase font-black tracking-widest text-red-600">Ruptures totales</p>
                        <p className="text-3xl font-bold text-red-700">{outCount}</p>
                    </div>
                </div>
                <div className="bg-yellow-50 border border-yellow-200 rounded-sm p-6 flex items-center space-x-4 shadow-sm">
                    <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                        <AlertTriangle size={24} className="text-yellow-600" />
                    </div>
                    <div>
                        <p className="text-[10px] uppercase font-black tracking-widest text-yellow-700">Stock faible</p>
                        <p className="text-3xl font-bold text-yellow-700">{lowCount}</p>
                    </div>
                </div>
                <div className="bg-white border border-creme2 rounded-sm p-6 flex items-center space-x-4 shadow-sm">
                    <div className="w-12 h-12 bg-creme rounded-full flex items-center justify-center border border-creme2">
                        <Package size={24} className="text-encre3" />
                    </div>
                    <div>
                        <p className="text-[10px] uppercase font-black tracking-widest text-encre3">Total produits</p>
                        <p className="text-3xl font-bold text-encre">{stockItems.length}</p>
                    </div>
                </div>
            </div>

            {/* Filter Tabs + Table */}
            <div className="bg-white rounded-sm border border-creme2 shadow-lg overflow-hidden">
                <div className="p-6 border-b border-creme2 bg-creme/10 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center bg-white p-1 rounded-sm border border-creme2">
                        {[
                            { key: 'all', label: 'Tous' },
                            { key: 'ok', label: 'En stock' },
                            { key: 'low', label: 'Faible' },
                            { key: 'out', label: 'Rupture' },
                        ].map(tab => (
                            <button key={tab.key} onClick={() => setFilter(tab.key)}
                                className={cn("px-5 py-2 text-[10px] font-black uppercase tracking-widest rounded-sm transition-all",
                                    filter === tab.key ? "bg-[#1A0A0A] text-creme shadow-lg" : "text-encre3 hover:bg-creme/50"
                                )}>
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center py-16">
                        <Loader className="w-8 h-8 text-or animate-spin" />
                        <span className="ml-3 text-encre3">Chargement de l'inventaire...</span>
                    </div>
                ) : error ? (
                    <div className="text-center py-16">
                        <AlertCircle className="w-12 h-12 text-rouge mx-auto mb-4" />
                        <p className="text-rouge mb-4">{error}</p>
                        <button onClick={fetchProducts} className="px-4 py-2 bg-encre text-creme text-xs font-bold rounded-sm hover:bg-rouge-deep transition-all">
                            Réessayer
                        </button>
                    </div>
                ) : (
                    <table className="w-full">
                        <thead className="bg-creme/30 text-[10px] uppercase tracking-widest text-encre3 font-black border-b border-creme2">
                            <tr>
                                <th className="px-8 py-5 text-left">Produit</th>
                                <th className="px-8 py-5 text-left">Catégorie</th>
                                <th className="px-8 py-5 text-left">Référence</th>
                                <th className="px-8 py-5 text-center">Stock actuel</th>
                                <th className="px-8 py-5 text-center">Seuil alerte</th>
                                <th className="px-8 py-5 text-center">Statut</th>
                                <th className="px-8 py-5 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-creme2">
                            {filtered.map((item) => (
                                <tr key={item.id} className="hover:bg-creme/5 transition-colors group">
                                    <td className="px-8 py-5">
                                        <span className="text-sm font-bold text-encre group-hover:text-rouge-deep transition-colors">{item.name}</span>
                                    </td>
                                    <td className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-or">{item.category}</td>
                                    <td className="px-8 py-5 text-xs font-mono text-encre3">{item.ref}</td>
                                    <td className="px-8 py-5 text-center">
                                        <span className={cn("text-lg font-black", item.status === 'out' ? "text-red-600" : item.status === 'low' ? "text-yellow-700" : "text-encre")}>
                                            {item.stock}
                                        </span>
                                    </td>
                                    <td className="px-8 py-5 text-center text-sm font-bold text-encre3">{item.threshold}</td>
                                    <td className="px-8 py-5 text-center">
                                        <span className={cn("text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-sm shadow-sm", statusConfig[item.status].color)}>
                                            {statusConfig[item.status].label}
                                        </span>
                                    </td>
                                    <td className="px-8 py-5 text-right">
                                        {item.status !== 'ok' ? (
                                            <button className="px-4 py-1.5 bg-[#1A0A0A] text-creme text-[10px] font-black uppercase tracking-widest rounded-sm hover:bg-rouge-deep transition-all">
                                                Commander
                                            </button>
                                        ) : (
                                            <button className="px-4 py-1.5 bg-white border border-creme2 text-encre text-[10px] font-black uppercase tracking-widest rounded-sm hover:border-or hover:text-or transition-all">
                                                Ajuster
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            {filtered.length === 0 && (
                                <tr>
                                    <td colSpan={7} className="py-16 text-center text-encre3">
                                        Aucun produit trouvé pour ce filtre.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
