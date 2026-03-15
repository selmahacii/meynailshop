'use client';

import { useState } from 'react';
import { Bell, Search, User, Globe, LogOut, Menu } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/authStore';
import { toast } from 'sonner';

export default function AdminTopbar({ onMenuClick }: { onMenuClick?: () => void }) {
    const [showDropdown, setShowDropdown] = useState(false);
    const router = useRouter();
    const { logout, user } = useAuthStore();

    const handleLogout = async () => {
        try {
            await fetch('/api/auth/logout', { method: 'POST' });
            logout();
            toast.success('Déconnecté avec succès');
            router.push('/connexion');
        } catch (error) {
            toast.error('Erreur lors de la déconnexion');
        }
    };

    return (
        <header className="h-16 bg-white border-b border-creme2 sticky top-0 z-40 px-4 md:px-8 flex items-center justify-between">
            <div className="flex items-center flex-grow max-w-md">
                <button 
                    onClick={onMenuClick}
                    className="lg:hidden p-2 mr-2 text-encre2 hover:text-or transition-colors"
                >
                    <Menu size={24} />
                </button>
                <div className="relative w-full hidden sm:block">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-encre3/50">
                        <Search size={18} />
                    </div>
                    <input
                        type="text"
                        className="block w-full pl-10 pr-3 py-2 border border-creme2 rounded-sm text-sm placeholder-encre3/40 focus:outline-none focus:ring-1 focus:ring-or focus:border-or transition-all"
                        placeholder="Rechercher..."
                    />
                </div>
            </div>

            <div className="flex items-center space-x-3 md:space-x-6">
                <Link
                    href="/"
                    target="_blank"
                    className="hidden md:flex items-center text-xs font-semibold uppercase tracking-widest text-encre2 hover:text-rouge-mid transition-colors"
                >
                    <Globe size={16} className="mr-2" />
                    Voir
                </Link>

                <button 
                    onClick={() => toast.info('Aucune nouvelle notification')}
                    className="relative text-encre2 hover:text-[#BFA893] transition-colors"
                >
                    <Bell size={20} strokeWidth={1.5} />
                    <span className="absolute top-0 right-0 w-2 h-2 bg-[#390102] rounded-full border-2 border-white"></span>
                </button>

                <div className="h-8 w-[1px] bg-creme2 hidden sm:block"></div>

                <div className="relative">
                    <button
                        onClick={() => setShowDropdown(!showDropdown)}
                        className="flex items-center space-x-2 md:space-x-3 cursor-pointer group rounded-lg hover:bg-creme/50 px-2 md:px-3 py-2 transition-all"
                    >
                        <div className="text-right hidden sm:block">
                            <p className="text-sm font-semibold text-encre leading-none mb-1">
                                {user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : 'Administrateur'}
                            </p>
                            <p className="text-[10px] uppercase font-bold text-[#BFA893]">MEEY Control</p>
                        </div>
                        <div className="h-9 w-9 md:h-10 md:w-10 rounded-full bg-creme border border-[#BFA893]/20 flex items-center justify-center text-[#BFA893] group-hover:bg-[#BFA893] group-hover:text-[#390102] transition-all">
                            {user?.firstName ? (
                                <span className="font-bold text-xs">
                                    {user.firstName.charAt(0)}{user.lastName?.charAt(0) || ''}
                                </span>
                            ) : (
                                <User size={18} />
                            )}
                        </div>
                    </button>

                    {showDropdown && (
                        <div className="absolute right-0 mt-2 w-56 bg-white border border-creme2 rounded-lg shadow-xl z-50 overflow-hidden divide-y divide-creme2 animate-in slide-in-from-top-2 duration-200">
                            <div className="px-4 py-3 bg-creme/20">
                                <p className="text-xs font-bold text-encre3 uppercase tracking-widest">Compte</p>
                                <p className="text-sm font-medium text-encre truncate">{user?.email}</p>
                            </div>
                            <div className="py-1">
                                <Link
                                    href="/admin/parametres"
                                    onClick={() => setShowDropdown(false)}
                                    className="flex items-center space-x-3 px-4 py-3 text-sm text-encre hover:bg-creme/50 transition-colors"
                                >
                                    <User size={16} className="text-[#BFA893]" />
                                    <span>Mon Profil</span>
                                </Link>
                            </div>
                            <div className="py-1">
                                <button
                                    onClick={handleLogout}
                                    className="w-full flex items-center space-x-3 px-4 py-3 text-sm text-rouge-mid hover:bg-rouge/5 transition-colors"
                                >
                                    <LogOut size={16} />
                                    <span>Déconnexion</span>
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}
