'use client';

import { useState, useEffect, useRef } from 'react';
import { Bell, Package, ShoppingBag, AlertCircle, ChevronRight, Loader2, Link as LinkIcon, Calendar, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { apiGet, API_ENDPOINTS } from '@/lib/api/client';
import { formatPrice } from '@/lib/utils/currency';

interface NotificationItem {
    id: string;
    type: 'stock' | 'order';
    title: string;
    description: string;
    time: string;
    link: string;
    priority: 'low' | 'medium' | 'high';
}

export default function AdminNotifications() {
    const [isOpen, setIsOpen] = useState(false);
    const [notifications, setNotifications] = useState<NotificationItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState<'all' | 'stock' | 'order'>('all');
    const containerRef = useRef<HTMLDivElement>(null);

    // Fetch alerts for stock and pending orders
    const fetchAlerts = async () => {
        setLoading(true);
        try {
            const [stockRes, orderRes] = await Promise.all([
                apiGet(API_ENDPOINTS.PRODUCTS_LOW_STOCK),
                apiGet(`${API_ENDPOINTS.ORDERS_ADMIN_LIST}?status=pending&limit=5`)
            ]);

            const newNotifications: NotificationItem[] = [];

            // Process Stock Alerts
            if (stockRes.success && stockRes.data?.items) {
                stockRes.data.items.slice(0, 5).forEach((p: any) => {
                    newNotifications.push({
                        id: `stock-${p.id}`,
                        type: 'stock',
                        title: 'Stock Faible',
                        description: `${p.name} : seulement ${p.stock} restant(s)`,
                        time: 'Maintenant',
                        link: `/admin/produits/${p.productId || p.id}${p.isVariant ? `?variant=${p.sku}` : '?highlight=stock'}`,
                        priority: p.stock === 0 ? 'high' : 'medium'
                    });
                });
            }

            // Process Pending Orders
            if (orderRes.success && orderRes.data?.items) {
                orderRes.data.items.slice(0, 5).forEach((o: any) => {
                    newNotifications.push({
                        id: `order-${o.id}`,
                        type: 'order',
                        title: 'Nouvelle Commande',
                        description: `Commande #${o.orderNumber} de ${o.user?.firstName || 'Client'} (${formatPrice(o.total)})`,
                        time: new Date(o.createdAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
                        link: `/admin/commandes/${o.id}`,
                        priority: 'medium'
                    });
                });
            }

            setNotifications(newNotifications);
        } catch (error) {
            console.error('Failed to fetch notifications:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAlerts();
        // Poll every 2 minutes
        const interval = setInterval(fetchAlerts, 120000);

        // Click outside to close
        const handleClickOutside = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            clearInterval(interval);
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const filtered = notifications.filter(n => activeTab === 'all' || n.type === activeTab);
    const unreadCount = notifications.length;

    return (
        <div className="relative" ref={containerRef}>
            {/* Bell Trigger */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    "relative p-2.5 rounded-full transition-all duration-300",
                    isOpen ? "bg-rouge-brand text-creme shadow-lg" : "text-encre2 hover:bg-creme/60"
                )}
            >
                <Bell size={20} className={cn(unreadCount > 0 && !isOpen && "animate-tada")} />
                {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-5 h-5 bg-rouge-brand text-creme text-[9px] font-black rounded-full flex items-center justify-center border-2 border-white shadow-xl animate-in zoom-in">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {/* Dropdown UI */}
            {isOpen && (
                <div className="absolute right-0 mt-3 w-[350px] md:w-[400px] bg-white border border-creme2 rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] z-[100] overflow-hidden animate-in slide-in-from-top-4 duration-300">
                    {/* Header */}
                    <div className="px-6 py-5 bg-[#1A0A0A] text-creme flex items-center justify-between">
                        <div>
                            <h3 className="font-serif text-lg leading-none">Centre d'Alertes</h3>
                            <p className="text-[9px] uppercase tracking-widest font-black text-gold-brand/60 mt-2">Dernières activités système</p>
                        </div>
                        <button 
                            onClick={fetchAlerts}
                            className="p-2 hover:bg-white/10 rounded-full transition-colors"
                            title="Rafraîchir"
                        >
                            {loading ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle size={16} />}
                        </button>
                    </div>

                    {/* Tabs */}
                    <div className="flex border-b border-creme2 bg-creme/10">
                        {(['all', 'stock', 'order'] as const).map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={cn(
                                    "flex-1 py-3 text-[10px] font-black uppercase tracking-widest transition-all relative",
                                    activeTab === tab ? "text-encre" : "text-encre3 hover:text-encre"
                                )}
                            >
                                {tab === 'all' ? 'Toutes' : tab === 'stock' ? 'Stocks' : 'Commandes'}
                                {activeTab === tab && (
                                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-or"></span>
                                )}
                            </button>
                        ))}
                    </div>

                    {/* Content */}
                    <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
                        {filtered.length > 0 ? (
                            <div className="divide-y divide-creme/40">
                                {filtered.map((n) => (
                                    <Link 
                                        key={n.id} 
                                        href={n.link}
                                        onClick={() => {
                                            setIsOpen(false);
                                            // Optimistically remove the notification from list when clicked
                                            setNotifications(prev => prev.filter(item => item.id !== n.id));
                                        }}
                                        className="group block p-4 hover:bg-creme/30 transition-all border-l-4 border-transparent hover:border-or"
                                    >
                                        <div className="flex gap-4">
                                            <div className={cn(
                                                "w-10 h-10 rounded-lg flex items-center justify-center shrink-0 border shadow-sm transition-transform group-hover:scale-110",
                                                n.type === 'stock' ? "bg-red-50 border-red-100 text-red-600" : "bg-gold-brand/5 border-gold-brand/20 text-gold-brand"
                                            )}>
                                                {n.type === 'stock' ? <Package size={18} /> : <ShoppingBag size={18} />}
                                            </div>
                                            <div className="flex-grow">
                                                <div className="flex justify-between items-start mb-1">
                                                    <h4 className="text-xs font-bold text-encre uppercase tracking-tighter">{n.title}</h4>
                                                    <span className="text-[9px] font-medium text-encre3 opacity-60 flex items-center gap-1">
                                                        <Clock size={10} />
                                                        {n.time}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-encre3 leading-relaxed mb-2 pr-4">{n.description}</p>
                                                <div className="flex items-center text-[9px] font-black uppercase tracking-widest text-or opacity-0 group-hover:opacity-100 transition-opacity">
                                                    Agir maintenant <ChevronRight size={10} className="ml-1" />
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        ) : (
                            <div className="p-12 text-center">
                                <AlertCircle className="w-12 h-12 text-creme2 mx-auto mb-4 opacity-20" />
                                <p className="font-serif text-lg text-encre3 italic opacity-60">Aucune alerte importante pour le moment.</p>
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="p-4 bg-creme/5 text-center border-t border-creme2">
                        <Link 
                            href="/admin/commandes" 
                            onClick={() => setIsOpen(false)}
                            className="text-[10px] uppercase font-black tracking-[0.2em] text-encre hover:text-or transition-colors flex items-center justify-center gap-2"
                        >
                            <LinkIcon size={12} />
                            Voir toutes les commandes
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
}

function Clock({ size, className }: { size: number; className?: string }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
        </svg>
    );
}
