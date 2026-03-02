import Link from 'next/link';
import { Instagram, Facebook, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-encre text-creme pt-16 pb-8">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                    {/* Brand Info */}
                    <div className="space-y-6">
                        <Link href="/" className="flex flex-col">
                            <span className="font-serif text-3xl text-or leading-none">MEEY</span>
                            <span className="text-xs uppercase tracking-[0.3em] text-creme/60">Nail Shop</span>
                        </Link>
                        <p className="text-creme2/70 text-sm leading-relaxed max-w-xs">
                            L'excellence au service de vos ongles. Produits premium sélectionnés pour les professionnels et passionnés d'onglerie en Algérie.
                        </p>
                        <div className="flex space-x-4">
                            <a href="#" className="p-2 bg-encre2 rounded-full hover:bg-rouge-mid transition-colors text-or">
                                <Instagram size={18} />
                            </a>
                            <a href="#" className="p-2 bg-encre2 rounded-full hover:bg-rouge-mid transition-colors text-or">
                                <Facebook size={18} />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="font-serif text-lg text-or mb-6">Navigation</h4>
                        <ul className="space-y-4 text-sm text-creme2/70">
                            <li><Link href="/catalogue" className="hover:text-or transition-colors">Toute la collection</Link></li>
                            <li><Link href="/categories/vernis-gel" className="hover:text-or transition-colors">Vernis Gel</Link></li>
                            <li><Link href="/categories/gel-uv" className="hover:text-or transition-colors">Gel UV & Résine</Link></li>
                            <li><Link href="/categories/materiel" className="hover:text-or transition-colors">Matériel & Lampes</Link></li>
                            <li><Link href="/nouveautes" className="hover:text-or transition-colors">Nouveautés</Link></li>
                        </ul>
                    </div>

                    {/* Customer Service */}
                    <div>
                        <h4 className="font-serif text-lg text-or mb-6">Aide & Support</h4>
                        <ul className="space-y-4 text-sm text-creme2/70">
                            <li><Link href="/compte" className="hover:text-or transition-colors">Mon Compte</Link></li>
                            <li><Link href="/panier" className="hover:text-or transition-colors">Suivi de commande</Link></li>
                            <li><Link href="/livraison" className="hover:text-or transition-colors">Livraison & Tarifs</Link></li>
                            <li><Link href="/cgv" className="hover:text-or transition-colors">Conditions Générales</Link></li>
                            <li><Link href="/contact" className="hover:text-or transition-colors">Nous contacter</Link></li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h4 className="font-serif text-lg text-or mb-6">Contact</h4>
                        <ul className="space-y-4 text-sm text-creme2/70">
                            <li className="flex items-start space-x-3">
                                <MapPin size={18} className="text-or shrink-0" />
                                <span>Alger, Algérie</span>
                            </li>
                            <li className="flex items-center space-x-3">
                                <Phone size={18} className="text-or shrink-0" />
                                <span>+213 (0) 555 55 55 55</span>
                            </li>
                            <li className="flex items-center space-x-3">
                                <Mail size={18} className="text-or shrink-0" />
                                <span>contact@meey.dz</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="pt-8 border-t border-creme/5 flex flex-col md:flex-row justify-between items-center text-[10px] uppercase tracking-widest text-creme/40">
                    <p>© {currentYear} MEEY Nail Shop. Tous droits réservés.</p>
                    <div className="flex space-x-6 mt-4 md:mt-0">
                        <span>Paiement à la livraison</span>
                        <span>Virement CCP</span>
                        <span>Baridimob</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
