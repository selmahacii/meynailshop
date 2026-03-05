"use strict";
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
exports.CartService = void 0;
var common_1 = require("@nestjs/common");
var CartService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var CartService = _classThis = /** @class */ (function () {
        function CartService_1(cacheManager, productRepository, couponRepository) {
            this.cacheManager = cacheManager;
            this.productRepository = productRepository;
            this.couponRepository = couponRepository;
            this.CART_TTL = 30 * 24 * 60 * 60 * 1000; // 30 days in milliseconds
            this.CART_PREFIX = 'cart:';
        }
        CartService_1.prototype.getCartKey = function (userId) {
            return "".concat(this.CART_PREFIX).concat(userId);
        };
        CartService_1.prototype.addItem = function (userId, addToCartDto) {
            return __awaiter(this, void 0, void 0, function () {
                var product, cartKey, cart, existingItemIndex, cartItem, newQuantity;
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, this.productRepository.findOne({
                                where: { id: addToCartDto.productId, isActive: true },
                            })];
                        case 1:
                            product = _b.sent();
                            if (!product) {
                                throw new common_1.NotFoundException('Product not found');
                            }
                            if (product.stock < addToCartDto.quantity) {
                                throw new common_1.BadRequestException('Insufficient stock available');
                            }
                            cartKey = this.getCartKey(userId);
                            return [4 /*yield*/, this.cacheManager.get(cartKey)];
                        case 2:
                            cart = (_b.sent()) || {
                                items: [],
                            };
                            existingItemIndex = cart.items.findIndex(function (item) { return item.productId === addToCartDto.productId; });
                            if (existingItemIndex >= 0) {
                                newQuantity = cart.items[existingItemIndex].quantity + addToCartDto.quantity;
                                if (newQuantity > product.stock) {
                                    throw new common_1.BadRequestException('Insufficient stock for this quantity');
                                }
                                cart.items[existingItemIndex].quantity = newQuantity;
                                cart.items[existingItemIndex].subtotal =
                                    newQuantity * cart.items[existingItemIndex].productPrice;
                                cartItem = cart.items[existingItemIndex];
                            }
                            else {
                                cartItem = {
                                    productId: product.id,
                                    quantity: addToCartDto.quantity,
                                    productName: product.name,
                                    productPrice: Number(product.price),
                                    productImage: ((_a = product.images) === null || _a === void 0 ? void 0 : _a[0]) || '',
                                    productSku: product.sku,
                                    subtotal: Number(product.price) * addToCartDto.quantity,
                                };
                                cart.items.push(cartItem);
                            }
                            return [4 /*yield*/, this.cacheManager.set(cartKey, cart, this.CART_TTL)];
                        case 3:
                            _b.sent();
                            return [2 /*return*/, cartItem];
                    }
                });
            });
        };
        CartService_1.prototype.updateItem = function (userId, productId, updateCartItemDto) {
            return __awaiter(this, void 0, void 0, function () {
                var product, cartKey, cart, itemIndex;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.productRepository.findOne({
                                where: { id: productId, isActive: true },
                            })];
                        case 1:
                            product = _a.sent();
                            if (!product) {
                                throw new common_1.NotFoundException('Product not found');
                            }
                            if (product.stock < updateCartItemDto.quantity) {
                                throw new common_1.BadRequestException('Insufficient stock available');
                            }
                            cartKey = this.getCartKey(userId);
                            return [4 /*yield*/, this.cacheManager.get(cartKey)];
                        case 2:
                            cart = (_a.sent()) || {
                                items: [],
                            };
                            itemIndex = cart.items.findIndex(function (item) { return item.productId === productId; });
                            if (itemIndex < 0) {
                                throw new common_1.NotFoundException('Item not found in cart');
                            }
                            cart.items[itemIndex].quantity = updateCartItemDto.quantity;
                            cart.items[itemIndex].subtotal =
                                updateCartItemDto.quantity * cart.items[itemIndex].productPrice;
                            return [4 /*yield*/, this.cacheManager.set(cartKey, cart, this.CART_TTL)];
                        case 3:
                            _a.sent();
                            return [2 /*return*/, cart.items[itemIndex]];
                    }
                });
            });
        };
        CartService_1.prototype.removeItem = function (userId, productId) {
            return __awaiter(this, void 0, void 0, function () {
                var cartKey, cart;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            cartKey = this.getCartKey(userId);
                            return [4 /*yield*/, this.cacheManager.get(cartKey)];
                        case 1:
                            cart = (_a.sent()) || {
                                items: [],
                            };
                            cart.items = cart.items.filter(function (item) { return item.productId !== productId; });
                            if (!(cart.items.length === 0)) return [3 /*break*/, 3];
                            return [4 /*yield*/, this.cacheManager.del(cartKey)];
                        case 2:
                            _a.sent();
                            return [3 /*break*/, 5];
                        case 3: return [4 /*yield*/, this.cacheManager.set(cartKey, cart, this.CART_TTL)];
                        case 4:
                            _a.sent();
                            _a.label = 5;
                        case 5: return [2 /*return*/];
                    }
                });
            });
        };
        CartService_1.prototype.getCart = function (userId) {
            return __awaiter(this, void 0, void 0, function () {
                var cartKey, result;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            cartKey = this.getCartKey(userId);
                            return [4 /*yield*/, this.cacheManager.get(cartKey)];
                        case 1:
                            result = _a.sent();
                            return [2 /*return*/, result !== null && result !== void 0 ? result : null];
                    }
                });
            });
        };
        CartService_1.prototype.getCartItems = function (userId) {
            return __awaiter(this, void 0, void 0, function () {
                var cart;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.getCart(userId)];
                        case 1:
                            cart = _a.sent();
                            return [2 /*return*/, (cart === null || cart === void 0 ? void 0 : cart.items) || []];
                    }
                });
            });
        };
        CartService_1.prototype.clearCart = function (userId) {
            return __awaiter(this, void 0, void 0, function () {
                var cartKey;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            cartKey = this.getCartKey(userId);
                            return [4 /*yield*/, this.cacheManager.del(cartKey)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        CartService_1.prototype.applyCoupon = function (userId, couponCode) {
            return __awaiter(this, void 0, void 0, function () {
                var cartKey, cart, coupon, subtotal, discount;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            cartKey = this.getCartKey(userId);
                            return [4 /*yield*/, this.cacheManager.get(cartKey)];
                        case 1:
                            cart = (_a.sent()) || {
                                items: [],
                            };
                            if (cart.items.length === 0) {
                                throw new common_1.BadRequestException('Cart is empty');
                            }
                            return [4 /*yield*/, this.couponRepository.findOne({
                                    where: {
                                        code: couponCode,
                                        isActive: true,
                                    },
                                })];
                        case 2:
                            coupon = _a.sent();
                            if (!coupon) {
                                throw new common_1.BadRequestException('Invalid coupon code');
                            }
                            if (new Date() > coupon.expiresAt) {
                                throw new common_1.BadRequestException('Coupon has expired');
                            }
                            if (coupon.usedCount >= coupon.maxUses) {
                                throw new common_1.BadRequestException('Coupon usage limit reached');
                            }
                            subtotal = this.calculateSubtotal(cart.items);
                            if (subtotal < Number(coupon.minOrderAmount)) {
                                throw new common_1.BadRequestException("Minimum order amount for this coupon is ".concat(coupon.minOrderAmount));
                            }
                            discount = 0;
                            if (coupon.type === 'percentage') {
                                discount = (subtotal * Number(coupon.value)) / 100;
                            }
                            else {
                                discount = Number(coupon.value);
                            }
                            cart.couponCode = couponCode;
                            cart.couponDiscount = discount;
                            return [4 /*yield*/, this.cacheManager.set(cartKey, cart, this.CART_TTL)];
                        case 3:
                            _a.sent();
                            return [2 /*return*/, cart];
                    }
                });
            });
        };
        CartService_1.prototype.removeCoupon = function (userId) {
            return __awaiter(this, void 0, void 0, function () {
                var cartKey, cart;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            cartKey = this.getCartKey(userId);
                            return [4 /*yield*/, this.cacheManager.get(cartKey)];
                        case 1:
                            cart = (_a.sent()) || {
                                items: [],
                            };
                            delete cart.couponCode;
                            delete cart.couponDiscount;
                            return [4 /*yield*/, this.cacheManager.set(cartKey, cart, this.CART_TTL)];
                        case 2:
                            _a.sent();
                            return [2 /*return*/, cart];
                    }
                });
            });
        };
        CartService_1.prototype.calculateSubtotal = function (items) {
            return items.reduce(function (sum, item) { return sum + item.subtotal; }, 0);
        };
        CartService_1.prototype.calculateTax = function (subtotal, taxRate) {
            if (taxRate === void 0) { taxRate = 0; }
            return (subtotal * taxRate) / 100;
        };
        CartService_1.prototype.getCartSummary = function (userId) {
            return __awaiter(this, void 0, void 0, function () {
                var cart, subtotal, tax, shippingCost, couponDiscount, total;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.getCart(userId)];
                        case 1:
                            cart = _a.sent();
                            if (!cart || cart.items.length === 0) {
                                return [2 /*return*/, {
                                        items: [],
                                        itemCount: 0,
                                        subtotal: 0,
                                        tax: 0,
                                        shippingCost: 0,
                                        couponDiscount: 0,
                                        total: 0,
                                    }];
                            }
                            subtotal = this.calculateSubtotal(cart.items);
                            tax = this.calculateTax(subtotal, 0);
                            shippingCost = cart.shippingCost || 300;
                            couponDiscount = cart.couponDiscount || 0;
                            total = subtotal + tax + shippingCost - couponDiscount;
                            return [2 /*return*/, {
                                    items: cart.items,
                                    itemCount: cart.items.length,
                                    subtotal: subtotal,
                                    tax: tax,
                                    shippingCost: shippingCost,
                                    couponDiscount: couponDiscount,
                                    couponCode: cart.couponCode,
                                    total: Math.max(0, total),
                                }];
                    }
                });
            });
        };
        CartService_1.prototype.exists = function (userId) {
            return __awaiter(this, void 0, void 0, function () {
                var cart;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.getCart(userId)];
                        case 1:
                            cart = _a.sent();
                            return [2 /*return*/, cart !== null && cart.items.length > 0];
                    }
                });
            });
        };
        CartService_1.prototype.getCartSize = function (userId) {
            return __awaiter(this, void 0, void 0, function () {
                var items;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.getCartItems(userId)];
                        case 1:
                            items = _a.sent();
                            return [2 /*return*/, items.reduce(function (sum, item) { return sum + item.quantity; }, 0)];
                    }
                });
            });
        };
        return CartService_1;
    }());
    __setFunctionName(_classThis, "CartService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        CartService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return CartService = _classThis;
}();
exports.CartService = CartService;
