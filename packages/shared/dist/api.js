"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StockMovementType = exports.CouponType = exports.BadgeType = exports.ReviewStatus = exports.PaymentMethod = exports.PaymentStatus = exports.OrderStatus = exports.UserRole = void 0;
// User Roles
var UserRole;
(function (UserRole) {
    UserRole["CLIENT"] = "client";
    UserRole["ADMIN"] = "admin";
})(UserRole || (exports.UserRole = UserRole = {}));
// Order Statuses
var OrderStatus;
(function (OrderStatus) {
    OrderStatus["PENDING"] = "pending";
    OrderStatus["CONFIRMED"] = "confirmed";
    OrderStatus["PROCESSING"] = "processing";
    OrderStatus["SHIPPED"] = "shipped";
    OrderStatus["DELIVERED"] = "delivered";
    OrderStatus["CANCELLED"] = "cancelled";
    OrderStatus["REFUNDED"] = "refunded";
})(OrderStatus || (exports.OrderStatus = OrderStatus = {}));
var PaymentStatus;
(function (PaymentStatus) {
    PaymentStatus["PENDING"] = "pending";
    PaymentStatus["PAID"] = "paid";
    PaymentStatus["FAILED"] = "failed";
    PaymentStatus["REFUNDED"] = "refunded";
})(PaymentStatus || (exports.PaymentStatus = PaymentStatus = {}));
var PaymentMethod;
(function (PaymentMethod) {
    PaymentMethod["CASH_ON_DELIVERY"] = "cash_on_delivery";
    PaymentMethod["BARIDIMOB"] = "baridimob";
})(PaymentMethod || (exports.PaymentMethod = PaymentMethod = {}));
// Review Status
var ReviewStatus;
(function (ReviewStatus) {
    ReviewStatus["PENDING"] = "pending";
    ReviewStatus["APPROVED"] = "approved";
    ReviewStatus["REJECTED"] = "rejected";
})(ReviewStatus || (exports.ReviewStatus = ReviewStatus = {}));
// Product Badge
var BadgeType;
(function (BadgeType) {
    BadgeType["TOP"] = "top";
    BadgeType["NEW"] = "new";
    BadgeType["PROMO"] = "promo";
})(BadgeType || (exports.BadgeType = BadgeType = {}));
// Coupon Type
var CouponType;
(function (CouponType) {
    CouponType["PERCENTAGE"] = "percentage";
    CouponType["FIXED"] = "fixed";
})(CouponType || (exports.CouponType = CouponType = {}));
// Stock Movement Type
var StockMovementType;
(function (StockMovementType) {
    StockMovementType["IN"] = "in";
    StockMovementType["OUT"] = "out";
    StockMovementType["ADJUSTMENT"] = "adjustment";
    StockMovementType["SALE"] = "sale";
    StockMovementType["RETURN"] = "return";
})(StockMovementType || (exports.StockMovementType = StockMovementType = {}));
//# sourceMappingURL=api.js.map