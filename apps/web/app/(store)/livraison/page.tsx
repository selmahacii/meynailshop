'use client';

import { useState } from 'react';
import { Truck, Clock, ShieldCheck, MapPin, Search, Info, Package, Store, ChevronRight } from 'lucide-react';
import { useSettings } from '@/lib/hooks/useSettings';
import { SHIPPING_RATES, WilayaShipping } from '@/lib/constants/shipping';
import { motion, AnimatePresence } from 'framer-motion';

export default function LivraisonPage() {
    const { settings, loading } = useSettings();
    const [searchTerm, setSearchTerm] = useState('');

    const filteredWilayas = SHIPPING_RATES.filter(w => 
        w.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        w.id.includes(searchTerm)
    );

    return (
        <div className="min-h-screen bg-creme pt-32 pb-20">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                {/* Hero section */}
                <div className="text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-rouge-brand/5 rounded-full text-rouge-brand text-xs font-black uppercase tracking-[0.2em] mb-6"
                    >
                        <Truck size={14} />
                        Transparence Totale
                    </motion.div>
                    <motion.h1 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-6xl font-serif text-rouge-brand mb-8"
                    >
                        Expedition & Tarifs
                    </motion.h1>
                    <p className="max-w-2xl mx-auto text-encre3 text-lg mb-12">
                        Retrouvez ci-dessous la liste complete des tarifs de livraison pour les 58 Wilayas d'Algerie.
                    </p>
                    
                    {/* Search Bar */}
                    <div className="max-w-xl mx-auto relative mb-16">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Search className="h-5 w-5 text-gold-brand" />
                        </div>
                        <input
                            type="text"
                            placeholder="Recherchez votre Wilaya..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-5 bg-white border-2 border-gold-brand/20 rounded-2xl shadow-sm focus:border-rouge-brand focus:ring-0 transition-all text-encre font-medium"
                        />
                    </div>
                </div>

                {/* Free Shipping Alert */}
                {!loading && (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="max-w-4xl mx-auto mb-12 bg-gold-brand p-[1px] rounded-2xl overflow-hidden shadow-lg"
                    >
                        <div className="bg-white px-8 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-gold-brand/10 rounded-full flex items-center justify-center">
                                    <ShieldCheck className="text-gold-brand w-6 h-6" />
                                </div>
                                <div>
                                    <h4 className="text-encre font-bold">Livraison Gratuite</h4>
                                    <p className="text-encre3 text-sm">Offerte pour toute commande superieure a {settings.freeShippingThreshold} DA</p>
                                </div>
                            </div>
                            <a href="/catalogue" className="text-rouge-brand font-black uppercase tracking-widest text-[10px] flex items-center gap-2 group">
                                Profiter de l'offre <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </a>
                        </div>
                    </motion.div>
                )}

                {/* Full Rates Table */}
                <div className="max-w-5xl mx-auto bg-white rounded-[40px] shadow-xl overflow-hidden border border-gold-brand/10 mb-20">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-creme border-b border-gold-brand/10">
                                <tr>
                                    <th className="px-8 py-6 text-xs font-black uppercase tracking-[0.2em] text-gold-brand">Code</th>
                                    <th className="px-8 py-6 text-xs font-black uppercase tracking-[0.2em] text-gold-brand">Wilaya</th>
                                    <th className="px-8 py-6 text-xs font-black uppercase tracking-[0.2em] text-gold-brand flex items-center gap-2">
                                        <Package size={14} /> Domicile
                                    </th>
                                    <th className="px-8 py-6 text-xs font-black uppercase tracking-[0.2em] text-gold-brand">
                                        <div className="flex items-center gap-2">
                                            <Store size={14} /> Bureau / Relais
                                        </div>
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gold-brand/5">
                                <AnimatePresence mode="popLayout">
                                    {filteredWilayas.length > 0 ? (
                                        filteredWilayas.map((w, index) => (
                                            <motion.tr 
                                                key={w.id}
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                transition={{ delay: index * 0.01 }}
                                                className="hover:bg-creme/50 transition-colors group"
                                            >
                                                <td className="px-8 py-5 text-sm font-black text-gold-brand/40 group-hover:text-gold-brand transition-colors">
                                                    {w.id}
                                                </td>
                                                <td className="px-8 py-5 text-sm font-bold text-encre">
                                                    {w.name}
                                                </td>
                                                <td className="px-8 py-5 text-sm font-black text-rouge-brand">
                                                    {w.homeRate} DA
                                                </td>
                                                <td className="px-8 py-5 text-sm font-black text-encre3">
                                                    {w.deskRate} DA
                                                </td>
                                            </motion.tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={4} className="px-8 py-20 text-center text-encre3 italic font-serif opacity-50">
                                                Aucune wilaya ne correspond a votre recherche...
                                            </td>
                                        </tr>
                                    )}
                                </AnimatePresence>
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Info Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gold-brand/10 text-center">
                        <MapPin className="text-rouge-brand w-8 h-8 mx-auto mb-6" />
                        <h3 className="text-lg font-bold text-encre mb-3 tracking-tight">69 Wilayas</h3>
                        <p className="text-encre3 text-sm">Une couverture nationale complete pour ne jamais manquer de vos essentiels.</p>
                    </div>
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gold-brand/10 text-center">
                        <Clock className="text-rouge-brand w-8 h-8 mx-auto mb-6" />
                        <h3 className="text-lg font-bold text-encre mb-3 tracking-tight">Rapidite</h3>
                        <p className="text-encre3 text-sm">24h sur Alger et 48h-72h sur les grandes villes du Nord.</p>
                    </div>
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gold-brand/10 text-center">
                        <ShieldCheck className="text-rouge-brand w-8 h-8 mx-auto mb-6" />
                        <h3 className="text-lg font-bold text-encre mb-3 tracking-tight">Securite</h3>
                        <p className="text-encre3 text-sm">Paiement a la livraison pour une tranquillite d'esprit absolue.</p>
                    </div>
                </div>

                {/* Help Section */}
                <div className="bg-encre p-12 rounded-[50px] text-center text-white relative overflow-hidden shadow-2xl">
                    <div className="relative z-10">
                        <h2 className="text-3xl font-serif mb-6 text-gold-brand">Une question sur votre colis ?</h2>
                        <p className="max-w-xl mx-auto mb-8 text-white/70">
                            Notre service client est a votre écoute de de 9h a 18h pour vous accompagner durant tout le processus de livraison.
                        </p>
                        <a href="/contact" className="inline-block bg-gold-brand text-encre px-12 py-4 rounded-full font-black uppercase tracking-widest text-xs hover:scale-105 transition-transform shadow-xl">
                            Contacter le support client
                        </a>
                    </div>
                    {/* Background decor */}
                    <div className="absolute top-0 right-0 w-96 h-96 bg-rouge-brand/10 rounded-full -mr-32 -mt-32 blur-[100px]"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-gold-brand/5 rounded-full -ml-20 -mb-20 blur-[80px]"></div>
                </div>
            </div>
        </div>
    );
}
