'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { ShoppingBag, User, Search, Menu, X, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCartStore } from '@/lib/store/cartStore';
import { useAuthStore } from '@/lib/store/authStore';
import { useWishlistStore } from '@/lib/store/wishlistStore';
import { useSettings } from '@/lib/hooks/useSettings';
import SearchOverlay from '@/components/store/layout/SearchOverlay';
import { apiFetch } from '@/lib/api/client';

export default function Navbar() {
    const { settings } = useSettings();
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [categories, setCategories] = useState<any[]>([]);
    const [activeCategory, setActiveCategory] = useState<string | null>(null);
    const pathname = usePathname();
    const router = useRouter();
    const [mounted, setMounted] = useState(false);
    const cartItemsCount = useCartStore((state) => state.items.length);
    const wishlistItemsCount = useWishlistStore((state) => state.items.length);
    const { user, isAuthenticated } = useAuthStore();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        setMounted(true);

        // Fetch categories for navbar
        apiFetch('/api/categories').then(res => {
            if (res.data) setCategories(res.data);
        });

        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: 'Accueil', href: '/' },
        { name: 'Catalogue', href: '/catalogue' },
        ...categories.slice(0, 4).map(cat => ({
            name: cat.name,
            href: `/categories/${cat.slug}`,
            subCategories: cat.subCategories || []
        }))
    ];

    return (
        <nav
            className={`fixed top-0 w-full z-[1000] transition-all duration-300 ${isScrolled ? 'bg-rouge-brand py-2 shadow-xl' : 'bg-gradient-to-b from-black/40 via-black/10 to-transparent py-4'}`}
        >
            <div className="w-full px-6 sm:px-10 md:px-12 lg:px-16 flex items-center justify-between">
                {/* Mobile Menu Toggle */}
                <button
                    className="lg:hidden text-gold-brand p-2 -ml-2 hover:opacity-80 transition-opacity"
                    onClick={() => setIsMobileMenuOpen(true)}
                >
                    <Menu size={24} />
                </button>

                <Link href="/" className="flex items-center group lg:mr-0 pl-2 lg:pl-0">
                    <div className="relative w-[85px] h-[85px] md:w-[125px] md:h-[125px] transition-all duration-500 hover:scale-[1.15]">
                        <Image
                            src="/logo2.png"
                            alt="MEEY"
                            fill
                            className="object-contain drop-shadow-[0_0_20px_rgba(0,0,0,0.4)]"
                            priority
                        />
                    </div>
                </Link>

                {/* Desktop Links */}
                <div className="hidden lg:flex items-center space-x-10">
                    {navLinks.map((link: any) => (
                        <div 
                            key={link.name} 
                            className="relative group"
                            onMouseEnter={() => setActiveCategory(link.name)}
                            onMouseLeave={() => setActiveCategory(null)}
                        >
                            <Link
                                href={link.href}
                                className={`text-[10px] md:text-[11px] font-bold uppercase tracking-[0.25em] transition-all hover:text-white hover:scale-105 drop-shadow-lg flex items-center gap-1 ${pathname === link.href ? 'text-gold-brand border-b-2 border-gold-brand pb-1.5' : 'text-gold-brand'
                                    }`}
                            >
                                {link.name}
                                {link.subCategories?.length > 0 && (
                                    <motion.span 
                                        animate={{ rotate: activeCategory === link.name ? 180 : 0 }}
                                        className="text-[8px]"
                                    >
                                        ▼
                                    </motion.span>
                                )}
                            </Link>

                            {/* Dropdown for Subcategories */}
                            {link.subCategories?.length > 0 && (
                                <AnimatePresence>
                                    {activeCategory === link.name && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 10 }}
                                            className="absolute top-full left-0 mt-4 w-48 bg-rouge-brand border border-gold-brand/20 shadow-2xl py-2 z-[1001] backdrop-blur-md"
                                        >
                                            {link.subCategories.map((sub: any) => (
                                                <Link
                                                    key={sub.id}
                                                    href={`/categories/${link.href.split('/').pop()}/${sub.slug}`}
                                                    className="block px-6 py-3.5 text-[9px] uppercase tracking-[0.2em] text-gold-brand hover:bg-gold-brand/10 hover:text-white transition-all font-black"
                                                >
                                                    {sub.name}
                                                </Link>
                                            ))}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            )}
                        </div>
                    ))}
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-3 sm:space-x-5 md:space-x-6">
                    <button 
                        onClick={() => setIsSearchOpen(true)}
                        className="text-gold-brand hover:opacity-80 transition-all hover:scale-110"
                    >
                        <Search size={21} strokeWidth={1.5} />
                    </button>

                    <Link href="/favoris" className="relative text-gold-brand hover:opacity-80 transition-all hover:scale-110">
                        <Heart size={21} strokeWidth={1.5} />
                        {wishlistItemsCount > 0 && (
                            <span className="absolute -top-1.5 -right-1.5 bg-gold-brand text-rouge-brand text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-md">
                                {wishlistItemsCount}
                            </span>
                        )}
                    </Link>

                    <button
                        onClick={() => {
                            console.log('[NAVBAR DEBUG] Account icon clicked');
                            if (!mounted) return;

                            // Security Check: Is the cookie still there?
                            const hasCookieToken = document.cookie.includes('accessToken=');
                            const localToken = localStorage.getItem('accessToken');
                            
                            // Self-healing: If cookie is gone but local exists, re-sync!
                            if (isAuthenticated && !hasCookieToken && localToken) {
                                console.log('[NAVBAR DEBUG] Re-syncing cookie from localStorage...');
                                document.cookie = `accessToken=${localToken}; path=/; max-age=86400; SameSite=Lax`;
                            } 
                            // Only clean up if BOTH are gone while we think we're auth
                            else if (isAuthenticated && !hasCookieToken && !localToken) {
                                console.warn('[NAVBAR DEBUG] Total session loss. Cleaning up...');
                                useAuthStore.getState().logout();
                                router.push('/connexion');
                                return;
                            }

                            if (isAuthenticated) {
                                if (user?.role === 'admin') {
                                    console.log('[NAVBAR DEBUG] Redirecting Admin to dashboard');
                                    router.push('/admin/dashboard');
                                } else {
                                    const isAlreadyInAccount = pathname.startsWith('/compte');
                                    const target = isAlreadyInAccount && pathname !== '/compte' ? '/compte' : '/compte/commandes';
                                    console.log('[NAVBAR DEBUG] Client redirection to:', target);
                                    router.push(target);
                                }
                            } else {
                                console.log('[NAVBAR DEBUG] Redirecting to login');
                                router.push('/connexion');
                            }
                        }}
                        className="text-gold-brand hover:opacity-80 transition-all hover:scale-110"
                        aria-label="Compte / Connexion"
                    >
                        <User size={21} strokeWidth={1.5} />
                    </button>

                    <Link href="/panier" className="relative text-gold-brand hover:opacity-80 transition-all hover:scale-110">
                        <ShoppingBag size={21} strokeWidth={1.5} />
                        {cartItemsCount > 0 && (
                            <span className="absolute -top-1.5 -right-1.5 bg-gold-brand text-rouge-brand text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-md">
                                {cartItemsCount}
                            </span>
                        )}
                    </Link>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="fixed inset-0 bg-encre/80 backdrop-blur-md z-[1001]"
                        />
                        <motion.div
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed top-0 left-0 h-full w-[80%] max-w-sm bg-rouge-brand z-[1002] flex flex-col shadow-[10px_0_30px_rgba(0,0,0,0.5)] overflow-hidden"
                        >
                            <div className="p-8 border-b border-gold-brand/10 flex justify-between items-center bg-rouge-brand/50 backdrop-blur-md">
                                <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center space-x-3">
                                    <div className="relative w-[80px] h-[80px] rounded-full overflow-hidden">
                                        <Image
                                            src="/logo2.png"
                                            alt="MEEY"
                                            fill
                                            className="object-contain"
                                        />
                                    </div>
                                </Link>
                                <button onClick={() => setIsMobileMenuOpen(false)} className="text-gold-brand/60 hover:text-gold-brand p-2 bg-white/5 rounded-full transition-colors">
                                    <X size={20} />
                                </button>
                            </div>
                            <div className="flex-1 overflow-y-auto px-8 py-10 space-y-2">
                                <p className="text-[10px] uppercase tracking-[0.3em] text-gold-brand font-black mb-6">Menu de Navigation</p>
                                {navLinks.map((link: any) => (
                                    <div key={link.name}>
                                        <Link
                                            href={link.href}
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className={`flex items-center justify-between py-4 text-lg font-serif transition-colors border-b border-gold-brand/5 ${pathname === link.href ? 'text-gold-brand font-bold' : 'text-gold-brand/80 hover:text-gold-brand'
                                                }`}
                                        >
                                            {link.name}
                                        </Link>
                                        
                                        {link.subCategories?.length > 0 && (
                                            <div className="pl-4 py-2 flex flex-col space-y-2">
                                                {link.subCategories.map((sub: any) => (
                                                    <Link
                                                        key={sub.id}
                                                        href={`/categories/${link.href.split('/').pop()}/${sub.slug}`}
                                                        onClick={() => setIsMobileMenuOpen(false)}
                                                        className="py-2 text-sm text-gold-brand/60 hover:text-gold-brand transition-colors font-serif"
                                                    >
                                                        — {sub.name}
                                                    </Link>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                                <Link
                                    href="/favoris"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="flex items-center justify-between py-4 text-lg font-serif text-gold-brand/80 hover:text-gold-brand transition-all duration-300 border-b border-gold-brand/5"
                                >
                                    <span>Mes Favoris</span>
                                    {wishlistItemsCount > 0 && (
                                        <span className="bg-gold-brand text-rouge-brand text-[10px] font-bold px-2.5 py-1 rounded-full shadow-sm">
                                            {wishlistItemsCount}
                                        </span>
                                    )}
                                </Link>
                            </div>

                            <div className="p-8 border-t border-gold-brand/10 bg-black/20">
                                <div className="flex items-center space-x-4 mb-6">
                                     <div className="flex-1 h-[1px] bg-gold-brand/10"></div>
                                     <p className="text-[9px] uppercase tracking-[0.2em] text-gold-brand/60 font-bold">Contactez-nous</p>
                                     <div className="flex-1 h-[1px] bg-gold-brand/10"></div>
                                 </div>
                                 <a href="mailto:meeybouabdellah@gmail.com" className="block text-sm text-gold-brand hover:opacity-80 transition-opacity font-medium mb-2 break-all">meeybouabdellah@gmail.com</a>
                                 <p className="text-xs text-gold-brand/40">Suivez notre excellence au quotidien</p>
                             </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Search Overlay */}
            <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
        </nav>
    );
}
