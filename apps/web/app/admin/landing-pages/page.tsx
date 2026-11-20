'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
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
    MessageCircle, 
    ChevronDown, 
    ChevronUp,
    Save,
    X,
    Smartphone,
    ShoppingBag,
    CheckSquare,
    Star,
    HelpCircle,
    Video,
    ShieldCheck,
    Truck,
    Settings,
    ArrowUp,
    ArrowDown
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

    // État d'édition & Modal
    const [isEditing, setIsEditing] = useState(false);
    const [currentLP, setCurrentLP] = useState<LandingPageData | null>(null);
    const [activeTab, setActiveTab] = useState<'offer' | 'content' | 'order' | 'design'>('offer');
    const [showQuickPreview, setShowQuickPreview] = useState(false);
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
                toast.success('Landing page enregistrée avec succès !');
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
                { id: '1', nameFr: 'Mini lampe UV pink', descDz: 'مصباح ميني خفيف وسريع لتجفيف وتثبيت الأظافر في ثوانٍ.', quantity: 1 },
                { id: '2', nameFr: 'Coupe capsule', descDz: 'مقص احترافي لقص الكبسولات بدقة ونظافة وبلا ما يكسرها.', quantity: 1 }
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
                { id: 'b2', title: 'توفير كبير في الوقت والدراهم', description: 'بلا ما تحوسي في الحوانيت وتشري كل قطعة وحدها بسعر غالي، جمعنالك كلش في باك واحد شامل.' },
                { id: 'b3', title: 'توصيل سريع ومعاينة قبل الدفع', description: 'نوصلولك لكامل 58 ولاية مع إمكانية فتح الطرد ومعاينة السلعة قبل الدفع كاش عند الاستلام.' }
            ],

            reviewsTitle: 'آراء زبوناتنا الوفيات',
            reviewsSubtitle: 'تجارب حقيقية من زبونات بدأن مشروعهن بهذا الباك',
            reviews: [
                { id: 'r1', authorName: 'أمينة ب.', wilaya: 'الجزائر العاصمة', rating: 5, comment: 'الباك جاني كيما في التصويرة تماماً وفيه كلش، لمبة UV خفيفة بزاف والفيرني يشد مليح، يعطيك الصحة.', date: 'منذ يومين' },
                { id: 'r2', authorName: 'سارة م.', wilaya: 'وهران', rating: 5, comment: 'خدمة هايلة والتوصيل وصلني في 48 ساعة لباب الدار، عجبني بلي نقدر نتحقق من السلعة قبل ما نخلص.', date: 'منذ 5 أيام' }
            ],

            faqTitle: 'الأسئلة الأكثر تكراراً (FAQ)',
            faqSubtitle: 'كل الإجابات عن التوصيل، الدفع، ومكونات الباك',
            faqs: [
                { id: 'f1', question: 'كيفاش نخلص ووقتاش توصلني السلعة ؟', answer: 'الدفع يداً بيد عند الاستلام كاش. التوصيل يوصلك حتى لباب دارك أو للمكتب خلال 24 إلى 48 ساعة حسب ولايتك.' },
                { id: 'f2', question: 'هل نقدر نفتح الطرد ونشوف السلعة قبل ما نخلص ؟', answer: 'نعم بكل تأكيد ! تقدري تفتحي الطرد وتعايني المكونات وتتأكدي من كلش قبل ما تمدي الدراهم لعامل التوصيل.' }
            ],

            videoTitle: 'فيديو توضيحي لطريقة الاستعمال والنتيجة',
            videoSubtitle: 'شاهدي كيفاش تخدمي ديزاينات احترافية خطوة بخطوة بالمنتجات لي في الباك',
            videoUrl: '',

            formTitle: 'اطلبي الباك تاعك درك',
            formSubtitle: '',
            nameLabel: 'الاسم واللقب',
            namePlaceholder: 'Selma',
            phoneLabel: 'رقم الهاتف',
            phonePlaceholder: '0555514785',
            wilayaLabel: 'الولاية',
            communeLabel: 'البلدية',
            deliveryTypeLabel: 'طريقة التوصيل المفضلة',
            homeDeliveryLabel: 'توصيل للدار (Domicile)',
            deskDeliveryLabel: 'استلام من المكتب (Bureau)',
            summaryProductLabel: 'سعر الباك :',
            summaryShippingLabel: 'سعر التوصيل لولايتك :',
            summaryTotalLabel: 'المجموع الكلي عند الاستلام :',
            ctaButtonText: 'تأكيد الطلب الآن',
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
        setActiveTab('offer');
    };

    const handleEdit = (lp: LandingPageData) => {
        setCurrentLP(JSON.parse(JSON.stringify(lp)));
        setIsEditing(true);
        setActiveTab('offer');
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

    // Sauvegarde du modal d'édition
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

    const handleRemovePhoto = (index: number) => {
        if (!currentLP) return;
        const updated = currentLP.photos.filter((_, i) => i !== index);
        setCurrentLP({ ...currentLP, photos: updated });
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
            nameFr: 'Nouveau produit',
            descDz: 'شرح مبسط ومباشر لهذا العنصر في الباك.',
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
        const updated = [...currentLP.items];
        const [moved] = updated.splice(index, 1);
        updated.splice(targetIndex, 0, moved);
        setCurrentLP({ ...currentLP, items: updated });
    };

    // Gestion des Avantages (Benefits)
    const handleAddBenefit = () => {
        if (!currentLP) return;
        const newB: LandingPageBenefit = {
            id: 'b_' + Date.now(),
            title: 'ميزة جديدة',
            description: 'اشرحي للزبونة علاش هذا الباك هو الخيار الأفضل ليها.'
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
            authorName: 'زبونة وفية',
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
            answer: 'إجابة واضحة ومريحة تشجع الزبونة على الشراء.'
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
                                Créez et personnalisez facilement vos pages d'atterrissage à fort taux de conversion.
                            </p>
                        </div>
                    </div>
                </div>

                <button
                    onClick={handleCreateNew}
                    className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#390102] hover:bg-[#18080A] text-[#FAF5EF] text-xs font-semibold rounded-xl shadow-md transition-all active:scale-[0.99]"
                >
                    <Plus size={16} />
                    <span>Créer une nouvelle Landing Page</span>
                </button>
            </div>

            {/* LISTE DES LANDING PAGES */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-sm font-bold text-[#18080A] uppercase tracking-wider">
                        Vos Landing Pages ({landingPages.length})
                    </h2>
                </div>

                {loading ? (
                    <div className="p-12 text-center bg-white border border-[#EFE4D8] rounded-2xl">
                        <div className="w-8 h-8 border-2 border-[#390102] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                        <p className="text-xs text-[#7A5459]">Chargement de vos pages...</p>
                    </div>
                ) : landingPages.length === 0 ? (
                    <div className="p-12 text-center bg-white border border-dashed border-[#EFE4D8] rounded-2xl">
                        <Package size={40} className="mx-auto text-[#BFA893] mb-3" />
                        <h3 className="font-bold text-sm text-[#18080A]">Aucune landing page créée</h3>
                        <p className="text-xs text-[#7A5459] mt-1 mb-4">Créez votre première page en 1 clic.</p>
                        <button
                            onClick={handleCreateNew}
                            className="px-4 py-2 bg-[#390102] text-white text-xs font-bold rounded-xl"
                        >
                            Créer maintenant
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {landingPages.map((lp) => (
                            <div 
                                key={lp.id}
                                className="bg-white border border-[#EFE4D8] hover:border-[#BFA893] rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
                            >
                                <div>
                                    {/* Image couverture */}
                                    <div className="w-full aspect-[16/10] bg-[#FAF5EF] relative overflow-hidden border-b border-[#EFE4D8]">
                                        <img 
                                            src={lp.photos[0] || 'https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=800&q=80'} 
                                            alt={lp.title} 
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                        
                                        {/* Badge Statut */}
                                        <button
                                            onClick={() => handleToggleActive(lp.id)}
                                            className={cn(
                                                "absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-bold shadow-sm backdrop-blur-md transition-transform hover:scale-105",
                                                lp.isActive ? "bg-emerald-600/90 text-white" : "bg-gray-800/80 text-white/80"
                                            )}
                                        >
                                            {lp.isActive ? '● En ligne' : '○ Brouillon'}
                                        </button>

                                        {/* Badge Prix */}
                                        <div className="absolute bottom-3 right-3 px-3 py-1 bg-[#18080A]/85 backdrop-blur-md text-[#BFA893] rounded-lg text-xs font-bold">
                                            {lp.price.toLocaleString('fr-DZ')} {lp.currency || 'DA'}
                                        </div>
                                    </div>

                                    {/* Contenu de la carte */}
                                    <div className="p-4 space-y-2">
                                        <div className="flex items-center justify-between text-[11px] text-[#7A5459]">
                                            <span className="font-mono bg-[#FAF5EF] px-2 py-0.5 rounded border border-[#EFE4D8]">
                                                /lp/{lp.slug}
                                            </span>
                                            <span>{lp.items?.length || 0} articles</span>
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
                                            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#390102] hover:bg-[#18080A] text-white text-xs font-bold rounded-lg shadow-sm transition-all"
                                        >
                                            <Edit3 size={13} />
                                            <span>Modifier</span>
                                        </button>

                                        <button
                                            onClick={() => handleDuplicate(lp)}
                                            title="Dupliquer"
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
                                        <span>Voir la page</span>
                                        <ExternalLink size={12} />
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* ========================================================= */}
            {/* VRAI MODAL D'ÉDITION CLAIR, ERGONOMIQUE ET FACILE         */}
            {/* ========================================================= */}
            {isEditing && currentLP && (
                <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-hidden">
                    <div className="bg-white w-full max-w-4xl rounded-2xl sm:rounded-3xl shadow-2xl border border-[#EFE4D8] flex flex-col max-h-[92vh] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        
                        {/* EN-TÊTE DU MODAL */}
                        <div className="bg-[#18080A] text-[#FAF5EF] px-6 py-4 flex items-center justify-between gap-4 border-b border-white/10 shrink-0">
                            <div>
                                <div className="flex items-center gap-2">
                                    <h2 className="font-serif text-base sm:text-lg font-bold text-white">
                                        Modifier la Landing Page
                                    </h2>
                                    <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded text-[#BFA893] font-mono">
                                        /lp/{currentLP.slug}
                                    </span>
                                </div>
                                <p className="text-xs text-[#BFA893] truncate max-w-md mt-0.5" dir="rtl">
                                    {currentLP.title}
                                </p>
                            </div>

                            <div className="flex items-center gap-2">
                                <Link
                                    href={`/lp/${currentLP.slug}`}
                                    target="_blank"
                                    className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-semibold border border-white/20 transition-all"
                                >
                                    <span>Tester en direct</span>
                                    <ExternalLink size={13} />
                                </Link>

                                <button
                                    onClick={() => { setIsEditing(false); setCurrentLP(null); }}
                                    className="p-2 text-white/70 hover:text-white rounded-xl hover:bg-white/10 transition-colors"
                                    title="Fermer"
                                >
                                    <X size={20} />
                                </button>
                            </div>
                        </div>

                        {/* 4 ONGLETS SIMPLES ET CLAIRS */}
                        <div className="bg-[#FAF5EF] border-b border-[#EFE4D8] px-6 flex gap-2 shrink-0 overflow-x-auto">
                            {[
                                { key: 'offer', label: '1. Produit & Prix', icon: Package, desc: 'Pack, tarif, photos et 17 composants' },
                                { key: 'content', label: '2. Sections & Avis', icon: Star, desc: 'Avantages, avis 5 étoiles, FAQ, vidéo' },
                                { key: 'order', label: '3. Commande & Livraison', icon: Truck, desc: 'Formulaire, 58 wilayas et garanties' },
                                { key: 'design', label: '4. Style & Paramètres', icon: Settings, desc: 'Lien, logo, couleurs de la boutique' },
                            ].map((t) => (
                                <button
                                    key={t.key}
                                    onClick={() => setActiveTab(t.key as any)}
                                    className={cn(
                                        "flex items-center gap-2 py-3.5 px-4 text-xs font-bold border-b-2 transition-all whitespace-nowrap -mb-px",
                                        activeTab === t.key
                                            ? "border-[#390102] text-[#390102] bg-white rounded-t-xl shadow-sm"
                                            : "border-transparent text-[#7A5459] hover:text-[#18080A]"
                                    )}
                                >
                                    <t.icon size={16} />
                                    <span>{t.label}</span>
                                </button>
                            ))}
                        </div>

                        {/* CORPS DU MODAL (SCROLLABLE & AÉRÉ) */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-[#FCFAF7]">
                            
                            {/* ================================================= */}
                            {/* ONGLET 1 : PRODUIT & PRIX                        */}
                            {/* ================================================= */}
                            {activeTab === 'offer' && (
                                <div className="space-y-6">
                                    
                                    {/* Card : Titre & Offre */}
                                    <div className="bg-white border border-[#EFE4D8] rounded-2xl p-5 space-y-4 shadow-sm">
                                        <div className="flex items-center gap-2 border-b border-[#FAF5EF] pb-3">
                                            <FileText size={16} className="text-[#B8935A]" />
                                            <h3 className="text-xs font-bold uppercase tracking-wider text-[#18080A]">
                                                Titre et Description de l'offre
                                            </h3>
                                        </div>

                                        <div className="space-y-3">
                                            <div>
                                                <label className="block text-xs font-bold text-[#18080A] mb-1">
                                                    Titre principal du Pack (Arabe / Darija)
                                                </label>
                                                <input
                                                    type="text"
                                                    value={currentLP.title}
                                                    onChange={(e) => setCurrentLP({ ...currentLP, title: e.target.value })}
                                                    dir="rtl"
                                                    className="w-full p-2.5 bg-[#FAF5EF]/50 border border-[#EFE4D8] rounded-xl text-xs font-semibold text-right focus:border-[#390102] focus:bg-white focus:outline-none"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-xs font-bold text-[#18080A] mb-1">
                                                    Sous-titre explicatif
                                                </label>
                                                <input
                                                    type="text"
                                                    value={currentLP.subtitle || ''}
                                                    onChange={(e) => setCurrentLP({ ...currentLP, subtitle: e.target.value })}
                                                    dir="rtl"
                                                    className="w-full p-2.5 bg-[#FAF5EF]/50 border border-[#EFE4D8] rounded-xl text-xs text-right focus:border-[#390102] focus:bg-white focus:outline-none"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Card : Prix & Économie */}
                                    <div className="bg-white border border-[#EFE4D8] rounded-2xl p-5 space-y-4 shadow-sm">
                                        <div className="flex items-center gap-2 border-b border-[#FAF5EF] pb-3">
                                            <Tag size={16} className="text-[#B8935A]" />
                                            <h3 className="text-xs font-bold uppercase tracking-wider text-[#18080A]">
                                                Prix de vente et Réduction
                                            </h3>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                            <div>
                                                <label className="block text-xs font-bold text-[#18080A] mb-1">
                                                    Prix de vente (DA)
                                                </label>
                                                <input
                                                    type="number"
                                                    value={currentLP.price}
                                                    onChange={(e) => setCurrentLP({ ...currentLP, price: Number(e.target.value) })}
                                                    className="w-full p-2.5 bg-[#FAF5EF]/50 border border-[#EFE4D8] rounded-xl text-sm font-bold text-[#390102] focus:border-[#390102] focus:bg-white focus:outline-none"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-xs font-bold text-[#18080A] mb-1">
                                                    Ancien prix barré (DA)
                                                </label>
                                                <input
                                                    type="number"
                                                    value={currentLP.compareAtPrice || ''}
                                                    onChange={(e) => setCurrentLP({ ...currentLP, compareAtPrice: Number(e.target.value) })}
                                                    placeholder="Ex: 8500"
                                                    className="w-full p-2.5 bg-[#FAF5EF]/50 border border-[#EFE4D8] rounded-xl text-sm line-through text-[#7A5459] focus:border-[#390102] focus:bg-white focus:outline-none"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-xs font-bold text-[#18080A] mb-1">
                                                    Badge sous le prix
                                                </label>
                                                <input
                                                    type="text"
                                                    value={currentLP.priceBadgeText || ''}
                                                    onChange={(e) => setCurrentLP({ ...currentLP, priceBadgeText: e.target.value })}
                                                    dir="rtl"
                                                    placeholder="سعر الباك الكامل"
                                                    className="w-full p-2.5 bg-[#FAF5EF]/50 border border-[#EFE4D8] rounded-xl text-xs text-right focus:border-[#390102] focus:bg-white focus:outline-none"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Card : Photos Pleine Largeur */}
                                    <div className="bg-white border border-[#EFE4D8] rounded-2xl p-5 space-y-4 shadow-sm">
                                        <div className="flex items-center justify-between border-b border-[#FAF5EF] pb-3">
                                            <div className="flex items-center gap-2">
                                                <ImageIcon size={16} className="text-[#B8935A]" />
                                                <h3 className="text-xs font-bold uppercase tracking-wider text-[#18080A]">
                                                    Photos du Pack ({currentLP.photos.length})
                                                </h3>
                                            </div>

                                            <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#390102] hover:bg-[#18080A] text-[#FAF5EF] rounded-xl text-xs font-bold transition-all shadow-sm">
                                                <Upload size={13} />
                                                <span>{uploadingImage ? 'Upload en cours...' : '+ Ajouter une photo'}</span>
                                                <input 
                                                    type="file" 
                                                    accept="image/*" 
                                                    className="hidden" 
                                                    onChange={handleUploadPhoto}
                                                    disabled={uploadingImage}
                                                />
                                            </label>
                                        </div>

                                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                            {currentLP.photos.map((url, idx) => (
                                                <div 
                                                    key={idx} 
                                                    className="relative aspect-square rounded-xl overflow-hidden border border-[#EFE4D8] bg-[#FAF5EF] group"
                                                >
                                                    <img src={url} alt={`Photo ${idx + 1}`} className="w-full h-full object-cover" />
                                                    {idx === 0 && (
                                                        <span className="absolute top-1.5 left-1.5 bg-[#390102] text-[#BFA893] text-[9px] font-bold px-2 py-0.5 rounded shadow">
                                                            Principale
                                                        </span>
                                                    )}
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRemovePhoto(idx)}
                                                        className="absolute top-1.5 right-1.5 p-1 bg-red-600/90 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                                                        title="Supprimer la photo"
                                                    >
                                                        <Trash2 size={13} />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Card : Les Composants du Pack (17 articles) */}
                                    <div className="bg-white border border-[#EFE4D8] rounded-2xl p-5 space-y-4 shadow-sm">
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#FAF5EF] pb-3">
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <Layers size={16} className="text-[#B8935A]" />
                                                    <h3 className="text-xs font-bold uppercase tracking-wider text-[#18080A]">
                                                        Composants du Pack ({currentLP.items.length} articles)
                                                    </h3>
                                                </div>
                                                <p className="text-[11px] text-[#7A5459] mt-0.5">
                                                    Chaque produit a son nom en français et son explication en arabe dialectal (DZ).
                                                </p>
                                            </div>

                                            <button
                                                type="button"
                                                onClick={handleAddItem}
                                                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#FAF5EF] hover:bg-[#EFE4D8] border border-[#EFE4D8] text-[#390102] text-xs font-bold rounded-xl transition-all"
                                            >
                                                <Plus size={14} />
                                                <span>Ajouter un article</span>
                                            </button>
                                        </div>

                                        <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
                                            {currentLP.items.map((item, idx) => (
                                                <div 
                                                    key={item.id || idx}
                                                    className="p-3 bg-[#FAF5EF]/60 border border-[#EFE4D8] rounded-xl flex flex-col sm:flex-row items-start sm:items-center gap-3 text-xs"
                                                >
                                                    <span className="w-6 h-6 rounded-lg bg-[#390102] text-[#BFA893] font-bold flex items-center justify-center shrink-0 text-[11px]">
                                                        {idx + 1}
                                                    </span>

                                                    {/* Nom Français */}
                                                    <div className="flex-1 w-full sm:w-auto">
                                                        <input
                                                            type="text"
                                                            value={item.nameFr}
                                                            onChange={(e) => handleUpdateItem(idx, 'nameFr', e.target.value)}
                                                            placeholder="Nom en Français (ex: Mini lampe UV)"
                                                            className="w-full p-2 bg-white border border-[#EFE4D8] rounded-lg font-semibold text-[#18080A] focus:outline-none focus:border-[#390102]"
                                                        />
                                                    </div>

                                                    {/* Quantité */}
                                                    <div className="w-20 shrink-0">
                                                        <input
                                                            type="number"
                                                            min="1"
                                                            value={item.quantity || 1}
                                                            onChange={(e) => handleUpdateItem(idx, 'quantity', Number(e.target.value))}
                                                            title="Quantité"
                                                            className="w-full p-2 bg-white border border-[#EFE4D8] rounded-lg font-bold text-center text-[#390102] focus:outline-none focus:border-[#390102]"
                                                        />
                                                    </div>

                                                    {/* Description Arabe */}
                                                    <div className="flex-1 w-full sm:w-auto">
                                                        <input
                                                            type="text"
                                                            value={item.descDz || ''}
                                                            onChange={(e) => handleUpdateItem(idx, 'descDz', e.target.value)}
                                                            dir="rtl"
                                                            placeholder="الشرح بالدارجة (فائدة المنتج)"
                                                            className="w-full p-2 bg-white border border-[#EFE4D8] rounded-lg text-right text-[#7A5459] focus:outline-none focus:border-[#390102]"
                                                        />
                                                    </div>

                                                    {/* Actions Déplacer & Supprimer */}
                                                    <div className="flex items-center gap-1 shrink-0 self-end sm:self-center">
                                                        <button
                                                            type="button"
                                                            onClick={() => handleMoveItem(idx, 'up')}
                                                            disabled={idx === 0}
                                                            className="p-1.5 hover:bg-white rounded-lg disabled:opacity-30 text-[#7A5459]"
                                                            title="Monter"
                                                        >
                                                            <ArrowUp size={13} />
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => handleMoveItem(idx, 'down')}
                                                            disabled={idx === currentLP.items.length - 1}
                                                            className="p-1.5 hover:bg-white rounded-lg disabled:opacity-30 text-[#7A5459]"
                                                            title="Descendre"
                                                        >
                                                            <ArrowDown size={13} />
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => handleDeleteItem(idx)}
                                                            className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg"
                                                            title="Supprimer"
                                                        >
                                                            <Trash2 size={13} />
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                </div>
                            )}

                            {/* ================================================= */}
                            {/* ONGLET 2 : SECTIONS & AVIS                        */}
                            {/* ================================================= */}
                            {activeTab === 'content' && (
                                <div className="space-y-6">

                                    {/* 1. Avantages (علاش تختاري هذا الباك) */}
                                    <div className="bg-white border border-[#EFE4D8] rounded-2xl p-5 space-y-4 shadow-sm">
                                        <div className="flex items-center justify-between border-b border-[#FAF5EF] pb-3">
                                            <div className="flex items-center gap-2">
                                                <Sparkles size={16} className="text-[#B8935A]" />
                                                <h3 className="text-xs font-bold uppercase tracking-wider text-[#18080A]">
                                                    Points Forts & Avantages (« علاش تختاري هذا الباك ؟ »)
                                                </h3>
                                            </div>

                                            <label className="flex items-center gap-2 cursor-pointer">
                                                <span className="text-[11px] font-semibold text-[#7A5459]">
                                                    {currentLP.showBenefits !== false ? 'Affiché' : 'Masqué'}
                                                </span>
                                                <input
                                                    type="checkbox"
                                                    checked={currentLP.showBenefits !== false}
                                                    onChange={(e) => setCurrentLP({ ...currentLP, showBenefits: e.target.checked })}
                                                    className="w-4 h-4 accent-[#390102]"
                                                />
                                            </label>
                                        </div>

                                        {currentLP.showBenefits !== false && (
                                            <div className="space-y-3">
                                                <input
                                                    type="text"
                                                    value={currentLP.benefitsTitle || ''}
                                                    onChange={(e) => setCurrentLP({ ...currentLP, benefitsTitle: e.target.value })}
                                                    dir="rtl"
                                                    placeholder="عنوان قسم المميزات"
                                                    className="w-full p-2.5 bg-[#FAF5EF]/50 border border-[#EFE4D8] rounded-xl text-xs font-bold text-right focus:outline-none focus:border-[#390102]"
                                                />

                                                <div className="space-y-2">
                                                    {(currentLP.benefits || []).map((b, idx) => (
                                                        <div key={b.id || idx} className="p-3 bg-[#FAF5EF]/40 border border-[#EFE4D8] rounded-xl space-y-2 text-right" dir="rtl">
                                                            <div className="flex items-center justify-between">
                                                                <span className="text-[11px] font-bold text-[#390102]">ميزة {idx + 1} :</span>
                                                                <button
                                                                    type="button"
                                                                    onClick={() => handleDeleteBenefit(idx)}
                                                                    className="text-red-500 hover:text-red-700 text-xs"
                                                                >
                                                                    حذف
                                                                </button>
                                                            </div>
                                                            <input
                                                                type="text"
                                                                value={b.title}
                                                                onChange={(e) => handleUpdateBenefit(idx, 'title', e.target.value)}
                                                                placeholder="عنوان الميزة"
                                                                className="w-full p-2 bg-white border border-[#EFE4D8] rounded-lg text-xs font-semibold focus:outline-none"
                                                            />
                                                            <textarea
                                                                rows={2}
                                                                value={b.description}
                                                                onChange={(e) => handleUpdateBenefit(idx, 'description', e.target.value)}
                                                                placeholder="شرح الميزة بالتفصيل..."
                                                                className="w-full p-2 bg-white border border-[#EFE4D8] rounded-lg text-xs text-[#7A5459] focus:outline-none"
                                                            />
                                                        </div>
                                                    ))}

                                                    <button
                                                        type="button"
                                                        onClick={handleAddBenefit}
                                                        className="w-full py-2 bg-[#FAF5EF] hover:bg-[#EFE4D8] border border-[#EFE4D8] rounded-xl text-xs font-bold text-[#390102] transition-colors"
                                                    >
                                                        + إضافة ميزة جديدة
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* 2. Avis Clientes (آراء الزبونات) */}
                                    <div className="bg-white border border-[#EFE4D8] rounded-2xl p-5 space-y-4 shadow-sm">
                                        <div className="flex items-center justify-between border-b border-[#FAF5EF] pb-3">
                                            <div className="flex items-center gap-2">
                                                <Star size={16} className="text-[#B8935A]" />
                                                <h3 className="text-xs font-bold uppercase tracking-wider text-[#18080A]">
                                                    Avis & Témoignages Clientes (5 étoiles)
                                                </h3>
                                            </div>

                                            <label className="flex items-center gap-2 cursor-pointer">
                                                <span className="text-[11px] font-semibold text-[#7A5459]">
                                                    {currentLP.showReviews !== false ? 'Affiché' : 'Masqué'}
                                                </span>
                                                <input
                                                    type="checkbox"
                                                    checked={currentLP.showReviews !== false}
                                                    onChange={(e) => setCurrentLP({ ...currentLP, showReviews: e.target.checked })}
                                                    className="w-4 h-4 accent-[#390102]"
                                                />
                                            </label>
                                        </div>

                                        {currentLP.showReviews !== false && (
                                            <div className="space-y-3">
                                                <input
                                                    type="text"
                                                    value={currentLP.reviewsTitle || ''}
                                                    onChange={(e) => setCurrentLP({ ...currentLP, reviewsTitle: e.target.value })}
                                                    dir="rtl"
                                                    placeholder="عنوان قسم آراء الزبونات"
                                                    className="w-full p-2.5 bg-[#FAF5EF]/50 border border-[#EFE4D8] rounded-xl text-xs font-bold text-right focus:outline-none focus:border-[#390102]"
                                                />

                                                <div className="space-y-2">
                                                    {(currentLP.reviews || []).map((r, idx) => (
                                                        <div key={r.id || idx} className="p-3 bg-[#FAF5EF]/40 border border-[#EFE4D8] rounded-xl space-y-2 text-right" dir="rtl">
                                                            <div className="flex items-center justify-between">
                                                                <div className="flex items-center gap-2">
                                                                    <input
                                                                        type="text"
                                                                        value={r.authorName}
                                                                        onChange={(e) => handleUpdateReview(idx, 'authorName', e.target.value)}
                                                                        placeholder="اسم الزبونة (مثال: أمينة ب.)"
                                                                        className="p-1.5 bg-white border border-[#EFE4D8] rounded-lg text-xs font-bold"
                                                                    />
                                                                    <input
                                                                        type="text"
                                                                        value={r.wilaya}
                                                                        onChange={(e) => handleUpdateReview(idx, 'wilaya', e.target.value)}
                                                                        placeholder="الولاية (مثال: وهران)"
                                                                        className="p-1.5 bg-white border border-[#EFE4D8] rounded-lg text-xs"
                                                                    />
                                                                </div>
                                                                <button
                                                                    type="button"
                                                                    onClick={() => handleDeleteReview(idx)}
                                                                    className="text-red-500 hover:text-red-700 text-xs"
                                                                >
                                                                    حذف
                                                                </button>
                                                            </div>
                                                            <textarea
                                                                rows={2}
                                                                value={r.comment}
                                                                onChange={(e) => handleUpdateReview(idx, 'comment', e.target.value)}
                                                                placeholder="نص الرأي وتجربة الزبونة..."
                                                                className="w-full p-2 bg-white border border-[#EFE4D8] rounded-lg text-xs text-[#7A5459] focus:outline-none"
                                                            />
                                                        </div>
                                                    ))}

                                                    <button
                                                        type="button"
                                                        onClick={handleAddReview}
                                                        className="w-full py-2 bg-[#FAF5EF] hover:bg-[#EFE4D8] border border-[#EFE4D8] rounded-xl text-xs font-bold text-[#390102] transition-colors"
                                                    >
                                                        + إضافة رأي جديد
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* 3. FAQ (الأسئلة الشائعة) */}
                                    <div className="bg-white border border-[#EFE4D8] rounded-2xl p-5 space-y-4 shadow-sm">
                                        <div className="flex items-center justify-between border-b border-[#FAF5EF] pb-3">
                                            <div className="flex items-center gap-2">
                                                <HelpCircle size={16} className="text-[#B8935A]" />
                                                <h3 className="text-xs font-bold uppercase tracking-wider text-[#18080A]">
                                                    Foire Aux Questions (FAQ)
                                                </h3>
                                            </div>

                                            <label className="flex items-center gap-2 cursor-pointer">
                                                <span className="text-[11px] font-semibold text-[#7A5459]">
                                                    {currentLP.showFaq !== false ? 'Affiché' : 'Masqué'}
                                                </span>
                                                <input
                                                    type="checkbox"
                                                    checked={currentLP.showFaq !== false}
                                                    onChange={(e) => setCurrentLP({ ...currentLP, showFaq: e.target.checked })}
                                                    className="w-4 h-4 accent-[#390102]"
                                                />
                                            </label>
                                        </div>

                                        {currentLP.showFaq !== false && (
                                            <div className="space-y-3">
                                                <input
                                                    type="text"
                                                    value={currentLP.faqTitle || ''}
                                                    onChange={(e) => setCurrentLP({ ...currentLP, faqTitle: e.target.value })}
                                                    dir="rtl"
                                                    placeholder="عنوان قسم الأسئلة الشائعة"
                                                    className="w-full p-2.5 bg-[#FAF5EF]/50 border border-[#EFE4D8] rounded-xl text-xs font-bold text-right focus:outline-none focus:border-[#390102]"
                                                />

                                                <div className="space-y-2">
                                                    {(currentLP.faqs || []).map((f, idx) => (
                                                        <div key={f.id || idx} className="p-3 bg-[#FAF5EF]/40 border border-[#EFE4D8] rounded-xl space-y-2 text-right" dir="rtl">
                                                            <div className="flex items-center justify-between">
                                                                <span className="text-[11px] font-bold text-[#390102]">سؤال {idx + 1} :</span>
                                                                <button
                                                                    type="button"
                                                                    onClick={() => handleDeleteFaq(idx)}
                                                                    className="text-red-500 hover:text-red-700 text-xs"
                                                                >
                                                                    حذف
                                                                </button>
                                                            </div>
                                                            <input
                                                                type="text"
                                                                value={f.question}
                                                                onChange={(e) => handleUpdateFaq(idx, 'question', e.target.value)}
                                                                placeholder="نص السؤال"
                                                                className="w-full p-2 bg-white border border-[#EFE4D8] rounded-lg text-xs font-semibold focus:outline-none"
                                                            />
                                                            <textarea
                                                                rows={2}
                                                                value={f.answer}
                                                                onChange={(e) => handleUpdateFaq(idx, 'answer', e.target.value)}
                                                                placeholder="الإجابة المريحة والشافية للزبونة..."
                                                                className="w-full p-2 bg-white border border-[#EFE4D8] rounded-lg text-xs text-[#7A5459] focus:outline-none"
                                                            />
                                                        </div>
                                                    ))}

                                                    <button
                                                        type="button"
                                                        onClick={handleAddFaq}
                                                        className="w-full py-2 bg-[#FAF5EF] hover:bg-[#EFE4D8] border border-[#EFE4D8] rounded-xl text-xs font-bold text-[#390102] transition-colors"
                                                    >
                                                        + إضافة سؤال جديد
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* 4. Vidéo Démo & Chat Instagram */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {/* Vidéo */}
                                        <div className="bg-white border border-[#EFE4D8] rounded-2xl p-4 space-y-3 shadow-sm">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-1.5">
                                                    <Video size={15} className="text-[#B8935A]" />
                                                    <h4 className="text-xs font-bold text-[#18080A]">Vidéo Démo</h4>
                                                </div>
                                                <input
                                                    type="checkbox"
                                                    checked={Boolean(currentLP.showVideo)}
                                                    onChange={(e) => setCurrentLP({ ...currentLP, showVideo: e.target.checked })}
                                                    className="w-4 h-4 accent-[#390102]"
                                                />
                                            </div>
                                            {currentLP.showVideo && (
                                                <input
                                                    type="url"
                                                    value={currentLP.videoUrl || ''}
                                                    onChange={(e) => setCurrentLP({ ...currentLP, videoUrl: e.target.value })}
                                                    placeholder="URL YouTube ou vidéo (https://...)"
                                                    className="w-full p-2 bg-[#FAF5EF]/50 border border-[#EFE4D8] rounded-lg text-xs focus:outline-none"
                                                />
                                            )}
                                        </div>

                                        {/* Instagram */}
                                        <div className="bg-white border border-[#EFE4D8] rounded-2xl p-4 space-y-3 shadow-sm">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-1.5">
                                                    <MessageCircle size={15} className="text-[#B8935A]" />
                                                    <h4 className="text-xs font-bold text-[#18080A]">Chat Instagram</h4>
                                                </div>
                                                <input
                                                    type="checkbox"
                                                    checked={currentLP.showInstagram !== false}
                                                    onChange={(e) => setCurrentLP({ ...currentLP, showInstagram: e.target.checked })}
                                                    className="w-4 h-4 accent-[#390102]"
                                                />
                                            </div>
                                            {currentLP.showInstagram !== false && (
                                                <input
                                                    type="url"
                                                    value={currentLP.instagramUrl || ''}
                                                    onChange={(e) => setCurrentLP({ ...currentLP, instagramUrl: e.target.value })}
                                                    placeholder="Lien Instagram (https://ig.me/m/...)"
                                                    className="w-full p-2 bg-[#FAF5EF]/50 border border-[#EFE4D8] rounded-lg text-xs focus:outline-none"
                                                />
                                            )}
                                        </div>
                                    </div>

                                </div>
                            )}

                            {/* ================================================= */}
                            {/* ONGLET 3 : COMMANDE & LIVRAISON                  */}
                            {/* ================================================= */}
                            {activeTab === 'order' && (
                                <div className="space-y-6">

                                    {/* Textes du formulaire */}
                                    <div className="bg-white border border-[#EFE4D8] rounded-2xl p-5 space-y-4 shadow-sm">
                                        <div className="flex items-center gap-2 border-b border-[#FAF5EF] pb-3">
                                            <CheckSquare size={16} className="text-[#B8935A]" />
                                            <h3 className="text-xs font-bold uppercase tracking-wider text-[#18080A]">
                                                Textes du Formulaire de Commande
                                            </h3>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-xs font-bold text-[#18080A] mb-1">
                                                    Titre au-dessus du formulaire
                                                </label>
                                                <input
                                                    type="text"
                                                    value={currentLP.formTitle || ''}
                                                    onChange={(e) => setCurrentLP({ ...currentLP, formTitle: e.target.value })}
                                                    dir="rtl"
                                                    className="w-full p-2.5 bg-[#FAF5EF]/50 border border-[#EFE4D8] rounded-xl text-xs text-right focus:outline-none focus:border-[#390102]"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-xs font-bold text-[#18080A] mb-1">
                                                    Texte du Bouton de commande
                                                </label>
                                                <input
                                                    type="text"
                                                    value={currentLP.ctaButtonText || ''}
                                                    onChange={(e) => setCurrentLP({ ...currentLP, ctaButtonText: e.target.value })}
                                                    dir="rtl"
                                                    className="w-full p-2.5 bg-[#FAF5EF]/50 border border-[#EFE4D8] rounded-xl text-xs font-bold text-[#390102] text-right focus:outline-none focus:border-[#390102]"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Garantie & Réassurance */}
                                    <div className="bg-white border border-[#EFE4D8] rounded-2xl p-5 space-y-4 shadow-sm">
                                        <div className="flex items-center gap-2 border-b border-[#FAF5EF] pb-3">
                                            <ShieldCheck size={16} className="text-[#B8935A]" />
                                            <h3 className="text-xs font-bold uppercase tracking-wider text-[#18080A]">
                                                Garantie & Vérification du colis
                                            </h3>
                                        </div>

                                        <div>
                                            <label className="block text-xs font-bold text-[#18080A] mb-1">
                                                Message rassurant (ouvert avant paiement)
                                            </label>
                                            <textarea
                                                rows={2}
                                                value={currentLP.guaranteeText || ''}
                                                onChange={(e) => setCurrentLP({ ...currentLP, guaranteeText: e.target.value })}
                                                dir="rtl"
                                                className="w-full p-2.5 bg-[#FAF5EF]/50 border border-[#EFE4D8] rounded-xl text-xs text-right text-[#7A5459] focus:outline-none focus:border-[#390102]"
                                            />
                                        </div>
                                    </div>

                                    {/* Options de livraison */}
                                    <div className="bg-white border border-[#EFE4D8] rounded-2xl p-5 space-y-4 shadow-sm">
                                        <div className="flex items-center gap-2 border-b border-[#FAF5EF] pb-3">
                                            <Truck size={16} className="text-[#B8935A]" />
                                            <h3 className="text-xs font-bold uppercase tracking-wider text-[#18080A]">
                                                Livraison 58 Wilayas (Domicile & Bureau)
                                            </h3>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-xs font-bold text-[#18080A] mb-1">
                                                    Libellé Domicile
                                                </label>
                                                <input
                                                    type="text"
                                                    value={currentLP.homeDeliveryLabel || ''}
                                                    onChange={(e) => setCurrentLP({ ...currentLP, homeDeliveryLabel: e.target.value })}
                                                    dir="rtl"
                                                    className="w-full p-2.5 bg-[#FAF5EF]/50 border border-[#EFE4D8] rounded-xl text-xs text-right focus:outline-none"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-xs font-bold text-[#18080A] mb-1">
                                                    Libellé Bureau
                                                </label>
                                                <input
                                                    type="text"
                                                    value={currentLP.deskDeliveryLabel || ''}
                                                    onChange={(e) => setCurrentLP({ ...currentLP, deskDeliveryLabel: e.target.value })}
                                                    dir="rtl"
                                                    className="w-full p-2.5 bg-[#FAF5EF]/50 border border-[#EFE4D8] rounded-xl text-xs text-right focus:outline-none"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Barre Mobile Flottante */}
                                    <div className="bg-white border border-[#EFE4D8] rounded-2xl p-4 flex items-center justify-between shadow-sm">
                                        <div className="flex items-center gap-2">
                                            <Smartphone size={16} className="text-[#B8935A]" />
                                            <div>
                                                <h4 className="text-xs font-bold text-[#18080A]">Barre de commande flottante sur mobile</h4>
                                                <p className="text-[11px] text-[#7A5459]">Reste toujours visible au bas de l'écran sur téléphone.</p>
                                            </div>
                                        </div>

                                        <input
                                            type="checkbox"
                                            checked={currentLP.showStickyCta !== false}
                                            onChange={(e) => setCurrentLP({ ...currentLP, showStickyCta: e.target.checked })}
                                            className="w-4 h-4 accent-[#390102]"
                                        />
                                    </div>

                                </div>
                            )}

                            {/* ================================================= */}
                            {/* ONGLET 4 : STYLE & PARAMÈTRES                    */}
                            {/* ================================================= */}
                            {activeTab === 'design' && (
                                <div className="space-y-6">

                                    {/* Slug & Statut */}
                                    <div className="bg-white border border-[#EFE4D8] rounded-2xl p-5 space-y-4 shadow-sm">
                                        <div className="flex items-center gap-2 border-b border-[#FAF5EF] pb-3">
                                            <Settings size={16} className="text-[#B8935A]" />
                                            <h3 className="text-xs font-bold uppercase tracking-wider text-[#18080A]">
                                                Adresse de la page & Statut
                                            </h3>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-xs font-bold text-[#18080A] mb-1">
                                                    Slug URL (Adresse web)
                                                </label>
                                                <div className="flex items-center bg-[#FAF5EF]/60 border border-[#EFE4D8] rounded-xl overflow-hidden px-3">
                                                    <span className="text-xs font-mono text-[#7A5459]">/lp/</span>
                                                    <input
                                                        type="text"
                                                        value={currentLP.slug}
                                                        onChange={(e) => setCurrentLP({ ...currentLP, slug: e.target.value })}
                                                        className="w-full p-2 bg-transparent text-xs font-mono font-bold focus:outline-none"
                                                    />
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-xs font-bold text-[#18080A] mb-1">
                                                    Statut de la page
                                                </label>
                                                <select
                                                    value={currentLP.isActive ? 'active' : 'inactive'}
                                                    onChange={(e) => setCurrentLP({ ...currentLP, isActive: e.target.value === 'active' })}
                                                    className="w-full p-2.5 bg-[#FAF5EF]/50 border border-[#EFE4D8] rounded-xl text-xs font-bold focus:outline-none"
                                                >
                                                    <option value="active">● En ligne (Accessible publiquement)</option>
                                                    <option value="inactive">○ Brouillon (Désactivée)</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Logo & Nom de la marque */}
                                    <div className="bg-white border border-[#EFE4D8] rounded-2xl p-5 space-y-4 shadow-sm">
                                        <div className="flex items-center justify-between border-b border-[#FAF5EF] pb-3">
                                            <div className="flex items-center gap-2">
                                                <Palette size={16} className="text-[#B8935A]" />
                                                <h3 className="text-xs font-bold uppercase tracking-wider text-[#18080A]">
                                                    Logo & Nom de la boutique
                                                </h3>
                                            </div>

                                            <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1 bg-[#FAF5EF] hover:bg-[#EFE4D8] border border-[#EFE4D8] rounded-lg text-xs font-bold text-[#390102]">
                                                <Upload size={13} />
                                                <span>{uploadingLogo ? 'Upload...' : 'Changer le logo'}</span>
                                                <input 
                                                    type="file" 
                                                    accept="image/*" 
                                                    className="hidden" 
                                                    onChange={handleUploadLogo}
                                                    disabled={uploadingLogo}
                                                />
                                            </label>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-xs font-bold text-[#18080A] mb-1">
                                                    Nom de la marque
                                                </label>
                                                <input
                                                    type="text"
                                                    value={currentLP.brandName || 'MEEY NAIL SHOP'}
                                                    onChange={(e) => setCurrentLP({ ...currentLP, brandName: e.target.value })}
                                                    className="w-full p-2.5 bg-[#FAF5EF]/50 border border-[#EFE4D8] rounded-xl text-xs font-bold focus:outline-none"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-xs font-bold text-[#18080A] mb-1">
                                                    Couleur Principale (Bordeaux MEEY)
                                                </label>
                                                <div className="flex items-center gap-2">
                                                    <input
                                                        type="color"
                                                        value={currentLP.primaryColor || '#390102'}
                                                        onChange={(e) => setCurrentLP({ ...currentLP, primaryColor: e.target.value })}
                                                        className="w-10 h-10 rounded-lg cursor-pointer border border-[#EFE4D8]"
                                                    />
                                                    <span className="text-xs font-mono font-bold text-[#390102]">
                                                        {currentLP.primaryColor || '#390102'}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Pixels Publicitaires */}
                                    <div className="bg-white border border-[#EFE4D8] rounded-2xl p-5 space-y-4 shadow-sm">
                                        <div className="border-b border-[#FAF5EF] pb-3">
                                            <h3 className="text-xs font-bold uppercase tracking-wider text-[#18080A]">
                                                Pixels Publicitaires (Optionnel pour Facebook & TikTok Ads)
                                            </h3>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-xs font-bold text-[#18080A] mb-1">
                                                    Meta (Facebook) Pixel ID
                                                </label>
                                                <input
                                                    type="text"
                                                    value={currentLP.facebookPixelId || ''}
                                                    onChange={(e) => setCurrentLP({ ...currentLP, facebookPixelId: e.target.value })}
                                                    placeholder="Ex: 123456789012345"
                                                    className="w-full p-2.5 bg-[#FAF5EF]/50 border border-[#EFE4D8] rounded-xl text-xs font-mono focus:outline-none"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-xs font-bold text-[#18080A] mb-1">
                                                    TikTok Pixel ID
                                                </label>
                                                <input
                                                    type="text"
                                                    value={currentLP.tiktokPixelId || ''}
                                                    onChange={(e) => setCurrentLP({ ...currentLP, tiktokPixelId: e.target.value })}
                                                    placeholder="Ex: C8XXXXXXX"
                                                    className="w-full p-2.5 bg-[#FAF5EF]/50 border border-[#EFE4D8] rounded-xl text-xs font-mono focus:outline-none"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            )}

                        </div>

                        {/* PIED DE PAGE FIXE (STICKY FOOTER AVEC BOUTON ENREGISTRER) */}
                        <div className="border-t border-[#EFE4D8] bg-[#FAF5EF] px-6 py-4 flex items-center justify-between gap-4 shrink-0">
                            <button
                                type="button"
                                onClick={() => { setIsEditing(false); setCurrentLP(null); }}
                                className="px-4 py-2 border border-[#EFE4D8] bg-white hover:bg-[#FAF5EF] text-[#7A5459] rounded-xl text-xs font-bold transition-colors"
                            >
                                Annuler
                            </button>

                            <button
                                type="button"
                                onClick={handleSaveCurrentLP}
                                disabled={saving}
                                className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#B8935A] hover:bg-[#D4AF7A] text-[#18080A] text-xs font-black rounded-xl shadow-md transition-all active:scale-95 disabled:opacity-50"
                            >
                                <Save size={15} />
                                <span>{saving ? 'Enregistrement en cours...' : 'Enregistrer les modifications'}</span>
                            </button>
                        </div>

                    </div>
                </div>
            )}

        </div>
    );
}
