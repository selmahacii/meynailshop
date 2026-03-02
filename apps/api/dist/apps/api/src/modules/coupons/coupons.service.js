"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CouponsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const coupon_entity_1 = require("../../database/entities/coupon.entity");
let CouponsService = class CouponsService {
    constructor(couponRepository) {
        this.couponRepository = couponRepository;
    }
    async create(dto) {
        const coupon = this.couponRepository.create(dto);
        return await this.couponRepository.save(coupon);
    }
    async findAll() {
        return this.couponRepository.find();
    }
    async findByCode(code) {
        return this.couponRepository.findOne({ where: { code } });
    }
    async validateCoupon(code, orderAmount) {
        const coupon = await this.findByCode(code);
        if (!coupon || !coupon.isActive)
            return null;
        if (new Date() > coupon.expiresAt)
            return null;
        if (coupon.usedCount >= coupon.maxUses)
            return null;
        if (orderAmount < coupon.minOrderAmount)
            return null;
        const discount = coupon.type === 'percentage'
            ? (orderAmount * coupon.value) / 100
            : coupon.value;
        return { coupon, discount };
    }
    async useCoupon(code) {
        const coupon = await this.findByCode(code);
        if (coupon) {
            coupon.usedCount++;
            await this.couponRepository.save(coupon);
        }
    }
    async update(id, dto) {
        await this.couponRepository.update(id, dto);
        return this.couponRepository.findOne({ where: { id } });
    }
    async remove(id) {
        await this.couponRepository.delete(id);
        return { message: 'Coupon deleted' };
    }
};
exports.CouponsService = CouponsService;
exports.CouponsService = CouponsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(coupon_entity_1.Coupon)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], CouponsService);
//# sourceMappingURL=coupons.service.js.map