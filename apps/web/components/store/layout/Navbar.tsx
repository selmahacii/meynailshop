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
    const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
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

    const isLight = pathname !== '/' || isScrolled;
    const isCatalogue = pathname === '/catalogue';
    const isNavbarLight = isLight && !isCatalogue;

    return (
        <nav
            className={`fixed top-0 w-full z-[1000] transition-all duration-500 ${
                isCatalogue
                    ? 'bg-rouge-brand/95 backdrop-blur-xl border-b border-gold-brand/15 py-1.5 shadow-md'
                    : isNavbarLight 
                        ? 'bg-creme/95 backdrop-blur-xl border-b border-gold-brand/15 py-1.5 shadow-md' 
                        : 'bg-transparent py-4 border-b border-white/5'
            }`}
        >
            <div className="w-full px-6 sm:px-10 md:px-12 lg:px-16 flex items-center justify-between">
                {/* Mobile Menu Toggle */}
                <button
                    className={`lg:hidden p-2.5 -ml-2 rounded-full transition-all active:scale-95 ${
                        isNavbarLight ? 'text-encre hover:bg-encre/5' : 'text-gold-brand hover:bg-white/5'
                    }`}
                    onClick={() => setIsMobileMenuOpen(true)}
                >
                    <Menu size={22} />
                </button>

                <Link href="/" className="flex items-center group lg:mr-0 pl-2 lg:pl-0 transition-transform duration-300 hover:scale-[1.02]">
                    <div className="flex flex-col text-left">
                        <span className={`font-italiana text-2xl md:text-3xl font-normal leading-none tracking-[0.15em] uppercase transition-colors duration-300 ${
                            isNavbarLight ? 'text-rouge-brand' : 'text-gold-brand'
                        }`}>
                            MEEY
                        </span>
                        <span className={`font-playfair text-[9px] md:text-[10px] font-normal italic tracking-[0.25em] uppercase leading-none mt-1 transition-colors duration-300 ${
                            isNavbarLight ? 'text-encre2' : 'text-creme/60'
                        }`}>
                            Nail Shop
                        </span>
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
                                className={`relative text-[11px] md:text-[12px] font-bold uppercase tracking-[0.22em] transition-colors duration-300 py-2.5 flex items-center gap-1.5 ${
                                    isNavbarLight 
                                        ? (pathname === link.href ? 'text-rouge-brand' : 'text-encre/70 hover:text-rouge-brand') 
                                        : (pathname === link.href ? 'text-white' : 'text-gold-brand hover:text-white')
                                }`}
                            >
                                <span>{link.name}</span>
                                {link.subCategories?.length > 0 && (
                                    <motion.span
                                        animate={{ rotate: activeCategory === link.name ? 180 : 0 }}
                                        className="text-[8px]"
                                    >
                                        ▼
                                    </motion.span>
                                )}
                                {pathname === link.href && (
                                    <motion.div
                                        layoutId="activeNavIndicator"
                                        className={`absolute bottom-0 left-0 right-0 h-[2px] rounded-full ${
                                            isNavbarLight ? 'bg-rouge-brand' : 'bg-gold-brand'
                                        }`}
                                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                                    />
                                )}
                                {pathname !== link.href && (
                                    <span className={`absolute bottom-0 left-0 right-0 h-[2px] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded-full ${
                                        isNavbarLight ? 'bg-rouge-brand' : 'bg-gold-brand'
                                    }`} />
                                )}
                            </Link>

                            {/* Dropdown for Subcategories */}
                            {link.subCategories?.length > 0 && (
                                <AnimatePresence>
                                    {activeCategory === link.name && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 15, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                            transition={{ duration: 0.2 }}
                                            className="absolute top-full left-0 mt-2 w-52 bg-[#390102]/95 backdrop-blur-xl border border-gold-brand/20 shadow-2xl rounded-2xl py-3 z-[1001] overflow-hidden"
                                        >
                                            {link.subCategories.map((sub: any) => (
                                                <Link
                                                    key={sub.id}
                                                    href={`/categories/${link.href.split('/').pop()}/${sub.slug}`}
                                                    className="block px-6 py-3.5 text-[9px] uppercase tracking-[0.2em] text-gold-brand hover:text-white transition-all font-bold relative group/item"
                                                >
                                                    <span className="relative z-10">{sub.name}</span>
                                                    <span className="absolute inset-0 bg-gold-brand/10 scale-x-0 group-hover/item:scale-x-100 origin-left transition-transform duration-300" />
                                                </Link>
                                            ))}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            )}
                        </div>
                    ))}
                </div>

                <div className="flex items-center space-x-1 sm:space-x-2 md:space-x-3">
                    <button
                        onClick={() => setIsSearchOpen(true)}
                        className={`relative p-2.5 rounded-full transition-all duration-300 hover:scale-110 active:scale-95 ${
                            isNavbarLight 
                                ? 'text-encre hover:text-rouge-brand hover:bg-rouge-brand/5' 
                                : 'text-gold-brand hover:text-white hover:bg-white/5'
                        }`}
                        aria-label="Recherche"
                    >
                        <Search size={20} strokeWidth={1.5} />
                    </button>

                    <Link 
                        href="/favoris" 
                        className={`relative p-2.5 rounded-full transition-all duration-300 hover:scale-110 active:scale-95 ${
                            isNavbarLight 
                                ? 'text-encre hover:text-rouge-brand hover:bg-rouge-brand/5' 
                                : 'text-gold-brand hover:text-white hover:bg-white/5'
                        }`}
                    >
                        <Heart size={20} strokeWidth={1.5} />
                        {wishlistItemsCount > 0 && (
                            <span className={`absolute top-1.5 right-1.5 text-[8px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-lg border ${
                                isNavbarLight 
                                    ? 'bg-rouge-brand text-creme border-creme2/20' 
                                    : 'bg-gold-brand text-rouge-brand border-[#390102]/20'
                            }`}>
                                {wishlistItemsCount}
                            </span>
                        )}
                    </Link>

                    <button
                        onClick={() => {
                            if (!mounted) return;

                            // Security Check: Is the cookie still there?
                            const hasCookieToken = document.cookie.includes('accessToken=');
                            const localToken = localStorage.getItem('accessToken');

                            // Self-healing: If cookie is gone but local exists, re-sync!
                            if (isAuthenticated && !hasCookieToken && localToken) {
                                document.cookie = `accessToken=${localToken}; path=/; max-age=86400; SameSite=Lax`;
                            }
                            // Only clean up if BOTH are gone while we think we're auth
                            else if (isAuthenticated && !hasCookieToken && !localToken) {
                                useAuthStore.getState().logout();
                                router.push('/connexion');
                                return;
                            }

                            if (isAuthenticated) {
                                if (user?.role === 'admin') {
                                    router.push('/admin/dashboard');
                                } else {
                                    const isAlreadyInAccount = pathname.startsWith('/compte');
                                    const target = isAlreadyInAccount && pathname !== '/compte' ? '/compte' : '/compte/commandes';
                                    router.push(target);
                                }
                            } else {
                                router.push('/connexion');
                            }
                        }}
                        className={`relative p-2.5 rounded-full transition-all duration-300 hover:scale-110 active:scale-95 ${
                            isNavbarLight 
                                ? 'text-encre hover:text-rouge-brand hover:bg-rouge-brand/5' 
                                : 'text-gold-brand hover:text-white hover:bg-white/5'
                        }`}
                        aria-label="Compte / Connexion"
                    >
                        <User size={20} strokeWidth={1.5} />
                    </button>

                    <Link 
                        href="/panier" 
                        className={`relative p-2.5 rounded-full transition-all duration-300 hover:scale-110 active:scale-95 ${
                            isNavbarLight 
                                ? 'text-encre hover:text-rouge-brand hover:bg-rouge-brand/5' 
                                : 'text-gold-brand hover:text-white hover:bg-white/5'
                        }`}
                    >
                        <ShoppingBag size={20} strokeWidth={1.5} />
                        {cartItemsCount > 0 && (
                            <span className={`absolute top-1.5 right-1.5 text-[8px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-lg border ${
                                isNavbarLight 
                                    ? 'bg-rouge-brand text-creme border-creme2/20' 
                                    : 'bg-gold-brand text-rouge-brand border-[#390102]/20'
                            }`}>
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
                                    <div className="flex flex-col text-left pl-2">
                                        <span className="font-italiana text-2xl font-normal leading-none text-gold-brand tracking-[0.15em] uppercase">
                                            MEEY
                                        </span>
                                        <span className="font-playfair text-[9px] font-normal italic tracking-[0.25em] uppercase text-creme/60 leading-none mt-1.5">
                                            Nail Shop
                                        </span>
                                    </div>
                                </Link>
                                <button onClick={() => setIsMobileMenuOpen(false)} className="text-gold-brand/60 hover:text-gold-brand p-2 bg-white/5 rounded-full transition-colors">
                                    <X size={20} />
                                </button>
                            </div>
                            <div className="flex-1 overflow-y-auto px-8 py-10 space-y-2">
                                <p className="text-[10px] uppercase tracking-[0.3em] text-gold-brand font-black mb-6">Menu de Navigation</p>
                                {navLinks.map((link: any) => (
                                    <div key={link.name} className="border-b border-gold-brand/5">
                                        <div className="flex items-center justify-between">
                                            <Link
                                                href={link.href}
                                                onClick={() => setIsMobileMenuOpen(false)}
                                                className={`flex-grow py-4 text-lg font-serif transition-colors ${pathname === link.href ? 'text-gold-brand font-bold' : 'text-gold-brand/80 hover:text-gold-brand'
                                                    }`}
                                            >
                                                {link.name}
                                            </Link>
                                            {link.subCategories?.length > 0 && (
                                                <button
                                                    onClick={() => setExpandedCategory(expandedCategory === link.name ? null : link.name)}
                                                    className="p-4 text-gold-brand"
                                                >
                                                    <motion.div
                                                        animate={{ rotate: expandedCategory === link.name ? 180 : 0 }}
                                                    >
                                                        ▼
                                                    </motion.div>
                                                </button>
                                            )}
                                        </div>

                                        {link.subCategories?.length > 0 && (
                                            <AnimatePresence>
                                                {expandedCategory === link.name && (
                                                    <motion.div
                                                        initial={{ height: 0, opacity: 0 }}
                                                        animate={{ height: 'auto', opacity: 1 }}
                                                        exit={{ height: 0, opacity: 0 }}
                                                        className="pl-6 pb-4 flex flex-col space-y-3 overflow-hidden"
                                                    >
                                                        {link.subCategories.map((sub: any) => (
                                                            <Link
                                                                key={sub.id}
                                                                href={`/categories/${link.href.split('/').pop()}/${sub.slug}`}
                                                                onClick={() => setIsMobileMenuOpen(false)}
                                                                className="py-2 text-sm text-gold-brand/60 hover:text-gold-brand transition-colors font-serif border-l border-gold-brand/10 pl-4"
                                                            >
                                                                — {sub.name}
                                                            </Link>
                                                        ))}
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
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


                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Search Overlay */}
            <SearchOverlay 
                isOpen={isSearchOpen} 
                onClose={() => setIsSearchOpen(false)} 
                allCategories={categories}
            />
        </nav>
    );
}
