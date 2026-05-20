'use client';

import { useState, useEffect, useMemo } from 'react';
import {
    Search, Bell, Download, Plus, AlertTriangle, TrendingDown, Package,
    Loader, AlertCircle, RefreshCw, Edit3, Check, X, ChevronUp, ChevronDown,
    ChevronLeft, ChevronRight,
    Minus, ArrowUpCircle, ArrowDownCircle, BarChart2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { ProductsAPI } from '@/lib/api/client';
import { toast } from 'sonner';

// ─── Types ────────────────────────────────────────────────────────────────────
interface StockItem {
    id: string;
    name: string;
    ref: string;
    category: string;
    stock: number;
    threshold: number;
    status: 'ok' | 'low' | 'out';
    price: number;
}

interface AdjustModal {
    open: boolean;
    item: StockItem | null;
    mode: 'set' | 'add' | 'subtract';
    value: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
const statusConfig = {
    ok:  { label: 'En stock',    color: 'bg-green-100 text-green-700 border-green-200',  dot: 'bg-green-500' },
    low: { label: 'Stock faible', color: 'bg-yellow-100 text-yellow-700 border-yellow-200', dot: 'bg-yellow-400' },
    out: { label: 'Rupture',     color: 'bg-red-100 text-red-600 border-red-200',       dot: 'bg-red-500' },
};

function getStatus(stock: number, threshold: number): 'ok' | 'low' | 'out' {
    if (stock === 0) return 'out';
    if (stock <= threshold) return 'low';
    return 'ok';
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function AdminStockPage() {
    const [filter, setFilter]         = useState('all');
    const [search, setSearch]         = useState('');
    const [products, setProducts]     = useState<any[]>([]);
    const [loading, setLoading]       = useState(true);
    const [error, setError]           = useState<string | null>(null);
    const [saving, setSaving]         = useState<string | null>(null); // id currently saving
    const [page, setPage]             = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const ITEMS_PER_PAGE = 20;
    const [modal, setModal]           = useState<AdjustModal>({ open: false, item: null, mode: 'set', value: '' });
    const [inlineEdits, setInlineEdits] = useState<Record<string, string>>({}); // id -> draft value

    useEffect(() => { fetchProducts(); }, [page, search]);

    const fetchProducts = async () => {
        try {
            setLoading(true); setError(null);
            const result = await ProductsAPI.getAll(page, ITEMS_PER_PAGE, search);
            if (result.success && result.data) {
                setProducts(result.data.items || result.data || []);
                setTotalPages(result.data.totalPages || 1);
            } else {
                setError(result.error || 'Erreur de chargement');
            }
        } catch { setError('Impossible de charger les données'); }
        finally { setLoading(false); }
    };

    // ── Derived stock items ──────────────────────────────────────────────────
    const stockItems: StockItem[] = useMemo(() => products.map((p: any) => ({
        id: p.id,
        name: p.name,
        ref: p.sku || '—',
        category: p.category?.name || p.category || '—',
        stock: p.stock ?? 0,
        threshold: p.stockAlert || p.alertThreshold || 5,
        status: getStatus(p.stock ?? 0, p.stockAlert || p.alertThreshold || 5),
        price: p.price ?? 0,
    })), [products]);

    const filtered = useMemo(() => stockItems
        .filter(i => filter === 'all' || i.status === filter)
        // Search is now handled by the API re-fetching
    , [stockItems, filter]);

    const counts = useMemo(() => ({
        ok: stockItems.filter(i => i.status === 'ok').length,
        low: stockItems.filter(i => i.status === 'low').length,
        out: stockItems.filter(i => i.status === 'out').length,
    }), [stockItems]);

    // ── Stock update ─────────────────────────────────────────────────────────
    const updateStock = async (id: string, newStock: number) => {
        if (newStock < 0) { toast.error('Le stock ne peut pas être négatif'); return; }
        setSaving(id);
        try {
            const result = await ProductsAPI.update(id, { stock: newStock });
            if (result.success) {
                setProducts(prev => prev.map(p => p.id === id ? { ...p, stock: newStock } : p));
                setInlineEdits(prev => { const n = { ...prev }; delete n[id]; return n; });
                toast.success('Stock mis à jour');
                
                // Refresh sidebar badge
                window.dispatchEvent(new Event('stockUpdated'));
            } else {
                toast.error(result.error || 'Erreur de mise à jour');
            }
        } catch { toast.error('Erreur réseau'); }
        finally { setSaving(null); }
    };

    // ── Inline edit helpers ───────────────────────────────────────────────────
    const commitInline = (item: StockItem) => {
        const val = parseInt(inlineEdits[item.id] ?? '');
        if (isNaN(val)) { cancelInline(item.id); return; }
        updateStock(item.id, val);
    };

    const cancelInline = (id: string) =>
        setInlineEdits(prev => { const n = { ...prev }; delete n[id]; return n; });

    // ── Modal helpers ─────────────────────────────────────────────────────────
    const openModal = (item: StockItem, mode: AdjustModal['mode'] = 'set') =>
        setModal({ open: true, item, mode, value: mode === 'set' ? String(item.stock) : '0' });

    const submitModal = () => {
        if (!modal.item) return;
        const val = parseInt(modal.value);
        if (isNaN(val) || val < 0) { toast.error('Valeur invalide'); return; }
        let newStock = val;
        if (modal.mode === 'add')      newStock = modal.item.stock + val;
        if (modal.mode === 'subtract') newStock = Math.max(0, modal.item.stock - val);
        updateStock(modal.item.id, newStock);
        setModal({ open: false, item: null, mode: 'set', value: '' });
    };

    // ─────────────────────────────────────────────────────────────────────────
    return (
        <div className="space-y-6 md:space-y-8 p-4 md:p-8 pb-12">

            {/* ── Header ── */}
            <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-serif text-encre">Gestion du Stock</h1>
                    <p className="text-encre3 text-[9px] md:text-[10px] uppercase tracking-widest font-bold mt-1">
                        Inventaire en temps réel — {new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })}
                    </p>
                </div>
                <div className="flex flex-wrap items-center gap-2 md:gap-3">
                    <div className="relative group flex-grow sm:flex-grow-0">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-encre3 group-focus-within:text-or transition-colors" size={15} />
                        <input
                            type="text" placeholder="Rechercher produit ou SKU..."
                            value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
                            className="pl-9 pr-4 py-2 bg-white border border-creme2 rounded-xl text-sm focus:outline-none focus:border-or focus:ring-1 focus:ring-or w-full sm:w-52 xl:w-64 shadow-sm transition-all"
                        />
                        {search && (
                            <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-encre3 hover:text-rouge">
                                <X size={14} />
                            </button>
                        )}
                    </div>
                    <div className="flex items-center gap-2">
                        <button onClick={fetchProducts} title="Rafraîchir" className="p-2 bg-white border border-creme2 rounded-xl text-encre3 hover:text-or hover:border-or transition-all shadow-sm">
                            <RefreshCw size={17} className={loading ? 'animate-spin' : ''} />
                        </button>
                        <button className="p-2 bg-white border border-creme2 rounded-xl text-encre3 hover:text-or hover:border-or transition-all shadow-sm">
                            <Download size={17} />
                        </button>
                    </div>
                    <Link href="/admin/produits/nouveau" className="flex items-center justify-center gap-2 px-4 py-2 bg-rouge-deep text-creme rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-rouge-mid transition-all shadow-md flex-grow sm:flex-grow-0">
                        <Plus size={15} /><span>Nouveau produit</span>
                    </Link>
                </div>
            </div>

            {/* ── KPI Cards ── */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                    { key: 'out',  icon: TrendingDown,  label: 'Ruptures',    val: counts.out,  bg: 'bg-red-50 border-red-200',    text: 'text-red-700',    iconBg: 'bg-red-100 text-red-600' },
                    { key: 'low',  icon: AlertTriangle, label: 'Stock faible', val: counts.low,  bg: 'bg-yellow-50 border-yellow-200', text: 'text-yellow-700', iconBg: 'bg-yellow-100 text-yellow-600' },
                    { key: 'all',  icon: Package,       label: 'Total produits', val: stockItems.length, bg: 'bg-white border-creme2', text: 'text-encre', iconBg: 'bg-creme text-encre3' },
                ].map(({ key, icon: Icon, label, val, bg, text, iconBg }) => (
                    <button key={key} onClick={() => setFilter(filter === key ? 'all' : key)}
                        className={cn('border rounded-xl p-4 md:p-6 flex items-center gap-4 shadow-sm text-left transition-all hover:shadow-md w-full',
                            bg, filter === key ? 'ring-2 ring-or' : ''
                        )}
                    >
                        <div className={cn('w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center shrink-0', iconBg)}>
                            <Icon size={20} />
                        </div>
                        <div>
                            <p className={cn('text-[9px] md:text-[10px] uppercase font-black tracking-widest', text)}>{label}</p>
                            <p className={cn('text-2xl md:text-3xl font-bold mt-0.5', text)}>{val}</p>
                        </div>
                    </button>
                ))}
            </div>

            {/* ── Table wrapper ── */}
            <div className="bg-white rounded-xl border border-creme2 shadow-lg overflow-hidden">

                {/* Tabs bar */}
                <div className="p-3 md:p-5 border-b border-creme2 bg-creme/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div className="flex items-center bg-white p-1 rounded-xl border border-creme2 overflow-x-auto w-full sm:w-auto">
                        {[
                            { key: 'all', label: 'Tous', count: stockItems.length },
                            { key: 'ok',  label: 'En stock', count: counts.ok },
                            { key: 'low', label: 'Faible',   count: counts.low },
                            { key: 'out', label: 'Rupture',  count: counts.out },
                        ].map(tab => (
                            <button key={tab.key} onClick={() => setFilter(tab.key)}
                                className={cn('px-3 md:px-4 py-2 text-[9px] md:text-[10px] font-black uppercase tracking-widest rounded-xl transition-all flex items-center gap-1.5 whitespace-nowrap',
                                    filter === tab.key ? 'bg-[#1A0A0A] text-creme shadow-md' : 'text-encre3 hover:bg-creme/50'
                                )}
                            >
                                <span>{tab.label}</span>
                                <span className={cn('opacity-60 text-[9px]', filter === tab.key && 'text-or')}>({tab.count})</span>
                            </button>
                        ))}
                    </div>
                    <p className="text-[9px] md:text-[10px] text-encre3 font-bold uppercase tracking-widest shrink-0">
                        {filtered.length} produit{filtered.length !== 1 ? 's' : ''}
                    </p>
                </div>

                {/* Content */}
                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <Loader className="w-8 h-8 text-or animate-spin" />
                        <span className="ml-3 text-encre3 text-sm">Chargement de l'inventaire...</span>
                    </div>
                ) : error ? (
                    <div className="text-center py-16 px-4">
                        <AlertCircle className="w-12 h-12 text-rouge mx-auto mb-4" />
                        <p className="text-rouge mb-4 text-sm">{error}</p>
                        <button onClick={fetchProducts} className="px-5 py-2 bg-encre text-creme text-xs font-bold rounded-xl hover:bg-rouge-deep transition-all">
                            Réessayer
                        </button>
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="text-center py-16 px-4">
                        <BarChart2 className="w-12 h-12 text-creme2 mx-auto mb-4" />
                        <p className="text-encre3 text-sm">Aucun produit trouvé pour ce filtre.</p>
                    </div>
                ) : (
                    <>
                        {/* Desktop table */}
                        <div className="hidden md:block overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-creme/30 text-[9px] uppercase tracking-widest text-encre3 font-black border-b border-creme2">
                                    <tr>
                                        <th className="px-6 py-4 text-left">Produit</th>
                                        <th className="px-6 py-4 text-left">Catégorie</th>
                                        <th className="px-6 py-4 text-left">Référence</th>
                                        <th className="px-6 py-4 text-center">Stock actuel</th>
                                        <th className="px-6 py-4 text-center">Seuil alerte</th>
                                        <th className="px-6 py-4 text-center">Statut</th>
                                        <th className="px-6 py-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-creme2">
                                    {filtered.map(item => (
                                        <tr key={item.id} className="hover:bg-creme/5 transition-colors group">
                                            <td className="px-6 py-4">
                                                <span className="text-sm font-bold text-encre group-hover:text-rouge-deep transition-colors">{item.name}</span>
                                            </td>
                                            <td className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-or">{item.category}</td>
                                            <td className="px-6 py-4 text-xs font-mono text-encre3">{item.ref}</td>

                                            {/* Inline stock edit */}
                                            <td className="px-6 py-4 text-center">
                                                {inlineEdits[item.id] !== undefined ? (
                                                    <div className="flex items-center justify-center gap-1">
                                                        <button onClick={() => setInlineEdits(p => ({ ...p, [item.id]: String(Math.max(0, parseInt(p[item.id] || '0') - 1)) }))}
                                                            className="w-6 h-6 flex items-center justify-center bg-creme border border-creme2 rounded text-encre hover:bg-rouge hover:text-creme hover:border-rouge transition-all">
                                                            <Minus size={11} />
                                                        </button>
                                                        <input
                                                            type="number" min="0"
                                                            value={inlineEdits[item.id]}
                                                            onChange={e => setInlineEdits(p => ({ ...p, [item.id]: e.target.value }))}
                                                            onKeyDown={e => { if (e.key === 'Enter') commitInline(item); if (e.key === 'Escape') cancelInline(item.id); }}
                                                            className="w-16 text-center py-1 px-1 border border-or rounded-xl text-sm font-bold outline-none focus:ring-1 focus:ring-or appearance-none"
                                                            autoFocus
                                                        />
                                                        <button onClick={() => setInlineEdits(p => ({ ...p, [item.id]: String(parseInt(p[item.id] || '0') + 1) }))}
                                                            className="w-6 h-6 flex items-center justify-center bg-creme border border-creme2 rounded text-encre hover:bg-green-600 hover:text-white hover:border-green-600 transition-all">
                                                            <Plus size={11} />
                                                        </button>
                                                        <button onClick={() => commitInline(item)} disabled={saving === item.id}
                                                            className="w-6 h-6 flex items-center justify-center bg-green-600 text-white rounded hover:bg-green-700 transition-all ml-1">
                                                            {saving === item.id ? <Loader size={10} className="animate-spin" /> : <Check size={11} />}
                                                        </button>
                                                        <button onClick={() => cancelInline(item.id)}
                                                            className="w-6 h-6 flex items-center justify-center bg-creme2 text-encre3 rounded hover:bg-rouge hover:text-creme transition-all">
                                                            <X size={11} />
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <button onClick={() => setInlineEdits(p => ({ ...p, [item.id]: String(item.stock) }))}
                                                        className={cn('text-xl font-black hover:underline hover:text-or transition-colors flex items-center justify-center gap-1 mx-auto group/val',
                                                            item.status === 'out' ? 'text-red-600' : item.status === 'low' ? 'text-yellow-700' : 'text-encre'
                                                        )}>
                                                        {item.stock}
                                                        <Edit3 size={12} className="opacity-0 group-hover/val:opacity-60 transition-opacity" />
                                                    </button>
                                                )}
                                            </td>

                                            <td className="px-6 py-4 text-center text-sm font-bold text-encre3">{item.threshold}</td>
                                            <td className="px-6 py-4 text-center">
                                                <span className={cn('inline-flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-xl border', statusConfig[item.status].color)}>
                                                    <span className={cn('w-1.5 h-1.5 rounded-full', statusConfig[item.status].dot)} />
                                                    {statusConfig[item.status].label}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-1.5">
                                                    <button onClick={() => openModal(item, 'add')} title="Ajouter du stock"
                                                        className="p-1.5 bg-green-50 border border-green-200 text-green-700 rounded-xl hover:bg-green-600 hover:text-white hover:border-green-600 transition-all">
                                                        <ArrowUpCircle size={14} />
                                                    </button>
                                                    <button onClick={() => openModal(item, 'subtract')} title="Retirer du stock"
                                                        className="p-1.5 bg-red-50 border border-red-200 text-red-600 rounded-xl hover:bg-red-600 hover:text-white hover:border-red-600 transition-all">
                                                        <ArrowDownCircle size={14} />
                                                    </button>
                                                    <button onClick={() => openModal(item, 'set')} title="Définir le stock"
                                                        className="px-3 py-1.5 bg-[#1A0A0A] text-creme text-[9px] font-black uppercase tracking-widest rounded-xl hover:bg-rouge-deep transition-all">
                                                        Définir
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Mobile cards */}
                        <div className="md:hidden divide-y divide-creme2">
                            {filtered.map(item => (
                                <div key={item.id} className="p-4 space-y-3">
                                    <div className="flex items-start justify-between gap-2">
                                        <div>
                                            <p className="font-bold text-encre text-sm leading-tight">{item.name}</p>
                                            <p className="text-[9px] uppercase font-bold text-or tracking-widest mt-0.5">{item.category}</p>
                                            <p className="text-[9px] font-mono text-encre3 mt-0.5">{item.ref}</p>
                                        </div>
                                        <span className={cn('shrink-0 inline-flex items-center gap-1 text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-xl border', statusConfig[item.status].color)}>
                                            <span className={cn('w-1.5 h-1.5 rounded-full', statusConfig[item.status].dot)} />
                                            {statusConfig[item.status].label}
                                        </span>
                                    </div>

                                    <div className="flex items-center justify-between bg-creme/30 rounded-xl p-3">
                                        <div className="text-center">
                                            <p className="text-[9px] uppercase font-black text-encre3 tracking-widest">Stock actuel</p>
                                            <p className={cn('text-2xl font-black', item.status === 'out' ? 'text-red-600' : item.status === 'low' ? 'text-yellow-700' : 'text-encre')}>
                                                {item.stock}
                                            </p>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-[9px] uppercase font-black text-encre3 tracking-widest">Seuil alerte</p>
                                            <p className="text-2xl font-black text-encre3">{item.threshold}</p>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-[9px] uppercase font-black text-encre3 tracking-widest">Prix</p>
                                            <p className="text-sm font-black text-encre">{item.price} DA</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <button onClick={() => openModal(item, 'add')}
                                            className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-green-50 border border-green-200 text-green-700 text-[10px] font-bold uppercase rounded-xl hover:bg-green-600 hover:text-white hover:border-green-600 transition-all">
                                            <ArrowUpCircle size={13} /><span>Ajouter</span>
                                        </button>
                                        <button onClick={() => openModal(item, 'subtract')}
                                            className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-red-50 border border-red-200 text-red-600 text-[10px] font-bold uppercase rounded-xl hover:bg-red-600 hover:text-white hover:border-red-600 transition-all">
                                            <ArrowDownCircle size={13} /><span>Retirer</span>
                                        </button>
                                        <button onClick={() => openModal(item, 'set')}
                                            className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-[#1A0A0A] text-creme text-[10px] font-bold uppercase rounded-xl hover:bg-rouge-deep transition-all">
                                            <Edit3 size={13} /><span>Définir</span>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Pagination UI */}
                        {totalPages > 1 && (
                            <div className="flex items-center justify-center space-x-2 p-6 border-t border-creme2 bg-creme/5">
                                <button
                                    onClick={() => setPage(p => Math.max(1, p - 1))}
                                    disabled={page === 1}
                                    className="p-2 border border-creme2 rounded-xl text-encre3 hover:text-or hover:border-or disabled:opacity-30 disabled:hover:text-encre3 disabled:hover:border-creme2 transition-all bg-white"
                                >
                                    <ChevronLeft size={18} />
                                </button>
                                
                                <div className="flex items-center space-x-1">
                                    {[...Array(totalPages)].map((_, i) => {
                                        const p = i + 1;
                                        if (p === 1 || p === totalPages || (p >= page - 1 && p <= page + 1)) {
                                            return (
                                                <button
                                                    key={p}
                                                    onClick={() => setPage(p)}
                                                    className={cn(
                                                        "w-8 h-8 flex items-center justify-center text-[10px] font-bold rounded-xl transition-all",
                                                        page === p 
                                                            ? "bg-encre text-creme shadow-md" 
                                                            : "bg-white border border-creme2 text-encre3 hover:border-or hover:text-or"
                                                    )}
                                                >
                                                    {p}
                                                </button>
                                            );
                                        } else if (p === page - 2 || p === page + 2) {
                                            return <span key={p} className="px-0.5 text-encre3 text-[10px]">...</span>;
                                        }
                                        return null;
                                    })}
                                </div>

                                <button
                                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                    disabled={page === totalPages}
                                    className="p-2 border border-creme2 rounded-xl text-encre3 hover:text-or hover:border-or disabled:opacity-30 disabled:hover:text-encre3 disabled:hover:border-creme2 transition-all bg-white"
                                >
                                    <ChevronRight size={18} />
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* ── Adjust Modal ── */}
            {modal.open && modal.item && (
                <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
                    onClick={e => { if (e.target === e.currentTarget) setModal(m => ({ ...m, open: false })); }}>
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        {/* Modal header */}
                        <div className="p-5 border-b border-creme2 bg-[#1A0A0A] flex items-center justify-between">
                            <div>
                                <h3 className="font-serif text-lg text-creme">
                                    {modal.mode === 'set' ? 'Définir le stock' : modal.mode === 'add' ? 'Ajouter du stock' : 'Retirer du stock'}
                                </h3>
                                <p className="text-[10px] text-creme/50 mt-0.5 uppercase tracking-widest font-bold truncate">{modal.item.name}</p>
                            </div>
                            <button onClick={() => setModal(m => ({ ...m, open: false }))} className="text-creme/40 hover:text-creme transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        {/* Current stock info */}
                        <div className="p-5 bg-creme/30 border-b border-creme2 flex items-center justify-around">
                            <div className="text-center">
                                <p className="text-[9px] uppercase font-black tracking-widest text-encre3">Stock actuel</p>
                                <p className={cn('text-3xl font-black mt-1', modal.item.status === 'out' ? 'text-red-600' : modal.item.status === 'low' ? 'text-yellow-600' : 'text-encre')}>
                                    {modal.item.stock}
                                </p>
                            </div>
                            <div className="w-px h-12 bg-creme2" />
                            <div className="text-center">
                                <p className="text-[9px] uppercase font-black tracking-widest text-encre3">Seuil alerte</p>
                                <p className="text-3xl font-black mt-1 text-encre3">{modal.item.threshold}</p>
                            </div>
                            <div className="w-px h-12 bg-creme2" />
                            <div className="text-center">
                                <p className="text-[9px] uppercase font-black tracking-widest text-encre3">Après</p>
                                <p className={cn('text-3xl font-black mt-1', (() => {
                                    const v = parseInt(modal.value) || 0;
                                    let ns = modal.mode === 'set' ? v : modal.mode === 'add' ? modal.item.stock + v : Math.max(0, modal.item.stock - v);
                                    return getStatus(ns, modal.item.threshold) === 'out' ? 'text-red-600' : getStatus(ns, modal.item.threshold) === 'low' ? 'text-yellow-600' : 'text-green-600';
                                })())}>
                                    {(() => {
                                        const v = parseInt(modal.value) || 0;
                                        if (modal.mode === 'set') return v;
                                        if (modal.mode === 'add') return modal.item.stock + v;
                                        return Math.max(0, modal.item.stock - v);
                                    })()}
                                </p>
                            </div>
                        </div>

                        {/* Mode selector */}
                        <div className="px-5 pt-5 pb-2">
                            <p className="text-[9px] uppercase font-black tracking-widest text-encre3 mb-3">Mode d'ajustement</p>
                            <div className="grid grid-cols-3 gap-2">
                                {([
                                    { mode: 'add'      as const, label: '+ Ajouter',   color: 'bg-green-50 border-green-300 text-green-700',   active: 'bg-green-600 border-green-600 text-white' },
                                    { mode: 'subtract' as const, label: '− Retirer',   color: 'bg-red-50 border-red-300 text-red-600',         active: 'bg-red-600 border-red-600 text-white' },
                                    { mode: 'set'      as const, label: '= Définir',   color: 'bg-white border-creme2 text-encre',             active: 'bg-[#1A0A0A] border-[#1A0A0A] text-creme' },
                                ]).map(btn => (
                                    <button key={btn.mode} onClick={() => setModal(m => ({ ...m, mode: btn.mode, value: btn.mode === 'set' ? String(m.item?.stock || 0) : '0' }))}
                                        className={cn('py-2 border rounded-xl text-[9px] font-black uppercase tracking-widest transition-all',
                                            modal.mode === btn.mode ? btn.active : btn.color
                                        )}>
                                        {btn.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Input */}
                        <div className="px-5 pb-5">
                            <label className="text-[9px] uppercase font-black tracking-widest text-encre3 block mb-2 mt-4">
                                {modal.mode === 'set' ? 'Nouvelle quantité' : modal.mode === 'add' ? 'Quantité à ajouter' : 'Quantité à retirer'}
                            </label>
                            <div className="flex items-center gap-2">
                                <button onClick={() => setModal(m => ({ ...m, value: String(Math.max(0, parseInt(m.value || '0') - 1)) }))}
                                    className="w-10 h-12 flex items-center justify-center bg-creme border border-creme2 rounded-xl text-encre hover:bg-rouge hover:text-creme hover:border-rouge transition-all text-lg font-bold shrink-0">
                                    −
                                </button>
                                <input
                                    type="number" min="0"
                                    value={modal.value}
                                    onChange={e => setModal(m => ({ ...m, value: e.target.value }))}
                                    onKeyDown={e => e.key === 'Enter' && submitModal()}
                                    className="flex-grow py-3 px-4 border-2 border-or rounded-xl text-2xl font-black text-center outline-none focus:ring-2 focus:ring-or appearance-none"
                                    autoFocus
                                />
                                <button onClick={() => setModal(m => ({ ...m, value: String(parseInt(m.value || '0') + 1) }))}
                                    className="w-10 h-12 flex items-center justify-center bg-creme border border-creme2 rounded-xl text-encre hover:bg-green-600 hover:text-white hover:border-green-600 transition-all text-lg font-bold shrink-0">
                                    +
                                </button>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-3 px-5 pb-5">
                            <button onClick={() => setModal(m => ({ ...m, open: false }))}
                                className="flex-1 py-3 border border-creme2 text-encre text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-creme transition-all">
                                Annuler
                            </button>
                            <button onClick={submitModal} disabled={saving === modal.item.id}
                                className="flex-1 py-3 bg-[#1A0A0A] text-creme text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-rouge-deep transition-all flex items-center justify-center gap-2 shadow-lg">
                                {saving === modal.item.id ? <Loader size={14} className="animate-spin" /> : null}
                                <span>Confirmer</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
