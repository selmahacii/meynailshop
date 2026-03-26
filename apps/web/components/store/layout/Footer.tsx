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
        <footer className="bg-rouge-brand text-gold-brand pt-16 pb-8">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                    {/* Brand Info */}
                    <div className="space-y-6 flex flex-col items-center md:items-start text-center md:text-left">
                        <p className="text-gold-brand/70 text-sm leading-relaxed max-w-xs mx-auto md:mx-0 pt-4">
                            L'excellence au service de vos ongles. Produits premium sélectionnés pour les professionnels et passionnés d'onglerie en Algérie.
                        </p>
                        <div className="flex justify-center md:justify-start space-x-4">
                            <a 
                                href="https://www.instagram.com/meey_nailshop?igsh=MW9hd3FiendjajY5bw==" 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="p-3 bg-white/5 rounded-full hover:bg-gold-brand hover:text-rouge-brand transition-all text-gold-brand border border-gold-brand/10"
                                aria-label="Suivez-nous sur Instagram"
                            >
                                <Instagram size={20} />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="text-center md:text-left">
                        <h4 className="font-serif text-xl text-gold-brand mb-6 font-bold tracking-wide">Navigation</h4>
                        <ul className="space-y-4 text-sm text-gold-brand/70">
                            <li><Link href="/catalogue" className="hover:text-gold-brand transition-all hover:pl-2">Toute la collection</Link></li>
                            {categories.map((cat) => (
                                <li key={cat.id}>
                                    <Link href={`/categories/${cat.slug}`} className="hover:text-gold-brand transition-all hover:pl-2">
                                        {cat.name}
                                    </Link>
                                </li>
                            ))}
                            <li><Link href="/nouveautes" className="hover:text-gold-brand transition-all hover:pl-2">Nouveautés</Link></li>
                        </ul>
                    </div>

                    {/* Customer Service */}
                    <div className="text-center md:text-left">
                        <h4 className="font-serif text-xl text-gold-brand mb-6 font-bold tracking-wide">Aide & Support</h4>
                        <ul className="space-y-4 text-sm text-gold-brand/70">
                            <li><Link href="/compte" className="hover:text-gold-brand transition-all hover:pl-2">Mon Compte</Link></li>
                            <li><Link href="/panier" className="hover:text-gold-brand transition-all hover:pl-2">Suivi de commande</Link></li>
                            <li><Link href="/livraison" className="hover:text-gold-brand transition-all hover:pl-2">Livraison & Tarifs</Link></li>
                            <li><Link href="/cgv" className="hover:text-gold-brand transition-all hover:pl-2">Conditions Générales</Link></li>
                            <li><Link href="/contact" className="hover:text-gold-brand transition-all hover:pl-2">Nous contacter</Link></li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div className="text-center md:text-left">
                        <h4 className="font-serif text-xl text-gold-brand mb-6 font-bold tracking-wide">Contact</h4>
                        <ul className="space-y-5 text-sm text-gold-brand/70">
                            <li className="flex flex-col md:flex-row items-center md:items-start md:space-x-3 gap-2">
                                <MapPin size={20} className="text-gold-brand shrink-0" />
                                <span>{settings.shopAddress || "Alger, Algérie"}</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="pt-8 border-t border-gold-brand/5 flex flex-col md:flex-row justify-between items-center text-[10px] uppercase tracking-widest text-gold-brand/40 gap-6">
                    <p>(c) 2026 {settings.shopName || "MEEY Nail Shop"}. Tous droits reserves.</p>
                    <p className="font-bold text-gold-brand/60 tracking-[0.3em] italic">Conçu & Réalisé par Selma Haci</p>
                    <div className="flex space-x-6 mt-4 md:mt-0">
                        <span className="flex items-center gap-2">
                            <div className="w-1 h-1 bg-gold-brand/40 rounded-full"></div>
                            Paiement a la livraison
                        </span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
