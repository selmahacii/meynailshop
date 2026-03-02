// API Response Types
export interface ApiResponse<T = any> {
  statusCode: number;
  message: string;
  data?: T;
  errors?: string[];
}

export interface PaginatedResponse<T> {
  statusCode: number;
  data: {
    items: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// User Roles
export enum UserRole {
  CLIENT = 'client',
  ADMIN = 'admin',
}

// Order Statuses
export enum OrderStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  PROCESSING = 'processing',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
  REFUNDED = 'refunded',
}

export enum PaymentStatus {
  PENDING = 'pending',
  PAID = 'paid',
  FAILED = 'failed',
  REFUNDED = 'refunded',
}

export enum PaymentMethod {
  CASH_ON_DELIVERY = 'cash_on_delivery',
  BARIDIMOB = 'baridimob',
}

// Review Status
export enum ReviewStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

// Product Badge
export enum BadgeType {
  TOP = 'top',
  NEW = 'new',
  PROMO = 'promo',
}

// Coupon Type
export enum CouponType {
  PERCENTAGE = 'percentage',
  FIXED = 'fixed',
}

// Stock Movement Type
export enum StockMovementType {
  IN = 'in',
  OUT = 'out',
  ADJUSTMENT = 'adjustment',
  SALE = 'sale',
  RETURN = 'return',
}
