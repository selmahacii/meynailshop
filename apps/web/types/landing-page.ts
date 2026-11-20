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

export interface LandingPageData {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  brandName: string;
  logoUrl?: string;
  
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
  
  // Pack Items / Components
  items: LandingPageItem[];
  isAccordion: boolean;
  accordionTitle?: string;
  accordionBadgeText?: string;
  
  // Variants
  variants: LandingPageVariant[];
  hasVariants: boolean;
  variantsTitle?: string;
  
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
  
  // CTA Button & Guarantees
  ctaButtonText?: string;
  submittingText?: string;
  guaranteeText?: string;
  deliveryText?: string;
  
  // Instagram Section
  showInstagram?: boolean;
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
