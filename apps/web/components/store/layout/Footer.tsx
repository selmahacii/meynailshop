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
                    <div className="space-y-6">
                        <Link href="/" className="flex flex-col items-start px-2">
                            <div className="relative w-24 h-24 rounded-full overflow-hidden mb-2">
                                <Image
                                    src="/logo.png"
                                    alt={settings.shopName || "MEEY Nail Shop"}
                                    fill
                                    className="object-cover scale-[1.18]"
                                />
                            </div>
                        </Link>
                        <p className="text-gold-brand/70 text-sm leading-relaxed max-w-xs">
                            L'excellence au service de vos ongles. Produits premium selectionnes pour les professionnels et passionnes d'onglerie en Algerie.
                        </p>
                        <div className="flex space-x-4">
                            <a href="#" className="p-2 bg-black/10 rounded-full hover:bg-gold-brand hover:text-rouge-brand transition-all text-gold-brand">
                                <Instagram size={18} />
                            </a>
                            <a href="#" className="p-2 bg-black/10 rounded-full hover:bg-gold-brand hover:text-rouge-brand transition-all text-gold-brand">
                                <Facebook size={18} />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="font-serif text-lg text-gold-brand mb-6">Navigation</h4>
                        <ul className="space-y-4 text-sm text-gold-brand/70">
                            <li><Link href="/catalogue" className="hover:text-gold-brand transition-colors">Toute la collection</Link></li>
                            <li><Link href="/categories/vernis-gel" className="hover:text-gold-brand transition-colors">Vernis Gel</Link></li>
                            <li><Link href="/categories/gel-uv" className="hover:text-gold-brand transition-colors">Gel UV & Resine</Link></li>
                            <li><Link href="/categories/materiel" className="hover:text-gold-brand transition-colors">Materiel & Lampes</Link></li>
                            <li><Link href="/nouveautes" className="hover:text-gold-brand transition-colors">Nouveautes</Link></li>
                        </ul>
                    </div>

                    {/* Customer Service */}
                    <div>
                        <h4 className="font-serif text-lg text-gold-brand mb-6">Aide & Support</h4>
                        <ul className="space-y-4 text-sm text-gold-brand/70">
                            <li><Link href="/compte" className="hover:text-gold-brand transition-colors">Mon Compte</Link></li>
                            <li><Link href="/panier" className="hover:text-gold-brand transition-colors">Suivi de commande</Link></li>
                            <li><Link href="/livraison" className="hover:text-gold-brand transition-colors">Livraison & Tarifs</Link></li>
                            <li><Link href="/cgv" className="hover:text-gold-brand transition-colors">Conditions Generales</Link></li>
                            <li><Link href="/contact" className="hover:text-gold-brand transition-colors">Nous contacter</Link></li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h4 className="font-serif text-lg text-gold-brand mb-6">Contact</h4>
                        <ul className="space-y-4 text-sm text-gold-brand/70">
                            <li className="flex items-start space-x-3">
                                <MapPin size={18} className="text-gold-brand shrink-0" />
                                <span>{settings.shopAddress || "Alger, Algerie"}</span>
                            </li>
                            <li className="flex items-center space-x-3">
                                <Phone size={18} className="text-gold-brand shrink-0" />
                                <a href={`tel:${settings.shopPhone || "0775436562"}`} className="hover:text-gold-brand transition-colors">
                                    {settings.shopPhone || "0775436562"}
                                </a>
                            </li>
                            <li className="flex items-center space-x-3">
                                <Mail size={18} className="text-gold-brand shrink-0" />
                                <a href={`mailto:${settings.shopEmail || "meeybouabdellah@gmail.com"}`} className="hover:text-gold-brand transition-colors">
                                    {settings.shopEmail || "meeybouabdellah@gmail.com"}
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
