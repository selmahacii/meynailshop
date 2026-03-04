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
exports.Product = void 0;
var typeorm_1 = require("typeorm");
var category_entity_1 = require("./category.entity");
var Product = function () {
    var _classDecorators = [(0, typeorm_1.Entity)('products'), (0, typeorm_1.Index)(['slug']), (0, typeorm_1.Index)(['sku']), (0, typeorm_1.Index)(['categoryId']), (0, typeorm_1.Index)(['price']), (0, typeorm_1.Index)(['isActive']), (0, typeorm_1.Index)(['isFeatured']), (0, typeorm_1.Index)(['createdAt']), (0, typeorm_1.Unique)(['slug']), (0, typeorm_1.Unique)(['sku'])];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _id_decorators;
    var _id_initializers = [];
    var _id_extraInitializers = [];
    var _name_decorators;
    var _name_initializers = [];
    var _name_extraInitializers = [];
    var _slug_decorators;
    var _slug_initializers = [];
    var _slug_extraInitializers = [];
    var _description_decorators;
    var _description_initializers = [];
    var _description_extraInitializers = [];
    var _shortDescription_decorators;
    var _shortDescription_initializers = [];
    var _shortDescription_extraInitializers = [];
    var _sku_decorators;
    var _sku_initializers = [];
    var _sku_extraInitializers = [];
    var _price_decorators;
    var _price_initializers = [];
    var _price_extraInitializers = [];
    var _comparePrice_decorators;
    var _comparePrice_initializers = [];
    var _comparePrice_extraInitializers = [];
    var _costPrice_decorators;
    var _costPrice_initializers = [];
    var _costPrice_extraInitializers = [];
    var _stock_decorators;
    var _stock_initializers = [];
    var _stock_extraInitializers = [];
    var _stockAlert_decorators;
    var _stockAlert_initializers = [];
    var _stockAlert_extraInitializers = [];
    var _images_decorators;
    var _images_initializers = [];
    var _images_extraInitializers = [];
    var _categoryId_decorators;
    var _categoryId_initializers = [];
    var _categoryId_extraInitializers = [];
    var _badge_decorators;
    var _badge_initializers = [];
    var _badge_extraInitializers = [];
    var _isActive_decorators;
    var _isActive_initializers = [];
    var _isActive_extraInitializers = [];
    var _isFeatured_decorators;
    var _isFeatured_initializers = [];
    var _isFeatured_extraInitializers = [];
    var _weight_decorators;
    var _weight_initializers = [];
    var _weight_extraInitializers = [];
    var _tags_decorators;
    var _tags_initializers = [];
    var _tags_extraInitializers = [];
    var _createdAt_decorators;
    var _createdAt_initializers = [];
    var _createdAt_extraInitializers = [];
    var _updatedAt_decorators;
    var _updatedAt_initializers = [];
    var _updatedAt_extraInitializers = [];
    var _category_decorators;
    var _category_initializers = [];
    var _category_extraInitializers = [];
    var Product = _classThis = /** @class */ (function () {
        function Product_1() {
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.name = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _name_initializers, void 0));
            this.slug = (__runInitializers(this, _name_extraInitializers), __runInitializers(this, _slug_initializers, void 0));
            this.description = (__runInitializers(this, _slug_extraInitializers), __runInitializers(this, _description_initializers, void 0));
            this.shortDescription = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _shortDescription_initializers, void 0));
            this.sku = (__runInitializers(this, _shortDescription_extraInitializers), __runInitializers(this, _sku_initializers, void 0));
            this.price = (__runInitializers(this, _sku_extraInitializers), __runInitializers(this, _price_initializers, void 0));
            this.comparePrice = (__runInitializers(this, _price_extraInitializers), __runInitializers(this, _comparePrice_initializers, void 0));
            this.costPrice = (__runInitializers(this, _comparePrice_extraInitializers), __runInitializers(this, _costPrice_initializers, void 0));
            this.stock = (__runInitializers(this, _costPrice_extraInitializers), __runInitializers(this, _stock_initializers, void 0));
            this.stockAlert = (__runInitializers(this, _stock_extraInitializers), __runInitializers(this, _stockAlert_initializers, void 0));
            this.images = (__runInitializers(this, _stockAlert_extraInitializers), __runInitializers(this, _images_initializers, void 0));
            this.categoryId = (__runInitializers(this, _images_extraInitializers), __runInitializers(this, _categoryId_initializers, void 0));
            this.badge = (__runInitializers(this, _categoryId_extraInitializers), __runInitializers(this, _badge_initializers, void 0));
            this.isActive = (__runInitializers(this, _badge_extraInitializers), __runInitializers(this, _isActive_initializers, void 0));
            this.isFeatured = (__runInitializers(this, _isActive_extraInitializers), __runInitializers(this, _isFeatured_initializers, void 0));
            this.weight = (__runInitializers(this, _isFeatured_extraInitializers), __runInitializers(this, _weight_initializers, void 0));
            this.tags = (__runInitializers(this, _weight_extraInitializers), __runInitializers(this, _tags_initializers, void 0));
            this.createdAt = (__runInitializers(this, _tags_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            this.category = (__runInitializers(this, _updatedAt_extraInitializers), __runInitializers(this, _category_initializers, void 0));
            __runInitializers(this, _category_extraInitializers);
        }
        return Product_1;
    }());
    __setFunctionName(_classThis, "Product");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _id_decorators = [(0, typeorm_1.PrimaryGeneratedColumn)('uuid')];
        _name_decorators = [(0, typeorm_1.Column)({ type: 'varchar', length: 255 })];
        _slug_decorators = [(0, typeorm_1.Column)({ type: 'varchar', length: 255, unique: true })];
        _description_decorators = [(0, typeorm_1.Column)({ type: 'text' })];
        _shortDescription_decorators = [(0, typeorm_1.Column)({ type: 'varchar', length: 500 })];
        _sku_decorators = [(0, typeorm_1.Column)({ type: 'varchar', length: 50, unique: true })];
        _price_decorators = [(0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2 })];
        _comparePrice_decorators = [(0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2, nullable: true })];
        _costPrice_decorators = [(0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2 })];
        _stock_decorators = [(0, typeorm_1.Column)({ type: 'int', default: 0 })];
        _stockAlert_decorators = [(0, typeorm_1.Column)({ type: 'int', default: 5 })];
        _images_decorators = [(0, typeorm_1.Column)({ type: 'simple-array', default: '' })];
        _categoryId_decorators = [(0, typeorm_1.Column)({ type: 'uuid' })];
        _badge_decorators = [(0, typeorm_1.Column)({
                type: 'enum',
                enum: ['top', 'new', 'promo'],
                nullable: true,
                default: null,
            })];
        _isActive_decorators = [(0, typeorm_1.Column)({ type: 'boolean', default: true })];
        _isFeatured_decorators = [(0, typeorm_1.Column)({ type: 'boolean', default: false })];
        _weight_decorators = [(0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2, default: 0 })];
        _tags_decorators = [(0, typeorm_1.Column)({ type: 'simple-array', default: '' })];
        _createdAt_decorators = [(0, typeorm_1.CreateDateColumn)()];
        _updatedAt_decorators = [(0, typeorm_1.UpdateDateColumn)()];
        _category_decorators = [(0, typeorm_1.ManyToOne)(function () { return category_entity_1.Category; }, function (category) { return category.products; }, {
                onDelete: 'CASCADE',
            }), (0, typeorm_1.JoinColumn)({ name: 'categoryId' })];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: function (obj) { return "id" in obj; }, get: function (obj) { return obj.id; }, set: function (obj, value) { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _name_decorators, { kind: "field", name: "name", static: false, private: false, access: { has: function (obj) { return "name" in obj; }, get: function (obj) { return obj.name; }, set: function (obj, value) { obj.name = value; } }, metadata: _metadata }, _name_initializers, _name_extraInitializers);
        __esDecorate(null, null, _slug_decorators, { kind: "field", name: "slug", static: false, private: false, access: { has: function (obj) { return "slug" in obj; }, get: function (obj) { return obj.slug; }, set: function (obj, value) { obj.slug = value; } }, metadata: _metadata }, _slug_initializers, _slug_extraInitializers);
        __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: function (obj) { return "description" in obj; }, get: function (obj) { return obj.description; }, set: function (obj, value) { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
        __esDecorate(null, null, _shortDescription_decorators, { kind: "field", name: "shortDescription", static: false, private: false, access: { has: function (obj) { return "shortDescription" in obj; }, get: function (obj) { return obj.shortDescription; }, set: function (obj, value) { obj.shortDescription = value; } }, metadata: _metadata }, _shortDescription_initializers, _shortDescription_extraInitializers);
        __esDecorate(null, null, _sku_decorators, { kind: "field", name: "sku", static: false, private: false, access: { has: function (obj) { return "sku" in obj; }, get: function (obj) { return obj.sku; }, set: function (obj, value) { obj.sku = value; } }, metadata: _metadata }, _sku_initializers, _sku_extraInitializers);
        __esDecorate(null, null, _price_decorators, { kind: "field", name: "price", static: false, private: false, access: { has: function (obj) { return "price" in obj; }, get: function (obj) { return obj.price; }, set: function (obj, value) { obj.price = value; } }, metadata: _metadata }, _price_initializers, _price_extraInitializers);
        __esDecorate(null, null, _comparePrice_decorators, { kind: "field", name: "comparePrice", static: false, private: false, access: { has: function (obj) { return "comparePrice" in obj; }, get: function (obj) { return obj.comparePrice; }, set: function (obj, value) { obj.comparePrice = value; } }, metadata: _metadata }, _comparePrice_initializers, _comparePrice_extraInitializers);
        __esDecorate(null, null, _costPrice_decorators, { kind: "field", name: "costPrice", static: false, private: false, access: { has: function (obj) { return "costPrice" in obj; }, get: function (obj) { return obj.costPrice; }, set: function (obj, value) { obj.costPrice = value; } }, metadata: _metadata }, _costPrice_initializers, _costPrice_extraInitializers);
        __esDecorate(null, null, _stock_decorators, { kind: "field", name: "stock", static: false, private: false, access: { has: function (obj) { return "stock" in obj; }, get: function (obj) { return obj.stock; }, set: function (obj, value) { obj.stock = value; } }, metadata: _metadata }, _stock_initializers, _stock_extraInitializers);
        __esDecorate(null, null, _stockAlert_decorators, { kind: "field", name: "stockAlert", static: false, private: false, access: { has: function (obj) { return "stockAlert" in obj; }, get: function (obj) { return obj.stockAlert; }, set: function (obj, value) { obj.stockAlert = value; } }, metadata: _metadata }, _stockAlert_initializers, _stockAlert_extraInitializers);
        __esDecorate(null, null, _images_decorators, { kind: "field", name: "images", static: false, private: false, access: { has: function (obj) { return "images" in obj; }, get: function (obj) { return obj.images; }, set: function (obj, value) { obj.images = value; } }, metadata: _metadata }, _images_initializers, _images_extraInitializers);
        __esDecorate(null, null, _categoryId_decorators, { kind: "field", name: "categoryId", static: false, private: false, access: { has: function (obj) { return "categoryId" in obj; }, get: function (obj) { return obj.categoryId; }, set: function (obj, value) { obj.categoryId = value; } }, metadata: _metadata }, _categoryId_initializers, _categoryId_extraInitializers);
        __esDecorate(null, null, _badge_decorators, { kind: "field", name: "badge", static: false, private: false, access: { has: function (obj) { return "badge" in obj; }, get: function (obj) { return obj.badge; }, set: function (obj, value) { obj.badge = value; } }, metadata: _metadata }, _badge_initializers, _badge_extraInitializers);
        __esDecorate(null, null, _isActive_decorators, { kind: "field", name: "isActive", static: false, private: false, access: { has: function (obj) { return "isActive" in obj; }, get: function (obj) { return obj.isActive; }, set: function (obj, value) { obj.isActive = value; } }, metadata: _metadata }, _isActive_initializers, _isActive_extraInitializers);
        __esDecorate(null, null, _isFeatured_decorators, { kind: "field", name: "isFeatured", static: false, private: false, access: { has: function (obj) { return "isFeatured" in obj; }, get: function (obj) { return obj.isFeatured; }, set: function (obj, value) { obj.isFeatured = value; } }, metadata: _metadata }, _isFeatured_initializers, _isFeatured_extraInitializers);
        __esDecorate(null, null, _weight_decorators, { kind: "field", name: "weight", static: false, private: false, access: { has: function (obj) { return "weight" in obj; }, get: function (obj) { return obj.weight; }, set: function (obj, value) { obj.weight = value; } }, metadata: _metadata }, _weight_initializers, _weight_extraInitializers);
        __esDecorate(null, null, _tags_decorators, { kind: "field", name: "tags", static: false, private: false, access: { has: function (obj) { return "tags" in obj; }, get: function (obj) { return obj.tags; }, set: function (obj, value) { obj.tags = value; } }, metadata: _metadata }, _tags_initializers, _tags_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: function (obj) { return "createdAt" in obj; }, get: function (obj) { return obj.createdAt; }, set: function (obj, value) { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: function (obj) { return "updatedAt" in obj; }, get: function (obj) { return obj.updatedAt; }, set: function (obj, value) { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, null, _category_decorators, { kind: "field", name: "category", static: false, private: false, access: { has: function (obj) { return "category" in obj; }, get: function (obj) { return obj.category; }, set: function (obj, value) { obj.category = value; } }, metadata: _metadata }, _category_initializers, _category_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        Product = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return Product = _classThis;
}();
exports.Product = Product;
