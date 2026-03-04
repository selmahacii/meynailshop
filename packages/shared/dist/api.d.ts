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
export declare enum UserRole {
    CLIENT = "client",
    ADMIN = "admin"
}
export declare enum OrderStatus {
    PENDING = "pending",
    CONFIRMED = "confirmed",
    PROCESSING = "processing",
    SHIPPED = "shipped",
    DELIVERED = "delivered",
    CANCELLED = "cancelled",
    REFUNDED = "refunded"
}
export declare enum PaymentStatus {
    PENDING = "pending",
    PAID = "paid",
    FAILED = "failed",
    REFUNDED = "refunded"
}
export declare enum PaymentMethod {
    CASH_ON_DELIVERY = "cash_on_delivery",
    BARIDIMOB = "baridimob"
}
export declare enum ReviewStatus {
    PENDING = "pending",
    APPROVED = "approved",
    REJECTED = "rejected"
}
export declare enum BadgeType {
    TOP = "top",
    NEW = "new",
    PROMO = "promo"
}
export declare enum CouponType {
    PERCENTAGE = "percentage",
    FIXED = "fixed"
}
export declare enum StockMovementType {
    IN = "in",
    OUT = "out",
    ADJUSTMENT = "adjustment",
    SALE = "sale",
    RETURN = "return"
}
//# sourceMappingURL=api.d.ts.map