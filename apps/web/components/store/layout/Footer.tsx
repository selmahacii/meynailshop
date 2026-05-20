'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Instagram, Facebook, Mail, Phone, MapPin } from 'lucide-react';
import { useSettings } from '@/lib/hooks/useSettings';
import { StoreAPI } from '@/lib/api/client';

export default function Footer() {
    const currentYear = new Date().getFullYear();
    const { settings } = useSettings();
    const [categories, setCategories] = useState<any[]>([]);

    useEffect(() => {
        async function fetchCategories() {
            try {
                const res = await StoreAPI.getCategories();
                if (res.success) {
                    setCategories(res.data);
                }
            } catch (err) {
                console.error('Error fetching footer categories:', err);
            }
        }
        fetchCategories();
    }, []);

    return (
        <footer className="bg-rouge-brand text-gold-brand pt-20 pb-10 border-t border-gold-brand/10">
            <div className="container mx-auto px-6 sm:px-12 md:px-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
                    {/* Brand Info */}
                    <div className="space-y-6 flex flex-col items-center md:items-start text-center md:text-left">
                        <Link href="/" className="relative w-[110px] h-[110px] block transition-transform hover:scale-105">
                            <Image
                                src="/logo2.png"
                                alt="MEEY"
                                fill
                                className="object-contain"
                                priority
                            />
                        </Link>
                        <p className="text-gold-brand/60 text-xs leading-relaxed max-w-xs mx-auto md:mx-0 font-sans font-light">
                            L'excellence au service de vos ongles. Des collections exclusives et des formules haut de gamme sélectionnées avec passion pour les artistes de l'onglerie.
                        </p>
                        <div className="flex justify-center md:justify-start space-x-4 pt-2">
                            <a 
                                href="https://www.instagram.com/meey_nailshop?igsh=MW9hd3FiendjajY5bw==" 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="p-3 bg-white/5 rounded-full hover:bg-gold-brand hover:text-rouge-brand transition-all text-gold-brand border border-gold-brand/10 hover:scale-105 active:scale-95"
                                aria-label="Suivez-nous sur Instagram"
                            >
                                <Instagram size={18} />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="text-center md:text-left md:pl-8">
                        <h4 className="font-italiana text-lg text-gold-brand mb-6 font-bold uppercase tracking-[0.2em]">Navigation</h4>
                        <ul className="space-y-4 text-xs text-gold-brand/60 font-sans font-medium">
                            <li>
                                <Link href="/catalogue" className="hover:text-white transition-colors duration-300 hover:translate-x-1 inline-block">
                                    Toute la collection
                                </Link>
                            </li>
                            {categories.map((cat) => (
                                <li key={cat.id}>
                                    <Link href={`/categories/${cat.slug}`} className="hover:text-white transition-colors duration-300 hover:translate-x-1 inline-block">
                                        {cat.name}
                                    </Link>
                                </li>
                            ))}
                            <li>
                                <Link href="/nouveautes" className="hover:text-white transition-colors duration-300 hover:translate-x-1 inline-block">
                                    Nouveautés
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Customer Service */}
                    <div className="text-center md:text-left md:pl-4">
                        <h4 className="font-italiana text-lg text-gold-brand mb-6 font-bold uppercase tracking-[0.2em]">Maison MEEY</h4>
                        <ul className="space-y-4 text-xs text-gold-brand/60 font-sans font-medium">
                            <li>
                                <Link href="/compte" className="hover:text-white transition-colors duration-300 hover:translate-x-1 inline-block">
                                    Mon Compte
                                </Link>
                            </li>
                            <li>
                                <Link href="/panier" className="hover:text-white transition-colors duration-300 hover:translate-x-1 inline-block">
                                    Suivi de commande
                                </Link>
                            </li>
                            <li>
                                <Link href="/livraison" className="hover:text-white transition-colors duration-300 hover:translate-x-1 inline-block">
                                    Livraison & Tarifs
                                </Link>
                            </li>
                            <li>
                                <Link href="/cgv" className="hover:text-white transition-colors duration-300 hover:translate-x-1 inline-block">
                                    Conditions Générales
                                </Link>
                            </li>
                            <li>
                                <Link href="/contact" className="hover:text-white transition-colors duration-300 hover:translate-x-1 inline-block">
                                    Nous contacter
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Newsletter & Address */}
                    <div className="space-y-8 text-center md:text-left">
                        <div className="space-y-4">
                            <h4 className="font-italiana text-lg text-gold-brand font-bold uppercase tracking-[0.2em]">Offres Privées</h4>
                            <p className="text-xs text-gold-brand/60 leading-relaxed font-playfair italic max-w-xs mx-auto md:mx-0">
                                Recevez nos lancements de collections et invitations exclusives de la maison.
                            </p>
                            <form onSubmit={(e) => e.preventDefault()} className="relative flex items-center border-b border-gold-brand/20 py-2 focus-within:border-gold-brand transition-colors duration-300">
                                <input 
                                    type="email" 
                                    placeholder="Votre adresse email" 
                                    className="bg-transparent border-none text-xs text-creme placeholder-gold-brand/40 focus:outline-none focus:ring-0 w-full pr-12 font-sans font-light"
                                />
                                <button 
                                    type="submit" 
                                    className="absolute right-0 text-[10px] font-black text-gold-brand hover:text-white transition-colors uppercase tracking-widest"
                                >
                                    S'inscrire
                                </button>
                            </form>
                        </div>
                        
                        <div className="space-y-3 pt-2">
                            <h4 className="font-italiana text-xs text-gold-brand font-bold uppercase tracking-[0.2em] opacity-80">Maison Mère</h4>
                            <div className="flex flex-col md:flex-row items-center md:items-start md:space-x-2 gap-2 text-xs text-gold-brand/60">
                                <MapPin size={16} className="text-gold-brand shrink-0 mt-0.5" />
                                <span className="font-sans font-light">{settings.shopAddress || "Alger, Algérie"}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="pt-8 border-t border-gold-brand/5 flex flex-col md:flex-row justify-between items-center text-[9px] uppercase tracking-[0.25em] text-gold-brand/40 gap-6">
                    <p>© 2026 {settings.shopName || "MEEY Nail Shop"}. Tous droits réservés.</p>
                    <p className="font-bold text-gold-brand/50 tracking-[0.3em] italic">Conçu & Réalisé par Selma Haci</p>
                    <div className="flex space-x-6 mt-4 md:mt-0 font-sans font-medium">
                        <span className="flex items-center gap-2">
                            <div className="w-1 h-1 bg-gold-brand/30 rounded-full"></div>
                            Paiement à la livraison
                        </span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
