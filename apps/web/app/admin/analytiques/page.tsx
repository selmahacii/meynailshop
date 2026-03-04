'use client';

import { Bell, Download, Plus, TrendingUp, TrendingDown, Users, ShoppingCart, Star, BarChart3 } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

const kpis = [
    { label: 'CA du mois', value: '84 500 DA', delta: '+18%', positive: true, icon: TrendingUp },
    { label: 'Nouveaux clients', value: '28', delta: '+12%', positive: true, icon: Users },
    { label: 'Taux conversion', value: '3,4%', delta: '-0,2%', positive: false, icon: BarChart3 },
    { label: 'Panier moyen', value: '2 350 DA', delta: '+5%', positive: true, icon: ShoppingCart },
];

const topProducts = [
    { name: 'OPI Red Rock', sales: 84, revenue: '16 800 DA', color: 'bg-rouge-deep' },
    { name: 'Gel Builder Clear', sales: 71, revenue: '14 200 DA', color: 'bg-creme2' },
    { name: 'Lampe UV Pro 48W', sales: 42, revenue: '35 700 DA', color: 'bg-or' },
    { name: 'Top Coat Brillant', sales: 38, revenue: '5 700 DA', color: 'bg-pink-200' },
];

const months = ['Sep', 'Oct', 'Nov', 'Déc', 'Jan', 'Fév', 'Mar'];
const revenues = [42000, 55000, 48000, 72000, 61000, 79000, 84500];
const maxRevenue = Math.max(...revenues);

export default function AdminAnalyticsPage() {
    return (
        <div className="space-y-8 pb-12">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-serif text-encre">Analytiques</h1>
                    <p className="text-encre3 text-[10px] uppercase tracking-widest font-bold mt-1">Tableau de performance — 04 Mars 2026</p>
                </div>
                <div className="flex items-center space-x-3">
                    <button className="p-2.5 bg-white border border-creme2 rounded-sm text-encre3 hover:text-or hover:border-or transition-all shadow-sm"><Bell size={18} /></button>
                    <button className="p-2.5 bg-white border border-creme2 rounded-sm text-encre3 hover:text-or hover:border-or transition-all shadow-sm"><Download size={18} /></button>
                    <button className="flex items-center space-x-2 px-5 py-2.5 bg-rouge-deep text-creme rounded-sm text-sm font-bold uppercase tracking-widest hover:bg-rouge-mid transition-all shadow-md">
                        <Plus size={16} /><span>Exporter</span>
                    </button>
                    <Link href="/" className="px-5 py-2.5 border border-encre text-encre rounded-sm text-sm font-bold hover:bg-encre hover:text-creme transition-all">Voir la boutique</Link>
                </div>
            </div>

            {/* KPI Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {kpis.map((kpi, i) => (
                    <div key={i} className="bg-white rounded-sm border border-creme2 p-8 shadow-lg hover:border-or transition-all group">
                        <div className="flex justify-between items-start mb-6">
                            <div className="p-2.5 bg-creme rounded-sm border border-creme2">
                                <kpi.icon size={22} className="text-encre3" strokeWidth={1.5} />
                            </div>
                            <span className={cn("text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-sm", kpi.positive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600")}>
                                {kpi.delta}
                            </span>
                        </div>
                        <p className="text-[10px] uppercase font-black tracking-widest text-encre3 mb-2">{kpi.label}</p>
                        <p className="text-2xl font-black text-encre">{kpi.value}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Revenue Chart */}
                <div className="lg:col-span-8 bg-white rounded-sm border border-creme2 shadow-lg p-8">
                    <div className="flex justify-between items-center mb-10">
                        <div>
                            <h3 className="font-serif text-xl text-encre">Chiffre d'affaires</h3>
                            <p className="text-[10px] text-encre3 uppercase tracking-widest font-bold mt-1">7 derniers mois</p>
                        </div>
                        <select className="text-[10px] font-bold uppercase tracking-widest border border-creme2 rounded-sm px-3 py-2 focus:outline-none focus:border-or bg-white text-encre3 hover:border-or cursor-pointer">
                            <option>7 derniers mois</option>
                            <option>12 derniers mois</option>
                        </select>
                    </div>

                    <div className="flex items-end justify-between space-x-3 h-64 group">
                        {revenues.map((val, i) => (
                            <div key={i} className="flex-1 flex flex-col items-center">
                                <span className="text-[9px] font-bold text-encre3 mb-2">{Math.round(val / 1000)}k</span>
                                <div className="w-full relative group/bar cursor-pointer" style={{ height: `${(val / maxRevenue) * 200}px` }}>
                                    <div className={cn(
                                        "w-full h-full rounded-t-sm transition-all duration-500",
                                        i === revenues.length - 1 ? "bg-rouge-deep" : "bg-creme2 group-hover/bar:bg-or/60"
                                    )} />
                                </div>
                                <span className="mt-3 text-[9px] font-bold uppercase text-encre3 tracking-widest">{months[i]}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Top Products */}
                <div className="lg:col-span-4 bg-white rounded-sm border border-creme2 shadow-lg overflow-hidden">
                    <div className="p-6 border-b border-creme2 bg-creme/10">
                        <h3 className="font-serif text-lg text-encre">Top produits</h3>
                        <p className="text-[10px] text-encre3 uppercase tracking-widest font-bold mt-1">Ce mois-ci</p>
                    </div>
                    <div className="p-6 space-y-6">
                        {topProducts.map((p, i) => (
                            <div key={i} className="flex items-center space-x-4 group">
                                <span className="text-[10px] font-black text-encre3 w-4">{i + 1}</span>
                                <div className={cn("w-10 h-10 rounded-sm shadow-inner flex-shrink-0", p.color)} />
                                <div className="flex-grow min-w-0">
                                    <p className="text-sm font-bold text-encre truncate group-hover:text-rouge-deep transition-colors">{p.name}</p>
                                    <div className="flex items-center space-x-2 mt-1">
                                        <div className="h-1.5 bg-creme2 rounded-full flex-grow overflow-hidden">
                                            <div className="h-full bg-or rounded-full" style={{ width: `${(p.sales / 84) * 100}%` }} />
                                        </div>
                                        <span className="text-[9px] font-bold text-encre3">{p.sales}v</span>
                                    </div>
                                </div>
                                <p className="text-[10px] font-black text-rouge-deep whitespace-nowrap">{p.revenue}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Geographical Split Placeholder */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white rounded-sm border border-creme2 shadow-lg p-8">
                    <h3 className="font-serif text-xl text-encre mb-8">Répartition par wilaya</h3>
                    <div className="space-y-4">
                        {[
                            { wilaya: 'Alger (16)', percent: 42, color: 'bg-rouge-deep' },
                            { wilaya: 'Oran (31)', percent: 18, color: 'bg-rouge-mid' },
                            { wilaya: 'Constantine (25)', percent: 12, color: 'bg-or' },
                            { wilaya: 'Blida (09)', percent: 10, color: 'bg-encre3' },
                            { wilaya: 'Autres', percent: 18, color: 'bg-creme2' },
                        ].map((w, i) => (
                            <div key={i} className="flex items-center space-x-4">
                                <span className="text-[10px] font-bold uppercase text-encre3 w-32 truncate">{w.wilaya}</span>
                                <div className="flex-grow h-2.5 bg-creme2 rounded-full overflow-hidden">
                                    <div className={cn("h-full rounded-full transition-all duration-1000", w.color)} style={{ width: `${w.percent}%` }} />
                                </div>
                                <span className="text-[10px] font-black text-encre w-8 text-right">{w.percent}%</span>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="bg-white rounded-sm border border-creme2 shadow-lg p-8">
                    <h3 className="font-serif text-xl text-encre mb-8">Mode de paiement</h3>
                    <div className="flex items-center justify-center h-48 space-x-8">
                        <div className="relative w-36 h-36">
                            <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                                <circle cx="18" cy="18" r="15.9" fill="none" stroke="#F5F0E8" strokeWidth="3" />
                                <circle cx="18" cy="18" r="15.9" fill="none" stroke="#8B0000" strokeWidth="3"
                                    strokeDasharray="72 28" strokeDashoffset="0" />
                                <circle cx="18" cy="18" r="15.9" fill="none" stroke="#C5A059" strokeWidth="3"
                                    strokeDasharray="28 72" strokeDashoffset="-72" />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-2xl font-black text-encre">72%</span>
                                <span className="text-[9px] font-bold text-encre3 uppercase">COD</span>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-center space-x-3">
                                <div className="w-3 h-3 rounded-full bg-rouge-deep" />
                                <span className="text-xs font-bold text-encre">À la livraison — 72%</span>
                            </div>
                            <div className="flex items-center space-x-3">
                                <div className="w-3 h-3 rounded-full bg-or" />
                                <span className="text-xs font-bold text-encre">Baridimob — 28%</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
