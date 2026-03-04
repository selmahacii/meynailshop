"use strict";
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
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
exports.OrdersController = void 0;
var common_1 = require("@nestjs/common");
var jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
var roles_guard_1 = require("../auth/guards/roles.guard");
var roles_decorator_1 = require("../../common/decorators/roles.decorator");
var OrdersController = function () {
    var _classDecorators = [(0, common_1.Controller)('orders')];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _instanceExtraInitializers = [];
    var _create_decorators;
    var _findAll_decorators;
    var _getStats_decorators;
    var _findOne_decorators;
    var _getOrderItems_decorators;
    var _updateStatus_decorators;
    var _cancelOrder_decorators;
    var _getTrackingInfo_decorators;
    var OrdersController = _classThis = /** @class */ (function () {
        function OrdersController_1(ordersService, orderItemsService, cartService) {
            this.ordersService = (__runInitializers(this, _instanceExtraInitializers), ordersService);
            this.orderItemsService = orderItemsService;
            this.cartService = cartService;
        }
        OrdersController_1.prototype.create = function (user, createOrderDto) {
            return __awaiter(this, void 0, void 0, function () {
                var cartItems, cartItemsArray, order;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.cartService.getCartItems(user.id)];
                        case 1:
                            cartItems = _a.sent();
                            cartItemsArray = cartItems.map(function (item) { return ({
                                productId: item.productId,
                                quantity: item.quantity,
                            }); });
                            return [4 /*yield*/, this.ordersService.create(user.id, createOrderDto, cartItemsArray)];
                        case 2:
                            order = _a.sent();
                            // Clear the cart after successful order creation
                            return [4 /*yield*/, this.cartService.clearCart(user.id)];
                        case 3:
                            // Clear the cart after successful order creation
                            _a.sent();
                            return [2 /*return*/, {
                                    statusCode: 201,
                                    message: 'Order created successfully',
                                    data: order,
                                }];
                    }
                });
            });
        };
        OrdersController_1.prototype.findAll = function (user, query) {
            return __awaiter(this, void 0, void 0, function () {
                var isAdmin, result;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            isAdmin = user.role === 'admin';
                            return [4 /*yield*/, this.ordersService.findAll(user.id, query, isAdmin)];
                        case 1:
                            result = _a.sent();
                            return [2 /*return*/, {
                                    statusCode: 200,
                                    data: result,
                                }];
                    }
                });
            });
        };
        OrdersController_1.prototype.getStats = function (user) {
            return __awaiter(this, void 0, void 0, function () {
                var isAdmin, stats;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            isAdmin = user.role === 'admin';
                            return [4 /*yield*/, this.ordersService.getOrderStats(user.id, isAdmin)];
                        case 1:
                            stats = _a.sent();
                            return [2 /*return*/, {
                                    statusCode: 200,
                                    data: stats,
                                }];
                    }
                });
            });
        };
        OrdersController_1.prototype.findOne = function (user, id) {
            return __awaiter(this, void 0, void 0, function () {
                var isAdmin, order;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            isAdmin = user.role === 'admin';
                            return [4 /*yield*/, this.ordersService.findOneWithItems(id, !isAdmin ? user.id : undefined)];
                        case 1:
                            order = _a.sent();
                            return [2 /*return*/, {
                                    statusCode: 200,
                                    data: order,
                                }];
                    }
                });
            });
        };
        OrdersController_1.prototype.getOrderItems = function (user, id) {
            return __awaiter(this, void 0, void 0, function () {
                var isAdmin, order, items, stats;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            isAdmin = user.role === 'admin';
                            return [4 /*yield*/, this.ordersService.findOne(id, !isAdmin ? user.id : undefined)];
                        case 1:
                            order = _a.sent();
                            return [4 /*yield*/, this.orderItemsService.findByOrderId(id)];
                        case 2:
                            items = _a.sent();
                            return [4 /*yield*/, this.orderItemsService.getOrderItemsStats(id)];
                        case 3:
                            stats = _a.sent();
                            return [2 /*return*/, {
                                    statusCode: 200,
                                    data: {
                                        items: items,
                                        stats: stats,
                                    },
                                }];
                    }
                });
            });
        };
        OrdersController_1.prototype.updateStatus = function (id, updateOrderStatusDto) {
            return __awaiter(this, void 0, void 0, function () {
                var order;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.ordersService.updateStatus(id, updateOrderStatusDto)];
                        case 1:
                            order = _a.sent();
                            return [2 /*return*/, {
                                    statusCode: 200,
                                    message: 'Order status updated successfully',
                                    data: order,
                                }];
                    }
                });
            });
        };
        OrdersController_1.prototype.cancelOrder = function (user, id, body) {
            return __awaiter(this, void 0, void 0, function () {
                var order;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.ordersService.cancel(id, user.id, body.reason)];
                        case 1:
                            order = _a.sent();
                            return [2 /*return*/, {
                                    statusCode: 200,
                                    message: 'Order cancelled successfully',
                                    data: order,
                                }];
                    }
                });
            });
        };
        OrdersController_1.prototype.getTrackingInfo = function (user, id) {
            return __awaiter(this, void 0, void 0, function () {
                var isAdmin, order;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            isAdmin = user.role === 'admin';
                            return [4 /*yield*/, this.ordersService.findOne(id, !isAdmin ? user.id : undefined)];
                        case 1:
                            order = _a.sent();
                            return [2 /*return*/, {
                                    statusCode: 200,
                                    data: {
                                        orderNumber: order.orderNumber,
                                        status: order.status,
                                        trackingNumber: order.trackingNumber,
                                        shippedAt: order.shippedAt,
                                        deliveredAt: order.deliveredAt,
                                    },
                                }];
                    }
                });
            });
        };
        return OrdersController_1;
    }());
    __setFunctionName(_classThis, "OrdersController");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _create_decorators = [(0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard), (0, common_1.Post)(), (0, common_1.HttpCode)(common_1.HttpStatus.CREATED)];
        _findAll_decorators = [(0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard), (0, common_1.Get)()];
        _getStats_decorators = [(0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard), (0, common_1.Get)('stats')];
        _findOne_decorators = [(0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard), (0, common_1.Get)(':id')];
        _getOrderItems_decorators = [(0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard), (0, common_1.Get)(':id/items')];
        _updateStatus_decorators = [(0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard), (0, roles_decorator_1.Roles)('admin'), (0, common_1.Patch)(':id/status')];
        _cancelOrder_decorators = [(0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard), (0, common_1.Patch)(':id/cancel')];
        _getTrackingInfo_decorators = [(0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard), (0, common_1.Get)(':id/tracking')];
        __esDecorate(_classThis, null, _create_decorators, { kind: "method", name: "create", static: false, private: false, access: { has: function (obj) { return "create" in obj; }, get: function (obj) { return obj.create; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _findAll_decorators, { kind: "method", name: "findAll", static: false, private: false, access: { has: function (obj) { return "findAll" in obj; }, get: function (obj) { return obj.findAll; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getStats_decorators, { kind: "method", name: "getStats", static: false, private: false, access: { has: function (obj) { return "getStats" in obj; }, get: function (obj) { return obj.getStats; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _findOne_decorators, { kind: "method", name: "findOne", static: false, private: false, access: { has: function (obj) { return "findOne" in obj; }, get: function (obj) { return obj.findOne; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getOrderItems_decorators, { kind: "method", name: "getOrderItems", static: false, private: false, access: { has: function (obj) { return "getOrderItems" in obj; }, get: function (obj) { return obj.getOrderItems; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _updateStatus_decorators, { kind: "method", name: "updateStatus", static: false, private: false, access: { has: function (obj) { return "updateStatus" in obj; }, get: function (obj) { return obj.updateStatus; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _cancelOrder_decorators, { kind: "method", name: "cancelOrder", static: false, private: false, access: { has: function (obj) { return "cancelOrder" in obj; }, get: function (obj) { return obj.cancelOrder; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getTrackingInfo_decorators, { kind: "method", name: "getTrackingInfo", static: false, private: false, access: { has: function (obj) { return "getTrackingInfo" in obj; }, get: function (obj) { return obj.getTrackingInfo; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        OrdersController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return OrdersController = _classThis;
}();
exports.OrdersController = OrdersController;
