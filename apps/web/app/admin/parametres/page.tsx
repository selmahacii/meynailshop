'use client';

import { useState, useEffect } from 'react';
import { 
    Bell, 
    Download, 
    Save, 
    Store, 
    Truck, 
    CreditCard, 
    Shield, 
    Globe, 
    AlertTriangle, 
    Loader, 
    AlertCircle, 
    CheckCircle, 
    Upload, 
    Smartphone, 
    MessageSquare, 
    Send, 
    ExternalLink, 
    HelpCircle, 
    Check, 
    Copy 
} from 'lucide-react';
import { UploadAPI } from '@/lib/api/client';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { SettingsAPI } from '@/lib/api/client';

const tabs = [
    { key: 'boutique', label: 'Boutique', icon: Store },
    { key: 'notifications', label: 'Notifications Mobile', icon: Bell },
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
    const [uploadingImage, setUploadingImage] = useState(false);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    // Test notification states
    const [testingNotification, setTestingNotification] = useState<'whatsapp' | 'telegram' | null>(null);
    const [testNotificationResult, setTestNotificationResult] = useState<{ channel: string; success: boolean; message: string } | null>(null);

    const handleUploadOnglerie = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setUploadingImage(true);
        try {
            const res = await UploadAPI.uploadProductImage(file);
            if (res.success && res.data?.url) {
                handleChange('onglerieCollectionImage', res.data.url);
                setSuccessMessage('Photo uploadée ! Cliquez sur Sauvegarder pour appliquer.');
            } else {
                setError(res.error || 'Erreur d\'upload');
            }
        } catch {
            setError('Erreur réseau lors de l\'upload');
        } finally {
            setUploadingImage(false);
            e.target.value = '';
        }
    };

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
            const { id, updatedAt, ...payload } = settings;
            const res = await SettingsAPI.update(payload);
            if (res.success) {
                setSuccessMessage('Paramètres enregistrés avec succès');
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

    const handleTestNotification = async (channel: 'whatsapp' | 'telegram') => {
        setTestNotificationResult(null);

        if (channel === 'whatsapp') {
            if (!settings?.whatsappPhone || !settings?.whatsappPhone.trim()) {
                setTestNotificationResult({
                    channel: 'whatsapp',
                    success: false,
                    message: 'Veuillez saisir votre numéro WhatsApp administrateur (ex: +213780125700).',
                });
                return;
            }
            if (!settings?.whatsappApiKey || !settings?.whatsappApiKey.trim()) {
                setTestNotificationResult({
                    channel: 'whatsapp',
                    success: false,
                    message: 'Veuillez d\'abord obtenir votre clé APIKEY sur WhatsApp en cliquant sur le lien vert ci-dessous, la coller dans le champ "Clé API", puis cliquer sur Sauvegarder.',
                });
                return;
            }
        }

        if (channel === 'telegram') {
            if (!settings?.telegramBotToken || !settings?.telegramBotToken.trim()) {
                setTestNotificationResult({
                    channel: 'telegram',
                    success: false,
                    message: 'Veuillez renseigner le Token de votre bot Telegram (fourni par @BotFather).',
                });
                return;
            }
            if (!settings?.telegramChatId || !settings?.telegramChatId.trim()) {
                setTestNotificationResult({
                    channel: 'telegram',
                    success: false,
                    message: 'Veuillez renseigner votre Chat ID Telegram (obtenu via @userinfobot).',
                });
                return;
            }
        }

        setTestingNotification(channel);
        try {
            const res = await SettingsAPI.testNotification({
                channel,
                whatsappPhone: settings?.whatsappPhone,
                whatsappApiKey: settings?.whatsappApiKey,
                telegramBotToken: settings?.telegramBotToken,
                telegramChatId: settings?.telegramChatId,
            });

            const channelResult = res.data?.[channel];
            if (channelResult?.success) {
                setTestNotificationResult({
                    channel,
                    success: true,
                    message: channelResult.message || `Test ${channel === 'whatsapp' ? 'WhatsApp' : 'Telegram'} réussi ! Vérifiez votre téléphone.`,
                });
            } else {
                setTestNotificationResult({
                    channel,
                    success: false,
                    message: channelResult?.message || res.error || `Échec du test ${channel}.`,
                });
            }
        } catch (err: any) {
            setTestNotificationResult({
                channel,
                success: false,
                message: err?.message || 'Erreur réseau lors de l\'envoi du test.',
            });
        } finally {
            setTestingNotification(null);
        }
    };

    const handleReset = async () => {
        setSaving(true);
        setError(null);
        setSuccessMessage(null);
        try {
            const res = await SettingsAPI.reset();
            if (res.success) {
                setSuccessMessage('La boutique a été réinitialisée à zéro');
                setTimeout(() => window.location.reload(), 2000);
            } else {
                setError(res.error || 'Erreur lors de la réinitialisation');
            }
        } catch (err) {
            setError('Erreur réseau lors de la réinitialisation');
        } finally {
            setSaving(false);
        }
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
                        <div className="flex items-center gap-2 text-green-600 bg-green-50 px-4 py-2 rounded-xl border border-green-100 animate-fade-in">
                            <CheckCircle size={16} />
                            <span className="text-xs font-bold uppercase tracking-widest">{successMessage}</span>
                        </div>
                    )}
                    <button className="p-2.5 bg-white border border-creme2 rounded-xl text-encre3 hover:text-or hover:border-or transition-all shadow-sm"><Bell size={18} /></button>
                    <button 
                        onClick={handleSave}
                        disabled={saving}
                        className="flex items-center space-x-2 px-6 py-2.5 bg-[#1A0A0A] text-creme rounded-xl text-sm font-bold uppercase tracking-widest hover:bg-rouge-deep transition-all shadow-md disabled:opacity-50"
                    >
                        {saving ? <Loader size={16} className="animate-spin text-or" /> : <Save size={16} className="text-or" />}
                        <span>{saving ? 'Sauvegarde...' : 'Sauvegarder'}</span>
                    </button>
                    <Link href="/" className="px-5 py-2.5 border border-encre text-encre rounded-xl text-sm font-bold hover:bg-encre hover:text-creme transition-all">Voir la boutique</Link>
                </div>
            </div>

            {error && (
                <div className="p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 flex items-center gap-3">
                    <AlertTriangle size={20} />
                    <p className="font-bold text-sm">{error}</p>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Sidebar Tabs */}
                <div className="lg:col-span-3">
                    <div className="bg-white rounded-xl border border-creme2 shadow-lg overflow-hidden">
                        {tabs.map((tab) => (
                            <button
                                key={tab.key}
                                onClick={() => {
                                    setActiveTab(tab.key);
                                    setTestNotificationResult(null);
                                }}
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
                    {/* ONGLET 1: BOUTIQUE */}
                    {activeTab === 'boutique' && (
                        <>
                            <div className="bg-white rounded-xl border border-creme2 shadow-lg p-8">
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
                                                className="w-full px-4 py-3 bg-creme border border-creme2 rounded-xl text-sm text-encre focus:outline-none focus:border-or focus:ring-1 focus:ring-or transition-all"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="bg-white rounded-xl border border-creme2 shadow-lg p-8">
                                <h2 className="font-serif text-xl text-encre mb-8 pb-4 border-b border-creme2">Gestion du stock & livraison</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-[10px] font-black uppercase tracking-widest text-encre3 mb-2">Seuil d'alerte par défaut</label>
                                        <input 
                                            type="number" 
                                            value={settings?.stockAlertDefault || 5} 
                                            onChange={(e) => handleChange('stockAlertDefault', parseInt(e.target.value))}
                                            className="w-full px-4 py-3 bg-creme border border-creme2 rounded-xl text-sm text-encre focus:outline-none focus:border-or focus:ring-1 focus:ring-or transition-all" 
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black uppercase tracking-widest text-encre3 mb-2">Frais de livraison par défaut (DA)</label>
                                        <input 
                                            type="number" 
                                            value={settings?.shippingCostDefault || 600} 
                                            onChange={(e) => handleChange('shippingCostDefault', parseInt(e.target.value))}
                                            className="w-full px-4 py-3 bg-creme border border-creme2 rounded-xl text-sm text-encre focus:outline-none focus:border-or focus:ring-1 focus:ring-or transition-all" 
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black uppercase tracking-widest text-encre3 mb-2">Seuil livraison gratuite (DA)</label>
                                        <input 
                                            type="number" 
                                            value={settings?.freeShippingThreshold || 10000} 
                                            onChange={(e) => handleChange('freeShippingThreshold', parseInt(e.target.value))}
                                            className="w-full px-4 py-3 bg-creme border border-creme2 rounded-xl text-sm text-encre focus:outline-none focus:border-or focus:ring-1 focus:ring-or transition-all" 
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 flex items-start space-x-4 shadow-sm">
                                <AlertTriangle size={20} className="text-yellow-600 shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-sm font-bold text-yellow-800 uppercase tracking-widest">Zone de danger</p>
                                    <p className="text-xs text-yellow-700 mt-1">Les actions ci-dessous sont irréversibles. Procédez avec prudence.</p>
                                    <div className="flex space-x-3 mt-4">
                                        <button 
                                            onClick={() => alert('Fonctionnalité bientôt disponible')}
                                            className="px-4 py-2 bg-white border border-yellow-300 text-yellow-700 text-[10px] font-bold uppercase tracking-widest rounded-xl hover:bg-yellow-100 transition-all"
                                        >
                                            Vider les données de test
                                        </button>
                                        <button 
                                            onClick={() => {
                                                if (window.confirm('ATTENTION : Voulez-vous vraiment supprimer TOUTES les données (produits, commandes, clients) ? Cette action est définitive.')) {
                                                    handleReset();
                                                }
                                            }}
                                            disabled={saving}
                                            className="px-4 py-2 bg-red-600 text-white text-[10px] font-bold uppercase tracking-widest rounded-xl hover:bg-red-700 transition-all shadow-md disabled:opacity-50"
                                        >
                                            {saving ? 'Réinitialisation...' : 'Réinitialiser la boutique'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}

                    {/* ONGLET 2: NOTIFICATIONS MOBILE & WHATSAPP */}
                    {activeTab === 'notifications' && (
                        <div className="space-y-6">
                            {/* Alerte générale */}
                            <div className="bg-white rounded-xl border border-creme2 shadow-lg p-8">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-creme2">
                                    <div>
                                        <h2 className="font-serif text-2xl text-encre">Alertes Commandes sur Mobile</h2>
                                        <p className="text-xs text-encre3 mt-1 leading-relaxed">
                                            Soyez notifié(e) instantanément sur votre smartphone ou WhatsApp dès qu'une cliente finalise sa commande.
                                        </p>
                                    </div>
                                    <label className="inline-flex items-center gap-3 cursor-pointer shrink-0">
                                        <span className="text-xs font-bold uppercase tracking-wider text-encre3">
                                            {settings?.notifyNewOrder ? 'Alertes activées' : 'Alertes désactivées'}
                                        </span>
                                        <input
                                            type="checkbox"
                                            checked={settings?.notifyNewOrder ?? true}
                                            onChange={(e) => handleChange('notifyNewOrder', e.target.checked)}
                                            className="w-5 h-5 accent-or rounded cursor-pointer"
                                        />
                                    </label>
                                </div>

                                {testNotificationResult && (
                                    <div className={cn(
                                        "mt-6 p-4 rounded-xl border flex items-start gap-3 animate-fade-in",
                                        testNotificationResult.success 
                                            ? "bg-green-50 border-green-200 text-green-800" 
                                            : "bg-red-50 border-red-200 text-red-800"
                                    )}>
                                        {testNotificationResult.success ? (
                                            <CheckCircle className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                                        ) : (
                                            <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                                        )}
                                        <div className="text-xs leading-relaxed">
                                            <p className="font-bold uppercase tracking-wider mb-0.5">
                                                {testNotificationResult.success ? 'Notification envoyée avec succès' : 'Échec du test de notification'}
                                            </p>
                                            <p>{testNotificationResult.message}</p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* SECTION WHATSAPP */}
                            <div className="bg-white rounded-xl border border-creme2 shadow-lg p-8">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-creme2">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-green-50 border border-green-200 flex items-center justify-center text-green-600 shrink-0">
                                            <MessageSquare size={20} />
                                        </div>
                                        <div>
                                            <h3 className="font-serif text-xl text-encre">WhatsApp Direct (CallMeBot)</h3>
                                            <p className="text-xs text-encre3 mt-0.5">Réception de la commande complète directement sur votre WhatsApp personnel (100% gratuit).</p>
                                        </div>
                                    </div>
                                    <label className="inline-flex items-center gap-3 cursor-pointer shrink-0">
                                        <span className="text-xs font-bold uppercase tracking-wider text-encre3">
                                            {settings?.whatsappNotificationsEnabled ? 'Actif' : 'Inactif'}
                                        </span>
                                        <input
                                            type="checkbox"
                                            checked={settings?.whatsappNotificationsEnabled ?? false}
                                            onChange={(e) => handleChange('whatsappNotificationsEnabled', e.target.checked)}
                                            className="w-5 h-5 accent-green-600 rounded cursor-pointer"
                                        />
                                    </label>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                                    <div>
                                        <label className="block text-[10px] font-black uppercase tracking-widest text-encre3 mb-2">
                                            Numéro WhatsApp Administrateur
                                        </label>
                                        <input 
                                            type="text" 
                                            placeholder="+213555123456" 
                                            value={settings?.whatsappPhone || ''} 
                                            onChange={(e) => handleChange('whatsappPhone', e.target.value)}
                                            className="w-full px-4 py-3 bg-creme border border-creme2 rounded-xl text-sm text-encre focus:outline-none focus:border-green-600 transition-all font-mono" 
                                        />
                                        <p className="text-[10px] text-encre3 mt-1.5">Format international recommandé (ex : <code>+213555123456</code> ou <code>0555123456</code>)</p>
                                    </div>

                                    <div>
                                        <label className="block text-[10px] font-black uppercase tracking-widest text-encre3 mb-2">
                                            Clé API CallMeBot (APIKEY)
                                        </label>
                                        <input 
                                            type="text" 
                                            placeholder="Ex: 839201" 
                                            value={settings?.whatsappApiKey || ''} 
                                            onChange={(e) => handleChange('whatsappApiKey', e.target.value.trim())}
                                            className="w-full px-4 py-3 bg-creme border border-creme2 rounded-xl text-sm text-encre focus:outline-none focus:border-green-600 transition-all font-mono font-bold" 
                                        />
                                        <p className="text-[10px] text-encre3 mt-1.5">Code numérique à 5-6 chiffres reçu par WhatsApp suite au message d'autorisation</p>
                                    </div>
                                </div>

                                {/* Guide d'activation WhatsApp */}
                                <div className="mt-6 p-6 bg-green-50/70 border border-green-200 rounded-2xl space-y-4">
                                    <div className="flex items-center gap-2 text-green-900 text-xs font-black uppercase tracking-wider">
                                        <HelpCircle size={18} className="text-green-700" />
                                        <span>Comment obtenir votre clé API WhatsApp gratuitement en 30 secondes :</span>
                                    </div>

                                    <div className="bg-white/80 p-4 rounded-xl border border-green-200/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                                        <div>
                                            <p className="text-xs font-bold text-green-950">Lien direct d'activation WhatsApp :</p>
                                            <p className="text-[11px] text-green-800/80 mt-0.5">Ouvre directement la conversation avec le bot et pré-remplit le message pour vous.</p>
                                        </div>
                                        <a
                                            href="https://wa.me/34684723962?text=I%20allow%20callmebot%20to%20send%20me%20messages"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-2 px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow-sm transition-all shrink-0"
                                        >
                                            <MessageSquare size={15} />
                                            <span>Ouvrir WhatsApp (+34 684 72 39 62)</span>
                                            <ExternalLink size={14} />
                                        </a>
                                    </div>

                                    <ol className="text-xs text-green-900/90 space-y-2 list-decimal list-inside leading-relaxed">
                                        <li>Cliquez sur le bouton vert ci-dessus pour ouvrir WhatsApp (ou envoyez un message au <strong>+34 684 72 39 62</strong> ou au numéro secondaire <strong>+34 644 44 26 19</strong>).</li>
                                        <li>Envoyez le message pré-rempli : <code className="bg-white px-2 py-0.5 rounded border border-green-200 font-bold select-all">I allow callmebot to send me messages</code></li>
                                        <li>Le bot WhatsApp vous répondra en quelques secondes avec : <em>« API Activated for your phone number. Your APIKEY is: <strong>XXXXXX</strong> »</em>.</li>
                                        <li>Copiez ce numéro <strong>APIKEY</strong> et collez-le dans le champ ci-dessus.</li>
                                        <li>Cliquez sur <strong>« Sauvegarder »</strong> en haut à droite, puis sur <strong>« Tester WhatsApp »</strong> pour vérifier !</li>
                                    </ol>
                                </div>

                                <div className="mt-6 pt-4 border-t border-creme2 flex justify-end">
                                    <button
                                        type="button"
                                        onClick={() => handleTestNotification('whatsapp')}
                                        disabled={testingNotification === 'whatsapp'}
                                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow-sm transition-all disabled:opacity-50"
                                    >
                                        {testingNotification === 'whatsapp' ? (
                                            <Loader size={14} className="animate-spin" />
                                        ) : (
                                            <Send size={14} />
                                        )}
                                        <span>{testingNotification === 'whatsapp' ? 'Envoi du test...' : 'Tester WhatsApp'}</span>
                                    </button>
                                </div>
                            </div>

                            {/* SECTION TELEGRAM */}
                            <div className="bg-white rounded-xl border border-creme2 shadow-lg p-8">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-creme2">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-sky-50 border border-sky-200 flex items-center justify-center text-sky-600 shrink-0">
                                            <Send size={20} />
                                        </div>
                                        <div>
                                            <h3 className="font-serif text-xl text-encre">Notification Push Telegram</h3>
                                            <p className="text-xs text-encre3 mt-0.5">Notification instantanée avec son d'alerte sur smartphone iPhone/Android.</p>
                                        </div>
                                    </div>
                                    <label className="inline-flex items-center gap-3 cursor-pointer shrink-0">
                                        <span className="text-xs font-bold uppercase tracking-wider text-encre3">
                                            {settings?.telegramNotificationsEnabled ? 'Actif' : 'Inactif'}
                                        </span>
                                        <input
                                            type="checkbox"
                                            checked={settings?.telegramNotificationsEnabled ?? false}
                                            onChange={(e) => handleChange('telegramNotificationsEnabled', e.target.checked)}
                                            className="w-5 h-5 accent-sky-600 rounded cursor-pointer"
                                        />
                                    </label>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                                    <div>
                                        <label className="block text-[10px] font-black uppercase tracking-widest text-encre3 mb-2">
                                            Telegram Bot Token
                                        </label>
                                        <input 
                                            type="password" 
                                            placeholder="Ex: 7123456789:AAEF..." 
                                            value={settings?.telegramBotToken || ''} 
                                            onChange={(e) => handleChange('telegramBotToken', e.target.value)}
                                            className="w-full px-4 py-3 bg-creme border border-creme2 rounded-xl text-sm text-encre focus:outline-none focus:border-sky-500 transition-all font-mono" 
                                        />
                                        <p className="text-[10px] text-encre3 mt-1.5">Fourni par @BotFather sur Telegram</p>
                                    </div>

                                    <div>
                                        <label className="block text-[10px] font-black uppercase tracking-widest text-encre3 mb-2">
                                            Telegram Chat ID
                                        </label>
                                        <input 
                                            type="text" 
                                            placeholder="Ex: 123456789" 
                                            value={settings?.telegramChatId || ''} 
                                            onChange={(e) => handleChange('telegramChatId', e.target.value)}
                                            className="w-full px-4 py-3 bg-creme border border-creme2 rounded-xl text-sm text-encre focus:outline-none focus:border-sky-500 transition-all font-mono" 
                                        />
                                        <p className="text-[10px] text-encre3 mt-1.5">Votre identifiant de discussion ou celui d'un groupe privé d'alertes</p>
                                    </div>
                                </div>

                                {/* Guide d'activation Telegram */}
                                <div className="mt-6 p-5 bg-sky-50/50 border border-sky-200/60 rounded-xl space-y-3">
                                    <div className="flex items-center gap-2 text-sky-800 text-xs font-bold uppercase tracking-wider">
                                        <HelpCircle size={16} />
                                        <span>Comment configurer Telegram en 1 minute (gratuit) :</span>
                                    </div>
                                    <ol className="text-xs text-sky-900/90 space-y-1.5 list-decimal list-inside leading-relaxed">
                                        <li>Sur Telegram, recherchez <strong>@BotFather</strong> et envoyez la commande <code className="bg-white px-2 py-0.5 rounded border border-sky-200 font-bold select-all">/newbot</code>.</li>
                                        <li>Choisissez un nom d'affichage (ex: <em>MEEY Nail Shop Alertes</em>) et un pseudo se terminant par <em>bot</em>.</li>
                                        <li>Copiez le <strong>Token</strong> généré et collez-le dans le champ Token ci-dessus.</li>
                                        <li>Envoyez le message <code className="bg-white px-2 py-0.5 rounded border border-sky-200 font-bold select-all">/start</code> à votre nouveau bot, puis utilisez <strong>@userinfobot</strong> pour copier votre <strong>Chat ID</strong> numérique.</li>
                                        <li>Collez votre Chat ID ci-dessus, cliquez sur <strong>Sauvegarder</strong> puis <strong>Tester Telegram</strong> !</li>
                                    </ol>
                                </div>

                                <div className="mt-6 pt-4 border-t border-creme2 flex justify-end">
                                    <button
                                        type="button"
                                        onClick={() => handleTestNotification('telegram')}
                                        disabled={testingNotification === 'telegram'}
                                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow-sm transition-all disabled:opacity-50"
                                    >
                                        {testingNotification === 'telegram' ? (
                                            <Loader size={14} className="animate-spin" />
                                        ) : (
                                            <Send size={14} />
                                        )}
                                        <span>{testingNotification === 'telegram' ? 'Envoi du test...' : 'Tester Telegram'}</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ONGLET 3: LIVRAISON */}
                    {activeTab === 'livraison' && (
                        <div className="space-y-6">
                            <div className="bg-white rounded-xl border border-creme2 shadow-lg p-8">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-creme2">
                                    <div>
                                        <h2 className="font-serif text-2xl text-encre">Frais de Livraison & Expédition</h2>
                                        <p className="text-xs text-encre3 mt-1">Configurez le seuil de gratuité et les tarifs de livraison pour chaque wilaya d'Algérie.</p>
                                    </div>
                                    <Link
                                        href="/admin/livraison"
                                        className="inline-flex items-center gap-2 px-5 py-3 bg-[#390102] text-[#BFA893] rounded-xl text-xs font-bold uppercase tracking-widest hover:opacity-90 shadow-md transition-all shrink-0"
                                    >
                                        <Truck size={16} />
                                        <span>Gérer la grille des 58 Wilayas</span>
                                    </Link>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                                    <div>
                                        <label className="block text-[10px] font-black uppercase tracking-widest text-encre3 mb-2">Frais de livraison par défaut (DA)</label>
                                        <input 
                                            type="number" 
                                            value={settings?.shippingCostDefault || 600} 
                                            onChange={(e) => handleChange('shippingCostDefault', parseInt(e.target.value))}
                                            className="w-full px-4 py-3 bg-creme border border-creme2 rounded-xl text-sm text-encre focus:outline-none focus:border-or transition-all font-bold" 
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black uppercase tracking-widest text-encre3 mb-2">Seuil livraison gratuite (DA)</label>
                                        <input 
                                            type="number" 
                                            value={settings?.freeShippingThreshold || 10000} 
                                            onChange={(e) => handleChange('freeShippingThreshold', parseInt(e.target.value))}
                                            className="w-full px-4 py-3 bg-creme border border-creme2 rounded-xl text-sm text-encre focus:outline-none focus:border-or transition-all font-bold" 
                                        />
                                    </div>
                                </div>

                                <div className="mt-8 p-6 bg-creme/30 rounded-2xl border border-gold-brand/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                    <div>
                                        <span className="text-[10px] font-black uppercase tracking-widest text-gold-brand">Grille Dynamique Complète</span>
                                        <h3 className="font-serif text-lg text-encre mt-0.5">Tarifs individualisés pour les 58 Wilayas</h3>
                                        <p className="text-xs text-encre3 mt-1 leading-relaxed">
                                            Modifiez les prix de livraison à domicile, en point relais, ainsi que les délais d'acheminement avec application immédiate en caisse.
                                        </p>
                                    </div>
                                    <Link
                                        href="/admin/livraison"
                                        className="px-5 py-2.5 bg-white border border-gold-brand/30 hover:border-gold-brand text-encre rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-sm shrink-0"
                                    >
                                        Ouvrir l'éditeur des wilayas →
                                    </Link>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ONGLET 4: SEO */}
                    {activeTab === 'seo' && (
                        <div className="bg-white rounded-xl border border-creme2 shadow-lg p-20 flex flex-col items-center justify-center text-center relative overflow-hidden">
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

                    {/* AUTRES ONGLETS EN DÉVELOPPEMENT */}
                    {!['boutique', 'notifications', 'livraison', 'seo'].includes(activeTab) && (
                        <div className="bg-white rounded-xl border border-creme2 shadow-lg p-16 flex flex-col items-center justify-center text-center">
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
