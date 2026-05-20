'use client';

import { useState } from 'react';
import { Search, User, Globe, LogOut, Menu } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/authStore';
import { toast } from 'sonner';
import AdminNotifications from '@/components/admin/layout/AdminNotifications';

export default function AdminTopbar({ onMenuClick }: { onMenuClick?: () => void }) {
    const [showDropdown, setShowDropdown] = useState(false);
    const router = useRouter();
    const { logout, user: currentUser } = useAuthStore();

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
        <header className="h-16 bg-white/95 backdrop-blur-xl border-b border-gold-brand/10 sticky top-0 z-40 px-4 md:px-8 flex items-center justify-between shadow-sm">
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
                        className="block w-full pl-10 pr-3 py-2 border border-gold-brand/20 bg-[#FAF9F6]/50 rounded-xl text-sm placeholder-encre3/40 focus:outline-none focus:ring-1 focus:ring-or focus:border-or focus:bg-white transition-all duration-300 shadow-sm"
                        placeholder="Rechercher..."
                    />
                </div>
            </div>

            <div className="flex items-center space-x-3 md:space-x-4">
                <Link
                    href="/"
                    target="_blank"
                    className="flex items-center text-[10px] md:text-xs font-bold uppercase tracking-widest text-encre2 hover:text-rouge-brand transition-all border border-gold-brand/25 bg-[#FAF9F6] px-4 py-2 rounded-full hover:shadow-sm"
                >
                    <Globe size={16} className="mr-2 text-or" />
                    <span className="hidden xs:inline md:inline">Boutique</span>
                </Link>

                <div className="h-8 w-[1px] bg-gold-brand/15 hidden md:block"></div>

                {/* Notifications Center */}
                <AdminNotifications />

                <div className="h-8 w-[1px] bg-gold-brand/15 hidden sm:block"></div>

                <div className="relative">
                    <button
                        onClick={() => setShowDropdown(!showDropdown)}
                        className="flex items-center space-x-2 md:space-x-3 cursor-pointer group rounded-lg hover:bg-creme/50 px-2 md:px-3 py-2 transition-all"
                    >
                        <div className="text-right hidden sm:block">
                            <p className="text-sm font-semibold text-encre leading-none mb-1">
                                {currentUser?.firstName && currentUser?.lastName ? `${currentUser.firstName} ${currentUser.lastName}` : 'Administrateur'}
                            </p>
                            <p className="text-[10px] uppercase font-bold text-[#BFA893]">MEEY Control</p>
                        </div>
                        <div className="h-9 w-9 md:h-10 md:w-10 rounded-full bg-creme border border-[#BFA893]/20 flex items-center justify-center text-[#BFA893] group-hover:bg-[#BFA893] group-hover:text-[#390102] transition-all">
                            {currentUser?.firstName ? (
                                <span className="font-bold text-xs uppercase">
                                    {currentUser.firstName.charAt(0)}{currentUser.lastName?.charAt(0) || ''}
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
                                <p className="text-sm font-medium text-encre truncate">{currentUser?.email}</p>
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
