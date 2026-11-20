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
  primaryColor: string; // ex: '#390102'
  accentColor: string;  // ex: '#BFA893'
  backgroundColor: string; // ex: '#FAF5EF'
  textColor: string;    // ex: '#18080A'
  price: number;
  compareAtPrice?: number;
  currency: string;
  photos: string[];
  items: LandingPageItem[];
  isAccordion: boolean;
  accordionTitle?: string;
  variants: LandingPageVariant[];
  hasVariants: boolean;
  productId?: string;
  deliveryText?: string;
  guaranteeText?: string;
  instagramUrl?: string;
  instagramMessage?: string;
  isActive: boolean;
  viewsCount?: number;
  ordersCount?: number;
  createdAt: string;
  updatedAt: string;
}
