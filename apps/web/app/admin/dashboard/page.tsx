'use client';

import {
    TrendingUp,
    Users,
    Package,
    ShoppingCart,
    ArrowUpRight,
    ArrowDownRight,
    MoreVertical
} from 'lucide-react';

const stats = [
    { name: 'Chiffre d\'affaires', value: '420 500 DA', delta: '+12.5%', icon: TrendingUp, color: 'text-green-600', bg: 'bg-green-100' },
    { name: 'Commandes', value: '156', delta: '+8.2%', icon: ShoppingCart, color: 'text-blue-600', bg: 'bg-blue-100' },
    { name: 'Nouveaux Clients', value: '42', delta: '+5.4%', icon: Users, color: 'text-purple-600', bg: 'bg-purple-100' },
    { name: 'Produits Actifs', value: '84', delta: '-2.1%', icon: Package, color: 'text-orange-600', bg: 'bg-orange-100' },
];

export default function DashboardPage() {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-serif text-encre">Tableau de Bord</h1>
                <p className="text-encre3 text-sm">Bienvenue, voici un aperçu de votre activité aujourd'hui.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat) => (
                    <div key={stat.name} className="bg-white p-6 rounded-sm border border-creme2 shadow-sm">
                        <div className="flex justify-between items-start mb-4">
                            <div className={`p-2 rounded-sm ${stat.bg} ${stat.color}`}>
                                <stat.icon size={20} />
                            </div>
                            <span className={`text-xs font-bold flex items-center ${stat.delta.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                                {stat.delta}
                                {stat.delta.startsWith('+') ? <ArrowUpRight size={14} className="ml-1" /> : <ArrowDownRight size={14} className="ml-1" />}
                            </span>
                        </div>
                        <p className="text-encre3 text-xs uppercase tracking-widest font-semibold mb-1">{stat.name}</p>
                        <h3 className="text-2xl font-bold text-encre">{stat.value}</h3>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Sales Chart Placeholder */}
                <div className="lg:col-span-2 bg-white p-6 rounded-sm border border-creme2 shadow-sm h-[400px]">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-semibold text-encre">Évolution des Ventes</h3>
                        <select className="text-xs border-creme2 rounded-sm focus:ring-or outline-none py-1">
                            <option>7 derniers jours</option>
                            <option>30 derniers jours</option>
                        </select>
                    </div>
                    <div className="h-full w-full flex items-center justify-center border-2 border-dashed border-creme2 text-encre3/30">
                        [ Graphique Recharts ici ]
                    </div>
                </div>

                {/* Recent Orders Scaffolding */}
                <div className="bg-white p-6 rounded-sm border border-creme2 shadow-sm">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-semibold text-encre">Commandes Récentes</h3>
                        <button className="text-xs text-or font-bold hover:underline">Voir tout</button>
                    </div>
                    <div className="space-y-6">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className="flex items-center justify-between border-b border-creme2 last:border-0 pb-4 last:pb-0">
                                <div className="flex items-center">
                                    <div className="w-10 h-10 rounded-full bg-creme2 flex items-center justify-center text-encre3 text-xs font-bold mr-3">
                                        CL
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-encre">Client #{i}</p>
                                        <p className="text-[10px] text-encre3 uppercase">ORD-2026-00{i}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-bold text-encre">4 500 DA</p>
                                    <span className="text-[10px] px-2 py-0.5 bg-green-100 text-green-700 rounded-full font-bold uppercase">Payé</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
