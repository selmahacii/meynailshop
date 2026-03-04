"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("./entities/user.entity");
const address_entity_1 = require("./entities/address.entity");
const category_entity_1 = require("./entities/category.entity");
const product_entity_1 = require("./entities/product.entity");
const order_entity_1 = require("./entities/order.entity");
const order_item_entity_1 = require("./entities/order-item.entity");
const review_entity_1 = require("./entities/review.entity");
const coupon_entity_1 = require("./entities/coupon.entity");
const wishlist_item_entity_1 = require("./entities/wishlist-item.entity");
const stock_movement_entity_1 = require("./entities/stock-movement.entity");
const site_settings_entity_1 = require("./entities/site-settings.entity");
exports.AppDataSource = new typeorm_1.DataSource({
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    username: process.env.DB_USER || 'meey',
    password: process.env.DB_PASSWORD || 'meey_password_2026',
    database: process.env.DB_NAME || 'meey_nail_shop',
    entities: [
        user_entity_1.User,
        address_entity_1.Address,
        category_entity_1.Category,
        product_entity_1.Product,
        order_entity_1.Order,
        order_item_entity_1.OrderItem,
        review_entity_1.Review,
        coupon_entity_1.Coupon,
        wishlist_item_entity_1.WishlistItem,
        stock_movement_entity_1.StockMovement,
        site_settings_entity_1.SiteSettings,
    ],
    migrations: ['src/database/migrations/*.ts'],
    synchronize: false,
    logging: true,
});
//# sourceMappingURL=datasource.js.map