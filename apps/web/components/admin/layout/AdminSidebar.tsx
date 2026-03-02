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
    { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Commandes', href: '/admin/commandes', icon: ShoppingCart },
    { name: 'Produits', href: '/admin/produits', icon: Package },
    { name: 'Catégories', href: '/admin/categories', icon: Layers },
    { name: 'Clients', href: '/admin/clients', icon: Users },
    { name: 'Avis Clients', href: '/admin/avis', icon: MessageSquare },
    { name: 'Stock', href: '/admin/stock', icon: Box },
    { name: 'Coupons', href: '/admin/coupons', icon: Tag },
    { name: 'Analytiques', href: '/admin/analytiques', icon: BarChart3 },
    { name: 'Paramètres', href: '/admin/parametres', icon: Settings },
];

export default function AdminSidebar() {
    const pathname = usePathname();

    return (
        <aside className="w-64 bg-encre border-r border-encre2 h-screen fixed left-0 top-0 z-50 flex flex-col">
            <div className="p-6 border-b border-encre2">
                <div className="flex flex-col">
                    <span className="font-serif text-2xl text-or leading-none">MEEY</span>
                    <span className="text-[10px] uppercase tracking-[0.4em] text-creme/40">Administration</span>
                </div>
            </div>

            <nav className="flex-grow py-6 overflow-y-auto custom-scrollbar">
                <ul className="space-y-1 px-3">
                    {menuItems.map((item) => {
                        const isActive = pathname.startsWith(item.href);
                        return (
                            <li key={item.name}>
                                <Link
                                    href={item.href}
                                    className={cn(
                                        "flex items-center justify-between px-4 py-3 rounded-sm text-sm font-medium transition-all group",
                                        isActive
                                            ? "bg-rouge-mid text-creme"
                                            : "text-creme/60 hover:bg-encre2 hover:text-or"
                                    )}
                                >
                                    <div className="flex items-center">
                                        <item.icon size={18} className={cn("mr-3", isActive ? "text-or" : "text-creme/40 group-hover:text-or")} />
                                        {item.name}
                                    </div>
                                    {isActive && <ChevronRight size={14} className="text-or" />}
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </nav>

            <div className="p-4 border-t border-encre2">
                <button className="flex items-center w-full px-4 py-3 text-sm font-medium text-creme/60 hover:text-rouge-mid transition-colors group">
                    <LogOut size={18} className="mr-3 text-creme/40 group-hover:text-rouge-mid" />
                    Déconnexion
                </button>
            </div>
        </aside>
    );
}
