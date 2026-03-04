'use client';

import { useState } from 'react';
import { Search, Bell, Download, Filter, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

const historyEvents = [
    { id: '1', type: 'order', title: 'Nouvelle commande #4521', detail: 'Sarah Benali — 2 400 DA', date: '28 Fév 2026 14:32', user: 'Système', color: 'bg-blue-500' },
    { id: '2', type: 'stock', title: 'Alerte stock déclenchée', detail: 'Gel Builder Clear — Seuil atteint (8 u.)', date: '28 Fév 2026 11:10', user: 'Système', color: 'bg-yellow-500' },
    { id: '3', type: 'product', title: 'Produit modifié', detail: 'OPI Red Rock — Prix mis à jour de 180 DA à 200 DA', date: '27 Fév 2026 16:50', user: 'Admin', color: 'bg-or' },
    { id: '4', type: 'order', title: 'Commande expédiée #4519', detail: 'Yasmine Mansouri — Livraison Chronopost', date: '27 Fév 2026 09:20', user: 'Admin', color: 'bg-blue-500' },
    { id: '5', type: 'review', title: 'Avis approuvé', detail: 'Amira B. — Vernis Gel (4/5 étoiles)', date: '26 Fév 2026 18:01', user: 'Admin', color: 'bg-green-500' },
    { id: '6', type: 'user', title: 'Nouveau client inscrit', detail: 'fatima.z@hotmail.com — Blida', date: '26 Fév 2026 12:40', user: 'Système', color: 'bg-purple-500' },
    { id: '7', type: 'settings', title: 'Paramètres modifiés', detail: 'Frais de livraison : 500 DA → 600 DA', date: '25 Fév 2026 10:15', user: 'Admin', color: 'bg-encre' },
];

const typeFilters = [
    { key: 'all', label: 'Tous' },
    { key: 'order', label: 'Commandes' },
    { key: 'stock', label: 'Stock' },
    { key: 'product', label: 'Produits' },
    { key: 'review', label: 'Avis' },
    { key: 'user', label: 'Clients' },
];

export default function AdminHistoryPage() {
    const [filter, setFilter] = useState('all');
    const filtered = historyEvents.filter(e => filter === 'all' || e.type === filter);

    return (
        <div className="space-y-8 pb-12">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-serif text-encre">Historique</h1>
                    <p className="text-encre3 text-[10px] uppercase tracking-widest font-bold mt-1">Journal d'activité — 04 Mars 2026</p>
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
                {filtered.length === 0 ? (
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
