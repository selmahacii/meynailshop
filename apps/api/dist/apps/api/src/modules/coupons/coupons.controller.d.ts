import { CouponsService } from './coupons.service';
export declare class CouponsController {
    private couponsService;
    constructor(couponsService: CouponsService);
    findAll(): Promise<{
        statusCode: number;
        data: import("../../database/entities/coupon.entity").Coupon[];
    }>;
    create(dto: any): Promise<{
        statusCode: number;
        data: import("../../database/entities/coupon.entity").Coupon[];
    }>;
    validate(body: {
        code: string;
        orderAmount: number;
    }): Promise<{
        statusCode: number;
        message: string;
        data?: undefined;
    } | {
        statusCode: number;
        data: {
            coupon: import("../../database/entities/coupon.entity").Coupon;
            discount: number;
        };
        message?: undefined;
    }>;
    update(id: string, dto: any): Promise<{
        statusCode: number;
        data: import("../../database/entities/coupon.entity").Coupon | null;
    }>;
    remove(id: string): Promise<{
        statusCode: number;
        data: {
            message: string;
        };
    }>;
}
