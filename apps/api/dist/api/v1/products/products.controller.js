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
exports.ProductsController = void 0;
const common_1 = require("@nestjs/common");
const products_service_1 = require("./products.service");
let ProductsController = class ProductsController {
    constructor(productsService) {
        this.productsService = productsService;
    }
    async findAll(page, limit, search) {
        const result = await this.productsService.findAll(parseInt(page || '1'), parseInt(limit || '10'), search);
        return {
            success: true,
            data: {
                items: result.data,
                total: result.pagination.total,
                page: result.pagination.page,
                limit: result.pagination.limit,
                totalPages: result.pagination.pages,
                hasNext: result.pagination.page < result.pagination.pages,
                hasPrev: result.pagination.page > 1,
            },
        };
    }
    async getLowStock(threshold) {
        try {
            const thresholdVal = parseInt(threshold) || 5;
            const data = await this.productsService.getLowStockProducts(thresholdVal);
            const items = Array.isArray(data) ? data : [];
            return {
                success: true,
                data: {
                    items: items,
                    total: items.length,
                    page: 1,
                    limit: items.length,
                    totalPages: 1,
                    hasNext: false,
                    hasPrev: false,
                },
            };
        }
        catch (error) {
            console.error('❌ [ProductsV1] getLowStock Error:', error);
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Internal server error',
            };
        }
    }
    async findOne(id) {
        return {
            success: true,
            data: await this.productsService.findOne(id),
        };
    }
    async create(createProductDto) {
        try {
            const data = await this.productsService.create(createProductDto);
            return { success: true, data };
        }
        catch (error) {
            console.error('❌ [ProductsV1] create Error:', error);
            throw error;
        }
    }
    async update(id, updateProductDto) {
        try {
            const data = await this.productsService.update(id, updateProductDto);
            return { success: true, data };
        }
        catch (error) {
            console.error('❌ [ProductsV1] update Error:', error);
            throw error;
        }
    }
    async remove(id) {
        return {
            success: true,
            data: await this.productsService.remove(id),
        };
    }
};
exports.ProductsController = ProductsController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('search')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('low-stock'),
    __param(0, (0, common_1.Query)('threshold')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "getLowStock", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "remove", null);
exports.ProductsController = ProductsController = __decorate([
    (0, common_1.Controller)('v1/admin/products'),
    __metadata("design:paramtypes", [products_service_1.ProductsService])
], ProductsController);
//# sourceMappingURL=products.controller.js.map