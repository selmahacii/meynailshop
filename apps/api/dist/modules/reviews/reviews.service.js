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
exports.ReviewsService = void 0;
var common_1 = require("@nestjs/common");
var ReviewsService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var ReviewsService = _classThis = /** @class */ (function () {
        function ReviewsService_1(reviewRepository, productRepository, orderRepository, orderItemRepository) {
            this.reviewRepository = reviewRepository;
            this.productRepository = productRepository;
            this.orderRepository = orderRepository;
            this.orderItemRepository = orderItemRepository;
        }
        ReviewsService_1.prototype.create = function (userId, createReviewDto) {
            return __awaiter(this, void 0, void 0, function () {
                var product, existingReview, order, orderItem, review;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.productRepository.findOne({
                                where: { id: createReviewDto.productId, isActive: true },
                            })];
                        case 1:
                            product = _a.sent();
                            if (!product) {
                                throw new common_1.NotFoundException('Product not found');
                            }
                            return [4 /*yield*/, this.reviewRepository.findOne({
                                    where: {
                                        userId: userId,
                                        productId: createReviewDto.productId,
                                    },
                                })];
                        case 2:
                            existingReview = _a.sent();
                            if (existingReview) {
                                throw new common_1.BadRequestException('You have already reviewed this product');
                            }
                            if (!createReviewDto.orderId) return [3 /*break*/, 5];
                            return [4 /*yield*/, this.orderRepository.findOne({
                                    where: { id: createReviewDto.orderId, userId: userId },
                                })];
                        case 3:
                            order = _a.sent();
                            if (!order) {
                                throw new common_1.ForbiddenException('Order not found or does not belong to you');
                            }
                            return [4 /*yield*/, this.orderItemRepository.findOne({
                                    where: {
                                        orderId: createReviewDto.orderId,
                                        productId: createReviewDto.productId,
                                    },
                                })];
                        case 4:
                            orderItem = _a.sent();
                            if (!orderItem) {
                                throw new common_1.BadRequestException('This product is not in your order');
                            }
                            // Only allow reviews for delivered orders
                            if (order.status !== 'delivered') {
                                throw new common_1.BadRequestException('You can only review products from delivered orders');
                            }
                            _a.label = 5;
                        case 5:
                            review = this.reviewRepository.create({
                                userId: userId,
                                productId: createReviewDto.productId,
                                orderId: createReviewDto.orderId,
                                rating: createReviewDto.rating,
                                title: createReviewDto.title,
                                content: createReviewDto.content,
                                status: 'pending',
                            });
                            return [4 /*yield*/, this.reviewRepository.save(review)];
                        case 6: return [2 /*return*/, _a.sent()];
                    }
                });
            });
        };
        ReviewsService_1.prototype.findByProduct = function (productId_1) {
            return __awaiter(this, arguments, void 0, function (productId, query) {
                var page, limit, skip, product, orderObj, _a, reviews, total;
                if (query === void 0) { query = {}; }
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            page = query.page || 1;
                            limit = query.limit || 10;
                            skip = (page - 1) * limit;
                            return [4 /*yield*/, this.productRepository.findOne({
                                    where: { id: productId },
                                })];
                        case 1:
                            product = _b.sent();
                            if (!product) {
                                throw new common_1.NotFoundException('Product not found');
                            }
                            orderObj = {};
                            if (query.sortBy) {
                                orderObj[query.sortBy] = query.order === 'asc' ? 'ASC' : 'DESC';
                            }
                            else {
                                orderObj.createdAt = 'DESC';
                            }
                            return [4 /*yield*/, this.reviewRepository.findAndCount({
                                    where: {
                                        productId: productId,
                                        status: 'approved',
                                    },
                                    relations: ['user'],
                                    skip: skip,
                                    take: limit,
                                    order: orderObj,
                                })];
                        case 2:
                            _a = _b.sent(), reviews = _a[0], total = _a[1];
                            return [2 /*return*/, {
                                    items: reviews,
                                    total: total,
                                    page: page,
                                    limit: limit,
                                    totalPages: Math.ceil(total / limit),
                                    hasNext: skip + limit < total,
                                    hasPrev: page > 1,
                                }];
                    }
                });
            });
        };
        ReviewsService_1.prototype.findAll = function () {
            return __awaiter(this, arguments, void 0, function (query) {
                var page, limit, skip, where, orderObj, _a, reviews, total;
                if (query === void 0) { query = {}; }
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            page = query.page || 1;
                            limit = query.limit || 10;
                            skip = (page - 1) * limit;
                            where = {};
                            if (query.status) {
                                where.status = query.status;
                            }
                            if (query.productId) {
                                where.productId = query.productId;
                            }
                            orderObj = {};
                            if (query.sortBy) {
                                orderObj[query.sortBy] = query.order === 'asc' ? 'ASC' : 'DESC';
                            }
                            else {
                                orderObj.createdAt = 'DESC';
                            }
                            return [4 /*yield*/, this.reviewRepository.findAndCount({
                                    where: where,
                                    relations: ['user'],
                                    skip: skip,
                                    take: limit,
                                    order: orderObj,
                                })];
                        case 1:
                            _a = _b.sent(), reviews = _a[0], total = _a[1];
                            return [2 /*return*/, {
                                    items: reviews,
                                    total: total,
                                    page: page,
                                    limit: limit,
                                    totalPages: Math.ceil(total / limit),
                                    hasNext: skip + limit < total,
                                    hasPrev: page > 1,
                                }];
                    }
                });
            });
        };
        ReviewsService_1.prototype.findOne = function (id) {
            return __awaiter(this, void 0, void 0, function () {
                var review;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.reviewRepository.findOne({
                                where: { id: id },
                                relations: ['user'],
                            })];
                        case 1:
                            review = _a.sent();
                            if (!review) {
                                throw new common_1.NotFoundException('Review not found');
                            }
                            return [2 /*return*/, review];
                    }
                });
            });
        };
        ReviewsService_1.prototype.update = function (id, userId, updateReviewDto) {
            return __awaiter(this, void 0, void 0, function () {
                var review;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.reviewRepository.findOne({
                                where: { id: id },
                            })];
                        case 1:
                            review = _a.sent();
                            if (!review) {
                                throw new common_1.NotFoundException('Review not found');
                            }
                            if (review.userId !== userId) {
                                throw new common_1.ForbiddenException('You can only edit your own reviews');
                            }
                            if (review.status !== 'pending') {
                                throw new common_1.BadRequestException('You can only edit reviews that are pending moderation');
                            }
                            Object.assign(review, updateReviewDto);
                            return [4 /*yield*/, this.reviewRepository.save(review)];
                        case 2: return [2 /*return*/, _a.sent()];
                    }
                });
            });
        };
        ReviewsService_1.prototype.delete = function (id_1, userId_1) {
            return __awaiter(this, arguments, void 0, function (id, userId, isAdmin) {
                var review;
                if (isAdmin === void 0) { isAdmin = false; }
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.reviewRepository.findOne({
                                where: { id: id },
                            })];
                        case 1:
                            review = _a.sent();
                            if (!review) {
                                throw new common_1.NotFoundException('Review not found');
                            }
                            if (!isAdmin && review.userId !== userId) {
                                throw new common_1.ForbiddenException('You can only delete your own reviews');
                            }
                            return [4 /*yield*/, this.reviewRepository.remove(review)];
                        case 2:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        ReviewsService_1.prototype.moderate = function (id, moderateReviewDto) {
            return __awaiter(this, void 0, void 0, function () {
                var review;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.reviewRepository.findOne({
                                where: { id: id },
                            })];
                        case 1:
                            review = _a.sent();
                            if (!review) {
                                throw new common_1.NotFoundException('Review not found');
                            }
                            review.status = moderateReviewDto.status;
                            if (moderateReviewDto.adminNote) {
                                review.adminNote = moderateReviewDto.adminNote;
                            }
                            return [4 /*yield*/, this.reviewRepository.save(review)];
                        case 2: return [2 /*return*/, _a.sent()];
                    }
                });
            });
        };
        ReviewsService_1.prototype.getProductRating = function (productId) {
            return __awaiter(this, void 0, void 0, function () {
                var reviews, totalRating, averageRating, ratingDistribution;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.reviewRepository.find({
                                where: {
                                    productId: productId,
                                    status: 'approved',
                                },
                            })];
                        case 1:
                            reviews = _a.sent();
                            if (reviews.length === 0) {
                                return [2 /*return*/, {
                                        averageRating: 0,
                                        totalReviews: 0,
                                        ratingDistribution: {
                                            1: 0,
                                            2: 0,
                                            3: 0,
                                            4: 0,
                                            5: 0,
                                        },
                                    }];
                            }
                            totalRating = reviews.reduce(function (sum, review) { return sum + review.rating; }, 0);
                            averageRating = totalRating / reviews.length;
                            ratingDistribution = {
                                1: 0,
                                2: 0,
                                3: 0,
                                4: 0,
                                5: 0,
                            };
                            reviews.forEach(function (review) {
                                ratingDistribution[review.rating]++;
                            });
                            return [2 /*return*/, {
                                    averageRating: Math.round(averageRating * 10) / 10,
                                    totalReviews: reviews.length,
                                    ratingDistribution: ratingDistribution,
                                }];
                    }
                });
            });
        };
        ReviewsService_1.prototype.getUserReviews = function (userId_1) {
            return __awaiter(this, arguments, void 0, function (userId, query) {
                var page, limit, skip, _a, reviews, total;
                if (query === void 0) { query = {}; }
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            page = query.page || 1;
                            limit = query.limit || 10;
                            skip = (page - 1) * limit;
                            return [4 /*yield*/, this.reviewRepository.findAndCount({
                                    where: { userId: userId },
                                    relations: ['user'],
                                    skip: skip,
                                    take: limit,
                                    order: { createdAt: 'DESC' },
                                })];
                        case 1:
                            _a = _b.sent(), reviews = _a[0], total = _a[1];
                            return [2 /*return*/, {
                                    items: reviews,
                                    total: total,
                                    page: page,
                                    limit: limit,
                                    totalPages: Math.ceil(total / limit),
                                    hasNext: skip + limit < total,
                                    hasPrev: page > 1,
                                }];
                    }
                });
            });
        };
        ReviewsService_1.prototype.getPendingReviewsCount = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.reviewRepository.count({
                            where: { status: 'pending' },
                        })];
                });
            });
        };
        return ReviewsService_1;
    }());
    __setFunctionName(_classThis, "ReviewsService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ReviewsService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ReviewsService = _classThis;
}();
exports.ReviewsService = ReviewsService;
