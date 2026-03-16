'use client';

import { useState, useEffect } from 'react';
import { Bell, Download, Save, Store, Truck, CreditCard, Shield, Globe, AlertTriangle, Loader, AlertCircle, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { SettingsAPI } from '@/lib/api/client';

const tabs = [
    { key: 'boutique', label: 'Boutique', icon: Store },
    { key: 'livraison', label: 'Livraison', icon: Truck },
    { key: 'paiement', label: 'Paiement', icon: CreditCard },
    { key: 'securite', label: 'Sécurité', icon: Shield },
    { key: 'seo', label: 'SEO & URL', icon: Globe },
];

import { useSettings } from '@/lib/hooks/useSettings';

export default function AdminSettingsPage() {
    const { refreshSettings } = useSettings();
    const [activeTab, setActiveTab] = useState('boutique');
    const [settings, setSettings] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [saving, setSaving] = useState(false);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await SettingsAPI.get();
            if (res.success) {
                setSettings(res.data);
            } else {
                setError(res.error || 'Erreur lors du chargement des paramètres');
            }
        } catch (err) {
            console.error('Settings fetch error:', err);
            setError('Impossible de communiquer avec le serveur');
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setSuccessMessage(null);
        setError(null);
        try {
            // Filtrer pour ne pas envoyer id, updatedAt ou d'autres champs non autorisés (whitelist/forbidNonWhitelisted)
            const { id, updatedAt, ...payload } = settings;
            const res = await SettingsAPI.update(payload);
            if (res.success) {
                setSuccessMessage('Paramètres enregistrés avec succès');
                // Refresh global cache
                await refreshSettings();
                setTimeout(() => setSuccessMessage(null), 3000);
            } else {
                setError(res.error || 'Erreur lors de l\'enregistrement');
            }
        } catch (err) {
            setError('Erreur lors de la sauvegarde');
        } finally {
            setSaving(false);
        }
    };

    const handleChange = (key: string, value: any) => {
        setSettings((prev: any) => ({ ...prev, [key]: value }));
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-[60vh]">
                <div className="text-center">
                    <Loader className="w-10 h-10 text-or animate-spin mx-auto mb-4" />
                    <p className="text-encre3 font-bold uppercase tracking-widest text-[10px]">Chargement des paramètres...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8 pb-12">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-serif text-encre">Paramètres</h1>
                    <p className="text-encre3 text-[10px] uppercase tracking-widest font-bold mt-1">Configuration de la boutique</p>
                </div>
                <div className="flex items-center space-x-3">
                    {successMessage && (
                        <div className="flex items-center gap-2 text-green-600 bg-green-50 px-4 py-2 rounded-sm border border-green-100 animate-fade-in">
                            <CheckCircle size={16} />
                            <span className="text-xs font-bold uppercase tracking-widest">{successMessage}</span>
                        </div>
                    )}
                    <button className="p-2.5 bg-white border border-creme2 rounded-sm text-encre3 hover:text-or hover:border-or transition-all shadow-sm"><Bell size={18} /></button>
                    <button 
                        onClick={handleSave}
                        disabled={saving}
                        className="flex items-center space-x-2 px-6 py-2.5 bg-[#1A0A0A] text-creme rounded-sm text-sm font-bold uppercase tracking-widest hover:bg-rouge-deep transition-all shadow-md disabled:opacity-50"
                    >
                        {saving ? <Loader size={16} className="animate-spin text-or" /> : <Save size={16} className="text-or" />}
                        <span>{saving ? 'Sauvegarde...' : 'Sauvegarder'}</span>
                    </button>
                    <Link href="/" className="px-5 py-2.5 border border-encre text-encre rounded-sm text-sm font-bold hover:bg-encre hover:text-creme transition-all">Voir la boutique</Link>
                </div>
            </div>

            {error && (
                <div className="p-4 bg-red-50 border border-red-100 rounded-sm text-red-600 flex items-center gap-3">
                    <AlertTriangle size={20} />
                    <p className="font-bold text-sm">{error}</p>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Sidebar Tabs */}
                <div className="lg:col-span-3">
                    <div className="bg-white rounded-sm border border-creme2 shadow-lg overflow-hidden">
                        {tabs.map((tab) => (
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
                                        { label: 'Nom de la boutique', key: 'shopName', type: 'text' },
                                        { label: 'E-mail de contact', key: 'shopEmail', type: 'email' },
                                        { label: 'Numéro de téléphone', key: 'shopPhone', type: 'tel' },
                                        { label: 'Adresse', key: 'shopAddress', type: 'text' },
                                    ].map((field) => (
                                        <div key={field.key}>
                                            <label className="block text-[10px] font-black uppercase tracking-widest text-encre3 mb-2">{field.label}</label>
                                            <input
                                                type={field.type}
                                                value={settings?.[field.key] || ''}
                                                onChange={(e) => handleChange(field.key, e.target.value)}
                                                className="w-full px-4 py-3 bg-creme border border-creme2 rounded-sm text-sm text-encre focus:outline-none focus:border-or focus:ring-1 focus:ring-or transition-all"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="bg-white rounded-sm border border-creme2 shadow-lg p-8">
                                <h2 className="font-serif text-xl text-encre mb-8 pb-4 border-b border-creme2">Gestion du stock & livraison</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-[10px] font-black uppercase tracking-widest text-encre3 mb-2">Seuil d'alerte par défaut</label>
                                        <input 
                                            type="number" 
                                            value={settings?.stockAlertDefault || 5} 
                                            onChange={(e) => handleChange('stockAlertDefault', parseInt(e.target.value))}
                                            className="w-full px-4 py-3 bg-creme border border-creme2 rounded-sm text-sm text-encre focus:outline-none focus:border-or focus:ring-1 focus:ring-or transition-all" 
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black uppercase tracking-widest text-encre3 mb-2">Frais de livraison par défaut (DA)</label>
                                        <input 
                                            type="number" 
                                            value={settings?.shippingCostDefault || 600} 
                                            onChange={(e) => handleChange('shippingCostDefault', parseInt(e.target.value))}
                                            className="w-full px-4 py-3 bg-creme border border-creme2 rounded-sm text-sm text-encre focus:outline-none focus:border-or focus:ring-1 focus:ring-or transition-all" 
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black uppercase tracking-widest text-encre3 mb-2">Seuil livraison gratuite (DA)</label>
                                        <input 
                                            type="number" 
                                            value={settings?.freeShippingThreshold || 10000} 
                                            onChange={(e) => handleChange('freeShippingThreshold', parseInt(e.target.value))}
                                            className="w-full px-4 py-3 bg-creme border border-creme2 rounded-sm text-sm text-encre focus:outline-none focus:border-or focus:ring-1 focus:ring-or transition-all" 
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="bg-yellow-50 border border-yellow-200 rounded-sm p-6 flex items-start space-x-4 shadow-sm">
                                <AlertTriangle size={20} className="text-yellow-600 shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-sm font-bold text-yellow-800 uppercase tracking-widest">Zone de danger</p>
                                    <p className="text-xs text-yellow-700 mt-1">Les actions ci-dessous sont irréversibles. Procédez avec prudence.</p>
                                    <div className="flex space-x-3 mt-4">
                                        <button className="px-4 py-2 bg-white border border-yellow-300 text-yellow-700 text-[10px] font-bold uppercase tracking-widest rounded-sm hover:bg-yellow-100 transition-all">Vider les données de test</button>
                                        <button className="px-4 py-2 bg-red-600 text-white text-[10px] font-bold uppercase tracking-widest rounded-sm hover:bg-red-700 transition-all shadow-md">Réinitialiser la boutique</button>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}

                    {activeTab === 'seo' && (
                        <div className="bg-white rounded-sm border border-creme2 shadow-lg p-20 flex flex-col items-center justify-center text-center relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-or/5 rounded-full blur-3xl -mr-32 -mt-32"></div>
                            <div className="absolute bottom-0 left-0 w-64 h-64 bg-rouge-brand/5 rounded-full blur-3xl -ml-32 -mb-32"></div>
                            
                            <div className="relative">
                                <div className="w-24 h-24 bg-creme rounded-full flex items-center justify-center mb-8 border border-creme2 relative z-10 shadow-inner">
                                    <Globe size={40} className="text-or animate-pulse" strokeWidth={1} />
                                </div>
                                <div className="absolute inset-0 bg-or/20 rounded-full blur-xl animate-pulse"></div>
                            </div>
                            
                            <div className="relative z-10">
                                <span className="inline-block px-4 py-1.5 bg-or/10 text-or text-[10px] font-black uppercase tracking-[0.2em] rounded-full mb-6 border border-or/20">
                                    Coming Soon
                                </span>
                                <h3 className="font-serif text-3xl text-encre mb-4">Section en cours de développement</h3>
                                <p className="text-encre3 text-sm max-w-md mx-auto leading-relaxed">
                                    Les paramètres de <span className="font-bold text-or underline decoration-or/30 underline-offset-4 uppercase tracking-widest">SEO & URL</span> seront disponibles prochainement pour optimiser votre visibilité sur les moteurs de recherche.
                                </p>
                            </div>
                        </div>
                    )}

                    {!['boutique', 'seo'].includes(activeTab) && (
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
