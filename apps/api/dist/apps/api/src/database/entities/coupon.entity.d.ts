export declare class Coupon {
    id: string;
    code: string;
    type: string;
    value: number;
    minOrderAmount: number;
    maxUses: number;
    usedCount: number;
    expiresAt: Date;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}
