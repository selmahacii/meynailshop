"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrdersService = void 0;
var common_1 = require("@nestjs/common");
var typeorm_1 = require("typeorm");
var order_entity_1 = require("../../database/entities/order.entity");
var order_item_entity_1 = require("../../database/entities/order-item.entity");
var product_entity_1 = require("../../database/entities/product.entity");
var coupon_entity_1 = require("../../database/entities/coupon.entity");
var order_number_util_1 = require("../../common/utils/order-number.util");
var OrdersService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var OrdersService = _classThis = /** @class */ (function () {
        function OrdersService_1(orderRepository, orderItemRepository, addressRepository, productRepository, couponRepository, dataSource) {
            this.orderRepository = orderRepository;
            this.orderItemRepository = orderItemRepository;
            this.addressRepository = addressRepository;
            this.productRepository = productRepository;
            this.couponRepository = couponRepository;
            this.dataSource = dataSource;
        }
        OrdersService_1.prototype.create = function (userId, createOrderDto, cartItems) {
            return __awaiter(this, void 0, void 0, function () {
                var address, queryRunner, subtotal, items, _i, cartItems_1, cartItem, product, itemSubtotal, orderItem, discount, coupon, shippingCost, total, order, savedOrder, _a, items_1, item, result, error_1;
                var _b;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            if (!cartItems || cartItems.length === 0) {
                                throw new common_1.BadRequestException('Cart is empty');
                            }
                            return [4 /*yield*/, this.addressRepository.findOne({
                                    where: { id: createOrderDto.addressId, userId: userId },
                                })];
                        case 1:
                            address = _c.sent();
                            if (!address) {
                                throw new common_1.NotFoundException('Address not found');
                            }
                            queryRunner = this.dataSource.createQueryRunner();
                            return [4 /*yield*/, queryRunner.connect()];
                        case 2:
                            _c.sent();
                            return [4 /*yield*/, queryRunner.startTransaction()];
                        case 3:
                            _c.sent();
                            _c.label = 4;
                        case 4:
                            _c.trys.push([4, 17, 19, 21]);
                            subtotal = 0;
                            items = [];
                            _i = 0, cartItems_1 = cartItems;
                            _c.label = 5;
                        case 5:
                            if (!(_i < cartItems_1.length)) return [3 /*break*/, 9];
                            cartItem = cartItems_1[_i];
                            return [4 /*yield*/, queryRunner.manager.findOne(product_entity_1.Product, {
                                    where: { id: cartItem.productId, isActive: true },
                                })];
                        case 6:
                            product = _c.sent();
                            if (!product) {
                                throw new common_1.NotFoundException("Product ".concat(cartItem.productId, " not found"));
                            }
                            if (product.stock < cartItem.quantity) {
                                throw new common_1.BadRequestException("Insufficient stock for ".concat(product.name));
                            }
                            itemSubtotal = Number(product.price) * cartItem.quantity;
                            subtotal += itemSubtotal;
                            orderItem = this.orderItemRepository.create({
                                productId: product.id,
                                productName: product.name,
                                productSku: product.sku,
                                productImage: ((_b = product.images) === null || _b === void 0 ? void 0 : _b[0]) || '',
                                unitPrice: Number(product.price),
                                quantity: cartItem.quantity,
                                subtotal: itemSubtotal,
                            });
                            items.push(orderItem);
                            // Update product stock
                            product.stock -= cartItem.quantity;
                            return [4 /*yield*/, queryRunner.manager.save(product_entity_1.Product, product)];
                        case 7:
                            _c.sent();
                            _c.label = 8;
                        case 8:
                            _i++;
                            return [3 /*break*/, 5];
                        case 9:
                            discount = 0;
                            if (!createOrderDto.couponCode) return [3 /*break*/, 12];
                            return [4 /*yield*/, queryRunner.manager.findOne(coupon_entity_1.Coupon, {
                                    where: {
                                        code: createOrderDto.couponCode,
                                        isActive: true,
                                        expiresAt: (0, typeorm_1.Between)(new Date(0), new Date()),
                                    },
                                })];
                        case 10:
                            coupon = _c.sent();
                            if (!coupon) {
                                throw new common_1.BadRequestException('Invalid or expired coupon code');
                            }
                            if (coupon.usedCount >= coupon.maxUses) {
                                throw new common_1.BadRequestException('Coupon usage limit reached');
                            }
                            if (subtotal < Number(coupon.minOrderAmount)) {
                                throw new common_1.BadRequestException("Minimum order amount for this coupon is ".concat(coupon.minOrderAmount));
                            }
                            if (coupon.type === 'percentage') {
                                discount = (subtotal * Number(coupon.value)) / 100;
                            }
                            else {
                                discount = Number(coupon.value);
                            }
                            coupon.usedCount += 1;
                            return [4 /*yield*/, queryRunner.manager.save(coupon_entity_1.Coupon, coupon)];
                        case 11:
                            _c.sent();
                            _c.label = 12;
                        case 12:
                            shippingCost = 300;
                            total = subtotal - discount + shippingCost;
                            order = this.orderRepository.create({
                                userId: userId,
                                orderNumber: (0, order_number_util_1.generateOrderNumber)(),
                                status: 'pending',
                                paymentStatus: 'pending',
                                paymentMethod: createOrderDto.paymentMethod,
                                subtotal: subtotal,
                                shippingCost: shippingCost,
                                discount: discount,
                                total: total,
                                shippingAddressSnapshot: {
                                    label: address.label,
                                    fullName: address.fullName,
                                    phone: address.phone,
                                    wilaya: address.wilaya,
                                    commune: address.commune,
                                    address: address.address,
                                    postalCode: address.postalCode,
                                },
                                notes: createOrderDto.notes,
                            });
                            return [4 /*yield*/, queryRunner.manager.save(order_entity_1.Order, order)];
                        case 13:
                            savedOrder = _c.sent();
                            for (_a = 0, items_1 = items; _a < items_1.length; _a++) {
                                item = items_1[_a];
                                item.orderId = savedOrder.id;
                            }
                            return [4 /*yield*/, queryRunner.manager.save(order_item_entity_1.OrderItem, items)];
                        case 14:
                            _c.sent();
                            return [4 /*yield*/, queryRunner.commitTransaction()];
                        case 15:
                            _c.sent();
                            return [4 /*yield*/, this.orderRepository.findOne({
                                    where: { id: savedOrder.id },
                                    relations: ['user'],
                                })];
                        case 16:
                            result = _c.sent();
                            if (!result)
                                throw new common_1.InternalServerErrorException('Order not found after creation');
                            return [2 /*return*/, result];
                        case 17:
                            error_1 = _c.sent();
                            return [4 /*yield*/, queryRunner.rollbackTransaction()];
                        case 18:
                            _c.sent();
                            throw error_1;
                        case 19: return [4 /*yield*/, queryRunner.release()];
                        case 20:
                            _c.sent();
                            return [7 /*endfinally*/];
                        case 21: return [2 /*return*/];
                    }
                });
            });
        };
        OrdersService_1.prototype.findAll = function (userId_1, query_1) {
            return __awaiter(this, arguments, void 0, function (userId, query, isAdmin) {
                var skip, where, dateRange, dateTo, order, _a, orders, total;
                if (isAdmin === void 0) { isAdmin = false; }
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            skip = (query.page - 1) * query.limit;
                            where = {};
                            if (!isAdmin) {
                                where.userId = userId;
                            }
                            if (query.status) {
                                where.status = query.status;
                            }
                            if (query.paymentStatus) {
                                where.paymentStatus = query.paymentStatus;
                            }
                            if (query.paymentMethod) {
                                where.paymentMethod = query.paymentMethod;
                            }
                            if (query.orderNumber) {
                                where.orderNumber = query.orderNumber;
                            }
                            if (query.dateFrom || query.dateTo) {
                                dateRange = {};
                                if (query.dateFrom) {
                                    dateRange.gte = new Date(query.dateFrom);
                                }
                                if (query.dateTo) {
                                    dateTo = new Date(query.dateTo);
                                    dateTo.setHours(23, 59, 59, 999);
                                    dateRange.lte = dateTo;
                                }
                                where.createdAt = (0, typeorm_1.Between)(dateRange.gte || new Date(0), dateRange.lte || new Date());
                            }
                            order = {};
                            if (query.sortBy) {
                                order[query.sortBy] = query.order === 'asc' ? 'ASC' : 'DESC';
                            }
                            else {
                                order.createdAt = 'DESC';
                            }
                            return [4 /*yield*/, this.orderRepository.findAndCount({
                                    where: where,
                                    relations: ['user'],
                                    skip: skip,
                                    take: query.limit,
                                    order: order,
                                })];
                        case 1:
                            _a = _b.sent(), orders = _a[0], total = _a[1];
                            return [2 /*return*/, {
                                    items: orders,
                                    total: total,
                                    page: query.page,
                                    limit: query.limit,
                                    totalPages: Math.ceil(total / query.limit),
                                    hasNext: skip + query.limit < total,
                                    hasPrev: query.page > 1,
                                }];
                    }
                });
            });
        };
        OrdersService_1.prototype.findOne = function (id, userId) {
            return __awaiter(this, void 0, void 0, function () {
                var order;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.orderRepository.findOne({
                                where: { id: id },
                                relations: ['user'],
                            })];
                        case 1:
                            order = _a.sent();
                            if (!order) {
                                throw new common_1.NotFoundException('Order not found');
                            }
                            if (userId && order.userId !== userId) {
                                throw new common_1.BadRequestException('Unauthorized access to this order');
                            }
                            return [2 /*return*/, order];
                    }
                });
            });
        };
        OrdersService_1.prototype.findOneWithItems = function (id, userId) {
            return __awaiter(this, void 0, void 0, function () {
                var order, items;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.orderRepository.findOne({
                                where: { id: id },
                                relations: ['user'],
                            })];
                        case 1:
                            order = _a.sent();
                            if (!order) {
                                throw new common_1.NotFoundException('Order not found');
                            }
                            if (userId && order.userId !== userId) {
                                throw new common_1.BadRequestException('Unauthorized access to this order');
                            }
                            return [4 /*yield*/, this.orderItemRepository.find({
                                    where: { orderId: id },
                                })];
                        case 2:
                            items = _a.sent();
                            return [2 /*return*/, __assign(__assign({}, order), { items: items })];
                    }
                });
            });
        };
        OrdersService_1.prototype.updateStatus = function (id, updateOrderStatusDto) {
            return __awaiter(this, void 0, void 0, function () {
                var order, validTransitions;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.orderRepository.findOne({ where: { id: id } })];
                        case 1:
                            order = _a.sent();
                            if (!order) {
                                throw new common_1.NotFoundException('Order not found');
                            }
                            validTransitions = {
                                pending: ['confirmed', 'cancelled'],
                                confirmed: ['processing', 'cancelled'],
                                processing: ['shipped', 'cancelled'],
                                shipped: ['delivered'],
                                delivered: [],
                                cancelled: [],
                                refunded: [],
                            };
                            if (!validTransitions[order.status].includes(updateOrderStatusDto.status)) {
                                throw new common_1.BadRequestException("Cannot transition from ".concat(order.status, " to ").concat(updateOrderStatusDto.status));
                            }
                            order.status = updateOrderStatusDto.status;
                            if (updateOrderStatusDto.trackingNumber) {
                                order.trackingNumber = updateOrderStatusDto.trackingNumber;
                            }
                            if (updateOrderStatusDto.status === 'shipped') {
                                order.shippedAt = new Date();
                            }
                            else if (updateOrderStatusDto.status === 'delivered') {
                                order.deliveredAt = new Date();
                            }
                            else if (updateOrderStatusDto.status === 'cancelled') {
                                order.cancelledAt = new Date();
                            }
                            return [4 /*yield*/, this.orderRepository.save(order)];
                        case 2: return [2 /*return*/, _a.sent()];
                    }
                });
            });
        };
        OrdersService_1.prototype.cancel = function (id, userId, reason) {
            return __awaiter(this, void 0, void 0, function () {
                var order, queryRunner, items, _i, items_2, item, product, error_2;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.orderRepository.findOne({ where: { id: id } })];
                        case 1:
                            order = _a.sent();
                            if (!order) {
                                throw new common_1.NotFoundException('Order not found');
                            }
                            if (order.userId !== userId) {
                                throw new common_1.BadRequestException('Unauthorized access to this order');
                            }
                            if (!['pending', 'confirmed'].includes(order.status)) {
                                throw new common_1.BadRequestException('Only pending or confirmed orders can be cancelled');
                            }
                            queryRunner = this.dataSource.createQueryRunner();
                            return [4 /*yield*/, queryRunner.connect()];
                        case 2:
                            _a.sent();
                            return [4 /*yield*/, queryRunner.startTransaction()];
                        case 3:
                            _a.sent();
                            _a.label = 4;
                        case 4:
                            _a.trys.push([4, 13, 15, 17]);
                            return [4 /*yield*/, this.orderItemRepository.find({
                                    where: { orderId: id },
                                })];
                        case 5:
                            items = _a.sent();
                            _i = 0, items_2 = items;
                            _a.label = 6;
                        case 6:
                            if (!(_i < items_2.length)) return [3 /*break*/, 10];
                            item = items_2[_i];
                            return [4 /*yield*/, queryRunner.manager.findOne(product_entity_1.Product, {
                                    where: { id: item.productId },
                                })];
                        case 7:
                            product = _a.sent();
                            if (!product) return [3 /*break*/, 9];
                            product.stock += item.quantity;
                            return [4 /*yield*/, queryRunner.manager.save(product_entity_1.Product, product)];
                        case 8:
                            _a.sent();
                            _a.label = 9;
                        case 9:
                            _i++;
                            return [3 /*break*/, 6];
                        case 10:
                            order.status = 'cancelled';
                            order.cancelledAt = new Date();
                            order.cancellationReason = reason;
                            return [4 /*yield*/, queryRunner.manager.save(order_entity_1.Order, order)];
                        case 11:
                            _a.sent();
                            return [4 /*yield*/, queryRunner.commitTransaction()];
                        case 12:
                            _a.sent();
                            return [2 /*return*/, order];
                        case 13:
                            error_2 = _a.sent();
                            return [4 /*yield*/, queryRunner.rollbackTransaction()];
                        case 14:
                            _a.sent();
                            throw error_2;
                        case 15: return [4 /*yield*/, queryRunner.release()];
                        case 16:
                            _a.sent();
                            return [7 /*endfinally*/];
                        case 17: return [2 /*return*/];
                    }
                });
            });
        };
        OrdersService_1.prototype.getOrderStats = function (userId_1) {
            return __awaiter(this, arguments, void 0, function (userId, isAdmin) {
                var where, totalOrders, completedOrders, pendingOrders, cancelledOrders, totalRevenue;
                if (isAdmin === void 0) { isAdmin = false; }
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            where = isAdmin ? {} : { userId: userId };
                            return [4 /*yield*/, this.orderRepository.count({ where: where })];
                        case 1:
                            totalOrders = _a.sent();
                            return [4 /*yield*/, this.orderRepository.count({
                                    where: __assign(__assign({}, where), { status: 'delivered' }),
                                })];
                        case 2:
                            completedOrders = _a.sent();
                            return [4 /*yield*/, this.orderRepository.count({
                                    where: __assign(__assign({}, where), { status: 'pending' }),
                                })];
                        case 3:
                            pendingOrders = _a.sent();
                            return [4 /*yield*/, this.orderRepository.count({
                                    where: __assign(__assign({}, where), { status: 'cancelled' }),
                                })];
                        case 4:
                            cancelledOrders = _a.sent();
                            return [4 /*yield*/, this.orderRepository
                                    .createQueryBuilder('order')
                                    .select('SUM(order.total)', 'total')
                                    .where(isAdmin ? '1=1' : 'order.userId = :userId', { userId: userId })
                                    .andWhere('order.status = :status', { status: 'delivered' })
                                    .getRawOne()];
                        case 5:
                            totalRevenue = _a.sent();
                            return [2 /*return*/, {
                                    totalOrders: totalOrders,
                                    completedOrders: completedOrders,
                                    pendingOrders: pendingOrders,
                                    cancelledOrders: cancelledOrders,
                                    totalRevenue: Number((totalRevenue === null || totalRevenue === void 0 ? void 0 : totalRevenue.total) || 0),
                                }];
                    }
                });
            });
        };
        return OrdersService_1;
    }());
    __setFunctionName(_classThis, "OrdersService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        OrdersService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return OrdersService = _classThis;
}();
exports.OrdersService = OrdersService;
