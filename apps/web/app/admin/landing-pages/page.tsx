'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
    Plus, 
    Edit3, 
    Trash2, 
    Copy, 
    ExternalLink, 
    Eye, 
    Check, 
    Upload, 
    Sparkles, 
    Palette, 
    Layers, 
    Package, 
    FileText, 
    Image as ImageIcon, 
    Tag, 
    DollarSign, 
    MessageCircle, 
    ArrowRight, 
    ChevronDown, 
    ChevronUp,
    CheckCircle2,
    Save,
    X,
    Smartphone,
    Monitor
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { SettingsAPI, ProductsAPI, UploadAPI } from '@/lib/api/client';
import { useSettings } from '@/lib/hooks/useSettings';
import { LandingPageData, LandingPageItem, LandingPageVariant } from '@/types/landing-page';
import { DEFAULT_LANDING_PAGES } from '@/lib/constants/landing-pages';

export default function AdminLandingPagesPage() {
    const { settings, refreshSettings } = useSettings();
    const [landingPages, setLandingPages] = useState<LandingPageData[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [catalogProducts, setCatalogProducts] = useState<any[]>([]);

    // État d'édition
    const [isEditing, setIsEditing] = useState(false);
    const [currentLP, setCurrentLP] = useState<LandingPageData | null>(null);
    const [activeTab, setActiveTab] = useState<'general' | 'offer' | 'photos' | 'items' | 'design' | 'contact'>('general');
    const [previewMode, setPreviewMode] = useState<'mobile' | 'desktop'>('mobile');
    const [showLivePreview, setShowLivePreview] = useState(false);
    const [uploadingImage, setUploadingImage] = useState(false);

    // Initialisation
    useEffect(() => {
        loadData();
    }, [settings]);

    const loadData = async () => {
        try {
            setLoading(true);
            // Charger les landing pages depuis settings
            if (settings?.landingPages && Array.isArray(settings.landingPages) && settings.landingPages.length > 0) {
                setLandingPages(settings.landingPages);
            } else {
                setLandingPages(DEFAULT_LANDING_PAGES);
            }

            // Charger les produits existants du catalogue pour permettre l'association
            try {
                const prodRes = await ProductsAPI.getAll(1, 50);
                if (prodRes?.data?.items) {
                    setCatalogProducts(prodRes.data.items);
                }
            } catch (e) {
                console.warn('Catalogue products fetch warning:', e);
            }
        } finally {
            setLoading(false);
        }
    };

    // Sauvegarder dans la base de données
    const saveAllLandingPages = async (updatedList: LandingPageData[]) => {
        setSaving(true);
        try {
            const res = await SettingsAPI.update({ landingPages: updatedList });
            if (res.success) {
                setLandingPages(updatedList);
                refreshSettings();
                toast.success('Landing pages enregistrées avec succès en production !');
                return true;
            } else {
                toast.error(res.error || 'Erreur lors de la sauvegarde');
                return false;
            }
        } catch (e: any) {
            toast.error(e.message || 'Erreur réseau');
            return false;
        } finally {
            setSaving(false);
        }
    };

    // Actions sur la liste
    const handleCreateNew = () => {
        const newLP: LandingPageData = {
            id: 'lp_' + Date.now(),
            slug: 'pack-' + Math.floor(100 + Math.random() * 900),
            title: 'عرض خاص جديد للأظافر والـ Press-on',
            subtitle: 'كافة الأدوات الاحترافية مجموعة في حقيبة واحدة لتوفير الوقت والمال.',
            brandName: 'MEEY NAIL SHOP',
            primaryColor: '#390102',
            accentColor: '#BFA893',
            backgroundColor: '#FAF5EF',
            textColor: '#18080A',
            price: 6500,
            compareAtPrice: 8500,
            currency: 'DA',
            photos: [
                'https://hnnsaruuigqchikzdiro.supabase.co/storage/v1/object/public/products/4e73288c-a77a-4d2d-a8e2-1ec2dcbb4327.webp'
            ],
            items: [
                { id: '1', nameFr: 'Mini lampe UV', descDz: 'مصباح ميني خفيف وسريع لتجفيف وتثبيت الأظافر.', quantity: 1 },
                { id: '2', nameFr: 'Coupe capsule', descDz: 'مقص احترافي لقص الكبسولات بدقة ونظافة.', quantity: 1 }
            ],
            isAccordion: true,
            accordionTitle: 'المكونات الأساسية للباك :',
            variants: [],
            hasVariants: false,
            deliveryText: 'توصيل متوفر لكامل 58 ولاية — الدفع كاش عند الاستلام',
            guaranteeText: 'الدفع يداً بيد عند الاستلام. تقدري تفتحي الطرد وتعايني سلعتك قبل ما تخلصي.',
            instagramUrl: 'https://ig.me/m/meeynailshop',
            instagramMessage: 'السلام عليكم، حبيت نستفسر ونعرف معلومات أكثر على هذا الباك',
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        setCurrentLP(newLP);
        setIsEditing(true);
        setActiveTab('general');
    };

    const handleEdit = (lp: LandingPageData) => {
        setCurrentLP(JSON.parse(JSON.stringify(lp)));
        setIsEditing(true);
        setActiveTab('general');
    };

    const handleDuplicate = async (lp: LandingPageData) => {
        const copy: LandingPageData = {
            ...JSON.parse(JSON.stringify(lp)),
            id: 'lp_' + Date.now(),
            slug: lp.slug + '-copie-' + Math.floor(10 + Math.random() * 90),
            title: lp.title + ' (نسخة)',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            viewsCount: 0,
            ordersCount: 0
        };
        const updated = [...landingPages, copy];
        await saveAllLandingPages(updated);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Êtes-vous sûre de vouloir supprimer cette landing page ?')) return;
        const updated = landingPages.filter(p => p.id !== id);
        await saveAllLandingPages(updated);
    };

    const handleToggleActive = async (id: string) => {
        const updated = landingPages.map(p => p.id === id ? { ...p, isActive: !p.isActive } : p);
        await saveAllLandingPages(updated);
    };

    // Sauvegarde de l'édition en cours
    const handleSaveCurrentLP = async () => {
        if (!currentLP) return;
        if (!currentLP.slug || !currentLP.slug.trim()) {
            toast.error('Le slug URL est obligatoire !');
            return;
        }

        // Format clean du slug
        const cleanSlug = currentLP.slug.toLowerCase().trim().replace(/[^a-z0-9_-]/g, '-');
        const updatedLP: LandingPageData = {
            ...currentLP,
            slug: cleanSlug,
            updatedAt: new Date().toISOString()
        };

        const existingIndex = landingPages.findIndex(p => p.id === updatedLP.id);
        let updatedList: LandingPageData[] = [];
        if (existingIndex >= 0) {
            updatedList = [...landingPages];
            updatedList[existingIndex] = updatedLP;
        } else {
            updatedList = [...landingPages, updatedLP];
        }

        const ok = await saveAllLandingPages(updatedList);
        if (ok) {
            setIsEditing(false);
            setCurrentLP(null);
        }
    };

    // Pré-remplissage depuis un produit existant
    const handleSelectProduct = (productId: string) => {
        if (!currentLP) return;
        const prod = catalogProducts.find(p => p.id === productId);
        if (!prod) return;

        setCurrentLP({
            ...currentLP,
            productId: prod.id,
            title: prod.name || currentLP.title,
            price: Number(prod.price) || currentLP.price,
            compareAtPrice: prod.originalPrice ? Number(prod.originalPrice) : currentLP.compareAtPrice,
            photos: prod.images && prod.images.length > 0 ? prod.images : currentLP.photos,
            hasVariants: Boolean(prod.hasVariants && prod.variants && prod.variants.length > 0),
            variants: prod.variants ? prod.variants.map((v: any, idx: number) => ({
                id: v.sku || String(idx + 1),
                name: v.name || v.sku || `Variante ${idx + 1}`,
                price: v.price ? Number(v.price) : Number(prod.price),
                image: v.image || (prod.images && prod.images[0]) || '',
                stock: v.stock || 10,
                sku: v.sku
            })) : []
        });
        toast.info(`Informations pré-remplies depuis "${prod.name}" !`);
    };

    // Upload d'une photo directement vers Supabase
    const handleUploadPhoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !currentLP) return;

        setUploadingImage(true);
        try {
            const res = await UploadAPI.uploadProductImage(file);
            if (res.success && res.data?.url) {
                setCurrentLP({
                    ...currentLP,
                    photos: [res.data.url, ...currentLP.photos]
                });
                toast.success('Photo ajoutée avec succès !');
            } else {
                toast.error(res.error || "Échec de l'upload");
            }
        } catch {
            toast.error("Erreur réseau lors de l'upload");
        } finally {
            setUploadingImage(false);
            e.target.value = '';
        }
    };

    // Gestion des composants du pack
    const handleAddItem = () => {
        if (!currentLP) return;
        const newItem: LandingPageItem = {
            id: String(Date.now()),
            nameFr: 'Nouveau composant',
            descDz: 'شرح مبسط لكيفية وفائدة هذا المكون بالدارجة الجزائية.',
            quantity: 1
        };
        setCurrentLP({
            ...currentLP,
            items: [...currentLP.items, newItem]
        });
    };

    const handleUpdateItem = (index: number, field: keyof LandingPageItem, value: any) => {
        if (!currentLP) return;
        const updated = [...currentLP.items];
        updated[index] = { ...updated[index], [field]: value };
        setCurrentLP({ ...currentLP, items: updated });
    };

    const handleDeleteItem = (index: number) => {
        if (!currentLP) return;
        const updated = currentLP.items.filter((_, i) => i !== index);
        setCurrentLP({ ...currentLP, items: updated });
    };

    // Gestion des variantes
    const handleAddVariant = () => {
        if (!currentLP) return;
        const newVar: LandingPageVariant = {
            id: String(Date.now()),
            name: 'Formule / Variante',
            description: 'Description de la formule',
            price: currentLP.price,
            stock: 10,
            image: currentLP.photos[0] || ''
        };
        setCurrentLP({
            ...currentLP,
            hasVariants: true,
            variants: [...currentLP.variants, newVar]
        });
    };

    const handleUpdateVariant = (index: number, field: keyof LandingPageVariant, value: any) => {
        if (!currentLP) return;
        const updated = [...currentLP.variants];
        updated[index] = { ...updated[index], [field]: value };
        setCurrentLP({ ...currentLP, variants: updated });
    };

    const handleDeleteVariant = (index: number) => {
        if (!currentLP) return;
        const updated = currentLP.variants.filter((_, i) => i !== index);
        setCurrentLP({
            ...currentLP,
            variants: updated,
            hasVariants: updated.length > 0
        });
    };

    return (
        <div className="space-y-6">
            
            {/* EN-TÊTE PRINCIPAL */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-[#EFE4D8]">
                <div>
                    <div className="flex items-center gap-2">
                        <span className="p-2 rounded-xl bg-[#390102] text-[#BFA893] shadow-sm">
                            <Sparkles size={20} />
                        </span>
                        <div>
                            <h1 className="font-serif text-2xl font-bold text-[#390102]">Landing Pages Personnalisées</h1>
                            <p className="text-xs text-[#7A5459] mt-0.5">
                                Créez des pages de vente ultra-rapides, adaptées aux publicités Instagram/TikTok, avec checkout direct en Algérie.
                            </p>
                        </div>
                    </div>
                </div>

                {!isEditing && (
                    <button
                        onClick={handleCreateNew}
                        className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#390102] hover:bg-[#18080A] text-[#FAF5EF] text-xs font-semibold rounded-xl shadow-md transition-all active:scale-[0.99]"
                    >
                        <Plus size={16} />
                        <span>Créer une nouvelle Landing Page</span>
                    </button>
                )}
            </div>

            {/* ========================================================= */}
            {/* ÉDITEUR DE MICRO-DÉTAILS (MODAL / PAGE PLEINE)            */}
            {/* ========================================================= */}
            {isEditing && currentLP ? (
                <div className="bg-white border border-[#EFE4D8] rounded-2xl shadow-xl overflow-hidden">
                    
                    {/* BARRE SUPÉRIEURE DE L'ÉDITEUR */}
                    <div className="bg-[#18080A] text-[#FAF5EF] px-6 py-4 flex flex-wrap items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <span className="text-xs text-[#BFA893] uppercase font-bold tracking-wider">Édition de :</span>
                            <span className="font-bold text-sm text-white">{currentLP.title}</span>
                            <span className="text-xs bg-white/10 px-2.5 py-0.5 rounded text-[#BFA893] font-mono">
                                /lp/{currentLP.slug}
                            </span>
                        </div>

                        <div className="flex items-center gap-2.5">
                            <button
                                onClick={() => setShowLivePreview(!showLivePreview)}
                                className={cn(
                                    "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all",
                                    showLivePreview 
                                        ? "bg-[#BFA893] text-[#18080A] border-[#BFA893]" 
                                        : "bg-white/10 text-white border-white/20 hover:bg-white/20"
                                )}
                            >
                                <Eye size={14} />
                                <span>{showLivePreview ? 'Fermer Aperçu' : 'Aperçu Direct'}</span>
                            </button>

                            <button
                                onClick={handleSaveCurrentLP}
                                disabled={saving}
                                className="flex items-center gap-1.5 px-4 py-1.5 bg-[#B8935A] hover:bg-[#D4AF7A] text-[#18080A] text-xs font-bold rounded-lg shadow transition-all active:scale-95"
                            >
                                <Save size={14} />
                                <span>{saving ? 'Enregistrement...' : 'Enregistrer la page'}</span>
                            </button>

                            <button
                                onClick={() => { setIsEditing(false); setCurrentLP(null); }}
                                className="p-1.5 text-white/60 hover:text-white rounded-lg hover:bg-white/10"
                            >
                                <X size={18} />
                            </button>
                        </div>
                    </div>

                    {/* ONGLETS DES MICRO-DÉTAILS */}
                    <div className="border-b border-[#EFE4D8] bg-[#FAF5EF]/60 px-6 flex flex-wrap gap-1">
                        {[
                            { key: 'general', label: '1. Informations & URL', icon: FileText },
                            { key: 'offer', label: '2. Prix, Offre & Variantes', icon: Tag },
                            { key: 'photos', label: '3. Photos & Médias', icon: ImageIcon },
                            { key: 'items', label: '4. Composants du Pack (17+)', icon: Layers },
                            { key: 'design', label: '5. Couleurs & Style', icon: Palette },
                            { key: 'contact', label: '6. Instagram & Réassurance', icon: MessageCircle },
                        ].map((t) => (
                            <button
                                key={t.key}
                                onClick={() => setActiveTab(t.key as any)}
                                className={cn(
                                    "flex items-center gap-2 px-4 py-3 text-xs font-bold border-b-2 transition-all -mb-px",
                                    activeTab === t.key
                                        ? "border-[#390102] text-[#390102] bg-white rounded-t-lg"
                                        : "border-transparent text-[#6E5357] hover:text-[#18080A]"
                                )}
                            >
                                <t.icon size={15} />
                                <span>{t.label}</span>
                            </button>
                        ))}
                    </div>

                    {/* CONTENU PRINCIPAL DE L'ÉDITEUR AVEC APERÇU OPTIONNEL */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
                        
                        {/* FORMULAIRE DES PARAMÈTRES (COLONNE GAUCHE) */}
                        <div className={cn("p-6 space-y-6 overflow-y-auto max-h-[75vh]", showLivePreview ? "lg:col-span-7 border-r border-[#EFE4D8]" : "lg:col-span-12")}>
                            
                            {/* TAB 1: INFORMATIONS GÉNÉRALES & URL */}
                            {activeTab === 'general' && (
                                <div className="space-y-4">
                                    <div className="bg-[#FAF5EF] p-4 rounded-xl border border-[#EFE4D8] mb-4">
                                        <label className="block text-xs font-bold text-[#390102] mb-1">
                                            Associer à un produit existant du catalogue (Optionnel) :
                                        </label>
                                        <p className="text-[11px] text-[#7A5459] mb-2">
                                            Permet de pré-remplir automatiquement le titre, le prix, les photos et les variantes depuis votre stock.
                                        </p>
                                        <select
                                            value={currentLP.productId || ''}
                                            onChange={(e) => handleSelectProduct(e.target.value)}
                                            className="w-full px-3 py-2 bg-white border border-[#EFE4D8] text-xs rounded-lg"
                                        >
                                            <option value="">-- Pack indépendant / Personnalisé (Aucun produit lié) --</option>
                                            {catalogProducts.map(p => (
                                                <option key={p.id} value={p.id}>{p.name} ({p.price} DA)</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-[#18080A] mb-1">
                                            Titre principal (en Arabe) <span className="text-red-600">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={currentLP.title}
                                            onChange={(e) => setCurrentLP({ ...currentLP, title: e.target.value })}
                                            className="w-full px-3.5 py-2.5 border border-[#EFE4D8] text-xs font-semibold rounded-lg text-right"
                                            dir="rtl"
                                            placeholder="باك متكامل للأظافر والـ Press-on nails"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-[#18080A] mb-1">
                                            Sous-titre / Description d'accroche (en Arabe)
                                        </label>
                                        <textarea
                                            rows={3}
                                            value={currentLP.subtitle}
                                            onChange={(e) => setCurrentLP({ ...currentLP, subtitle: e.target.value })}
                                            className="w-full px-3.5 py-2.5 border border-[#EFE4D8] text-xs rounded-lg text-right"
                                            dir="rtl"
                                            placeholder="كل الأدوات الاحترافية والدرجات الأساسية مجموعة في حقيبة واحدة..."
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-bold text-[#18080A] mb-1">
                                                Slug URL de la page (Lien public) <span className="text-red-600">*</span>
                                            </label>
                                            <div className="flex items-center">
                                                <span className="px-3 py-2.5 bg-[#FAF5EF] border border-r-0 border-[#EFE4D8] text-[11px] text-[#7A5459] rounded-l-lg font-mono">
                                                    /lp/
                                                </span>
                                                <input
                                                    type="text"
                                                    value={currentLP.slug}
                                                    onChange={(e) => setCurrentLP({ ...currentLP, slug: e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, '-') })}
                                                    className="w-full px-3 py-2.5 border border-[#EFE4D8] text-xs font-mono rounded-r-lg"
                                                    placeholder="pack-onglerie"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-xs font-bold text-[#18080A] mb-1">
                                                Nom de la marque dans le Header
                                            </label>
                                            <input
                                                type="text"
                                                value={currentLP.brandName}
                                                onChange={(e) => setCurrentLP({ ...currentLP, brandName: e.target.value })}
                                                className="w-full px-3.5 py-2.5 border border-[#EFE4D8] text-xs font-semibold rounded-lg"
                                                placeholder="MEEY NAIL SHOP"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between p-3.5 bg-[#FAF5EF] border border-[#EFE4D8] rounded-xl">
                                        <div>
                                            <span className="text-xs font-bold text-[#390102]">Statut de publication :</span>
                                            <p className="text-[11px] text-[#7A5459]">Si activé, la page est accessible aux visiteurs et aux commandes.</p>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => setCurrentLP({ ...currentLP, isActive: !currentLP.isActive })}
                                            className={cn(
                                                "px-3 py-1 text-xs font-bold rounded-full transition-colors",
                                                currentLP.isActive ? "bg-emerald-100 text-emerald-800" : "bg-gray-200 text-gray-700"
                                            )}
                                        >
                                            {currentLP.isActive ? 'Active en ligne' : 'Désactivée (Brouillon)'}
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* TAB 2: PRIX, OFFRE & VARIANTES */}
                            {activeTab === 'offer' && (
                                <div className="space-y-5">
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                        <div>
                                            <label className="block text-xs font-bold text-[#18080A] mb-1">
                                                Prix de vente (DA) <span className="text-red-600">*</span>
                                            </label>
                                            <input
                                                type="number"
                                                value={currentLP.price}
                                                onChange={(e) => setCurrentLP({ ...currentLP, price: Number(e.target.value) })}
                                                className="w-full px-3.5 py-2.5 border border-[#EFE4D8] text-sm font-bold rounded-lg font-mono"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-xs font-bold text-[#18080A] mb-1">
                                                Ancien prix barré (DA)
                                            </label>
                                            <input
                                                type="number"
                                                value={currentLP.compareAtPrice || ''}
                                                onChange={(e) => setCurrentLP({ ...currentLP, compareAtPrice: e.target.value ? Number(e.target.value) : undefined })}
                                                className="w-full px-3.5 py-2.5 border border-[#EFE4D8] text-sm font-bold rounded-lg font-mono text-gray-400"
                                                placeholder="8500"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-xs font-bold text-[#18080A] mb-1">
                                                Devise affichée
                                            </label>
                                            <input
                                                type="text"
                                                value={currentLP.currency}
                                                onChange={(e) => setCurrentLP({ ...currentLP, currency: e.target.value })}
                                                className="w-full px-3.5 py-2.5 border border-[#EFE4D8] text-xs font-bold rounded-lg"
                                            />
                                        </div>
                                    </div>

                                    {/* SECTION GESTION DES FORMULES / VARIANTES */}
                                    <div className="border-t border-[#EFE4D8] pt-4">
                                        <div className="flex items-center justify-between mb-3">
                                            <div>
                                                <h3 className="text-xs font-bold text-[#390102]">Offre à formules multiples / Variantes :</h3>
                                                <p className="text-[11px] text-[#7A5459]">
                                                    Activez si vous proposez par exemple : "Pack Standard", "Pack Pro avec Lampe Grand Format", etc.
                                                </p>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    if (!currentLP.hasVariants) {
                                                        handleAddVariant();
                                                    } else {
                                                        setCurrentLP({ ...currentLP, hasVariants: false, variants: [] });
                                                    }
                                                }}
                                                className={cn(
                                                    "px-3 py-1 text-xs font-bold rounded-full transition-colors",
                                                    currentLP.hasVariants ? "bg-[#390102] text-white" : "bg-gray-200 text-gray-700"
                                                )}
                                            >
                                                {currentLP.hasVariants ? 'Variantes Actives' : 'Pack Unique (Désactivé)'}
                                            </button>
                                        </div>

                                        {currentLP.hasVariants && (
                                            <div className="space-y-3 bg-[#FAF5EF] p-4 rounded-xl border border-[#EFE4D8]">
                                                {currentLP.variants.map((v, idx) => (
                                                    <div key={v.id || idx} className="p-3 bg-white border border-[#EFE4D8] rounded-lg space-y-2">
                                                        <div className="flex items-center justify-between">
                                                            <span className="text-xs font-bold text-[#390102]">Formule #{idx + 1}</span>
                                                            <button
                                                                type="button"
                                                                onClick={() => handleDeleteVariant(idx)}
                                                                className="text-red-500 hover:text-red-700 text-xs"
                                                            >
                                                                <Trash2 size={14} />
                                                            </button>
                                                        </div>
                                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                                                            <input
                                                                type="text"
                                                                value={v.name}
                                                                onChange={(e) => handleUpdateVariant(idx, 'name', e.target.value)}
                                                                placeholder="Nom de la formule"
                                                                className="px-2.5 py-1.5 border border-[#EFE4D8] text-xs rounded"
                                                            />
                                                            <input
                                                                type="number"
                                                                value={v.price}
                                                                onChange={(e) => handleUpdateVariant(idx, 'price', Number(e.target.value))}
                                                                placeholder="Prix (DA)"
                                                                className="px-2.5 py-1.5 border border-[#EFE4D8] text-xs rounded font-mono"
                                                            />
                                                            <input
                                                                type="text"
                                                                value={v.image || ''}
                                                                onChange={(e) => handleUpdateVariant(idx, 'image', e.target.value)}
                                                                placeholder="URL photo de la variante"
                                                                className="px-2.5 py-1.5 border border-[#EFE4D8] text-xs rounded text-left font-mono"
                                                            />
                                                        </div>
                                                    </div>
                                                ))}

                                                <button
                                                    type="button"
                                                    onClick={handleAddVariant}
                                                    className="w-full py-2 bg-white border border-dashed border-[#B8935A] text-[#B8935A] text-xs font-bold rounded-lg hover:bg-[#FAF5EF]"
                                                >
                                                    + Ajouter une autre formule / variante
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* TAB 3: PHOTOS & MÉDIAS FULL-WIDTH */}
                            {activeTab === 'photos' && (
                                <div className="space-y-4">
                                    <div className="bg-[#FAF5EF] p-4 rounded-xl border border-[#EFE4D8] flex items-center justify-between">
                                        <div>
                                            <h3 className="text-xs font-bold text-[#390102]">Photos du produit (Full Width)</h3>
                                            <p className="text-[11px] text-[#7A5459]">
                                                La 1ère photo s'affiche en grand format bord à bord (100% de la largeur du conteneur).
                                            </p>
                                        </div>
                                        
                                        <label className="inline-flex items-center gap-1.5 px-3 py-2 bg-[#390102] hover:bg-[#18080A] text-white text-xs font-semibold rounded-lg cursor-pointer">
                                            <Upload size={14} />
                                            <span>{uploadingImage ? 'Upload...' : '+ Uploader une photo'}</span>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleUploadPhoto}
                                                disabled={uploadingImage}
                                                className="hidden"
                                            />
                                        </label>
                                    </div>

                                    {/* Liste des photos */}
                                    <div className="space-y-3">
                                        {currentLP.photos.map((p, idx) => (
                                            <div key={idx} className="flex items-center gap-3 p-2.5 bg-white border border-[#EFE4D8] rounded-xl">
                                                <div className="w-14 h-14 relative bg-[#FAF5EF] rounded-lg overflow-hidden shrink-0 border border-[#EFE4D8]">
                                                    <img src={p} alt="" className="w-full h-full object-cover" />
                                                </div>

                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-[11px] font-bold text-[#390102]">
                                                            {idx === 0 ? 'Photo Principale (Full-width)' : `Photo #${idx + 1}`}
                                                        </span>
                                                    </div>
                                                    <input
                                                        type="text"
                                                        value={p}
                                                        onChange={(e) => {
                                                            const copy = [...currentLP.photos];
                                                            copy[idx] = e.target.value;
                                                            setCurrentLP({ ...currentLP, photos: copy });
                                                        }}
                                                        className="w-full px-2 py-1 mt-1 border border-[#EFE4D8] text-[11px] font-mono rounded"
                                                    />
                                                </div>

                                                <div className="flex items-center gap-1">
                                                    {idx > 0 && (
                                                        <button
                                                            type="button"
                                                            title="Mettre en photo principale"
                                                            onClick={() => {
                                                                const copy = [...currentLP.photos];
                                                                const [item] = copy.splice(idx, 1);
                                                                copy.unshift(item);
                                                                setCurrentLP({ ...currentLP, photos: copy });
                                                            }}
                                                            className="p-1.5 text-gray-500 hover:text-[#390102] text-xs font-bold"
                                                        >
                                                            ↑ Top
                                                        </button>
                                                    )}
                                                    {currentLP.photos.length > 1 && (
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                const copy = currentLP.photos.filter((_, i) => i !== idx);
                                                                setCurrentLP({ ...currentLP, photos: copy });
                                                            }}
                                                            className="p-1.5 text-red-500 hover:text-red-700"
                                                        >
                                                            <Trash2 size={14} />
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        ))}

                                        <button
                                            type="button"
                                            onClick={() => {
                                                const url = prompt('Collez l\'URL web de l\'image :');
                                                if (url && url.trim()) {
                                                    setCurrentLP({ ...currentLP, photos: [...currentLP.photos, url.trim()] });
                                                }
                                            }}
                                            className="w-full py-2 bg-[#FAF5EF] border border-dashed border-[#B8935A] text-[#B8935A] text-xs font-bold rounded-lg hover:bg-white"
                                        >
                                            + Ajouter par lien URL
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* TAB 4: COMPOSANTS DU PACK (17+ PIÈCES) */}
                            {activeTab === 'items' && (
                                <div className="space-y-4">
                                    <div className="bg-[#FAF5EF] p-4 rounded-xl border border-[#EFE4D8] space-y-2">
                                        <div className="flex items-center justify-between">
                                            <h3 className="text-xs font-bold text-[#390102]">
                                                Détail des pièces incluses ({currentLP.items.length} éléments)
                                            </h3>
                                            <div className="flex items-center gap-2">
                                                <label className="text-xs text-[#7A5459]">Section pliable (accordéon) :</label>
                                                <input
                                                    type="checkbox"
                                                    checked={currentLP.isAccordion}
                                                    onChange={(e) => setCurrentLP({ ...currentLP, isAccordion: e.target.checked })}
                                                    className="accent-[#390102]"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-[11px] font-bold text-[#7A5459] mb-1">Titre de la section composants :</label>
                                            <input
                                                type="text"
                                                value={currentLP.accordionTitle || ''}
                                                onChange={(e) => setCurrentLP({ ...currentLP, accordionTitle: e.target.value })}
                                                className="w-full px-3 py-1.5 bg-white border border-[#EFE4D8] text-xs rounded text-right"
                                                dir="rtl"
                                                placeholder="المكونات الأساسية للباك (17 عنصر بالتفصيل) :"
                                            />
                                        </div>
                                    </div>

                                    {/* Liste ordonnée des composants */}
                                    <div className="space-y-2.5">
                                        {currentLP.items.map((item, idx) => (
                                            <div key={item.id || idx} className="p-3 bg-white border border-[#EFE4D8] rounded-xl flex items-start gap-3">
                                                <span className="w-6 h-6 rounded-full bg-[#FAF5EF] border border-[#B8935A]/40 text-[#B8935A] text-xs font-bold flex items-center justify-center shrink-0 num mt-1">
                                                    {String(idx + 1).padStart(2, '0')}
                                                </span>

                                                <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2">
                                                    <div>
                                                        <label className="block text-[10px] uppercase font-bold text-[#7A5459] mb-0.5">
                                                            Nom en Français
                                                        </label>
                                                        <input
                                                            type="text"
                                                            value={item.nameFr}
                                                            onChange={(e) => handleUpdateItem(idx, 'nameFr', e.target.value)}
                                                            className="w-full px-2.5 py-1.5 border border-[#EFE4D8] text-xs font-semibold rounded text-left"
                                                            placeholder="Ex: Mini lampe UV"
                                                        />
                                                    </div>

                                                    <div>
                                                        <label className="block text-[10px] uppercase font-bold text-[#7A5459] mb-0.5 text-right">
                                                            الوصف بالدارجة الجزائيرية (Darija DZ)
                                                        </label>
                                                        <input
                                                            type="text"
                                                            value={item.descDz}
                                                            onChange={(e) => handleUpdateItem(idx, 'descDz', e.target.value)}
                                                            className="w-full px-2.5 py-1.5 border border-[#EFE4D8] text-xs rounded text-right"
                                                            dir="rtl"
                                                            placeholder="شرح مبسط لكيفية استعماله بالدارجة..."
                                                        />
                                                    </div>
                                                </div>

                                                <button
                                                    type="button"
                                                    onClick={() => handleDeleteItem(idx)}
                                                    className="p-1.5 text-red-500 hover:text-red-700 shrink-0 mt-3"
                                                >
                                                    <Trash2 size={15} />
                                                </button>
                                            </div>
                                        ))}

                                        <button
                                            type="button"
                                            onClick={handleAddItem}
                                            className="w-full py-2.5 bg-[#FAF5EF] border border-dashed border-[#390102] text-[#390102] text-xs font-bold rounded-xl hover:bg-white transition-colors"
                                        >
                                            + Ajouter un article au pack
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* TAB 5: COULEURS & DESIGN */}
                            {activeTab === 'design' && (
                                <div className="space-y-5">
                                    <div className="p-4 bg-[#FAF5EF] border border-[#EFE4D8] rounded-xl">
                                        <h3 className="text-xs font-bold text-[#390102] mb-1">Palettes recommandées MEEY Nail Shop :</h3>
                                        <div className="flex flex-wrap gap-2 mt-2">
                                            {[
                                                { name: 'Rouge Brand & Or', primary: '#390102', accent: '#BFA893', bg: '#FAF5EF' },
                                                { name: 'Encre Noire & Doré', primary: '#18080A', accent: '#B8935A', bg: '#FAF5EF' },
                                                { name: 'Rouge Velours', primary: '#5B0B14', accent: '#D4AF7A', bg: '#FBF8F4' },
                                                { name: 'Prune & Crème', primary: '#2E1216', accent: '#BFA893', bg: '#F3EAE0' },
                                            ].map((preset) => (
                                                <button
                                                    key={preset.name}
                                                    type="button"
                                                    onClick={() => setCurrentLP({
                                                        ...currentLP,
                                                        primaryColor: preset.primary,
                                                        accentColor: preset.accent,
                                                        backgroundColor: preset.bg
                                                    })}
                                                    className="flex items-center gap-2 px-3 py-1.5 bg-white border border-[#EFE4D8] rounded-lg text-xs font-medium hover:border-[#390102]"
                                                >
                                                    <span className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: preset.primary }}></span>
                                                    <span>{preset.name}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                        <div>
                                            <label className="block text-xs font-bold text-[#18080A] mb-1">Couleur Principale (Boutons & Titres)</label>
                                            <div className="flex items-center gap-2">
                                                <input
                                                    type="color"
                                                    value={currentLP.primaryColor}
                                                    onChange={(e) => setCurrentLP({ ...currentLP, primaryColor: e.target.value })}
                                                    className="w-10 h-10 p-0.5 border border-[#EFE4D8] rounded cursor-pointer"
                                                />
                                                <input
                                                    type="text"
                                                    value={currentLP.primaryColor}
                                                    onChange={(e) => setCurrentLP({ ...currentLP, primaryColor: e.target.value })}
                                                    className="w-full px-2.5 py-2 border border-[#EFE4D8] text-xs font-mono rounded"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-xs font-bold text-[#18080A] mb-1">Couleur Dorée / Accent</label>
                                            <div className="flex items-center gap-2">
                                                <input
                                                    type="color"
                                                    value={currentLP.accentColor}
                                                    onChange={(e) => setCurrentLP({ ...currentLP, accentColor: e.target.value })}
                                                    className="w-10 h-10 p-0.5 border border-[#EFE4D8] rounded cursor-pointer"
                                                />
                                                <input
                                                    type="text"
                                                    value={currentLP.accentColor}
                                                    onChange={(e) => setCurrentLP({ ...currentLP, accentColor: e.target.value })}
                                                    className="w-full px-2.5 py-2 border border-[#EFE4D8] text-xs font-mono rounded"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-xs font-bold text-[#18080A] mb-1">Couleur de Fond de la page</label>
                                            <div className="flex items-center gap-2">
                                                <input
                                                    type="color"
                                                    value={currentLP.backgroundColor}
                                                    onChange={(e) => setCurrentLP({ ...currentLP, backgroundColor: e.target.value })}
                                                    className="w-10 h-10 p-0.5 border border-[#EFE4D8] rounded cursor-pointer"
                                                />
                                                <input
                                                    type="text"
                                                    value={currentLP.backgroundColor}
                                                    onChange={(e) => setCurrentLP({ ...currentLP, backgroundColor: e.target.value })}
                                                    className="w-full px-2.5 py-2 border border-[#EFE4D8] text-xs font-mono rounded"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* TAB 6: INSTAGRAM & RÉASSURANCE */}
                            {activeTab === 'contact' && (
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-xs font-bold text-[#18080A] mb-1">
                                            Lien Direct Instagram (Profil ou Chat Privé)
                                        </label>
                                        <input
                                            type="url"
                                            value={currentLP.instagramUrl || ''}
                                            onChange={(e) => setCurrentLP({ ...currentLP, instagramUrl: e.target.value })}
                                            className="w-full px-3.5 py-2.5 border border-[#EFE4D8] text-xs rounded-lg font-mono text-left"
                                            placeholder="https://ig.me/m/meeynailshop"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-[#18080A] mb-1">
                                            Message pré-rempli pour la cliente en Arabe :
                                        </label>
                                        <input
                                            type="text"
                                            value={currentLP.instagramMessage || ''}
                                            onChange={(e) => setCurrentLP({ ...currentLP, instagramMessage: e.target.value })}
                                            className="w-full px-3.5 py-2.5 border border-[#EFE4D8] text-xs rounded-lg text-right"
                                            dir="rtl"
                                            placeholder="السلام عليكم، حبيت نستفسر ونعرف معلومات أكثر على هذا الباك"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-[#18080A] mb-1">
                                            Texte de réassurance (Sous le formulaire de commande) :
                                        </label>
                                        <input
                                            type="text"
                                            value={currentLP.guaranteeText || ''}
                                            onChange={(e) => setCurrentLP({ ...currentLP, guaranteeText: e.target.value })}
                                            className="w-full px-3.5 py-2.5 border border-[#EFE4D8] text-xs rounded-lg text-right"
                                            dir="rtl"
                                            placeholder="الدفع يداً بيد عند الاستلام. تقدري تفتحي الطرد وتعايني سلعتك قبل ما تخلصي."
                                        />
                                    </div>
                                </div>
                            )}

                        </div>

                        {/* APERÇU EN DIRECT (COLONNE DROITE) */}
                        {showLivePreview && (
                            <div className="lg:col-span-5 bg-[#18080A]/5 p-4 flex flex-col items-center justify-start overflow-y-auto max-h-[75vh]">
                                <div className="flex items-center gap-2 mb-3 bg-white px-3 py-1.5 rounded-full border border-[#EFE4D8] shadow-sm">
                                    <button
                                        type="button"
                                        onClick={() => setPreviewMode('mobile')}
                                        className={cn("p-1 rounded text-xs flex items-center gap-1", previewMode === 'mobile' ? "bg-[#390102] text-white" : "text-gray-600")}
                                    >
                                        <Smartphone size={14} /> Mobile
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setPreviewMode('desktop')}
                                        className={cn("p-1 rounded text-xs flex items-center gap-1", previewMode === 'desktop' ? "bg-[#390102] text-white" : "text-gray-600")}
                                    >
                                        <Monitor size={14} /> Bureau
                                    </button>
                                </div>

                                {/* Frame de simulation */}
                                <div 
                                    className={cn(
                                        "bg-white rounded-2xl shadow-2xl border border-gray-300 overflow-hidden transition-all duration-300",
                                        previewMode === 'mobile' ? "w-[360px]" : "w-full max-w-lg"
                                    )}
                                    style={{ backgroundColor: currentLP.backgroundColor }}
                                    dir="rtl"
                                >
                                    {/* Header simulation */}
                                    <div className="p-4 text-center border-b border-[#EFE4D8]">
                                        <div className="w-8 h-8 mx-auto mb-1.5 rounded-full bg-white border border-[#BFA893] flex items-center justify-center text-[#390102] font-bold text-xs">
                                            ✓
                                        </div>
                                        <div className="text-[10px] uppercase font-bold text-[#B8935A] tracking-wider">
                                            {currentLP.brandName}
                                        </div>
                                        <h4 className="text-sm font-bold text-[#390102] mt-1 leading-snug">
                                            {currentLP.title}
                                        </h4>
                                    </div>

                                    {/* Image Full Width */}
                                    <div className="w-full aspect-[4/3] bg-white overflow-hidden">
                                        <img src={currentLP.photos[0]} alt="" className="w-full h-full object-cover" />
                                    </div>

                                    {/* Prix & Bouton */}
                                    <div className="p-4 space-y-3">
                                        <div className="flex justify-between items-baseline border-b border-[#EFE4D8] pb-2">
                                            <span className="text-[11px] text-gray-500">سعر الباك الكامل:</span>
                                            <span className="text-lg font-bold text-[#390102] font-mono">
                                                {currentLP.price} DA
                                            </span>
                                        </div>

                                        <div className="p-2.5 bg-[#FAF5EF] rounded text-center text-xs text-gray-600">
                                            {currentLP.items.length} قطع أساسية متكاملة
                                        </div>

                                        <button 
                                            className="w-full py-2.5 text-white text-xs font-bold rounded-lg shadow"
                                            style={{ backgroundColor: currentLP.primaryColor }}
                                        >
                                            تأكيد الطلب الآن
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                    </div>

                </div>
            ) : (
                /* ========================================================= */
                /* LISTE DE TOUTES LES LANDING PAGES EXISTANTES              */
                /* ========================================================= */
                <div className="space-y-4">
                    {landingPages.length === 0 ? (
                        <div className="bg-white border border-[#EFE4D8] rounded-2xl p-12 text-center">
                            <Sparkles className="w-12 h-12 text-[#BFA893] mx-auto mb-3 opacity-60" />
                            <h3 className="font-serif text-lg font-bold text-[#390102]">Aucune Landing Page créée</h3>
                            <p className="text-xs text-[#7A5459] mt-1 mb-4">
                                Créez votre première page d'atterrissage optimisée pour vos campagnes publicitaires.
                            </p>
                            <button
                                onClick={handleCreateNew}
                                className="px-5 py-2.5 bg-[#390102] text-white text-xs font-bold rounded-xl shadow"
                            >
                                + Créer une Landing Page
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                            {landingPages.map((lp) => (
                                <div 
                                    key={lp.id}
                                    className="bg-white border border-[#EFE4D8] rounded-2xl shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col justify-between"
                                >
                                    <div>
                                        {/* Image couverture */}
                                        <div className="w-full aspect-[16/10] bg-[#FAF5EF] relative overflow-hidden border-b border-[#EFE4D8]">
                                            <img 
                                                src={lp.photos[0] || 'https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=800&q=80'} 
                                                alt={lp.title} 
                                                className="w-full h-full object-cover"
                                            />
                                            
                                            {/* Badge Statut */}
                                            <button
                                                onClick={() => handleToggleActive(lp.id)}
                                                className={cn(
                                                    "absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-bold shadow-sm backdrop-blur-md transition-transform hover:scale-105",
                                                    lp.isActive ? "bg-emerald-500/90 text-white" : "bg-gray-800/80 text-white/80"
                                                )}
                                            >
                                                {lp.isActive ? '● En ligne (Actif)' : '○ Brouillon'}
                                            </button>

                                            {/* Badge Prix */}
                                            <div className="absolute bottom-3 right-3 px-3 py-1 bg-[#18080A]/80 text-[#FAF5EF] backdrop-blur-md rounded-lg text-xs font-bold font-mono">
                                                {lp.price.toLocaleString('fr-DZ')} DA
                                            </div>
                                        </div>

                                        {/* Contenu */}
                                        <div className="p-5">
                                            <div className="flex items-center gap-1.5 text-[11px] text-[#B8935A] font-bold uppercase tracking-wider mb-1">
                                                <span>{lp.brandName}</span>
                                                <span>•</span>
                                                <span>{lp.items.length} pièces</span>
                                            </div>

                                            <h3 className="font-bold text-sm text-[#390102] line-clamp-1 text-right" dir="rtl">
                                                {lp.title}
                                            </h3>

                                            <p className="text-xs text-[#7A5459] line-clamp-2 mt-1.5 text-right leading-relaxed" dir="rtl">
                                                {lp.subtitle}
                                            </p>

                                            {/* Lien public */}
                                            <div className="mt-4 pt-3 border-t border-[#FAF5EF] flex items-center justify-between text-xs">
                                                <span className="text-[11px] text-gray-500 font-mono">/lp/{lp.slug}</span>
                                                <button
                                                    onClick={() => {
                                                        const fullUrl = `${window.location.origin}/lp/${lp.slug}`;
                                                        navigator.clipboard.writeText(fullUrl);
                                                        toast.success('Lien copié dans le presse-papier !');
                                                    }}
                                                    className="flex items-center gap-1 text-[11px] text-[#B8935A] hover:underline font-medium"
                                                >
                                                    <Copy size={12} />
                                                    <span>Copier lien</span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="p-4 bg-[#FAF5EF]/60 border-t border-[#EFE4D8] flex items-center justify-between gap-2">
                                        <a
                                            href={`/lp/${lp.slug}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[#EFE4D8] hover:border-[#390102] text-[#390102] text-xs font-semibold rounded-lg shadow-sm transition-colors"
                                        >
                                            <ExternalLink size={13} />
                                            <span>Voir la page</span>
                                        </a>

                                        <div className="flex items-center gap-1">
                                            <button
                                                onClick={() => handleDuplicate(lp)}
                                                title="Dupliquer"
                                                className="p-1.5 text-gray-600 hover:text-[#390102] rounded-lg hover:bg-white"
                                            >
                                                <Copy size={15} />
                                            </button>

                                            <button
                                                onClick={() => handleEdit(lp)}
                                                title="Modifier les micro-détails"
                                                className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-[#390102] hover:bg-[#18080A] text-white text-xs font-bold rounded-lg shadow transition-colors"
                                            >
                                                <Edit3 size={13} />
                                                <span>Modifier</span>
                                            </button>

                                            <button
                                                onClick={() => handleDelete(lp.id)}
                                                title="Supprimer"
                                                className="p-1.5 text-red-500 hover:text-red-700 rounded-lg hover:bg-red-50"
                                            >
                                                <Trash2 size={15} />
                                            </button>
                                        </div>
                                    </div>

                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

        </div>
    );
}
