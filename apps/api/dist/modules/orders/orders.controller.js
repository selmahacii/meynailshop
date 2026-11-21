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
exports.OrdersController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
const orders_service_1 = require("./orders.service");
const order_items_service_1 = require("./order-items.service");
const cart_service_1 = require("../cart/cart.service");
const create_order_dto_1 = require("./dto/create-order.dto");
const update_order_status_dto_1 = require("./dto/update-order-status.dto");
const orders_query_dto_1 = require("./dto/orders-query.dto");
let OrdersController = class OrdersController {
    constructor(ordersService, orderItemsService, cartService) {
        this.ordersService = ordersService;
        this.orderItemsService = orderItemsService;
        this.cartService = cartService;
    }
    async create(user, createOrderDto) {
        let cartItemsArray = [];
        if (user) {
            const cartItems = await this.cartService.getCartItems(user.id);
            cartItemsArray = cartItems.map((item) => ({
                productId: item.productId,
                quantity: item.quantity,
            }));
        }
        else {
            cartItemsArray = createOrderDto.items || [];
        }
        const order = await this.ordersService.create(user?.id || null, createOrderDto, cartItemsArray);
        if (user) {
            await this.cartService.clearCart(user.id);
        }
        return {
            statusCode: 201,
            message: 'Order created successfully',
            data: order,
        };
    }
    async createFromLandingPage(body) {
        const customerName = (body.customerName || body.name || 'Selma').trim();
        const customerPhone = (body.customerPhone || body.phone || '').trim().replace(/\s+/g, '');
        const wilayaName = body.shippingAddress?.wilayaName || body.wilayaName || body.wilaya || 'Alger';
        const commune = (body.shippingAddress?.commune || body.commune || 'البلدية المركزية').trim();
        const fullAddress = body.shippingAddress?.fullAddress || body.address || `${wilayaName} — ${commune}`;
        const rawDeliveryType = body.shippingAddress?.deliveryType || body.deliveryType || 'home';
        const deliveryType = (rawDeliveryType === 'desk' || rawDeliveryType === 'office') ? 'office' : 'home';
        const landingPageTitle = body.landingPageTitle || body.title || 'باك متكامل للأظافر';
        const landingPageSlug = body.landingPageSlug || body.slug || 'pack-onglerie';
        const variantName = body.items?.[0]?.variantName || body.variantName || null;
        const price = Number(body.productPrice || body.items?.[0]?.price || body.price || 6500);
        const image = body.items?.[0]?.image || body.image || '';
        const nameParts = customerName.split(/\s+/);
        const firstName = nameParts[0] || 'Selma';
        const lastName = nameParts.slice(1).join(' ') || '';
        const createOrderDto = {
            deliveryType,
            paymentMethod: 'cash_on_delivery',
            source: 'instagram',
            notes: `[Commande Landing Page: /lp/${landingPageSlug}] - ${landingPageTitle}${variantName ? ` (${variantName})` : ''}`,
            shippingAddress: {
                fullName: customerName,
                firstName: firstName,
                lastName: lastName,
                phone: customerPhone,
                wilaya: wilayaName,
                wilayaName: wilayaName,
                commune: commune,
                address: fullAddress,
                fullAddress: fullAddress,
                deliveryType,
            },
        };
        const cartItems = [
            {
                productName: `${landingPageTitle}${variantName ? ` (${variantName})` : ''}`,
                productImage: image,
                unitPrice: price,
                quantity: 1,
                variantSku: `LP-${landingPageSlug.toUpperCase()}`,
            },
        ];
        const order = await this.ordersService.create(null, createOrderDto, cartItems);
        return {
            statusCode: 201,
            success: true,
            message: 'Landing page order created successfully',
            data: order,
        };
    }
    async findAll(user, query) {
        const isAdmin = user.role === 'admin';
        const result = await this.ordersService.findAll(user.id, query, isAdmin);
        return {
            statusCode: 200,
            data: result,
        };
    }
    async getStats(user) {
        const isAdmin = user.role === 'admin';
        const stats = await this.ordersService.getOrderStats(user.id, isAdmin);
        return {
            statusCode: 200,
            data: stats,
        };
    }
    async findOne(user, id) {
        const isAdmin = user.role === 'admin';
        const order = await this.ordersService.findOneWithItems(id, !isAdmin ? user.id : undefined);
        return {
            statusCode: 200,
            data: order,
        };
    }
    async getOrderItems(user, id) {
        const isAdmin = user.role === 'admin';
        const order = await this.ordersService.findOne(id, !isAdmin ? user.id : undefined);
        const items = await this.orderItemsService.findByOrderId(id);
        const stats = await this.orderItemsService.getOrderItemsStats(id);
        return {
            statusCode: 200,
            data: {
                items,
                stats,
            },
        };
    }
    async updateStatus(id, updateOrderStatusDto) {
        const order = await this.ordersService.updateStatus(id, updateOrderStatusDto);
        return {
            statusCode: 200,
            message: 'Order status updated successfully',
            data: order,
        };
    }
    async cancelOrder(user, id, body) {
        const order = await this.ordersService.cancel(id, user.id, body.reason);
        return {
            statusCode: 200,
            message: 'Order cancelled successfully',
            data: order,
        };
    }
    async getTrackingInfo(user, id) {
        const isAdmin = user.role === 'admin';
        const order = await this.ordersService.findOne(id, !isAdmin ? user.id : undefined);
        return {
            statusCode: 200,
            data: {
                orderNumber: order.orderNumber,
                status: order.status,
                trackingNumber: order.trackingNumber,
                shippedAt: order.shippedAt,
                deliveredAt: order.deliveredAt,
            },
        };
    }
};
exports.OrdersController = OrdersController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_order_dto_1.CreateOrderDto]),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "create", null);
__decorate([
    (0, common_1.Post)('landing-page'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "createFromLandingPage", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)(),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, orders_query_dto_1.OrdersQueryDto]),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "findAll", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('stats'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "getStats", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)(':id'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "findOne", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)(':id/items'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "getOrderItems", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('admin'),
    (0, common_1.Patch)(':id/status'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_order_status_dto_1.UpdateOrderStatusDto]),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "updateStatus", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Patch)(':id/cancel'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "cancelOrder", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)(':id/tracking'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "getTrackingInfo", null);
exports.OrdersController = OrdersController = __decorate([
    (0, common_1.Controller)('orders'),
    __metadata("design:paramtypes", [orders_service_1.OrdersService,
        order_items_service_1.OrderItemsService,
        cart_service_1.CartService])
], OrdersController);
//# sourceMappingURL=orders.controller.js.map