'use client';

import { Bell, Search, User, Globe } from 'lucide-react';
import Link from 'next/link';

export default function AdminTopbar() {
    return (
        <header className="h-16 bg-white border-b border-creme2 sticky top-0 z-40 px-8 flex items-center justify-between">
            <div className="flex items-center flex-grow max-w-md">
                <div className="relative w-full">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-encre3/50">
                        <Search size={18} />
                    </div>
                    <input
                        type="text"
                        className="block w-full pl-10 pr-3 py-2 border border-creme2 rounded-sm text-sm placeholder-encre3/40 focus:outline-none focus:ring-1 focus:ring-or focus:border-or transition-all"
                        placeholder="Rechercher commande, client, produit..."
                    />
                </div>
            </div>

            <div className="flex items-center space-x-6">
                <Link
                    href="/"
                    target="_blank"
                    className="flex items-center text-xs font-semibold uppercase tracking-widest text-encre2 hover:text-rouge-mid transition-colors"
                >
                    <Globe size={16} className="mr-2" />
                    Voir la boutique
                </Link>

                <button className="relative text-encre2 hover:text-or transition-colors">
                    <Bell size={20} strokeWidth={1.5} />
                    <span className="absolute top-0 right-0 w-2 h-2 bg-rouge-mid rounded-full border-2 border-white"></span>
                </button>

                <div className="h-8 w-[1px] bg-creme2"></div>

                <div className="flex items-center space-x-3 cursor-pointer group">
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-semibold text-encre leading-none mb-1">Admin MEEY</p>
                        <p className="text-[10px] uppercase font-bold text-or">Propriétaire</p>
                    </div>
                    <div className="h-10 w-10 rounded-full bg-creme border border-or/20 flex items-center justify-center text-or group-hover:bg-or group-hover:text-creme transition-all">
                        <User size={20} />
                    </div>
                </div>
            </div>
        </header>
    );
}
