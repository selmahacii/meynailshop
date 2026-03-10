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
    Loader
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { OrdersAPI } from '@/lib/api/client';

const tabs = [
    { name: 'Toutes', count: 0, key: 'all' },
    { name: 'En attente', count: 0, key: 'pending' },
    { name: 'Expédiées', count: 0, key: 'shipped' },
    { name: 'Livrées', count: 0, key: 'delivered' },
    { name: 'Annulées', count: 0, key: 'cancelled' },
];

export default function AdminOrdersPage() {
    const [activeTab, setActiveTab] = useState('all');
    const [orders, setOrders] = useState<any[]>([]);
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [updatingOrder, setUpdatingOrder] = useState<string | null>(null);

    useEffect(() => {
        fetchOrders();
        fetchStats();
    }, []);

    const fetchOrders = async (status?: string) => {
        try {
            console.log('🔄 Orders: Starting data fetch', status ? `for status: ${status}` : '');
            setLoading(true);
            const result = await OrdersAPI.getAll(1, 50, status);
            console.log('📋 Orders: API result received', result);

            if (result.success) {
                console.log('✅ Orders: Data loaded successfully', result.data);
                setOrders(result.data.data || []);
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
                tabs[0].count = result.data.total || 0;
                tabs[1].count = result.data.pending || 0;
                tabs[2].count = result.data.shipped || 0;
                tabs[3].count = result.data.delivered || 0;
                tabs[4].count = result.data.cancelled || 0;
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
                // Refresh orders and stats
                await fetchOrders(activeTab === 'all' ? undefined : activeTab);
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
            case 'shipped': return 'bg-blue-100 text-blue-600';
            case 'delivered': return 'bg-green-100 text-green-700';
            case 'cancelled': return 'bg-red-100 text-red-600';
            default: return 'bg-gray-100 text-gray-600';
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case 'pending': return 'En attente';
            case 'shipped': return 'Expédié';
            case 'delivered': return 'Livré';
            case 'cancelled': return 'Annulé';
            default: return status;
        }
    };

    const filteredOrders = activeTab === 'all' 
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
        <div className="space-y-8 pb-12">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-serif text-encre">Commandes</h1>
                    <p className="text-encre3 text-[10px] uppercase tracking-widest font-bold mt-1">Gestion des commandes client — 04 Mars 2026</p>
                </div>

                <div className="flex items-center space-x-3">
                    <div className="relative group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-encre3 group-focus-within:text-or transition-colors" size={16} />
                        <input
                            type="text"
                            placeholder="Rechercher..."
                            className="pl-10 pr-4 py-2.5 bg-white border border-creme2 rounded-sm text-sm focus:outline-none focus:border-or focus:ring-1 focus:ring-or w-64 shadow-sm transition-all"
                        />
                    </div>
                    <button className="p-2.5 bg-white border border-creme2 rounded-sm text-encre3 hover:text-or hover:border-or transition-all shadow-sm">
                        <Bell size={18} />
                    </button>
                    <button className="p-2.5 bg-white border border-creme2 rounded-sm text-encre3 hover:text-or hover:border-or transition-all shadow-sm">
                        <Download size={18} />
                    </button>
                    <button className="flex items-center space-x-2 px-5 py-2.5 bg-rouge-deep text-creme rounded-sm text-sm font-bold uppercase tracking-widest hover:bg-rouge-mid transition-all shadow-md">
                        <Plus size={16} />
                        <span>Nouveau</span>
                    </button>
                    <Link href="/" className="px-5 py-2.5 border border-encre text-encre rounded-sm text-sm font-bold hover:bg-encre hover:text-creme transition-all">
                        Voir la boutique
                    </Link>
                </div>
            </div>

            {/* Content Section */}
            <div className="bg-white rounded-sm border border-creme2 shadow-lg overflow-hidden">
                {/* Tabs & Toolbar */}
                <div className="p-6 border-b border-creme2 bg-creme/10 flex flex-wrap items-center justify-between gap-6">
                    <div className="flex items-center bg-white p-1 rounded-sm border border-creme2">
                        {tabs.map((tab) => (
                            <button
                                key={tab.key}
                                onClick={() => {
                                    setActiveTab(tab.key);
                                    fetchOrders(tab.key === 'all' ? undefined : tab.key);
                                }}
                                className={cn(
                                    "px-4 py-2 text-xs font-bold uppercase tracking-widest rounded-sm transition-all flex items-center space-x-2",
                                    activeTab === tab.key
                                        ? "bg-encre text-creme shadow-md transition-all scale-105"
                                        : "text-encre3 hover:bg-creme/50"
                                )}
                            >
                                <span>{tab.name}</span>
                                <span className={cn(
                                    "text-[10px] opacity-60",
                                    activeTab === tab.key ? "text-or" : "text-encre3"
                                )}>({tab.count})</span>
                            </button>
                        ))}
                    </div>

                    <div className="flex items-center space-x-3">
                        <button className="flex items-center space-x-2 px-6 py-2 bg-creme border border-creme2 text-encre text-xs font-bold uppercase tracking-widest rounded-sm hover:border-or transition-all">
                            <span>Rapport</span>
                        </button>
                        <button className="flex items-center space-x-2 px-6 py-2 bg-[#1A0A0A] text-creme text-xs font-bold uppercase tracking-widest rounded-sm hover:bg-rouge-deep transition-all shadow-lg group">
                            <Plus size={14} className="text-or" />
                            <span>Créer commande</span>
                        </button>
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
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
                                            <span className="text-sm font-bold text-encre">{order.user?.name || 'Client inconnu'}</span>
                                            <span className="text-[10px] text-encre3 uppercase tracking-wide font-medium">{order.address?.wilaya || 'N/A'}</span>
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
                                        {order.status === 'pending' && (
                                            <button
                                                onClick={() => updateOrderStatus(order.id, 'shipped')}
                                                disabled={updatingOrder === order.id}
                                                className="px-3 py-1.5 rounded-sm text-[10px] font-black uppercase tracking-widest transition-all border bg-green-700 text-white border-green-800 hover:bg-green-800 disabled:opacity-50"
                                            >
                                                {updatingOrder === order.id ? '...' : 'Confirmer'}
                                            </button>
                                        )}
                                        {order.status === 'shipped' && (
                                            <button
                                                onClick={() => updateOrderStatus(order.id, 'delivered')}
                                                disabled={updatingOrder === order.id}
                                                className="px-3 py-1.5 rounded-sm text-[10px] font-black uppercase tracking-widest transition-all border bg-blue-700 text-white border-blue-800 hover:bg-blue-800 disabled:opacity-50"
                                            >
                                                Livrer
                                            </button>
                                        )}
                                        <button className="px-3 py-1.5 rounded-sm text-[10px] font-black uppercase tracking-widest transition-all border bg-white border-creme2 text-encre hover:border-or hover:text-or">
                                            Facture
                                        </button>
                                        <button className="px-3 py-1.5 rounded-sm text-[10px] font-black uppercase tracking-widest transition-all border bg-[#1A0A0A] text-white border-[#2A1A1A] hover:bg-rouge-deep">
                                            Éditer
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="p-8 border-t border-creme2 bg-creme/5 flex justify-between items-center">
                    <p className="text-[10px] uppercase font-bold text-encre3 tracking-widest">
                        Affichage de {filteredOrders.length} sur {orders.length} commandes
                    </p>
                    <div className="flex space-x-2">
                        {[1, 2, 3, '...', 12].map((p, i) => (
                            <button
                                key={i}
                                className={cn(
                                    "w-8 h-8 flex items-center justify-center text-[10px] font-bold border transition-all rounded-sm",
                                    p === 1 ? "bg-encre text-creme border-encre" : "bg-white text-encre3 border-creme2 hover:border-or"
                                )}
                            >
                                {p}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
