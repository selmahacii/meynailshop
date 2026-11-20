'use client';

import { useState, useEffect, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'sonner';
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

    // Initialiser la première commune d'Alger
    useEffect(() => {
        const communes = ALGERIA_COMMUNES[wilayaId] || ['البلدية المركزية (Chef-lieu)'];
        if (communes.length > 0) {
            setCommune(communes[0]);
        }
    }, [wilayaId]);

    // Calcul de la livraison dynamique sur les 58 wilayas
    const activeRates = (settings?.shippingFees && Array.isArray(settings.shippingFees) && settings.shippingFees.length > 0)
        ? settings.shippingFees
        : SHIPPING_RATES;

    const wilayaRate = activeRates.find((w: any) => w.id === wilayaId) || activeRates[0];
    const shippingCost = wilayaRate 
        ? (deliveryType === 'home' ? wilayaRate.homeRate : (wilayaRate.deskRate ?? wilayaRate.homeRate))
        : 500;

    const productPrice = selectedVariant?.price !== undefined ? selectedVariant.price : landingPage.price;
    const totalAmount = productPrice + shippingCost;

    // Soumission de la commande
    const handleSubmitOrder = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim() || !phone.trim() || !wilayaId || !commune) {
            toast.error('يرجى ملء جميع الخانات الإلزامية');
            return;
        }

        setSubmitting(true);
        try {
            const { ordersApi } = await import('@/lib/api/orders');

            // Référence de commande par défaut
            let finalOrderRef = 'MEEY-' + Math.floor(1000 + Math.random() * 9000);
            
            // Passer la commande à l'API du magasin
            try {
                const res = await ordersApi.createOrder({
                    shippingAddress: {
                        firstName: name.split(' ')[0] || name,
                        lastName: name.split(' ').slice(1).join(' ') || name,
                        phone: phone.trim(),
                        address: `${commune}, ${wilayaRate?.name || wilayaId}`,
                        wilaya: wilayaRate?.name || wilayaId,
                        commune: commune,
                    },
                    paymentMethod: 'cash_on_delivery',
                    deliveryType: deliveryType === 'home' ? 'home' : 'office',
                    notes: `[Commande Landing Page: /lp/${landingPage.slug}] - ${landingPage.title} ${selectedVariant ? `(Formule: ${selectedVariant.name})` : ''}`,
                    source: 'instagram',
                    items: [
                        {
                            productId: landingPage.productId || undefined,
                            productName: `${landingPage.title}${selectedVariant ? ` (${selectedVariant.name})` : ''}`,
                            productImage: currentPhoto,
                            unitPrice: productPrice,
                            quantity: 1,
                            variantSku: selectedVariant?.sku || `LP-${landingPage.slug.toUpperCase()}`
                        }
                    ]
                });

                if (res?.data?.orderNumber) {
                    finalOrderRef = res.data.orderNumber;
                }

                // Déclencher l'événement pour actualiser immédiatement le tableau de bord admin
                if (typeof window !== 'undefined') {
                    window.dispatchEvent(new Event('orderUpdated'));
                }
            } catch (apiErr) {
                console.warn('Backend order call logged:', apiErr);
            }

            // Afficher le modal reçu professionnel
            setOrderSuccess({
                ref: finalOrderRef,
                name,
                phone,
                wilayaName: wilayaRate?.name || wilayaId,
                commune,
                delType: deliveryType === 'home' ? 'توصيل لباب الدار (Domicile)' : 'استلام من مكتب التوصيل (Bureau)',
                productTitle: landingPage.title,
                variantName: selectedVariant?.name,
                productPrice,
                shippingCost,
                total: totalAmount
            });

            toast.success('تم تسجيل طلبكِ بنجاح ! سنتصل بكِ لتأكيد الإرسال.');
        } catch (err: any) {
            toast.error('حدث خطأ أثناء تسجيل الطلب، يرجى المحاولة ثانية');
        } finally {
            setSubmitting(false);
        }
    };

    const currentPhoto = landingPage.photos[selectedPhotoIndex] || landingPage.photos[0] || 'https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=800&q=80';

    return (
        <div 
            className="min-h-screen pb-16 font-sans antialiased"
            style={{ 
                backgroundColor: landingPage.backgroundColor || '#FAF5EF',
                color: landingPage.textColor || '#18080A'
            }}
            dir="rtl"
        >
            {/* Styles Google Fonts inline pour rapidité maximale */}
            <style jsx global>{`
                @import url('https://fonts.googleapis.com/css2?family=Alexandria:wght@300;400;500;600;700;800;900&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
                
                body {
                    font-family: 'Alexandria', sans-serif !important;
                }

                .num, [data-num] {
                    font-family: 'Plus Jakarta Sans', sans-serif !important;
                    direction: ltr !important;
                    unicode-bidi: isolate !important;
                    font-variant-numeric: tabular-nums;
                }
            `}</style>

            <main className="max-w-xl mx-auto px-4 pt-8 pb-12 sm:pt-12">
                
                {/* ======================================================== */}
                {/* EN-TÊTE AVEC ICÔNE CENTRÉE TOUT EN HAUT                  */}
                {/* ======================================================== */}
                <header className="text-center mb-8">
                    {/* Icône officielle centrée */}
                    <div className="flex justify-center mb-4">
                        <div 
                            className="w-14 h-14 rounded-full bg-white border border-[#EFE4D8] shadow-sm flex items-center justify-center transition-transform hover:scale-105 overflow-hidden"
                            style={{ borderColor: `${landingPage.accentColor}60` }}
                        >
                            {landingPage.logoUrl ? (
                                <img src={landingPage.logoUrl} alt={landingPage.brandName} className="w-full h-full object-cover" />
                            ) : (
                                <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" style={{ color: landingPage.primaryColor }}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 2L14.5 8.5L21 9.5L16 14L17.5 20.5L12 17L6.5 20.5L8 14L3 9.5L9.5 8.5L12 2Z" fill="rgba(184, 147, 90, 0.15)" stroke={landingPage.accentColor}/>
                                    <circle cx="12" cy="12" r="3" fill={landingPage.primaryColor}/>
                                </svg>
                            )}
                        </div>
                    </div>

                    <div 
                        className="text-[11px] uppercase tracking-[0.35em] font-bold mb-2 num"
                        style={{ color: landingPage.accentColor }}
                    >
                        {landingPage.brandName || 'MEEY NAIL SHOP'}
                    </div>

                    <h1 
                        className="text-2xl sm:text-3xl font-extrabold tracking-tight leading-tight"
                        style={{ color: landingPage.primaryColor }}
                    >
                        {landingPage.title}
                    </h1>

                    {landingPage.subtitle && (
                        <p className="text-xs sm:text-sm mt-2.5 max-w-lg mx-auto leading-relaxed opacity-80">
                            {landingPage.subtitle}
                        </p>
                    )}
                </header>

                {/* ======================================================== */}
                {/* CARTE PRODUIT : PHOTO FULL-WIDTH BORD À BORD             */}
                {/* ======================================================== */}
                <article className="bg-white border border-[#EFE4D8] shadow-md rounded-2xl overflow-hidden">
                    
                    {/* Photo Full-Width (sans padding) */}
                    <div className="w-full bg-[#FAF5EF]/40 border-b border-[#EFE4D8]">
                        <div className="w-full aspect-[4/3] sm:aspect-[16/11] overflow-hidden bg-[#FAF5EF] relative">
                            <img 
                                src={currentPhoto} 
                                alt={landingPage.title}
                                className="w-full h-full object-cover transition-opacity duration-300"
                            />
                        </div>

                        {/* Miniatures d'aperçu */}
                        {landingPage.photos.length > 1 && (
                            <div className="flex justify-center items-center gap-3 py-3 px-4 bg-white/70">
                                {landingPage.photos.map((p, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setSelectedPhotoIndex(idx)}
                                        className="w-14 h-14 rounded-lg overflow-hidden border-2 transition-all focus:outline-none"
                                        style={{
                                            borderColor: selectedPhotoIndex === idx ? landingPage.primaryColor : '#EFE4D8',
                                            opacity: selectedPhotoIndex === idx ? 1 : 0.6
                                        }}
                                    >
                                        <img src={p} alt="" className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Détails, Prix & Formulaire */}
                    <div className="p-5 sm:p-7">
                        
                        {/* Prix & Livraison */}
                        <div className="flex items-center justify-between pb-5 border-b border-[#EFE4D8]">
                            <div>
                                <div className="text-[11px] opacity-75 font-medium">
                                    {landingPage.priceBadgeText || `سعر الباك الكامل (${landingPage.items?.length || 0} عنصر متكامل)`}
                                </div>
                                <div className="text-2xl sm:text-3xl font-extrabold mt-0.5" style={{ color: landingPage.primaryColor }}>
                                    <span className="num">{productPrice.toLocaleString('fr-DZ')}</span> <span className="text-sm font-semibold tracking-normal">{landingPage.currency || 'DA'}</span>
                                    {landingPage.compareAtPrice && landingPage.compareAtPrice > productPrice && (
                                        <span className="text-xs text-gray-400 line-through mr-2 font-normal num">
                                            {landingPage.compareAtPrice.toLocaleString('fr-DZ')} {landingPage.currency || 'DA'}
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div className="text-left">
                                <span 
                                    className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#FAF5EF] border rounded-full text-[11px] font-semibold"
                                    style={{ color: landingPage.primaryColor, borderColor: `${landingPage.accentColor}50` }}
                                >
                                    <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: landingPage.accentColor }}></span>
                                    {landingPage.deliveryBadgeText || 'توصيل متوفر لـ 58 ولاية'}
                                </span>
                            </div>
                        </div>

                        {/* SÉLECTEUR DE VARIANTES / FORMULES SI ACTIVÉ */}
                        {landingPage.hasVariants && landingPage.variants && landingPage.variants.length > 0 && (
                            <div className="py-4 border-b border-[#EFE4D8] space-y-2">
                                <label className="block text-xs font-bold" style={{ color: landingPage.primaryColor }}>
                                    {landingPage.variantsTitle || 'اختاري الصيغة أو الباك المناسب لكِ :'}
                                </label>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                                    {landingPage.variants.map((v) => {
                                        const isSel = selectedVariant?.id === v.id;
                                        return (
                                            <button
                                                key={v.id}
                                                type="button"
                                                onClick={() => setSelectedVariant(v)}
                                                className="p-3 text-right border-2 rounded-xl transition-all flex items-center justify-between"
                                                style={{
                                                    borderColor: isSel ? landingPage.primaryColor : '#EFE4D8',
                                                    backgroundColor: isSel ? `${landingPage.primaryColor}08` : 'white'
                                                }}
                                            >
                                                <div>
                                                    <div className="font-bold text-xs" style={{ color: isSel ? landingPage.primaryColor : '#18080A' }}>
                                                        {v.name}
                                                    </div>
                                                    {v.description && (
                                                        <div className="text-[10px] text-gray-500 mt-0.5">{v.description}</div>
                                                    )}
                                                </div>
                                                <div className="text-xs font-bold font-mono" style={{ color: landingPage.primaryColor }}>
                                                    {v.price ? `${v.price.toLocaleString('fr-DZ')} ${landingPage.currency || 'DA'}` : ''}
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* ==================================================== */}
                        {/* SECTION PLIABLE (ACCORDÉON) DES COMPOSANTS           */}
                        {/* ==================================================== */}
                        {landingPage.items && landingPage.items.length > 0 && (
                            <section className="py-4 border-b border-[#EFE4D8]">
                                <button
                                    type="button"
                                    onClick={() => setIsAccordionOpen(!isAccordionOpen)}
                                    className="w-full flex items-center justify-between cursor-pointer group focus:outline-none py-1.5"
                                >
                                    <div className="flex items-center gap-2">
                                        <h2 
                                            className="text-xs font-bold transition-colors"
                                            style={{ color: landingPage.primaryColor }}
                                        >
                                            {landingPage.accordionTitle || `المكونات الأساسية للباك (${landingPage.items.length} عنصر بالتفصيل) :`}
                                        </h2>
                                        <span className="text-[11px] font-bold num" style={{ color: landingPage.accentColor }}>
                                            {landingPage.accordionBadgeText || `${landingPage.items.length} pièces`}
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-1.5 text-xs opacity-75">
                                        <span className="text-[11px] font-semibold">
                                            {isAccordionOpen ? 'إخفاء' : 'عرض'}
                                        </span>
                                        <svg 
                                            className={`w-4 h-4 transition-transform duration-200 ${isAccordionOpen ? 'rotate-180' : ''}`}
                                            fill="none" 
                                            stroke="currentColor" 
                                            viewBox="0 0 24 24"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                                        </svg>
                                    </div>
                                </button>

                                {isAccordionOpen && (
                                    <div className="pt-3 divide-y divide-[#EFE4D8] text-xs">
                                        {landingPage.items.map((it, idx) => (
                                            <div key={it.id || idx} className="py-3 flex items-start gap-3">
                                                <span 
                                                    className="text-xs font-bold mt-0.5 shrink-0 num"
                                                    style={{ color: landingPage.accentColor }}
                                                >
                                                    {String(idx + 1).padStart(2, '0')}
                                                </span>
                                                <div className="flex-1">
                                                    <div 
                                                        className="font-bold text-xs tracking-wide"
                                                        style={{ color: landingPage.primaryColor, fontFamily: 'Plus Jakarta Sans, sans-serif' }}
                                                    >
                                                        {it.nameFr}
                                                    </div>
                                                    <div className="text-[11px] opacity-80 mt-0.5 leading-relaxed">
                                                        {it.descDz}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </section>
                        )}

                        {/* ==================================================== */}
                        {/* FORMULAIRE DE COMMANDE ULTRA-RAPIDE                  */}
                        {/* ==================================================== */}
                        <section className="pt-6">
                            <div className="mb-5 text-right">
                                <h2 className="text-lg font-bold" style={{ color: landingPage.primaryColor }}>
                                    {landingPage.formTitle || 'اطلبي الباك تاعك درك'}
                                </h2>
                                <p className="text-xs opacity-75 mt-1 leading-relaxed">
                                    {landingPage.formSubtitle || 'عمري معلوماتك لتحت، التوصيل يوصلك حتى لباب دارك والدفع كاش عند الاستلام بعد ما تفتحي وتعايني سلعتك.'}
                                </p>
                            </div>

                            <form onSubmit={handleSubmitOrder} className="space-y-3.5">
                                
                                {/* Nom et prénom */}
                                <div>
                                    <label className="block text-xs font-bold mb-1">
                                        {landingPage.nameLabel || 'الاسم واللقب الكامل'} <span className="text-red-600">*</span>
                                    </label>
                                    <input 
                                        type="text" 
                                        required 
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder={landingPage.namePlaceholder || 'مثال: أمينة بوزيد'} 
                                        className="w-full px-3.5 py-2.5 bg-white border border-[#EFE4D8] text-xs focus:outline-none rounded-lg"
                                        style={{ borderColor: '#EFE4D8' }}
                                    />
                                </div>

                                {/* Téléphone */}
                                <div>
                                    <label className="block text-xs font-bold mb-1">
                                        {landingPage.phoneLabel || 'رقم الهاتف (للاتصال وتأكيد الطلب)'} <span className="text-red-600">*</span>
                                    </label>
                                    <input 
                                        type="tel" 
                                        required 
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        placeholder={landingPage.phonePlaceholder || '05 / 06 / 07 XX XX XX'} 
                                        pattern="^(0)(5|6|7)[0-9]{8}$"
                                        className="w-full px-3.5 py-2.5 bg-white border border-[#EFE4D8] text-xs num focus:outline-none rounded-lg text-left"
                                    />
                                </div>

                                {/* WILAYA & COMMUNE EN LISTE DÉROULANTE (DROPDOWNS CASCADANTS) */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-xs font-bold mb-1">
                                            {landingPage.wilayaLabel || 'الولاية'} <span className="text-red-600">*</span>
                                        </label>
                                        <select 
                                            value={wilayaId}
                                            onChange={(e) => setWilayaId(e.target.value)}
                                            required
                                            className="w-full px-3 py-2.5 bg-white border border-[#EFE4D8] text-xs focus:outline-none rounded-lg cursor-pointer"
                                        >
                                            {activeRates.map((w: any) => (
                                                <option key={w.id} value={w.id}>
                                                    {w.id} - {w.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold mb-1">
                                            {landingPage.communeLabel || 'البلدية'} <span className="text-red-600">*</span>
                                        </label>
                                        <select 
                                            value={commune}
                                            onChange={(e) => setCommune(e.target.value)}
                                            required
                                            className="w-full px-3 py-2.5 bg-white border border-[#EFE4D8] text-xs focus:outline-none rounded-lg cursor-pointer"
                                        >
                                            {(ALGERIA_COMMUNES[wilayaId] || ['البلدية المركزية (Chef-lieu)']).map((c: string) => (
                                                <option key={c} value={c}>{c}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                {/* Mode de livraison */}
                                <div className="pt-1">
                                    <label className="block text-xs font-bold mb-2">
                                        {landingPage.deliveryTypeLabel || 'طريقة التوصيل المفضلة'}
                                    </label>
                                    <div className="grid grid-cols-2 gap-2.5">
                                        <label 
                                            className="cursor-pointer border-2 p-2.5 flex items-center justify-between text-xs rounded-lg transition-colors"
                                            style={{
                                                borderColor: deliveryType === 'home' ? landingPage.primaryColor : '#EFE4D8',
                                                backgroundColor: deliveryType === 'home' ? `${landingPage.primaryColor}08` : 'white'
                                            }}
                                        >
                                            <div className="flex items-center gap-2">
                                                <input 
                                                    type="radio" 
                                                    name="delType" 
                                                    checked={deliveryType === 'home'}
                                                    onChange={() => setDeliveryType('home')}
                                                />
                                                <span className="font-bold text-[11px]" style={{ color: landingPage.primaryColor }}>
                                                    {landingPage.homeDeliveryLabel || 'توصيل للدار (Domicile)'}
                                                </span>
                                            </div>
                                        </label>

                                        <label 
                                            className="cursor-pointer border-2 p-2.5 flex items-center justify-between text-xs rounded-lg transition-colors"
                                            style={{
                                                borderColor: deliveryType === 'desk' ? landingPage.primaryColor : '#EFE4D8',
                                                backgroundColor: deliveryType === 'desk' ? `${landingPage.primaryColor}08` : 'white'
                                            }}
                                        >
                                            <div className="flex items-center gap-2">
                                                <input 
                                                    type="radio" 
                                                    name="delType" 
                                                    checked={deliveryType === 'desk'}
                                                    onChange={() => setDeliveryType('desk')}
                                                />
                                                <span className="font-medium text-[11px] opacity-80">
                                                    {landingPage.deskDeliveryLabel || 'استلام من المكتب (Bureau)'}
                                                </span>
                                            </div>
                                        </label>
                                    </div>
                                </div>

                                {/* Récapitulatif avec chiffres français */}
                                <div className="mt-4 p-4 bg-[#FAF5EF] border border-[#EFE4D8] rounded-xl space-y-2 text-xs">
                                    <div className="flex justify-between opacity-80">
                                        <span>{landingPage.summaryProductLabel || 'سعر الباك :'}</span>
                                        <span className="font-bold num">{productPrice.toLocaleString('fr-DZ')} {landingPage.currency || 'DA'}</span>
                                    </div>
                                    <div className="flex justify-between opacity-80">
                                        <span>{landingPage.summaryShippingLabel || 'سعر التوصيل لولايتك :'}</span>
                                        <span className="font-bold num">{shippingCost.toLocaleString('fr-DZ')} {landingPage.currency || 'DA'}</span>
                                    </div>
                                    <div className="h-[1px] bg-[#EFE4D8] pt-1"></div>
                                    <div className="flex justify-between text-sm font-bold pt-1" style={{ color: landingPage.primaryColor }}>
                                        <span>{landingPage.summaryTotalLabel || 'المجموع الكلي عند الاستلام :'}</span>
                                        <span className="text-base font-extrabold num">{totalAmount.toLocaleString('fr-DZ')} {landingPage.currency || 'DA'}</span>
                                    </div>
                                </div>

                                {/* Bouton de confirmation */}
                                <button 
                                    type="submit" 
                                    disabled={submitting}
                                    className="w-full py-4 px-6 text-[#FAF5EF] text-xs font-bold tracking-wide active:scale-[0.99] transition-all cursor-pointer shadow-md rounded-xl disabled:opacity-50"
                                    style={{ backgroundColor: landingPage.primaryColor }}
                                >
                                    {submitting 
                                        ? (landingPage.submittingText || 'جاري تسجيل طلبكِ...') 
                                        : (landingPage.ctaButtonText 
                                            ? (landingPage.ctaButtonText.includes('{total}') 
                                                ? landingPage.ctaButtonText.replace('{total}', `${totalAmount.toLocaleString('fr-DZ')} ${landingPage.currency || 'DA'}`)
                                                : `${landingPage.ctaButtonText} — ${totalAmount.toLocaleString('fr-DZ')} ${landingPage.currency || 'DA'}`)
                                            : `تأكيد الطلب — ${totalAmount.toLocaleString('fr-DZ')} ${landingPage.currency || 'DA'}`)}
                                </button>

                                {/* Réassurance discrète */}
                                <p className="text-center text-[11px] opacity-75 pt-2 leading-relaxed">
                                    {landingPage.guaranteeText || 'الدفع يداً بيد عند الاستلام. تقدري تفتحي الطرد وتعايني سلعتك قبل ما تخلصي.'}
                                </p>

                            </form>
                        </section>

                    </div>
                </article>

                {/* ======================================================== */}
                {/* SECTION CONTACT INSTAGRAM (CHAT PRIVÉ DIRECT)            */}
                {/* ======================================================== */}
                {landingPage.showInstagram !== false && landingPage.instagramUrl && (
                    <section className="mt-6 bg-white border border-[#EFE4D8] rounded-2xl p-4 sm:p-5 text-center shadow-sm">
                        <div className="flex flex-col items-center justify-center gap-2.5">
                            
                            <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-[#FD5949] via-[#D6249F] to-[#285AEB] flex items-center justify-center text-white shadow-sm hover:scale-105 transition-transform">
                                <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                                </svg>
                            </div>

                            <div>
                                <h3 className="text-xs font-bold">
                                    عندك أي سؤال أو استفسار على هذا الباك؟
                                </h3>
                                <p className="text-[11px] opacity-75 mt-0.5">
                                    تواصلي معنا مباشرة في الشات الخاص على حسابنا في إنستغرام
                                </p>
                            </div>

                            <a 
                                href={`${landingPage.instagramUrl}?text=${encodeURIComponent(landingPage.instagramMessage || 'السلام عليكم، حبيت نستفسر ونعرف معلومات أكثر على هذا الباك')}`}
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="mt-1 inline-flex items-center gap-2 px-5 py-2.5 bg-[#FAF5EF] hover:bg-[#F3EAE0] border border-[#EFE4D8] text-xs font-bold rounded-xl transition-all shadow-sm"
                                style={{ color: landingPage.primaryColor }}
                            >
                                <svg className="w-4 h-4 text-[#D6249F]" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073z"/>
                                </svg>
                                <span>{landingPage.instagramButtonLabel || `مراسلة في الخاص: « ${landingPage.instagramMessage || 'السلام عليكم، حبيت نستفسر على الباك'} »`}</span>
                            </a>

                        </div>
                    </section>
                )}

                {/* Footer sobre */}
                <footer className="mt-8 text-center text-xs opacity-70 font-medium">
                    <p>{landingPage.footerText || `© ${landingPage.brandName || 'MEEY NAIL SHOP'}. جميع الحقوق محفوظة.`}</p>
                </footer>

            </main>

            {/* ======================================================== */}
            {/* MODAL PROFESSIONNEL DE CONFIRMATION DE COMMANDE          */}
            {/* ======================================================== */}
            {orderSuccess && (
                <div className="fixed inset-0 z-50 bg-[#18080A]/60 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-white max-w-md w-full p-6 sm:p-7 border border-[#BFA893]/40 rounded-2xl shadow-2xl text-right">
                        
                        <div className="flex items-start justify-between border-b border-[#EFE4D8] pb-3.5 mb-4">
                            <div>
                                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#B8935A] num">
                                    {landingPage.brandName}
                                </span>
                                <h3 className="text-lg font-bold mt-0.5" style={{ color: landingPage.primaryColor }}>
                                    {landingPage.successModalTitle || 'تم تسجيل طلبكِ بنجاح'}
                                </h3>
                            </div>
                            <div 
                                className="w-8 h-8 rounded-full bg-[#FAF5EF] border flex items-center justify-center font-bold text-xs"
                                style={{ color: landingPage.primaryColor, borderColor: landingPage.accentColor }}
                            >
                                ✓
                            </div>
                        </div>

                        <p className="text-xs text-[#7A5459] leading-relaxed mb-4">
                            {landingPage.successModalMessage || 'تم استلام طلبكِ في نظام المتجر. سيتصل بكِ فريق العمل عبر الهاتف لتأكيد موعد إرسال الطرد إلى عنوانكِ.'}
                        </p>

                        {/* Fiche Récapitulatif Pro */}
                        <div className="p-3.5 bg-[#FAF5EF] border border-[#EFE4D8] rounded-xl text-xs space-y-2 mb-5">
                            <div className="flex justify-between pb-1.5 border-b border-[#EFE4D8] text-[11px]">
                                <span className="text-gray-500">رقم مرجع الطلب :</span>
                                <span className="font-mono font-bold num" style={{ color: landingPage.primaryColor }}>
                                    {orderSuccess.ref}
                                </span>
                            </div>
                            <div className="flex justify-between pt-1">
                                <span className="text-gray-500">المنتج :</span>
                                <span className="font-bold text-[#18080A]">
                                    {orderSuccess.productTitle} {orderSuccess.variantName ? `(${orderSuccess.variantName})` : ''}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">الزبونة :</span>
                                <span className="font-semibold text-[#18080A]">
                                    {orderSuccess.name} (<span className="num">{orderSuccess.phone}</span>)
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">مكان التوصيل :</span>
                                <span className="text-[#18080A]">
                                    {orderSuccess.wilayaName} — {orderSuccess.commune}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">نوع التوصيل :</span>
                                <span className="text-[#18080A]">{orderSuccess.delType}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">سعر التوصيل :</span>
                                <span className="font-bold num">{orderSuccess.shippingCost.toLocaleString('fr-DZ')} {landingPage.currency || 'DA'}</span>
                            </div>
                            <div className="flex justify-between border-t border-[#B8935A]/40 pt-2 font-bold text-sm" style={{ color: landingPage.primaryColor }}>
                                <span>المجموع الإجمالي عند الاستلام :</span> 
                                <span className="num">{orderSuccess.total.toLocaleString('fr-DZ')} {landingPage.currency || 'DA'}</span>
                            </div>
                        </div>

                        <button 
                            onClick={() => {
                                setOrderSuccess(null);
                                router.push('/');
                            }}
                            className="w-full py-3 text-white text-xs font-bold uppercase tracking-wider transition-colors rounded-xl shadow"
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

        </div>
    );
}
