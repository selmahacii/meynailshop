'use client';

import { useEffect, useState } from 'react';
import {
    TrendingUp,
    Users,
    Package,
    ShoppingCart,
    Download,
    AlertTriangle,
    Loader,
    RefreshCw,
    Plus,
    Wallet,
    Percent,
    Warehouse,
    Activity,
    CheckCircle2,
    ShieldAlert
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import {
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    AreaChart,
    Area,
} from 'recharts';
import { DashboardAPI } from '@/lib/api/client';
import { useAuthStore } from '@/lib/store/authStore';
import { formatPrice } from '@/lib/utils/currency';

function calculateDelta(current: number, previous: number) {
    if (!previous || previous === 0) return '+0%';
    const delta = ((current - previous) / previous) * 100;
    return (delta >= 0 ? '+' : '') + delta.toFixed(1) + '%';
}

export default function AdminDashboard() {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [refreshing, setRefreshing] = useState(false);
    const { user } = useAuthStore();

    useEffect(() => {
        fetchMetrics();
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

    if (loading && !refreshing) {
        return (
            <div className="flex items-center justify-center h-screen bg-gradient-to-br from-[#FAF5EF] to-[#F5EFEA]">
                <div className="text-center">
                    <Loader className="w-12 h-12 text-or animate-spin mx-auto mb-4" />
                    <p className="text-lg text-encre/60">Chargement du dashboard...</p>
                </div>
            </div>
        );
    }

    const kpis = data?.kpis || {};
    const charts = data?.charts || {};
    const alerts = data?.alerts || {};

    const revTrend = charts.monthlyRevenue || [];
    const growTrend = charts.customerGrowth || [];

    const revenueDelta = calculateDelta(kpis.totalRevenue || 0, kpis.prevRevenue || 0);
    const clientDelta = calculateDelta(kpis.activeClients || 0, kpis.prevClients || 0);
    const orderDelta = calculateDelta(kpis.totalOrders || 0, kpis.prevOrders || 0);
    
    const prevAvgCart = kpis.prevOrders > 0 ? kpis.prevRevenue / kpis.prevOrders : 0;
    const avgCartDelta = calculateDelta(kpis.averageCart || 0, prevAvgCart);

    const kpisArray = [
        {
            name: 'Revenus (Produits)',
            formattedValue: formatPrice(kpis.totalRevenue || 0),
            delta: revenueDelta,
            icon: TrendingUp,
            color: 'text-green-600',
            description: 'Hors frais de livraison'
        },
        {
            name: 'Bénéfice Net',
            formattedValue: formatPrice(kpis.totalProfit || 0),
            delta: null,
            icon: Wallet,
            color: 'text-emerald-600',
            description: 'Revenus - Coûts d\'achat'
        },
        {
            name: 'Marge Brute',
            formattedValue: `${kpis.profitMargin || 0}%`,
            delta: null,
            icon: Percent,
            color: 'text-indigo-600',
            description: 'Rentabilité sur ventes'
        },
        {
            name: 'Valeur de Stock',
            formattedValue: formatPrice(kpis.inventoryValue || 0),
            delta: null,
            icon: Warehouse,
            color: 'text-blue-600',
            description: 'Fond de roulement engagé'
        }
    ];

    const secondaryKpis = [
        {
            name: 'Commandes Totales',
            value: kpis.totalOrders || 0,
            delta: orderDelta,
            icon: ShoppingCart,
        },
        {
            name: 'Clients Actifs',
            value: kpis.activeClients || 0,
            delta: clientDelta,
            icon: Users,
        },
        {
            name: 'Panier Moyen',
            value: formatPrice(kpis.averageCart || 0),
            delta: avgCartDelta,
            icon: Package,
        }
    ];

    const getHealthColor = (status: string) => {
        switch(status) {
            case 'excellent': return 'text-green-600 bg-green-50 border-green-200';
            case 'good': return 'text-blue-600 bg-blue-50 border-blue-200';
            case 'warning': return 'text-amber-600 bg-amber-50 border-amber-200';
            case 'danger': return 'text-red-600 bg-red-50 border-red-200';
            default: return 'text-encre/60 bg-white border-creme';
        }
    };

    const getHealthMessage = (status: string) => {
        switch(status) {
            case 'excellent': return 'Santé financière excellente. Vos marges sont solides.';
            case 'good': return 'Activité saine. Votre fond de roulement est correct.';
            case 'warning': return 'Attention : Marge faible. Surveillez vos coûts d\'achat.';
            case 'danger': return 'Risque de faillite : Marges insuffisantes pour couvrir les frais.';
            default: return 'Analyse de santé en cours...';
        }
    };

    return (
        <div className="p-4 md:p-8 bg-gradient-to-br from-[#FAF5EF] via-[#F9F4EE] to-[#F5EFEA] min-h-screen">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-serif text-encre mb-1">Tableau de Bord</h1>
                    <p className="text-sm text-encre/60">Bienvenue, {user?.firstName || 'Administrateur'}</p>
                </div>
                <button
                    onClick={() => fetchMetrics(true)}
                    disabled={refreshing}
                    className="px-4 py-2 bg-[#390102] text-[#BFA893] rounded-lg hover:opacity-90 transition-all flex items-center gap-2 disabled:opacity-50 shadow-md border border-[#BFA893]/20"
                >
                    <RefreshCw size={18} className={refreshing ? 'animate-spin' : ''} />
                    {refreshing ? 'Actualisation...' : 'Actualiser'}
                </button>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-center gap-3">
                    <AlertTriangle size={20} />
                    {error}
                </div>
            )}

            {/* Health Indicator */}
            <div className={cn(
                "mb-8 p-4 rounded-xl border flex items-center justify-between shadow-sm",
                getHealthColor(kpis.healthStatus)
            )}>
                <div className="flex items-center gap-4">
                    <div className="p-2 rounded-full bg-white/50">
                        {kpis.healthStatus === 'danger' || kpis.healthStatus === 'warning' ? (
                            <ShieldAlert size={24} />
                        ) : (
                            <Activity size={24} />
                        )}
                    </div>
                    <div>
                        <h4 className="font-bold text-sm uppercase tracking-wider">État du Business</h4>
                        <p className="text-sm opacity-90">{getHealthMessage(kpis.healthStatus)}</p>
                    </div>
                </div>
                <div className="hidden md:flex flex-col items-end">
                    <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Score de Rentabilité</span>
                    <div className="flex items-center gap-1 mt-1">
                        {[1, 2, 3, 4].map((step) => (
                            <div 
                                key={step} 
                                className={cn(
                                    "w-8 h-1.5 rounded-full",
                                    kpis.healthStatus === 'excellent' ? "bg-green-500" :
                                    kpis.healthStatus === 'good' && step <= 3 ? "bg-blue-500" :
                                    kpis.healthStatus === 'warning' && step <= 2 ? "bg-amber-500" :
                                    kpis.healthStatus === 'danger' && step <= 1 ? "bg-red-500" : "bg-black/10"
                                )}
                            />
                        ))}
                    </div>
                </div>
            </div>

            {/* Financial KPI Cards */}
            <h2 className="text-xs font-black uppercase tracking-[0.2em] text-encre/40 mb-4 px-2">Performance & Rentabilité</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {kpisArray.map((kpi: any, idx: number) => (
                    <div
                        key={idx}
                        className="bg-white rounded-2xl border border-creme border-opacity-50 p-6 hover:shadow-xl transition-all duration-300 group cursor-pointer"
                    >
                        <div className="flex items-start justify-between mb-4">
                            <div>
                                <p className="text-[10px] uppercase tracking-widest text-encre/40 font-bold mb-2">
                                    {kpi.name}
                                </p>
                                <p className="text-2xl font-bold text-encre">
                                    {kpi.formattedValue}
                                </p>
                            </div>
                            <div className="p-3 bg-gradient-to-br from-or/10 to-or/5 rounded-lg group-hover:from-or/20 group-hover:to-or/10 transition-all">
                                <kpi.icon size={24} className={cn('transition-all', kpi.color)} />
                            </div>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-[10px] text-encre/40 italic">{kpi.description}</span>
                            {kpi.delta && (
                                <span className={cn("text-xs font-semibold", kpi.delta.startsWith('-') ? "text-red-500" : "text-green-600")}>
                                    {kpi.delta}
                                </span>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Operational KPIs */}
            <h2 className="text-xs font-black uppercase tracking-[0.2em] text-encre/40 mb-4 px-2">Opérations</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {secondaryKpis.map((kpi: any, idx: number) => (
                    <div key={idx} className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-creme2 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-white rounded-lg shadow-sm">
                                <kpi.icon size={18} className="text-encre3" />
                            </div>
                            <div>
                                <p className="text-[10px] uppercase tracking-widest text-encre/40 font-bold">{kpi.name}</p>
                                <p className="text-lg font-bold text-encre">{kpi.value}</p>
                            </div>
                        </div>
                        <span className={cn("text-[10px] font-black", kpi.delta.startsWith('-') ? "text-red-400" : "text-green-500")}>
                            {kpi.delta}
                        </span>
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
                    {revTrend.length > 0 ? (
                        <ResponsiveContainer width="100%" height={300}>
                            <AreaChart data={revTrend}>
                                <defs>
                                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#C5A059" stopOpacity={0.4} />
                                        <stop offset="95%" stopColor="#C5A059" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#E5D4C4" />
                                <XAxis dataKey="name" stroke="#999" fontSize={12} />
                                <YAxis stroke="#999" fontSize={12} tickFormatter={(val) => `${val/1000}k`} />
                                <Tooltip
                                    formatter={(value: any) => formatPrice(value)}
                                    contentStyle={{
                                        backgroundColor: '#FFF',
                                        border: '1px solid #C5A059',
                                        borderRadius: '8px',
                                    }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="revenue"
                                    stroke="#C5A059"
                                    fillOpacity={1}
                                    fill="url(#colorRevenue)"
                                    strokeWidth={3}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    ) : (
                        <p className="text-center text-encre/40 py-12 italic">Aucune donnée de transaction disponible</p>
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
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {charts.productSales.map((_: any, index: number) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={['#8B0000', '#C5A059', '#1A0A0A', '#3B82F6'][index % 4]}
                                        />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    ) : (
                        <p className="text-center text-encre/40 py-12 italic">Aucune vente enregistrée</p>
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
                        <p className="text-center text-encre/40 py-12 italic">Aucune commande disponible</p>
                    )}
                </div>

                {/* Customer Growth */}
                <div className="bg-white rounded-2xl border border-creme border-opacity-50 p-6 hover:shadow-lg transition-all">
                    <h3 className="text-lg font-semibold text-encre mb-6 flex items-center gap-2">
                        <Users size={20} className="text-or" />
                        Croissance Client
                    </h3>
                    {growTrend.length > 0 ? (
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={growTrend}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#E5D4C4" />
                                <XAxis dataKey="month" stroke="#999" fontSize={12} />
                                <YAxis stroke="#999" fontSize={12} />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: '#FFF',
                                        border: '1px solid #C5A059',
                                        borderRadius: '8px',
                                    }}
                                />
                                <Bar dataKey="customers" fill="#8B0000" radius={[8, 8, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    ) : (
                        <p className="text-center text-encre/40 py-12 italic">Pas assez de données de croissance</p>
                    )}
                </div>
            </div>

            {/* Stock Alerts */}
            <div className="bg-white rounded-2xl border border-creme border-opacity-50 p-6 hover:shadow-lg transition-all mb-8">
                <h3 className="text-lg font-semibold text-encre mb-6 flex items-center gap-2">
                    <AlertTriangle size={20} className="text-rouge-deep" />
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
                                    <tr key={product.id} className="border-b border-creme/30 hover:bg-or/2 transition-all group">
                                        <td className="py-3 px-4 text-sm text-encre font-medium">{product.name}</td>
                                        <td className="py-3 px-4 text-sm text-encre/60 font-mono">{product.sku}</td>
                                        <td className="py-3 px-4 text-right text-sm font-bold text-rouge-deep">{product.stock}</td>
                                        <td className="py-3 px-4 text-right">
                                            <Link href={`/admin/produits?edit=${product.id}`} className="text-or hover:text-rouge-deep transition-colors text-xs font-black uppercase tracking-widest">
                                                Ajuster
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p className="text-center text-encre/40 py-8 font-serif italic">Tout est en ordre, le stock est optimal ✓</p>
                )}
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Link href="/admin/commandes" className="bg-white border border-creme2 hover:border-or rounded-2xl p-6 transition-all hover:shadow-xl group">
                    <div className="flex items-center justify-between mb-4">
                        <h4 className="font-semibold text-encre group-hover:text-rouge-deep transition-colors uppercase tracking-widest text-xs">Nouvelle Commande</h4>
                        <div className="p-2 bg-creme rounded-lg group-hover:bg-or/20 transition-colors">
                            <ShoppingCart size={18} className="text-or" />
                        </div>
                    </div>
                    <p className="text-xs text-encre/60 font-medium">Gérer les flux de commandes entrants</p>
                </Link>

                <Link href="/admin/produits" className="bg-white border border-creme2 hover:border-or rounded-2xl p-6 transition-all hover:shadow-xl group">
                    <div className="flex items-center justify-between mb-4">
                        <h4 className="font-semibold text-encre group-hover:text-rouge-deep transition-colors uppercase tracking-widest text-xs">Nouveau Produit</h4>
                        <div className="p-2 bg-creme rounded-lg group-hover:bg-or/20 transition-colors">
                            <Package size={18} className="text-or" />
                        </div>
                    </div>
                    <p className="text-xs text-encre/60 font-medium">Enrichir le catalogue de la boutique</p>
                </Link>


            </div>
        </div>
    );
}
