'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { ShoppingBag, User, Search, Menu, X, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCartStore } from '@/lib/store/cartStore';
import { useAuthStore } from '@/lib/store/authStore';

export default function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const pathname = usePathname();
    const [mounted, setMounted] = useState(false);
    const cartItemsCount = useCartStore((state) => state.items.length);
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
                <Link href="/" className="flex items-center space-x-3 group">
                    <div className="relative w-10 h-10 md:w-12 md:h-12 border-2 border-or/20 rounded-full p-0.5 group-hover:border-or/40 transition-all duration-300 overflow-hidden shadow-lg shadow-black/20">
                        <Image
                            src="/logo.png"
                            alt="MEEY Logo"
                            fill
                            className="object-contain rounded-full"
                        />
                    </div>
                    <div className="flex flex-col">
                        <span className="font-serif text-xl md:text-2xl text-or leading-none tracking-tight group-hover:scale-105 transition-transform duration-300 origin-left">MEEY</span>
                        <span className="text-[8px] uppercase tracking-[0.2em] text-creme/60 font-bold group-hover:text-creme transition-colors">Nail Shop</span>
                    </div>
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
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-4 md:space-x-6">
                    <button className="text-creme hover:text-or transition-colors hidden md:block">
                        <Search size={20} strokeWidth={1.5} />
                    </button>

                    <Link href="/compte/favoris" className="text-creme hover:text-or transition-colors hidden md:block">
                        <Heart size={20} strokeWidth={1.5} />
                    </Link>

                    <Link
                        href={accountTarget}
                        className="text-creme hover:text-or transition-colors"
                        aria-label="Compte / Connexion"
                    >
                        <User size={20} strokeWidth={1.5} />
                    </Link>

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
                                <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center space-x-3">
                                    <div className="relative w-10 h-10 border border-or/20 rounded-full p-0.5 overflow-hidden shadow-inner">
                                        <Image
                                            src="/logo.png"
                                            alt="MEEY Logo"
                                            fill
                                            className="object-contain rounded-full"
                                        />
                                    </div>
                                    <span className="font-serif text-2xl text-or uppercase tracking-tighter">MEEY</span>
                                </Link>
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
