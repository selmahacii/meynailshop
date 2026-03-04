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
exports.CartController = void 0;
var common_1 = require("@nestjs/common");
var jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
var CartController = function () {
    var _classDecorators = [(0, common_1.Controller)('cart')];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _instanceExtraInitializers = [];
    var _getCart_decorators;
    var _getCartItems_decorators;
    var _getCartCount_decorators;
    var _addItem_decorators;
    var _updateItem_decorators;
    var _removeItem_decorators;
    var _applyCoupon_decorators;
    var _removeCoupon_decorators;
    var _clearCart_decorators;
    var _validateCart_decorators;
    var CartController = _classThis = /** @class */ (function () {
        function CartController_1(cartService) {
            this.cartService = (__runInitializers(this, _instanceExtraInitializers), cartService);
        }
        CartController_1.prototype.getCart = function (user) {
            return __awaiter(this, void 0, void 0, function () {
                var summary;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.cartService.getCartSummary(user.id)];
                        case 1:
                            summary = _a.sent();
                            return [2 /*return*/, {
                                    statusCode: 200,
                                    data: summary,
                                }];
                    }
                });
            });
        };
        CartController_1.prototype.getCartItems = function (user) {
            return __awaiter(this, void 0, void 0, function () {
                var items;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.cartService.getCartItems(user.id)];
                        case 1:
                            items = _a.sent();
                            return [2 /*return*/, {
                                    statusCode: 200,
                                    data: {
                                        items: items,
                                        count: items.length,
                                    },
                                }];
                    }
                });
            });
        };
        CartController_1.prototype.getCartCount = function (user) {
            return __awaiter(this, void 0, void 0, function () {
                var count;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.cartService.getCartSize(user.id)];
                        case 1:
                            count = _a.sent();
                            return [2 /*return*/, {
                                    statusCode: 200,
                                    data: { count: count },
                                }];
                    }
                });
            });
        };
        CartController_1.prototype.addItem = function (user, addToCartDto) {
            return __awaiter(this, void 0, void 0, function () {
                var cartItem;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.cartService.addItem(user.id, addToCartDto)];
                        case 1:
                            cartItem = _a.sent();
                            return [2 /*return*/, {
                                    statusCode: 201,
                                    message: 'Item added to cart',
                                    data: cartItem,
                                }];
                    }
                });
            });
        };
        CartController_1.prototype.updateItem = function (user, productId, updateCartItemDto) {
            return __awaiter(this, void 0, void 0, function () {
                var cartItem;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.cartService.updateItem(user.id, productId, updateCartItemDto)];
                        case 1:
                            cartItem = _a.sent();
                            return [2 /*return*/, {
                                    statusCode: 200,
                                    message: 'Cart item updated',
                                    data: cartItem,
                                }];
                    }
                });
            });
        };
        CartController_1.prototype.removeItem = function (user, productId) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.cartService.removeItem(user.id, productId)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/, {
                                    statusCode: 200,
                                    message: 'Item removed from cart',
                                }];
                    }
                });
            });
        };
        CartController_1.prototype.applyCoupon = function (user, body) {
            return __awaiter(this, void 0, void 0, function () {
                var cart, summary;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.cartService.applyCoupon(user.id, body.couponCode)];
                        case 1:
                            cart = _a.sent();
                            return [4 /*yield*/, this.cartService.getCartSummary(user.id)];
                        case 2:
                            summary = _a.sent();
                            return [2 /*return*/, {
                                    statusCode: 200,
                                    message: 'Coupon applied successfully',
                                    data: summary,
                                }];
                    }
                });
            });
        };
        CartController_1.prototype.removeCoupon = function (user) {
            return __awaiter(this, void 0, void 0, function () {
                var summary;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.cartService.removeCoupon(user.id)];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, this.cartService.getCartSummary(user.id)];
                        case 2:
                            summary = _a.sent();
                            return [2 /*return*/, {
                                    statusCode: 200,
                                    message: 'Coupon removed',
                                    data: summary,
                                }];
                    }
                });
            });
        };
        CartController_1.prototype.clearCart = function (user) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.cartService.clearCart(user.id)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/, {
                                    statusCode: 200,
                                    message: 'Cart cleared',
                                }];
                    }
                });
            });
        };
        CartController_1.prototype.validateCart = function (user) {
            return __awaiter(this, void 0, void 0, function () {
                var summary;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.cartService.getCartSummary(user.id)];
                        case 1:
                            summary = _a.sent();
                            if (summary.itemCount === 0) {
                                return [2 /*return*/, {
                                        statusCode: 400,
                                        message: 'Cart is empty',
                                        data: { valid: false },
                                    }];
                            }
                            return [2 /*return*/, {
                                    statusCode: 200,
                                    message: 'Cart is valid',
                                    data: {
                                        valid: true,
                                        summary: summary,
                                    },
                                }];
                    }
                });
            });
        };
        return CartController_1;
    }());
    __setFunctionName(_classThis, "CartController");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _getCart_decorators = [(0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard), (0, common_1.Get)()];
        _getCartItems_decorators = [(0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard), (0, common_1.Get)('items')];
        _getCartCount_decorators = [(0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard), (0, common_1.Get)('count')];
        _addItem_decorators = [(0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard), (0, common_1.Post)('items'), (0, common_1.HttpCode)(common_1.HttpStatus.CREATED)];
        _updateItem_decorators = [(0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard), (0, common_1.Patch)('items/:productId')];
        _removeItem_decorators = [(0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard), (0, common_1.Delete)('items/:productId')];
        _applyCoupon_decorators = [(0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard), (0, common_1.Post)('coupon')];
        _removeCoupon_decorators = [(0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard), (0, common_1.Delete)('coupon')];
        _clearCart_decorators = [(0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard), (0, common_1.Delete)()];
        _validateCart_decorators = [(0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard), (0, common_1.Post)('validate')];
        __esDecorate(_classThis, null, _getCart_decorators, { kind: "method", name: "getCart", static: false, private: false, access: { has: function (obj) { return "getCart" in obj; }, get: function (obj) { return obj.getCart; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getCartItems_decorators, { kind: "method", name: "getCartItems", static: false, private: false, access: { has: function (obj) { return "getCartItems" in obj; }, get: function (obj) { return obj.getCartItems; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getCartCount_decorators, { kind: "method", name: "getCartCount", static: false, private: false, access: { has: function (obj) { return "getCartCount" in obj; }, get: function (obj) { return obj.getCartCount; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _addItem_decorators, { kind: "method", name: "addItem", static: false, private: false, access: { has: function (obj) { return "addItem" in obj; }, get: function (obj) { return obj.addItem; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _updateItem_decorators, { kind: "method", name: "updateItem", static: false, private: false, access: { has: function (obj) { return "updateItem" in obj; }, get: function (obj) { return obj.updateItem; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _removeItem_decorators, { kind: "method", name: "removeItem", static: false, private: false, access: { has: function (obj) { return "removeItem" in obj; }, get: function (obj) { return obj.removeItem; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _applyCoupon_decorators, { kind: "method", name: "applyCoupon", static: false, private: false, access: { has: function (obj) { return "applyCoupon" in obj; }, get: function (obj) { return obj.applyCoupon; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _removeCoupon_decorators, { kind: "method", name: "removeCoupon", static: false, private: false, access: { has: function (obj) { return "removeCoupon" in obj; }, get: function (obj) { return obj.removeCoupon; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _clearCart_decorators, { kind: "method", name: "clearCart", static: false, private: false, access: { has: function (obj) { return "clearCart" in obj; }, get: function (obj) { return obj.clearCart; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _validateCart_decorators, { kind: "method", name: "validateCart", static: false, private: false, access: { has: function (obj) { return "validateCart" in obj; }, get: function (obj) { return obj.validateCart; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        CartController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return CartController = _classThis;
}();
exports.CartController = CartController;
