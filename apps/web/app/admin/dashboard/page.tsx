'use client';

import { useEffect, useState } from 'react';
import {
    TrendingUp,
    Users,
    Package,
    ShoppingCart,
    Download,
    AlertTriangle,
    Sparkles,
    Eye,
    Zap,
    Calendar,
    Loader,
    RefreshCw,
    Plus,
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
    ResponsiveContainer,
    AreaChart,
    Area,
} from 'recharts';
import { DashboardAPI } from '@/lib/api/client';

const COLORS = ['#10B981', '#F59E0B', '#EF4444', '#3B82F6', '#8B5CF6', '#EC4899'];

export default function AdminDashboard() {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        console.log('🔄 Dashboard: Initializing data fetch');
        const fetchData = async () => {
            try {
                console.log('📊 Dashboard: Starting data fetch');
                setLoading(true);
                const result = await DashboardAPI.getMetrics();
                console.log('📊 Dashboard: API result received', result);

                if (result.success && result.data) {
                    console.log('✅ Dashboard: Data loaded successfully', result.data);
                    setData(result.data);
                } else {
                    console.error('❌ Dashboard: API returned error', result.error);
                    setError(result.error || 'Erreur lors du chargement');
                }
            } catch (err) {
                console.error('💥 Dashboard: Network error', err);
                setError('Impossible de charger le dashboard');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const fetchMetrics = async (isRefresh = false) => {
        try {
            if (isRefresh) setRefreshing(true);
            else setLoading(true);
            
            setError(null);
            const result = await DashboardAPI.getMetrics();
            
            if (result.success && result.data) {
                setData(result.data);
            } else {
                setError(result.error || 'Erreur lors du chargement');
            }
        } catch (err) {
            setError('Impossible de charger le dashboard');
            console.error('Dashboard error:', err);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen bg-gradient-to-br from-[#FAF5EF] to-[#F5EFEA]">
                <div className="text-center">
                    <Loader className="w-12 h-12 text-or animate-spin mx-auto mb-4" />
                    <p className="text-lg text-encre/60">Chargement du dashboard...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-8">
                <div className="bg-rouge-deep/10 border border-rouge-deep/20 rounded-lg p-6 text-rouge-deep">
                    <AlertTriangle className="inline mr-2" />
                    {error}
                </div>
            </div>
        );
    }

    const kpis = data?.kpis || {};
    const charts = data?.charts || {};
    const alerts = data?.alerts || {};

    // Create KPIs array from the kpis object
    const kpisArray = [
        {
            name: 'Revenus Totaux',
            value: kpis.totalRevenue || 0,
            currency: 'DA',
            delta: '+12.5%',
            icon: TrendingUp,
            color: 'text-green-600'
        },
        {
            name: 'Commandes Totales',
            value: kpis.totalOrders || 0,
            currency: '',
            delta: '+8.2%',
            icon: ShoppingCart,
            color: 'text-blue-600'
        },
        {
            name: 'Clients Actifs',
            value: kpis.activeClients || 0,
            currency: '',
            delta: '+15.3%',
            icon: Users,
            color: 'text-purple-600'
        },
        {
            name: 'Panier Moyen',
            value: kpis.averageCart || 0,
            currency: 'DA',
            delta: '+5.7%',
            icon: Package,
            color: 'text-orange-600'
        }
    ];

    return (
        <div className="p-8 bg-gradient-to-br from-[#FAF5EF] via-[#F9F4EE] to-[#F5EFEA] min-h-screen">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-serif text-encre mb-1">Tableau de Bord</h1>
                    <p className="text-sm text-encre/60">Bienvenue, Maya</p>
                </div>
                <button
                    onClick={() => fetchMetrics(true)}
                    disabled={refreshing}
                    className="px-4 py-2 bg-or text-white rounded-lg hover:bg-or-light transition-all flex items-center gap-2 disabled:opacity-50"
                >
                    <RefreshCw size={18} className={refreshing ? 'animate-spin' : ''} />
                    {refreshing ? 'Actualisation...' : 'Actualiser'}
                </button>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                    {error}
                </div>
            )}

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {kpisArray.map((kpi: any, idx: number) => (
                    <div
                        key={idx}
                        className="bg-white rounded-2xl border border-creme border-opacity-50 p-6 hover:shadow-xl transition-all duration-300 group cursor-pointer transform hover:scale-105"
                    >
                        <div className="flex items-start justify-between mb-4">
                            <div>
                                <p className="text-xs uppercase tracking-widest text-encre/40 font-bold mb-2">
                                    {kpi.name}
                                </p>
                                <p className="text-2xl font-bold text-encre">
                                    {kpi.value}
                                    <span className="text-sm font-normal text-encre/60 ml-1">{kpi.currency}</span>
                                </p>
                            </div>
                            <div className="p-3 bg-gradient-to-br from-or/10 to-or/5 rounded-lg group-hover:from-or/20 group-hover:to-or/10 transition-all">
                                <kpi.icon size={24} className={cn('transition-all', kpi.color)} />
                            </div>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-xs text-encre/40">vs. mois dernier</span>
                            <span className="text-xs font-semibold text-green-600">{kpi.delta}</span>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                {/* Revenue Trend */}
                <div className="lg:col-span-2 bg-white rounded-2xl border border-creme border-opacity-50 p-6 hover:shadow-lg transition-all">
                    <h3 className="text-lg font-semibold text-encre mb-6 flex items-center gap-2">
                        <TrendingUp size={20} className="text-or" />
                        Tendance des Revenus
                    </h3>
                    {charts?.monthlyRevenue ? (
                        <ResponsiveContainer width="100%" height={300}>
                            <AreaChart data={charts.monthlyRevenue}>
                                <defs>
                                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10B981" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#E5D4C4" />
                                <XAxis dataKey="name" stroke="#999" />
                                <YAxis stroke="#999" />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: '#FFF',
                                        border: '1px solid #10B981',
                                        borderRadius: '8px',
                                    }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="revenue"
                                    stroke="#10B981"
                                    fillOpacity={1}
                                    fill="url(#colorRevenue)"
                                    strokeWidth={2}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    ) : (
                        <p className="text-center text-encre/40 py-12">Aucune donnée disponible</p>
                    )}
                </div>

                {/* Product Sales */}
                <div className="bg-white rounded-2xl border border-creme border-opacity-50 p-6 hover:shadow-lg transition-all">
                    <h3 className="text-lg font-semibold text-encre mb-6 flex items-center gap-2">
                        <Package size={20} className="text-or" />
                        Ventes par Produit
                    </h3>
                    {charts?.productSales && charts.productSales.length > 0 ? (
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={charts.productSales}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ name, value }) => `${name}: ${value}`}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {charts.productSales.map((_: any, index: number) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={['#10B981', '#F59E0B', '#EF4444', '#3B82F6'][index % 4]}
                                        />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    ) : (
                        <p className="text-center text-encre/40 py-12">Aucune donnée disponible</p>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* Order Status */}
                <div className="bg-white rounded-2xl border border-creme border-opacity-50 p-6 hover:shadow-lg transition-all">
                    <h3 className="text-lg font-semibold text-encre mb-6 flex items-center gap-2">
                        <ShoppingCart size={20} className="text-or" />
                        Statut des Commandes
                    </h3>
                    {charts?.orderStatusBreakdown && charts.orderStatusBreakdown.length > 0 ? (
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={charts.orderStatusBreakdown}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ name, value }) => `${name}: ${value}`}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {charts.orderStatusBreakdown.map((_: any, index: number) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={['#10B981', '#F59E0B', '#EF4444', '#6B7280'][index % 4]}
                                        />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    ) : (
                        <p className="text-center text-encre/40 py-12">Aucune donnée disponible</p>
                    )}
                </div>

                {/* Customer Growth */}
                <div className="bg-white rounded-2xl border border-creme border-opacity-50 p-6 hover:shadow-lg transition-all">
                    <h3 className="text-lg font-semibold text-encre mb-6 flex items-center gap-2">
                        <Users size={20} className="text-or" />
                        Croissance Client
                    </h3>
                    {charts?.customerGrowth && charts.customerGrowth.length > 0 ? (
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={charts.customerGrowth}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#E5D4C4" />
                                <XAxis dataKey="month" stroke="#999" />
                                <YAxis stroke="#999" />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: '#FFF',
                                        border: '1px solid #10B981',
                                        borderRadius: '8px',
                                    }}
                                />
                                <Bar dataKey="customers" fill="#10B981" radius={[8, 8, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    ) : (
                        <p className="text-center text-encre/40 py-12">Aucune donnée disponible</p>
                    )}
                </div>
            </div>

            {/* Stock Alerts */}
            <div className="bg-white rounded-2xl border border-creme border-opacity-50 p-6 hover:shadow-lg transition-all mb-8">
                <h3 className="text-lg font-semibold text-encre mb-6 flex items-center gap-2">
                    <AlertTriangle size={20} className="text-yellow-600" />
                    Produits en Stock Faible
                </h3>
                {alerts?.lowStockProducts && alerts.lowStockProducts.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-creme">
                                    <th className="text-left py-3 px-4 text-xs font-semibold text-encre/60 uppercase">Produit</th>
                                    <th className="text-left py-3 px-4 text-xs font-semibold text-encre/60 uppercase">SKU</th>
                                    <th className="text-right py-3 px-4 text-xs font-semibold text-encre/60 uppercase">Stock</th>
                                    <th className="text-right py-3 px-4 text-xs font-semibold text-encre/60 uppercase">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {alerts.lowStockProducts.map((product: any) => (
                                    <tr key={product.id} className="border-b border-creme/30 hover:bg-or/2 transition-all">
                                        <td className="py-3 px-4 text-sm text-encre">{product.name}</td>
                                        <td className="py-3 px-4 text-sm text-encre/60">{product.sku}</td>
                                        <td className="py-3 px-4 text-right text-sm font-semibold text-rouge-mid">{product.stock}</td>
                                        <td className="py-3 px-4 text-right">
                                            <button className="text-or hover:text-or-light transition-colors text-sm font-semibold">
                                                Réapprovisionner
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p className="text-center text-encre/40 py-8">Tous les produits ont un stock suffisant ✓</p>
                )}
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Link href="/admin/commandes" className="bg-gradient-to-br from-or/10 to-or/5 hover:from-or/20 hover:to-or/10 border border-or/20 rounded-2xl p-6 transition-all hover:shadow-lg group">
                    <div className="flex items-center justify-between mb-4">
                        <h4 className="font-semibold text-encre group-hover:text-or transition-colors">Nouvelle Commande</h4>
                        <Plus size={20} className="text-or" />
                    </div>
                    <p className="text-sm text-encre/60">Ajouter une nouvelle commande</p>
                </Link>

                <Link href="/admin/produits" className="bg-gradient-to-br from-or/10 to-or/5 hover:from-or/20 hover:to-or/10 border border-or/20 rounded-2xl p-6 transition-all hover:shadow-lg group">
                    <div className="flex items-center justify-between mb-4">
                        <h4 className="font-semibold text-encre group-hover:text-or transition-colors">Nouveau Produit</h4>
                        <Plus size={20} className="text-or" />
                    </div>
                    <p className="text-sm text-encre/60">Ajouter un nouveau produit</p>
                </Link>

                <div className="bg-gradient-to-br from-or/10 to-or/5 border border-or/20 rounded-2xl p-6 group cursor-pointer hover:shadow-lg transition-all hover:from-or/20 hover:to-or/10">
                    <div className="flex items-center justify-between mb-4">
                        <h4 className="font-semibold text-encre group-hover:text-or transition-colors">Exporter Rapport</h4>
                        <Download size={20} className="text-or" />
                    </div>
                    <p className="text-sm text-encre/60">Télécharger les données</p>
                </div>
            </div>
        </div>
    );
}