"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SiteSettings = exports.StockMovement = exports.WishlistItem = exports.Coupon = exports.Review = exports.OrderItem = exports.Order = exports.Product = exports.Category = exports.Address = exports.User = void 0;
// Barrel export for all entities
// This resolves circular dependency issues by centralizing entity exports
var user_entity_1 = require("./user.entity");
Object.defineProperty(exports, "User", { enumerable: true, get: function () { return user_entity_1.User; } });
var address_entity_1 = require("./address.entity");
Object.defineProperty(exports, "Address", { enumerable: true, get: function () { return address_entity_1.Address; } });
var category_entity_1 = require("./category.entity");
Object.defineProperty(exports, "Category", { enumerable: true, get: function () { return category_entity_1.Category; } });
var product_entity_1 = require("./product.entity");
Object.defineProperty(exports, "Product", { enumerable: true, get: function () { return product_entity_1.Product; } });
var order_entity_1 = require("./order.entity");
Object.defineProperty(exports, "Order", { enumerable: true, get: function () { return order_entity_1.Order; } });
var order_item_entity_1 = require("./order-item.entity");
Object.defineProperty(exports, "OrderItem", { enumerable: true, get: function () { return order_item_entity_1.OrderItem; } });
var review_entity_1 = require("./review.entity");
Object.defineProperty(exports, "Review", { enumerable: true, get: function () { return review_entity_1.Review; } });
var coupon_entity_1 = require("./coupon.entity");
Object.defineProperty(exports, "Coupon", { enumerable: true, get: function () { return coupon_entity_1.Coupon; } });
var wishlist_item_entity_1 = require("./wishlist-item.entity");
Object.defineProperty(exports, "WishlistItem", { enumerable: true, get: function () { return wishlist_item_entity_1.WishlistItem; } });
var stock_movement_entity_1 = require("./stock-movement.entity");
Object.defineProperty(exports, "StockMovement", { enumerable: true, get: function () { return stock_movement_entity_1.StockMovement; } });
var site_settings_entity_1 = require("./site-settings.entity");
Object.defineProperty(exports, "SiteSettings", { enumerable: true, get: function () { return site_settings_entity_1.SiteSettings; } });
