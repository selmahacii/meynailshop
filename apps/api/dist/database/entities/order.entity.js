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
exports.Order = void 0;
var typeorm_1 = require("typeorm");
var user_entity_1 = require("./user.entity");
var Order = function () {
    var _classDecorators = [(0, typeorm_1.Entity)('orders'), (0, typeorm_1.Index)(['userId']), (0, typeorm_1.Index)(['status']), (0, typeorm_1.Index)(['createdAt']), (0, typeorm_1.Index)(['orderNumber'])];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _id_decorators;
    var _id_initializers = [];
    var _id_extraInitializers = [];
    var _orderNumber_decorators;
    var _orderNumber_initializers = [];
    var _orderNumber_extraInitializers = [];
    var _userId_decorators;
    var _userId_initializers = [];
    var _userId_extraInitializers = [];
    var _status_decorators;
    var _status_initializers = [];
    var _status_extraInitializers = [];
    var _paymentStatus_decorators;
    var _paymentStatus_initializers = [];
    var _paymentStatus_extraInitializers = [];
    var _paymentMethod_decorators;
    var _paymentMethod_initializers = [];
    var _paymentMethod_extraInitializers = [];
    var _subtotal_decorators;
    var _subtotal_initializers = [];
    var _subtotal_extraInitializers = [];
    var _shippingCost_decorators;
    var _shippingCost_initializers = [];
    var _shippingCost_extraInitializers = [];
    var _discount_decorators;
    var _discount_initializers = [];
    var _discount_extraInitializers = [];
    var _total_decorators;
    var _total_initializers = [];
    var _total_extraInitializers = [];
    var _shippingAddressSnapshot_decorators;
    var _shippingAddressSnapshot_initializers = [];
    var _shippingAddressSnapshot_extraInitializers = [];
    var _notes_decorators;
    var _notes_initializers = [];
    var _notes_extraInitializers = [];
    var _trackingNumber_decorators;
    var _trackingNumber_initializers = [];
    var _trackingNumber_extraInitializers = [];
    var _shippedAt_decorators;
    var _shippedAt_initializers = [];
    var _shippedAt_extraInitializers = [];
    var _deliveredAt_decorators;
    var _deliveredAt_initializers = [];
    var _deliveredAt_extraInitializers = [];
    var _cancelledAt_decorators;
    var _cancelledAt_initializers = [];
    var _cancelledAt_extraInitializers = [];
    var _cancellationReason_decorators;
    var _cancellationReason_initializers = [];
    var _cancellationReason_extraInitializers = [];
    var _createdAt_decorators;
    var _createdAt_initializers = [];
    var _createdAt_extraInitializers = [];
    var _updatedAt_decorators;
    var _updatedAt_initializers = [];
    var _updatedAt_extraInitializers = [];
    var _user_decorators;
    var _user_initializers = [];
    var _user_extraInitializers = [];
    var Order = _classThis = /** @class */ (function () {
        function Order_1() {
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.orderNumber = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _orderNumber_initializers, void 0));
            this.userId = (__runInitializers(this, _orderNumber_extraInitializers), __runInitializers(this, _userId_initializers, void 0));
            this.status = (__runInitializers(this, _userId_extraInitializers), __runInitializers(this, _status_initializers, void 0));
            this.paymentStatus = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _paymentStatus_initializers, void 0));
            this.paymentMethod = (__runInitializers(this, _paymentStatus_extraInitializers), __runInitializers(this, _paymentMethod_initializers, void 0));
            this.subtotal = (__runInitializers(this, _paymentMethod_extraInitializers), __runInitializers(this, _subtotal_initializers, void 0));
            this.shippingCost = (__runInitializers(this, _subtotal_extraInitializers), __runInitializers(this, _shippingCost_initializers, void 0));
            this.discount = (__runInitializers(this, _shippingCost_extraInitializers), __runInitializers(this, _discount_initializers, void 0));
            this.total = (__runInitializers(this, _discount_extraInitializers), __runInitializers(this, _total_initializers, void 0));
            this.shippingAddressSnapshot = (__runInitializers(this, _total_extraInitializers), __runInitializers(this, _shippingAddressSnapshot_initializers, void 0));
            this.notes = (__runInitializers(this, _shippingAddressSnapshot_extraInitializers), __runInitializers(this, _notes_initializers, void 0));
            this.trackingNumber = (__runInitializers(this, _notes_extraInitializers), __runInitializers(this, _trackingNumber_initializers, void 0));
            this.shippedAt = (__runInitializers(this, _trackingNumber_extraInitializers), __runInitializers(this, _shippedAt_initializers, void 0));
            this.deliveredAt = (__runInitializers(this, _shippedAt_extraInitializers), __runInitializers(this, _deliveredAt_initializers, void 0));
            this.cancelledAt = (__runInitializers(this, _deliveredAt_extraInitializers), __runInitializers(this, _cancelledAt_initializers, void 0));
            this.cancellationReason = (__runInitializers(this, _cancelledAt_extraInitializers), __runInitializers(this, _cancellationReason_initializers, void 0));
            this.createdAt = (__runInitializers(this, _cancellationReason_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            this.user = (__runInitializers(this, _updatedAt_extraInitializers), __runInitializers(this, _user_initializers, void 0));
            __runInitializers(this, _user_extraInitializers);
        }
        return Order_1;
    }());
    __setFunctionName(_classThis, "Order");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _id_decorators = [(0, typeorm_1.PrimaryGeneratedColumn)('uuid')];
        _orderNumber_decorators = [(0, typeorm_1.Column)({ type: 'varchar', length: 50, unique: true })];
        _userId_decorators = [(0, typeorm_1.Column)({ type: 'uuid' })];
        _status_decorators = [(0, typeorm_1.Column)({
                type: 'enum',
                enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'],
                default: 'pending',
            })];
        _paymentStatus_decorators = [(0, typeorm_1.Column)({
                type: 'enum',
                enum: ['pending', 'paid', 'failed', 'refunded'],
                default: 'pending',
            })];
        _paymentMethod_decorators = [(0, typeorm_1.Column)({
                type: 'enum',
                enum: ['cash_on_delivery', 'ccp', 'baridimob'],
            })];
        _subtotal_decorators = [(0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2 })];
        _shippingCost_decorators = [(0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2, default: 0 })];
        _discount_decorators = [(0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2, default: 0 })];
        _total_decorators = [(0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2 })];
        _shippingAddressSnapshot_decorators = [(0, typeorm_1.Column)({ type: 'jsonb', nullable: true })];
        _notes_decorators = [(0, typeorm_1.Column)({ type: 'text', nullable: true })];
        _trackingNumber_decorators = [(0, typeorm_1.Column)({ type: 'varchar', length: 100, nullable: true })];
        _shippedAt_decorators = [(0, typeorm_1.Column)({ type: 'timestamp', nullable: true })];
        _deliveredAt_decorators = [(0, typeorm_1.Column)({ type: 'timestamp', nullable: true })];
        _cancelledAt_decorators = [(0, typeorm_1.Column)({ type: 'timestamp', nullable: true })];
        _cancellationReason_decorators = [(0, typeorm_1.Column)({ type: 'text', nullable: true })];
        _createdAt_decorators = [(0, typeorm_1.CreateDateColumn)()];
        _updatedAt_decorators = [(0, typeorm_1.UpdateDateColumn)()];
        _user_decorators = [(0, typeorm_1.ManyToOne)(function () { return user_entity_1.User; }, function (user) { return user.orders; }, {
                onDelete: 'CASCADE',
            }), (0, typeorm_1.JoinColumn)({ name: 'userId' })];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: function (obj) { return "id" in obj; }, get: function (obj) { return obj.id; }, set: function (obj, value) { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _orderNumber_decorators, { kind: "field", name: "orderNumber", static: false, private: false, access: { has: function (obj) { return "orderNumber" in obj; }, get: function (obj) { return obj.orderNumber; }, set: function (obj, value) { obj.orderNumber = value; } }, metadata: _metadata }, _orderNumber_initializers, _orderNumber_extraInitializers);
        __esDecorate(null, null, _userId_decorators, { kind: "field", name: "userId", static: false, private: false, access: { has: function (obj) { return "userId" in obj; }, get: function (obj) { return obj.userId; }, set: function (obj, value) { obj.userId = value; } }, metadata: _metadata }, _userId_initializers, _userId_extraInitializers);
        __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: function (obj) { return "status" in obj; }, get: function (obj) { return obj.status; }, set: function (obj, value) { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
        __esDecorate(null, null, _paymentStatus_decorators, { kind: "field", name: "paymentStatus", static: false, private: false, access: { has: function (obj) { return "paymentStatus" in obj; }, get: function (obj) { return obj.paymentStatus; }, set: function (obj, value) { obj.paymentStatus = value; } }, metadata: _metadata }, _paymentStatus_initializers, _paymentStatus_extraInitializers);
        __esDecorate(null, null, _paymentMethod_decorators, { kind: "field", name: "paymentMethod", static: false, private: false, access: { has: function (obj) { return "paymentMethod" in obj; }, get: function (obj) { return obj.paymentMethod; }, set: function (obj, value) { obj.paymentMethod = value; } }, metadata: _metadata }, _paymentMethod_initializers, _paymentMethod_extraInitializers);
        __esDecorate(null, null, _subtotal_decorators, { kind: "field", name: "subtotal", static: false, private: false, access: { has: function (obj) { return "subtotal" in obj; }, get: function (obj) { return obj.subtotal; }, set: function (obj, value) { obj.subtotal = value; } }, metadata: _metadata }, _subtotal_initializers, _subtotal_extraInitializers);
        __esDecorate(null, null, _shippingCost_decorators, { kind: "field", name: "shippingCost", static: false, private: false, access: { has: function (obj) { return "shippingCost" in obj; }, get: function (obj) { return obj.shippingCost; }, set: function (obj, value) { obj.shippingCost = value; } }, metadata: _metadata }, _shippingCost_initializers, _shippingCost_extraInitializers);
        __esDecorate(null, null, _discount_decorators, { kind: "field", name: "discount", static: false, private: false, access: { has: function (obj) { return "discount" in obj; }, get: function (obj) { return obj.discount; }, set: function (obj, value) { obj.discount = value; } }, metadata: _metadata }, _discount_initializers, _discount_extraInitializers);
        __esDecorate(null, null, _total_decorators, { kind: "field", name: "total", static: false, private: false, access: { has: function (obj) { return "total" in obj; }, get: function (obj) { return obj.total; }, set: function (obj, value) { obj.total = value; } }, metadata: _metadata }, _total_initializers, _total_extraInitializers);
        __esDecorate(null, null, _shippingAddressSnapshot_decorators, { kind: "field", name: "shippingAddressSnapshot", static: false, private: false, access: { has: function (obj) { return "shippingAddressSnapshot" in obj; }, get: function (obj) { return obj.shippingAddressSnapshot; }, set: function (obj, value) { obj.shippingAddressSnapshot = value; } }, metadata: _metadata }, _shippingAddressSnapshot_initializers, _shippingAddressSnapshot_extraInitializers);
        __esDecorate(null, null, _notes_decorators, { kind: "field", name: "notes", static: false, private: false, access: { has: function (obj) { return "notes" in obj; }, get: function (obj) { return obj.notes; }, set: function (obj, value) { obj.notes = value; } }, metadata: _metadata }, _notes_initializers, _notes_extraInitializers);
        __esDecorate(null, null, _trackingNumber_decorators, { kind: "field", name: "trackingNumber", static: false, private: false, access: { has: function (obj) { return "trackingNumber" in obj; }, get: function (obj) { return obj.trackingNumber; }, set: function (obj, value) { obj.trackingNumber = value; } }, metadata: _metadata }, _trackingNumber_initializers, _trackingNumber_extraInitializers);
        __esDecorate(null, null, _shippedAt_decorators, { kind: "field", name: "shippedAt", static: false, private: false, access: { has: function (obj) { return "shippedAt" in obj; }, get: function (obj) { return obj.shippedAt; }, set: function (obj, value) { obj.shippedAt = value; } }, metadata: _metadata }, _shippedAt_initializers, _shippedAt_extraInitializers);
        __esDecorate(null, null, _deliveredAt_decorators, { kind: "field", name: "deliveredAt", static: false, private: false, access: { has: function (obj) { return "deliveredAt" in obj; }, get: function (obj) { return obj.deliveredAt; }, set: function (obj, value) { obj.deliveredAt = value; } }, metadata: _metadata }, _deliveredAt_initializers, _deliveredAt_extraInitializers);
        __esDecorate(null, null, _cancelledAt_decorators, { kind: "field", name: "cancelledAt", static: false, private: false, access: { has: function (obj) { return "cancelledAt" in obj; }, get: function (obj) { return obj.cancelledAt; }, set: function (obj, value) { obj.cancelledAt = value; } }, metadata: _metadata }, _cancelledAt_initializers, _cancelledAt_extraInitializers);
        __esDecorate(null, null, _cancellationReason_decorators, { kind: "field", name: "cancellationReason", static: false, private: false, access: { has: function (obj) { return "cancellationReason" in obj; }, get: function (obj) { return obj.cancellationReason; }, set: function (obj, value) { obj.cancellationReason = value; } }, metadata: _metadata }, _cancellationReason_initializers, _cancellationReason_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: function (obj) { return "createdAt" in obj; }, get: function (obj) { return obj.createdAt; }, set: function (obj, value) { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: function (obj) { return "updatedAt" in obj; }, get: function (obj) { return obj.updatedAt; }, set: function (obj, value) { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, null, _user_decorators, { kind: "field", name: "user", static: false, private: false, access: { has: function (obj) { return "user" in obj; }, get: function (obj) { return obj.user; }, set: function (obj, value) { obj.user = value; } }, metadata: _metadata }, _user_initializers, _user_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        Order = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return Order = _classThis;
}();
exports.Order = Order;
