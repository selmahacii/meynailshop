'use client';

import { useState } from 'react';
import { Search, Filter, Eye, MoreHorizontal, CheckCircle, Package, Truck, XCircle, ArrowRight } from 'lucide-react';
import { formatPrice } from '@/lib/utils/currency';

// Mock data
const mockOrders = [
    { id: 'ORD-2026-001', customer: 'Sarah N.', date: '02 Mars 2026', items: 3, total: 4500, wilaya: 'Alger (16)', status: 'processing', payment: 'cod' },
    { id: 'ORD-2026-002', customer: 'Amira B.', date: '01 Mars 2026', items: 1, total: 1800, wilaya: 'Oran (31)', status: 'shipped', payment: 'baridimob' },
    { id: 'ORD-2026-003', customer: 'Ines K.', date: '01 Mars 2026', items: 5, total: 12500, wilaya: 'Blida (09)', status: 'delivered', payment: 'baridimob' },
    { id: 'ORD-2026-004', customer: 'Lina M.', date: '28 Fév 2026', items: 2, total: 3200, wilaya: 'Constantine (25)', status: 'cancelled', payment: 'cod' },
];

const statusConfig: Record<string, { label: string, color: string, icon: any }> = {
    pending: { label: 'En attente', color: 'bg-yellow-100 text-yellow-800 border-yellow-200', icon: MoreHorizontal },
    processing: { label: 'Préparation', color: 'bg-blue-100 text-blue-800 border-blue-200', icon: Package },
    shipped: { label: 'Expédiée', color: 'bg-indigo-100 text-indigo-800 border-indigo-200', icon: Truck },
    delivered: { label: 'Livrée', color: 'bg-green-100 text-green-800 border-green-200', icon: CheckCircle },
    cancelled: { label: 'Annulée', color: 'bg-red-100 text-red-800 border-red-200', icon: XCircle },
};

const paymentConfig: Record<string, string> = {
    cod: 'À la livraison',
    baridimob: 'Baridimob',
};

export default function AdminOrdersPage() {
    const [searchTerm, setSearchTerm] = useState('');

    return (
        <div className="space-y-6 flex flex-col min-h-full">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-creme2">
                <div>
                    <h1 className="text-2xl font-serif text-encre">Commandes</h1>
                    <p className="text-encre3 text-sm mt-1">Gérez vos commandes, de la préparation à la livraison.</p>
                </div>

                {/* Toolbar */}
                <div className="flex flex-wrap items-center gap-3">
                    <div className="relative">
                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-encre3" />
                        <input
                            type="text"
                            placeholder="Rechercher ORD-..."
                            className="w-full md:w-64 pl-10 pr-4 py-2 border border-creme2 focus:outline-none focus:ring-1 focus:ring-or focus:border-or rounded-sm text-sm"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button className="flex items-center justify-center px-4 py-2 border border-creme2 bg-white text-encre hover:text-or hover:border-or text-sm font-semibold transition-all rounded-sm flex-grow sm:flex-grow-0 cursor-pointer shadow-sm">
                        <Filter size={16} className="mr-2" />
                        Filtres
                    </button>
                </div>
            </div>

            {/* Analytics Mini-Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white p-4 border border-creme2 rounded-sm shadow-sm flex flex-col items-center justify-center text-center">
                    <p className="text-[10px] uppercase font-bold text-encre3 tracking-widest mb-1">Aujourd'hui</p>
                    <p className="text-2xl font-serif text-encre">12</p>
                </div>
                <div className="bg-white p-4 border border-creme2 rounded-sm shadow-sm flex flex-col items-center justify-center text-center">
                    <p className="text-[10px] uppercase font-bold text-blue-600 tracking-widest mb-1">Préparation</p>
                    <p className="text-2xl font-serif text-blue-700">8</p>
                </div>
                <div className="bg-white p-4 border border-creme2 rounded-sm shadow-sm flex flex-col items-center justify-center text-center">
                    <p className="text-[10px] uppercase font-bold text-indigo-600 tracking-widest mb-1">Expédiées</p>
                    <p className="text-2xl font-serif text-indigo-700">23</p>
                </div>
                <div className="bg-white p-4 border border-creme2 rounded-sm shadow-sm flex flex-col items-center justify-center text-center">
                    <p className="text-[10px] uppercase font-bold text-yellow-600 tracking-widest mb-1">PAIEMENTS (Baridimob)</p>
                    <p className="text-2xl font-serif text-yellow-700">5 <span className="text-xs uppercase">à valider</span></p>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white border border-creme2 rounded-sm shadow-sm overflow-hidden flex-grow">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse whitespace-nowrap">
                        <thead>
                            <tr className="bg-creme">
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-encre border-b border-creme2">ID Commande</th>
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-encre border-b border-creme2">Client</th>
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-encre border-b border-creme2">Date</th>
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-encre border-b border-creme2">Total (Articles)</th>
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-encre border-b border-creme2">Statut</th>
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-encre border-b border-creme2 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-creme2">
                            {mockOrders.map((order) => {
                                const status = statusConfig[order.status];
                                const StatusIcon = status.icon;

                                return (
                                    <tr key={order.id} className="hover:bg-creme/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <span className="font-bold font-mono text-sm text-encre">{order.id}</span>
                                            <div className="text-[10px] uppercase tracking-widest text-encre3 mt-1">
                                                {paymentConfig[order.payment]}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="font-semibold text-sm text-encre">{order.customer}</div>
                                            <div className="text-xs text-encre3">{order.wilaya}</div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-encre3">
                                            {order.date}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="font-bold text-sm text-rouge-deep">{formatPrice(order.total)}</div>
                                            <div className="text-xs text-encre3">{order.items} article(s)</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className={`inline-flex items-center px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-full border ${status.color}`}>
                                                <StatusIcon size={12} className="mr-1.5" />
                                                {status.label}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button className="inline-flex items-center justify-center p-2 bg-creme2 hover:bg-or hover:text-white rounded-full transition-all text-encre" title="Détails">
                                                <ArrowRight size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
