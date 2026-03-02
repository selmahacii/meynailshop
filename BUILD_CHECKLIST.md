# MEEY NAIL SHOP - BUILD CHECKLIST

## Core Infrastructure ✅
- [x] package.json (root, monorepo)
- [x] docker-compose.yml
- [x] .env.example

## Shared Types ✅
- [x] packages/shared/types/api.ts
- [x] packages/shared/types/product.ts
- [x] packages/shared/types/user.ts
- [x] packages/shared/types/order.ts
- [x] packages/shared/types/index.ts
- [x] packages/shared/package.json

## Backend - Database Entities ✅
- [x] apps/api/src/database/entities/user.entity.ts
- [x] apps/api/src/database/entities/address.entity.ts
- [x] apps/api/src/database/entities/category.entity.ts
- [x] apps/api/src/database/entities/product.entity.ts
- [x] apps/api/src/database/entities/order.entity.ts
- [x] apps/api/src/database/entities/order-item.entity.ts
- [x] apps/api/src/database/entities/review.entity.ts
- [x] apps/api/src/database/entities/coupon.entity.ts
- [x] apps/api/src/database/entities/wishlist-item.entity.ts
- [ ] apps/api/src/database/entities/stock-movement.entity.ts
- [ ] apps/api/src/database/entities/site-settings.entity.ts

## Backend - Database Configuration
- [ ] apps/api/src/database/database.module.ts
- [ ] apps/api/src/database/datasource.ts

## Backend - Common (Filters, Interceptors, Pipes, Utils)
- [ ] apps/api/src/common/filters/http-exception.filter.ts
- [ ] apps/api/src/common/interceptors/response.interceptor.ts
- [ ] apps/api/src/common/interceptors/logging.interceptor.ts
- [ ] apps/api/src/common/pipes/validation.pipe.ts
- [ ] apps/api/src/common/pagination/pagination.dto.ts
- [ ] apps/api/src/common/pagination/paginated-result.interface.ts
- [ ] apps/api/src/common/utils/slug.util.ts
- [ ] apps/api/src/common/utils/order-number.util.ts
- [ ] apps/api/src/common/decorators/current-user.decorator.ts
- [ ] apps/api/src/common/decorators/roles.decorator.ts

## Backend - Auth Module (10 files)
- [ ] apps/api/src/modules/auth/auth.module.ts
- [ ] apps/api/src/modules/auth/auth.controller.ts
- [ ] apps/api/src/modules/auth/auth.service.ts
- [ ] apps/api/src/modules/auth/strategies/jwt.strategy.ts
- [ ] apps/api/src/modules/auth/strategies/local.strategy.ts
- [ ] apps/api/src/modules/auth/guards/jwt-auth.guard.ts
- [ ] apps/api/src/modules/auth/guards/local-auth.guard.ts
- [ ] apps/api/src/modules/auth/guards/roles.guard.ts
- [ ] apps/api/src/modules/auth/dto/login.dto.ts
- [ ] apps/api/src/modules/auth/dto/register.dto.ts
- [ ] apps/api/src/modules/auth/dto/refresh-token.dto.ts

## Backend - Users Module (8 files)
- [ ] apps/api/src/modules/users/users.module.ts
- [ ] apps/api/src/modules/users/users.controller.ts
- [ ] apps/api/src/modules/users/users.service.ts
- [ ] apps/api/src/modules/users/dto/create-user.dto.ts
- [ ] apps/api/src/modules/users/dto/update-user.dto.ts
- [ ] apps/api/src/modules/users/dto/create-address.dto.ts
- [ ] apps/api/src/modules/users/dto/update-address.dto.ts
- [ ] apps/api/src/modules/users/dto/paginated-users.dto.ts

## Backend - Products Module (10 files)
- [ ] apps/api/src/modules/products/products.module.ts
- [ ] apps/api/src/modules/products/products.controller.ts
- [ ] apps/api/src/modules/products/products.service.ts
- [ ] apps/api/src/modules/products/categories.controller.ts
- [ ] apps/api/src/modules/products/categories.service.ts
- [ ] apps/api/src/modules/products/dto/products-query.dto.ts
- [ ] apps/api/src/modules/products/dto/create-product.dto.ts
- [ ] apps/api/src/modules/products/dto/update-product.dto.ts
- [ ] apps/api/src/modules/products/dto/product-response.dto.ts
- [ ] apps/api/src/modules/products/dto/create-category.dto.ts

## Backend - Orders Module (8 files)
- [ ] apps/api/src/modules/orders/orders.module.ts
- [ ] apps/api/src/modules/orders/orders.controller.ts
- [ ] apps/api/src/modules/orders/orders.service.ts
- [ ] apps/api/src/modules/orders/order-items.service.ts
- [ ] apps/api/src/modules/orders/dto/create-order.dto.ts
- [ ] apps/api/src/modules/orders/dto/update-order-status.dto.ts
- [ ] apps/api/src/modules/orders/dto/orders-query.dto.ts
- [ ] apps/api/src/modules/orders/dto/order-response.dto.ts

## Backend - Cart Module (5 files)
- [ ] apps/api/src/modules/cart/cart.module.ts
- [ ] apps/api/src/modules/cart/cart.controller.ts
- [ ] apps/api/src/modules/cart/cart.service.ts
- [ ] apps/api/src/modules/cart/dto/add-to-cart.dto.ts
- [ ] apps/api/src/modules/cart/dto/update-cart-item.dto.ts

## Backend - Reviews Module (5 files)
- [ ] apps/api/src/modules/reviews/reviews.module.ts
- [ ] apps/api/src/modules/reviews/reviews.controller.ts
- [ ] apps/api/src/modules/reviews/reviews.service.ts
- [ ] apps/api/src/modules/reviews/dto/create-review.dto.ts
- [ ] apps/api/src/modules/reviews/dto/moderate-review.dto.ts

## Backend - Stock Module (4 files)
- [ ] apps/api/src/modules/stock/stock.module.ts
- [ ] apps/api/src/modules/stock/stock.controller.ts
- [ ] apps/api/src/modules/stock/stock.service.ts
- [ ] apps/api/src/modules/stock/dto/adjust-stock.dto.ts

## Backend - Wishlist Module (3 files)
- [ ] apps/api/src/modules/wishlist/wishlist.module.ts
- [ ] apps/api/src/modules/wishlist/wishlist.controller.ts
- [ ] apps/api/src/modules/wishlist/wishlist.service.ts

## Backend - Coupons Module (5 files)
- [ ] apps/api/src/modules/coupons/coupons.module.ts
- [ ] apps/api/src/modules/coupons/coupons.controller.ts
- [ ] apps/api/src/modules/coupons/coupons.service.ts
- [ ] apps/api/src/modules/coupons/dto/create-coupon.dto.ts
- [ ] apps/api/src/modules/coupons/dto/apply-coupon.dto.ts

## Backend - Upload Module (3 files)
- [ ] apps/api/src/modules/upload/upload.module.ts
- [ ] apps/api/src/modules/upload/upload.controller.ts
- [ ] apps/api/src/modules/upload/upload.service.ts

## Backend - Analytics Module (3 files)
- [ ] apps/api/src/modules/analytics/analytics.module.ts
- [ ] apps/api/src/modules/analytics/analytics.controller.ts
- [ ] apps/api/src/modules/analytics/analytics.service.ts

## Backend - Settings Module (4 files)
- [ ] apps/api/src/modules/settings/settings.module.ts
- [ ] apps/api/src/modules/settings/settings.controller.ts
- [ ] apps/api/src/modules/settings/settings.service.ts
- [ ] apps/api/src/modules/settings/dto/update-settings.dto.ts

## Backend - Notifications Module (2 files)
- [ ] apps/api/src/modules/notifications/notifications.module.ts
- [ ] apps/api/src/modules/notifications/notifications.service.ts

## Backend - Database Seeds (4 files)
- [ ] apps/api/src/database/seeds/seed.ts
- [ ] apps/api/src/database/seeds/users.seed.ts
- [ ] apps/api/src/database/seeds/categories.seed.ts
- [ ] apps/api/src/database/seeds/products.seed.ts

## Backend - Core Setup (4 files)
- [ ] apps/api/src/app.module.ts
- [ ] apps/api/src/app.controller.ts
- [ ] apps/api/src/main.ts
- [ ] apps/api/package.json
- [ ] apps/api/tsconfig.json
- [ ] apps/api/.env

## Frontend - Core Setup (8 files)
- [ ] apps/web/package.json
- [ ] apps/web/tsconfig.json
- [ ] apps/web/next.config.js
- [ ] apps/web/tailwind.config.ts
- [ ] apps/web/postcss.config.js
- [ ] apps/web/globals.css
- [ ] apps/web/middleware.ts
- [ ] apps/web/.env.local

## Frontend - App Root Level (5 files)
- [ ] apps/web/app/layout.tsx
- [ ] apps/web/app/not-found.tsx
- [ ] apps/web/app/error.tsx
- [ ] apps/web/app/page.tsx (home redirect)

## Frontend - Store Layout (3 files)
- [ ] apps/web/app/(store)/layout.tsx
- [ ] apps/web/app/(store)/page.tsx
- [ ] apps/web/components/store/layout/Navbar.tsx
- [ ] apps/web/components/store/layout/Footer.tsx

## Frontend - Catalog Pages (3 files)
- [ ] apps/web/app/(store)/catalogue/page.tsx
- [ ] apps/web/app/(store)/catalogue/[slug]/page.tsx
- [ ] apps/web/app/(store)/categories/[slug]/page.tsx

## Frontend - Cart & Checkout (5 files)
- [ ] apps/web/app/(store)/panier/page.tsx
- [ ] apps/web/app/(store)/commande/page.tsx
- [ ] apps/web/app/(store)/commande/confirmation/[orderId]/page.tsx
- [ ] apps/web/app/(store)/recherche/page.tsx

## Frontend - Account Pages (7 files)
- [ ] apps/web/app/(store)/compte/layout.tsx
- [ ] apps/web/app/(store)/compte/page.tsx
- [ ] apps/web/app/(store)/compte/commandes/page.tsx
- [ ] apps/web/app/(store)/compte/commandes/[id]/page.tsx
- [ ] apps/web/app/(store)/compte/adresses/page.tsx
- [ ] apps/web/app/(store)/compte/profil/page.tsx
- [ ] apps/web/app/(store)/compte/favoris/page.tsx

## Frontend - Auth Pages (2 files)
- [ ] apps/web/app/(auth)/layout.tsx
- [ ] apps/web/app/(auth)/connexion/page.tsx
- [ ] apps/web/app/(auth)/inscription/page.tsx

## Frontend - Admin Interface (16 pages)
- [ ] apps/web/app/admin/layout.tsx
- [ ] apps/web/app/admin/page.tsx
- [ ] apps/web/app/admin/dashboard/page.tsx
- [ ] apps/web/app/admin/commandes/page.tsx
- [ ] apps/web/app/admin/commandes/[id]/page.tsx
- [ ] apps/web/app/admin/produits/page.tsx
- [ ] apps/web/app/admin/produits/nouveau/page.tsx
- [ ] apps/web/app/admin/produits/[id]/page.tsx
- [ ] apps/web/app/admin/produits/[id]/stock/page.tsx
- [ ] apps/web/app/admin/categories/page.tsx
- [ ] apps/web/app/admin/clients/page.tsx
- [ ] apps/web/app/admin/clients/[id]/page.tsx
- [ ] apps/web/app/admin/avis/page.tsx
- [ ] apps/web/app/admin/stock/page.tsx
- [ ] apps/web/app/admin/analytiques/page.tsx
- [ ] apps/web/app/admin/parametres/page.tsx

## Frontend - Store Components (30 files)
- [ ] apps/web/components/store/home/HeroSection.tsx
- [ ] apps/web/components/store/home/CategoryGrid.tsx
- [ ] apps/web/components/store/home/FeaturedProducts.tsx
- [ ] apps/web/components/store/home/StripBanner.tsx
- [ ] apps/web/components/store/products/ProductCard.tsx
- [ ] apps/web/components/store/products/ProductGrid.tsx
- [ ] apps/web/components/store/products/ProductFilters.tsx
- [ ] apps/web/components/store/products/ProductSort.tsx
- [ ] apps/web/components/store/products/ProductGallery.tsx
- [ ] apps/web/components/store/products/ProductInfo.tsx
- [ ] apps/web/components/store/products/ProductReviews.tsx
- [ ] apps/web/components/store/products/RelatedProducts.tsx
- [ ] apps/web/components/store/products/ProductBadge.tsx
- [ ] apps/web/components/store/cart/CartDrawer.tsx
- [ ] apps/web/components/store/cart/CartItem.tsx
- [ ] apps/web/components/store/cart/CartSummary.tsx
- [ ] apps/web/components/store/checkout/CheckoutStepper.tsx
- [ ] apps/web/components/store/checkout/AddressStep.tsx
- [ ] apps/web/components/store/checkout/PaymentStep.tsx
- [ ] apps/web/components/store/checkout/OrderReview.tsx
- [ ] apps/web/components/store/checkout/OrderSuccess.tsx
- [ ] apps/web/components/store/account/AccountSidebar.tsx
- [ ] apps/web/components/store/account/OrdersList.tsx
- [ ] apps/web/components/store/account/OrderDetail.tsx
- [ ] apps/web/components/store/account/AddressBook.tsx
- [ ] apps/web/components/store/account/ProfileForm.tsx

## Frontend - Admin Components (18 files)
- [ ] apps/web/components/admin/layout/AdminSidebar.tsx
- [ ] apps/web/components/admin/layout/AdminTopbar.tsx
- [ ] apps/web/components/admin/layout/AdminBreadcrumb.tsx
- [ ] apps/web/components/admin/dashboard/KpiCards.tsx
- [ ] apps/web/components/admin/dashboard/SalesChart.tsx
- [ ] apps/web/components/admin/dashboard/RecentOrders.tsx
- [ ] apps/web/components/admin/dashboard/StockAlerts.tsx
- [ ] apps/web/components/admin/dashboard/TopProducts.tsx
- [ ] apps/web/components/admin/orders/OrdersTable.tsx
- [ ] apps/web/components/admin/orders/OrderFilters.tsx
- [ ] apps/web/components/admin/orders/OrderDetailView.tsx
- [ ] apps/web/components/admin/orders/OrderStatusBadge.tsx
- [ ] apps/web/components/admin/products/ProductsTable.tsx
- [ ] apps/web/components/admin/products/ProductForm.tsx
- [ ] apps/web/components/admin/products/ImageUploader.tsx
- [ ] apps/web/components/admin/products/StockHistory.tsx
- [ ] apps/web/components/admin/settings/SettingsForm.tsx
- [ ] apps/web/components/admin/reviews/ReviewModerationCard.tsx

## Frontend - UI Components (12 files)
- [ ] apps/web/components/ui/Button.tsx
- [ ] apps/web/components/ui/Input.tsx
- [ ] apps/web/components/ui/Badge.tsx
- [ ] apps/web/components/ui/Dialog.tsx
- [ ] apps/web/components/ui/DataTable.tsx
- [ ] apps/web/components/ui/Pagination.tsx
- [ ] apps/web/components/ui/LoadingSpinner.tsx
- [ ] apps/web/components/ui/EmptyState.tsx
- [ ] apps/web/components/ui/ConfirmDialog.tsx
- [ ] apps/web/components/ui/Toast.tsx
- [ ] apps/web/components/ui/Tabs.tsx
- [ ] apps/web/components/ui/Select.tsx

## Frontend - API Clients (8 files)
- [ ] apps/web/lib/api/client.ts
- [ ] apps/web/lib/api/auth.ts
- [ ] apps/web/lib/api/products.ts
- [ ] apps/web/lib/api/orders.ts
- [ ] apps/web/lib/api/cart.ts
- [ ] apps/web/lib/api/users.ts
- [ ] apps/web/lib/api/reviews.ts
- [ ] apps/web/lib/api/analytics.ts

## Frontend - React Query Hooks (5 files)
- [ ] apps/web/lib/hooks/useProducts.ts
- [ ] apps/web/lib/hooks/useCart.ts
- [ ] apps/web/lib/hooks/useOrders.ts
- [ ] apps/web/lib/hooks/useAuth.ts
- [ ] apps/web/lib/hooks/useAnalytics.ts

## Frontend - Zustand Stores (3 files)
- [ ] apps/web/lib/store/cartStore.ts
- [ ] apps/web/lib/store/authStore.ts
- [ ] apps/web/lib/store/uiStore.ts

## Frontend - Utilities (6 files)
- [ ] apps/web/lib/utils/currency.ts
- [ ] apps/web/lib/utils/date.ts
- [ ] apps/web/lib/utils/validation.ts
- [ ] apps/web/lib/constants/wilayas.ts
- [ ] apps/web/lib/constants/orderStatuses.ts
- [ ] apps/web/lib/constants/paymentMethods.ts

## Frontend - Types (5 files)
- [ ] apps/web/types/product.ts
- [ ] apps/web/types/order.ts
- [ ] apps/web/types/user.ts
- [ ] apps/web/types/cart.ts
- [ ] apps/web/types/api.ts

## Documentation
- [ ] README.md

---

## SUMMARY
- Total files: ~250
- Completed: ~15 (6%)
- Remaining: ~235 (94%)
