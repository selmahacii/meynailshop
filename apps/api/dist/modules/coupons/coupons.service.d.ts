import { Repository } from 'typeorm';
import { Coupon } from '../../database/entities/coupon.entity';
export declare class CouponsService {
    private couponRepository;
    constructor(couponRepository: Repository<Coupon>);
    create(dto: any): Promise<Coupon[]>;
    findAll(): Promise<Coupon[]>;
    findByCode(code: string): Promise<Coupon>;
    validateCoupon(code: string, orderAmount: number): Promise<{
        coupon: Coupon;
        discount: number;
    }>;
    useCoupon(code: string): Promise<void>;
    update(id: string, dto: any): Promise<Coupon>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
