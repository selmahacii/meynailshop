import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Coupon } from '../../database/entities/coupon.entity';

@Injectable()
export class CouponsService {
  constructor(
    @InjectRepository(Coupon)
    private couponRepository: Repository<Coupon>,
  ) {}

  async create(dto: any) {
    const coupon = this.couponRepository.create(dto);
    return await this.couponRepository.save(coupon);
  }

  async findAll() {
    return this.couponRepository.find();
  }

  async findByCode(code: string) {
    return this.couponRepository.findOne({ where: { code } });
  }

  async validateCoupon(code: string, orderAmount: number) {
    const coupon = await this.findByCode(code);
    if (!coupon || !coupon.isActive) return null;
    if (new Date() > coupon.expiresAt) return null;
    if (coupon.usedCount >= coupon.maxUses) return null;
    if (orderAmount < coupon.minOrderAmount) return null;
    const discount = coupon.type === 'percentage'
      ? (orderAmount * coupon.value) / 100
      : coupon.value;
    return { coupon, discount };
  }

  async useCoupon(code: string) {
    const coupon = await this.findByCode(code);
    if (coupon) {
      coupon.usedCount++;
      await this.couponRepository.save(coupon);
    }
  }

  async update(id: string, dto: any) {
    await this.couponRepository.update(id, dto);
    return this.couponRepository.findOne({ where: { id } });
  }

  async remove(id: string) {
    await this.couponRepository.delete(id);
    return { message: 'Coupon deleted' };
  }
}
