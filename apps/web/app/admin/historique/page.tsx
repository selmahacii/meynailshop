'use client';

import { useState, useEffect } from 'react';
import { Search, Bell, Download, Loader, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { OrdersAPI, ClientsAPI, ProductsAPI } from '@/lib/api/client';

interface ActivityEvent {
    id: string;
    type: 'order' | 'stock' | 'user' | 'product';
    title: string;
    detail: string;
    date: string;
    dateRaw: Date;
    user: string;
    color: string;
}

const typeFilters = [
    { key: 'all', label: 'Tous' },
    { key: 'order', label: 'Commandes' },
    { key: 'stock', label: 'Stock' },
    { key: 'user', label: 'Clients' },
];

const statusLabels: Record<string, string> = {
    pending: 'En attente',
    processing: 'En cours',
    shipped: 'Expédiée',
    delivered: 'Livrée',
    cancelled: 'Annulée',
};

export default function AdminHistoryPage() {
    const [filter, setFilter] = useState('all');
    const [events, setEvents] = useState<ActivityEvent[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchActivityLog();
    }, []);

    const fetchActivityLog = async () => {
        try {
            setLoading(true);
            setError(null);
            const allEvents: ActivityEvent[] = [];

            // 1. Fetch recent orders
            const ordersResult = await OrdersAPI.getAll(1, 20);
            if (ordersResult.success) {
                const orders = ordersResult.data?.data || ordersResult.data?.items || [];
                orders.forEach((order: any) => {
                    const date = new Date(order.createdAt);
                    const userName = order.user
                        ? `${order.user.firstName || ''} ${order.user.lastName || ''}`.trim()
                        : 'Client';
                    allEvents.push({
                        id: `order-${order.id}`,
                        type: 'order',
                        title: `Commande #${order.id.slice(-4)} — ${statusLabels[order.status] || order.status}`,
                        detail: `${userName} — ${Number(order.total).toLocaleString()} DA`,
                        date: date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' }) + ' ' +
                            date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
                        dateRaw: date,
                        user: 'Système',
                        color: order.status === 'delivered' ? 'bg-green-500' :
                            order.status === 'cancelled' ? 'bg-red-500' :
                                order.status === 'shipped' ? 'bg-blue-500' : 'bg-yellow-500',
                    });
                });
            }

            // 2. Fetch recent clients
            const clientsResult = await ClientsAPI.getAll(1, 20);
            if (clientsResult.success) {
                const clients = clientsResult.data?.items || clientsResult.data || [];
                clients.forEach((client: any) => {
                    const date = new Date(client.createdAt);
                    allEvents.push({
                        id: `user-${client.id}`,
                        type: 'user',
                        title: 'Nouveau client inscrit',
                        detail: `${client.firstName} ${client.lastName} — ${client.email}`,
                        date: date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' }) + ' ' +
                            date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
                        dateRaw: date,
                        user: 'Système',
                        color: 'bg-purple-500',
                    });
                });
            }

            // 3. Fetch low stock alerts
            const stockResult = await ProductsAPI.getLowStock(10);
            if (stockResult.success) {
                const lowStockItems = stockResult.data?.items || stockResult.data || [];
                lowStockItems.forEach((product: any) => {
                    const date = new Date(product.updatedAt || product.createdAt);
                    allEvents.push({
                        id: `stock-${product.id}`,
                        type: 'stock',
                        title: product.stock === 0 ? 'Rupture de stock' : 'Alerte stock faible',
                        detail: `${product.name} — ${product.stock} unité(s) restante(s)`,
                        date: date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' }) + ' ' +
                            date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
                        dateRaw: date,
                        user: 'Système',
                        color: product.stock === 0 ? 'bg-red-500' : 'bg-yellow-500',
                    });
                });
            }

            // Sort by date descending
            allEvents.sort((a, b) => b.dateRaw.getTime() - a.dateRaw.getTime());
            setEvents(allEvents);
        } catch (err) {
            console.error('Activity log error:', err);
            setError('Impossible de charger le journal d\'activité');
        } finally {
            setLoading(false);
        }
    };

    const filtered = events.filter(e => filter === 'all' || e.type === filter);

    return (
        <div className="space-y-8 pb-12">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-serif text-encre">Historique</h1>
                    <p className="text-encre3 text-[10px] uppercase tracking-widest font-bold mt-1">
                        Journal d'activité — {new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })}
                    </p>
                </div>
                <div className="flex items-center space-x-3">
                    <div className="relative group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-encre3 group-focus-within:text-or transition-colors" size={16} />
                        <input type="text" placeholder="Rechercher..." className="pl-10 pr-4 py-2.5 bg-white border border-creme2 rounded-sm text-sm focus:outline-none focus:border-or focus:ring-1 focus:ring-or w-64 shadow-sm" />
                    </div>
                    <button className="p-2.5 bg-white border border-creme2 rounded-sm text-encre3 hover:text-or hover:border-or transition-all shadow-sm"><Bell size={18} /></button>
                    <button className="p-2.5 bg-white border border-creme2 rounded-sm text-encre3 hover:text-or hover:border-or transition-all shadow-sm"><Download size={18} /></button>
                    <Link href="/" className="px-5 py-2.5 border border-encre text-encre rounded-sm text-sm font-bold hover:bg-encre hover:text-creme transition-all">Voir la boutique</Link>
                </div>
            </div>

            {/* Filter Bar */}
            <div className="flex items-center bg-white p-1 rounded-sm border border-creme2 w-fit">
                {typeFilters.map(tab => (
                    <button key={tab.key} onClick={() => setFilter(tab.key)}
                        className={cn("px-5 py-2 text-[10px] font-black uppercase tracking-widest rounded-sm transition-all",
                            filter === tab.key ? "bg-[#1A0A0A] text-creme shadow-lg" : "text-encre3 hover:bg-creme/50"
                        )}>
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Timeline */}
            <div className="bg-white rounded-sm border border-creme2 shadow-lg overflow-hidden">
                {loading ? (
                    <div className="flex items-center justify-center py-16">
                        <Loader className="w-8 h-8 text-or animate-spin" />
                        <span className="ml-3 text-encre3">Chargement du journal...</span>
                    </div>
                ) : error ? (
                    <div className="text-center py-16">
                        <AlertCircle className="w-12 h-12 text-rouge mx-auto mb-4" />
                        <p className="text-rouge mb-4">{error}</p>
                        <button onClick={fetchActivityLog} className="px-4 py-2 bg-encre text-creme text-xs font-bold rounded-sm hover:bg-rouge-deep transition-all">
                            Réessayer
                        </button>
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="p-16 text-center text-encre3">Aucun événement trouvé.</div>
                ) : (
                    <div className="relative">
                        {/* Vertical Line */}
                        <div className="absolute left-[5.5rem] top-0 bottom-0 w-px bg-creme2" />

                        <div className="divide-y divide-creme2">
                            {filtered.map((event) => (
                                <div key={event.id} className="flex items-start px-8 py-6 hover:bg-creme/5 transition-colors group">
                                    {/* Date Column */}
                                    <div className="w-24 shrink-0 text-right pr-6">
                                        <p className="text-[9px] font-black text-encre3 uppercase tracking-wide leading-tight">{event.date.split(' ').slice(0, 3).join(' ')}</p>
                                        <p className="text-[10px] font-black text-or">{event.date.split(' ')[3]}</p>
                                    </div>

                                    {/* Dot */}
                                    <div className="relative z-10 shrink-0 mx-4 mt-1">
                                        <div className={cn("w-3 h-3 rounded-full shadow-md border-2 border-white", event.color)} />
                                    </div>

                                    {/* Content */}
                                    <div className="flex-grow pl-2">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <p className="text-sm font-bold text-encre group-hover:text-rouge-deep transition-colors">{event.title}</p>
                                                <p className="text-xs text-encre3 mt-1">{event.detail}</p>
                                            </div>
                                            <span className="text-[9px] font-black uppercase tracking-widest bg-creme border border-creme2 px-2 py-1 rounded-sm text-encre3 ml-4 shrink-0">
                                                {event.user}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
