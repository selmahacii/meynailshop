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
    ShieldAlert,
    Calendar,
    ArrowUpRight,
    ArrowDownRight,
    Search,
    Filter,
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
import { motion, AnimatePresence } from 'framer-motion';
import { SHIPPING_RATES } from '@/lib/constants/shipping';

function calculateDelta(current: number, previous: number) {
    if (!previous || previous === 0) return '+0%';
    const delta = ((current - previous) / previous) * 100;
    return (delta >= 0 ? '+' : '') + delta.toFixed(1) + '%';
}

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white/90 backdrop-blur-md border border-or/20 p-4 rounded-xl shadow-2xl">
                <p className="text-[10px] font-black uppercase tracking-widest text-encre/40 mb-2">{label}</p>
                <p className="text-lg font-bold text-rouge-deep">
                    {formatPrice(payload[0].value)}
                </p>
                {payload[1] && (
                    <p className="text-xs text-encre3 mt-1">
                        Volume : {payload[1].value} unités
                    </p>
                )}
            </div>
        );
    }
    return null;
};

export default function AdminDashboard() {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [refreshing, setRefreshing] = useState(false);
    const { user } = useAuthStore();

    useEffect(() => {
        fetchMetrics();

        // Écouteur pour rafraîchir le dashboard quand une commande est modifiée ailleurs
        const handleUpdate = () => fetchMetrics(true);
        window.addEventListener('orderUpdated', handleUpdate);
        return () => window.removeEventListener('orderUpdated', handleUpdate);
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
            <div className="flex items-center justify-center min-h-[80vh] w-full">
                <div className="flex flex-col items-center">
                    <div className="relative w-24 h-24 mb-6">
                        <div className="absolute inset-0 border-4 border-or/20 rounded-full"></div>
                        <div className="absolute inset-0 border-4 border-or border-t-transparent rounded-full animate-spin"></div>
                        <Activity className="absolute inset-0 m-auto text-or w-10 h-10 opacity-30 animate-pulse" />
                    </div>
                    <p className="text-[10px] uppercase font-black tracking-[0.4em] text-encre/40 animate-pulse ml-1">Analyse des flux...</p>
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

    const financialKpis = [
        {
            name: 'Revenus Produits',
            value: formatPrice(kpis.totalRevenue || 0),
            delta: revenueDelta,
            icon: TrendingUp,
            color: 'text-emerald-600',
            bg: 'bg-emerald-500/10',
            desc: 'Net hors livraison'
        },
        {
            name: 'Bénéfice Réel',
            value: formatPrice(kpis.totalProfit || 0),
            delta: null,
            icon: Wallet,
            color: 'text-indigo-600',
            bg: 'bg-indigo-500/10',
            desc: 'Revenu - Coût achat'
        },
        {
            name: 'Marge Moyenne',
            value: `${kpis.profitMargin || 0}%`,
            delta: null,
            icon: Percent,
            color: 'text-or',
            bg: 'bg-or/10',
            desc: 'Rentabilité brute'
        },
        {
            name: 'Immobilisation',
            value: formatPrice(kpis.inventoryValue || 0),
            delta: null,
            icon: Warehouse,
            color: 'text-rouge-brand',
            bg: 'bg-rouge-brand/10',
            desc: 'Valeur du stock actuel'
        }
    ];

    const operationalKpis = [
        { label: 'Commandes', value: kpis.totalOrders || 0, delta: orderDelta, icon: ShoppingCart },
        { label: 'Clients', value: kpis.activeClients || 0, delta: clientDelta, icon: Users },
        { label: 'Panier', value: formatPrice(kpis.averageCart || 0), delta: avgCartDelta, icon: Package },
    ];

    const getHealthStyle = (status: string) => {
        switch(status) {
            case 'excellent': return { color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-200', icon: CheckCircle2, message: 'Performances exceptionnelles. Vos marges sont saines et votre croissance est stable.' };
            case 'good': return { color: 'text-blue-600', bg: 'bg-blue-50 border-blue-200', icon: Activity, message: 'Activité stable. Vos indicateurs de rentabilité sont dans le vert.' };
            case 'warning': return { color: 'text-amber-600', bg: 'bg-amber-50 border-amber-200', icon: AlertTriangle, message: 'Attention : Marge en baisse. Revoyez vos coûts promotionnels ou d\'achat.' };
            case 'danger': return { color: 'text-red-600', bg: 'bg-red-50 border-red-200', icon: ShieldAlert, message: 'Alerte critique : Le business tourne à perte. Action immédiate requise.' };
            default: return { color: 'text-encre/40', bg: 'bg-white border-creme', icon: Activity, message: 'Analyse en cours...' };
        }
    };

    const health = getHealthStyle(kpis.healthStatus);

    return (
        <div className="p-4 sm:p-6 lg:p-10 bg-[#FAF9F6] min-h-screen">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                >
                    <div className="flex items-center gap-3 text-or mb-2">
                        <Calendar size={14} className="opacity-50" />
                        <span className="text-[10px] font-black uppercase tracking-[0.3em]">Mars 2026 • Live</span>
                    </div>
                    <h1 className="text-4xl sm:text-5xl font-serif text-encre">Analytics <span className="text-or">Center</span></h1>
                    <p className="text-sm text-encre/40 mt-2 font-medium">Suivi temps réel des flux de <span className="text-encre3">MEEY Nail Shop</span></p>
                </motion.div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={() => fetchMetrics(true)}
                        disabled={refreshing}
                        className="h-14 px-6 bg-white border border-creme2 rounded-2xl flex items-center gap-3 hover:bg-creme transition-all shadow-sm active:scale-95 disabled:opacity-50"
                    >
                        <RefreshCw size={18} className={cn("text-or", refreshing && "animate-spin")} />
                        <span className="hidden sm:inline text-[10px] font-black uppercase tracking-widest text-encre">Rafraîchir</span>
                    </button>
                    <Link
                        href="/admin/produits/nouveau"
                        className="h-14 px-6 bg-rouge-brand text-creme rounded-2xl flex items-center gap-3 hover:shadow-xl hover:shadow-rouge-brand/20 transition-all shadow-lg active:scale-95"
                    >
                        <Plus size={20} className="text-gold-brand" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Nouveau Produit</span>
                    </Link>
                </div>
            </div>

            {error && (
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-red-50 border border-red-200 p-4 rounded-2xl flex items-center gap-4 text-red-700 mb-8"
                >
                    <AlertTriangle size={24} />
                    <p className="text-sm font-medium">{error}</p>
                </motion.div>
            )}

            {/* Health & Strategy Banner */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn(
                    "relative overflow-hidden mb-10 p-6 sm:p-8 rounded-[2rem] border shadow-sm flex flex-col lg:flex-row items-center justify-between gap-8 transition-all duration-500",
                    health.bg
                )}
            >
                <div className="relative z-10 flex items-center gap-6 text-center lg:text-left flex-col lg:flex-row">
                    <div className="p-4 bg-white/60 backdrop-blur-md rounded-[1.5rem] shadow-sm">
                        <health.icon size={40} className={health.color} strokeWidth={1.5} />
                    </div>
                    <div>
                        <h4 className={cn("text-sm font-black uppercase tracking-[0.2em] mb-2", health.color)}>Santé Stratégique</h4>
                        <p className="text-encre font-medium text-lg leading-snug lg:max-w-2xl">
                            {health.message}
                        </p>
                    </div>
                </div>

                <div className="relative z-10 w-full lg:w-48 bg-white/40 backdrop-blur-md p-6 rounded-[1.5rem] border border-white/50 text-center">
                    <p className="text-[10px] font-black uppercase tracking-widest text-encre/40 mb-3">Score Marge</p>
                    <p className={cn("text-3xl font-serif", health.color)}>{kpis.profitMargin || 0}%</p>
                    <div className="flex justify-center gap-1 mt-3">
                        {[1, 2, 3, 4, 5].map(i => (
                            <div 
                                key={i} 
                                className={cn(
                                    "w-4 h-1 rounded-full bg-encre/10 transition-colors",
                                    i <= (kpis.profitMargin / 8) && "bg-current",
                                    health.color
                                )} 
                            />
                        ))}
                    </div>
                </div>
                
                {/* Background Decor */}
                <div className="absolute right-0 top-0 w-64 h-64 bg-current opacity-[0.03] rounded-full -mr-32 -mt-32"></div>
            </motion.div>

            {/* Financial Grid */}
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-encre/30 mb-6 px-2 flex items-center gap-3">
                <span className="w-8 h-[1px] bg-current opacity-20"></span>
                Performance Financière
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-12">
                {financialKpis.map((kpi, idx) => (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="group bg-white hover:bg-[#FAF9F6] border border-creme2 p-6 rounded-[2rem] transition-all hover:shadow-2xl hover:shadow-black/[0.02] cursor-pointer relative overflow-hidden"
                    >
                        <div className="flex items-start justify-between mb-8">
                            <div className={cn("p-4 rounded-2xl transition-all group-hover:scale-110 shadow-sm", kpi.bg)}>
                                <kpi.icon size={24} className={kpi.color} strokeWidth={1.5} />
                            </div>
                            {kpi.delta && (
                                <div className={cn(
                                    "px-3 py-1 rounded-full text-[10px] font-bold flex items-center gap-1",
                                    kpi.delta.startsWith('+') ? "text-emerald-600 bg-emerald-50" : "text-rose-500 bg-rose-50"
                                )}>
                                    {kpi.delta.startsWith('+') ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                                    {kpi.delta}
                                </div>
                            )}
                        </div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-encre/40 mb-1">{kpi.name}</p>
                        <p className="text-2xl font-bold text-encre mb-4">{kpi.value}</p>
                        <p className="text-[10px] text-encre3 font-medium italic opacity-60">{kpi.desc}</p>
                    </motion.div>
                ))}
            </div>

            {/* Main Content Grid (Charts & Lists) */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mb-12">
                {/* Revenue Trend Area Chart */}
                <div className="xl:col-span-2 bg-white border border-creme2 p-6 sm:p-8 rounded-[2rem] shadow-sm">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-10">
                        <div>
                            <h3 className="text-xl font-serif text-encre">Flux de Trésorerie</h3>
                            <p className="text-[10px] text-encre/40 mt-1 uppercase tracking-widest font-bold font-sans">Revenus Nets des Produits</p>
                        </div>
                        <div className="flex items-center gap-2 p-1.5 bg-creme2/30 rounded-xl overflow-x-auto max-w-full">
                            {['7 Jours', '30 Jours', 'Total'].map((t, i) => (
                                <button key={i} className={cn("whitespace-nowrap px-4 py-2 text-[9px] font-black uppercase tracking-widest rounded-lg transition-all", i === 1 ? "bg-white text-encre shadow-sm" : "text-encre/40 hover:text-encre")}>
                                    {t}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="h-[300px] sm:h-[400px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={revTrend}>
                                <defs>
                                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#C5A059" stopOpacity={0.2} />
                                        <stop offset="95%" stopColor="#C5A059" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" strokeOpacity={0.5} />
                                <XAxis 
                                    dataKey="name" 
                                    axisLine={false} 
                                    tickLine={false} 
                                    tick={{ fill: '#9CA3AF', fontSize: 10, fontWeight: '700' }} 
                                    dy={10}
                                />
                                <YAxis 
                                    axisLine={false} 
                                    tickLine={false} 
                                    tick={{ fill: '#9CA3AF', fontSize: 10, fontWeight: '700' }} 
                                    tickFormatter={(v) => `${v/1000}k`}
                                />
                                <Tooltip content={<CustomTooltip />} />
                                <Area 
                                    type="monotone" 
                                    dataKey="revenue" 
                                    stroke="#C5A059" 
                                    strokeWidth={4} 
                                    fillOpacity={1} 
                                    fill="url(#colorRev)" 
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Status Breakdown (Operational) */}
                <div className="bg-white border border-creme2 p-6 sm:p-8 rounded-[2rem] shadow-sm flex flex-col">
                    <h3 className="text-xl font-serif text-encre mb-8">Opérations</h3>
                    
                    <div className="flex-grow flex flex-col justify-center">
                        <div className="h-[250px] w-full mb-8">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={charts.orderStatusBreakdown}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={65}
                                        outerRadius={90}
                                        paddingAngle={10}
                                        dataKey="value"
                                    >
                                        {charts.orderStatusBreakdown?.map((entry: any, index: number) => (
                                            <Cell 
                                                key={`cell-${index}`} 
                                                fill={['#C5A059', '#3D1414', '#10B981', '#F59E0B', '#6366F1'][index % 5]} 
                                                className="hover:opacity-80 transition-opacity stroke-white stroke-2 outline-none"
                                            />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            {charts.orderStatusBreakdown?.slice(0, 4).map((s: any, i: number) => (
                                <div key={i} className="flex items-center gap-3 p-3 bg-[#FAF9F6] rounded-xl border border-creme2/50">
                                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: ['#C5A059', '#3D1414', '#10B981', '#F59E0B'][i % 4] }}></div>
                                    <div className="min-w-0">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-encre/40 truncate">{s.name}</p>
                                        <p className="text-xs font-bold text-encre">{s.value}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Middle Bar: Secondary Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                {operationalKpis.map((kpi, idx) => (
                    <div key={idx} className="bg-white border border-creme2 p-6 rounded-2xl flex items-center justify-between group hover:border-or transition-all shadow-sm">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-creme2/30 rounded-xl group-hover:text-or transition-colors">
                                <kpi.icon size={20} className="text-encre3" />
                            </div>
                            <div>
                                <p className="text-[9px] font-black uppercase tracking-widest text-encre/40">{kpi.label}</p>
                                <p className="text-xl font-bold text-encre">{kpi.value}</p>
                            </div>
                        </div>
                        {kpi.delta && (
                            <span className={cn(
                                "text-[10px] font-black px-2 py-1 rounded-lg",
                                kpi.delta.startsWith('+') ? "text-emerald-600 bg-emerald-50" : "text-rose-500 bg-rose-50"
                            )}>
                                {kpi.delta}
                            </span>
                        )}
                    </div>
                ))}
            </div>

            {/* Bottom Row - Alerts & Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Critical Inventory */}
                <div className="bg-white border border-creme2 p-6 sm:p-8 rounded-[2rem] shadow-sm">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-xl font-serif text-encre text-rouge-brand">Stocks Critiques</h3>
                            <p className="text-[10px] text-encre/40 font-black uppercase tracking-widest mt-1">Réapprovisionnement Urgent</p>
                        </div>
                        <div className="p-2 bg-rose-50 rounded-lg">
                            <AlertTriangle className="text-rose-500 animate-pulse" size={24} />
                        </div>
                    </div>

                    <div className="space-y-4">
                        {alerts?.lowStockProducts && alerts.lowStockProducts.length > 0 ? (
                            alerts.lowStockProducts.slice(0, 5).map((p: any) => (
                                <div key={p.id} className="flex items-center justify-between p-4 bg-[#FAF9F6] border border-creme2/50 rounded-2xl group hover:border-rouge-brand/30 transition-all">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center font-bold text-rouge-brand border border-creme2 shadow-sm">
                                            {p.stock}
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-encre">{p.name}</p>
                                            <p className="text-[10px] font-mono text-encre3 opacity-60 uppercase">{p.sku}</p>
                                        </div>
                                    </div>
                                    <Link 
                                        href={`/admin/produits?edit=${p.id}`}
                                        className="p-2 hover:bg-white rounded-lg transition-colors group-hover:text-rouge-brand"
                                    >
                                        <ArrowUpRight size={20} />
                                    </Link>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-12 border-2 border-dashed border-creme2 rounded-2xl">
                                <CheckCircle2 className="mx-auto text-emerald-500 mb-3 opacity-30" size={32} />
                                <p className="text-sm text-encre/40 font-medium font-serif italic">Tous vos stocks sont sains.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Wilaya Distribution Chart */}
                <div className="bg-white border border-creme2 p-6 sm:p-8 rounded-[2rem] shadow-sm flex flex-col">
                    <h3 className="text-xl font-serif text-encre mb-8">Top Destinations</h3>
                    
                    <div className="space-y-6 flex-grow">
                        {charts.wilayaDistribution?.slice(0, 4).map((w: any, i: number) => (
                            <div key={i} className="space-y-2">
                                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-encre/60">
                                    <span>{SHIPPING_RATES.find(r => r.id === w.wilaya)?.name || w.wilaya}</span>
                                    <span>{w.percent}%</span>
                                </div>
                                <div className="h-2 w-full bg-[#FAF9F6] rounded-full overflow-hidden">
                                    <motion.div 
                                        initial={{ width: 0 }}
                                        whileInView={{ width: `${w.percent}%` }}
                                        transition={{ duration: 1, ease: 'easeOut' }}
                                        className="h-full bg-or rounded-full"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>

                    <Link href="/admin/commandes" className="w-full mt-10 py-4 border-2 border-dashed border-creme2 rounded-2xl text-[10px] font-black uppercase tracking-widest text-encre/40 hover:border-or hover:text-or transition-all text-center">
                        Voir les détails logistiques
                    </Link>
                </div>
            </div>
        </div>
    );
}
