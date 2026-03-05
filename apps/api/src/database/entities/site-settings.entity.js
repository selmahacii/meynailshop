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
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SiteSettings = void 0;
var typeorm_1 = require("typeorm");
var SiteSettings = function () {
    var _classDecorators = [(0, typeorm_1.Entity)('site_settings')];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _id_decorators;
    var _id_initializers = [];
    var _id_extraInitializers = [];
    var _shopName_decorators;
    var _shopName_initializers = [];
    var _shopName_extraInitializers = [];
    var _shopEmail_decorators;
    var _shopEmail_initializers = [];
    var _shopEmail_extraInitializers = [];
    var _shopPhone_decorators;
    var _shopPhone_initializers = [];
    var _shopPhone_extraInitializers = [];
    var _shopAddress_decorators;
    var _shopAddress_initializers = [];
    var _shopAddress_extraInitializers = [];
    var _shippingCostDefault_decorators;
    var _shippingCostDefault_initializers = [];
    var _shippingCostDefault_extraInitializers = [];
    var _freeShippingThreshold_decorators;
    var _freeShippingThreshold_initializers = [];
    var _freeShippingThreshold_extraInitializers = [];
    var _stockAlertDefault_decorators;
    var _stockAlertDefault_initializers = [];
    var _stockAlertDefault_extraInitializers = [];
    var _notifyStockAlert_decorators;
    var _notifyStockAlert_initializers = [];
    var _notifyStockAlert_extraInitializers = [];
    var _notifyNewOrder_decorators;
    var _notifyNewOrder_initializers = [];
    var _notifyNewOrder_extraInitializers = [];
    var _notifyNewReview_decorators;
    var _notifyNewReview_initializers = [];
    var _notifyNewReview_extraInitializers = [];
    var _updatedAt_decorators;
    var _updatedAt_initializers = [];
    var _updatedAt_extraInitializers = [];
    var SiteSettings = _classThis = /** @class */ (function () {
        function SiteSettings_1() {
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.shopName = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _shopName_initializers, void 0));
            this.shopEmail = (__runInitializers(this, _shopName_extraInitializers), __runInitializers(this, _shopEmail_initializers, void 0));
            this.shopPhone = (__runInitializers(this, _shopEmail_extraInitializers), __runInitializers(this, _shopPhone_initializers, void 0));
            this.shopAddress = (__runInitializers(this, _shopPhone_extraInitializers), __runInitializers(this, _shopAddress_initializers, void 0));
            this.shippingCostDefault = (__runInitializers(this, _shopAddress_extraInitializers), __runInitializers(this, _shippingCostDefault_initializers, void 0));
            this.freeShippingThreshold = (__runInitializers(this, _shippingCostDefault_extraInitializers), __runInitializers(this, _freeShippingThreshold_initializers, void 0));
            this.stockAlertDefault = (__runInitializers(this, _freeShippingThreshold_extraInitializers), __runInitializers(this, _stockAlertDefault_initializers, void 0));
            this.notifyStockAlert = (__runInitializers(this, _stockAlertDefault_extraInitializers), __runInitializers(this, _notifyStockAlert_initializers, void 0));
            this.notifyNewOrder = (__runInitializers(this, _notifyStockAlert_extraInitializers), __runInitializers(this, _notifyNewOrder_initializers, void 0));
            this.notifyNewReview = (__runInitializers(this, _notifyNewOrder_extraInitializers), __runInitializers(this, _notifyNewReview_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _notifyNewReview_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            __runInitializers(this, _updatedAt_extraInitializers);
        }
        return SiteSettings_1;
    }());
    __setFunctionName(_classThis, "SiteSettings");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _id_decorators = [(0, typeorm_1.PrimaryGeneratedColumn)('uuid')];
        _shopName_decorators = [(0, typeorm_1.Column)({ type: 'varchar', length: 255 })];
        _shopEmail_decorators = [(0, typeorm_1.Column)({ type: 'varchar', length: 255 })];
        _shopPhone_decorators = [(0, typeorm_1.Column)({ type: 'varchar', length: 20 })];
        _shopAddress_decorators = [(0, typeorm_1.Column)({ type: 'text' })];
        _shippingCostDefault_decorators = [(0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2 })];
        _freeShippingThreshold_decorators = [(0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2 })];
        _stockAlertDefault_decorators = [(0, typeorm_1.Column)({ type: 'int', default: 5 })];
        _notifyStockAlert_decorators = [(0, typeorm_1.Column)({ type: 'boolean', default: true })];
        _notifyNewOrder_decorators = [(0, typeorm_1.Column)({ type: 'boolean', default: true })];
        _notifyNewReview_decorators = [(0, typeorm_1.Column)({ type: 'boolean', default: true })];
        _updatedAt_decorators = [(0, typeorm_1.UpdateDateColumn)()];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: function (obj) { return "id" in obj; }, get: function (obj) { return obj.id; }, set: function (obj, value) { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _shopName_decorators, { kind: "field", name: "shopName", static: false, private: false, access: { has: function (obj) { return "shopName" in obj; }, get: function (obj) { return obj.shopName; }, set: function (obj, value) { obj.shopName = value; } }, metadata: _metadata }, _shopName_initializers, _shopName_extraInitializers);
        __esDecorate(null, null, _shopEmail_decorators, { kind: "field", name: "shopEmail", static: false, private: false, access: { has: function (obj) { return "shopEmail" in obj; }, get: function (obj) { return obj.shopEmail; }, set: function (obj, value) { obj.shopEmail = value; } }, metadata: _metadata }, _shopEmail_initializers, _shopEmail_extraInitializers);
        __esDecorate(null, null, _shopPhone_decorators, { kind: "field", name: "shopPhone", static: false, private: false, access: { has: function (obj) { return "shopPhone" in obj; }, get: function (obj) { return obj.shopPhone; }, set: function (obj, value) { obj.shopPhone = value; } }, metadata: _metadata }, _shopPhone_initializers, _shopPhone_extraInitializers);
        __esDecorate(null, null, _shopAddress_decorators, { kind: "field", name: "shopAddress", static: false, private: false, access: { has: function (obj) { return "shopAddress" in obj; }, get: function (obj) { return obj.shopAddress; }, set: function (obj, value) { obj.shopAddress = value; } }, metadata: _metadata }, _shopAddress_initializers, _shopAddress_extraInitializers);
        __esDecorate(null, null, _shippingCostDefault_decorators, { kind: "field", name: "shippingCostDefault", static: false, private: false, access: { has: function (obj) { return "shippingCostDefault" in obj; }, get: function (obj) { return obj.shippingCostDefault; }, set: function (obj, value) { obj.shippingCostDefault = value; } }, metadata: _metadata }, _shippingCostDefault_initializers, _shippingCostDefault_extraInitializers);
        __esDecorate(null, null, _freeShippingThreshold_decorators, { kind: "field", name: "freeShippingThreshold", static: false, private: false, access: { has: function (obj) { return "freeShippingThreshold" in obj; }, get: function (obj) { return obj.freeShippingThreshold; }, set: function (obj, value) { obj.freeShippingThreshold = value; } }, metadata: _metadata }, _freeShippingThreshold_initializers, _freeShippingThreshold_extraInitializers);
        __esDecorate(null, null, _stockAlertDefault_decorators, { kind: "field", name: "stockAlertDefault", static: false, private: false, access: { has: function (obj) { return "stockAlertDefault" in obj; }, get: function (obj) { return obj.stockAlertDefault; }, set: function (obj, value) { obj.stockAlertDefault = value; } }, metadata: _metadata }, _stockAlertDefault_initializers, _stockAlertDefault_extraInitializers);
        __esDecorate(null, null, _notifyStockAlert_decorators, { kind: "field", name: "notifyStockAlert", static: false, private: false, access: { has: function (obj) { return "notifyStockAlert" in obj; }, get: function (obj) { return obj.notifyStockAlert; }, set: function (obj, value) { obj.notifyStockAlert = value; } }, metadata: _metadata }, _notifyStockAlert_initializers, _notifyStockAlert_extraInitializers);
        __esDecorate(null, null, _notifyNewOrder_decorators, { kind: "field", name: "notifyNewOrder", static: false, private: false, access: { has: function (obj) { return "notifyNewOrder" in obj; }, get: function (obj) { return obj.notifyNewOrder; }, set: function (obj, value) { obj.notifyNewOrder = value; } }, metadata: _metadata }, _notifyNewOrder_initializers, _notifyNewOrder_extraInitializers);
        __esDecorate(null, null, _notifyNewReview_decorators, { kind: "field", name: "notifyNewReview", static: false, private: false, access: { has: function (obj) { return "notifyNewReview" in obj; }, get: function (obj) { return obj.notifyNewReview; }, set: function (obj, value) { obj.notifyNewReview = value; } }, metadata: _metadata }, _notifyNewReview_initializers, _notifyNewReview_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: function (obj) { return "updatedAt" in obj; }, get: function (obj) { return obj.updatedAt; }, set: function (obj, value) { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        SiteSettings = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return SiteSettings = _classThis;
}();
exports.SiteSettings = SiteSettings;
