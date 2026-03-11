'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { User, ShoppingBag, MapPin, Heart, LogOut, LayoutDashboard } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/authStore';

const menuItems = [
    { name: 'Mon Profil', href: '/compte', icon: User },
    { name: 'Mes Commandes', href: '/compte/commandes', icon: ShoppingBag },
    { name: 'Carnet d\'adresses', href: '/compte/adresses', icon: MapPin },
    { name: 'Favoris', href: '/compte/favoris', icon: Heart },
];

export default function AccountLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const router = useRouter();
    const { user, logout } = useAuthStore();

    const handleLogout = () => {
        logout();
        toast.success('Déconnexion réussie');
        router.push('/connexion');
    };

    return (
        <div className="pt-32 pb-24 min-h-screen bg-creme">
            <div className="container mx-auto px-4 max-w-6xl">
                <h1 className="font-serif text-3xl md:text-4xl text-encre mb-10">Mon Espace Client</h1>

                <div className="flex flex-col lg:flex-row gap-12">
                    {/* Sidebar */}
                    <aside className="w-full lg:w-64 shrink-0">
                        <div className="bg-white border border-creme2 p-6 shadow-sm sticky top-32">
                            {/* User Info */}
                            <div className="flex items-center space-x-4 mb-8 pb-8 border-b border-creme2">
                                <div className="w-14 h-14 bg-encre2 rounded-full flex items-center justify-center text-or font-serif text-xl">
                                    {user?.firstName?.charAt(0) || 'U'}{user?.lastName?.charAt(0) || ''}
                                </div>
                                <div>
                                    <p className="font-bold text-encre">{user?.firstName} {user?.lastName}</p>
                                    <p className="text-xs text-encre3">{user?.email}</p>
                                </div>
                            </div>

                            {/* Navigation */}
                            <nav className="space-y-2">
                                {user?.role === 'admin' && (
                                    <Link
                                        href="/admin/dashboard"
                                        className="flex items-center px-4 py-3 rounded-sm text-sm font-bold text-or hover:bg-or/5 border-l-2 border-or transition-all mb-4"
                                    >
                                        <LayoutDashboard size={18} className="mr-3" />
                                        Admin Dashboard
                                    </Link>
                                )}

                                {menuItems.map((item) => {
                                    // Ensure exact match for root '/compte', while allowing nesting for others if needed.
                                    const isActive = item.href === '/compte' ? pathname === '/compte' : pathname.startsWith(item.href);

                                    return (
                                        <Link
                                            key={item.name}
                                            href={item.href}
                                            className={cn(
                                                "flex items-center px-4 py-3 rounded-sm text-sm font-semibold transition-all group",
                                                isActive
                                                    ? "bg-or/10 text-or border-l-2 border-or"
                                                    : "text-encre hover:bg-creme2 hover:text-rouge-mid border-l-2 border-transparent"
                                            )}
                                        >
                                            <item.icon size={18} className={cn("mr-3", isActive ? "text-or" : "text-encre3 group-hover:text-rouge-mid")} />
                                            {item.name}
                                        </Link>
                                    );
                                })}

                                <button
                                    onClick={handleLogout}
                                    className="w-full flex items-center px-4 py-3 rounded-sm text-sm font-semibold text-rouge hover:bg-rouge/5 border-l-2 border-transparent transition-all mt-4 pt-4 border-t border-creme2"
                                >
                                    <LogOut size={18} className="mr-3 text-rouge/70" />
                                    Déconnexion
                                </button>
                            </nav>
                        </div>
                    </aside>

                    {/* Content */}
                    <main className="flex-grow">
                        {children}
                    </main>
                </div>
            </div>
        </div>
    );
}
