'use client';

import { useEffect, useState } from 'react';
import { 
    Bell, 
    Download, 
    Plus, 
    TrendingUp, 
    TrendingDown, 
    Users, 
    ShoppingCart, 
    BarChart3, 
    Loader,
    AlertTriangle,
    MapPin,
    CreditCard
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { formatPrice } from '@/lib/utils/currency';
import { DashboardAPI } from '@/lib/api/client';
import { motion } from 'framer-motion';

export default function AdminAnalyticsPage() {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                setLoading(true);
                const result = await DashboardAPI.getMetrics();
                if (result.success) {
                    setData(result.data);
                } else {
                    setError(result.error || 'Erreur lors du chargement des données');
                }
            } catch (err) {
                setError('Erreur réseau');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchAnalytics();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-[60vh]">
                <div className="text-center">
                    <Loader className="w-10 h-10 text-or animate-spin mx-auto mb-4" />
                    <p className="text-encre3 font-bold uppercase tracking-widest text-[10px]">Chargement des analyses...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-8 bg-red-50 border border-red-100 rounded-sm text-red-600 flex items-center gap-3">
                <AlertTriangle size={20} />
                <p className="font-bold text-sm">{error}</p>
            </div>
        );
    }

    const { kpis = {}, charts = {} } = data || {};
    
    const kpiCards = [
        { label: 'Chiffre d\'affaires', value: formatPrice(kpis.totalRevenue || 0), delta: '+12%', positive: true, icon: TrendingUp },
        { label: 'Nouveaux clients', value: kpis.activeClients || 0, delta: '+8%', positive: true, icon: Users },
        { label: 'Commandes', value: kpis.totalOrders || 0, delta: '+15%', positive: true, icon: ShoppingCart },
        { label: 'Panier moyen', value: formatPrice(kpis.averageCart || 0), delta: '+5%', positive: true, icon: BarChart3 },
    ];

    const revenues = charts.monthlyRevenue || [];
    const maxRevenue = Math.max(...revenues.map((r: any) => r.revenue), 1000);

    return (
        <div className="space-y-8 pb-12">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-serif text-encre">Analytiques Business</h1>
                    <p className="text-encre3 text-[10px] uppercase tracking-widest font-bold mt-1">
                        Performance en temps réel — {new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })}
                    </p>
                </div>
                <div className="flex items-center space-x-3">
                    <button className="p-2.5 bg-white border border-creme2 rounded-sm text-encre3 hover:text-or hover:border-or transition-all shadow-sm"><Download size={18} /></button>
                    <button className="flex items-center space-x-2 px-5 py-2.5 bg-rouge-deep text-creme rounded-sm text-sm font-bold uppercase tracking-widest hover:bg-rouge-mid transition-all shadow-md">
                        <Plus size={16} /><span>Générer Rapport</span>
                    </button>
                    <Link href="/" className="px-5 py-2.5 border border-encre text-encre rounded-sm text-sm font-bold hover:bg-encre hover:text-creme transition-all">Voir Boutique</Link>
                </div>
            </div>

            {/* KPI Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {kpiCards.map((kpi, i) => (
                    <motion.div 
                        key={i} 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="bg-white rounded-sm border border-creme2 p-8 shadow-sm hover:shadow-xl hover:border-or transition-all group"
                    >
                        <div className="flex justify-between items-start mb-6">
                            <div className="p-2.5 bg-creme rounded-sm border border-creme2 group-hover:bg-or/10 group-hover:border-or/30 transition-colors">
                                <kpi.icon size={22} className="text-encre" strokeWidth={1.5} />
                            </div>
                            <span className={cn("text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-sm", kpi.positive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600")}>
                                {kpi.delta}
                            </span>
                        </div>
                        <p className="text-[10px] uppercase font-black tracking-widest text-encre3 mb-2">{kpi.label}</p>
                        <p className="text-2xl font-black text-encre">{kpi.value}</p>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Revenue Chart */}
                <div className="lg:col-span-8 bg-white rounded-sm border border-creme2 shadow-sm p-8">
                    <div className="flex justify-between items-center mb-10">
                        <div>
                            <h3 className="font-serif text-xl text-encre">Croissance du CA</h3>
                            <p className="text-[10px] text-encre3 uppercase tracking-widest font-bold mt-1">Performance mensuelle</p>
                        </div>
                    </div>

                    <div className="flex items-end justify-between space-x-3 h-64">
                        {revenues.length > 0 ? revenues.map((r: any, i: number) => (
                            <div key={i} className="flex-1 flex flex-col items-center">
                                <div className="w-full relative group/bar cursor-pointer" style={{ height: `${(r.revenue / maxRevenue) * 180 || 2}px` }}>
                                    <motion.div 
                                        initial={{ height: 0 }}
                                        animate={{ height: '100%' }}
                                        transition={{ duration: 0.8, delay: i * 0.05 }}
                                        className={cn(
                                            "w-full rounded-t-sm transition-all duration-300",
                                            i === revenues.length - 1 ? "bg-rouge-deep" : "bg-creme2 group-hover/bar:bg-or/60"
                                        )} 
                                    />
                                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-encre text-creme text-[9px] font-bold px-1.5 py-0.5 rounded opacity-0 group-hover/bar:opacity-100 transition-opacity whitespace-nowrap z-10">
                                        {formatPrice(r.revenue)}
                                    </div>
                                </div>
                                <span className="mt-4 text-[9px] font-bold uppercase text-encre3 tracking-widest">{r.name}</span>
                            </div>
                        )) : (
                            <div className="w-full flex items-center justify-center text-encre3 text-xs italic">Aucune donnée historique</div>
                        )}
                    </div>
                </div>

                {/* Top Products */}
                <div className="lg:col-span-4 bg-white rounded-sm border border-creme2 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-creme2 bg-creme/10">
                        <h3 className="font-serif text-lg text-encre">Top Ventes</h3>
                        <p className="text-[10px] text-encre3 uppercase tracking-widest font-bold mt-1">Produits les plus populaires</p>
                    </div>
                    <div className="p-6 space-y-6">
                        {charts.productSales && charts.productSales.length > 0 ? charts.productSales.map((p: any, i: number) => (
                            <div key={i} className="flex items-center space-x-4 group">
                                <span className="text-[10px] font-black text-encre3 w-4">{i + 1}</span>
                                <div className="w-10 h-10 rounded-sm bg-creme border border-creme2 flex items-center justify-center flex-shrink-0 text-or font-serif font-black">
                                    {p.name.charAt(0)}
                                </div>
                                <div className="flex-grow min-w-0">
                                    <p className="text-sm font-bold text-encre truncate group-hover:text-rouge-deep transition-colors">{p.name}</p>
                                    <div className="flex items-center space-x-2 mt-1">
                                        <div className="h-1 bg-creme2 rounded-full flex-grow overflow-hidden">
                                            <div 
                                                className="h-full bg-or rounded-full" 
                                                style={{ width: `${(p.value / Math.max(...charts.productSales.map((x:any)=>x.value))) * 100}%` }} 
                                            />
                                        </div>
                                        <span className="text-[9px] font-bold text-encre3">{p.value}v</span>
                                    </div>
                                </div>
                            </div>
                        )) : (
                            <p className="text-center text-encre3 text-xs italic py-10">Pas de ventes enregistrées</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Geographical Split */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white rounded-sm border border-creme2 shadow-sm p-8">
                    <div className="flex items-center gap-3 mb-8">
                        <MapPin size={22} className="text-or" />
                        <h3 className="font-serif text-xl text-encre">Répartition par Wilaya</h3>
                    </div>
                    <div className="space-y-4">
                        {charts.wilayaDistribution && charts.wilayaDistribution.length > 0 ? charts.wilayaDistribution.map((w: any, i: number) => (
                            <div key={i} className="flex items-center space-x-4">
                                <span className="text-[10px] font-bold uppercase text-encre3 w-32 truncate">{w.wilaya}</span>
                                <div className="flex-grow h-2 bg-creme2 rounded-full overflow-hidden">
                                    <div 
                                        className={cn("h-full rounded-full", i === 0 ? "bg-rouge-deep" : "bg-or")} 
                                        style={{ width: `${w.percent}%` }} 
                                    />
                                </div>
                                <span className="text-[10px] font-black text-encre w-8 text-right">{w.percent}%</span>
                            </div>
                        )) : (
                            <p className="text-center text-encre3 text-xs italic py-4">Données géographiques non disponibles</p>
                        )}
                    </div>
                </div>

                <div className="bg-white rounded-sm border border-creme2 shadow-sm p-8">
                    <div className="flex items-center gap-3 mb-8">
                        <CreditCard size={22} className="text-or" />
                        <h3 className="font-serif text-xl text-encre">Mode de Paiement</h3>
                    </div>
                    <div className="flex items-center justify-around h-48">
                        <div className="relative w-32 h-32">
                            <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                                <circle cx="18" cy="18" r="15.9" fill="none" stroke="#F5F0E8" strokeWidth="4" />
                                {charts.paymentMethodDistribution?.map((m: any, i: number) => {
                                    const total = charts.paymentMethodDistribution.reduce((s:number, x:any)=> s + x.value, 0);
                                    let offset = 0;
                                    for(let j=0; j<i; j++) offset += (charts.paymentMethodDistribution[j].value / total) * 100;
                                    const percent = (m.value / total) * 100;
                                    return (
                                        <circle 
                                            key={i}
                                            cx="18" cy="18" r="15.9" fill="none" 
                                            stroke={i === 0 ? "#8B0000" : i === 1 ? "#C5A059" : "#1A0A0A"}
                                            strokeWidth="4"
                                            strokeDasharray={`${percent} ${100 - percent}`}
                                            strokeDashoffset={-offset}
                                        />
                                    );
                                })}
                            </svg>
                        </div>
                        <div className="space-y-4">
                            {charts.paymentMethodDistribution?.map((m: any, i: number) => (
                                <div key={i} className="flex items-center space-x-3">
                                    <div className={cn("w-3 h-3 rounded-full", i === 0 ? "bg-rouge-deep" : i === 1 ? "bg-or" : "bg-encre")} />
                                    <span className="text-xs font-bold text-encre">{m.name} — {m.percent}%</span>
                                </div>
                            ))}
                            {(!charts.paymentMethodDistribution || charts.paymentMethodDistribution.length === 0) && (
                                <p className="text-encre3 text-xs italic">Aucune transaction</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
