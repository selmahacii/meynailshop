'use client';

import { useState } from 'react';
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
    ExternalLink
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

const tabs = [
    { name: 'Toutes', count: 142, key: 'all' },
    { name: 'En attente', count: 8, key: 'pending' },
    { name: 'Expédiées', count: 31, key: 'shipped' },
    { name: 'Livrées', count: 97, key: 'delivered' },
    { name: 'Annulées', count: 6, key: 'cancelled' },
];

const mockOrders = [
    { id: '#4521', client: 'Sarah Benali', location: 'Alger Centre', date: '28 Fév 2026', amount: '2 400 DA', status: 'Expédié', statusColor: 'bg-blue-100 text-blue-600', actions: ['Facture', 'Éditer'] },
    { id: '#4520', client: 'Amina Khelifi', location: 'Oran', date: '28 Fév 2026', amount: '850 DA', status: 'En attente', statusColor: 'bg-yellow-100 text-yellow-700', actions: ['Confirmer'] },
    { id: '#4519', client: 'Yasmine Mansouri', location: 'Constantine', date: '27 Fév 2026', amount: '4 200 DA', status: 'Livré', statusColor: 'bg-green-100 text-green-700', actions: ['Facture'] },
    { id: '#4518', client: 'Fatima Ziri', location: 'Blida', date: '26 Fév 2026', amount: '1 600 DA', status: 'Annulé', statusColor: 'bg-red-100 text-red-600', actions: ['Rembourser'] },
];

export default function AdminOrdersPage() {
    const [activeTab, setActiveTab] = useState('all');

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
                                onClick={() => setActiveTab(tab.key)}
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
                            {mockOrders.map((order) => (
                                <tr key={order.id} className="hover:bg-creme/5 transition-colors group">
                                    <td className="px-8 py-6">
                                        <span className="text-sm font-bold text-rouge-mid font-mono tracking-tighter">{order.id}</span>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex flex-col">
                                            <span className="text-sm font-bold text-encre">{order.client}</span>
                                            <span className="text-[10px] text-encre3 uppercase tracking-wide font-medium">{order.location}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-[11px] font-bold text-encre3 uppercase">
                                        {order.date}
                                    </td>
                                    <td className="px-8 py-6 text-sm font-black text-encre">
                                        {order.amount}
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className={cn(
                                            "text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-sm shadow-sm inline-block",
                                            order.statusColor
                                        )}>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6 flex items-center justify-end space-x-2">
                                        {order.actions.map((action, i) => (
                                            <button
                                                key={i}
                                                className={cn(
                                                    "px-3 py-1.5 rounded-sm text-[10px] font-black uppercase tracking-widest transition-all border",
                                                    action === 'Confirmer' ? "bg-green-700 text-white border-green-800 hover:bg-green-800" :
                                                        action === 'Éditer' ? "bg-[#1A0A0A] text-white border-[#2A1A1A] hover:bg-rouge-deep" :
                                                            "bg-white border-creme2 text-encre hover:border-or hover:text-or"
                                                )}
                                            >
                                                {action}
                                            </button>
                                        ))}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Placeholder */}
                <div className="p-8 border-t border-creme2 bg-creme/5 flex justify-between items-center">
                    <p className="text-[10px] uppercase font-bold text-encre3 tracking-widest">Affichage de 4 sur 142 commandes</p>
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
