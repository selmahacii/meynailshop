export declare enum CouponType {
    PERCENTAGE = "percentage",
    FIXED = "fixed"
}
export declare class CreateCouponDto {
    code: string;
    type: CouponType;
    value: number;
    minAmount?: number;
    maxUsageCount: number;
    expiresAt: string;
    description?: string;
}
