'use client';

import { useState, useEffect } from 'react';
import { Search, Bell, Download, Plus, User, TrendingUp, ShoppingBag, Star, Loader, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { ClientsAPI } from '@/lib/api/client';
import { toast } from 'sonner';

const statusConfig: Record<string, { label: string, color: string }> = {
    vip: { label: 'VIP', color: 'bg-or/20 text-or border border-or/40' },
    regular: { label: 'Régulier', color: 'bg-blue-100 text-blue-700' },
    new: { label: 'Nouveau', color: 'bg-green-100 text-green-700' },
};

function getClientStatus(client: any): 'vip' | 'regular' | 'new' {
    const createdAt = new Date(client.createdAt);
    const daysSinceCreation = (Date.now() - createdAt.getTime()) / (1000 * 60 * 60 * 24);
    const orderCount = client.orders?.length || 0;

    if (orderCount >= 5) return 'vip';
    if (daysSinceCreation < 30) return 'new';
    return 'regular';
}

function getClientLocation(client: any): string {
    if (client.addresses && client.addresses.length > 0) {
        const addr = client.addresses[0];
        return addr.wilayaName || addr.city || addr.wilaya || 'Non renseigné';
    }
    return 'Non renseigné';
}

export default function AdminClientsPage() {
    const [clients, setClients] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchClients();
    }, []);

    const fetchClients = async () => {
        try {
            setLoading(true);
            setError(null);
            const result = await ClientsAPI.getAll(1, 50);

            if (result.success && result.data) {
                const items = result.data.items || result.data || [];
                setClients(items);
            } else {
                setError(result.error || 'Erreur lors du chargement des clients');
            }
        } catch (err) {
            console.error('Clients fetch error:', err);
            setError('Impossible de charger les clients');
        } finally {
            setLoading(false);
        }
    };

    const totalClients = clients.length;
    const vipClients = clients.filter(c => getClientStatus(c) === 'vip').length;
    const newClients = clients.filter(c => getClientStatus(c) === 'new').length;

    return (
        <div className="space-y-8 pb-12">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-serif text-encre">Clients</h1>
                    <p className="text-encre3 text-[10px] uppercase tracking-widest font-bold mt-1">
                        Base de données client — {new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })}
                    </p>
                </div>
                <div className="flex items-center space-x-3">
                    <div className="relative group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-encre3 group-focus-within:text-or transition-colors" size={16} />
                        <input type="text" placeholder="Rechercher un client..." className="pl-10 pr-4 py-2.5 bg-white border border-creme2 rounded-xl text-sm focus:outline-none focus:border-or focus:ring-1 focus:ring-or w-64 shadow-sm" />
                    </div>
                    <button 
                        onClick={() => toast.info('Aucune notification pour les clients')}
                        className="p-2.5 bg-white border border-creme2 rounded-xl text-encre3 hover:text-[#BFA893] hover:border-[#BFA893] transition-all shadow-sm"
                    >
                        <Bell size={18} />
                    </button>
                    <button 
                        onClick={() => toast.success('Extraction des données client lancée')}
                        className="p-2.5 bg-white border border-creme2 rounded-xl text-encre3 hover:text-[#BFA893] hover:border-[#BFA893] transition-all shadow-sm"
                    >
                        <Download size={18} />
                    </button>
                    <Link href="/" className="px-5 py-2.5 border border-encre text-encre rounded-xl text-sm font-bold hover:bg-encre hover:text-creme transition-all">Voir la boutique</Link>
                </div>
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: 'Total clients', value: totalClients.toString(), icon: User, color: 'text-encre3', bg: 'bg-creme' },
                    { label: 'Clients VIP', value: vipClients.toString(), icon: Star, color: 'text-or', bg: 'bg-or/10' },
                    { label: 'Nouveaux (30j)', value: newClients.toString(), icon: TrendingUp, color: 'text-green-600', bg: 'bg-green-50' },
                ].map((stat, i) => (
                    <div key={i} className="bg-white rounded-xl border border-creme2 p-6 flex items-center space-x-4 shadow-sm hover:border-or transition-all">
                        <div className={cn("w-12 h-12 rounded-full flex items-center justify-center", stat.bg)}>
                            <stat.icon size={22} className={stat.color} />
                        </div>
                        <div>
                            <p className="text-[10px] uppercase font-black tracking-widest text-encre3">{stat.label}</p>
                            <p className="text-2xl font-bold text-encre mt-1">{stat.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Clients Table */}
            <div className="bg-white rounded-xl border border-creme2 shadow-lg overflow-hidden">
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
                        <button onClick={fetchClients} className="mt-4 px-4 py-2 bg-encre text-creme text-xs font-bold rounded-xl hover:bg-rouge-deep transition-all">
                            Réessayer
                        </button>
                    </div>
                ) : clients.length === 0 ? (
                    <div className="text-center py-16 text-encre3">
                        <User className="w-16 h-16 mx-auto mb-4 opacity-30" />
                        <p className="font-serif text-lg">Aucun client enregistré</p>
                    </div>
                ) : (
                    <table className="w-full">
                        <thead className="bg-creme/30 text-[10px] uppercase tracking-widest text-encre3 font-black border-b border-creme2">
                            <tr>
                                <th className="px-8 py-5 text-left">Client</th>
                                <th className="px-8 py-5 text-left">Localité</th>
                                <th className="px-8 py-5 text-center">Téléphone</th>
                                <th className="px-8 py-5 text-left">Inscrit le</th>
                                <th className="px-8 py-5 text-center">Statut</th>
                                <th className="px-8 py-5 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-creme2">
                            {clients.map((client) => {
                                const status = getClientStatus(client);
                                const location = getClientLocation(client);
                                return (
                                    <tr key={client.id} className="hover:bg-creme/5 transition-colors group">
                                        <td className="px-8 py-5">
                                            <div className="flex items-center space-x-3">
                                                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-rouge-deep to-rouge-mid flex items-center justify-center text-creme text-sm font-bold shadow-md">
                                                    {(client.firstName || '?').charAt(0)}{(client.lastName || '?').charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-encre group-hover:text-rouge-deep transition-colors">
                                                        {client.firstName} {client.lastName}
                                                    </p>
                                                    <p className="text-[10px] text-encre3 font-medium">{client.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5 text-sm font-medium text-encre3">{location}</td>
                                        <td className="px-8 py-5 text-center text-sm text-encre3">{client.phone || '—'}</td>
                                        <td className="px-8 py-5 text-[10px] font-bold uppercase tracking-wide text-encre3">
                                            {new Date(client.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}
                                        </td>
                                        <td className="px-8 py-5 text-center">
                                            <span className={cn("text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-xl shadow-sm", statusConfig[status]?.color || 'bg-gray-100 text-gray-600')}>
                                                {statusConfig[status]?.label || status}
                                            </span>
                                        </td>
                                        <td className="px-8 py-5 text-right">
                                            <Link 
                                                href={`/admin/clients/${client.id}`}
                                                className="inline-block px-4 py-1.5 bg-[#390102] text-[#BFA893] text-[10px] font-black uppercase tracking-widest rounded-xl hover:opacity-90 transition-all border border-[#BFA893]/20 shadow-md"
                                            >
                                                Voir Profil
                                            </Link>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
