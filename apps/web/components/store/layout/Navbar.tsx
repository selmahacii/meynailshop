'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ShoppingBag, User, Search, Menu, X, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCartStore } from '@/lib/store/cartStore';
import { useAuthStore } from '@/lib/store/authStore';

export default function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const pathname = usePathname();
    const router = useRouter();
    const cartItemsCount = useCartStore((state) => state.items.length);
    const { user, isAuthenticated } = useAuthStore();

    useEffect(() => {
        console.log('[Navbar] mount', { pathname });
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        console.log('[Navbar] state', { pathname, isMobileMenuOpen, isAuthenticated, role: user?.role || null });
    }, [pathname, isMobileMenuOpen, isAuthenticated, user?.role]);

    const accountTarget = isAuthenticated
        ? (user?.role === 'admin' ? '/admin/dashboard' : '/compte')
        : `/connexion?redirect=${typeof window !== 'undefined' && window.location.pathname.startsWith('/admin') ? '/admin/dashboard' : '/compte'}`;

    const handleAccountClick = () => {
        router.push(accountTarget);
    };

    const navLinks = [
        { name: 'Accueil', href: '/' },
        { name: 'Catalogue', href: '/catalogue' },
        { name: 'Vernis Gel', href: '/categories/vernis-gel' },
        { name: 'Gel UV', href: '/categories/gel-uv' },
        { name: 'Matériel', href: '/categories/materiel' },
    ];

    return (
        <nav
            onClickCapture={(e) => {
                const t = e.target as HTMLElement | null;
                console.log('[Navbar] click capture', {
                    pathname,
                    tag: t?.tagName,
                    id: t?.id,
                    className: t?.className,
                });
            }}
            className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-rouge-deep/95 backdrop-blur-md py-3 shadow-lg' : 'bg-transparent py-5'
                }`}
        >
            <div className="container mx-auto px-4 flex items-center justify-between">
                {/* Mobile Menu Toggle */}
                <button
                    className="lg:hidden text-creme p-2"
                    onClick={() => setIsMobileMenuOpen(true)}
                >
                    <Menu size={24} />
                </button>

                {/* Logo */}
                <Link href="/" className="flex flex-col items-center">
                    <span className="font-serif text-2xl md:text-3xl text-or leading-none tracking-tighter">MEEY</span>
                    <span className="text-[10px] uppercase tracking-[0.3em] text-creme/80">Nail Shop</span>
                </Link>

                {/* Desktop Links */}
                <div className="hidden lg:flex items-center space-x-8">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            className={`text-sm font-medium transition-colors hover:text-or ${pathname === link.href ? 'text-or' : 'text-creme'
                                }`}
                        >
                            {link.name}
                        </Link>
                    ))}
                    {user?.role === 'admin' && (
                        <Link
                            href="/admin/dashboard"
                            className="bg-or/10 border border-or/30 text-or text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest hover:bg-or hover:text-rouge-deep transition-all duration-300"
                        >
                            Panel Admin
                        </Link>
                    )}
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-4 md:space-x-6">
                    <button className="text-creme hover:text-or transition-colors hidden md:block">
                        <Search size={20} strokeWidth={1.5} />
                    </button>

                    <Link href="/compte/favoris" className="text-creme hover:text-or transition-colors hidden md:block">
                        <Heart size={20} strokeWidth={1.5} />
                    </Link>

                    <button
                        type="button"
                        onClick={handleAccountClick}
                        className="text-creme hover:text-or transition-colors"
                        aria-label="Compte / Connexion"
                    >
                        <User size={20} strokeWidth={1.5} />
                    </button>

                    <Link href="/panier" className="relative text-creme hover:text-or transition-colors">
                        <ShoppingBag size={20} strokeWidth={1.5} />
                        {cartItemsCount > 0 && (
                            <span className="absolute -top-2 -right-2 bg-or text-rouge-deep text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
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
                            className="fixed inset-0 bg-encre/60 backdrop-blur-sm z-[60]"
                        />
                        <motion.div
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed top-0 left-0 h-full w-[80%] max-w-sm bg-rouge-deep z-[70] p-8 shadow-2xl"
                        >
                            <div className="flex justify-between items-center mb-12">
                                <span className="font-serif text-2xl text-or">MEEY</span>
                                <button onClick={() => setIsMobileMenuOpen(false)} className="text-creme">
                                    <X size={24} />
                                </button>
                            </div>

                            <div className="flex flex-col space-y-6">
                                {navLinks.map((link) => (
                                    <Link
                                        key={link.name}
                                        href={link.href}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="text-lg font-medium text-creme hover:text-or transition-colors border-b border-white/10 pb-2"
                                    >
                                        {link.name}
                                    </Link>
                                ))}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </nav>
    );
}
