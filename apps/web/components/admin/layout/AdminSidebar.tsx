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
    const [expandedGroups, setExpandedGroups] = useState({
        principal: true,
        clients: true,
        systeme: true
    });

    const toggleGroup = (group: keyof typeof expandedGroups) => {
        setExpandedGroups(prev => ({ ...prev, [group]: !prev[group] }));
    };

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

    const renderMenuItem = (item: any) => {
        const isActive = pathname.startsWith(item.href);
        const badge = item.name === 'Commandes' ? badges.orders :
            item.name === 'Stock' ? badges.stock : 
            item.name === 'Avis clients' ? badges.reviews : item.badge;

        return (
            <li key={item.name}>
                <Link
                    href={item.href}
                    onClick={onClose}
                    className={cn(
                        "flex items-center justify-between px-4 py-3 rounded-xl text-sm transition-all duration-300 group relative overflow-hidden",
                        isActive
                            ? "bg-[#BFA893] text-[#390102] shadow-lg shadow-black/20"
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
                                    ? "text-[#390102]"
                                    : "text-[#BFA893] focus:text-[#BFA893]"
                            )}
                            strokeWidth={isActive ? 2 : 1.5}
                        />
                        <span className={cn(isActive ? "font-semibold" : "font-normal")}>
                            {item.name}
                        </span>
                    </div>
                    {badge !== null && badge > 0 ? (
                        <span className={cn(
                            "text-[10px] font-bold px-2.5 py-1 rounded-full shadow-lg border relative z-10 animate-pulse",
                            isActive
                                ? "bg-[#390102] text-[#BFA893] border-[#390102]/20"
                                : "bg-[#BFA893] text-[#390102] border-[#BFA893]/20"
                        )}>
                            {badge}
                        </span>
                    ) : (
                        isActive && <ChevronRight size={16} className="text-[#390102] relative z-10" />
                    )}
                </Link>
            </li>
        );
    };

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
                {/* Principal */}
                <div className="mb-4">
                    <button 
                        onClick={() => toggleGroup('principal')}
                        className="w-full flex items-center justify-between px-4 py-2 text-[10px] uppercase tracking-[0.2em] text-[#BFA893] font-black hover:bg-white/5 transition-colors rounded-lg group"
                    >
                        <span>Principal</span>
                        <ChevronRight size={12} className={cn("transition-transform duration-300", expandedGroups.principal && "rotate-90")} />
                    </button>
                    {expandedGroups.principal && (
                        <ul className="mt-2 space-y-1 px-1">
                            {menuItems.slice(0, 4).map(renderMenuItem)}
                        </ul>
                    )}
                </div>

                {/* Clients */}
                <div className="mb-4">
                    <button 
                        onClick={() => toggleGroup('clients')}
                        className="w-full flex items-center justify-between px-4 py-2 text-[10px] uppercase tracking-[0.2em] text-[#BFA893] font-black hover:bg-white/5 transition-colors rounded-lg group"
                    >
                        <span>Clients</span>
                        <ChevronRight size={12} className={cn("transition-transform duration-300", expandedGroups.clients && "rotate-90")} />
                    </button>
                    {expandedGroups.clients && (
                        <ul className="mt-2 space-y-1 px-1">
                            {menuItems.slice(4, 7).map(renderMenuItem)}
                        </ul>
                    )}
                </div>

                {/* Système */}
                <div className="mb-4">
                    <button 
                        onClick={() => toggleGroup('systeme')}
                        className="w-full flex items-center justify-between px-4 py-2 text-[10px] uppercase tracking-[0.2em] text-[#BFA893] font-black hover:bg-white/5 transition-colors rounded-lg group"
                    >
                        <span>Système</span>
                        <ChevronRight size={12} className={cn("transition-transform duration-300", expandedGroups.systeme && "rotate-90")} />
                    </button>
                    {expandedGroups.systeme && (
                        <ul className="mt-2 space-y-1 px-1">
                            {menuItems.slice(7).map(renderMenuItem)}
                        </ul>
                    )}
                </div>
            </nav>
        </aside>
    );
}
