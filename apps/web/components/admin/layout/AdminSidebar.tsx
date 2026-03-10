'use client';

import Link from 'next/link';
import Image from "next/image";
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    Package,
    ShoppingCart,
    Users,
    BarChart3,
    Settings,
    Tag,
    MessageSquare,
    Box,
    Layers,
    ChevronRight,
    Zap,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';

const menuItems = [
    { name: 'Tableau de bord', href: '/admin/dashboard', icon: LayoutDashboard, badge: null },
    { name: 'Commandes', href: '/admin/commandes', icon: ShoppingCart, badge: 0 },
    { name: 'Produits', href: '/admin/produits', icon: Package, badge: null },
    { name: 'Stock', href: '/admin/stock', icon: Box, badge: 0 },
    { name: 'Clients', href: '/admin/clients', icon: Users, badge: null },
    { name: 'Avis clients', href: '/admin/avis', icon: MessageSquare, badge: 0 },
    { name: 'Historique', href: '/admin/historique', icon: Layers, badge: null },
    { name: 'Analytiques', href: '/admin/analytiques', icon: BarChart3, badge: null },
    { name: 'Paramètres', href: '/admin/parametres', icon: Settings, badge: null },
];

export default function AdminSidebar() {
    const pathname = usePathname();
    const [badges, setBadges] = useState<Record<string, number>>({});
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchBadges = async () => {
            try {
                const ordersRes = await fetch('/api/v1/admin/orders/stats');
                const ordersData = await ordersRes.json();
                
                const productsRes = await fetch('/api/v1/admin/products/low-stock');
                const productsData = await productsRes.json();

                setBadges({
                    orders: ordersData?.data?.pending || 0,
                    stock: productsData?.data?.length || 0,
                    reviews: ordersData?.data?.pendingReviews || 0,
                });
            } catch (error) {
                console.error('Error fetching badges:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchBadges();
    }, []);

    return (
        <aside className="w-64 bg-gradient-to-b from-[#1A0A0A] to-[#0F0505] border-r border-[#2A1A1A] h-screen fixed left-0 top-0 z-50 flex flex-col shadow-2xl">
            {/* Header */}
            <div className="p-6 border-b border-[#2A1A1A] flex items-center space-x-3 group hover:border-or/20 transition-all duration-300">
                <div >
 <Image
  src="/logo.png"
  alt="Logo"
  width={50}
  height={50}
/>
</div>
                <div className="flex flex-col">
                    <span className="font-serif text-lg text-creme leading-none tracking-wide group-hover:text-or transition-colors duration-300">MEEaY</span>
                    <span className="text-[9px] uppercase tracking-[0.3em] text-or/60 font-bold mt-1.5 group-hover:text-or transition-colors duration-300">Dashboard</span>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-grow overflow-y-auto px-3 py-6 scrollbar-thin scrollbar-thumb-or/30 scrollbar-track-transparent hover:scrollbar-thumb-or/50 transition-colors duration-300">
                <div className="mb-6 px-4">
                    <h3 className="text-[10px] uppercase tracking-[0.2em] text-creme/30 font-bold mb-4">Principal</h3>
                    <ul className="space-y-1">
                        {menuItems.slice(0, 4).map((item) => {
                            const isActive = pathname.startsWith(item.href);
                            const badge = item.name === 'Commandes' ? badges.orders : 
                                         item.name === 'Stock' ? badges.stock : item.badge;
                            
                            return (
                                <li key={item.name}>
                                    <Link
                                        href={item.href}
                                        className={cn(
                                            "flex items-center justify-between px-4 py-3 rounded-xl text-sm transition-all duration-300 group relative overflow-hidden",
                                            isActive
                                                ? "bg-gradient-to-r from-or/20 to-transparent text-or border border-or/30 shadow-lg shadow-or/10"
                                                : "text-creme/60 hover:text-creme hover:bg-white/5 border border-transparent hover:border-or/20"
                                        )}
                                    >
                                        {isActive && (
                                            <div className="absolute left-0 top-0 w-1 h-full bg-gradient-to-b from-or to-or/50 rounded-r-full shadow-lg shadow-or/50" />
                                        )}
                                        <div className="flex items-center gap-3 relative z-10">
                                            <item.icon 
                                                size={18} 
                                                className={cn(
                                                    "transition-all duration-300",
                                                    isActive 
                                                        ? "text-or drop-shadow-lg" 
                                                        : "text-creme/40 group-hover:text-or"
                                                )} 
                                                strokeWidth={isActive ? 2 : 1.5} 
                                            />
                                            <span className={cn(isActive ? "font-semibold" : "font-normal")}>
                                                {item.name}
                                            </span>
                                        </div>
                                        {badge !== null && badge > 0 ? (
                                            <span className="bg-gradient-to-r from-rouge-mid to-rouge-deep text-creme text-[10px] font-bold px-2.5 py-1 rounded-full shadow-lg border border-rouge-deep/50 relative z-10 animate-pulse">
                                                {badge}
                                            </span>
                                        ) : (
                                            isActive && <ChevronRight size={16} className="text-or/70 relative z-10" />
                                        )}
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </div>

                <div className="mb-6 px-4">
                    <h3 className="text-[10px] uppercase tracking-[0.2em] text-creme/30 font-bold mb-4">Clients</h3>
                    <ul className="space-y-1">
                        {menuItems.slice(4, 7).map((item) => {
                            const isActive = pathname.startsWith(item.href);
                            const badge = item.name === 'Avis clients' ? badges.reviews : item.badge;
                            
                            return (
                                <li key={item.name}>
                                    <Link
                                        href={item.href}
                                        className={cn(
                                            "flex items-center justify-between px-4 py-3 rounded-xl text-sm transition-all duration-300 group relative overflow-hidden",
                                            isActive
                                                ? "bg-gradient-to-r from-or/20 to-transparent text-or border border-or/30 shadow-lg shadow-or/10"
                                                : "text-creme/60 hover:text-creme hover:bg-white/5 border border-transparent hover:border-or/20"
                                        )}
                                    >
                                        {isActive && (
                                            <div className="absolute left-0 top-0 w-1 h-full bg-gradient-to-b from-or to-or/50 rounded-r-full shadow-lg shadow-or/50" />
                                        )}
                                        <div className="flex items-center gap-3 relative z-10">
                                            <item.icon 
                                                size={18} 
                                                className={cn(
                                                    "transition-all duration-300",
                                                    isActive 
                                                        ? "text-or drop-shadow-lg" 
                                                        : "text-creme/40 group-hover:text-or"
                                                )} 
                                                strokeWidth={isActive ? 2 : 1.5} 
                                            />
                                            <span>{item.name}</span>
                                        </div>
                                        {badge !== null && badge > 0 && (
                                            <span className="bg-gradient-to-r from-rouge-mid to-rouge-deep text-creme text-[10px] font-bold px-2.5 py-1 rounded-full shadow-lg border border-rouge-deep/50 relative z-10">
                                                {badge}
                                            </span>
                                        )}
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </div>

                <div className="px-4">
                    <h3 className="text-[10px] uppercase tracking-[0.2em] text-creme/30 font-bold mb-4">Système</h3>
                    <ul className="space-y-1">
                        {menuItems.slice(7).map((item) => {
                            const isActive = pathname.startsWith(item.href);
                            return (
                                <li key={item.name}>
                                    <Link
                                        href={item.href}
                                        className={cn(
                                            "flex items-center justify-between px-4 py-3 rounded-xl text-sm transition-all duration-300 group relative overflow-hidden",
                                            isActive
                                                ? "bg-gradient-to-r from-or/20 to-transparent text-or border border-or/30 shadow-lg shadow-or/10"
                                                : "text-creme/60 hover:text-creme hover:bg-white/5 border border-transparent hover:border-or/20"
                                        )}
                                    >
                                        {isActive && (
                                            <div className="absolute left-0 top-0 w-1 h-full bg-gradient-to-b from-or to-or/50 rounded-r-full shadow-lg shadow-or/50" />
                                        )}
                                        <div className="flex items-center gap-3 relative z-10">
                                            <item.icon 
                                                size={18} 
                                                className={cn(
                                                    "transition-all duration-300",
                                                    isActive 
                                                        ? "text-or drop-shadow-lg" 
                                                        : "text-creme/40 group-hover:text-or"
                                                )} 
                                                strokeWidth={isActive ? 2 : 1.5} 
                                            />
                                            <span>{item.name}</span>
                                        </div>
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            </nav>

            {/* Footer Info */}
            
        </aside>
    );
}
