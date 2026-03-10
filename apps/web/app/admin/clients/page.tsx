'use client';

import { useState, useEffect } from 'react';
import { Search, Bell, Download, Plus, User, TrendingUp, ShoppingBag, Star, Loader, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { ClientsAPI } from '@/lib/api/client';
import { AdminClient, AdminStats } from '@/types/admin';

const statusConfig: Record<string, { label: string, color: string }> = {
    vip: { label: 'VIP', color: 'bg-or/20 text-or border border-or/40' },
    regular: { label: 'Régulier', color: 'bg-blue-100 text-blue-700' },
    new: { label: 'Nouveau', color: 'bg-green-100 text-green-700' },
};

export default function AdminClientsPage() {
    const [clients, setClients] = useState<AdminClient[]>([]);
    const [stats, setStats] = useState<AdminStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchClients();
        fetchStats();
    }, []);

    const fetchClients = async () => {
        try {
            console.log('🔄 Clients: Starting data fetch');
            setLoading(true);
            const result = await ClientsAPI.getAll(1, 50); // Get first page with 50 items
            console.log('👥 Clients: API result received', result);

            if (result.success && result.data) {
                console.log('✅ Clients: Data loaded successfully', result.data);
                setClients(result.data.items || []);
            } else {
                console.error('❌ Clients: API returned error', result.error);
                setError(result.error || 'Erreur lors du chargement des clients');
            }
        } catch (err) {
            console.error('💥 Clients: Network error', err);
            setError('Impossible de charger les clients');
        } finally {
            setLoading(false);
        }
    };

    const fetchStats = async () => {
        try {
            const result = await ClientsAPI.getAll(1, 1000); // Get all clients for stats

            if (result.success && result.data) {
                const allClients = result.data.items || [];
                const vipClients = allClients.filter((c: AdminClient) => c.status === 'vip').length;
                const totalRevenue = allClients.reduce((sum: number, c: AdminClient) => sum + c.totalSpent, 0);
                const averageOrders = allClients.length > 0 ? allClients.reduce((sum: number, c: AdminClient) => sum + c.ordersCount, 0) / allClients.length : 0;

                setStats({
                    totalProducts: 0, // Not relevant for clients page
                    lowStockProducts: 0,
                    totalClients: allClients.length,
                    vipClients,
                    totalRevenue,
                    averageOrdersPerClient: averageOrders
                });
            }
        } catch (err) {
            console.error('Stats error:', err);
        }
    };

    return (
        <div className="space-y-8 pb-12">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-serif text-encre">Clients</h1>
                    <p className="text-encre3 text-[10px] uppercase tracking-widest font-bold mt-1">Base de données client — 04 Mars 2026</p>
                </div>
                <div className="flex items-center space-x-3">
                    <div className="relative group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-encre3 group-focus-within:text-or transition-colors" size={16} />
                        <input type="text" placeholder="Rechercher un client..." className="pl-10 pr-4 py-2.5 bg-white border border-creme2 rounded-sm text-sm focus:outline-none focus:border-or focus:ring-1 focus:ring-or w-64 shadow-sm" />
                    </div>
                    <button className="p-2.5 bg-white border border-creme2 rounded-sm text-encre3 hover:text-or hover:border-or transition-all shadow-sm"><Bell size={18} /></button>
                    <button className="p-2.5 bg-white border border-creme2 rounded-sm text-encre3 hover:text-or hover:border-or transition-all shadow-sm"><Download size={18} /></button>
                    <button className="flex items-center space-x-2 px-5 py-2.5 bg-rouge-deep text-creme rounded-sm text-sm font-bold uppercase tracking-widest hover:bg-rouge-mid transition-all shadow-md">
                        <Plus size={16} /><span>Nouveau</span>
                    </button>
                    <Link href="/" className="px-5 py-2.5 border border-encre text-encre rounded-sm text-sm font-bold hover:bg-encre hover:text-creme transition-all">Voir la boutique</Link>
                </div>
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {stats ? [
                    { label: 'Total clients', value: stats.totalClients.toString(), icon: User, color: 'text-encre3', bg: 'bg-creme' },
                    { label: 'Clients VIP', value: stats.vipClients.toString(), icon: Star, color: 'text-or', bg: 'bg-or/10' },
                    { label: 'Revenus totaux', value: `${stats.totalRevenue.toLocaleString()} DA`, icon: TrendingUp, color: 'text-green-600', bg: 'bg-green-50' },
                    { label: 'Commandes moy.', value: `${stats.averageOrdersPerClient.toFixed(1)} / client`, icon: ShoppingBag, color: 'text-blue-600', bg: 'bg-blue-50' },
                ].map((stat, i) => (
                    <div key={i} className="bg-white rounded-sm border border-creme2 p-6 flex items-center space-x-4 shadow-sm hover:border-or transition-all">
                        <div className={cn("w-12 h-12 rounded-full flex items-center justify-center", stat.bg)}>
                            <stat.icon size={22} className={stat.color} />
                        </div>
                        <div>
                            <p className="text-[10px] uppercase font-black tracking-widest text-encre3">{stat.label}</p>
                            <p className="text-2xl font-bold text-encre mt-1">{stat.value}</p>
                        </div>
                    </div>
                )) : (
                    <div className="col-span-4 flex items-center justify-center py-8">
                        <Loader className="w-6 h-6 text-or animate-spin mr-2" />
                        <span className="text-encre3">Chargement des statistiques...</span>
                    </div>
                )}
            </div>

            {/* Clients Table */}
            <div className="bg-white rounded-sm border border-creme2 shadow-lg overflow-hidden">
                <div className="p-6 border-b border-creme2 bg-creme/10">
                    <h2 className="font-serif text-xl text-encre">Liste des clients</h2>
                </div>
                {loading ? (
                    <div className="flex items-center justify-center py-12">
                        <Loader className="w-8 h-8 text-or animate-spin" />
                        <span className="ml-2 text-encre3">Chargement des clients...</span>
                    </div>
                ) : error ? (
                    <div className="text-center py-12">
                        <AlertCircle className="w-12 h-12 text-rouge mx-auto mb-4" />
                        <p className="text-rouge">{error}</p>
                    </div>
                ) : (
                    <table className="w-full">
                        <thead className="bg-creme/30 text-[10px] uppercase tracking-widest text-encre3 font-black border-b border-creme2">
                            <tr>
                                <th className="px-8 py-5 text-left">Client</th>
                                <th className="px-8 py-5 text-left">Localité</th>
                                <th className="px-8 py-5 text-center">Commandes</th>
                                <th className="px-8 py-5 text-right">Dépenses totales</th>
                                <th className="px-8 py-5 text-left">Dernière commande</th>
                                <th className="px-8 py-5 text-center">Statut</th>
                                <th className="px-8 py-5 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-creme2">
                            {clients.map((client) => (
                                <tr key={client.id} className="hover:bg-creme/5 transition-colors group">
                                    <td className="px-8 py-5">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-rouge-deep to-rouge-mid flex items-center justify-center text-creme text-sm font-bold shadow-md">
                                                {client.firstName.charAt(0)}{client.lastName.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-encre group-hover:text-rouge-deep transition-colors">{client.firstName} {client.lastName}</p>
                                                <p className="text-[10px] text-encre3 font-medium">{client.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5 text-sm font-medium text-encre3">{client.location}</td>
                                    <td className="px-8 py-5 text-center text-lg font-black text-encre">{client.ordersCount}</td>
                                    <td className="px-8 py-5 text-right text-sm font-black text-rouge-deep">{client.totalSpent.toLocaleString()} DA</td>
                                    <td className="px-8 py-5 text-[10px] font-bold uppercase tracking-wide text-encre3">{new Date(client.lastOrderDate).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                                    <td className="px-8 py-5 text-center">
                                        <span className={cn("text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-sm shadow-sm", statusConfig[client.status].color)}>
                                            {statusConfig[client.status].label}
                                        </span>
                                    </td>
                                    <td className="px-8 py-5 text-right">
                                        <button className="px-4 py-1.5 bg-white border border-creme2 text-encre text-[10px] font-black uppercase tracking-widest rounded-sm hover:border-or hover:text-or transition-all">
                                            Profil
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
