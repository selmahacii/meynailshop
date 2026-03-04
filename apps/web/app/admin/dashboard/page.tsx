'use client';

import { useEffect, useState } from 'react';
import {
    TrendingUp,
    Users,
    Package,
    ShoppingCart,
    Download,
    Plus,
    AlertTriangle,
    ChevronRight,
    BarChart3,
    PieChart as PieChartIcon,
    LineChart as LineChartIcon
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import {
    LineChart,
    Line,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from 'recharts';

// Chart data
const revenueData = [
    { date: 'Mar 1', revenue: 4000, orders: 24 },
    { date: 'Mar 2', revenue: 3000, orders: 18 },
    { date: 'Mar 3', revenue: 2000, orders: 16 },
    { date: 'Mar 4', revenue: 2780, orders: 22 },
    { date: 'Mar 5', revenue: 1890, orders: 14 },
    { date: 'Mar 6', revenue: 2390, orders: 19 },
    { date: 'Mar 7', revenue: 3490, orders: 26 },
];

const productSalesData = [
    { name: 'Vernis Rouge Deep', sales: 450, fill: '#EF4444' },
    { name: 'Gel French', sales: 380, fill: '#F59E0B' },
    { name: 'Base Premium', sales: 320, fill: '#10B981' },
    { name: 'Top Coat', sales: 290, fill: '#3B82F6' },
];

const orderStatusData = [
    { status: 'Livrées', count: 234, fill: '#10B981' },
    { status: 'En cours', count: 45, fill: '#F59E0B' },
    { status: 'En attente', count: 12, fill: '#6B7280' },
    { status: 'Annulées', count: 8, fill: '#EF4444' }
];

const customerMetrics = [
    { month: 'Janvier', customers: 400, retention: 240 },
    { month: 'Février', customers: 500, retention: 320 },
    { month: 'Mars', customers: 620, retention: 420 },
];

export default function AdminDashboard() {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setTimeout(() => setLoading(false), 500);
    }, []);

    const kpis = [
        {
            name: 'REVENUS TOTAUX',
            value: '584 500',
            currency: 'DA',
            delta: '+24%',
            icon: TrendingUp,
            color: 'text-green-600',
            bg: 'bg-green-50',
            borderColor: 'border-green-200'
        },
        {
            name: 'COMMANDES',
            value: '293',
            delta: '+32%',
            icon: ShoppingCart,
            color: 'text-blue-600',
            bg: 'bg-blue-50',
            borderColor: 'border-blue-200'
        },
        {
            name: 'CLIENTS ACTIFS',
            value: '1 247',
            delta: '+18%',
            icon: Users,
            color: 'text-purple-600',
            bg: 'bg-purple-50',
            borderColor: 'border-purple-200'
        },
        {
            name: 'PANIER MOYEN',
            value: '2 840',
            currency: 'DA',
            delta: '+12%',
            icon: TrendingUp,
            color: 'text-orange-600',
            bg: 'bg-orange-50',
            borderColor: 'border-orange-200'
        }
    ];

    return (
        <div className="space-y-8 pb-12">
            {/* Header */}
            <div>
                <h1 className="text-4xl font-bold text-encre mb-2">Tableau de bord administrateur</h1>
                <p className="text-encre3 text-sm">Gestion complète de votre business MEEY</p>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {kpis.map((kpi) => {
                    const Icon = kpi.icon;
                    return (
                        <div
                            key={kpi.name}
                            className={cn(
                                'p-6 rounded-lg border shadow-sm bg-white transition-all hover:shadow-md',
                                kpi.borderColor
                            )}
                        >
                            <div className="flex items-center justify-between mb-4">
                                <div className={cn('p-3 rounded-lg', kpi.bg)}>
                                    <Icon className={cn('w-6 h-6', kpi.color)} />
                                </div>
                                <span className="text-green-600 text-sm font-semibold">{kpi.delta}</span>
                            </div>
                            <p className="text-sm text-encre3 font-medium mb-1">{kpi.name}</p>
                            <div className="flex items-baseline gap-2">
                                <p className="text-2xl font-bold text-encre">{kpi.value}</p>
                                {kpi.currency && <span className="text-sm text-encre3">{kpi.currency}</span>}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Main Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Revenue Trend - Large */}
                <div className="lg:col-span-2 bg-white p-6 rounded-lg border border-creme2 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-lg font-bold text-encre flex items-center gap-2">
                                <LineChartIcon className="w-5 h-5 text-or" />
                                Revenus & Commandes
                            </h2>
                            <p className="text-sm text-encre3 mt-1">7 derniers jours</p>
                        </div>
                        <button className="text-sm font-semibold text-or hover:text-rouge-mid">Exporter</button>
                    </div>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={revenueData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                            <XAxis dataKey="date" stroke="#999" />
                            <YAxis stroke="#999" />
                            <Tooltip 
                                contentStyle={{ backgroundColor: '#fff', border: '1px solid #ccc', borderRadius: '4px' }}
                                formatter={(value) => `${value.toLocaleString()} DA`}
                            />
                            <Legend />
                            <Line type="monotone" dataKey="revenue" stroke="#10B981" strokeWidth={2} dot={{ fill: '#10B981' }} name="Revenus (DA)" />
                            <Line type="monotone" dataKey="orders" stroke="#F59E0B" strokeWidth={2} dot={{ fill: '#F59E0B' }} name="Commandes" />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                {/* Sales by Product - Pie */}
                <div className="bg-white p-6 rounded-lg border border-creme2 shadow-sm">
                    <h2 className="text-lg font-bold text-encre flex items-center gap-2 mb-6">
                        <PieChartIcon className="w-5 h-5 text-or" />
                        Top Produits
                    </h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={productSalesData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name, value }) => `${name.split(' ')[0]}: ${value}`}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="sales"
                            >
                                {productSalesData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.fill} />
                                ))}
                            </Pie>
                            <Tooltip formatter={(value) => `${value} ventes`} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Secondary Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Order Status Pie */}
                <div className="bg-white p-6 rounded-lg border border-creme2 shadow-sm">
                    <h2 className="text-lg font-bold text-encre flex items-center gap-2 mb-6">
                        <BarChart3 className="w-5 h-5 text-or" />
                        Statut des Commandes
                    </h2>
                    <ResponsiveContainer width="100%" height={250}>
                        <PieChart>
                            <Pie
                                data={orderStatusData}
                                cx="50%"
                                cy="50%"
                                innerRadius={50}
                                outerRadius={90}
                                paddingAngle={2}
                                dataKey="count"
                            >
                                {orderStatusData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.fill} />
                                ))}
                            </Pie>
                            <Tooltip formatter={(value) => `${value} cmd`} />
                        </PieChart>
                    </ResponsiveContainer>
                    <div className="mt-6 space-y-3">
                        {orderStatusData.map((item) => (
                            <div key={item.status} className="flex items-center justify-between text-sm">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.fill }}></div>
                                    <span className="text-encre3">{item.status}</span>
                                </div>
                                <span className="font-semibold text-encre">{item.count}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Customer Growth */}
                <div className="bg-white p-6 rounded-lg border border-creme2 shadow-sm">
                    <h2 className="text-lg font-bold text-encre flex items-center gap-2 mb-6">
                        <LineChartIcon className="w-5 h-5 text-or" />
                        Croissance Clients
                    </h2>
                    <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={customerMetrics}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                            <XAxis dataKey="month" stroke="#999" />
                            <YAxis stroke="#999" />
                            <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #ccc', borderRadius: '4px' }} />
                            <Legend />
                            <Bar dataKey="customers" fill="#3B82F6" name="Nouveaux clients" />
                            <Bar dataKey="retention" fill="#10B981" name="Clients fidèles" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Bottom Section - Alerts & Quick Stats */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Stock Alerts */}
                <div className="lg:col-span-2 bg-white p-6 rounded-lg border border-creme2 shadow-sm">
                    <h2 className="text-lg font-bold text-encre flex items-center gap-2 mb-6">
                        <AlertTriangle className="w-5 h-5 text-rouge" />
                        Alertes Critiques
                    </h2>
                    <div className="space-y-4">
                        {[
                            { name: 'Vernis Blanc - Stock faible', status: '3 unités restantes', color: 'bg-rouge/20 text-rouge' },
                            { name: 'Gel UV - En retard de livraison', status: 'Reçu: -2 jours', color: 'bg-orange-100 text-orange-700' },
                            { name: 'Lime Fine - Promotion active', status: '50DA de remise', color: 'bg-green-100 text-green-700' }
                        ].map((alert, i) => (
                            <div key={i} className={cn('p-4 rounded-lg border', alert.color)}>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="font-semibold">{alert.name}</p>
                                        <p className="text-sm opacity-75 mt-1">{alert.status}</p>
                                    </div>
                                    <ChevronRight className="w-5 h-5" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-gradient-to-br from-encre to-[#2A0A0A] p-6 rounded-lg shadow-lg text-creme border border-or/20">
                    <h2 className="text-lg font-bold mb-6">Actions rapides</h2>
                    <div className="space-y-3">
                        <button className="w-full flex items-center gap-3 p-4 bg-white/10 hover:bg-white/20 rounded-lg transition-all text-left">
                            <Plus className="w-5 h-5 text-or flex-shrink-0" />
                            <div>
                                <p className="font-semibold text-sm">Nouvelle commande</p>
                                <p className="text-xs opacity-75">Créer manuellement</p>
                            </div>
                        </button>
                        <button className="w-full flex items-center gap-3 p-4 bg-white/10 hover:bg-white/20 rounded-lg transition-all text-left">
                            <Package className="w-5 h-5 text-or flex-shrink-0" />
                            <div>
                                <p className="font-semibold text-sm">Ajouter un produit</p>
                                <p className="text-xs opacity-75">Nouveau stock</p>
                            </div>
                        </button>
                        <button className="w-full flex items-center gap-3 p-4 bg-white/10 hover:bg-white/20 rounded-lg transition-all text-left">
                            <Download className="w-5 h-5 text-or flex-shrink-0" />
                            <div>
                                <p className="font-semibold text-sm">Rapport mensuel</p>
                                <p className="text-xs opacity-75">Télécharger PDF</p>
                            </div>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
