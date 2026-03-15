'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { ShoppingBag, User, Search, Menu, X, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCartStore } from '@/lib/store/cartStore';
import { useAuthStore } from '@/lib/store/authStore';
import { useWishlistStore } from '@/lib/store/wishlistStore';

export default function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const pathname = usePathname();
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

    const accountTarget = mounted && isAuthenticated ? '/compte' : '/login';

    const navLinks = [
        { name: 'Accueil', href: '/' },
        { name: 'Catalogue', href: '/catalogue' },
        { name: 'Vernis Gel', href: '/categories/vernis-gel' },
        { name: 'Gel UV', href: '/categories/gel-uv' },
        { name: 'Matériel', href: '/categories/materiel' },
    ];

    return (
        <nav
            className={`fixed top-0 w-full z-[1000] transition-all duration-300 ${isScrolled ? 'bg-rouge-deep/90 backdrop-blur-md py-2 shadow-xl' : 'bg-transparent py-4'}`}
        >
            <div className="container mx-auto px-4 md:px-8 flex items-center justify-between">
                {/* Mobile Menu Toggle */}
                <button
                    className="lg:hidden text-creme p-2 -ml-2 hover:text-or transition-colors"
                    onClick={() => setIsMobileMenuOpen(true)}
                >
                    <Menu size={24} />
                </button>

                {/* Logo */}
                <Link href="/" className="flex items-center space-x-2 md:space-x-3 group mr-auto lg:mr-0 pl-2 lg:pl-0">
                    <div className="relative w-10 h-10 md:w-14 md:h-14 border-2 border-or/30 rounded-full p-1 group-hover:border-or group-hover:shadow-[0_0_15px_rgba(212,175,55,0.3)] transition-all duration-500 overflow-hidden bg-rouge-deep/40 backdrop-blur-sm">
                        <Image
                            src="/logo.png"
                            alt="MEEY Logo"
                            fill
                            className="object-contain p-0.5"
                        />
                    </div>
                    <div className="flex flex-col">
                        <span className="font-serif text-lg md:text-2xl text-or leading-none tracking-tight group-hover:scale-105 transition-transform duration-300 origin-left">MEEY</span>
                        <span className="text-[7px] md:text-[8px] uppercase tracking-[0.2em] text-creme/60 font-bold group-hover:text-creme transition-colors">Nail Shop</span>
                    </div>
                </Link>

                {/* Desktop Links */}
                <div className="hidden lg:flex items-center space-x-8">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            className={`text-sm font-medium transition-all hover:text-or hover:scale-105 ${pathname === link.href ? 'text-or' : 'text-creme'
                                }`}
                        >
                            {link.name}
                        </Link>
                    ))}
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-3 sm:space-x-5 md:space-x-6">
                    <button className="text-creme hover:text-or transition-all hover:scale-110 hidden sm:block">
                        <Search size={21} strokeWidth={1.5} />
                    </button>

                    <Link href="/favoris" className="relative text-creme hover:text-or transition-all hover:scale-110">
                        <Heart size={21} strokeWidth={1.5} />
                        {wishlistItemsCount > 0 && (
                            <span className="absolute -top-1.5 -right-1.5 bg-or text-rouge-deep text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-md">
                                {wishlistItemsCount}
                            </span>
                        )}
                    </Link>

                    <Link
                        href={accountTarget}
                        className="text-creme hover:text-or transition-all hover:scale-110"
                        aria-label="Compte / Connexion"
                    >
                        <User size={21} strokeWidth={1.5} />
                    </Link>

                    <Link href="/panier" className="relative text-creme hover:text-or transition-all hover:scale-110">
                        <ShoppingBag size={21} strokeWidth={1.5} />
                        {cartItemsCount > 0 && (
                            <span className="absolute -top-1.5 -right-1.5 bg-or text-rouge-deep text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-md">
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
                            className="fixed top-0 left-0 h-full w-[80%] max-w-sm bg-rouge-deep z-[1002] flex flex-col shadow-[10px_0_30px_rgba(0,0,0,0.5)] overflow-hidden"
                        >
                            <div className="p-8 border-b border-white/10 flex justify-between items-center bg-rouge-deep/50 backdrop-blur-md">
                                <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center space-x-3">
                                    <div className="relative w-10 h-10 border border-or/30 rounded-full p-1 overflow-hidden bg-rouge-deep">
                                        <Image
                                            src="/logo.png"
                                            alt="MEEY Logo"
                                            fill
                                            className="object-contain"
                                        />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="font-serif text-xl text-or tracking-tight">MEEY</span>
                                        <span className="text-[7px] uppercase tracking-widest text-creme/60">Nail Shop</span>
                                    </div>
                                </Link>
                                <button onClick={() => setIsMobileMenuOpen(false)} className="text-creme/60 hover:text-creme p-2 bg-white/5 rounded-full transition-colors">
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto px-8 py-10 space-y-2">
                                <p className="text-[10px] uppercase tracking-[0.3em] text-or/60 font-black mb-6">Menu de Navigation</p>
                                {navLinks.map((link) => (
                                    <Link
                                        key={link.name}
                                        href={link.href}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className={`flex items-center py-4 text-lg font-serif transition-all duration-300 border-b border-white/5 ${
                                            pathname === link.href ? 'text-or' : 'text-creme hover:text-or'
                                        }`}
                                    >
                                        {link.name}
                                    </Link>
                                ))}
                                <Link
                                    href="/favoris"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="flex items-center justify-between py-4 text-lg font-serif text-creme hover:text-or transition-all duration-300 border-b border-white/5"
                                >
                                    <span>Mes Favoris</span>
                                    {wishlistItemsCount > 0 && (
                                        <span className="bg-or text-rouge-deep text-[10px] font-bold px-2.5 py-1 rounded-full shadow-sm">
                                            {wishlistItemsCount}
                                        </span>
                                    )}
                                </Link>
                            </div>

                            <div className="p-8 border-t border-white/10 bg-black/20">
                                <div className="flex items-center space-x-4 mb-6">
                                    <div className="flex-1 h-[1px] bg-white/10"></div>
                                    <p className="text-[9px] uppercase tracking-[0.2em] text-creme/30 font-bold">Contactez-nous</p>
                                    <div className="flex-1 h-[1px] bg-white/10"></div>
                                </div>
                                <a href="mailto:meeybouabdellah@gmail.com" className="block text-sm text-creme/80 hover:text-or transition-colors font-medium mb-2">meeybouabdellah@gmail.com</a>
                                <p className="text-xs text-creme/40">Suivez notre excellence au quotidien</p>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </nav>
    );
}
