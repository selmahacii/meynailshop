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
exports.ProductsService = void 0;
var common_1 = require("@nestjs/common");
var typeorm_1 = require("typeorm");
var slug_util_1 = require("../../common/utils/slug.util");
var ProductsService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var ProductsService = _classThis = /** @class */ (function () {
        function ProductsService_1(productRepository, categoryRepository) {
            this.productRepository = productRepository;
            this.categoryRepository = categoryRepository;
        }
        ProductsService_1.prototype.create = function (createProductDto) {
            return __awaiter(this, void 0, void 0, function () {
                var slug, existingProduct, product;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            slug = createProductDto.slug || (0, slug_util_1.generateSlug)(createProductDto.name);
                            return [4 /*yield*/, this.productRepository.findOne({
                                    where: [{ slug: slug }, { sku: createProductDto.sku }],
                                })];
                        case 1:
                            existingProduct = _a.sent();
                            if (existingProduct) {
                                throw new common_1.BadRequestException('Product with this slug or SKU already exists');
                            }
                            product = this.productRepository.create(__assign(__assign({}, createProductDto), { slug: slug }));
                            return [4 /*yield*/, this.productRepository.save(product)];
                        case 2: return [2 /*return*/, _a.sent()];
                    }
                });
            });
        };
        ProductsService_1.prototype.findAll = function (query) {
            return __awaiter(this, void 0, void 0, function () {
                var skip, where, order, _a, products, total;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            skip = (query.page - 1) * query.limit;
                            where = { isActive: true };
                            if (query.search) {
                                where.name = (0, typeorm_1.Like)("%".concat(query.search, "%"));
                            }
                            if (query.category) {
                                where.category = { slug: query.category };
                            }
                            if (query.minPrice || query.maxPrice) {
                                where.price = (0, typeorm_1.Between)(query.minPrice || 0, query.maxPrice || 999999);
                            }
                            if (query.badge) {
                                where.badge = query.badge;
                            }
                            if (query.inStock === 'true') {
                                where.stock = (0, typeorm_1.Between)(1, 999999);
                            }
                            order = {};
                            if (query.sortBy) {
                                order[query.sortBy] = query.order === 'asc' ? 'ASC' : 'DESC';
                            }
                            else {
                                order.createdAt = 'DESC';
                            }
                            return [4 /*yield*/, this.productRepository.findAndCount({
                                    where: where,
                                    relations: ['category'],
                                    skip: skip,
                                    take: query.limit,
                                    order: order,
                                })];
                        case 1:
                            _a = _b.sent(), products = _a[0], total = _a[1];
                            return [2 /*return*/, {
                                    items: products,
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
        ProductsService_1.prototype.findBySlug = function (slug) {
            return __awaiter(this, void 0, void 0, function () {
                var product;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.productRepository.findOne({
                                where: { slug: slug, isActive: true },
                                relations: ['category'],
                            })];
                        case 1:
                            product = _a.sent();
                            if (!product) {
                                throw new common_1.NotFoundException('Product not found');
                            }
                            return [2 /*return*/, product];
                    }
                });
            });
        };
        ProductsService_1.prototype.findFeatured = function () {
            return __awaiter(this, arguments, void 0, function (limit) {
                if (limit === void 0) { limit = 6; }
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.productRepository.find({
                            where: { isFeatured: true, isActive: true },
                            relations: ['category'],
                            take: limit,
                            order: { createdAt: 'DESC' },
                        })];
                });
            });
        };
        ProductsService_1.prototype.findOne = function (id) {
            return __awaiter(this, void 0, void 0, function () {
                var product;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.productRepository.findOne({
                                where: { id: id },
                                relations: ['category'],
                            })];
                        case 1:
                            product = _a.sent();
                            if (!product) {
                                throw new common_1.NotFoundException('Product not found');
                            }
                            return [2 /*return*/, product];
                    }
                });
            });
        };
        ProductsService_1.prototype.update = function (id, updateProductDto) {
            return __awaiter(this, void 0, void 0, function () {
                var product, existed;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.productRepository.findOne({ where: { id: id } })];
                        case 1:
                            product = _a.sent();
                            if (!product) {
                                throw new common_1.NotFoundException('Product not found');
                            }
                            if (!(updateProductDto.slug && updateProductDto.slug !== product.slug)) return [3 /*break*/, 3];
                            return [4 /*yield*/, this.productRepository.findOne({
                                    where: { slug: updateProductDto.slug },
                                })];
                        case 2:
                            existed = _a.sent();
                            if (existed) {
                                throw new common_1.BadRequestException('Slug already exists');
                            }
                            _a.label = 3;
                        case 3:
                            Object.assign(product, updateProductDto);
                            return [4 /*yield*/, this.productRepository.save(product)];
                        case 4: return [2 /*return*/, _a.sent()];
                    }
                });
            });
        };
        ProductsService_1.prototype.remove = function (id) {
            return __awaiter(this, void 0, void 0, function () {
                var product;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.productRepository.findOne({ where: { id: id } })];
                        case 1:
                            product = _a.sent();
                            if (!product) {
                                throw new common_1.NotFoundException('Product not found');
                            }
                            product.isActive = false;
                            return [4 /*yield*/, this.productRepository.save(product)];
                        case 2:
                            _a.sent();
                            return [2 /*return*/, { message: 'Product deactivated' }];
                    }
                });
            });
        };
        ProductsService_1.prototype.updateStock = function (id, quantity) {
            return __awaiter(this, void 0, void 0, function () {
                var product;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.productRepository.findOne({ where: { id: id } })];
                        case 1:
                            product = _a.sent();
                            if (!product) {
                                throw new common_1.NotFoundException('Product not found');
                            }
                            product.stock = quantity;
                            return [4 /*yield*/, this.productRepository.save(product)];
                        case 2: return [2 /*return*/, _a.sent()];
                    }
                });
            });
        };
        return ProductsService_1;
    }());
    __setFunctionName(_classThis, "ProductsService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ProductsService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ProductsService = _classThis;
}();
exports.ProductsService = ProductsService;
