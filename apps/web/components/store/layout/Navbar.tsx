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

export default function Navbar() {
    const { settings } = useSettings();
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);



    const navLinks = [
        { name: 'Accueil', href: '/' },
        { name: 'Catalogue', href: '/catalogue' },
        { name: 'Vernis Gel', href: '/categories/vernis-gel' },
        { name: 'Gel UV', href: '/categories/gel-uv' },
        { name: 'Matériel', href: '/categories/materiel' },
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
                    <div className="relative w-[60px] h-[60px] md:w-[80px] md:h-[80px] transition-all duration-500 hover:scale-105">
                        <Image
                            src="/logo2.png"
                            alt="MEEY"
                            fill
                            className="object-contain drop-shadow-[0_0_15px_rgba(0,0,0,0.3)]"
                            priority
                        />
                    </div>
                </Link>

                {/* Desktop Links */}
                <div className="hidden lg:flex items-center space-x-10">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            className={`text-xs md:text-sm font-bold uppercase tracking-[0.2em] transition-all hover:text-white hover:scale-105 drop-shadow-lg ${pathname === link.href ? 'text-gold-brand border-b-2 border-gold-brand' : 'text-gold-brand'
                                }`}
                        >
                            {link.name}
                        </Link>
                    ))}
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-3 sm:space-x-5 md:space-x-6">
                    <button className="text-gold-brand hover:opacity-80 transition-all hover:scale-110 hidden sm:block">
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
                            const hasToken = document.cookie.includes('accessToken=');
                            
                            if (isAuthenticated && !hasToken) {
                                console.warn('[NAVBAR DEBUG] Session mismatch detected (Store says Auth, Cookie says No). Cleaning up...');
                                useAuthStore.getState().logout();
                                router.push('/connexion');
                                return;
                            }

                            if (isAuthenticated) {
                                if (user?.role === 'admin') {
                                    console.log('[NAVBAR DEBUG] Redirecting Admin to dashboard');
                                    router.push('/admin/dashboard');
                                } else {
                                    // Logic for normal clients:
                                    // If already in the account section, go to the profile page (/compte)
                                    // If elsewhere, go to the orders page first (/compte/commandes)
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
                                {navLinks.map((link) => (
                                    <Link
                                        key={link.name}
                                        href={link.href}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className={`flex items-center py-4 text-lg font-serif transition-all duration-300 border-b border-gold-brand/5 ${pathname === link.href ? 'text-gold-brand font-bold' : 'text-gold-brand/80 hover:text-gold-brand'
                                            }`}
                                    >
                                        {link.name}
                                    </Link>
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
                                <a href={`mailto:${settings.shopEmail || 'contact@meey.dz'}`} className="block text-sm text-gold-brand hover:opacity-80 transition-opacity font-medium mb-2">{settings.shopEmail || 'contact@meey.dz'}</a>
                                <p className="text-xs text-gold-brand/40">Suivez notre excellence au quotidien</p>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </nav>
    );
}
