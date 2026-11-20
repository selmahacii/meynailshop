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
    Monitor,
    ArrowUp,
    ArrowDown,
    ShoppingBag,
    CheckSquare,
    Star,
    HelpCircle,
    Sliders,
    Video,
    Award
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { SettingsAPI, ProductsAPI, UploadAPI } from '@/lib/api/client';
import { useSettings } from '@/lib/hooks/useSettings';
import { 
    LandingPageData, 
    LandingPageItem, 
    LandingPageVariant,
    LandingPageBenefit,
    LandingPageReview,
    LandingPageFaq
} from '@/types/landing-page';
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
    const [activeTab, setActiveTab] = useState<'sections' | 'general' | 'offer' | 'photos' | 'items' | 'marketing' | 'form' | 'design_contact'>('sections');
    const [previewMode, setPreviewMode] = useState<'mobile' | 'desktop'>('mobile');
    const [showLivePreview, setShowLivePreview] = useState(false);
    const [uploadingImage, setUploadingImage] = useState(false);
    const [uploadingLogo, setUploadingLogo] = useState(false);

    // Initialisation
    useEffect(() => {
        loadData();
    }, [settings]);

    const loadData = async () => {
        try {
            setLoading(true);
            if (settings?.landingPages && Array.isArray(settings.landingPages) && settings.landingPages.length > 0) {
                setLandingPages(settings.landingPages);
            } else {
                setLandingPages(DEFAULT_LANDING_PAGES);
            }

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
                toast.success('Toutes les configurations de la landing page ont été enregistrées en production !');
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
            priceBadgeText: 'سعر الباك الكامل (عناصر متكاملة)',
            deliveryBadgeText: 'توصيل متوفر لـ 58 ولاية',
            
            // Section toggles
            showBrandHeader: true,
            showGallery: true,
            showPricing: true,
            showVariants: false,
            showItems: true,
            showBenefits: true,
            showVideo: false,
            showReviews: true,
            showFaq: true,
            showOrderForm: true,
            showInstagram: true,
            showReassurance: true,
            showStickyCta: true,

            photos: [
                'https://hnnsaruuigqchikzdiro.supabase.co/storage/v1/object/public/products/4e73288c-a77a-4d2d-a8e2-1ec2dcbb4327.webp'
            ],
            items: [
                { id: '1', nameFr: 'Mini lampe UV', descDz: 'مصباح ميني خفيف وسريع لتجفيف وتثبيت الأظافر.', quantity: 1 },
                { id: '2', nameFr: 'Coupe capsule', descDz: 'مقص احترافي لقص الكبسولات بدقة ونظافة.', quantity: 1 }
            ],
            isAccordion: true,
            accordionTitle: 'المكونات الأساسية للباك :',
            accordionBadgeText: 'قطع أساسية',
            variants: [],
            hasVariants: false,
            variantsTitle: 'اختاري الصيغة أو الباك المناسب لكِ :',
            
            benefitsTitle: 'علاش تختاري هذا الباك المتكامل ؟',
            benefitsSubtitle: 'كل ما تحتاجينه لبداية احترافية ونظيفة بدون تضييع الوقت والمال',
            benefits: [
                { id: 'b1', title: 'سلعة احترافية 100%', description: 'مكونات صالون مختارة بعناية تعيش معاك وتمدلك نتيجة نقية ومتقونة من أول تجربة.' },
                { id: 'b2', title: 'توفير كبير في الوقت والدراهم', description: 'بلا ما تحوسي في الحوانيت وتشري كل قطعة وحدها بسعر غالي، جمعنالك كلش في باك واحد شامل.' }
            ],

            reviewsTitle: 'آراء زبوناتنا الوفيات',
            reviewsSubtitle: 'تجارب حقيقية من زبونات بدأن مشروعهن بهذا الباك',
            reviews: [
                { id: 'r1', authorName: 'أمينة ب.', wilaya: 'الجزائر العاصمة', rating: 5, comment: 'الباك جاني كيما في التصويرة تماماً وفيه كلش، لمبة UV خفيفة بزاف والفيرني يشد مليح.', date: 'منذ يومين' }
            ],

            faqTitle: 'الأسئلة الأكثر تكراراً (FAQ)',
            faqSubtitle: 'كل الإجابات عن التوصيل، الدفع، ومكونات الباك',
            faqs: [
                { id: 'f1', question: 'كيفاش نخلص ووقتاش توصلني السلعة ؟', answer: 'الدفع يداً بيد عند الاستلام كاش. التوصيل يوصلك حتى لباب دارك أو للمكتب خلال 24 إلى 48 ساعة حسب ولايتك.' }
            ],

            videoTitle: 'فيديو توضيحي لطريقة الاستعمال والنتيجة',
            videoSubtitle: 'شاهدي كيفاش تخدمي ديزاينات احترافية خطوة بخطوة بالمنتجات لي في الباك',
            videoUrl: '',

            formTitle: 'اطلبي الباك تاعك درك',
            formSubtitle: 'عمري معلوماتك لتحت، التوصيل يوصلك حتى لباب دارك والدفع كاش عند الاستلام بعد ما تفتحي وتعايني سلعتك.',
            nameLabel: 'الاسم واللقب الكامل',
            namePlaceholder: 'مثال: أمينة بوزيد',
            phoneLabel: 'رقم الهاتف (للاتصال وتأكيد الطلب)',
            phonePlaceholder: '05 / 06 / 07 XX XX XX',
            wilayaLabel: 'الولاية',
            communeLabel: 'البلدية',
            deliveryTypeLabel: 'طريقة التوصيل المفضلة',
            homeDeliveryLabel: 'توصيل للدار (Domicile)',
            deskDeliveryLabel: 'استلام من المكتب (Bureau)',
            summaryProductLabel: 'سعر الباك :',
            summaryShippingLabel: 'سعر التوصيل لولايتك :',
            summaryTotalLabel: 'المجموع الكلي عند الاستلام :',
            ctaButtonText: 'تأكيد الطلب',
            stickyCtaText: 'اطلبي الآن — الدفع عند الاستلام',
            submittingText: 'جاري تسجيل طلبكِ...',
            deliveryText: 'توصيل متوفر لكامل 58 ولاية — الدفع كاش عند الاستلام',
            guaranteeText: 'الدفع يداً بيد عند الاستلام. تقدري تفتحي الطرد وتعايني سلعتك قبل ما تخلصي.',
            instagramTitle: 'عندك أي سؤال أو استفسار على هذا الباك؟',
            instagramSubtitle: 'تواصلي معنا مباشرة في الشات الخاص على حسابنا في إنستغرام',
            instagramUrl: 'https://ig.me/m/meeynailshop',
            instagramMessage: 'السلام عليكم، حبيت نستفسر ونعرف معلومات أكثر على هذا الباك',
            instagramButtonLabel: 'مراسلة في الخاص: « السلام عليكم، حبيت نستفسر على الباك »',
            successModalTitle: 'تم تسجيل طلبكِ بنجاح',
            successModalMessage: 'تم استلام طلبكِ في نظام المتجر. سيتصل بكِ فريق العمل عبر الهاتف لتأكيد موعد إرسال الطرد إلى عنوانكِ.',
            successModalButtonText: 'الرجوع إلى المتجر',
            footerText: '© MEEY NAIL SHOP. جميع الحقوق محفوظة.',
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        setCurrentLP(newLP);
        setIsEditing(true);
        setActiveTab('sections');
    };

    const handleEdit = (lp: LandingPageData) => {
        setCurrentLP(JSON.parse(JSON.stringify(lp)));
        setIsEditing(true);
        setActiveTab('sections');
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

    // Upload d'une photo vers Supabase
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

    // Upload Logo Marque
    const handleUploadLogo = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !currentLP) return;

        setUploadingLogo(true);
        try {
            const res = await UploadAPI.uploadProductImage(file);
            if (res.success && res.data?.url) {
                setCurrentLP({
                    ...currentLP,
                    logoUrl: res.data.url
                });
                toast.success('Logo mis à jour avec succès !');
            } else {
                toast.error(res.error || "Échec de l'upload");
            }
        } catch {
            toast.error("Erreur réseau lors de l'upload");
        } finally {
            setUploadingLogo(false);
            e.target.value = '';
        }
    };

    // Gestion des composants du pack
    const handleAddItem = () => {
        if (!currentLP) return;
        const newItem: LandingPageItem = {
            id: String(Date.now()),
            nameFr: 'Nouveau composant',
            descDz: 'شرح مبسط لكيفية وفائدة هذا المكون بالدارجة الجزائيرية.',
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

    const handleMoveItem = (index: number, direction: 'up' | 'down') => {
        if (!currentLP) return;
        const targetIndex = direction === 'up' ? index - 1 : index + 1;
        if (targetIndex < 0 || targetIndex >= currentLP.items.length) return;
        const copy = [...currentLP.items];
        const [moved] = copy.splice(index, 1);
        copy.splice(targetIndex, 0, moved);
        setCurrentLP({ ...currentLP, items: copy });
    };

    const handleDuplicateItem = (index: number) => {
        if (!currentLP) return;
        const target = currentLP.items[index];
        const dup: LandingPageItem = {
            ...target,
            id: String(Date.now()),
            nameFr: target.nameFr + ' (Copie)'
        };
        const copy = [...currentLP.items];
        copy.splice(index + 1, 0, dup);
        setCurrentLP({ ...currentLP, items: copy });
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

    // Gestion des Avantages (Benefits)
    const handleAddBenefit = () => {
        if (!currentLP) return;
        const newB: LandingPageBenefit = {
            id: 'b_' + Date.now(),
            title: 'ميزة جديدة',
            description: 'شرح بسيط ومقنع لفائدة هذه الميزة للزبونة.'
        };
        setCurrentLP({
            ...currentLP,
            benefits: [...(currentLP.benefits || []), newB]
        });
    };

    const handleUpdateBenefit = (index: number, field: keyof LandingPageBenefit, value: any) => {
        if (!currentLP || !currentLP.benefits) return;
        const updated = [...currentLP.benefits];
        updated[index] = { ...updated[index], [field]: value };
        setCurrentLP({ ...currentLP, benefits: updated });
    };

    const handleDeleteBenefit = (index: number) => {
        if (!currentLP || !currentLP.benefits) return;
        const updated = currentLP.benefits.filter((_, i) => i !== index);
        setCurrentLP({ ...currentLP, benefits: updated });
    };

    // Gestion des Avis (Reviews)
    const handleAddReview = () => {
        if (!currentLP) return;
        const newR: LandingPageReview = {
            id: 'r_' + Date.now(),
            authorName: 'زبونة جديدة',
            wilaya: 'الجزائر',
            rating: 5,
            comment: 'تجربة ممتازة وسلعة روعة كيما في الوصف بالضبط.',
            date: 'منذ يوم'
        };
        setCurrentLP({
            ...currentLP,
            reviews: [...(currentLP.reviews || []), newR]
        });
    };

    const handleUpdateReview = (index: number, field: keyof LandingPageReview, value: any) => {
        if (!currentLP || !currentLP.reviews) return;
        const updated = [...currentLP.reviews];
        updated[index] = { ...updated[index], [field]: value };
        setCurrentLP({ ...currentLP, reviews: updated });
    };

    const handleDeleteReview = (index: number) => {
        if (!currentLP || !currentLP.reviews) return;
        const updated = currentLP.reviews.filter((_, i) => i !== index);
        setCurrentLP({ ...currentLP, reviews: updated });
    };

    // Gestion des FAQs
    const handleAddFaq = () => {
        if (!currentLP) return;
        const newF: LandingPageFaq = {
            id: 'f_' + Date.now(),
            question: 'سؤال متكرر جديد ؟',
            answer: 'جواب واضح ومريح يجيب على مخاوف الزبونة ويشجعها على الطلب.'
        };
        setCurrentLP({
            ...currentLP,
            faqs: [...(currentLP.faqs || []), newF]
        });
    };

    const handleUpdateFaq = (index: number, field: keyof LandingPageFaq, value: any) => {
        if (!currentLP || !currentLP.faqs) return;
        const updated = [...currentLP.faqs];
        updated[index] = { ...updated[index], [field]: value };
        setCurrentLP({ ...currentLP, faqs: updated });
    };

    const handleDeleteFaq = (index: number) => {
        if (!currentLP || !currentLP.faqs) return;
        const updated = currentLP.faqs.filter((_, i) => i !== index);
        setCurrentLP({ ...currentLP, faqs: updated });
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
                                Contrôle absolu sur toutes les sections, micro-détails, prix, textes, boutons et composants sans exception.
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
            {/* ÉDITEUR COMPLET DE TOUS LES MICRO-DÉTAILS SANS EXCEPTION   */}
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
                                <span>{saving ? 'Enregistrement...' : 'Enregistrer toutes les modifications'}</span>
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
                            { key: 'sections', label: '1. Sections & Visibilité', icon: Sliders },
                            { key: 'general', label: '2. Infos, Marque & Logo', icon: FileText },
                            { key: 'offer', label: '3. Prix & Variantes', icon: Tag },
                            { key: 'photos', label: '4. Photos (Full-Width)', icon: ImageIcon },
                            { key: 'items', label: '5. Composants Pack (17+)', icon: Layers },
                            { key: 'marketing', label: '6. Avantages, Avis & FAQ', icon: Star },
                            { key: 'form', label: '7. Formulaire, Textes & Reçu', icon: CheckSquare },
                            { key: 'design_contact', label: '8. Couleurs, Contact & Tracking', icon: Palette },
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
                            
                            {/* TAB 1: VISIBILITÉ DE TOUTES LES SECTIONS */}
                            {activeTab === 'sections' && (
                                <div className="space-y-4">
                                    <div className="bg-[#FAF5EF] p-4 rounded-xl border border-[#EFE4D8]">
                                        <h3 className="text-xs font-bold text-[#390102] mb-1">
                                            Interrupteurs d'activation de chaque section :
                                        </h3>
                                        <p className="text-[11px] text-[#7A5459]">
                                            Vous pouvez afficher ou masquer n'importe quelle section de la page en un seul clic selon vos objectifs.
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        {[
                                            { key: 'showBrandHeader', label: 'En-tête de Marque & Logo', desc: 'Affiche le logo centré et le nom de la boutique tout en haut' },
                                            { key: 'showGallery', label: 'Galerie Photos Pleine Largeur', desc: 'Photo principale bord à bord + miniatures' },
                                            { key: 'showPricing', label: 'Bloc Prix & Badges de livraison', desc: 'Prix, ancien prix barré et badges promo' },
                                            { key: 'showVariants', label: 'Sélecteur de Formules / Variantes', desc: 'Permet à la cliente de choisir entre plusieurs formules' },
                                            { key: 'showItems', label: 'Composants du Pack (Accordéon)', desc: 'Liste dépliable des 17+ articles avec explications Darija' },
                                            { key: 'showBenefits', label: 'Points Forts & Avantages', desc: 'Section 3 cartes : pourquoi choisir ce pack' },
                                            { key: 'showVideo', label: 'Vidéo Démonstration / Tuto', desc: 'Vidéo explicative intégrée (YouTube ou MP4)' },
                                            { key: 'showReviews', label: 'Avis & Témoignages Clientes', desc: 'Notes 5 étoiles et commentaires vérifiés' },
                                            { key: 'showFaq', label: 'Foire Aux Questions (FAQ)', desc: 'Questions fréquentes dépliables' },
                                            { key: 'showOrderForm', label: 'Formulaire de Commande Direct', desc: 'Saisie Nom, Téléphone, Wilaya, Commune, Paiement cash' },
                                            { key: 'showReassurance', label: 'Texte de Garantie & Réassurance', desc: 'Vérification du colis avant paiement' },
                                            { key: 'showInstagram', label: 'Bouton Chat Privé Instagram', desc: 'Redirige vers votre messagerie Instagram ou WhatsApp' },
                                            { key: 'showStickyCta', label: 'Barre de commande flottante (Mobile)', desc: 'Bouton toujours visible au bas de l\'écran sur téléphone' },
                                        ].map((sec) => {
                                            const isEnabled = (currentLP as any)[sec.key] !== false;
                                            return (
                                                <div 
                                                    key={sec.key} 
                                                    className="p-3 bg-white border border-[#EFE4D8] rounded-xl flex items-center justify-between gap-3 hover:border-[#BFA893] transition-all"
                                                >
                                                    <div>
                                                        <h4 className="text-xs font-bold text-[#18080A]">{sec.label}</h4>
                                                        <p className="text-[10px] text-[#7A5459] mt-0.5">{sec.desc}</p>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={() => setCurrentLP({ ...currentLP, [sec.key]: !isEnabled })}
                                                        className={cn(
                                                            "px-3 py-1 text-[11px] font-bold rounded-full transition-colors shrink-0",
                                                            isEnabled ? "bg-emerald-100 text-emerald-800" : "bg-gray-200 text-gray-600"
                                                        )}
                                                    >
                                                        {isEnabled ? 'Affichée' : 'Masquée'}
                                                    </button>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            {/* TAB 2: INFORMATIONS GÉNÉRALES, MARQUE & URL */}
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

                                    {/* Logo personnalisé */}
                                    <div className="p-3.5 bg-[#FAF5EF] border border-[#EFE4D8] rounded-xl space-y-2">
                                        <label className="block text-xs font-bold text-[#390102]">
                                            Logo / Icône personnalisée de l'en-tête (Optionnel) :
                                        </label>
                                        <p className="text-[11px] text-[#7A5459]">
                                            Si vide, l'emblème doré officiel MEEY Nail Shop sera utilisé par défaut.
                                        </p>
                                        <div className="flex items-center gap-3">
                                            <input
                                                type="text"
                                                value={currentLP.logoUrl || ''}
                                                onChange={(e) => setCurrentLP({ ...currentLP, logoUrl: e.target.value })}
                                                placeholder="https://... ou téléchargez une image"
                                                className="flex-1 px-3 py-2 border border-[#EFE4D8] text-xs rounded-lg font-mono"
                                            />
                                            <label className="px-3 py-2 bg-white border border-[#BFA893] text-[#390102] hover:bg-[#FAF5EF] text-xs font-bold rounded-lg cursor-pointer">
                                                <span>{uploadingLogo ? 'Upload...' : 'Uploader Logo'}</span>
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={handleUploadLogo}
                                                    disabled={uploadingLogo}
                                                    className="hidden"
                                                />
                                            </label>
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

                            {/* TAB 3: PRIX, OFFRE & VARIANTES */}
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
                                                value={currentLP.currency || 'DA'}
                                                onChange={(e) => setCurrentLP({ ...currentLP, currency: e.target.value })}
                                                className="w-full px-3.5 py-2.5 border border-[#EFE4D8] text-xs font-bold rounded-lg"
                                            />
                                        </div>
                                    </div>

                                    {/* Textes des badges de prix et de livraison */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-[#EFE4D8] pt-4">
                                        <div>
                                            <label className="block text-xs font-bold text-[#18080A] mb-1">
                                                Texte au-dessus du prix (Badge prix) :
                                            </label>
                                            <input
                                                type="text"
                                                value={currentLP.priceBadgeText || ''}
                                                onChange={(e) => setCurrentLP({ ...currentLP, priceBadgeText: e.target.value })}
                                                className="w-full px-3 py-2 border border-[#EFE4D8] text-xs rounded-lg text-right"
                                                dir="rtl"
                                                placeholder="سعر الباك الكامل (17 عنصر متكامل)"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-xs font-bold text-[#18080A] mb-1">
                                                Badge livraison (À côté du prix) :
                                            </label>
                                            <input
                                                type="text"
                                                value={currentLP.deliveryBadgeText || ''}
                                                onChange={(e) => setCurrentLP({ ...currentLP, deliveryBadgeText: e.target.value })}
                                                className="w-full px-3 py-2 border border-[#EFE4D8] text-xs rounded-lg text-right"
                                                dir="rtl"
                                                placeholder="توصيل متوفر لـ 58 ولاية"
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
                                                <div>
                                                    <label className="block text-[11px] font-bold text-[#7A5459] mb-1">
                                                        Titre de la sélection de variantes :
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={currentLP.variantsTitle || ''}
                                                        onChange={(e) => setCurrentLP({ ...currentLP, variantsTitle: e.target.value })}
                                                        className="w-full px-3 py-1.5 bg-white border border-[#EFE4D8] text-xs rounded text-right"
                                                        dir="rtl"
                                                        placeholder="اختاري الصيغة أو الباك المناسب لكِ :"
                                                    />
                                                </div>

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

                            {/* TAB 4: PHOTOS & MÉDIAS FULL-WIDTH */}
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

                            {/* TAB 5: COMPOSANTS DU PACK (17+ PIÈCES) */}
                            {activeTab === 'items' && (
                                <div className="space-y-4">
                                    <div className="bg-[#FAF5EF] p-4 rounded-xl border border-[#EFE4D8] space-y-3">
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

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                                            <div>
                                                <label className="block text-[11px] font-bold text-[#7A5459] mb-1">Badge à côté du titre :</label>
                                                <input
                                                    type="text"
                                                    value={currentLP.accordionBadgeText || ''}
                                                    onChange={(e) => setCurrentLP({ ...currentLP, accordionBadgeText: e.target.value })}
                                                    className="w-full px-3 py-1.5 bg-white border border-[#EFE4D8] text-xs rounded"
                                                    placeholder="17 pièces"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Liste ordonnée des composants */}
                                    <div className="space-y-2.5">
                                        {currentLP.items.map((item, idx) => (
                                            <div key={item.id || idx} className="p-3 bg-white border border-[#EFE4D8] rounded-xl flex items-start gap-2.5">
                                                <span className="w-6 h-6 rounded-full bg-[#FAF5EF] border border-[#B8935A]/40 text-[#B8935A] text-xs font-bold flex items-center justify-center shrink-0 num mt-1">
                                                    {String(idx + 1).padStart(2, '0')}
                                                </span>

                                                <div className="flex-1 grid grid-cols-1 sm:grid-cols-12 gap-2">
                                                    <div className="sm:col-span-5">
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

                                                    <div className="sm:col-span-6">
                                                        <label className="block text-[10px] uppercase font-bold text-[#7A5459] mb-0.5 text-right">
                                                            الوصف بالدارجة الجزائرية (Darija DZ)
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

                                                    <div className="sm:col-span-1">
                                                        <label className="block text-[10px] uppercase font-bold text-[#7A5459] mb-0.5 text-center">
                                                            Qté
                                                        </label>
                                                        <input
                                                            type="number"
                                                            min={1}
                                                            value={item.quantity || 1}
                                                            onChange={(e) => handleUpdateItem(idx, 'quantity', Number(e.target.value))}
                                                            className="w-full px-1 py-1.5 border border-[#EFE4D8] text-xs text-center font-mono rounded"
                                                        />
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-1 shrink-0 mt-3">
                                                    <button
                                                        type="button"
                                                        title="Monter"
                                                        disabled={idx === 0}
                                                        onClick={() => handleMoveItem(idx, 'up')}
                                                        className="p-1 text-gray-400 hover:text-black disabled:opacity-30"
                                                    >
                                                        <ArrowUp size={14} />
                                                    </button>
                                                    <button
                                                        type="button"
                                                        title="Descendre"
                                                        disabled={idx === currentLP.items.length - 1}
                                                        onClick={() => handleMoveItem(idx, 'down')}
                                                        className="p-1 text-gray-400 hover:text-black disabled:opacity-30"
                                                    >
                                                        <ArrowDown size={14} />
                                                    </button>
                                                    <button
                                                        type="button"
                                                        title="Dupliquer"
                                                        onClick={() => handleDuplicateItem(idx)}
                                                        className="p-1 text-[#B8935A] hover:text-[#390102]"
                                                    >
                                                        <Copy size={14} />
                                                    </button>
                                                    <button
                                                        type="button"
                                                        title="Supprimer"
                                                        onClick={() => handleDeleteItem(idx)}
                                                        className="p-1 text-red-500 hover:text-red-700"
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                </div>
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

                            {/* TAB 6: AVANTAGES, AVIS & FAQ */}
                            {activeTab === 'marketing' && (
                                <div className="space-y-6">
                                    
                                    {/* SECTION POINTS FORTS / AVANTAGES */}
                                    <div className="bg-[#FAF5EF] p-4 rounded-xl border border-[#EFE4D8] space-y-3">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h3 className="text-xs font-bold text-[#390102]">Section Avantages & Points Forts :</h3>
                                                <p className="text-[11px] text-[#7A5459]">Pourquoi choisir ce pack plutôt que d'acheter pièce par pièce.</p>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={handleAddBenefit}
                                                className="px-3 py-1.5 bg-[#390102] text-white text-xs font-bold rounded-lg hover:bg-black"
                                            >
                                                + Ajouter un avantage
                                            </button>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            <div>
                                                <label className="block text-[11px] font-bold text-[#7A5459] mb-1">Titre de la section :</label>
                                                <input
                                                    type="text"
                                                    value={currentLP.benefitsTitle || ''}
                                                    onChange={(e) => setCurrentLP({ ...currentLP, benefitsTitle: e.target.value })}
                                                    className="w-full px-3 py-1.5 bg-white border border-[#EFE4D8] text-xs rounded text-right"
                                                    dir="rtl"
                                                    placeholder="علاش تختاري هذا الباك المتكامل ؟"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-[11px] font-bold text-[#7A5459] mb-1">Sous-titre :</label>
                                                <input
                                                    type="text"
                                                    value={currentLP.benefitsSubtitle || ''}
                                                    onChange={(e) => setCurrentLP({ ...currentLP, benefitsSubtitle: e.target.value })}
                                                    className="w-full px-3 py-1.5 bg-white border border-[#EFE4D8] text-xs rounded text-right"
                                                    dir="rtl"
                                                    placeholder="كل ما تحتاجينه لبداية احترافية..."
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2 pt-2">
                                            {(currentLP.benefits || []).map((b, idx) => (
                                                <div key={b.id || idx} className="p-3 bg-white border border-[#EFE4D8] rounded-xl flex items-start justify-between gap-3">
                                                    <div className="flex-1 space-y-1.5">
                                                        <input
                                                            type="text"
                                                            value={b.title}
                                                            onChange={(e) => handleUpdateBenefit(idx, 'title', e.target.value)}
                                                            className="w-full px-2.5 py-1 font-bold text-xs border border-[#EFE4D8] rounded text-right"
                                                            dir="rtl"
                                                            placeholder="عنوان الميزة"
                                                        />
                                                        <textarea
                                                            rows={2}
                                                            value={b.description}
                                                            onChange={(e) => handleUpdateBenefit(idx, 'description', e.target.value)}
                                                            className="w-full px-2.5 py-1 text-xs border border-[#EFE4D8] rounded text-right"
                                                            dir="rtl"
                                                            placeholder="شرح الميزة بالتفصيل..."
                                                        />
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleDeleteBenefit(idx)}
                                                        className="p-1.5 text-red-500 hover:text-red-700"
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* SECTION AVIS CLIENTES */}
                                    <div className="bg-[#FAF5EF] p-4 rounded-xl border border-[#EFE4D8] space-y-3">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h3 className="text-xs font-bold text-[#390102]">Section Avis Clientes :</h3>
                                                <p className="text-[11px] text-[#7A5459]">Rassurez vos visiteuses avec des retours d'expérience authentiques.</p>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={handleAddReview}
                                                className="px-3 py-1.5 bg-[#390102] text-white text-xs font-bold rounded-lg hover:bg-black"
                                            >
                                                + Ajouter un avis
                                            </button>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            <div>
                                                <label className="block text-[11px] font-bold text-[#7A5459] mb-1">Titre de la section avis :</label>
                                                <input
                                                    type="text"
                                                    value={currentLP.reviewsTitle || ''}
                                                    onChange={(e) => setCurrentLP({ ...currentLP, reviewsTitle: e.target.value })}
                                                    className="w-full px-3 py-1.5 bg-white border border-[#EFE4D8] text-xs rounded text-right"
                                                    dir="rtl"
                                                    placeholder="آراء زبوناتنا الوفيات"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-[11px] font-bold text-[#7A5459] mb-1">Sous-titre :</label>
                                                <input
                                                    type="text"
                                                    value={currentLP.reviewsSubtitle || ''}
                                                    onChange={(e) => setCurrentLP({ ...currentLP, reviewsSubtitle: e.target.value })}
                                                    className="w-full px-3 py-1.5 bg-white border border-[#EFE4D8] text-xs rounded text-right"
                                                    dir="rtl"
                                                    placeholder="تجارب حقيقية من زبونات بدأن مشروعهن..."
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2.5 pt-2">
                                            {(currentLP.reviews || []).map((r, idx) => (
                                                <div key={r.id || idx} className="p-3 bg-white border border-[#EFE4D8] rounded-xl flex items-start justify-between gap-3">
                                                    <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-2">
                                                        <div>
                                                            <label className="block text-[10px] text-gray-500 mb-0.5">Nom de la cliente :</label>
                                                            <input
                                                                type="text"
                                                                value={r.authorName}
                                                                onChange={(e) => handleUpdateReview(idx, 'authorName', e.target.value)}
                                                                className="w-full px-2 py-1 text-xs font-bold border border-[#EFE4D8] rounded text-right"
                                                                dir="rtl"
                                                                placeholder="مثال: أمينة ب."
                                                            />
                                                        </div>
                                                        <div>
                                                            <label className="block text-[10px] text-gray-500 mb-0.5">Wilaya :</label>
                                                            <input
                                                                type="text"
                                                                value={r.wilaya || ''}
                                                                onChange={(e) => handleUpdateReview(idx, 'wilaya', e.target.value)}
                                                                className="w-full px-2 py-1 text-xs border border-[#EFE4D8] rounded text-right"
                                                                dir="rtl"
                                                                placeholder="الجزائر العاصمة"
                                                            />
                                                        </div>
                                                        <div>
                                                            <label className="block text-[10px] text-gray-500 mb-0.5">Note (sur 5 étoiles) :</label>
                                                            <select
                                                                value={r.rating}
                                                                onChange={(e) => handleUpdateReview(idx, 'rating', Number(e.target.value))}
                                                                className="w-full px-2 py-1 text-xs border border-[#EFE4D8] rounded"
                                                            >
                                                                <option value={5}>★★★★★ (5 étoiles)</option>
                                                                <option value={4}>★★★★☆ (4 étoiles)</option>
                                                            </select>
                                                        </div>
                                                        <div className="sm:col-span-3">
                                                            <label className="block text-[10px] text-gray-500 mb-0.5">Commentaire / Témoignage :</label>
                                                            <textarea
                                                                rows={2}
                                                                value={r.comment}
                                                                onChange={(e) => handleUpdateReview(idx, 'comment', e.target.value)}
                                                                className="w-full px-2 py-1 text-xs border border-[#EFE4D8] rounded text-right"
                                                                dir="rtl"
                                                                placeholder="الباك جاني كيما في التصويرة تماماً وفيه كلش..."
                                                            />
                                                        </div>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleDeleteReview(idx)}
                                                        className="p-1.5 text-red-500 hover:text-red-700 mt-2"
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* SECTION FAQ (FOIRE AUX QUESTIONS) */}
                                    <div className="bg-[#FAF5EF] p-4 rounded-xl border border-[#EFE4D8] space-y-3">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h3 className="text-xs font-bold text-[#390102]">Foire Aux Questions (FAQ) :</h3>
                                                <p className="text-[11px] text-[#7A5459]">Répondez aux questions sur la livraison, la garantie et le paiement.</p>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={handleAddFaq}
                                                className="px-3 py-1.5 bg-[#390102] text-white text-xs font-bold rounded-lg hover:bg-black"
                                            >
                                                + Ajouter une question
                                            </button>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            <div>
                                                <label className="block text-[11px] font-bold text-[#7A5459] mb-1">Titre de la section FAQ :</label>
                                                <input
                                                    type="text"
                                                    value={currentLP.faqTitle || ''}
                                                    onChange={(e) => setCurrentLP({ ...currentLP, faqTitle: e.target.value })}
                                                    className="w-full px-3 py-1.5 bg-white border border-[#EFE4D8] text-xs rounded text-right"
                                                    dir="rtl"
                                                    placeholder="الأسئلة الأكثر تكراراً (FAQ)"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-[11px] font-bold text-[#7A5459] mb-1">Sous-titre :</label>
                                                <input
                                                    type="text"
                                                    value={currentLP.faqSubtitle || ''}
                                                    onChange={(e) => setCurrentLP({ ...currentLP, faqSubtitle: e.target.value })}
                                                    className="w-full px-3 py-1.5 bg-white border border-[#EFE4D8] text-xs rounded text-right"
                                                    dir="rtl"
                                                    placeholder="كل الإجابات عن التوصيل، الدفع..."
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2.5 pt-2">
                                            {(currentLP.faqs || []).map((f, idx) => (
                                                <div key={f.id || idx} className="p-3 bg-white border border-[#EFE4D8] rounded-xl flex items-start justify-between gap-3">
                                                    <div className="flex-1 space-y-1.5">
                                                        <input
                                                            type="text"
                                                            value={f.question}
                                                            onChange={(e) => handleUpdateFaq(idx, 'question', e.target.value)}
                                                            className="w-full px-2.5 py-1 font-bold text-xs border border-[#EFE4D8] rounded text-right"
                                                            dir="rtl"
                                                            placeholder="السؤال..."
                                                        />
                                                        <textarea
                                                            rows={2}
                                                            value={f.answer}
                                                            onChange={(e) => handleUpdateFaq(idx, 'answer', e.target.value)}
                                                            className="w-full px-2.5 py-1 text-xs border border-[#EFE4D8] rounded text-right"
                                                            dir="rtl"
                                                            placeholder="الجواب الواضح والشامل..."
                                                        />
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleDeleteFaq(idx)}
                                                        className="p-1.5 text-red-500 hover:text-red-700"
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* SECTION VIDÉO */}
                                    <div className="p-4 bg-white border border-[#EFE4D8] rounded-xl space-y-3">
                                        <h3 className="text-xs font-bold text-[#390102]">Vidéo de Démonstration / Tutoriel :</h3>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            <div>
                                                <label className="block text-[11px] font-bold text-[#7A5459] mb-1">Titre de la vidéo :</label>
                                                <input
                                                    type="text"
                                                    value={currentLP.videoTitle || ''}
                                                    onChange={(e) => setCurrentLP({ ...currentLP, videoTitle: e.target.value })}
                                                    className="w-full px-3 py-1.5 border border-[#EFE4D8] text-xs rounded text-right"
                                                    dir="rtl"
                                                    placeholder="فيديو توضيحي لطريقة الاستعمال..."
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-[11px] font-bold text-[#7A5459] mb-1">Lien de la vidéo (YouTube ou lien direct MP4) :</label>
                                                <input
                                                    type="url"
                                                    value={currentLP.videoUrl || ''}
                                                    onChange={(e) => setCurrentLP({ ...currentLP, videoUrl: e.target.value })}
                                                    className="w-full px-3 py-1.5 border border-[#EFE4D8] text-xs font-mono rounded"
                                                    placeholder="https://www.youtube.com/watch?v=..."
                                                />
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            )}

                            {/* TAB 7: FORMULAIRE, TEXTES, BOUTONS & REÇU DE COMMANDE */}
                            {activeTab === 'form' && (
                                <div className="space-y-5">
                                    
                                    {/* Titre & Sous-titre du formulaire */}
                                    <div className="bg-[#FAF5EF] p-4 rounded-xl border border-[#EFE4D8] space-y-3">
                                        <h3 className="text-xs font-bold text-[#390102]">Textes d'accroche du Formulaire :</h3>
                                        <div>
                                            <label className="block text-[11px] font-bold text-[#7A5459] mb-1">Titre du formulaire :</label>
                                            <input
                                                type="text"
                                                value={currentLP.formTitle || ''}
                                                onChange={(e) => setCurrentLP({ ...currentLP, formTitle: e.target.value })}
                                                className="w-full px-3 py-2 bg-white border border-[#EFE4D8] text-xs rounded text-right"
                                                dir="rtl"
                                                placeholder="اطلبي الباك تاعك درك"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[11px] font-bold text-[#7A5459] mb-1">Sous-titre explicatif :</label>
                                            <textarea
                                                rows={2}
                                                value={currentLP.formSubtitle || ''}
                                                onChange={(e) => setCurrentLP({ ...currentLP, formSubtitle: e.target.value })}
                                                className="w-full px-3 py-2 bg-white border border-[#EFE4D8] text-xs rounded text-right"
                                                dir="rtl"
                                                placeholder="عمري معلوماتك لتحت، التوصيل يوصلك حتى لباب دارك والدفع كاش عند الاستلام..."
                                            />
                                        </div>
                                    </div>

                                    {/* Labels des champs de saisie */}
                                    <div className="p-4 bg-white border border-[#EFE4D8] rounded-xl space-y-3">
                                        <h3 className="text-xs font-bold text-[#390102]">Labels & Placeholders des champs :</h3>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            <div>
                                                <label className="block text-[11px] font-bold text-[#7A5459] mb-1">Label Nom complet :</label>
                                                <input
                                                    type="text"
                                                    value={currentLP.nameLabel || ''}
                                                    onChange={(e) => setCurrentLP({ ...currentLP, nameLabel: e.target.value })}
                                                    className="w-full px-3 py-1.5 border border-[#EFE4D8] text-xs rounded text-right"
                                                    dir="rtl"
                                                    placeholder="الاسم واللقب الكامل"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-[11px] font-bold text-[#7A5459] mb-1">Exemple Nom (Placeholder) :</label>
                                                <input
                                                    type="text"
                                                    value={currentLP.namePlaceholder || ''}
                                                    onChange={(e) => setCurrentLP({ ...currentLP, namePlaceholder: e.target.value })}
                                                    className="w-full px-3 py-1.5 border border-[#EFE4D8] text-xs rounded text-right"
                                                    dir="rtl"
                                                    placeholder="مثال: أمينة بوزيد"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-[11px] font-bold text-[#7A5459] mb-1">Label Téléphone :</label>
                                                <input
                                                    type="text"
                                                    value={currentLP.phoneLabel || ''}
                                                    onChange={(e) => setCurrentLP({ ...currentLP, phoneLabel: e.target.value })}
                                                    className="w-full px-3 py-1.5 border border-[#EFE4D8] text-xs rounded text-right"
                                                    dir="rtl"
                                                    placeholder="رقم الهاتف (للاتصال وتأكيد الطلب)"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-[11px] font-bold text-[#7A5459] mb-1">Format Téléphone (Placeholder) :</label>
                                                <input
                                                    type="text"
                                                    value={currentLP.phonePlaceholder || ''}
                                                    onChange={(e) => setCurrentLP({ ...currentLP, phonePlaceholder: e.target.value })}
                                                    className="w-full px-3 py-1.5 border border-[#EFE4D8] text-xs rounded"
                                                    placeholder="05 / 06 / 07 XX XX XX"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-[11px] font-bold text-[#7A5459] mb-1">Label Wilaya :</label>
                                                <input
                                                    type="text"
                                                    value={currentLP.wilayaLabel || ''}
                                                    onChange={(e) => setCurrentLP({ ...currentLP, wilayaLabel: e.target.value })}
                                                    className="w-full px-3 py-1.5 border border-[#EFE4D8] text-xs rounded text-right"
                                                    dir="rtl"
                                                    placeholder="الولاية"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-[11px] font-bold text-[#7A5459] mb-1">Label Commune :</label>
                                                <input
                                                    type="text"
                                                    value={currentLP.communeLabel || ''}
                                                    onChange={(e) => setCurrentLP({ ...currentLP, communeLabel: e.target.value })}
                                                    className="w-full px-3 py-1.5 border border-[#EFE4D8] text-xs rounded text-right"
                                                    dir="rtl"
                                                    placeholder="البلدية"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Modes de livraison & Récapitulatif */}
                                    <div className="p-4 bg-white border border-[#EFE4D8] rounded-xl space-y-3">
                                        <h3 className="text-xs font-bold text-[#390102]">Options de livraison & Récapitulatif :</h3>
                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                            <div>
                                                <label className="block text-[11px] font-bold text-[#7A5459] mb-1">Titre choix livraison :</label>
                                                <input
                                                    type="text"
                                                    value={currentLP.deliveryTypeLabel || ''}
                                                    onChange={(e) => setCurrentLP({ ...currentLP, deliveryTypeLabel: e.target.value })}
                                                    className="w-full px-3 py-1.5 border border-[#EFE4D8] text-xs rounded text-right"
                                                    dir="rtl"
                                                    placeholder="طريقة التوصيل المفضلة"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-[11px] font-bold text-[#7A5459] mb-1">Option Domicile :</label>
                                                <input
                                                    type="text"
                                                    value={currentLP.homeDeliveryLabel || ''}
                                                    onChange={(e) => setCurrentLP({ ...currentLP, homeDeliveryLabel: e.target.value })}
                                                    className="w-full px-3 py-1.5 border border-[#EFE4D8] text-xs rounded text-right"
                                                    dir="rtl"
                                                    placeholder="توصيل للدار (Domicile)"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-[11px] font-bold text-[#7A5459] mb-1">Option Bureau :</label>
                                                <input
                                                    type="text"
                                                    value={currentLP.deskDeliveryLabel || ''}
                                                    onChange={(e) => setCurrentLP({ ...currentLP, deskDeliveryLabel: e.target.value })}
                                                    className="w-full px-3 py-1.5 border border-[#EFE4D8] text-xs rounded text-right"
                                                    dir="rtl"
                                                    placeholder="استلام من المكتب (Bureau)"
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-[#EFE4D8]">
                                            <div>
                                                <label className="block text-[11px] font-bold text-[#7A5459] mb-1">Ligne Prix produit :</label>
                                                <input
                                                    type="text"
                                                    value={currentLP.summaryProductLabel || ''}
                                                    onChange={(e) => setCurrentLP({ ...currentLP, summaryProductLabel: e.target.value })}
                                                    className="w-full px-3 py-1.5 border border-[#EFE4D8] text-xs rounded text-right"
                                                    dir="rtl"
                                                    placeholder="سعر الباك :"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-[11px] font-bold text-[#7A5459] mb-1">Ligne Frais livraison :</label>
                                                <input
                                                    type="text"
                                                    value={currentLP.summaryShippingLabel || ''}
                                                    onChange={(e) => setCurrentLP({ ...currentLP, summaryShippingLabel: e.target.value })}
                                                    className="w-full px-3 py-1.5 border border-[#EFE4D8] text-xs rounded text-right"
                                                    dir="rtl"
                                                    placeholder="سعر التوصيل لولايتك :"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-[11px] font-bold text-[#7A5459] mb-1">Ligne Total à payer :</label>
                                                <input
                                                    type="text"
                                                    value={currentLP.summaryTotalLabel || ''}
                                                    onChange={(e) => setCurrentLP({ ...currentLP, summaryTotalLabel: e.target.value })}
                                                    className="w-full px-3 py-1.5 border border-[#EFE4D8] text-xs rounded text-right"
                                                    dir="rtl"
                                                    placeholder="المجموع الكلي عند الاستلام :"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Bouton CTA, Barre flottante mobile & Réassurance */}
                                    <div className="p-4 bg-white border border-[#EFE4D8] rounded-xl space-y-3">
                                        <h3 className="text-xs font-bold text-[#390102]">Boutons de commande & Réassurance :</h3>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            <div>
                                                <label className="block text-[11px] font-bold text-[#7A5459] mb-1">
                                                    Texte du bouton CTA (balise {'{total}'} supportée) :
                                                </label>
                                                <input
                                                    type="text"
                                                    value={currentLP.ctaButtonText || ''}
                                                    onChange={(e) => setCurrentLP({ ...currentLP, ctaButtonText: e.target.value })}
                                                    className="w-full px-3 py-2 border border-[#EFE4D8] text-xs rounded text-right font-bold"
                                                    dir="rtl"
                                                    placeholder="تأكيد الطلب — {total}"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-[11px] font-bold text-[#7A5459] mb-1">Texte bouton flottant (Mobile) :</label>
                                                <input
                                                    type="text"
                                                    value={currentLP.stickyCtaText || ''}
                                                    onChange={(e) => setCurrentLP({ ...currentLP, stickyCtaText: e.target.value })}
                                                    className="w-full px-3 py-2 border border-[#EFE4D8] text-xs rounded text-right"
                                                    dir="rtl"
                                                    placeholder="اطلبي الآن — الدفع عند الاستلام"
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            <div>
                                                <label className="block text-[11px] font-bold text-[#7A5459] mb-1">Texte pendant l'envoi :</label>
                                                <input
                                                    type="text"
                                                    value={currentLP.submittingText || ''}
                                                    onChange={(e) => setCurrentLP({ ...currentLP, submittingText: e.target.value })}
                                                    className="w-full px-3 py-2 border border-[#EFE4D8] text-xs rounded text-right"
                                                    dir="rtl"
                                                    placeholder="جاري تسجيل طلبكِ..."
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-[11px] font-bold text-[#7A5459] mb-1">
                                                    Texte de garantie (Sous le bouton) :
                                                </label>
                                                <input
                                                    type="text"
                                                    value={currentLP.guaranteeText || ''}
                                                    onChange={(e) => setCurrentLP({ ...currentLP, guaranteeText: e.target.value })}
                                                    className="w-full px-3 py-2 border border-[#EFE4D8] text-xs rounded text-right"
                                                    dir="rtl"
                                                    placeholder="الدفع يداً بيد عند الاستلام. تقدري تفتحي الطرد وتعايني سلعتك قبل ما تخلصي."
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Modal reçu de confirmation */}
                                    <div className="p-4 bg-[#FAF5EF] border border-[#EFE4D8] rounded-xl space-y-3">
                                        <h3 className="text-xs font-bold text-[#390102]">Reçu & Modal de Confirmation de commande :</h3>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            <div>
                                                <label className="block text-[11px] font-bold text-[#7A5459] mb-1">Titre du modal :</label>
                                                <input
                                                    type="text"
                                                    value={currentLP.successModalTitle || ''}
                                                    onChange={(e) => setCurrentLP({ ...currentLP, successModalTitle: e.target.value })}
                                                    className="w-full px-3 py-1.5 bg-white border border-[#EFE4D8] text-xs rounded text-right"
                                                    dir="rtl"
                                                    placeholder="تم تسجيل طلبكِ بنجاح"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-[11px] font-bold text-[#7A5459] mb-1">Bouton retour :</label>
                                                <input
                                                    type="text"
                                                    value={currentLP.successModalButtonText || ''}
                                                    onChange={(e) => setCurrentLP({ ...currentLP, successModalButtonText: e.target.value })}
                                                    className="w-full px-3 py-1.5 bg-white border border-[#EFE4D8] text-xs rounded text-right"
                                                    dir="rtl"
                                                    placeholder="الرجوع إلى المتجر"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-[11px] font-bold text-[#7A5459] mb-1">Message d'explication de confirmation :</label>
                                            <textarea
                                                rows={2}
                                                value={currentLP.successModalMessage || ''}
                                                onChange={(e) => setCurrentLP({ ...currentLP, successModalMessage: e.target.value })}
                                                className="w-full px-3 py-1.5 bg-white border border-[#EFE4D8] text-xs rounded text-right"
                                                dir="rtl"
                                                placeholder="تم استلام طلبكِ في نظام المتجر. سيتصل بكِ فريق العمل عبر الهاتف لتأكيد موعد إرسال الطرد إلى عنوانكِ."
                                            />
                                        </div>
                                    </div>

                                </div>
                            )}

                            {/* TAB 8: COULEURS, CONTACT INSTAGRAM & PIXELS */}
                            {activeTab === 'design_contact' && (
                                <div className="space-y-6">
                                    
                                    {/* Palette & Couleurs */}
                                    <div className="p-4 bg-[#FAF5EF] border border-[#EFE4D8] rounded-xl space-y-3">
                                        <h3 className="text-xs font-bold text-[#390102]">Palettes de marque pré-configurées :</h3>
                                        <div className="flex flex-wrap gap-2">
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

                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                                            <div>
                                                <label className="block text-[11px] font-bold text-[#18080A] mb-1">Couleur Principale</label>
                                                <div className="flex items-center gap-2">
                                                    <input
                                                        type="color"
                                                        value={currentLP.primaryColor}
                                                        onChange={(e) => setCurrentLP({ ...currentLP, primaryColor: e.target.value })}
                                                        className="w-8 h-8 p-0.5 border border-[#EFE4D8] rounded cursor-pointer"
                                                    />
                                                    <input
                                                        type="text"
                                                        value={currentLP.primaryColor}
                                                        onChange={(e) => setCurrentLP({ ...currentLP, primaryColor: e.target.value })}
                                                        className="w-full px-2 py-1.5 border border-[#EFE4D8] text-xs font-mono rounded"
                                                    />
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-[11px] font-bold text-[#18080A] mb-1">Couleur Accent / Or</label>
                                                <div className="flex items-center gap-2">
                                                    <input
                                                        type="color"
                                                        value={currentLP.accentColor}
                                                        onChange={(e) => setCurrentLP({ ...currentLP, accentColor: e.target.value })}
                                                        className="w-8 h-8 p-0.5 border border-[#EFE4D8] rounded cursor-pointer"
                                                    />
                                                    <input
                                                        type="text"
                                                        value={currentLP.accentColor}
                                                        onChange={(e) => setCurrentLP({ ...currentLP, accentColor: e.target.value })}
                                                        className="w-full px-2 py-1.5 border border-[#EFE4D8] text-xs font-mono rounded"
                                                    />
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-[11px] font-bold text-[#18080A] mb-1">Fond de la page</label>
                                                <div className="flex items-center gap-2">
                                                    <input
                                                        type="color"
                                                        value={currentLP.backgroundColor}
                                                        onChange={(e) => setCurrentLP({ ...currentLP, backgroundColor: e.target.value })}
                                                        className="w-8 h-8 p-0.5 border border-[#EFE4D8] rounded cursor-pointer"
                                                    />
                                                    <input
                                                        type="text"
                                                        value={currentLP.backgroundColor}
                                                        onChange={(e) => setCurrentLP({ ...currentLP, backgroundColor: e.target.value })}
                                                        className="w-full px-2 py-1.5 border border-[#EFE4D8] text-xs font-mono rounded"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Section Contact Direct Instagram */}
                                    <div className="p-4 bg-white border border-[#EFE4D8] rounded-xl space-y-3">
                                        <h3 className="text-xs font-bold text-[#390102]">Section Contact Direct Instagram :</h3>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            <div>
                                                <label className="block text-[11px] font-bold text-[#7A5459] mb-1">Titre de la section Instagram :</label>
                                                <input
                                                    type="text"
                                                    value={currentLP.instagramTitle || ''}
                                                    onChange={(e) => setCurrentLP({ ...currentLP, instagramTitle: e.target.value })}
                                                    className="w-full px-3 py-1.5 border border-[#EFE4D8] text-xs rounded text-right"
                                                    dir="rtl"
                                                    placeholder="عندك أي سؤال أو استفسار على هذا الباك؟"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-[11px] font-bold text-[#7A5459] mb-1">Sous-titre :</label>
                                                <input
                                                    type="text"
                                                    value={currentLP.instagramSubtitle || ''}
                                                    onChange={(e) => setCurrentLP({ ...currentLP, instagramSubtitle: e.target.value })}
                                                    className="w-full px-3 py-1.5 border border-[#EFE4D8] text-xs rounded text-right"
                                                    dir="rtl"
                                                    placeholder="تواصلي معنا مباشرة في الشات الخاص..."
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            <div>
                                                <label className="block text-[11px] font-bold text-[#7A5459] mb-1">Lien direct Instagram / WhatsApp :</label>
                                                <input
                                                    type="url"
                                                    value={currentLP.instagramUrl || ''}
                                                    onChange={(e) => setCurrentLP({ ...currentLP, instagramUrl: e.target.value })}
                                                    className="w-full px-3 py-1.5 border border-[#EFE4D8] text-xs rounded font-mono text-left"
                                                    placeholder="https://ig.me/m/meeynailshop"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-[11px] font-bold text-[#7A5459] mb-1">Texte du bouton :</label>
                                                <input
                                                    type="text"
                                                    value={currentLP.instagramButtonLabel || ''}
                                                    onChange={(e) => setCurrentLP({ ...currentLP, instagramButtonLabel: e.target.value })}
                                                    className="w-full px-3 py-1.5 border border-[#EFE4D8] text-xs rounded text-right"
                                                    dir="rtl"
                                                    placeholder="مراسلة في الخاص..."
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-[11px] font-bold text-[#7A5459] mb-1">Message pré-rempli pour la cliente :</label>
                                            <input
                                                type="text"
                                                value={currentLP.instagramMessage || ''}
                                                onChange={(e) => setCurrentLP({ ...currentLP, instagramMessage: e.target.value })}
                                                className="w-full px-3 py-1.5 border border-[#EFE4D8] text-xs rounded text-right"
                                                dir="rtl"
                                                placeholder="السلام عليكم، حبيت نستفسر ونعرف معلومات أكثر على هذا الباك"
                                            />
                                        </div>
                                    </div>

                                    {/* Footer & Tracking Pixels */}
                                    <div className="p-4 bg-white border border-[#EFE4D8] rounded-xl space-y-3">
                                        <div>
                                            <label className="block text-[11px] font-bold text-[#18080A] mb-1">Texte du Footer (Bas de page) :</label>
                                            <input
                                                type="text"
                                                value={currentLP.footerText || ''}
                                                onChange={(e) => setCurrentLP({ ...currentLP, footerText: e.target.value })}
                                                className="w-full px-3 py-1.5 border border-[#EFE4D8] text-xs rounded-lg text-right"
                                                dir="rtl"
                                                placeholder="© MEEY NAIL SHOP. جميع الحقوق محفوظة."
                                            />
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-[#EFE4D8]">
                                            <div>
                                                <label className="block text-[11px] font-bold text-[#7A5459] mb-1">Meta Pixel ID (Facebook Ads) :</label>
                                                <input
                                                    type="text"
                                                    value={currentLP.facebookPixelId || ''}
                                                    onChange={(e) => setCurrentLP({ ...currentLP, facebookPixelId: e.target.value })}
                                                    className="w-full px-3 py-1.5 border border-[#EFE4D8] text-xs font-mono rounded"
                                                    placeholder="Ex: 123456789012345"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-[11px] font-bold text-[#7A5459] mb-1">TikTok Pixel ID :</label>
                                                <input
                                                    type="text"
                                                    value={currentLP.tiktokPixelId || ''}
                                                    onChange={(e) => setCurrentLP({ ...currentLP, tiktokPixelId: e.target.value })}
                                                    className="w-full px-3 py-1.5 border border-[#EFE4D8] text-xs font-mono rounded"
                                                    placeholder="Ex: C1234567890ABC"
                                                />
                                            </div>
                                        </div>
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
                                    {currentLP.showBrandHeader !== false && (
                                        <div className="p-4 text-center border-b border-[#EFE4D8]">
                                            <div className="w-9 h-9 mx-auto mb-1.5 rounded-full bg-white border border-[#BFA893] flex items-center justify-center text-[#390102] font-bold text-xs overflow-hidden">
                                                {currentLP.logoUrl ? (
                                                    <img src={currentLP.logoUrl} alt="" className="w-full h-full object-cover" />
                                                ) : (
                                                    '✓'
                                                )}
                                            </div>
                                            <div className="text-[10px] uppercase font-bold text-[#B8935A] tracking-wider">
                                                {currentLP.brandName}
                                            </div>
                                            <h4 className="text-sm font-bold text-[#390102] mt-1 leading-snug">
                                                {currentLP.title}
                                            </h4>
                                            {currentLP.subtitle && (
                                                <p className="text-[10px] text-gray-600 mt-1">{currentLP.subtitle}</p>
                                            )}
                                        </div>
                                    )}

                                    {/* Image Full Width */}
                                    {currentLP.showGallery !== false && currentLP.photos && currentLP.photos.length > 0 && (
                                        <div className="w-full aspect-[4/3] bg-white overflow-hidden">
                                            <img src={currentLP.photos[0]} alt="" className="w-full h-full object-cover" />
                                        </div>
                                    )}

                                    {/* Prix & Bouton */}
                                    <div className="p-4 space-y-3">
                                        {currentLP.showPricing !== false && (
                                            <div className="flex justify-between items-baseline border-b border-[#EFE4D8] pb-2">
                                                <span className="text-[11px] text-gray-500">{currentLP.priceBadgeText || 'سعر الباك الكامل:'}</span>
                                                <span className="text-lg font-bold text-[#390102] font-mono">
                                                    {currentLP.price.toLocaleString('fr-DZ')} {currentLP.currency || 'DA'}
                                                </span>
                                            </div>
                                        )}

                                        {currentLP.showItems !== false && (
                                            <div className="p-2.5 bg-[#FAF5EF] rounded text-center text-xs text-gray-700">
                                                {currentLP.accordionTitle || `${currentLP.items.length} قطع أساسية متكاملة`}
                                            </div>
                                        )}

                                        {currentLP.showBenefits !== false && currentLP.benefits && currentLP.benefits.length > 0 && (
                                            <div className="p-2.5 bg-[#FAF5EF] border border-[#EFE4D8] rounded-lg text-right space-y-1">
                                                <span className="text-[10px] font-bold text-[#390102]">✓ {currentLP.benefits[0].title}</span>
                                                <p className="text-[9px] text-gray-600">{currentLP.benefits[0].description}</p>
                                            </div>
                                        )}

                                        <button 
                                            className="w-full py-2.5 text-white text-xs font-bold rounded-lg shadow"
                                            style={{ backgroundColor: currentLP.primaryColor }}
                                        >
                                            {currentLP.ctaButtonText || 'تأكيد الطلب الآن'}
                                        </button>

                                        {currentLP.showReassurance !== false && currentLP.guaranteeText && (
                                            <p className="text-[10px] text-gray-500 text-center">{currentLP.guaranteeText}</p>
                                        )}
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
                                            <div className="absolute bottom-3 right-3 px-3 py-1 bg-[#18080A]/85 backdrop-blur-md text-[#BFA893] rounded-lg text-xs font-bold font-mono">
                                                {lp.price.toLocaleString('fr-DZ')} {lp.currency || 'DA'}
                                            </div>
                                        </div>

                                        {/* Contenu de la carte */}
                                        <div className="p-4 space-y-2">
                                            <div className="flex items-center justify-between text-[11px] text-[#7A5459]">
                                                <span className="font-mono bg-[#FAF5EF] px-2 py-0.5 rounded border border-[#EFE4D8]">
                                                    /lp/{lp.slug}
                                                </span>
                                                <span>{lp.items?.length || 0} composants</span>
                                            </div>

                                            <h3 className="font-bold text-sm text-[#18080A] line-clamp-1 text-right" dir="rtl">
                                                {lp.title}
                                            </h3>

                                            {lp.subtitle && (
                                                <p className="text-xs text-[#7A5459] line-clamp-2 text-right leading-relaxed" dir="rtl">
                                                    {lp.subtitle}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Barre d'actions */}
                                    <div className="p-3 bg-[#FAF5EF]/60 border-t border-[#EFE4D8] flex items-center justify-between">
                                        <div className="flex items-center gap-1.5">
                                            <button
                                                onClick={() => handleEdit(lp)}
                                                className="flex items-center gap-1 px-3 py-1.5 bg-[#390102] hover:bg-[#18080A] text-white text-xs font-semibold rounded-lg shadow-sm transition-all"
                                            >
                                                <Edit3 size={13} />
                                                <span>Modifier</span>
                                            </button>

                                            <button
                                                onClick={() => handleDuplicate(lp)}
                                                title="Dupliquer cette page"
                                                className="p-1.5 text-[#7A5459] hover:text-[#390102] hover:bg-white rounded-lg border border-transparent hover:border-[#EFE4D8]"
                                            >
                                                <Copy size={14} />
                                            </button>

                                            <button
                                                onClick={() => handleDelete(lp.id)}
                                                title="Supprimer"
                                                className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>

                                        <Link
                                            href={`/lp/${lp.slug}`}
                                            target="_blank"
                                            className="flex items-center gap-1 text-[11px] font-bold text-[#B8935A] hover:underline"
                                        >
                                            <span>Voir en direct</span>
                                            <ExternalLink size={12} />
                                        </Link>
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
