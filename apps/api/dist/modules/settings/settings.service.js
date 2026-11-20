"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SettingsService = exports.DEFAULT_LANDING_PAGES = exports.DEFAULT_SHIPPING_FEES = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const site_settings_entity_1 = require("../../database/entities/site-settings.entity");
exports.DEFAULT_SHIPPING_FEES = [
    { "id": "01", "name": "Adrar", "delay": "2-5", "homeRate": 1500, "deskRate": 800, "returnRate": 300 },
    { "id": "02", "name": "Chlef", "delay": "1-3", "homeRate": 850, "deskRate": 450, "returnRate": 200 },
    { "id": "03", "name": "Laghouat", "delay": "1-3", "homeRate": 950, "deskRate": 550, "returnRate": 200 },
    { "id": "04", "name": "Oum El Bouaghi", "delay": "1-3", "homeRate": 850, "deskRate": 450, "returnRate": 200 },
    { "id": "05", "name": "Batna", "delay": "1-3", "homeRate": 850, "deskRate": 450, "returnRate": 200 },
    { "id": "06", "name": "Bejaia", "delay": "1-3", "homeRate": 850, "deskRate": 450, "returnRate": 200 },
    { "id": "07", "name": "Biskra", "delay": "1-3", "homeRate": 900, "deskRate": 550, "returnRate": 200 },
    { "id": "08", "name": "Bechar", "delay": "2-5", "homeRate": 1200, "deskRate": 700, "returnRate": 300 },
    { "id": "09", "name": "Blida", "delay": "1", "homeRate": 700, "deskRate": 400, "returnRate": 200 },
    { "id": "10", "name": "Bouira", "delay": "1-3", "homeRate": 850, "deskRate": 450, "returnRate": 200 },
    { "id": "11", "name": "Tamanrasset", "delay": "5-8", "homeRate": 1800, "deskRate": 950, "returnRate": 350 },
    { "id": "12", "name": "Tebessa", "delay": "1-3", "homeRate": 900, "deskRate": 500, "returnRate": 200 },
    { "id": "13", "name": "Tlemcen", "delay": "1-3", "homeRate": 900, "deskRate": 450, "returnRate": 200 },
    { "id": "14", "name": "Tiaret", "delay": "1-3", "homeRate": 850, "deskRate": 450, "returnRate": 200 },
    { "id": "15", "name": "Tizi Ouzou", "delay": "1-3", "homeRate": 800, "deskRate": 400, "returnRate": 200 },
    { "id": "16", "name": "Alger", "delay": "0-1", "homeRate": 500, "deskRate": 300, "returnRate": 200 },
    { "id": "17", "name": "Djelfa", "delay": "1-3", "homeRate": 950, "deskRate": 500, "returnRate": 200 },
    { "id": "18", "name": "Jijel", "delay": "1-3", "homeRate": 850, "deskRate": 450, "returnRate": 200 },
    { "id": "19", "name": "Setif", "delay": "1-3", "homeRate": 850, "deskRate": 450, "returnRate": 200 },
    { "id": "20", "name": "Saïda", "delay": "1-3", "homeRate": 850, "deskRate": 500, "returnRate": 200 },
    { "id": "21", "name": "Skikda", "delay": "1-3", "homeRate": 850, "deskRate": 450, "returnRate": 200 },
    { "id": "22", "name": "Sidi Bel Abbes", "delay": "1-3", "homeRate": 850, "deskRate": 500, "returnRate": 200 },
    { "id": "23", "name": "Annaba", "delay": "1-3", "homeRate": 850, "deskRate": 450, "returnRate": 200 },
    { "id": "24", "name": "Guelma", "delay": "1-3", "homeRate": 900, "deskRate": 500, "returnRate": 200 },
    { "id": "25", "name": "Constantine", "delay": "1-3", "homeRate": 800, "deskRate": 450, "returnRate": 200 },
    { "id": "26", "name": "Médéa", "delay": "1-3", "homeRate": 800, "deskRate": 450, "returnRate": 200 },
    { "id": "27", "name": "Mostaganem", "delay": "1-3", "homeRate": 850, "deskRate": 450, "returnRate": 200 },
    { "id": "28", "name": "M’Sila", "delay": "1-3", "homeRate": 900, "deskRate": 500, "returnRate": 200 },
    { "id": "29", "name": "Mascara", "delay": "1-3", "homeRate": 850, "deskRate": 500, "returnRate": 200 },
    { "id": "30", "name": "Ouargla", "delay": "2-5", "homeRate": 1000, "deskRate": 650, "returnRate": 200 },
    { "id": "31", "name": "Oran", "delay": "1-3", "homeRate": 850, "deskRate": 450, "returnRate": 200 },
    { "id": "32", "name": "El Bayadh", "delay": "1-3", "homeRate": 1050, "deskRate": 700, "returnRate": 200 },
    { "id": "33", "name": "Ilizi", "delay": "5-8", "homeRate": 2100, "deskRate": 1200, "returnRate": 300 },
    { "id": "34", "name": "Bordj Bou Arreridj", "delay": "1-3", "homeRate": 850, "deskRate": 500, "returnRate": 200 },
    { "id": "35", "name": "Boumerdès", "delay": "1", "homeRate": 700, "deskRate": 400, "returnRate": 200 },
    { "id": "36", "name": "El-Tarf", "delay": "1-3", "homeRate": 850, "deskRate": 500, "returnRate": 200 },
    { "id": "37", "name": "Tindouf", "delay": "5-8", "homeRate": 1700, "deskRate": 800, "returnRate": 300 },
    { "id": "38", "name": "Tissemsilt", "delay": "1-3", "homeRate": 850, "deskRate": 500, "returnRate": 200 },
    { "id": "39", "name": "El oued", "delay": "1-3", "homeRate": 1050, "deskRate": 700, "returnRate": 200 },
    { "id": "40", "name": "Khenchela", "delay": "1-3", "homeRate": 850, "deskRate": 500, "returnRate": 200 },
    { "id": "41", "name": "Souk Ahras", "delay": "1-3", "homeRate": 900, "deskRate": 500, "returnRate": 200 },
    { "id": "42", "name": "Tipaza", "delay": "1", "homeRate": 700, "deskRate": null, "returnRate": 200 },
    { "id": "43", "name": "Mila", "delay": "1-3", "homeRate": 850, "deskRate": 500, "returnRate": 200 },
    { "id": "44", "name": "Ain Defla", "delay": "1-3", "homeRate": 850, "deskRate": 500, "returnRate": 200 },
    { "id": "45", "name": "Naâma", "delay": "2-6", "homeRate": 1200, "deskRate": 700, "returnRate": 300 },
    { "id": "46", "name": "Ain Temouchent", "delay": "1-3", "homeRate": 850, "deskRate": 500, "returnRate": 200 },
    { "id": "47", "name": "Ghardaia", "delay": "2-5", "homeRate": 950, "deskRate": 550, "returnRate": 300 },
    { "id": "48", "name": "Rélizane", "delay": "1-3", "homeRate": 850, "deskRate": 500, "returnRate": 200 },
    { "id": "49", "name": "Timimoun", "delay": "2-6", "homeRate": 1600, "deskRate": 850, "returnRate": 300 },
    { "id": "50", "name": "Bordj Badji Mokhtar", "delay": "5-8", "homeRate": 1800, "deskRate": null, "returnRate": 300 },
    { "id": "51", "name": "Ouled Djellal", "delay": "1-3", "homeRate": 950, "deskRate": 550, "returnRate": 300 },
    { "id": "52", "name": "Beni Abbes", "delay": "2-6", "homeRate": 1300, "deskRate": null, "returnRate": 300 },
    { "id": "53", "name": "In salah", "delay": "5-8", "homeRate": 1900, "deskRate": 1400, "returnRate": 300 },
    { "id": "54", "name": "In Guezzam", "delay": "5-8", "homeRate": 1900, "deskRate": null, "returnRate": 300 },
    { "id": "55", "name": "Touggourt", "delay": "2-5", "homeRate": 1000, "deskRate": null, "returnRate": 300 },
    { "id": "56", "name": "Djanet", "delay": "5-8", "homeRate": 1900, "deskRate": null, "returnRate": 300 },
    { "id": "57", "name": "El M'Ghair", "delay": "2-5", "homeRate": 1200, "deskRate": null, "returnRate": 300 },
    { "id": "58", "name": "El Menia", "delay": "2-5", "homeRate": 1100, "deskRate": 700, "returnRate": 300 }
];
exports.DEFAULT_LANDING_PAGES = [
    {
        id: "lp_pack_onglerie_17",
        slug: "pack-onglerie",
        title: "باك متكامل للأظافر والـ Press-on nails",
        subtitle: "كل الأدوات الاحترافية والدرجات الأساسية مجموعة في حقيبة واحدة باه تبداي خدمتك بكل احترافية وبدون ما تشري كل حاجة وحدها.",
        brandName: "MEEY NAIL SHOP",
        primaryColor: "#390102",
        accentColor: "#BFA893",
        backgroundColor: "#FAF5EF",
        textColor: "#18080A",
        price: 6500,
        compareAtPrice: 8500,
        currency: "DA",
        photos: [
            "https://hnnsaruuigqchikzdiro.supabase.co/storage/v1/object/public/products/4e73288c-a77a-4d2d-a8e2-1ec2dcbb4327.webp",
            "https://hnnsaruuigqchikzdiro.supabase.co/storage/v1/object/public/products/7a433d20-e73b-4859-bf4c-5c5c3748aeca.webp",
            "https://hnnsaruuigqchikzdiro.supabase.co/storage/v1/object/public/products/a8c724d8-929f-4f95-a490-7ab60b051529.webp"
        ],
        items: [
            { id: "1", nameFr: "Mini lampe UV", descDz: "مصباح UV ميني عملي وخفيف باه تفيكسي الكبسولة ضربة ضربة وتشيحي الفيرني ليه ليه وبلا ما يدي بلاصة.", quantity: 1 },
            { id: "2", nameFr: "Lampe UV grand format", descDz: "مصباح UV كبير واحترافي تدخلي فيه يدك كاملة وتشيحي الخدمة ضربة وحدة كيما الصالون.", quantity: 1 },
            { id: "3", nameFr: "Coupe capsule", descDz: "مقص سبيسيال يقص الكبسولة ضربة وحدة نقية بلا ما يشققها باه تتحكمي في الطول لي يعجبك.", quantity: 1 },
            { id: "4", nameFr: "Pack pinceaux liner", descDz: "مجموعة بانسوات رقاق بريسيز باه ترسمي خطوط ناعمة، فرنش وديزاينات متقونة بكل سهولة.", quantity: 1 },
            { id: "5", nameFr: "Mini bâtonnets", descDz: "عيدان خشبية ترجعي بيهم الجليدة الزايدة للور وتمسحي بيهم زوايد الفيرني بدقة.", quantity: 1 },
            { id: "6", nameFr: "Minis limes", descDz: "ليمات صغار وعمليين باه تفصلي وتعدلي بيهم الحواف والزوايا في أي بلاصة.", quantity: 1 },
            { id: "7", nameFr: "Lime et bloc polissoir", descDz: "مبرد نوعية باهية مع بلوك بوليسوار تحكي بيه سطح الظفر باه ينحي اللمعة ويشد الفيرني مليح وما يطيرش.", quantity: 1 },
            { id: "8", nameFr: "Vernis (bordeaux, marron, blanc, vert kaki)", descDz: "4 ألوان أساسية راقية ومطلوبة بزاف، تغطية شابة وثابتة تخدمي بيهم قاع الستايلات.", quantity: 4 },
            { id: "9", nameFr: "Vernis effet gel : milky rosé nude", descDz: "لون ميلكي روزي نود طبيعي يهبل يمد هذاك المظهر الناعم والمنفوخ تاع صالونات التجميل.", quantity: 1 },
            { id: "10", nameFr: "Top coat & Base coat", descDz: "البيس كوت باه تحمي الظفر وتلصق اللون مليح، والتوب كوت يقفل الخدمة بلمعة قوية ويحميها من التقشر.", quantity: 2 },
            { id: "11", nameFr: "Support Press-on", descDz: "حامل مريح تثبتي عليه الكبسولة باه تخدمي وترسمي بكل راحة وتكون يدك خفيفة.", quantity: 1 },
            { id: "12", nameFr: "Pâte à fix", descDz: "عجينة سبيسيال تلصق الكبسولة فوق السيبور مليح باه ما تتحركش خلاص كي تكوني تخدمي فيها.", quantity: 1 },
            { id: "13", nameFr: "Scotch double face", descDz: "لصقة قوية وخفيفة تلصقلك الأظافر ليه ليه وتشدهم مليح بلا ما تضر ظفرك الطبيعي.", quantity: 1 },
            { id: "14", nameFr: "Déco des strass", descDz: "تشكيلة أحجار وستراس يبريو بزاف يمدو لمسة راقية ولامعة تزيد النص في خدمتك.", quantity: 1 },
            { id: "15", nameFr: "Chrome doré", descDz: "بودرة كروم بلون ذهبي فخم تعطي لمسة معدنية راقية كيما الذهب للديزاينات.", quantity: 1 },
            { id: "16", nameFr: "Effet miroir", descDz: "بودرة لمعان عاكس كي المرايا، تمد مظهر غلاسي عصري ومطلوب بزاف في المناسبات.", quantity: 1 },
            { id: "17", nameFr: "Des papillons colorés", descDz: "ديزاينات فراشات ثلاثية الأبعاد ملونة وشابة بزاف باه تزيني بيهم أظافرك وتخرجي أشكال ترند.", quantity: 1 }
        ],
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
        benefitsTitle: "علاش تختاري هذا الباك المتكامل ؟",
        benefitsSubtitle: "كل ما تحتاجينه لبداية احترافية ونظيفة بدون تضييع الوقت والمال",
        benefits: [
            { id: "b1", title: "سلعة احترافية 100%", description: "مكونات صالون مختارة بعناية تعيش معاك وتمدلك نتيجة نقية ومتقونة من أول تجربة." },
            { id: "b2", title: "توفير كبير في الوقت والدراهم", description: "بلا ما تحوسي في الحوانيت وتشري كل قطعة وحدها بسعر غالي، جمعنالك كلش في باك واحد شامل." },
            { id: "b3", title: "توصيل سريع وباب للدار", description: "نوصلولك لكامل 58 ولاية مع إمكانية فتح الطرد ومعاينة السلعة قبل الدفع كاش عند الاستلام." }
        ],
        reviewsTitle: "آراء زبوناتنا الوفيات",
        reviewsSubtitle: "تجارب حقيقية من زبونات بدأن مشروعهن بهذا الباك",
        reviews: [
            { id: "r1", authorName: "أمينة ب.", wilaya: "الجزائر العاصمة", rating: 5, comment: "الباك جاني كيما في التصويرة تماماً وفيه كلش، لمبة UV خفيفة بزاف والفيرني يشد مليح، يعطيك الصحة.", date: "منذ يومين" },
            { id: "r2", authorName: "سارة م.", wilaya: "وهران", rating: 5, comment: "خدمة هايلة والتوصيل وصلني في 48 ساعة لباب الدار، عجبني بلي نقدر نتحقق من السلعة قبل ما نخلص.", date: "منذ 5 أيام" },
            { id: "r3", authorName: "نادية ك.", wilaya: "قسنطينة", rating: 5, comment: "أنصح كل وحدة حابة تبدا في الأظافر والـ Press-on nails تشري هذا الباك، ما تسحقي تزيدي تشري والو معاه.", date: "منذ أسبوع" }
        ],
        faqTitle: "الأسئلة الأكثر تكراراً (FAQ)",
        faqSubtitle: "كل الإجابات عن التوصيل، الدفع، ومكونات الباك",
        faqs: [
            { id: "f1", question: "كيفاش نخلص ووقتاش توصلني السلعة ؟", answer: "الدفع يداً بيد عند الاستلام كاش. التوصيل يوصلك حتى لباب دارك أو للمكتب خلال 24 إلى 48 ساعة حسب ولايتك." },
            { id: "f2", question: "هل نقدر نفتح الطرد ونشوف السلعة قبل ما نخلص ؟", answer: "نعم بكل تأكيد ! تقدري تفتحي الطرد وتعايني المكونات وتتأكدي من كلش قبل ما تمدي الدراهم لعامل التوصيل." },
            { id: "f3", question: "هل الباك فيه كل الأدوات الكافية باه نبدأ ؟", answer: "نعم، الباك يضم 17 قطعة أساسية متكاملة (مصابيح UV، مقص، بانسوات، مبرد، توب كوت وبيس كوت، ألوان الفيرني والديزاينات) باه تبداي مباشرة وبلا ما يخصك والو." }
        ],
        videoTitle: "فيديو توضيحي لطريقة الاستعمال والنتيجة",
        videoSubtitle: "شاهدي كيفاش تخدمي ديزاينات احترافية خطوة بخطوة بالمنتجات لي في الباك",
        videoUrl: "",
        stickyCtaText: "اطلبي الآن — الدفع عند الاستلام",
        isAccordion: true,
        accordionTitle: "المكونات الأساسية للباك (17 عنصر بالتفصيل) :",
        accordionBadgeText: "17 pièces",
        priceBadgeText: "سعر الباك الكامل (17 عنصر متكامل)",
        deliveryBadgeText: "توصيل متوفر لـ 58 ولاية",
        formTitle: "اطلبي الباك تاعك درك",
        formSubtitle: "عمري معلوماتك لتحت، التوصيل يوصلك حتى لباب دارك والدفع كاش عند الاستلام بعد ما تفتحي وتعايني سلعتك.",
        nameLabel: "الاسم واللقب الكامل",
        namePlaceholder: "مثال: أمينة بوزيد",
        phoneLabel: "رقم الهاتف (للاتصال وتأكيد الطلب)",
        phonePlaceholder: "05 / 06 / 07 XX XX XX",
        wilayaLabel: "الولاية",
        communeLabel: "البلدية",
        deliveryTypeLabel: "طريقة التوصيل المفضلة",
        homeDeliveryLabel: "توصيل للدار (Domicile)",
        deskDeliveryLabel: "استلام من المكتب (Bureau)",
        summaryProductLabel: "سعر الباك :",
        summaryShippingLabel: "سعر التوصيل لولايتك :",
        summaryTotalLabel: "المجموع الكلي عند الاستلام :",
        ctaButtonText: "تأكيد الطلب",
        submittingText: "جاري تسجيل طلبكِ...",
        variants: [],
        hasVariants: false,
        variantsTitle: "اختاري الصيغة أو الباك المناسب لكِ :",
        deliveryText: "توصيل متوفر لكامل 58 ولاية — الدفع كاش عند الاستلام",
        guaranteeText: "الدفع يداً بيد عند الاستلام. تقدري تفتحي الطرد وتعايني سلعتك قبل ما تخلصي.",
        instagramTitle: "عندك أي سؤال أو استفسار على هذا الباك؟",
        instagramSubtitle: "تواصلي معنا مباشرة في الشات الخاص على حسابنا في إنستغرام",
        instagramUrl: "https://ig.me/m/meeynailshop",
        instagramMessage: "السلام عليكم، حبيت نستفسر ونعرف معلومات أكثر على هذا الباك",
        instagramButtonLabel: "مراسلة في الخاص: « السلام عليكم، حبيت نستفسر على الباك »",
        successModalTitle: "تم تسجيل طلبكِ بنجاح",
        successModalMessage: "تم استلام طلبكِ في نظام المتجر. سيتصل بكِ فريق العمل عبر الهاتف لتأكيد موعد إرسال الطرد إلى عنوانكِ.",
        successModalButtonText: "الرجوع إلى المتجر",
        footerText: "© MEEY NAIL SHOP. جميع الحقوق محفوظة.",
        isActive: true,
        createdAt: "2026-11-20T22:00:00.000Z",
        updatedAt: "2026-11-20T22:00:00.000Z"
    }
];
let SettingsService = class SettingsService {
    constructor(settingsRepository, dataSource) {
        this.settingsRepository = settingsRepository;
        this.dataSource = dataSource;
    }
    async onModuleInit() {
        try {
            await this.dataSource.query(`
                ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "onglerieCollectionImage" text;
                ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "landingPages" jsonb DEFAULT '[]'::jsonb;
            `);
        }
        catch (e) {
            console.warn('Could not run ALTER TABLE for landingPages or onglerieCollectionImage:', e);
        }
        await this.ensureSettingsExist();
    }
    async ensureSettingsExist() {
        const settings = await this.settingsRepository.find();
        if (settings.length === 0) {
            const defaultSettings = this.settingsRepository.create({
                shopName: 'MEEY Nail Shop',
                shopEmail: 'contact@meey.dz',
                shopPhone: '0555555555',
                shopAddress: 'Alger, Algérie',
                shippingCostDefault: 600,
                freeShippingThreshold: 10000,
                stockAlertDefault: 5,
                shippingFees: exports.DEFAULT_SHIPPING_FEES,
                landingPages: exports.DEFAULT_LANDING_PAGES
            });
            await this.settingsRepository.save(defaultSettings);
        }
        else {
            const s = settings[0];
            let needsSave = false;
            if (!s.shippingFees || !Array.isArray(s.shippingFees) || s.shippingFees.length === 0) {
                s.shippingFees = exports.DEFAULT_SHIPPING_FEES;
                needsSave = true;
            }
            if (!s.onglerieCollectionImage) {
                s.onglerieCollectionImage = 'https://images.unsplash.com/photo-1632345033839-245a1e2ca9cb?q=80&w=800&auto=format&fit=crop';
                needsSave = true;
            }
            if (!s.landingPages || !Array.isArray(s.landingPages) || s.landingPages.length === 0) {
                s.landingPages = exports.DEFAULT_LANDING_PAGES;
                needsSave = true;
            }
            if (needsSave) {
                await this.settingsRepository.save(s);
            }
        }
    }
    async getSettings() {
        let settings = await this.settingsRepository.find();
        if (settings.length === 0) {
            await this.ensureSettingsExist();
            settings = await this.settingsRepository.find();
            if (settings.length === 0) {
                throw new common_1.NotFoundException('Settings not found');
            }
        }
        const s = settings[0];
        let needsSave = false;
        if (!s.shippingFees || !Array.isArray(s.shippingFees) || s.shippingFees.length === 0) {
            s.shippingFees = exports.DEFAULT_SHIPPING_FEES;
            needsSave = true;
        }
        if (!s.landingPages || !Array.isArray(s.landingPages) || s.landingPages.length === 0) {
            s.landingPages = exports.DEFAULT_LANDING_PAGES;
            needsSave = true;
        }
        if (needsSave) {
            await this.settingsRepository.save(s);
        }
        return s;
    }
    async updateSettings(updateSettingsDto) {
        const settings = await this.getSettings();
        Object.assign(settings, updateSettingsDto);
        return this.settingsRepository.save(settings);
    }
    async resetShop() {
        const currentSettings = await this.getSettings();
        const tables = [
            'order_items',
            'orders',
            'addresses',
            'products',
            'categories',
            'sub_categories',
            'reviews',
            'coupons',
            'stock_movements',
            'wishlist_items',
            'users'
        ];
        try {
            await this.dataSource.query(`TRUNCATE TABLE ${tables.map(t => `"${t}"`).join(', ')} RESTART IDENTITY CASCADE`);
            await this.settingsRepository.save(currentSettings);
            return { message: 'Boutique réinitialisée avec succès' };
        }
        catch (error) {
            console.error('Erreur lors du reset de la boutique:', error);
            throw new Error('Échec de la réinitialisation de la boutique');
        }
    }
};
exports.SettingsService = SettingsService;
exports.SettingsService = SettingsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(site_settings_entity_1.SiteSettings)),
    __param(1, (0, typeorm_1.InjectDataSource)()),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.DataSource])
], SettingsService);
//# sourceMappingURL=settings.service.js.map