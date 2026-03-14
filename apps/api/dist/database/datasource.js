"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
const typeorm_1 = require("typeorm");
const dotenv = __importStar(require("dotenv"));
const path = __importStar(require("path"));
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
dotenv.config({ path: path.join(process.cwd(), '../../.env') });
exports.AppDataSource = new typeorm_1.DataSource({
    type: 'postgres',
    host: process.env.DB_HOST || '127.0.0.1',
    port: parseInt(process.env.DB_PORT || '5433'),
    username: process.env.DB_USER || 'meey',
    password: process.env.DB_PASSWORD || 'meey',
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