'use client';

import { TrendingUp, Package, Users, DollarSign } from 'lucide-react';
import { Skeleton } from '@/components/ui/Skeleton';
import { formatPrice } from '@/lib/utils/currency';

interface KpiCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  loading?: boolean;
}

function KpiCard({ title, value, icon, trend, loading }: KpiCardProps) {
  if (loading) {
    return (
      <div className="bg-white rounded-lg border-2 border-creme2 p-6">
        <Skeleton className="h-8 w-24 mb-4" />
        <Skeleton className="h-10 w-16" />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border-2 border-creme2 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-outfit font-semibold text-encre3 text-sm">{title}</h3>
        <div className="text-or">{icon}</div>
      </div>

      <div className="space-y-2">
        <p className="text-3xl font-serif font-bold text-encre">{value}</p>
        {trend && (
          <p className={`text-sm font-outfit ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
            {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}% par rapport au mois dernier
          </p>
        )}
      </div>
    </div>
  );
}

interface AdminKpisProps {
  totalRevenue?: number;
  totalOrders?: number;
  totalCustomers?: number;
  totalProducts?: number;
  trends?: {
    revenue?: number;
    orders?: number;
    customers?: number;
    products?: number;
  };
  loading?: boolean;
}

export function AdminKpis({
  totalRevenue = 0,
  totalOrders = 0,
  totalCustomers = 0,
  totalProducts = 0,
  trends = {},
  loading = false,
}: AdminKpisProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <KpiCard
        title="Revenus Totaux"
        value={formatPrice(totalRevenue)}
        icon={<DollarSign className="w-6 h-6" />}
        trend={trends.revenue ? { value: trends.revenue, isPositive: trends.revenue > 0 } : undefined}
        loading={loading}
      />

      <KpiCard
        title="Commandes"
        value={totalOrders}
        icon={<Package className="w-6 h-6" />}
        trend={trends.orders ? { value: trends.orders, isPositive: trends.orders > 0 } : undefined}
        loading={loading}
      />

      <KpiCard
        title="Clients"
        value={totalCustomers}
        icon={<Users className="w-6 h-6" />}
        trend={trends.customers ? { value: trends.customers, isPositive: trends.customers > 0 } : undefined}
        loading={loading}
      />

      <KpiCard
        title="Produits"
        value={totalProducts}
        icon={<TrendingUp className="w-6 h-6" />}
        trend={trends.products ? { value: trends.products, isPositive: trends.products > 0 } : undefined}
        loading={loading}
      />
    </div>
  );
}
