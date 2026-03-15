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
    X,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';

const menuItems = [
    { name: 'Tableau de bord', href: '/admin/dashboard', icon: LayoutDashboard, badge: null },
    { name: 'Commandes', href: '/admin/commandes', icon: ShoppingCart, badge: 0 },
    { name: 'Produits', href: '/admin/produits', icon: Package, badge: null },
    { name: 'Collections', href: '/admin/categories', icon: Tag, badge: null },
    { name: 'Stock', href: '/admin/stock', icon: Box, badge: 0 },
    { name: 'Clients', href: '/admin/clients', icon: Users, badge: null },
    { name: 'Avis clients', href: '/admin/avis', icon: MessageSquare, badge: 0 },
    { name: 'Historique', href: '/admin/historique', icon: Layers, badge: null },
    { name: 'Paramètres', href: '/admin/parametres', icon: Settings, badge: null },
];

import { OrdersAPI, ProductsAPI } from '@/lib/api/client';

export default function AdminSidebar({ onClose }: { onClose?: () => void }) {
    const pathname = usePathname();
    const [badges, setBadges] = useState<Record<string, number>>({});
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchBadges = async () => {
            try {
                const ordersRes = await OrdersAPI.getStats();
                const productsRes = await ProductsAPI.getLowStock();

                setBadges({
                    orders: ordersRes?.data?.pending || 0,
                    stock: productsRes?.data?.total || productsRes?.data?.items?.length || 0,
                    reviews: ordersRes?.data?.pendingReviews || 0,
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
        <aside className="w-64 bg-rouge-brand border-r border-gold-brand/10 h-screen flex flex-col shadow-2xl relative">
            {/* Header */}
            <div className="p-6 border-b border-gold-brand/10 flex items-center justify-between group">
                <div className="flex items-center space-x-3">
                    <div className="relative w-10 h-10 border border-gold-brand/20 rounded-full p-0.5 group-hover:border-gold-brand/40 transition-all duration-300 shadow-lg shadow-black/20 overflow-hidden">
                        <Image
                            src="/logo2.png"
                            alt="MEEY Logo"
                            fill
                            className="object-contain rounded-full"
                        />
                    </div>
                    <div className="flex flex-col">
                        <span className="font-serif text-lg text-[#BFA893] leading-none tracking-wide uppercase transition-all duration-300">MEEY</span>
                        <span className="text-[9px] uppercase tracking-[0.3em] text-[#BFA893] font-bold mt-1.5">Mission Control</span>
                    </div>
                </div>

                {/* Close button for mobile */}
                <button
                    onClick={onClose}
                    className="lg:hidden p-2 text-[#BFA893] hover:opacity-80 transition-opacity"
                >
                    <X size={20} />
                </button>
            </div>

            {/* Navigation */}
            <nav className="flex-grow overflow-y-auto px-3 py-6 scrollbar-thin scrollbar-thumb-gold-brand/30 scrollbar-track-transparent hover:scrollbar-thumb-gold-brand/50 transition-colors duration-300">
                <div className="mb-6 px-4">
                    <h3 className="text-[10px] uppercase tracking-[0.2em] text-[#BFA893] font-bold mb-4">Principal</h3>
                    <ul className="space-y-1">
                        {menuItems.slice(0, 4).map((item) => {
                            const isActive = pathname.startsWith(item.href);
                            const badge = item.name === 'Commandes' ? badges.orders :
                                item.name === 'Stock' ? badges.stock : item.badge;

                            return (
                                <li key={item.name}>
                                    <Link
                                        href={item.href}
                                        onClick={onClose}
                                        className={cn(
                                            "flex items-center justify-between px-4 py-3 rounded-xl text-sm transition-all duration-300 group relative overflow-hidden",
                                            isActive
                                                ? "bg-[#BFA893]/10 text-[#BFA893] border border-[#BFA893]/30 shadow-lg shadow-[#BFA893]/5"
                                                : "text-[#BFA893] hover:bg-white/5 border border-transparent hover:border-[#BFA893]/20"
                                        )}
                                    >
                                        {isActive && (
                                            <div className="absolute left-0 top-0 w-1 h-full bg-[#BFA893] rounded-r-full shadow-lg shadow-[#BFA893]/50" />
                                        )}
                                        <div className="flex items-center gap-3 relative z-10">
                                            <item.icon
                                                size={18}
                                                className={cn(
                                                    "transition-all duration-300",
                                                    isActive
                                                        ? "text-[#BFA893] drop-shadow-lg"
                                                        : "text-[#BFA893] group-hover:text-[#BFA893] focus:text-[#BFA893]"
                                                )}
                                                strokeWidth={isActive ? 2 : 1.5}
                                            />
                                            <span className={cn(isActive ? "font-semibold" : "font-normal")}>
                                                {item.name}
                                            </span>
                                        </div>
                                        {badge !== null && badge > 0 ? (
                                            <span className="bg-[#BFA893] text-rouge-brand text-[10px] font-bold px-2.5 py-1 rounded-full shadow-lg border border-[#BFA893]/20 relative z-10 animate-pulse">
                                                {badge}
                                            </span>
                                        ) : (
                                            isActive && <ChevronRight size={16} className="text-[#BFA893] relative z-10" />
                                        )}
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </div>

                <div className="mb-6 px-4">
                    <h3 className="text-[10px] uppercase tracking-[0.2em] text-[#BFA893] font-bold mb-4">Clients</h3>
                    <ul className="space-y-1">
                        {menuItems.slice(4, 7).map((item) => {
                            const isActive = pathname.startsWith(item.href);
                            const badge = item.name === 'Avis clients' ? badges.reviews : item.badge;

                            return (
                                <li key={item.name}>
                                    <Link
                                        href={item.href}
                                        onClick={onClose}
                                        className={cn(
                                            "flex items-center justify-between px-4 py-3 rounded-xl text-sm transition-all duration-300 group relative overflow-hidden",
                                            isActive
                                                ? "bg-[#BFA893]/10 text-[#BFA893] border border-[#BFA893]/30 shadow-lg shadow-[#BFA893]/5"
                                                : "text-[#BFA893] hover:bg-white/5 border border-transparent hover:border-[#BFA893]/20"
                                        )}
                                    >
                                        {isActive && (
                                            <div className="absolute left-0 top-0 w-1 h-full bg-[#BFA893] rounded-r-full shadow-lg shadow-[#BFA893]/50" />
                                        )}
                                        <div className="flex items-center gap-3 relative z-10">
                                            <item.icon
                                                size={18}
                                                className={cn(
                                                    "transition-all duration-300",
                                                    isActive
                                                        ? "text-[#BFA893] drop-shadow-lg"
                                                        : "text-[#BFA893] group-hover:text-[#BFA893]"
                                                )}
                                                strokeWidth={isActive ? 2 : 1.5}
                                            />
                                            <span>{item.name}</span>
                                        </div>
                                        {badge !== null && badge > 0 && (
                                            <span className="bg-[#BFA893] text-rouge-brand text-[10px] font-bold px-2.5 py-1 rounded-full shadow-lg border border-[#BFA893]/20 relative z-10">
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
                    <h3 className="text-[10px] uppercase tracking-[0.2em] text-[#BFA893] font-bold mb-4">Système</h3>
                    <ul className="space-y-1">
                        {menuItems.slice(7).map((item) => {
                            const isActive = pathname.startsWith(item.href);
                            return (
                                <li key={item.name}>
                                    <Link
                                        href={item.href}
                                        onClick={onClose}
                                        className={cn(
                                            "flex items-center justify-between px-4 py-3 rounded-xl text-sm transition-all duration-300 group relative overflow-hidden",
                                            isActive
                                                ? "bg-[#BFA893]/15 text-[#BFA893] border border-[#BFA893]/40 shadow-lg shadow-[#BFA893]/5"
                                                : "text-[#BFA893] hover:bg-white/5 border border-transparent hover:border-[#BFA893]/20"
                                        )}
                                    >
                                        {isActive && (
                                            <div className="absolute left-0 top-0 w-1 h-full bg-[#BFA893] rounded-r-full shadow-lg shadow-[#BFA893]/50" />
                                        )}
                                        <div className="flex items-center gap-3 relative z-10">
                                            <item.icon
                                                size={18}
                                                className={cn(
                                                    "transition-all duration-300",
                                                    isActive
                                                        ? "text-[#BFA893] drop-shadow-lg"
                                                        : "text-[#BFA893] group-hover:text-[#BFA893]"
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
        </aside>
    );
}
