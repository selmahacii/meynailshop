export interface LandingPageItem {
  id: string;
  nameFr: string;
  descDz: string;
  quantity?: number;
}

export interface LandingPageVariant {
  id: string;
  name: string;
  description?: string;
  price?: number;
  compareAtPrice?: number;
  image?: string;
  stock?: number;
  sku?: string;
}

export interface LandingPageBenefit {
  id: string;
  title: string;
  description: string;
  icon?: string;
}

export interface LandingPageReview {
  id: string;
  authorName: string;
  wilaya?: string;
  rating: number; // 1-5
  comment: string;
  date?: string;
  photo?: string;
}

export interface LandingPageFaq {
  id: string;
  question: string;
  answer: string;
}

export interface LandingPageData {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  brandName: string;
  logoUrl?: string;
  
  // Section Visibility Toggles (Activer / Désactiver chaque section)
  showBrandHeader?: boolean;
  showGallery?: boolean;
  showPricing?: boolean;
  showVariants?: boolean;
  showItems?: boolean;
  showBenefits?: boolean;
  showVideo?: boolean;
  showReviews?: boolean;
  showFaq?: boolean;
  showOrderForm?: boolean;
  showInstagram?: boolean;
  showReassurance?: boolean;
  showStickyCta?: boolean;
  
  // Colors & Styling
  primaryColor: string; // ex: '#390102'
  accentColor: string;  // ex: '#BFA893'
  backgroundColor: string; // ex: '#FAF5EF'
  textColor: string;    // ex: '#18080A'
  cardBackgroundColor?: string; // ex: '#FFFFFF'
  
  // Pricing & Badges
  price: number;
  compareAtPrice?: number;
  currency: string;
  priceBadgeText?: string;
  deliveryBadgeText?: string;
  
  // Photos
  photos: string[];
  
  // Pack Items / Components (17+ éléments)
  items: LandingPageItem[];
  isAccordion: boolean;
  accordionTitle?: string;
  accordionBadgeText?: string;
  
  // Variants
  variants: LandingPageVariant[];
  hasVariants: boolean;
  variantsTitle?: string;
  
  // Video Section
  videoUrl?: string;
  videoTitle?: string;
  videoSubtitle?: string;
  
  // Benefits Section (علاش تختاري هذا الباك ؟)
  benefitsTitle?: string;
  benefitsSubtitle?: string;
  benefits?: LandingPageBenefit[];
  
  // Reviews Section (آراء الزبونات)
  reviewsTitle?: string;
  reviewsSubtitle?: string;
  reviews?: LandingPageReview[];
  
  // FAQ Section (الأسئلة الشائعة)
  faqTitle?: string;
  faqSubtitle?: string;
  faqs?: LandingPageFaq[];
  
  // Order Form Customization
  formTitle?: string;
  formSubtitle?: string;
  nameLabel?: string;
  namePlaceholder?: string;
  phoneLabel?: string;
  phonePlaceholder?: string;
  wilayaLabel?: string;
  communeLabel?: string;
  deliveryTypeLabel?: string;
  homeDeliveryLabel?: string;
  deskDeliveryLabel?: string;
  
  // Order Summary Labels
  summaryProductLabel?: string;
  summaryShippingLabel?: string;
  summaryTotalLabel?: string;
  
  // CTA Button, Floating CTA & Guarantees
  ctaButtonText?: string;
  stickyCtaText?: string;
  submittingText?: string;
  guaranteeText?: string;
  deliveryText?: string;
  
  // Instagram Section
  instagramTitle?: string;
  instagramSubtitle?: string;
  instagramUrl?: string;
  instagramMessage?: string;
  instagramButtonLabel?: string;
  
  // Success Confirmation Modal
  successModalTitle?: string;
  successModalMessage?: string;
  successModalButtonText?: string;
  
  // Footer & Tracking
  footerText?: string;
  facebookPixelId?: string;
  tiktokPixelId?: string;
  
  productId?: string;
  isActive: boolean;
  viewsCount?: number;
  ordersCount?: number;
  createdAt: string;
  updatedAt: string;
}
