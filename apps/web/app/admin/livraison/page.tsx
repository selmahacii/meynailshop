'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
    Truck,
    Search,
    Save,
    Loader,
    RefreshCw,
    AlertCircle,
    CheckCircle2,
    ArrowLeft,
    RotateCcw,
    Package,
    Store,
    MapPin,
    SlidersHorizontal,
    Info,
    DollarSign,
    Sparkles,
    Check
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { SettingsAPI } from '@/lib/api/client';
import { SHIPPING_RATES, WilayaShipping } from '@/lib/constants/shipping';
import { useSettings } from '@/lib/hooks/useSettings';
import { toast } from 'sonner';

export default function AdminLivraisonPage() {
    const { refreshSettings } = useSettings();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [search, setSearch] = useState('');
    const [selectedRegion, setSelectedRegion] = useState<'all' | 'centre' | 'est' | 'ouest' | 'sud'>('all');

    // Delivery settings
    const [rates, setRates] = useState<WilayaShipping[]>(SHIPPING_RATES);
    const [defaultCost, setDefaultCost] = useState<number>(600);
    const [freeThreshold, setFreeThreshold] = useState<number>(10000);
    const [initialRatesJson, setInitialRatesJson] = useState<string>('');

    // Bulk adjustment tool
    const [showBulkTool, setShowBulkTool] = useState(false);
    const [bulkAmount, setBulkAmount] = useState<number>(50);
    const [bulkTarget, setBulkTarget] = useState<'home' | 'desk' | 'both'>('both');

    useEffect(() => {
        loadSettings();
    }, []);

    const loadSettings = async () => {
        setLoading(true);
        try {
            const res = await SettingsAPI.get();
            if (res.success && res.data) {
                const s = res.data;
                setDefaultCost(s.shippingCostDefault ?? 600);
                setFreeThreshold(s.freeShippingThreshold ?? 10000);

                let loadedRates: WilayaShipping[] = [];
                if (s.shippingFees && Array.isArray(s.shippingFees) && s.shippingFees.length > 0) {
                    loadedRates = s.shippingFees;
                } else {
                    loadedRates = SHIPPING_RATES;
                }
                setRates(loadedRates);
                setInitialRatesJson(JSON.stringify(loadedRates));
            }
        } catch {
            toast.error('Erreur lors du chargement des tarifs');
        } finally {
            setLoading(false);
        }
    };

    const handleRateChange = (id: string, field: keyof WilayaShipping, value: any) => {
        setRates(prev => prev.map(w => {
            if (w.id === id) {
                return { ...w, [field]: value };
            }
            return w;
        }));
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const payload = {
                shippingCostDefault: Number(defaultCost),
                freeShippingThreshold: Number(freeThreshold),
                shippingFees: rates
            };

            const res = await SettingsAPI.update(payload);
            if (res.success) {
                toast.success('🎉 Tarifs de livraison enregistrés et appliqués à la boutique !');
                setInitialRatesJson(JSON.stringify(rates));
                await refreshSettings();
            } else {
                toast.error(res.error || 'Erreur lors de l\'enregistrement');
            }
        } catch {
            toast.error('Erreur réseau lors de la sauvegarde');
        } finally {
            setSaving(false);
        }
    };

    const handleResetToDefault = () => {
        if (!confirm('Voulez-vous réinitialiser tous les tarifs de livraison aux valeurs d\'origine d\'Algérie ?')) return;
        setRates(SHIPPING_RATES);
        toast.info('Tarifs réinitialisés aux valeurs standards (cliquez sur Enregistrer pour confirmer).');
    };

    const handleApplyBulk = () => {
        if (isNaN(bulkAmount) || bulkAmount === 0) return;
        setRates(prev => prev.map(w => {
            const updated = { ...w };
            if (bulkTarget === 'home' || bulkTarget === 'both') {
                updated.homeRate = Math.max(0, (updated.homeRate || 0) + bulkAmount);
            }
            if ((bulkTarget === 'desk' || bulkTarget === 'both') && updated.deskRate !== null && updated.deskRate !== undefined) {
                updated.deskRate = Math.max(0, updated.deskRate + bulkAmount);
            }
            return updated;
        }));
        toast.success(`Ajustement de ${bulkAmount > 0 ? `+${bulkAmount}` : bulkAmount} DA appliqué sur les tarifs !`);
        setShowBulkTool(false);
    };

    // Region classification for quick filter
    const getWilayaRegion = (id: string): 'centre' | 'est' | 'ouest' | 'sud' => {
        const num = parseInt(id, 10);
        // Sud
        if ([1, 8, 11, 30, 32, 33, 37, 39, 45, 47, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58].includes(num)) {
            return 'sud';
        }
        // Centre
        if ([9, 10, 15, 16, 26, 35, 42, 44].includes(num)) {
            return 'centre';
        }
        // Ouest
        if ([2, 13, 14, 20, 22, 27, 29, 31, 38, 46, 48].includes(num)) {
            return 'ouest';
        }
        // Est
        return 'est';
    };

    const filteredRates = useMemo(() => {
        return rates.filter(w => {
            const matchesSearch = w.name.toLowerCase().includes(search.toLowerCase()) || w.id.includes(search);
            if (!matchesSearch) return false;
            if (selectedRegion === 'all') return true;
            return getWilayaRegion(w.id) === selectedRegion;
        });
    }, [rates, search, selectedRegion]);

    const hasChanges = useMemo(() => {
        return JSON.stringify(rates) !== initialRatesJson;
    }, [rates, initialRatesJson]);

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-24">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center space-x-4">
                    <Link href="/admin/parametres" className="p-2.5 bg-white border border-creme2 rounded-xl hover:border-or transition-colors group shadow-sm">
                        <ArrowLeft size={18} className="text-encre3 group-hover:text-or" />
                    </Link>
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-3xl font-serif text-encre">Tarifs de Livraison</h1>
                            <span className="text-[10px] font-black uppercase tracking-widest text-gold-brand px-2.5 py-0.5 bg-gold-brand/10 rounded-full border border-gold-brand/20">
                                58 Wilayas
                            </span>
                        </div>
                        <p className="text-encre3 text-[10px] uppercase tracking-widest font-bold mt-1">
                            Grille tarifaire dynamique appliquée en caisse lors des commandes clientes
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={handleResetToDefault}
                        className="px-4 py-2.5 bg-white border border-creme2 hover:border-rouge/40 text-encre3 hover:text-rouge rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 shadow-sm"
                        title="Réinitialiser aux valeurs d'origine"
                    >
                        <RotateCcw size={14} />
                        <span>Réinitialiser</span>
                    </button>

                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="px-6 py-3 bg-[#390102] text-[#BFA893] rounded-xl text-xs font-bold uppercase tracking-widest hover:opacity-90 transition-all shadow-xl border border-[#BFA893]/20 flex items-center gap-2"
                    >
                        {saving ? <Loader size={16} className="animate-spin" /> : <Save size={16} />}
                        <span>{saving ? 'Sauvegarde...' : 'Enregistrer les Tarifs'}</span>
                    </button>
                </div>
            </div>

            {/* Global Settings Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-gold-brand/20 shadow-sm space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-encre3 flex items-center gap-1.5">
                        <Truck size={14} className="text-gold-brand" />
                        <span>Tarif Standard / Par Défaut (DA)</span>
                    </label>
                    <p className="text-xs text-encre3 leading-relaxed">
                        Appliqué si aucune wilaya spécifique n'est reconnue.
                    </p>
                    <input
                        type="number"
                        value={defaultCost}
                        onChange={(e) => setDefaultCost(Number(e.target.value))}
                        className="w-full p-3 bg-creme/20 border border-creme2 rounded-xl text-sm font-bold text-encre focus:border-or focus:outline-none"
                        min={0}
                    />
                </div>

                <div className="bg-white p-6 rounded-2xl border border-gold-brand/20 shadow-sm space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-encre3 flex items-center gap-1.5">
                        <Sparkles size={14} className="text-gold-brand" />
                        <span>Seuil Livraison Gratuite (DA)</span>
                    </label>
                    <p className="text-xs text-encre3 leading-relaxed">
                        La livraison est automatiquement offerte dès ce montant d'achat.
                    </p>
                    <input
                        type="number"
                        value={freeThreshold}
                        onChange={(e) => setFreeThreshold(Number(e.target.value))}
                        className="w-full p-3 bg-creme/20 border border-creme2 rounded-xl text-sm font-bold text-encre focus:border-or focus:outline-none"
                        min={0}
                    />
                </div>

                <div className="bg-white p-6 rounded-2xl border border-gold-brand/20 shadow-sm space-y-3 flex flex-col justify-between">
                    <div>
                        <label className="text-[10px] font-black uppercase tracking-widest text-encre3 flex items-center gap-1.5">
                            <SlidersHorizontal size={14} className="text-gold-brand" />
                            <span>Ajustement Global Rapide</span>
                        </label>
                        <p className="text-xs text-encre3 leading-relaxed mt-1">
                            Augmentez ou baissez tous les tarifs en une seule action (ex: +50 DA).
                        </p>
                    </div>
                    <button
                        onClick={() => setShowBulkTool(!showBulkTool)}
                        className="w-full py-2.5 px-4 bg-creme2/60 hover:bg-[#390102] text-encre hover:text-[#BFA893] rounded-xl text-xs font-bold uppercase tracking-wider transition-all border border-gold-brand/20"
                    >
                        {showBulkTool ? 'Masquer l\'outil' : 'Ouvrir l\'ajustement global'}
                    </button>
                </div>
            </div>

            {/* Bulk Adjustment Dropdown Panel */}
            {showBulkTool && (
                <div className="p-6 bg-white rounded-2xl border-2 border-gold-brand/30 shadow-md animate-in slide-in-from-top-4 duration-300 space-y-4">
                    <h3 className="text-sm font-bold uppercase tracking-widest text-encre">
                        Ajuster les tarifs pour l'ensemble des 58 Wilayas
                    </h3>
                    <div className="flex flex-wrap items-center gap-4">
                        <div className="flex-1 min-w-[200px] space-y-1">
                            <label className="text-[10px] font-black uppercase tracking-widest text-encre3">Montant en DA (+ ou -)</label>
                            <input
                                type="number"
                                value={bulkAmount}
                                onChange={(e) => setBulkAmount(Number(e.target.value))}
                                className="w-full p-2.5 bg-creme/20 border border-creme2 rounded-xl text-sm font-bold text-encre"
                                placeholder="+50 ou -50"
                            />
                        </div>

                        <div className="flex-1 min-w-[200px] space-y-1">
                            <label className="text-[10px] font-black uppercase tracking-widest text-encre3">Appliquer sur</label>
                            <select
                                value={bulkTarget}
                                onChange={(e) => setBulkTarget(e.target.value as any)}
                                className="w-full p-2.5 bg-creme/20 border border-creme2 rounded-xl text-sm font-bold text-encre"
                            >
                                <option value="both">Domicile & Bureau / Relais</option>
                                <option value="home">Domicile uniquement</option>
                                <option value="desk">Bureau / Relais uniquement</option>
                            </select>
                        </div>

                        <div className="flex items-end">
                            <button
                                onClick={handleApplyBulk}
                                className="px-6 py-3 bg-[#390102] text-[#BFA893] rounded-xl text-xs font-bold uppercase tracking-widest hover:opacity-90 shadow-md"
                            >
                                Appliquer sur les 58 Wilayas
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Search & Region Filter Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-creme2 shadow-sm">
                <div className="relative flex-1">
                    <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-encre3" />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Rechercher une wilaya par nom ou code (ex: 16, Alger, Oran, Sétif...)"
                        className="w-full pl-10 pr-4 py-2.5 bg-creme/20 border border-creme2 rounded-xl text-xs focus:border-or focus:outline-none"
                    />
                </div>

                <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0">
                    {[
                        { key: 'all', label: 'Toutes (58)' },
                        { key: 'centre', label: 'Centre' },
                        { key: 'est', label: 'Est' },
                        { key: 'ouest', label: 'Ouest' },
                        { key: 'sud', label: 'Sud' },
                    ].map((tab) => (
                        <button
                            key={tab.key}
                            onClick={() => setSelectedRegion(tab.key as any)}
                            className={cn(
                                "px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all",
                                selectedRegion === tab.key
                                    ? "bg-[#390102] text-[#BFA893] shadow-sm"
                                    : "bg-creme/30 text-encre3 hover:text-encre hover:bg-creme2"
                            )}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Rates Table */}
            {loading ? (
                <div className="flex flex-col items-center justify-center py-20 space-y-4">
                    <Loader className="w-10 h-10 text-or animate-spin" />
                    <p className="text-encre3 text-[10px] uppercase tracking-[0.2em] font-black">Chargement des tarifs de livraison...</p>
                </div>
            ) : (
                <div className="bg-white rounded-3xl border border-gold-brand/20 shadow-lg overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-creme2/40 border-b border-creme2 text-[10px] font-black uppercase tracking-widest text-encre3">
                                    <th className="py-4 px-6 text-center w-16">Code</th>
                                    <th className="py-4 px-6">Wilaya</th>
                                    <th className="py-4 px-6 w-36">Délai estimé</th>
                                    <th className="py-4 px-6 w-48">
                                        <div className="flex items-center gap-1.5 text-encre">
                                            <Package size={14} className="text-gold-brand" />
                                            <span>Tarif Domicile (DA)</span>
                                        </div>
                                    </th>
                                    <th className="py-4 px-6 w-48">
                                        <div className="flex items-center gap-1.5 text-encre">
                                            <Store size={14} className="text-gold-brand" />
                                            <span>Tarif Bureau / Relais (DA)</span>
                                        </div>
                                    </th>
                                    <th className="py-4 px-6 w-40 text-encre3">
                                        <span>Frais Retour (DA)</span>
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-creme2">
                                {filteredRates.map((w) => {
                                    const hasDesk = w.deskRate !== null && w.deskRate !== undefined;

                                    return (
                                        <tr key={w.id} className="hover:bg-creme/20 transition-colors group">
                                            {/* Code */}
                                            <td className="py-3 px-6 text-center">
                                                <span className="font-mono text-xs font-bold px-2.5 py-1 bg-creme2 rounded-lg text-encre">
                                                    {w.id}
                                                </span>
                                            </td>

                                            {/* Wilaya Name */}
                                            <td className="py-3 px-6">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-bold text-sm text-encre">{w.name}</span>
                                                    <span className="text-[9px] font-bold uppercase tracking-wider text-encre3/70 bg-creme2/60 px-2 py-0.5 rounded">
                                                        {getWilayaRegion(w.id)}
                                                    </span>
                                                </div>
                                            </td>

                                            {/* Delay */}
                                            <td className="py-3 px-6">
                                                <div className="flex items-center gap-1">
                                                    <input
                                                        type="text"
                                                        value={w.delay || ''}
                                                        onChange={(e) => handleRateChange(w.id, 'delay', e.target.value)}
                                                        className="w-20 px-2 py-1.5 bg-creme/30 border border-creme2 hover:border-or rounded-lg text-xs text-center font-bold text-encre focus:outline-none focus:border-or"
                                                    />
                                                    <span className="text-[10px] text-encre3">j</span>
                                                </div>
                                            </td>

                                            {/* Home Delivery Rate */}
                                            <td className="py-3 px-6">
                                                <div className="flex items-center gap-2">
                                                    <input
                                                        type="number"
                                                        value={w.homeRate ?? 0}
                                                        onChange={(e) => handleRateChange(w.id, 'homeRate', parseInt(e.target.value) || 0)}
                                                        className="w-28 px-3 py-1.5 bg-white border border-creme2 hover:border-gold-brand focus:border-or rounded-xl text-xs font-bold text-encre focus:outline-none shadow-sm"
                                                        min={0}
                                                        step={50}
                                                    />
                                                    <span className="text-xs font-bold text-or">DA</span>
                                                </div>
                                            </td>

                                            {/* Desk Rate */}
                                            <td className="py-3 px-6">
                                                <div className="flex items-center gap-2">
                                                    {hasDesk ? (
                                                        <>
                                                            <input
                                                                type="number"
                                                                value={w.deskRate ?? 0}
                                                                onChange={(e) => handleRateChange(w.id, 'deskRate', parseInt(e.target.value) || 0)}
                                                                className="w-28 px-3 py-1.5 bg-white border border-creme2 hover:border-gold-brand focus:border-or rounded-xl text-xs font-bold text-encre focus:outline-none shadow-sm"
                                                                min={0}
                                                                step={50}
                                                            />
                                                            <span className="text-xs font-bold text-or">DA</span>
                                                            <button
                                                                type="button"
                                                                onClick={() => handleRateChange(w.id, 'deskRate', null)}
                                                                className="text-[9px] text-rouge hover:underline ml-1"
                                                                title="Désactiver bureau"
                                                            >
                                                                Désact.
                                                            </button>
                                                        </>
                                                    ) : (
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-[10px] text-encre3 italic bg-creme2/50 px-2 py-1 rounded">
                                                                Non disponible
                                                            </span>
                                                            <button
                                                                type="button"
                                                                onClick={() => handleRateChange(w.id, 'deskRate', Math.max(0, (w.homeRate || 600) - 300))}
                                                                className="text-[10px] text-gold-brand font-bold hover:underline"
                                                            >
                                                                + Activer
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            </td>

                                            {/* Return Rate */}
                                            <td className="py-3 px-6">
                                                <div className="flex items-center gap-1.5">
                                                    <input
                                                        type="number"
                                                        value={w.returnRate ?? 200}
                                                        onChange={(e) => handleRateChange(w.id, 'returnRate', parseInt(e.target.value) || 0)}
                                                        className="w-20 px-2.5 py-1.5 bg-creme/20 border border-creme2 hover:border-or rounded-lg text-xs font-mono text-encre3 focus:outline-none"
                                                        min={0}
                                                        step={50}
                                                    />
                                                    <span className="text-[10px] text-encre3">DA</span>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Sticky Save Bar if changes made */}
            {hasChanges && (
                <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-[#390102] text-[#BFA893] px-6 py-4 rounded-2xl shadow-2xl border border-gold-brand/40 flex items-center gap-6 animate-in slide-in-from-bottom-6">
                    <div className="flex items-center gap-2">
                        <AlertCircle size={18} className="text-or animate-pulse" />
                        <span className="text-xs font-bold uppercase tracking-wider text-creme">
                            Modifications de tarifs non enregistrées
                        </span>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={loadSettings}
                            className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-creme/70 hover:text-creme"
                        >
                            Annuler
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className="px-6 py-2 bg-gold-brand text-rouge-brand hover:bg-creme rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-md flex items-center gap-2"
                        >
                            {saving && <Loader size={14} className="animate-spin" />}
                            <span>Enregistrer maintenant</span>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
