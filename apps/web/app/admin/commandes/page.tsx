'use client';

import { useState, useEffect } from 'react';
import {
    Search,
    Bell,
    Download,
    Plus,
    FileText,
    Edit2,
    CheckCircle2,
    RotateCcw,
    ChevronDown,
    ExternalLink,
    Loader,
    Home,
    Briefcase,
    Package,
    Printer
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { OrdersAPI } from '@/lib/api/client';
import CreateOrderModal from '@/components/admin/orders/CreateOrderModal';

const tabs = [
    { name: 'Actives', count: 0, key: 'active' },
    { name: 'En attente', count: 0, key: 'pending' },
    { name: 'Expédiées', count: 0, key: 'shipped' },
    { name: 'Historique', count: 0, key: 'history' },
];

export default function AdminOrdersPage() {
    const [activeTab, setActiveTab] = useState('active');
    const [orders, setOrders] = useState<any[]>([]);
    const [stats, setStats] = useState<any>(null);
    const [pagination, setPagination] = useState<any>({ total: 0, page: 1, limit: 10, pages: 1 });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [updatingOrder, setUpdatingOrder] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        fetchOrders('active');
        fetchStats();
    }, []);

    const fetchOrders = async (status?: string, page: number = 1) => {
        try {
            console.log('🔄 Orders: Starting data fetch', status ? `for status: ${status}` : '', `page: ${page}`);
            setLoading(true);
            const result = await OrdersAPI.getAll(page, 50, status);
            console.log('📋 Orders: API result received', result);

            if (result.success) {
                console.log('✅ Orders: Data loaded successfully', result.data);
                setOrders(result.data.data || []);
                setPagination(result.data.pagination || { total: 0, page: 1, limit: 10, pages: 1 });
            } else {
                console.error('❌ Orders: API returned error', result.error);
                setError(result.error || 'Erreur lors du chargement des commandes');
            }
        } catch (err) {
            console.error('💥 Orders: Network error', err);
            setError('Impossible de charger les commandes');
        } finally {
            setLoading(false);
        }
    };

    const fetchStats = async () => {
        try {
            console.log('🔄 Orders Stats: Starting stats fetch');
            const result = await OrdersAPI.getStats();
            console.log('📊 Orders Stats: API result received', result);

            if (result.success) {
                console.log('✅ Orders Stats: Stats loaded successfully', result.data);
                setStats(result.data);
                // Update tab counts
                tabs[0].count = result.data.active || 0;
                tabs[1].count = result.data.pending || 0;
                tabs[2].count = result.data.shipped || 0;
                tabs[3].count = result.data.history || 0;
            } else {
                console.error('❌ Orders Stats: API returned error', result.error);
            }
        } catch (err) {
            console.error('💥 Orders Stats: Network error', err);
        }
    };

    const updateOrderStatus = async (orderId: string, newStatus: string) => {
        try {
            setUpdatingOrder(orderId);
            const result = await OrdersAPI.updateStatus(orderId, newStatus);
            if (result.success) {
                // Refresh orders on the same page and stats
                await fetchOrders(activeTab === 'active' ? 'active' : activeTab, pagination.page);
                await fetchStats();
            } else {
                setError(result.error || 'Erreur lors de la mise à jour');
            }
        } catch (err) {
            setError('Impossible de mettre à jour la commande');
            console.error('Update error:', err);
        } finally {
            setUpdatingOrder(null);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending': return 'bg-yellow-100 text-yellow-700';
            case 'confirmed': return 'bg-indigo-100 text-indigo-700';
            case 'processing': return 'bg-purple-100 text-purple-700';
            case 'shipped': return 'bg-blue-100 text-blue-600';
            case 'delivered': return 'bg-green-100 text-green-700';
            case 'returned': return 'bg-rouge-deep/10 text-rouge-mid';
            case 'cancelled': return 'bg-red-100 text-red-600';
            case 'refunded': return 'bg-orange-100 text-orange-700';
            default: return 'bg-gray-100 text-gray-600';
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case 'pending': return 'En attente';
            case 'confirmed': return 'Confirmée';
            case 'processing': return 'Préparation';
            case 'shipped': return 'Expédiée';
            case 'delivered': return 'Livrée';
            case 'returned': return 'Retournée';
            case 'cancelled': return 'Annulée';
            case 'refunded': return 'Remboursée';
            default: return status;
        }
    };

    const filteredOrders = activeTab === 'all' || activeTab === 'active' || activeTab === 'history'
        ? orders 
        : orders.filter(order => order.status === activeTab);

    if (loading && orders.length === 0) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-center">
                    <Loader className="w-12 h-12 text-or animate-spin mx-auto mb-4" />
                    <p className="text-lg text-encre/60">Chargement des commandes...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 md:space-y-8 p-4 md:p-8 pb-12">
            {/* Header Section */}
            <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-serif text-encre">Commandes</h1>
                    <p className="text-encre3 text-[9px] md:text-[10px] uppercase tracking-widest font-bold mt-1">Gestion des commandes client — {new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
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
                        <button className="p-2 bg-white border border-creme2 rounded-sm text-encre3 hover:text-or hover:border-or transition-all shadow-sm">
                            <Bell size={18} />
                        </button>
                    </div>
                    <button 
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center justify-center space-x-2 px-4 py-2 bg-rouge-deep text-creme rounded-sm text-xs font-bold uppercase tracking-widest hover:bg-rouge-mid transition-all shadow-md flex-grow sm:flex-grow-0"
                    >
                        <Plus size={16} />
                        <span>Nouveau</span>
                    </button>
                    <Link href="/" className="px-4 py-2 border border-encre text-encre rounded-sm text-xs font-bold hover:bg-encre hover:text-creme transition-all text-center flex-grow sm:flex-grow-0">
                        Boutique
                    </Link>
                </div>
            </div>

            {/* Error Message */}
            {error && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 flex justify-between items-center rounded-sm animate-in fade-in slide-in-from-top-4 duration-300">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <span className="text-red-500 text-lg">⚠️</span>
                        </div>
                        <div className="ml-3">
                            <p className="text-xs md:text-sm text-red-700 font-bold uppercase tracking-wider">{error}</p>
                        </div>
                    </div>
                    <button onClick={() => setError(null)} className="text-red-400 hover:text-red-600 transition-colors">
                        <Plus className="rotate-45" size={20} />
                    </button>
                </div>
            )}

            {/* Content Section */}
            <div className="bg-white rounded-sm border border-creme2 shadow-lg overflow-hidden">
                {/* Tabs & Toolbar */}
                <div className="p-4 md:p-6 border-b border-creme2 bg-creme/10 flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center bg-white p-1 rounded-sm border border-creme2 overflow-x-auto w-full md:w-auto custom-scrollbar no-scrollbar">
                        {tabs.map((tab) => (
                            <button
                                key={tab.key}
                                onClick={() => {
                                    setActiveTab(tab.key);
                                    fetchOrders(tab.key);
                                }}
                                className={cn(
                                    "px-4 md:px-5 py-2.5 text-[10px] md:text-xs font-bold uppercase tracking-widest rounded-sm transition-all flex items-center space-x-2 whitespace-nowrap",
                                    activeTab === tab.key
                                        ? "bg-encre text-creme shadow-md transition-all scale-[1.02]"
                                        : "text-encre3 hover:bg-creme/5 group"
                                )}
                            >
                                <span>{tab.name}</span>
                                <span className={cn(
                                    "text-[9px] md:text-[10px] opacity-60",
                                    activeTab === tab.key ? "text-or" : "text-encre3 group-hover:text-or"
                                )}>({tab.count})</span>
                            </button>
                        ))}
                    </div>

                    <div className="flex items-center space-x-2 w-full md:w-auto">

                        <button 
                            onClick={() => setIsModalOpen(true)}
                            className="flex-1 md:flex-none flex items-center justify-center space-x-2 px-6 py-2.5 bg-[#1A0A0A] text-creme text-[10px] font-bold uppercase tracking-widest rounded-sm hover:bg-rouge-deep transition-all shadow-lg group"
                        >
                            <Plus size={14} className="text-or" />
                            <span>Créer</span>
                        </button>
                    </div>
                </div>

                {/* Desktop Table */}
                <div className="hidden md:block overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-creme/30 text-[10px] uppercase tracking-widest text-encre3 font-black border-b border-creme2">
                            <tr>
                                <th className="px-8 py-6 text-left w-20">#</th>
                                <th className="px-8 py-6 text-left">Client</th>
                                <th className="px-8 py-6 text-left">Date</th>
                                <th className="px-8 py-6 text-left">Montant</th>
                                <th className="px-8 py-6 text-left">Statut</th>
                                <th className="px-8 py-6 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-creme2">
                            {filteredOrders.map((order) => (
                                <tr key={order.id} className="hover:bg-creme/5 transition-colors group">
                                    <td className="px-8 py-6">
                                        <span className="text-sm font-bold text-rouge-mid font-mono tracking-tighter">#{order.id.slice(-4)}</span>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex flex-col">
                                            <span className="text-sm font-bold text-encre">
                                                {order.user 
                                                    ? `${order.user.firstName} ${order.user.lastName}` 
                                                    : (order.shippingAddressSnapshot?.firstName 
                                                        ? `${order.shippingAddressSnapshot.firstName} ${order.shippingAddressSnapshot.lastName}` 
                                                        : 'Client anonyme')}
                                                {!order.user && <span className="ml-2 text-[8px] bg-creme2 text-encre3 px-1 rounded tracking-tighter">INVITÉ</span>}
                                            </span>
                                            <div className="flex items-center space-x-2 mt-1">
                                                <span className="text-[10px] text-encre3 uppercase tracking-wide font-medium">
                                                    {order.shippingAddressSnapshot?.wilayaName || order.shippingAddressSnapshot?.wilaya || 'Algérie'}
                                                </span>
                                                <span className="text-[10px] text-encre3">•</span>
                                                <span className={cn(
                                                    "text-[9px] font-black uppercase tracking-widest flex items-center gap-1",
                                                    order.deliveryType === 'home' ? "text-blue-600" : "text-orange-600"
                                                )}>
                                                    {order.deliveryType === 'office' ? <Briefcase size={10} /> : <Home size={10} />}
                                                    {order.deliveryType === 'office' ? 'Bureau' : 'Domicile'}
                                                </span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-[11px] font-bold text-encre3 uppercase">
                                        {new Date(order.createdAt).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })}
                                    </td>
                                    <td className="px-8 py-6 text-sm font-black text-encre">
                                        {Number(order.total).toLocaleString('fr-FR')} DA
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className={cn(
                                            "text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-sm shadow-sm inline-block",
                                            getStatusColor(order.status)
                                        )}>
                                            {getStatusText(order.status)}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6 flex items-center justify-end space-x-2">
                                        {/* Dynamic Status Actions */}
                                        {order.status === 'pending' && (
                                            <button
                                                onClick={() => updateOrderStatus(order.id, 'confirmed')}
                                                disabled={updatingOrder === order.id}
                                                className="px-3 py-1.5 rounded-sm text-[10px] font-black uppercase tracking-widest transition-all border bg-indigo-700 text-white border-indigo-800 hover:bg-indigo-800 disabled:opacity-50"
                                            >
                                                {updatingOrder === order.id ? '...' : 'Confirmer'}
                                            </button>
                                        )}
                                        {(order.status === 'confirmed' || order.status === 'processing') && (
                                            <button
                                                onClick={() => updateOrderStatus(order.id, 'shipped')}
                                                disabled={updatingOrder === order.id}
                                                className="px-3 py-1.5 rounded-sm text-[10px] font-black uppercase tracking-widest transition-all border bg-blue-700 text-white border-blue-800 hover:bg-blue-800 disabled:opacity-50"
                                            >
                                                {updatingOrder === order.id ? '...' : 'Expédier'}
                                            </button>
                                        )}
                                        {order.status === 'shipped' && (
                                            <>
                                                <button
                                                    onClick={() => updateOrderStatus(order.id, 'delivered')}
                                                    disabled={updatingOrder === order.id}
                                                    className="px-3 py-1.5 bg-green-700 text-white rounded-sm text-[10px] font-black uppercase tracking-widest hover:bg-green-800 transition-all flex items-center space-x-1 shadow-sm border border-green-800"
                                                >
                                                    <CheckCircle2 size={12} />
                                                    <span>{updatingOrder === order.id ? '...' : 'Livrée'}</span>
                                                </button>
                                                <button
                                                    onClick={() => updateOrderStatus(order.id, 'returned')}
                                                    disabled={updatingOrder === order.id}
                                                    className="px-3 py-1.5 bg-rouge-deep text-white rounded-sm text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all flex items-center space-x-1 shadow-sm border border-rouge-deep"
                                                >
                                                    <RotateCcw size={12} />
                                                    <span>{updatingOrder === order.id ? '...' : 'Retour'}</span>
                                                </button>
                                            </>
                                        )}
                                        {order.status === 'delivered' && (
                                            <button
                                                onClick={() => updateOrderStatus(order.id, 'returned')}
                                                disabled={updatingOrder === order.id}
                                                className="px-3 py-1.5 rounded-sm text-[10px] font-black uppercase tracking-widest transition-all border bg-rouge-deep text-white border-rouge-deep hover:bg-[#1A0A0A] disabled:opacity-50"
                                            >
                                                {updatingOrder === order.id ? '...' : 'Retour'}
                                            </button>
                                        )}

                                        {/* Utility Actions */}
                                        <button 
                                            onClick={() => window.print()}
                                            className="px-3 py-1.5 rounded-sm text-[10px] font-black uppercase tracking-widest transition-all border bg-white border-creme2 text-encre hover:border-or hover:text-or"
                                        >
                                            Facture
                                        </button>
                                        <Link 
                                            href={`/admin/commandes/${order.id}`}
                                            className="px-3 py-1.5 rounded-sm text-[10px] font-black uppercase tracking-widest transition-all border bg-[#1A0A0A] text-white border-[#2A1A1A] hover:bg-rouge-deep"
                                        >
                                            Détail
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Mobile Card View */}
                <div className="md:hidden divide-y divide-creme2">
                    {filteredOrders.length === 0 ? (
                        <div className="p-12 text-center">
                            <Package size={48} className="mx-auto text-creme2 mb-4" />
                            <p className="text-encre3 text-xs font-bold uppercase tracking-widest">Aucune commande trouvée</p>
                        </div>
                    ) : (
                        filteredOrders.map((order) => (
                            <div key={order.id} className="p-5 flex flex-col space-y-4 hover:bg-creme/5 transition-colors">
                                <div className="flex justify-between items-start">
                                    <div className="flex flex-col">
                                        <span className="text-sm font-black text-rouge-mid font-mono tracking-tighter mb-1">#{order.orderNumber || order.id.slice(-6)}</span>
                                        <span className="text-xs font-bold tracking-widest text-encre3 uppercase">
                                            {new Date(order.createdAt).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })}
                                        </span>
                                    </div>
                                    <span className={cn(
                                        "text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-sm shadow-sm",
                                        getStatusColor(order.status)
                                    )}>
                                        {getStatusText(order.status)}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="flex flex-col">
                                        <span className="text-sm font-black text-encre flex items-center">
                                            {order.user 
                                                ? `${order.user.firstName} ${order.user.lastName}` 
                                                : (order.shippingAddressSnapshot?.firstName 
                                                    ? `${order.shippingAddressSnapshot.firstName} ${order.shippingAddressSnapshot.lastName}` 
                                                    : 'Client anonyme')}
                                            {!order.user && <span className="ml-2 text-[7px] bg-creme2 text-encre3 px-1 rounded tracking-tighter">INVITÉ</span>}
                                        </span>
                                        <div className="flex items-center space-x-2 mt-0.5">
                                            <span className="text-[10px] text-encre3 uppercase tracking-wide font-medium">
                                                {order.shippingAddressSnapshot?.wilayaName || order.shippingAddressSnapshot?.wilaya || 'Algérie'}
                                            </span>
                                            <span className="text-[10px] text-encre3">•</span>
                                            <span className={cn(
                                                "text-[9px] font-black uppercase tracking-widest flex items-center gap-1",
                                                order.deliveryType === 'home' ? "text-blue-600" : "text-orange-600"
                                            )}>
                                                {order.deliveryType === 'office' ? <Briefcase size={10} /> : <Home size={10} />}
                                                {order.deliveryType === 'office' ? 'Bureau' : 'Domicile'}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-sm font-black text-or">{Number(order.total).toLocaleString('fr-FR')} DA</span>
                                    </div>
                                </div>

                                <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-creme2/50">
                                    {order.status === 'pending' && (
                                        <button
                                            onClick={() => updateOrderStatus(order.id, 'confirmed')}
                                            disabled={updatingOrder === order.id}
                                            className="flex-1 px-3 py-2 bg-indigo-700 text-white rounded-sm text-[9px] font-black uppercase tracking-widest disabled:opacity-50"
                                        >
                                            Confirmer
                                        </button>
                                    )}
                                    {(order.status === 'confirmed' || order.status === 'processing') && (
                                        <button
                                            onClick={() => updateOrderStatus(order.id, 'shipped')}
                                            disabled={updatingOrder === order.id}
                                            className="flex-1 px-3 py-2 bg-blue-700 text-white rounded-sm text-[9px] font-black uppercase tracking-widest disabled:opacity-50"
                                        >
                                            Expédier
                                        </button>
                                    )}
                                    {order.status === 'shipped' && (
                                        <button
                                            onClick={() => updateOrderStatus(order.id, 'delivered')}
                                            disabled={updatingOrder === order.id}
                                            className="flex-1 px-3 py-2 bg-green-700 text-white rounded-sm text-[9px] font-black uppercase tracking-widest disabled:opacity-50"
                                        >
                                            Livrée
                                        </button>
                                    )}
                                    <Link 
                                        href={`/admin/commandes/${order.id}`}
                                        className="flex-1 px-3 py-2 bg-[#1A0A0A] text-white rounded-sm text-[9px] font-black uppercase tracking-widest text-center"
                                    >
                                        Détail
                                    </Link>
                                    <button 
                                        onClick={() => window.print()}
                                        className="p-2 bg-white border border-creme2 text-encre rounded-sm shadow-sm"
                                    >
                                        <Printer size={14} />
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Pagination */}
                <div className="p-8 border-t border-creme2 bg-creme/5 flex justify-between items-center">
                    <p className="text-[10px] uppercase font-bold text-encre3 tracking-widest">
                        Affichage de {filteredOrders.length} sur {orders.length} commandes
                    </p>
                    <div className="flex space-x-2">
                        {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((p) => (
                            <button
                                key={p}
                                onClick={() => fetchOrders(activeTab, p)}
                                className={cn(
                                    "w-8 h-8 flex items-center justify-center text-[10px] font-bold border transition-all rounded-sm",
                                    p === pagination.page ? "bg-encre text-creme border-encre" : "bg-white text-encre3 border-creme2 hover:border-or"
                                )}
                            >
                                {p}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <CreateOrderModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={() => {
                    fetchOrders(activeTab);
                    fetchStats();
                }}
            />
        </div>
    );
}
