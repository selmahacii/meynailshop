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
exports.ReviewsController = void 0;
var common_1 = require("@nestjs/common");
var jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
var roles_guard_1 = require("../auth/guards/roles.guard");
var roles_decorator_1 = require("../../common/decorators/roles.decorator");
var ReviewsController = function () {
    var _classDecorators = [(0, common_1.Controller)('reviews')];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _instanceExtraInitializers = [];
    var _create_decorators;
    var _getProductReviews_decorators;
    var _getProductRating_decorators;
    var _getMyReviews_decorators;
    var _findOne_decorators;
    var _findAll_decorators;
    var _update_decorators;
    var _moderate_decorators;
    var _delete_decorators;
    var _getPendingCount_decorators;
    var ReviewsController = _classThis = /** @class */ (function () {
        function ReviewsController_1(reviewsService) {
            this.reviewsService = (__runInitializers(this, _instanceExtraInitializers), reviewsService);
        }
        ReviewsController_1.prototype.create = function (user, createReviewDto) {
            return __awaiter(this, void 0, void 0, function () {
                var review;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.reviewsService.create(user.id, createReviewDto)];
                        case 1:
                            review = _a.sent();
                            return [2 /*return*/, {
                                    statusCode: 201,
                                    message: 'Review created successfully',
                                    data: review,
                                }];
                    }
                });
            });
        };
        ReviewsController_1.prototype.getProductReviews = function (productId, page, limit, sortBy, order) {
            return __awaiter(this, void 0, void 0, function () {
                var result;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.reviewsService.findByProduct(productId, {
                                page: page,
                                limit: limit,
                                sortBy: sortBy,
                                order: order,
                            })];
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
        ReviewsController_1.prototype.getProductRating = function (productId) {
            return __awaiter(this, void 0, void 0, function () {
                var rating;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.reviewsService.getProductRating(productId)];
                        case 1:
                            rating = _a.sent();
                            return [2 /*return*/, {
                                    statusCode: 200,
                                    data: rating,
                                }];
                    }
                });
            });
        };
        ReviewsController_1.prototype.getMyReviews = function (user, page, limit) {
            return __awaiter(this, void 0, void 0, function () {
                var result;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.reviewsService.getUserReviews(user.id, {
                                page: page,
                                limit: limit,
                            })];
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
        ReviewsController_1.prototype.findOne = function (id) {
            return __awaiter(this, void 0, void 0, function () {
                var review;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.reviewsService.findOne(id)];
                        case 1:
                            review = _a.sent();
                            return [2 /*return*/, {
                                    statusCode: 200,
                                    data: review,
                                }];
                    }
                });
            });
        };
        ReviewsController_1.prototype.findAll = function (page, limit, status, productId, sortBy, order) {
            return __awaiter(this, void 0, void 0, function () {
                var result;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.reviewsService.findAll({
                                page: page,
                                limit: limit,
                                status: status,
                                productId: productId,
                                sortBy: sortBy,
                                order: order,
                            })];
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
        ReviewsController_1.prototype.update = function (user, id, updateReviewDto) {
            return __awaiter(this, void 0, void 0, function () {
                var review;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.reviewsService.update(id, user.id, updateReviewDto)];
                        case 1:
                            review = _a.sent();
                            return [2 /*return*/, {
                                    statusCode: 200,
                                    message: 'Review updated successfully',
                                    data: review,
                                }];
                    }
                });
            });
        };
        ReviewsController_1.prototype.moderate = function (id, moderateReviewDto) {
            return __awaiter(this, void 0, void 0, function () {
                var review;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.reviewsService.moderate(id, moderateReviewDto)];
                        case 1:
                            review = _a.sent();
                            return [2 /*return*/, {
                                    statusCode: 200,
                                    message: 'Review moderated successfully',
                                    data: review,
                                }];
                    }
                });
            });
        };
        ReviewsController_1.prototype.delete = function (user, id) {
            return __awaiter(this, void 0, void 0, function () {
                var isAdmin;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            isAdmin = user.role === 'admin';
                            return [4 /*yield*/, this.reviewsService.delete(id, user.id, isAdmin)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/, {
                                    statusCode: 200,
                                    message: 'Review deleted successfully',
                                }];
                    }
                });
            });
        };
        ReviewsController_1.prototype.getPendingCount = function () {
            return __awaiter(this, void 0, void 0, function () {
                var count;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.reviewsService.getPendingReviewsCount()];
                        case 1:
                            count = _a.sent();
                            return [2 /*return*/, {
                                    statusCode: 200,
                                    data: { pendingCount: count },
                                }];
                    }
                });
            });
        };
        return ReviewsController_1;
    }());
    __setFunctionName(_classThis, "ReviewsController");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _create_decorators = [(0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard), (0, common_1.Post)(), (0, common_1.HttpCode)(common_1.HttpStatus.CREATED)];
        _getProductReviews_decorators = [(0, common_1.Get)('product/:productId')];
        _getProductRating_decorators = [(0, common_1.Get)('product/:productId/rating')];
        _getMyReviews_decorators = [(0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard), (0, common_1.Get)('my-reviews')];
        _findOne_decorators = [(0, common_1.Get)(':id')];
        _findAll_decorators = [(0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard), (0, roles_decorator_1.Roles)('admin'), (0, common_1.Get)()];
        _update_decorators = [(0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard), (0, common_1.Patch)(':id')];
        _moderate_decorators = [(0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard), (0, roles_decorator_1.Roles)('admin'), (0, common_1.Patch)(':id/moderate')];
        _delete_decorators = [(0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard), (0, common_1.Delete)(':id')];
        _getPendingCount_decorators = [(0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard), (0, roles_decorator_1.Roles)('admin'), (0, common_1.Get)('admin/pending-count')];
        __esDecorate(_classThis, null, _create_decorators, { kind: "method", name: "create", static: false, private: false, access: { has: function (obj) { return "create" in obj; }, get: function (obj) { return obj.create; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getProductReviews_decorators, { kind: "method", name: "getProductReviews", static: false, private: false, access: { has: function (obj) { return "getProductReviews" in obj; }, get: function (obj) { return obj.getProductReviews; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getProductRating_decorators, { kind: "method", name: "getProductRating", static: false, private: false, access: { has: function (obj) { return "getProductRating" in obj; }, get: function (obj) { return obj.getProductRating; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getMyReviews_decorators, { kind: "method", name: "getMyReviews", static: false, private: false, access: { has: function (obj) { return "getMyReviews" in obj; }, get: function (obj) { return obj.getMyReviews; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _findOne_decorators, { kind: "method", name: "findOne", static: false, private: false, access: { has: function (obj) { return "findOne" in obj; }, get: function (obj) { return obj.findOne; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _findAll_decorators, { kind: "method", name: "findAll", static: false, private: false, access: { has: function (obj) { return "findAll" in obj; }, get: function (obj) { return obj.findAll; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _update_decorators, { kind: "method", name: "update", static: false, private: false, access: { has: function (obj) { return "update" in obj; }, get: function (obj) { return obj.update; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _moderate_decorators, { kind: "method", name: "moderate", static: false, private: false, access: { has: function (obj) { return "moderate" in obj; }, get: function (obj) { return obj.moderate; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _delete_decorators, { kind: "method", name: "delete", static: false, private: false, access: { has: function (obj) { return "delete" in obj; }, get: function (obj) { return obj.delete; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getPendingCount_decorators, { kind: "method", name: "getPendingCount", static: false, private: false, access: { has: function (obj) { return "getPendingCount" in obj; }, get: function (obj) { return obj.getPendingCount; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ReviewsController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ReviewsController = _classThis;
}();
exports.ReviewsController = ReviewsController;
