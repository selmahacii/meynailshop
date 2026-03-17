'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Instagram, Facebook, Mail, Phone, MapPin } from 'lucide-react';
import { useSettings } from '@/lib/hooks/useSettings';

export default function Footer() {
    const currentYear = new Date().getFullYear();
    const { settings } = useSettings();

    return (
        <footer className="bg-rouge-brand text-gold-brand pt-16 pb-8">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                    {/* Brand Info */}
                    <div className="space-y-6 flex flex-col items-center md:items-start text-center md:text-left">
                        <Link href="/" className="group transition-transform hover:scale-105">
                            <div className="relative w-32 h-32 bg-white rounded-full p-6 shadow-[0_10px_30px_rgba(0,0,0,0.3)] border-2 border-gold-brand/20">
                                <Image
                                    src="/logo2.png"
                                    alt={settings.shopName || "MEEY Nail Shop"}
                                    fill
                                    className="object-contain p-2"
                                    priority
                                />
                            </div>
                        </Link>
                        <p className="text-gold-brand/70 text-sm leading-relaxed max-w-xs mx-auto md:mx-0">
                            L'excellence au service de vos ongles. Produits premium sélectionnés pour les professionnels et passionnés d'onglerie en Algérie.
                        </p>
                        <div className="flex justify-center md:justify-start space-x-4">
                            <a href="#" className="p-3 bg-white/5 rounded-full hover:bg-gold-brand hover:text-rouge-brand transition-all text-gold-brand border border-gold-brand/10">
                                <Instagram size={20} />
                            </a>
                            <a href="#" className="p-3 bg-white/5 rounded-full hover:bg-gold-brand hover:text-rouge-brand transition-all text-gold-brand border border-gold-brand/10">
                                <Facebook size={20} />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="text-center md:text-left">
                        <h4 className="font-serif text-xl text-gold-brand mb-6 font-bold tracking-wide">Navigation</h4>
                        <ul className="space-y-4 text-sm text-gold-brand/70">
                            <li><Link href="/catalogue" className="hover:text-gold-brand transition-all hover:pl-2">Toute la collection</Link></li>
                            <li><Link href="/categories/vernis-gel" className="hover:text-gold-brand transition-all hover:pl-2">Vernis Gel</Link></li>
                            <li><Link href="/categories/gel-uv" className="hover:text-gold-brand transition-all hover:pl-2">Gel UV & Résine</Link></li>
                            <li><Link href="/categories/materiel" className="hover:text-gold-brand transition-all hover:pl-2">Matériel & Lampes</Link></li>
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
                            <li className="flex flex-col md:flex-row items-center md:items-start md:space-x-3 gap-2">
                                <Phone size={20} className="text-gold-brand shrink-0" />
                                <a href="tel:0775436562" className="hover:text-gold-brand transition-colors font-medium">
                                    0775436562
                                </a>
                            </li>
                            <li className="flex flex-col md:flex-row items-center md:items-start md:space-x-3 gap-2">
                                <Mail size={20} className="text-gold-brand shrink-0" />
                                <a href="mailto:meeybouabdellah@gmail.com" className="hover:text-gold-brand transition-colors font-medium break-all">
                                    meeybouabdellah@gmail.com
                                </a>
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
