'use client';

import { Package, MapPin, Search, ChevronRight } from 'lucide-react';
import { formatPrice } from '@/lib/utils/currency';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ordersApi } from '@/lib/api/orders';

export default function ClientOrdersPage() {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let mounted = true;
        async function load() {
            setLoading(true);
            try {
                const res = await ordersApi.getMyOrders({ page: 1, limit: 20 });
                if (mounted) setOrders(res.data?.items || []);
            } catch (err) {
                console.error('Load orders error:', err);
            } finally {
                if (mounted) setLoading(false);
            }
        }
        load();
        return () => { mounted = false; };
    }, []);

    return (
        <div className="bg-white p-8 border border-creme2 shadow-sm min-h-[500px]">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 pb-4 border-b border-creme2 gap-4">
                <h2 className="font-serif text-2xl text-encre">Historique des commandes</h2>
                <div className="relative w-full sm:w-64">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-encre3" />
                    <input
                        type="text"
                        placeholder="Rechercher une commande..."
                        className="w-full pl-9 pr-4 py-2 border border-creme2 focus:outline-none focus:ring-1 focus:ring-or focus:border-or text-xs font-semibold"
                    />
                </div>
            </div>

            <div className="space-y-6">
                {(!loading && orders.length === 0) ? (
                    <div className="text-center py-12 text-encre3">
                        <Package className="mx-auto mb-4 text-encre3/30" size={48} />
                        <p>Vous n'avez pas encore passé de commande.</p>
                        <Link href="/catalogue" className="text-or hover:text-rouge-mid transition-colors font-bold uppercase tracking-widest text-xs mt-4 inline-block">
                            Visiter la boutique
                        </Link>
                    </div>
                ) : (
                    orders.map((order) => (
                        <div key={order.id} className="border border-creme2 rounded-sm overflow-hidden hover:shadow-md transition-shadow group">
                            <div className="bg-creme p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                <div>
                                    <p className="text-[10px] uppercase font-bold text-encre3 tracking-widest mb-1">Commande N°</p>
                                    <p className="font-serif text-lg text-encre">{order.id}</p>
                                </div>
                                <div className="flex gap-8">
                                    <div>
                                        <p className="text-[10px] uppercase font-bold text-encre3 tracking-widest mb-1">Passée le</p>
                                        <p className="font-semibold text-sm text-encre">{order.date}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] uppercase font-bold text-encre3 tracking-widest mb-1">Total</p>
                                        <p className="font-bold text-sm text-rouge-deep">{formatPrice(order.total)}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 flex flex-col sm:flex-row justify-between items-center gap-6">
                                <div className="flex-grow w-full">
                                    <div className="flex items-center mb-4">
                                        <div className={`w-2 h-2 rounded-full mr-2 ${order.status.toLowerCase() === 'livrée' ? 'bg-green-500' : 'bg-orange-500 animate-pulse'}`}></div>
                                        <span className="text-xs font-bold uppercase tracking-widest text-encre">{order.status}</span>
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        {(order.items || []).map((item: any, idx: number) => (
                                            <div key={idx} className="flex items-center text-sm">
                                                <span className="w-6 h-6 bg-creme2 flex justify-center items-center text-xs font-bold mr-3">{item.qty || item.quantity}x</span>
                                                <span className="text-encre3">{item.name || item.productName}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="w-full sm:w-auto flex flex-col gap-2 shrink-0">
                                    <button className="w-full sm:w-auto px-6 py-3 bg-encre hover:bg-rouge-deep transition-colors text-creme text-xs font-bold uppercase tracking-widest shadow-sm">
                                        Détails
                                    </button>
                                    {order.status.toLowerCase() === 'livrée' && (
                                        <button className="w-full sm:w-auto px-6 py-3 border border-creme2 text-encre hover:border-or hover:text-or transition-colors text-xs font-bold uppercase tracking-widest">
                                            Recommander
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
