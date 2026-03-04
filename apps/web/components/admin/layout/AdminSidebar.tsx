'use client';

import Link from 'next/link';
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
    LogOut
} from 'lucide-react';
import { cn } from '@/lib/utils';

const menuItems = [
    { name: 'Tableau de bord', href: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Commandes', href: '/admin/commandes', icon: ShoppingCart, badge: 8 },
    { name: 'Produits', href: '/admin/produits', icon: Package },
    { name: 'Stock', href: '/admin/stock', icon: Box, badge: 3 },
    { name: 'Clients', href: '/admin/clients', icon: Users },
    { name: 'Avis clients', href: '/admin/avis', icon: MessageSquare, badge: 12 },
    { name: 'Historique', href: '/admin/historique', icon: Layers },
    { name: 'Analytiques', href: '/admin/analytiques', icon: BarChart3 },
    { name: 'Paramètres', href: '/admin/parametres', icon: Settings },
];

export default function AdminSidebar() {
    const pathname = usePathname();

    return (
        <aside className="w-64 bg-[#1A0A0A] border-r border-[#2A1A1A] h-screen fixed left-0 top-0 z-50 flex flex-col shadow-2xl">
            <div className="p-8 border-b border-[#2A1A1A] flex items-center space-x-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-rouge-deep to-rouge-mid flex items-center justify-center text-creme font-serif text-xl border border-or/20">
                    M
                </div>
                <div className="flex flex-col">
                    <span className="font-serif text-lg text-creme leading-none tracking-wide">MEEY</span>
                    <span className="text-[9px] uppercase tracking-[0.3em] text-or/60 font-bold mt-1">Super Admin</span>
                </div>
            </div>

            <nav className="flex-grow py-8 overflow-y-auto custom-scrollbar px-4">
                <div className="mb-4 px-4 text-[10px] uppercase tracking-[0.2em] text-creme/30 font-bold">Principal</div>
                <ul className="space-y-1.5 mb-8">
                    {menuItems.slice(0, 4).map((item) => {
                        const isActive = pathname.startsWith(item.href);
                        return (
                            <li key={item.name}>
                                <Link
                                    href={item.href}
                                    className={cn(
                                        "flex items-center justify-between px-4 py-3 rounded-md text-sm transition-all duration-300 group relative",
                                        isActive
                                            ? "bg-white/5 text-or shadow-inner"
                                            : "text-creme/50 hover:text-creme hover:bg-white/5"
                                    )}
                                >
                                    {isActive && <div className="absolute left-0 w-1 h-6 bg-or rounded-r-full" />}
                                    <div className="flex items-center">
                                        <item.icon size={18} className={cn("mr-3", isActive ? "text-or" : "text-creme/30 group-hover:text-or")} strokeWidth={isActive ? 2 : 1.5} />
                                        <span className={cn(isActive ? "font-semibold" : "font-normal")}>{item.name}</span>
                                    </div>
                                    {item.badge ? (
                                        <span className="bg-rouge-deep text-creme text-[10px] font-bold px-2 py-0.5 rounded-full shadow-lg border border-white/10">
                                            {item.badge}
                                        </span>
                                    ) : (
                                        isActive && <ChevronRight size={14} className="text-or/50" />
                                    )}
                                </Link>
                            </li>
                        );
                    })}
                </ul>

                <div className="mb-4 px-4 text-[10px] uppercase tracking-[0.2em] text-creme/30 font-bold">Clients</div>
                <ul className="space-y-1.5 mb-8">
                    {menuItems.slice(4, 7).map((item) => {
                        const isActive = pathname.startsWith(item.href);
                        return (
                            <li key={item.name}>
                                <Link
                                    href={item.href}
                                    className={cn(
                                        "flex items-center justify-between px-4 py-3 rounded-md text-sm transition-all duration-300 group relative",
                                        isActive ? "bg-white/5 text-or" : "text-creme/50 hover:text-creme hover:bg-white/5"
                                    )}
                                >
                                    <div className="flex items-center">
                                        <item.icon size={18} className={cn("mr-3", isActive ? "text-or" : "text-creme/30 group-hover:text-or")} strokeWidth={1.5} />
                                        <span>{item.name}</span>
                                    </div>
                                    {item.badge && (
                                        <span className="bg-rouge-deep text-creme text-[10px] font-bold px-2 py-0.5 rounded-full shadow-lg border border-white/10">
                                            {item.badge}
                                        </span>
                                    )}
                                </Link>
                            </li>
                        );
                    })}
                </ul>

                <div className="mb-4 px-4 text-[10px] uppercase tracking-[0.2em] text-creme/30 font-bold">Outils</div>
                <ul className="space-y-1.5">
                    {menuItems.slice(7).map((item) => {
                        const isActive = pathname.startsWith(item.href);
                        return (
                            <li key={item.name}>
                                <Link
                                    href={item.href}
                                    className={cn(
                                        "flex items-center justify-between px-4 py-3 rounded-md text-sm transition-all duration-300 group relative",
                                        isActive ? "bg-white/5 text-or" : "text-creme/50 hover:text-creme hover:bg-white/5"
                                    )}
                                >
                                    <div className="flex items-center">
                                        <item.icon size={18} className={cn("mr-3", isActive ? "text-or" : "text-creme/30 group-hover:text-or")} strokeWidth={1.5} />
                                        <span>{item.name}</span>
                                    </div>
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </nav>

            <div className="p-6 border-t border-[#2A1A1A] mt-auto">
                <button className="flex items-center w-full px-4 py-3 rounded-md text-sm font-medium text-creme/40 hover:text-rouge-mid hover:bg-rouge-mid/10 transition-all group">
                    <LogOut size={18} className="mr-3 text-creme/40 group-hover:text-rouge-mid" />
                    Déconnexion
                </button>
            </div>
        </aside>
    );
}
