'use client';

import { useState } from 'react';
import { Bell, Download, Save, Store, Truck, CreditCard, Shield, Globe, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

const tabs = [
    { key: 'boutique', label: 'Boutique', icon: Store },
    { key: 'livraison', label: 'Livraison', icon: Truck },
    { key: 'paiement', label: 'Paiement', icon: CreditCard },
    { key: 'securite', label: 'Sécurité', icon: Shield },
    { key: 'seo', label: 'SEO & URL', icon: Globe },
];

export default function AdminSettingsPage() {
    const [activeTab, setActiveTab] = useState('boutique');

    return (
        <div className="space-y-8 pb-12">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-serif text-encre">Paramètres</h1>
                    <p className="text-encre3 text-[10px] uppercase tracking-widest font-bold mt-1">Configuration de la boutique</p>
                </div>
                <div className="flex items-center space-x-3">
                    <button className="p-2.5 bg-white border border-creme2 rounded-sm text-encre3 hover:text-or hover:border-or transition-all shadow-sm"><Bell size={18} /></button>
                    <button className="flex items-center space-x-2 px-6 py-2.5 bg-[#1A0A0A] text-creme rounded-sm text-sm font-bold uppercase tracking-widest hover:bg-rouge-deep transition-all shadow-md">
                        <Save size={16} className="text-or" /><span>Sauvegarder</span>
                    </button>
                    <Link href="/" className="px-5 py-2.5 border border-encre text-encre rounded-sm text-sm font-bold hover:bg-encre hover:text-creme transition-all">Voir la boutique</Link>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Sidebar Tabs */}
                <div className="lg:col-span-3">
                    <div className="bg-white rounded-sm border border-creme2 shadow-lg overflow-hidden">
                        {tabs.map((tab, i) => (
                            <button
                                key={tab.key}
                                onClick={() => setActiveTab(tab.key)}
                                className={cn(
                                    "w-full flex items-center space-x-3 px-6 py-4 text-left transition-all border-b border-creme2 last:border-0 group",
                                    activeTab === tab.key
                                        ? "bg-[#1A0A0A] text-or"
                                        : "text-encre3 hover:bg-creme/50 hover:text-encre"
                                )}
                            >
                                <tab.icon size={18} className={activeTab === tab.key ? "text-or" : "text-encre3 group-hover:text-or"} strokeWidth={1.5} />
                                <span className="text-sm font-bold uppercase tracking-widest">{tab.label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Settings Content */}
                <div className="lg:col-span-9 space-y-6">
                    {activeTab === 'boutique' && (
                        <>
                            <div className="bg-white rounded-sm border border-creme2 shadow-lg p-8">
                                <h2 className="font-serif text-xl text-encre mb-8 pb-4 border-b border-creme2">Informations générales</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {[
                                        { label: 'Nom de la boutique', value: 'MEEY Nail Shop', type: 'text' },
                                        { label: 'E-mail de contact', value: 'contact@meey.dz', type: 'email' },
                                        { label: 'Numéro de téléphone', value: '0555 55 55 55', type: 'tel' },
                                        { label: 'Adresse', value: 'Alger, Algérie', type: 'text' },
                                    ].map((field, i) => (
                                        <div key={i}>
                                            <label className="block text-[10px] font-black uppercase tracking-widest text-encre3 mb-2">{field.label}</label>
                                            <input
                                                type={field.type}
                                                defaultValue={field.value}
                                                className="w-full px-4 py-3 bg-creme border border-creme2 rounded-sm text-sm text-encre focus:outline-none focus:border-or focus:ring-1 focus:ring-or transition-all"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="bg-white rounded-sm border border-creme2 shadow-lg p-8">
                                <h2 className="font-serif text-xl text-encre mb-8 pb-4 border-b border-creme2">Gestion du stock</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-[10px] font-black uppercase tracking-widest text-encre3 mb-2">Seuil d'alerte par défaut</label>
                                        <input type="number" defaultValue={5} className="w-full px-4 py-3 bg-creme border border-creme2 rounded-sm text-sm text-encre focus:outline-none focus:border-or focus:ring-1 focus:ring-or transition-all" />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black uppercase tracking-widest text-encre3 mb-2">Frais de livraison par défaut (DA)</label>
                                        <input type="number" defaultValue={600} className="w-full px-4 py-3 bg-creme border border-creme2 rounded-sm text-sm text-encre focus:outline-none focus:border-or focus:ring-1 focus:ring-or transition-all" />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black uppercase tracking-widest text-encre3 mb-2">Seuil livraison gratuite (DA)</label>
                                        <input type="number" defaultValue={10000} className="w-full px-4 py-3 bg-creme border border-creme2 rounded-sm text-sm text-encre focus:outline-none focus:border-or focus:ring-1 focus:ring-or transition-all" />
                                    </div>
                                </div>
                            </div>

                            <div className="bg-yellow-50 border border-yellow-200 rounded-sm p-6 flex items-start space-x-4">
                                <AlertTriangle size={20} className="text-yellow-600 shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-sm font-bold text-yellow-800">Zone de danger</p>
                                    <p className="text-xs text-yellow-700 mt-1">Les actions ci-dessous sont irréversibles. Procédez avec prudence.</p>
                                    <div className="flex space-x-3 mt-4">
                                        <button className="px-4 py-2 bg-white border border-yellow-300 text-yellow-700 text-xs font-bold uppercase tracking-widest rounded-sm hover:bg-yellow-100 transition-all">Vider les données de test</button>
                                        <button className="px-4 py-2 bg-red-600 text-white text-xs font-bold uppercase tracking-widest rounded-sm hover:bg-red-700 transition-all shadow-md">Réinitialiser la boutique</button>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}

                    {activeTab !== 'boutique' && (
                        <div className="bg-white rounded-sm border border-creme2 shadow-lg p-16 flex flex-col items-center justify-center text-center">
                            <div className="w-16 h-16 bg-creme rounded-full flex items-center justify-center mb-6 border border-creme2">
                                {(() => {
                                    const t = tabs.find(t => t.key === activeTab);
                                    if (!t) return null;
                                    const Icon = t.icon;
                                    return <Icon size={28} className="text-encre3" strokeWidth={1.5} />;
                                })()}
                            </div>
                            <h3 className="font-serif text-2xl text-encre mb-4">Section en cours de développement</h3>
                            <p className="text-encre3 text-sm max-w-sm">Les paramètres de <span className="font-bold text-or">{tabs.find(t => t.key === activeTab)?.label}</span> seront disponibles prochainement.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
