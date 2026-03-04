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
exports.StockService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const stock_movement_entity_1 = require("../../database/entities/stock-movement.entity");
const product_entity_1 = require("../../database/entities/product.entity");
let StockService = class StockService {
    constructor(stockMovementRepository, productRepository) {
        this.stockMovementRepository = stockMovementRepository;
        this.productRepository = productRepository;
    }
    async adjustStock(productId, quantity, reason, reference) {
        const product = await this.productRepository.findOne({ where: { id: productId } });
        if (!product)
            throw new common_1.NotFoundException('Product not found');
        product.stock += quantity;
        await this.productRepository.save(product);
        const movement = this.stockMovementRepository.create({
            productId,
            quantity,
            reason,
            reference,
            type: quantity > 0 ? 'in' : 'out',
        });
        return await this.stockMovementRepository.save(movement);
    }
    async getMovements(productId) {
        const where = productId ? { productId } : {};
        return this.stockMovementRepository.find({
            where,
            order: { createdAt: 'DESC' },
        });
    }
    async getAlerts(alertThreshold = 5) {
        return this.productRepository.find({
            where: { stock: (0, typeorm_2.Between)(0, alertThreshold), isActive: true },
        });
    }
};
exports.StockService = StockService;
exports.StockService = StockService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(stock_movement_entity_1.StockMovement)),
    __param(1, (0, typeorm_1.InjectRepository)(product_entity_1.Product)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], StockService);
//# sourceMappingURL=stock.service.js.map