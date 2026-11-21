'use client';

import { useState, useEffect, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { 
    User, 
    Phone, 
    MapPin, 
    Building2, 
    Home, 
    Truck, 
    ShieldCheck, 
    ChevronDown, 
    Package, 
    Sparkles, 
    CheckCircle2,
    Lock
} from 'lucide-react';
import { useSettings } from '@/lib/hooks/useSettings';
import { SHIPPING_RATES } from '@/lib/constants/shipping';
import { DEFAULT_LANDING_PAGES, ALGERIA_COMMUNES } from '@/lib/constants/landing-pages';
import { LandingPageData, LandingPageVariant } from '@/types/landing-page';

export default function PublicLandingPage() {
    const params = useParams();
    const router = useRouter();
    const slug = params?.slug as string;
    const { settings, loading: settingsLoading } = useSettings();

    // Trouver la landing page correspondante
    const landingPage: LandingPageData = useMemo(() => {
        const pages = settings?.landingPages && Array.isArray(settings.landingPages) && settings.landingPages.length > 0
            ? settings.landingPages
            : DEFAULT_LANDING_PAGES;
        
        const found = pages.find((p: any) => p.slug === slug || p.id === slug);
        return found || pages[0] || DEFAULT_LANDING_PAGES[0];
    }, [settings, slug]);

    // États de la page
    const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);
    const [selectedVariant, setSelectedVariant] = useState<LandingPageVariant | null>(null);
    const [isAccordionOpen, setIsAccordionOpen] = useState(false);
    const [openFaqId, setOpenFaqId] = useState<string | null>(null);

    // Formulaire de commande
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [wilayaId, setWilayaId] = useState('16'); // Alger par défaut
    const [commune, setCommune] = useState('');
    const [deliveryType, setDeliveryType] = useState<'home' | 'desk'>('home');
    const [submitting, setSubmitting] = useState(false);
    const [orderSuccess, setOrderSuccess] = useState<any | null>(null);


    // Initialiser la première variante si existante
    useEffect(() => {
        if (landingPage.hasVariants && landingPage.variants && landingPage.variants.length > 0) {
            setSelectedVariant(landingPage.variants[0]);
        } else {
            setSelectedVariant(null);
        }
    }, [landingPage]);

    // Initialiser la première commune de la wilaya sélectionnée
    const paddedWilayaId = String(wilayaId).padStart(2, '0');
    const communesList = useMemo(() => {
        return ALGERIA_COMMUNES[paddedWilayaId] || ALGERIA_COMMUNES[wilayaId] || ['البلدية المركزية (Chef-lieu)'];
    }, [wilayaId, paddedWilayaId]);

    useEffect(() => {
        if (communesList && communesList.length > 0) {
            setCommune(communesList[0]);
        }
    }, [communesList]);

    // Calcul de la livraison dynamique sur les 58 wilayas
    const activeRates = (settings?.shippingFees && Array.isArray(settings.shippingFees) && settings.shippingFees.length > 0)
        ? settings.shippingFees
        : SHIPPING_RATES;

    const currentWilayaRate = activeRates.find((w: any) => String(w.id) === String(wilayaId) || String(w.id) === paddedWilayaId) 
        || activeRates[15] 
        || { homeFee: 500, deskFee: 350, homeRate: 500, deskRate: 350, name: 'Alger' };
    
    // Tarifs exacts et totaux
    const homeShippingFee = Number(currentWilayaRate.homeRate ?? currentWilayaRate.homeFee ?? 500);
    const deskShippingFee = Number(currentWilayaRate.deskRate ?? currentWilayaRate.deskFee ?? 350);
    const shippingCost = deliveryType === 'home' ? homeShippingFee : deskShippingFee;

    const productPrice = selectedVariant?.price 
        ? Number(selectedVariant.price) 
        : Number(landingPage.price || 15000);

    const totalAmount = productPrice + shippingCost;

    // Intégration et Initialisation du Pixel Meta (Facebook) et TikTok
    useEffect(() => {
        const fbPixelId = landingPage.facebookPixelId?.trim() || '1702992101434180';
        if (fbPixelId && typeof window !== 'undefined') {
            if (!(window as any).fbq) {
                (function (f: any, b: any, e: any, v: any, n?: any, t?: any, s?: any) {
                    if (f.fbq) return;
                    n = f.fbq = function () {
                        n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
                    };
                    if (!f._fbq) f._fbq = n;
                    n.push = n;
                    n.loaded = !0;
                    n.version = '2.0';
                    n.queue = [];
                    t = b.createElement(e);
                    t.async = !0;
                    t.src = v;
                    s = b.getElementsByTagName(e)[0];
                    s.parentNode?.insertBefore(t, s);
                })(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
            }

            try {
                (window as any).fbq('init', fbPixelId);
                (window as any).fbq('track', 'PageView');
                (window as any).fbq('track', 'ViewContent', {
                    content_name: landingPage.title,
                    value: productPrice,
                    currency: 'DZD'
                });
            } catch (e) {
                console.warn('[Meta Pixel] Init error:', e);
            }
        }
    }, [landingPage.facebookPixelId, landingPage.title, productPrice]);

    // Photo actuelle
    const currentPhoto = landingPage.photos && landingPage.photos.length > 0
        ? landingPage.photos[selectedPhotoIndex] || landingPage.photos[0]
        : 'https://meeynailshop-api.onrender.com/uploads/5e609930-a3fd-4f94-be37-656f526546c8.webp';

    // Soumission de commande directe
    const handleSubmitOrder = async (e: React.FormEvent) => {
        e.preventDefault();

        const cleanPhone = phone.trim().replace(/\s+/g, '');
        if (!cleanPhone) {
            toast.error('يرجى إدخال رقم الهاتف');
            return;
        }

        const customerName = name.trim() || 'Selma';
        const mappedDeliveryType: 'home' | 'office' = deliveryType === 'desk' ? 'office' : 'home';

        setSubmitting(true);
        try {
            const payload = {
                customerName: customerName,
                customerPhone: cleanPhone,
                shippingAddress: {
                    wilayaId: Number(wilayaId),
                    wilayaName: currentWilayaRate.name || 'Wilaya ' + wilayaId,
                    commune: commune.trim() || 'البلدية المركزية',
                    deliveryType: mappedDeliveryType,
                    fullAddress: `${currentWilayaRate.name} — ${commune.trim() || 'المركز'} (${deliveryType === 'home' ? 'توصيل للدار' : 'استلام من المكتب'})`
                },
                items: [
                    {
                        title: landingPage.title,
                        variantName: selectedVariant?.name || null,
                        price: productPrice,
                        quantity: 1,
                        image: currentPhoto
                    }
                ],
                productPrice: productPrice,
                shippingCost: shippingCost,
                totalAmount: totalAmount,
                landingPageSlug: landingPage.slug,
                landingPageTitle: landingPage.title,
                source: 'instagram'
            };

            let orderData: any = null;

            // 1. Essayer la route dédiée /api/orders/landing-page
            try {
                const res = await fetch('/api/orders/landing-page', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });

                if (res.ok) {
                    const data = await res.json();
                    if (data.success && data.data) {
                        orderData = data.data;
                    }
                }
            } catch (err) {
                console.warn('[LandingPage] /api/orders/landing-page call failed, trying direct store order API', err);
            }

            // 2. Si non réussi via /api/orders/landing-page, repli direct sur /api/orders
            if (!orderData) {
                const { ordersApi } = await import('@/lib/api/orders');
                const directRes = await ordersApi.createOrder({
                    deliveryType: mappedDeliveryType,
                    paymentMethod: 'cash_on_delivery',
                    source: 'instagram',
                    shippingCost: shippingCost,
                    notes: `[Commande Landing Page: /lp/${landingPage.slug}] - ${landingPage.title} ${selectedVariant ? `(Formule: ${selectedVariant.name})` : ''}`,
                    shippingAddress: {
                        fullName: customerName,
                        firstName: customerName.split(/\s+/)[0] || customerName,
                        lastName: customerName.split(/\s+/).slice(1).join(' ') || '',
                        phone: cleanPhone,
                        wilaya: currentWilayaRate.name || 'Wilaya ' + wilayaId,
                        commune: commune.trim() || 'البلدية المركزية',
                        address: `${currentWilayaRate.name} — ${commune.trim() || 'المركز'} (${deliveryType === 'home' ? 'توصيل للدار' : 'استلام من المكتب'})`,
                        deliveryType: mappedDeliveryType,
                    },
                    items: [
                        {
                            productName: `${landingPage.title}${selectedVariant ? ` (${selectedVariant.name})` : ''}`,
                            productImage: currentPhoto,
                            unitPrice: productPrice,
                            quantity: 1,
                            variantSku: `LP-${landingPage.slug.toUpperCase()}`,
                        }
                    ]
                });

                if (directRes && (directRes as any).success && (directRes as any).data) {
                    orderData = (directRes as any).data;
                } else if ((directRes as any)?.id || (directRes as any)?.orderNumber) {
                    orderData = directRes;
                }
            }

            if (!orderData) {
                throw new Error('Erreur de transmission au serveur');
            }

            // Commande confirmée et enregistrée en base de données
            setOrderSuccess({
                orderId: orderData?.id,
                ref: orderData?.orderNumber || 'MEEY-' + Math.floor(100000 + Math.random() * 900000),
                total: totalAmount,
                name: customerName,
                phone: cleanPhone,
                wilayaName: currentWilayaRate.name,
                commune: commune.trim(),
                delType: deliveryType === 'home' ? 'توصيل للدار (Domicile)' : 'استلام من المكتب (Bureau)',
                productTitle: landingPage.title,
                variantName: selectedVariant?.name,
                shippingCost: shippingCost
            });

            // Tracking des conversions Meta Pixel & TikTok Pixel
            try {
                if (typeof window !== 'undefined') {
                    if ((window as any).fbq) {
                        (window as any).fbq('track', 'Purchase', {
                            content_name: landingPage.title,
                            value: totalAmount,
                            currency: 'DZD',
                            num_items: 1,
                            order_id: orderData?.orderNumber || orderData?.id
                        });
                        (window as any).fbq('track', 'Lead', {
                            content_name: landingPage.title,
                            value: totalAmount,
                            currency: 'DZD'
                        });
                        (window as any).fbq('track', 'SubmitApplication', {
                            content_name: landingPage.title,
                            value: totalAmount,
                            currency: 'DZD'
                        });
                    }
                    if ((window as any).ttq) {
                        (window as any).ttq.track('PlaceAnOrder', {
                            content_name: landingPage.title,
                            value: totalAmount,
                            currency: 'DZD'
                        });
                    }
                }
            } catch (trackErr) {
                console.warn('[Pixel Tracking] Error firing purchase event:', trackErr);
            }

            toast.success('🎉 تم تسجيل طلبكِ بنجاح ! سيتصل بكِ فريق العمل لتأكيد الإرسال.');
        } catch (error: any) {
            console.error('Landing page order error:', error);
            toast.error('تعذر تسجيل الطلب، يرجى إعادة المحاولة أو التواصل معنا مباشرة عبر إنستغرام.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div 
            className="min-h-screen pb-20 font-sans antialiased text-[#18080A]"
            style={{ 
                backgroundColor: landingPage.backgroundColor || '#FAF9F6',
                color: landingPage.textColor || '#18080A'
            }}
            dir="rtl"
        >
            {/* Typographie Haute Parfumerie & Beauté Pure */}
            <style jsx global>{`
                @import url('https://fonts.googleapis.com/css2?family=Alexandria:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,500;0,600;1,400&family=Italiana&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
                
                body {
                    font-family: 'Alexandria', -apple-system, BlinkMacSystemFont, sans-serif !important;
                }

                .font-italiana {
                    font-family: 'Italiana', serif !important;
                }

                .font-playfair {
                    font-family: 'Playfair Display', serif !important;
                }

                .num, [data-num] {
                    font-family: 'Plus Jakarta Sans', sans-serif !important;
                    direction: ltr !important;
                    unicode-bidi: isolate !important;
                    font-variant-numeric: tabular-nums;
                }
            `}</style>

            {/* ======================================================== */}
            {/* BARRE DE MARQUE MINIMALISTE & ÉLÉGANTE                   */}
            {/* ======================================================== */}
            {landingPage.showBrandHeader !== false && (
                <header className="w-full py-3 sm:py-4 border-b border-[#F0ECE6]/80 bg-white/80 backdrop-blur-md sticky top-0 z-30 transition-all">
                    <div className="max-w-xl mx-auto px-4 flex items-center justify-between">
                        <div className="flex items-center">
                            {landingPage.logoUrl ? (
                                <img 
                                    src={landingPage.logoUrl} 
                                    alt={landingPage.brandName || 'MEEY'} 
                                    className="h-7 sm:h-8 w-auto object-contain transition-transform hover:scale-105"
                                />
                            ) : (
                                <span 
                                    className="font-italiana tracking-[0.25em] text-xl sm:text-2xl uppercase leading-none font-medium"
                                    style={{ color: landingPage.primaryColor || '#390102' }}
                                >
                                    {landingPage.brandName || 'MEEY'}
                                </span>
                            )}
                        </div>

                        {/* Bouton direct Instagram épuré */}
                        <a 
                            href={`${landingPage.instagramUrl || 'https://ig.me/m/meeynailshop'}?text=${encodeURIComponent(landingPage.instagramMessage || 'السلام عليكم، حبيت نستفسر ونعرف معلومات أكثر على هذا الباك')}`}
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FAF9F6] hover:bg-[#F3EAE0] border border-[#EFECE6] text-xs font-medium text-[#390102] transition-colors"
                            title="تحدثي معنا على إنستغرام"
                        >
                            <svg className="w-3.5 h-3.5 text-[#D6249F] fill-current" viewBox="0 0 24 24">
                                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                            </svg>
                            <span>إنستغرام</span>
                        </a>
                    </div>
                </header>
            )}

            {/* CONTENEUR PRINCIPAL RESPIRANT */}
            <main className="max-w-xl mx-auto px-4 pt-5 sm:pt-7 pb-12">
                
                {/* ======================================================== */}
                {/* HERO : TITRE ÉPURÉ & SANS BRUIT                          */}
                {/* ======================================================== */}
                <div className="text-center mb-5 px-2">
                    <h1 
                        className="text-xl sm:text-2xl font-medium tracking-wide leading-snug font-serif"
                        style={{ color: landingPage.primaryColor || '#390102' }}
                    >
                        {landingPage.title}
                    </h1>

                    {landingPage.subtitle && (
                        <p className="text-xs text-[#7A5459] mt-2 max-w-md mx-auto leading-relaxed font-light opacity-85">
                            {landingPage.subtitle}
                        </p>
                    )}
                </div>

                {/* ======================================================== */}
                {/* CARTE PRODUIT : PHOTO PURE & SOUS-PHOTOS PLEINE LARGEUR */}
                {/* ======================================================== */}
                <article className="bg-white border border-[#F0ECE6] rounded-2xl sm:rounded-3xl overflow-hidden shadow-[0_2px_16px_rgba(0,0,0,0.02)]">
                    
                    {/* Photo Principale Épurée (Sans Stickers) */}
                    <div className="w-full bg-[#FAF9F6]">
                        <div className="w-full aspect-[4/3] sm:aspect-[16/11] overflow-hidden bg-[#FAF9F6] relative">
                            <img 
                                src={currentPhoto} 
                                alt={landingPage.title}
                                className="w-full h-full object-cover transition-opacity duration-300"
                            />
                        </div>

                        {/* Sous-photos en pleine largeur bien structurées */}
                        {landingPage.photos && landingPage.photos.length > 1 && (
                            <div className="p-2.5 sm:p-3 bg-white border-t border-[#F0ECE6]">
                                <div 
                                    className="grid gap-2 sm:gap-2.5 w-full"
                                    style={{ gridTemplateColumns: `repeat(${landingPage.photos.length}, minmax(0, 1fr))` }}
                                >
                                    {landingPage.photos.map((p, idx) => (
                                        <button
                                            key={idx}
                                            type="button"
                                            onClick={() => setSelectedPhotoIndex(idx)}
                                            className={`relative w-full aspect-[4/3] rounded-xl sm:rounded-2xl overflow-hidden border transition-all cursor-pointer focus:outline-none ${
                                                selectedPhotoIndex === idx
                                                    ? 'border-[#390102] ring-2 ring-[#390102]/20'
                                                    : 'border-[#F0ECE6] opacity-60 hover:opacity-100 hover:border-[#BFA893]'
                                            }`}
                                        >
                                            <img 
                                                src={p} 
                                                alt={`Photo ${idx + 1}`} 
                                                className="w-full h-full object-cover transition-transform duration-300 hover:scale-105" 
                                            />
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Détails & Formulaire */}
                    <div className="p-4 sm:p-6 space-y-4">
                        
                        {/* ==================================================== */}
                        {/* BLOC PRIX & RÉASSURANCE MINIMALISTE                  */}
                        {/* ==================================================== */}
                        <div className="bg-[#FAF9F6] border border-[#F0ECE6] rounded-2xl p-4 sm:p-5 flex items-center justify-between shadow-xs">
                            <div className="text-right">
                                <span className="text-[11px] text-[#7A5459] font-medium block mb-0.5">
                                    {landingPage.priceBadgeText || `سعر الباك الكامل (${landingPage.items?.length || 0} عنصر)`}
                                </span>
                                <div className="flex items-baseline gap-1.5" dir="ltr">
                                    <span 
                                        className="text-2xl sm:text-3xl font-extrabold tracking-tight num font-serif" 
                                        style={{ color: landingPage.primaryColor || '#390102' }}
                                    >
                                        {productPrice.toLocaleString('fr-DZ')}
                                    </span>
                                    <span className="text-xs font-bold text-[#7A5459]">
                                        {landingPage.currency || 'DA'}
                                    </span>
                                    {landingPage.compareAtPrice && landingPage.compareAtPrice > productPrice && (
                                        <span className="text-xs text-gray-400 line-through ml-2 font-normal num">
                                            {landingPage.compareAtPrice.toLocaleString('fr-DZ')} {landingPage.currency || 'DA'}
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div className="flex flex-col items-end gap-1 text-right">
                                <span className="text-xs font-semibold text-emerald-800">
                                    الدفع عند الاستلام
                                </span>
                                <span className="text-[11px] text-[#7A5459]">
                                    {landingPage.deliveryBadgeText || 'توصيل متوفر لـ 58 ولاية'}
                                </span>
                            </div>
                        </div>

                        {/* Sélecteur de formules si activé */}
                        {landingPage.hasVariants && landingPage.variants && landingPage.variants.length > 0 && (
                            <div className="py-2 space-y-2">
                                <label className="block text-xs font-bold" style={{ color: landingPage.primaryColor }}>
                                    {landingPage.variantsTitle || 'اختاري الصيغة المناسبة لكِ :'}
                                </label>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                    {landingPage.variants.map((v) => {
                                        const isSel = selectedVariant?.id === v.id;
                                        return (
                                            <button
                                                key={v.id}
                                                type="button"
                                                onClick={() => setSelectedVariant(v)}
                                                className="p-3 text-right border rounded-xl transition-all flex items-center justify-between text-xs"
                                                style={{
                                                    borderColor: isSel ? landingPage.primaryColor : '#F0ECE6',
                                                    backgroundColor: isSel ? `${landingPage.primaryColor}08` : 'white'
                                                }}
                                            >
                                                <div>
                                                    <div className="font-bold" style={{ color: isSel ? landingPage.primaryColor : '#18080A' }}>
                                                        {v.name}
                                                    </div>
                                                    {v.description && (
                                                        <div className="text-[10px] text-gray-500 mt-0.5">{v.description}</div>
                                                    )}
                                                </div>
                                                <div className="font-bold font-mono" style={{ color: landingPage.primaryColor }}>
                                                    {v.price ? `${v.price.toLocaleString('fr-DZ')} ${landingPage.currency || 'DA'}` : ''}
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* ==================================================== */}
                        {/* BOUTON-CARTE INTERACTIF POUR L'ACCORDÉON DU PACK     */}
                        {/* ==================================================== */}
                        {landingPage.items && landingPage.items.length > 0 && (
                            <div className="pt-1">
                                <button
                                    type="button"
                                    onClick={() => setIsAccordionOpen(!isAccordionOpen)}
                                    className="w-full bg-[#FAF9F6] hover:bg-[#F3EAE0]/50 border border-[#EFECE6] rounded-2xl p-3 sm:p-3.5 flex items-center justify-between transition-all group shadow-sm active:scale-[0.99]"
                                >
                                    <div className="flex items-center gap-3">
                                        <span className="w-8 h-8 rounded-xl bg-[#390102] text-[#BFA893] flex items-center justify-center font-bold text-xs shrink-0 shadow-sm">
                                            {landingPage.items?.length || 17}
                                        </span>
                                        <div className="text-right">
                                            <span className="text-xs font-bold text-[#18080A] block">
                                                {landingPage.accordionTitle || `المكونات الأساسية للباك (${landingPage.items?.length || 17} عنصر بالتفصيل)`}
                                            </span>
                                            <span className="text-[10px] text-[#7A5459] font-light">
                                                اضغطي هنا لمعاينة جميع الأدوات والمواد
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[#EFECE6] rounded-xl text-xs font-bold text-[#390102] group-hover:border-[#390102]/30 transition-all shadow-sm">
                                        <span>{isAccordionOpen ? 'إخفاء' : 'عرض التفاصيل'}</span>
                                        <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${isAccordionOpen ? 'rotate-180' : ''}`} />
                                    </div>
                                </button>

                                {isAccordionOpen && (
                                    <div className="mt-2.5 bg-[#FAF9F6] border border-[#EFECE6] rounded-2xl p-3 sm:p-4 divide-y divide-[#EFECE6] text-xs animate-in fade-in slide-in-from-top-2 duration-200">
                                        {landingPage.items.map((it, idx) => (
                                            <div key={it.id || idx} className="py-2.5 flex items-start gap-2.5">
                                                <span 
                                                    className="text-[11px] font-bold mt-0.5 shrink-0 num text-[#BFA893]"
                                                >
                                                    {String(idx + 1).padStart(2, '0')}
                                                </span>
                                                <div className="flex-1">
                                                    <div 
                                                        className="font-semibold text-xs tracking-wide"
                                                        style={{ color: landingPage.primaryColor }}
                                                    >
                                                        {it.nameFr}
                                                    </div>
                                                    <div className="text-[11px] text-[#7A5459] mt-0.5 leading-relaxed font-light">
                                                        {it.descDz}
                                                    </div>
                                                </div>
                                                {it.quantity && it.quantity > 1 && (
                                                    <span className="text-[10px] bg-white px-2 py-0.5 rounded-full border border-[#EFECE6] text-[#390102] font-bold num">
                                                        x{it.quantity}
                                                    </span>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* ==================================================== */}
                        {/* FORMULAIRE DE COMMANDE ULTRA-RAPIDE & ÉPURÉ          */}
                        {/* ==================================================== */}
                        <section id="order-section" className="pt-3">
                            <div className="bg-[#FAF9F6] border border-[#EFECE6] rounded-2xl p-4 sm:p-5 space-y-4 shadow-sm">
                                
                                {/* En-tête de l'encart formulaire épuré */}
                                <div className="text-right pb-2.5 border-b border-[#EFECE6] flex items-center justify-between">
                                    <h2 className="text-base sm:text-lg font-bold" style={{ color: landingPage.primaryColor || '#390102' }}>
                                        املئي معلوماتك
                                    </h2>
                                    <span className="inline-flex items-center gap-1 text-[10px] text-emerald-700 font-medium bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                                        <Lock size={11} />
                                        <span>طلب سريع بدون بطاقة بنكية</span>
                                    </span>
                                </div>

                                <form onSubmit={handleSubmitOrder} className="space-y-3.5">
                                    
                                    {/* Nom et prénom */}
                                    <div>
                                        <label className="block text-xs font-semibold text-[#18080A] mb-1.5 text-right">
                                            {landingPage.nameLabel || 'الاسم واللقب الكامل'}
                                        </label>
                                        <input 
                                            type="text" 
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            placeholder="Selma" 
                                            className="w-full px-3.5 py-3 bg-white border border-[#EFECE6] text-xs focus:outline-none rounded-xl focus:border-[#390102] focus:ring-2 focus:ring-[#390102]/10 transition-all placeholder:text-gray-400 text-right"
                                        />
                                    </div>

                                    {/* Téléphone */}
                                    <div>
                                        <label className="block text-xs font-semibold text-[#18080A] mb-1.5 text-right">
                                            {landingPage.phoneLabel || 'رقم الهاتف'}
                                        </label>
                                        <input 
                                            type="tel" 
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value)}
                                            placeholder="0555514785" 
                                            className="w-full px-3.5 py-3 bg-white border border-[#EFECE6] text-xs font-bold num tracking-wider focus:outline-none rounded-xl focus:border-[#390102] focus:ring-2 focus:ring-[#390102]/10 transition-all placeholder:text-gray-400 placeholder:font-normal placeholder:tracking-normal text-right"
                                        />
                                    </div>

                                    {/* WILAYA & COMMUNE */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        <div>
                                            <label className="block text-xs font-semibold text-[#18080A] mb-1.5 text-right">
                                                {landingPage.wilayaLabel || 'الولاية'}
                                            </label>
                                            <div className="relative">
                                                <select 
                                                    value={wilayaId}
                                                    onChange={(e) => setWilayaId(e.target.value)}
                                                    className="w-full pr-10 pl-8 py-3 bg-white border border-[#EFECE6] text-xs focus:outline-none rounded-xl focus:border-[#390102] focus:ring-2 focus:ring-[#390102]/10 cursor-pointer transition-all appearance-none text-[#18080A] font-medium text-right"
                                                >
                                                    {activeRates.map((w: any) => (
                                                        <option key={w.id} value={w.id}>
                                                            {w.id} - {w.name}
                                                        </option>
                                                    ))}
                                                </select>
                                                <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#BFA893] pointer-events-none">
                                                    <MapPin size={15} />
                                                </div>
                                                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7A5459] pointer-events-none">
                                                    <ChevronDown size={14} />
                                                </div>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-xs font-semibold text-[#18080A] mb-1.5 text-right">
                                                {landingPage.communeLabel || 'البلدية'}
                                            </label>
                                            <div className="relative">
                                                <select 
                                                    value={commune}
                                                    onChange={(e) => setCommune(e.target.value)}
                                                    className="w-full pr-10 pl-8 py-3 bg-white border border-[#EFECE6] text-xs focus:outline-none rounded-xl focus:border-[#390102] focus:ring-2 focus:ring-[#390102]/10 cursor-pointer transition-all appearance-none text-[#18080A] font-medium text-right"
                                                >
                                                    {communesList.map((c: string) => (
                                                        <option key={c} value={c}>{c}</option>
                                                    ))}
                                                </select>
                                                <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#BFA893] pointer-events-none">
                                                    <Building2 size={15} />
                                                </div>
                                                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7A5459] pointer-events-none">
                                                    <ChevronDown size={14} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Mode de livraison avec cartes interactives et tarifs exacts */}
                                    <div className="pt-1">
                                        <label className="block text-xs font-semibold text-[#18080A] mb-2">
                                            {landingPage.deliveryTypeLabel || 'طريقة التوصيل المفضلة'}
                                        </label>
                                        <div className="grid grid-cols-2 gap-2.5">
                                            <button
                                                type="button"
                                                onClick={() => setDeliveryType('home')}
                                                className={`p-3 rounded-xl border text-right transition-all flex flex-col justify-between gap-1.5 cursor-pointer ${
                                                    deliveryType === 'home'
                                                        ? 'border-[#390102] bg-white ring-2 ring-[#390102]/10 shadow-sm'
                                                        : 'border-[#EFECE6] bg-white/60 hover:bg-white'
                                                }`}
                                            >
                                                <div className="flex items-center justify-between w-full">
                                                    <div className="flex items-center gap-1.5 text-xs font-bold" style={{ color: landingPage.primaryColor }}>
                                                        <Home size={14} />
                                                        <span>{landingPage.homeDeliveryLabel || 'توصيل للدار'}</span>
                                                    </div>
                                                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center text-[10px] ${
                                                        deliveryType === 'home' ? 'bg-[#390102] text-white border-[#390102]' : 'border-gray-300'
                                                    }`}>
                                                        {deliveryType === 'home' && '✓'}
                                                    </div>
                                                </div>
                                                <span className="text-[11px] font-bold num text-[#7A5459]">
                                                    +{homeShippingFee} DA
                                                </span>
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() => setDeliveryType('desk')}
                                                className={`p-3 rounded-xl border text-right transition-all flex flex-col justify-between gap-1.5 cursor-pointer ${
                                                    deliveryType === 'desk'
                                                        ? 'border-[#390102] bg-white ring-2 ring-[#390102]/10 shadow-sm'
                                                        : 'border-[#EFECE6] bg-white/60 hover:bg-white'
                                                }`}
                                            >
                                                <div className="flex items-center justify-between w-full">
                                                    <div className="flex items-center gap-1.5 text-xs font-bold" style={{ color: landingPage.primaryColor }}>
                                                        <Truck size={14} />
                                                        <span>{landingPage.deskDeliveryLabel || 'استلام من المكتب'}</span>
                                                    </div>
                                                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center text-[10px] ${
                                                        deliveryType === 'desk' ? 'bg-[#390102] text-white border-[#390102]' : 'border-gray-300'
                                                    }`}>
                                                        {deliveryType === 'desk' && '✓'}
                                                    </div>
                                                </div>
                                                <span className="text-[11px] font-bold num text-[#7A5459]">
                                                    +{deskShippingFee} DA
                                                </span>
                                            </button>
                                        </div>
                                    </div>

                                    {/* Récapitulatif épuré & Transparent */}
                                    <div className="mt-3.5 p-3.5 bg-white border border-[#EFECE6] rounded-xl space-y-1.5 text-xs shadow-sm">
                                        <div className="flex justify-between text-[#7A5459]">
                                            <span>{landingPage.summaryProductLabel || 'سعر الباك :'}</span>
                                            <span className="font-semibold num text-[#18080A]">{productPrice.toLocaleString('fr-DZ')} {landingPage.currency || 'DA'}</span>
                                        </div>
                                        <div className="flex justify-between text-[#7A5459]">
                                            <span>{landingPage.summaryShippingLabel || 'سعر التوصيل لولايتك :'}</span>
                                            <span className="font-semibold num text-[#18080A]">{shippingCost.toLocaleString('fr-DZ')} {landingPage.currency || 'DA'}</span>
                                        </div>
                                        <div className="border-t border-dashed border-[#EFECE6] my-1 pt-1.5 flex justify-between items-baseline font-bold" style={{ color: landingPage.primaryColor }}>
                                            <span className="text-xs">{landingPage.summaryTotalLabel || 'المجموع الكلي عند الاستلام :'}</span>
                                            <div className="flex items-baseline gap-1" dir="ltr">
                                                <span className="text-base sm:text-lg font-black num">{totalAmount.toLocaleString('fr-DZ')}</span>
                                                <span className="text-xs font-bold">{landingPage.currency || 'DA'}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Bouton de confirmation irrésistible */}
                                    <button 
                                        type="submit" 
                                        disabled={submitting}
                                        className="w-full py-4 px-6 text-[#FAF5EF] text-sm font-bold tracking-wide active:scale-[0.98] transition-all cursor-pointer shadow-md rounded-2xl disabled:opacity-50 hover:opacity-95 flex flex-col items-center justify-center gap-0.5 mt-2"
                                        style={{ backgroundColor: landingPage.primaryColor || '#390102' }}
                                    >
                                        <span className="flex items-center gap-2">
                                            <span>{submitting ? (landingPage.submittingText || 'جاري تسجيل طلبكِ...') : 'تأكيد الطلب الآن'}</span>
                                            {!submitting && (
                                                <span className="num font-extrabold text-white text-base">
                                                    ({totalAmount.toLocaleString('fr-DZ')} {landingPage.currency || 'DA'})
                                                </span>
                                            )}
                                        </span>
                                        <span className="text-[10px] text-[#BFA893] font-normal">
                                            الدفع يداً بيد عند الاستلام كاش
                                        </span>
                                    </button>

                                    {/* Réassurance discrète & Puce Garantie */}
                                    <div className="flex items-center justify-center gap-2 pt-2 text-[#7A5459] text-[11px] leading-relaxed">
                                        <ShieldCheck size={16} className="text-[#B8935A] shrink-0" />
                                        <span>{landingPage.guaranteeText || 'الدفع يداً بيد عند الاستلام. تقدري تفتحي الطرد وتعايني سلعتك قبل ما تخلصي.'}</span>
                                    </div>

                                </form>
                            </div>
                        </section>

                    </div>
                </article>

                {/* ======================================================== */}
                {/* SECTION AVANTAGES / POINTS FORTS                         */}
                {/* ======================================================== */}
                {landingPage.showBenefits !== false && landingPage.benefits && landingPage.benefits.length > 0 && (
                    <section className="mt-5 bg-white border border-[#F0ECE6] rounded-2xl p-5 shadow-[0_2px_16px_rgba(0,0,0,0.02)]">
                        <div className="text-right mb-3">
                            <h2 className="text-sm font-bold" style={{ color: landingPage.primaryColor }}>
                                {landingPage.benefitsTitle || 'علاش تختاري هذا الباك المتكامل ؟'}
                            </h2>
                            {landingPage.benefitsSubtitle && (
                                <p className="text-[11px] text-[#7A5459] mt-0.5 font-light">{landingPage.benefitsSubtitle}</p>
                            )}
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                            {landingPage.benefits.map((b, idx) => (
                                <div key={b.id || idx} className="p-3 bg-[#FAF9F6] border border-[#F0ECE6] rounded-xl text-right space-y-1">
                                    <div className="w-5 h-5 rounded-full bg-white border flex items-center justify-center font-bold text-[10px]" style={{ borderColor: landingPage.accentColor, color: landingPage.primaryColor }}>
                                        ✓
                                    </div>
                                    <h3 className="font-bold text-xs pt-0.5" style={{ color: landingPage.primaryColor }}>{b.title}</h3>
                                    <p className="text-[11px] text-[#7A5459] leading-relaxed font-light">{b.description}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* ======================================================== */}
                {/* SECTION VIDÉO DÉMONSTRATION / TUTO                       */}
                {/* ======================================================== */}
                {landingPage.showVideo && landingPage.videoUrl && (
                    <section className="mt-5 bg-white border border-[#F0ECE6] rounded-2xl p-5 shadow-[0_2px_16px_rgba(0,0,0,0.02)] text-right">
                        <h2 className="text-sm font-bold mb-1" style={{ color: landingPage.primaryColor }}>
                            {landingPage.videoTitle || 'فيديو توضيحي لطريقة الاستعمال والنتيجة'}
                        </h2>
                        {landingPage.videoSubtitle && (
                            <p className="text-[11px] text-[#7A5459] mb-3 font-light">{landingPage.videoSubtitle}</p>
                        )}
                        <div className="w-full aspect-video rounded-xl overflow-hidden bg-black/5 border border-[#F0ECE6]">
                            {landingPage.videoUrl.includes('youtube.com') || landingPage.videoUrl.includes('youtu.be') ? (
                                <iframe 
                                    src={landingPage.videoUrl.replace('watch?v=', 'embed/').replace('youtu.be/', 'youtube.com/embed/')} 
                                    className="w-full h-full"
                                    allowFullScreen
                                />
                            ) : (
                                <video src={landingPage.videoUrl} controls className="w-full h-full object-cover" />
                            )}
                        </div>
                    </section>
                )}

                {/* ======================================================== */}
                {/* SECTION AVIS & TÉMOIGNAGES CLIENTES                      */}
                {/* ======================================================== */}
                {landingPage.showReviews !== false && landingPage.reviews && landingPage.reviews.length > 0 && (
                    <section className="mt-5 bg-white border border-[#F0ECE6] rounded-2xl p-5 shadow-[0_2px_16px_rgba(0,0,0,0.02)]">
                        <div className="text-right mb-3">
                            <h2 className="text-sm font-bold" style={{ color: landingPage.primaryColor }}>
                                {landingPage.reviewsTitle || 'آراء زبوناتنا الوفيات'}
                            </h2>
                            {landingPage.reviewsSubtitle && (
                                <p className="text-[11px] text-[#7A5459] mt-0.5 font-light">{landingPage.reviewsSubtitle}</p>
                            )}
                        </div>
                        <div className="space-y-2.5">
                            {landingPage.reviews.map((r, idx) => (
                                <div key={r.id || idx} className="p-3 bg-[#FAF9F6] border border-[#F0ECE6] rounded-xl text-right space-y-1">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-1 text-[#B8935A]">
                                            {[...Array(r.rating || 5)].map((_, i) => (
                                                <svg key={i} className="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20">
                                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                                                </svg>
                                            ))}
                                        </div>
                                        <div className="text-xs font-bold" style={{ color: landingPage.primaryColor }}>
                                            {r.authorName} {r.wilaya ? <span className="opacity-70 font-normal">({r.wilaya})</span> : ''}
                                        </div>
                                    </div>
                                    <p className="text-xs text-[#57393D] leading-relaxed font-light">{r.comment}</p>
                                    {r.date && <div className="text-[10px] text-gray-400 text-left num">{r.date}</div>}
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* ======================================================== */}
                {/* SECTION FOIRE AUX QUESTIONS (FAQ)                        */}
                {/* ======================================================== */}
                {landingPage.showFaq !== false && landingPage.faqs && landingPage.faqs.length > 0 && (
                    <section className="mt-5 bg-white border border-[#F0ECE6] rounded-2xl p-5 shadow-[0_2px_16px_rgba(0,0,0,0.02)]">
                        <div className="text-right mb-3">
                            <h2 className="text-sm font-bold" style={{ color: landingPage.primaryColor }}>
                                {landingPage.faqTitle || 'الأسئلة الأكثر تكراراً (FAQ)'}
                            </h2>
                            {landingPage.faqSubtitle && (
                                <p className="text-[11px] text-[#7A5459] mt-0.5 font-light">{landingPage.faqSubtitle}</p>
                            )}
                        </div>
                        <div className="divide-y divide-[#F0ECE6] text-right">
                            {landingPage.faqs.map((f, idx) => {
                                const isOpen = openFaqId === (f.id || String(idx));
                                return (
                                    <div key={f.id || idx} className="py-2.5">
                                        <button
                                            type="button"
                                            onClick={() => setOpenFaqId(isOpen ? null : (f.id || String(idx)))}
                                            className="w-full flex items-center justify-between text-right font-bold text-xs focus:outline-none"
                                            style={{ color: landingPage.primaryColor }}
                                        >
                                            <span>{f.question}</span>
                                            <span className="text-base font-bold mr-2 text-[#BFA893]">{isOpen ? '−' : '+'}</span>
                                        </button>
                                        {isOpen && (
                                            <p className="text-xs text-[#57393D] mt-2 pr-1 leading-relaxed font-light">
                                                {f.answer}
                                            </p>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </section>
                )}

                {/* ======================================================== */}
                {/* SECTION CONTACT INSTAGRAM (CHAT PRIVÉ DIRECT)            */}
                {/* ======================================================== */}
                {landingPage.showInstagram !== false && landingPage.instagramUrl && (
                    <section className="mt-5 bg-white border border-[#F0ECE6] rounded-2xl p-4 sm:p-5 text-center shadow-[0_2px_16px_rgba(0,0,0,0.02)]">
                        <div className="flex flex-col items-center justify-center gap-2">
                            
                            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#FD5949] via-[#D6249F] to-[#285AEB] flex items-center justify-center text-white shadow-sm hover:scale-105 transition-transform">
                                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                                </svg>
                            </div>

                            <div>
                                <h3 className="text-xs font-bold">
                                    عندك أي سؤال أو استفسار على هذا الباك؟
                                </h3>
                                <p className="text-[11px] text-[#7A5459] mt-0.5 font-light">
                                    تواصلي معنا مباشرة في الشات الخاص على حسابنا في إنستغرام
                                </p>
                            </div>

                            <a 
                                href={`${landingPage.instagramUrl}?text=${encodeURIComponent(landingPage.instagramMessage || 'السلام عليكم، حبيت نستفسر ونعرف معلومات أكثر على هذا الباك')}`}
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="mt-1 inline-flex items-center gap-2 px-4 py-2 bg-[#FAF9F6] hover:bg-[#F3EAE0] border border-[#EFECE6] text-xs font-bold rounded-xl transition-all shadow-sm"
                                style={{ color: landingPage.primaryColor }}
                            >
                                <svg className="w-3.5 h-3.5 text-[#D6249F]" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                                </svg>
                                <span>{landingPage.instagramButtonLabel || `مراسلة في الخاص: « ${landingPage.instagramMessage || 'السلام عليكم، حبيت نستفسر على الباك'} »`}</span>
                            </a>

                        </div>
                    </section>
                )}

                {/* Footer sobre */}
                <footer className="mt-8 text-center text-[11px] text-[#7A5459] font-light">
                    <p>{landingPage.footerText || `© ${landingPage.brandName || 'MEEY NAIL SHOP'}. جميع الحقوق محفوظة.`}</p>
                </footer>

            </main>

            {/* ======================================================== */}
            {/* MODAL PROFESSIONNEL DE CONFIRMATION DE COMMANDE          */}
            {/* ======================================================== */}
            {orderSuccess && (
                <div className="fixed inset-0 z-50 bg-[#18080A]/60 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-white max-w-md w-full p-6 sm:p-7 border border-[#BFA893]/40 rounded-2xl sm:rounded-3xl shadow-2xl text-right animate-in fade-in zoom-in-95 duration-200">
                        
                        <div className="flex items-start justify-between border-b border-[#F0ECE6] pb-3 mb-3.5">
                            <div>
                                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#B8935A] num">
                                    {landingPage.brandName}
                                </span>
                                <h3 className="text-base sm:text-lg font-bold mt-0.5" style={{ color: landingPage.primaryColor }}>
                                    {landingPage.successModalTitle || 'تم تسجيل طلبكِ بنجاح'}
                                </h3>
                            </div>
                            <div 
                                className="w-8 h-8 rounded-full bg-[#FAF9F6] border border-[#BFA893]/40 flex items-center justify-center font-bold text-xs"
                                style={{ color: landingPage.primaryColor }}
                            >
                                ✓
                            </div>
                        </div>

                        <p className="text-xs text-[#7A5459] leading-relaxed mb-4 font-light">
                            {landingPage.successModalMessage || 'تم استلام طلبكِ في نظام المتجر. سيتصل بكِ فريق العمل عبر الهاتف لتأكيد موعد إرسال الطرد إلى عنوانكِ.'}
                        </p>

                        {/* Fiche Récapitulatif Pro */}
                        <div className="p-3.5 bg-[#FAF9F6] border border-[#F0ECE6] rounded-xl text-xs space-y-1.5 mb-4">
                            <div className="flex justify-between pb-1.5 border-b border-[#F0ECE6] text-[11px]">
                                <span className="text-[#7A5459]">رقم مرجع الطلب :</span>
                                <span className="font-mono font-bold num" style={{ color: landingPage.primaryColor }}>
                                    {orderSuccess.ref}
                                </span>
                            </div>
                            <div className="flex justify-between pt-0.5">
                                <span className="text-[#7A5459]">المنتج :</span>
                                <span className="font-semibold text-[#18080A]">
                                    {orderSuccess.productTitle} {orderSuccess.variantName ? `(${orderSuccess.variantName})` : ''}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-[#7A5459]">الزبونة :</span>
                                <span className="font-semibold text-[#18080A]">
                                    {orderSuccess.name} (<span className="num">{orderSuccess.phone}</span>)
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-[#7A5459]">مكان التوصيل :</span>
                                <span className="text-[#18080A]">
                                    {orderSuccess.wilayaName} — {orderSuccess.commune}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-[#7A5459]">نوع التوصيل :</span>
                                <span className="text-[#18080A]">{orderSuccess.delType}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-[#7A5459]">سعر التوصيل :</span>
                                <span className="font-bold num">{orderSuccess.shippingCost.toLocaleString('fr-DZ')} {landingPage.currency || 'DA'}</span>
                            </div>
                            <div className="flex justify-between border-t border-[#B8935A]/30 pt-1.5 font-bold text-xs" style={{ color: landingPage.primaryColor }}>
                                <span>المجموع الإجمالي عند الاستلام :</span> 
                                <span className="num font-bold text-sm">{orderSuccess.total.toLocaleString('fr-DZ')} {landingPage.currency || 'DA'}</span>
                            </div>
                        </div>

                        <button 
                            onClick={() => {
                                setOrderSuccess(null);
                                router.push('/');
                            }}
                            className="w-full py-3 text-white text-xs font-bold uppercase tracking-wider transition-opacity hover:opacity-95 rounded-xl shadow"
                            style={{ backgroundColor: landingPage.primaryColor }}
                        >
                            {landingPage.successModalButtonText || 'الرجوع إلى المتجر'}
                        </button>
                    </div>
                </div>
            )}

            {/* Pixel Tracking (Facebook & TikTok) */}
            {landingPage.facebookPixelId && (
                <script
                    dangerouslySetInnerHTML={{
                        __html: `
                            !function(f,b,e,v,n,t,s)
                            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                            n.queue=[];t=b.createElement(e);t.async=!0;
                            t.src=v;s=b.getElementsByTagName(e)[0];
                            s.parentNode.insertBefore(t,s)}(window, document,'script',
                            'https://connect.facebook.net/en_US/fbevents.js');
                            fbq('init', '${landingPage.facebookPixelId}');
                            fbq('track', 'PageView');
                        `
                    }}
                />
            )}
            {landingPage.tiktokPixelId && (
                <script
                    dangerouslySetInnerHTML={{
                        __html: `
                            !function (w, d, t) {
                                w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e},ttq.load=function(e,n){var i="https://analytics.tiktok.com/i18n/pixel/events.js";ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=i,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};var o=document.createElement("script");o.type="text/javascript",o.async=!0,o.src=i+"?sdkid="+e+"&lib="+t;var a=document.getElementsByTagName("script")[0];a.parentNode.insertBefore(o,a)};
                                ttq.load('${landingPage.tiktokPixelId}');
                                ttq.page();
                            }(window, document, 'ttq');
                        `
                    }}
                />
            )}

            {/* ======================================================== */}
            {/* BOUTON FLOTTANT INSTAGRAM DISCRET (LANDING PAGE)         */}
            {/* ======================================================== */}
            <aside className="fixed bottom-20 right-4 sm:bottom-6 sm:right-6 z-50">
                <a
                    href={`${landingPage.instagramUrl || 'https://ig.me/m/meeynailshop'}?text=${encodeURIComponent(landingPage.instagramMessage || 'السلام عليكم، حبيت نستفسر ونعرف معلومات أكثر على هذا الباك')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-white/90 hover:bg-white border border-[#EFECE6] text-[#390102] shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer text-xs font-medium backdrop-blur-sm"
                    title="تحدثي معنا مباشرة على إنستغرام"
                >
                    <svg className="w-4 h-4 text-[#D6249F] fill-current" viewBox="0 0 24 24">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                    <span>إنستغرام</span>
                </a>
            </aside>

            {/* BARRE FLOTTANTE MOBILE DE COMMANDE RAPIDE (RESPIRANTE & ÉLÉGANTE) */}
            {landingPage.showStickyCta !== false && (
                <aside className="fixed bottom-0 left-0 right-0 z-40 px-4 py-2.5 bg-white/95 backdrop-blur-md border-t border-[#F0ECE6] shadow-[0_-4px_20px_rgba(0,0,0,0.03)] sm:hidden flex items-center justify-between gap-3">
                    <div className="text-right shrink-0">
                        <div className="text-[10px] text-[#7A5459]">المجموع :</div>
                        <div className="text-sm font-bold num" style={{ color: landingPage.primaryColor || '#390102' }}>
                            {productPrice.toLocaleString('fr-DZ')} {landingPage.currency || 'DA'}
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={() => {
                            const el = document.getElementById('order-section');
                            if (el) el.scrollIntoView({ behavior: 'smooth' });
                        }}
                        className="flex-1 py-2.5 px-4 text-white text-xs font-bold rounded-xl shadow-sm transition-all active:scale-95"
                        style={{ backgroundColor: landingPage.primaryColor || '#390102' }}
                    >
                        {landingPage.stickyCtaText || 'اطلبي الآن — الدفع عند الاستلام'}
                    </button>
                </aside>
            )}

        </div>
    );
}
