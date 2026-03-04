'use client';

import { useState } from 'react';
import { Search, Bell, Download, Plus, User, TrendingUp, ShoppingBag, Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

const clients = [
    { id: '1', name: 'Sarah Benali', email: 'sarah.b@gmail.com', location: 'Alger', orders: 12, spent: '24 000 DA', lastOrder: '28 Fév 2026', status: 'vip', rating: 5 },
    { id: '2', name: 'Amina Khelifi', email: 'amina.k@email.dz', location: 'Oran', orders: 5, spent: '8 500 DA', lastOrder: '28 Fév 2026', status: 'regular', rating: 4 },
    { id: '3', name: 'Yasmine Mansouri', email: 'yasmine.m@gmail.com', location: 'Constantine', orders: 8, spent: '15 200 DA', lastOrder: '27 Fév 2026', status: 'vip', rating: 5 },
    { id: '4', name: 'Fatima Ziri', email: 'fatima.z@hotmail.com', location: 'Blida', orders: 2, spent: '3 200 DA', lastOrder: '26 Fév 2026', status: 'new', rating: 3 },
    { id: '5', name: 'Nadia Bouzid', email: 'nadia.bz@gmail.com', location: 'Annaba', orders: 9, spent: '17 600 DA', lastOrder: '20 Fév 2026', status: 'regular', rating: 4 },
];

const statusConfig: Record<string, { label: string, color: string }> = {
    vip: { label: 'VIP', color: 'bg-or/20 text-or border border-or/40' },
    regular: { label: 'Régulier', color: 'bg-blue-100 text-blue-700' },
    new: { label: 'Nouveau', color: 'bg-green-100 text-green-700' },
};

export default function AdminClientsPage() {
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
                {[
                    { label: 'Total clients', value: clients.length.toString(), icon: User, color: 'text-encre3', bg: 'bg-creme' },
                    { label: 'Clients VIP', value: clients.filter(c => c.status === 'vip').length.toString(), icon: Star, color: 'text-or', bg: 'bg-or/10' },
                    { label: 'Revenus totaux', value: '68 500 DA', icon: TrendingUp, color: 'text-green-600', bg: 'bg-green-50' },
                    { label: 'Commandes moy.', value: '7,2 / client', icon: ShoppingBag, color: 'text-blue-600', bg: 'bg-blue-50' },
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
                ))}
            </div>

            {/* Clients Table */}
            <div className="bg-white rounded-sm border border-creme2 shadow-lg overflow-hidden">
                <div className="p-6 border-b border-creme2 bg-creme/10">
                    <h2 className="font-serif text-xl text-encre">Liste des clients</h2>
                </div>
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
                                            {client.name.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-encre group-hover:text-rouge-deep transition-colors">{client.name}</p>
                                            <p className="text-[10px] text-encre3 font-medium">{client.email}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-8 py-5 text-sm font-medium text-encre3">{client.location}</td>
                                <td className="px-8 py-5 text-center text-lg font-black text-encre">{client.orders}</td>
                                <td className="px-8 py-5 text-right text-sm font-black text-rouge-deep">{client.spent}</td>
                                <td className="px-8 py-5 text-[10px] font-bold uppercase tracking-wide text-encre3">{client.lastOrder}</td>
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
            </div>
        </div>
    );
}
