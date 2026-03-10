module.exports = [
"[project]/apps/web/lib/api/client.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "API_ENDPOINTS",
    ()=>API_ENDPOINTS,
    "AuthAPI",
    ()=>AuthAPI,
    "ClientsAPI",
    ()=>ClientsAPI,
    "DashboardAPI",
    ()=>DashboardAPI,
    "OrdersAPI",
    ()=>OrdersAPI,
    "ProductsAPI",
    ()=>ProductsAPI,
    "ReviewsAPI",
    ()=>ReviewsAPI,
    "StockAPI",
    ()=>StockAPI,
    "StoreAPI",
    ()=>StoreAPI,
    "apiDelete",
    ()=>apiDelete,
    "apiFetch",
    ()=>apiFetch,
    "apiGet",
    ()=>apiGet,
    "apiPatch",
    ()=>apiPatch,
    "apiPost",
    ()=>apiPost,
    "default",
    ()=>__TURBOPACK__default__export__
]);
/**
 * API Client v1.0
 * Centralized API management with version support
 * Uses real backend API endpoints only
 */ const BASE_URL = ("TURBOPACK compile-time value", "http://localhost:3001/api") || 'http://localhost:3001';
const API_VERSION = 'v1';
const API_ENDPOINTS = {
    // Admin (versioned)
    DASHBOARD_METRICS: `/api/${API_VERSION}/admin/dashboard/metrics`,
    // Admin products
    PRODUCTS_ADMIN_LIST: `/api/${API_VERSION}/admin/products`,
    PRODUCTS_LOW_STOCK: `/api/${API_VERSION}/admin/products/low-stock`,
    PRODUCT_ADMIN_DETAIL: (id)=>`/api/${API_VERSION}/admin/products/${id}`,
    PRODUCT_ADMIN_CREATE: `/api/${API_VERSION}/admin/products`,
    PRODUCT_ADMIN_UPDATE: (id)=>`/api/${API_VERSION}/admin/products/${id}`,
    PRODUCT_ADMIN_DELETE: (id)=>`/api/${API_VERSION}/admin/products/${id}`,
    // Admin orders
    ORDERS_ADMIN_LIST: `/api/${API_VERSION}/admin/orders`,
    ORDERS_STATS: `/api/${API_VERSION}/admin/orders/stats`,
    ORDER_ADMIN_DETAIL: (id)=>`/api/${API_VERSION}/admin/orders/${id}`,
    ORDER_ADMIN_UPDATE_STATUS: (id)=>`/api/${API_VERSION}/admin/orders/${id}/status`,
    // Public store endpoints (no version prefix)
    STORE_PRODUCTS_LIST: `/api/products`,
    STORE_PRODUCT_DETAIL: (slug)=>`/api/products/${slug}`,
    STORE_FEATURED: `/api/products/featured`,
    STORE_CATEGORIES: `/api/categories`,
    // Cart / checkout (public)
    CART: `/api/cart`,
    CART_ADD_ITEM: `/api/cart/items`,
    // Auth (public)
    AUTH_LOGIN: `/api/auth/login`,
    AUTH_REGISTER: `/api/auth/register`,
    AUTH_ME: `/api/auth/me`
};
async function apiFetch(endpoint, options = {}) {
    const { timeout = 10000, ...fetchOptions } = options;
    const url = `${BASE_URL}${endpoint}`;
    console.log(`🔄 API Request: ${fetchOptions.method || 'GET'} ${url}`);
    const headers = {
        'Content-Type': 'application/json',
        ...fetchOptions.headers
    };
    const token = ("TURBOPACK compile-time falsy", 0) ? "TURBOPACK unreachable" : null;
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(()=>{
            console.warn(`⏰ API Request timeout: ${url}`);
            controller.abort();
        }, timeout);
        const response = await fetch(url, {
            ...fetchOptions,
            headers,
            signal: controller.signal
        });
        clearTimeout(timeoutId);
        console.log(`📡 API Response: ${response.status} ${response.statusText} for ${url}`);
        if (!response.ok) {
            const errorData = await response.json().catch(()=>({
                    message: 'Unknown error'
                }));
            console.error(`❌ API Error: ${response.status} ${response.statusText}`, {
                url,
                status: response.status,
                error: errorData
            });
            return {
                data: null,
                success: false,
                error: errorData.message || `HTTP ${response.status}: ${response.statusText}`
            };
        }
        const data = await response.json();
        console.log(`✅ API Success: ${url}`, {
            dataKeys: Object.keys(data)
        });
        return {
            data: data.data || data,
            success: true
        };
    } catch (error) {
        console.error(`💥 API Network Error: ${url}`, error);
        return {
            data: null,
            success: false,
            error: error instanceof Error ? error.message : 'Network error'
        };
    }
}
function apiGet(endpoint, options) {
    return apiFetch(endpoint, {
        ...options,
        method: 'GET'
    });
}
function apiPost(endpoint, body, options) {
    return apiFetch(endpoint, {
        ...options,
        method: 'POST',
        body: body ? JSON.stringify(body) : undefined
    });
}
function apiPatch(endpoint, body, options) {
    return apiFetch(endpoint, {
        ...options,
        method: 'PATCH',
        body: body ? JSON.stringify(body) : undefined
    });
}
function apiDelete(endpoint, options) {
    return apiFetch(endpoint, {
        ...options,
        method: 'DELETE'
    });
}
class DashboardAPI {
    static async getMetrics() {
        return apiGet(API_ENDPOINTS.DASHBOARD_METRICS);
    }
}
class ProductsAPI {
    static async getAll(page = 1, limit = 10) {
        return apiGet(API_ENDPOINTS.PRODUCTS_ADMIN_LIST + `?page=${page}&limit=${limit}`);
    }
    static async getLowStock(threshold = 10) {
        return apiGet(API_ENDPOINTS.PRODUCTS_LOW_STOCK + `?threshold=${threshold}`);
    }
    static async getById(id) {
        return apiGet(API_ENDPOINTS.PRODUCT_ADMIN_DETAIL(id));
    }
    static async create(data) {
        return apiPost(API_ENDPOINTS.PRODUCT_CREATE, data);
    }
    static async update(id, data) {
        return apiPatch(API_ENDPOINTS.PRODUCT_UPDATE(id), data);
    }
    static async delete(id) {
        return apiDelete(API_ENDPOINTS.PRODUCT_ADMIN_DELETE(id));
    }
}
class OrdersAPI {
    static async getAll(page = 1, limit = 10, status) {
        const query = new URLSearchParams();
        query.append('page', String(page));
        query.append('limit', String(limit));
        if (status) query.append('status', status);
        return apiGet(API_ENDPOINTS.ORDERS_ADMIN_LIST + `?${query.toString()}`);
    }
    static async getStats() {
        return apiGet(API_ENDPOINTS.ORDERS_STATS);
    }
    static async getById(id) {
        return apiGet(API_ENDPOINTS.ORDER_ADMIN_DETAIL(id));
    }
    static async updateStatus(id, status) {
        return apiPatch(API_ENDPOINTS.ORDER_ADMIN_UPDATE_STATUS(id), {
            status
        });
    }
}
class StoreAPI {
    static async getProducts(page = 1, limit = 12, params = {}) {
        const query = new URLSearchParams({
            page: String(page),
            limit: String(limit),
            ...params
        });
        return apiGet(API_ENDPOINTS.STORE_PRODUCTS_LIST + `?${query.toString()}`);
    }
    static async getProductBySlug(slug) {
        return apiGet(API_ENDPOINTS.STORE_PRODUCT_DETAIL(slug));
    }
    static async getCategories() {
        return apiGet(API_ENDPOINTS.STORE_CATEGORIES);
    }
    static async getFeatured() {
        return apiGet(API_ENDPOINTS.STORE_FEATURED);
    }
    static async getCart() {
        return apiGet(API_ENDPOINTS.CART);
    }
    static async addCartItem(item) {
        return apiPost(API_ENDPOINTS.CART_ADD_ITEM, item);
    }
    static async getMyOrders(page = 1, limit = 10) {
        return apiGet(`/api/orders/my?page=${page}&limit=${limit}`);
    }
}
class AuthAPI {
    static async login(email, password) {
        return apiPost(API_ENDPOINTS.AUTH_LOGIN, {
            email,
            password
        });
    }
    static async register(data) {
        return apiPost(API_ENDPOINTS.AUTH_REGISTER, data);
    }
    static async me() {
        return apiGet(API_ENDPOINTS.AUTH_ME);
    }
}
class ReviewsAPI {
    static async getAll(page = 1) {
        return apiGet(`/api/${API_VERSION}/admin/reviews?page=${page}`);
    }
    static async moderate(id, status) {
        return apiPatch(`/api/${API_VERSION}/admin/reviews/${id}`, {
            status
        });
    }
}
class ClientsAPI {
    static async getAll(page = 1, limit = 10) {
        const query = new URLSearchParams();
        query.append('page', String(page));
        query.append('limit', String(limit));
        return apiGet(`/users?${query.toString()}`);
    }
    static async getById(id) {
        return apiGet(`/users/${id}`);
    }
}
class StockAPI {
    static async getAll(page = 1) {
        return apiGet(`/api/${API_VERSION}/admin/stock?page=${page}`);
    }
    static async recordMovement(productId, quantity, type) {
        return apiPost(`/api/${API_VERSION}/admin/stock/movement`, {
            productId,
            quantity,
            type
        });
    }
}
const __TURBOPACK__default__export__ = {
    API_ENDPOINTS,
    apiFetch,
    apiGet,
    apiPost,
    apiPatch,
    apiDelete,
    DashboardAPI,
    ProductsAPI,
    OrdersAPI,
    ReviewsAPI,
    ClientsAPI,
    StockAPI
};
}),
"[project]/apps/web/app/admin/produits/page.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>AdminProductsPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/plus.js [app-ssr] (ecmascript) <export default as Plus>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/search.js [app-ssr] (ecmascript) <export default as Search>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$bell$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Bell$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/bell.js [app-ssr] (ecmascript) <export default as Bell>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$download$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Download$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/download.js [app-ssr] (ecmascript) <export default as Download>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shopping$2d$bag$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ShoppingBag$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/shopping-bag.js [app-ssr] (ecmascript) <export default as ShoppingBag>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$alert$2d$circle$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertCircle$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/alert-circle.js [app-ssr] (ecmascript) <export default as AlertCircle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/loader.js [app-ssr] (ecmascript) <export default as Loader>");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/apps/web/lib/utils.ts [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$lib$2f$utils$2f$cn$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/lib/utils/cn.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/lib/api/client.ts [app-ssr] (ecmascript)");
'use client';
;
;
;
;
;
;
const tabs = [
    {
        name: 'Tous',
        key: 'all'
    },
    {
        name: 'Vernis Gel',
        key: 'vernis'
    },
    {
        name: 'Gel UV',
        key: 'uv'
    },
    {
        name: 'Décoration',
        key: 'deco'
    },
    {
        name: 'Stock faible',
        key: 'low'
    }
];
function AdminProductsPage() {
    const [activeTab, setActiveTab] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('all');
    const [products, setProducts] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [stats, setStats] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(true);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        fetchProducts();
        fetchStats();
    }, [
        activeTab
    ]);
    const fetchProducts = async ()=>{
        try {
            console.log('🔄 Products: Starting data fetch');
            setLoading(true);
            const result = await __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ProductsAPI"].getAll(1, 50); // Get first page with 50 items
            console.log('📦 Products: API result received', result);
            if (result.success && result.data) {
                console.log('✅ Products: Data loaded successfully', result.data);
                let filteredProducts = result.data.items || [];
                // Filter based on active tab
                if (activeTab === 'low') {
                    filteredProducts = filteredProducts.filter((p)=>p.status === 'low_stock');
                } else if (activeTab !== 'all') {
                // For category filtering, we'd need to match category names
                // For now, just show all products
                }
                setProducts(filteredProducts);
            } else {
                console.error('❌ Products: API returned error', result.error);
                setError(result.error || 'Erreur lors du chargement des produits');
            }
        } catch (err) {
            console.error('💥 Products: Network error', err);
            setError('Impossible de charger les produits');
        } finally{
            setLoading(false);
        }
    };
    const fetchStats = async ()=>{
        try {
            // Get low stock products for stats
            const lowStockResult = await __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ProductsAPI"].getLowStock(10);
            const allProductsResult = await __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ProductsAPI"].getAll(1, 1000); // Get all products for total count
            if (lowStockResult.success && allProductsResult.success) {
                const lowStockCount = lowStockResult.data?.items?.length || 0;
                const totalProducts = allProductsResult.data?.total || 0;
                setStats({
                    totalProducts,
                    lowStockProducts: lowStockCount,
                    totalClients: 0,
                    vipClients: 0,
                    totalRevenue: 0,
                    averageOrdersPerClient: 0
                });
            }
        } catch (err) {
            console.error('Stats error:', err);
        }
    };
    const getStatusBadge = (product)=>{
        if (product.stock === 0) {
            return {
                text: 'Rupture',
                color: 'bg-rouge text-creme'
            };
        } else if (product.stock <= product.alertThreshold) {
            return {
                text: 'Stock faible',
                color: 'bg-or text-encre'
            };
        } else {
            return {
                text: 'En stock',
                color: 'bg-green-600 text-white'
            };
        }
    };
    const getActionButton = (product)=>{
        if (product.stock === 0) {
            return {
                text: 'Commander',
                style: 'bg-rouge text-creme hover:bg-rouge-deep'
            };
        } else if (product.stock <= product.alertThreshold) {
            return {
                text: 'Commander',
                style: 'bg-or text-encre hover:bg-encre hover:text-creme'
            };
        } else {
            return {
                text: 'Éditer',
                style: 'bg-[#1A0A0A] text-creme hover:bg-rouge-deep'
            };
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "space-y-8 pb-12",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex flex-col md:flex-row md:items-center justify-between gap-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                className: "text-3xl font-serif text-encre",
                                children: "Produits"
                            }, void 0, false, {
                                fileName: "[project]/apps/web/app/admin/produits/page.tsx",
                                lineNumber: 125,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-encre3 text-[10px] uppercase tracking-widest font-bold mt-1",
                                children: "Catalogue & inventaire — 04 Mars 2026"
                            }, void 0, false, {
                                fileName: "[project]/apps/web/app/admin/produits/page.tsx",
                                lineNumber: 126,
                                columnNumber: 21
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/apps/web/app/admin/produits/page.tsx",
                        lineNumber: 124,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center space-x-3",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "relative group",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__["Search"], {
                                        className: "absolute left-3 top-1/2 -translate-y-1/2 text-encre3 group-focus-within:text-or transition-colors",
                                        size: 16
                                    }, void 0, false, {
                                        fileName: "[project]/apps/web/app/admin/produits/page.tsx",
                                        lineNumber: 131,
                                        columnNumber: 25
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        type: "text",
                                        placeholder: "Rechercher...",
                                        className: "pl-10 pr-4 py-2.5 bg-white border border-creme2 rounded-sm text-sm focus:outline-none focus:border-or focus:ring-1 focus:ring-or w-64 shadow-sm transition-all"
                                    }, void 0, false, {
                                        fileName: "[project]/apps/web/app/admin/produits/page.tsx",
                                        lineNumber: 132,
                                        columnNumber: 25
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/apps/web/app/admin/produits/page.tsx",
                                lineNumber: 130,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                className: "p-2.5 bg-white border border-creme2 rounded-sm text-encre3 hover:text-or hover:border-or transition-all shadow-sm",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$bell$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Bell$3e$__["Bell"], {
                                    size: 18
                                }, void 0, false, {
                                    fileName: "[project]/apps/web/app/admin/produits/page.tsx",
                                    lineNumber: 139,
                                    columnNumber: 25
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/apps/web/app/admin/produits/page.tsx",
                                lineNumber: 138,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                className: "p-2.5 bg-white border border-creme2 rounded-sm text-encre3 hover:text-or hover:border-or transition-all shadow-sm",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$download$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Download$3e$__["Download"], {
                                    size: 18
                                }, void 0, false, {
                                    fileName: "[project]/apps/web/app/admin/produits/page.tsx",
                                    lineNumber: 142,
                                    columnNumber: 25
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/apps/web/app/admin/produits/page.tsx",
                                lineNumber: 141,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                className: "flex items-center space-x-2 px-5 py-2.5 bg-rouge-deep text-creme rounded-sm text-sm font-bold uppercase tracking-widest hover:bg-rouge-mid transition-all shadow-md",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__["Plus"], {
                                        size: 16
                                    }, void 0, false, {
                                        fileName: "[project]/apps/web/app/admin/produits/page.tsx",
                                        lineNumber: 145,
                                        columnNumber: 25
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        children: "Nouveau"
                                    }, void 0, false, {
                                        fileName: "[project]/apps/web/app/admin/produits/page.tsx",
                                        lineNumber: 146,
                                        columnNumber: 25
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/apps/web/app/admin/produits/page.tsx",
                                lineNumber: 144,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                href: "/",
                                className: "px-5 py-2.5 border border-encre text-encre rounded-sm text-sm font-bold hover:bg-encre hover:text-creme transition-all",
                                children: "Voir la boutique"
                            }, void 0, false, {
                                fileName: "[project]/apps/web/app/admin/produits/page.tsx",
                                lineNumber: 148,
                                columnNumber: 21
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/apps/web/app/admin/produits/page.tsx",
                        lineNumber: 129,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/apps/web/app/admin/produits/page.tsx",
                lineNumber: 123,
                columnNumber: 13
            }, this),
            stats && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "grid grid-cols-1 md:grid-cols-3 gap-6",
                children: [
                    {
                        label: 'Stock faible',
                        value: stats.lowStockProducts.toString(),
                        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$alert$2d$circle$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertCircle$3e$__["AlertCircle"],
                        color: 'text-or',
                        bg: 'bg-or/10'
                    },
                    {
                        label: 'Total produits',
                        value: stats.totalProducts.toString(),
                        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shopping$2d$bag$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ShoppingBag$3e$__["ShoppingBag"],
                        color: 'text-encre3',
                        bg: 'bg-creme'
                    },
                    {
                        label: 'Ruptures totales',
                        value: products.filter((p)=>p.status === 'out_of_stock').length.toString(),
                        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$alert$2d$circle$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertCircle$3e$__["AlertCircle"],
                        color: 'text-rouge',
                        bg: 'bg-rouge/10'
                    }
                ].map((stat, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "bg-white rounded-sm border border-creme2 p-6 flex items-center space-x-4 shadow-sm hover:border-or transition-all",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$lib$2f$utils$2f$cn$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("w-12 h-12 rounded-full flex items-center justify-center", stat.bg),
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(stat.icon, {
                                    size: 22,
                                    className: stat.color
                                }, void 0, false, {
                                    fileName: "[project]/apps/web/app/admin/produits/page.tsx",
                                    lineNumber: 164,
                                    columnNumber: 33
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/apps/web/app/admin/produits/page.tsx",
                                lineNumber: 163,
                                columnNumber: 29
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-[10px] uppercase font-black tracking-widest text-encre3",
                                        children: stat.label
                                    }, void 0, false, {
                                        fileName: "[project]/apps/web/app/admin/produits/page.tsx",
                                        lineNumber: 167,
                                        columnNumber: 33
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-2xl font-bold text-encre mt-1",
                                        children: stat.value
                                    }, void 0, false, {
                                        fileName: "[project]/apps/web/app/admin/produits/page.tsx",
                                        lineNumber: 168,
                                        columnNumber: 33
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/apps/web/app/admin/produits/page.tsx",
                                lineNumber: 166,
                                columnNumber: 29
                            }, this)
                        ]
                    }, i, true, {
                        fileName: "[project]/apps/web/app/admin/produits/page.tsx",
                        lineNumber: 162,
                        columnNumber: 25
                    }, this))
            }, void 0, false, {
                fileName: "[project]/apps/web/app/admin/produits/page.tsx",
                lineNumber: 156,
                columnNumber: 17
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex flex-wrap items-center justify-between gap-6",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center bg-white p-1 rounded-sm border border-creme2",
                        children: tabs.map((tab)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>setActiveTab(tab.key),
                                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$lib$2f$utils$2f$cn$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("px-6 py-2 text-[10px] font-black uppercase tracking-widest rounded-sm transition-all", activeTab === tab.key ? "bg-[#1A0A0A] text-creme shadow-lg scale-105" : "text-encre3 hover:bg-creme/50"),
                                children: tab.name
                            }, tab.key, false, {
                                fileName: "[project]/apps/web/app/admin/produits/page.tsx",
                                lineNumber: 179,
                                columnNumber: 25
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/apps/web/app/admin/produits/page.tsx",
                        lineNumber: 177,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center space-x-3",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                className: "flex items-center space-x-2 px-6 py-2 bg-creme border border-creme2 text-encre text-xs font-bold uppercase tracking-widest rounded-sm hover:border-or transition-all",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    children: "Exporter"
                                }, void 0, false, {
                                    fileName: "[project]/apps/web/app/admin/produits/page.tsx",
                                    lineNumber: 196,
                                    columnNumber: 25
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/apps/web/app/admin/produits/page.tsx",
                                lineNumber: 195,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                className: "flex items-center space-x-2 px-6 py-2 bg-[#1A0A0A] text-creme text-xs font-bold uppercase tracking-widest rounded-sm hover:bg-rouge-deep transition-all shadow-lg group",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__["Plus"], {
                                        size: 14,
                                        className: "text-or"
                                    }, void 0, false, {
                                        fileName: "[project]/apps/web/app/admin/produits/page.tsx",
                                        lineNumber: 199,
                                        columnNumber: 25
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        children: "Nouveau produit"
                                    }, void 0, false, {
                                        fileName: "[project]/apps/web/app/admin/produits/page.tsx",
                                        lineNumber: 200,
                                        columnNumber: 25
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/apps/web/app/admin/produits/page.tsx",
                                lineNumber: 198,
                                columnNumber: 21
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/apps/web/app/admin/produits/page.tsx",
                        lineNumber: 194,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/apps/web/app/admin/produits/page.tsx",
                lineNumber: 176,
                columnNumber: 13
            }, this),
            loading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center justify-center py-12",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader$3e$__["Loader"], {
                        className: "w-8 h-8 text-or animate-spin"
                    }, void 0, false, {
                        fileName: "[project]/apps/web/app/admin/produits/page.tsx",
                        lineNumber: 208,
                        columnNumber: 21
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "ml-2 text-encre3",
                        children: "Chargement des produits..."
                    }, void 0, false, {
                        fileName: "[project]/apps/web/app/admin/produits/page.tsx",
                        lineNumber: 209,
                        columnNumber: 21
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/apps/web/app/admin/produits/page.tsx",
                lineNumber: 207,
                columnNumber: 17
            }, this) : error ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "text-center py-12",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$alert$2d$circle$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertCircle$3e$__["AlertCircle"], {
                        className: "w-12 h-12 text-rouge mx-auto mb-4"
                    }, void 0, false, {
                        fileName: "[project]/apps/web/app/admin/produits/page.tsx",
                        lineNumber: 213,
                        columnNumber: 21
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-rouge",
                        children: error
                    }, void 0, false, {
                        fileName: "[project]/apps/web/app/admin/produits/page.tsx",
                        lineNumber: 214,
                        columnNumber: 21
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/apps/web/app/admin/produits/page.tsx",
                lineNumber: 212,
                columnNumber: 17
            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8",
                children: products.map((product)=>{
                    const statusBadge = getStatusBadge(product);
                    const actionButton = getActionButton(product);
                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "bg-white rounded-sm border border-creme2 shadow-lg overflow-hidden group hover:border-or transition-all duration-500",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "relative aspect-[4/3] p-12 bg-creme/20 flex items-center justify-center overflow-hidden",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "w-full h-full rounded-md shadow-2xl transition-transform duration-700 group-hover:scale-110 bg-gradient-to-br from-rouge-deep/20 to-rouge-mid/20"
                                    }, void 0, false, {
                                        fileName: "[project]/apps/web/app/admin/produits/page.tsx",
                                        lineNumber: 226,
                                        columnNumber: 37
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "absolute top-4 right-4 flex flex-col items-end space-y-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "bg-white/90 backdrop-blur-sm text-encre px-2 py-1 rounded-sm text-[10px] font-black uppercase border border-creme2 shadow-sm",
                                                children: [
                                                    product.stock,
                                                    " u."
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/apps/web/app/admin/produits/page.tsx",
                                                lineNumber: 230,
                                                columnNumber: 41
                                            }, this),
                                            product.status === 'low_stock' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "bg-or text-encre px-2 py-1 rounded-sm text-[8px] font-black uppercase shadow-sm",
                                                children: "Stock faible"
                                            }, void 0, false, {
                                                fileName: "[project]/apps/web/app/admin/produits/page.tsx",
                                                lineNumber: 234,
                                                columnNumber: 45
                                            }, this),
                                            product.status === 'out_of_stock' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "bg-rouge text-creme px-2 py-1 rounded-sm text-[8px] font-black uppercase shadow-sm",
                                                children: "Épuisé"
                                            }, void 0, false, {
                                                fileName: "[project]/apps/web/app/admin/produits/page.tsx",
                                                lineNumber: 239,
                                                columnNumber: 45
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/apps/web/app/admin/produits/page.tsx",
                                        lineNumber: 229,
                                        columnNumber: 37
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/apps/web/app/admin/produits/page.tsx",
                                lineNumber: 225,
                                columnNumber: 33
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "p-6 border-t border-creme2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex justify-between items-start mb-4",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-[10px] uppercase font-bold text-or tracking-[0.2em] mb-1",
                                                    children: product.category
                                                }, void 0, false, {
                                                    fileName: "[project]/apps/web/app/admin/produits/page.tsx",
                                                    lineNumber: 250,
                                                    columnNumber: 45
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                    className: "font-serif text-lg text-encre group-hover:text-rouge-deep transition-colors",
                                                    children: product.name
                                                }, void 0, false, {
                                                    fileName: "[project]/apps/web/app/admin/produits/page.tsx",
                                                    lineNumber: 251,
                                                    columnNumber: 45
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/apps/web/app/admin/produits/page.tsx",
                                            lineNumber: 249,
                                            columnNumber: 41
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/apps/web/app/admin/produits/page.tsx",
                                        lineNumber: 248,
                                        columnNumber: 37
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center justify-between mt-6",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-lg font-black text-encre",
                                                children: [
                                                    product.price,
                                                    " DA"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/apps/web/app/admin/produits/page.tsx",
                                                lineNumber: 256,
                                                columnNumber: 41
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex space-x-2",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$lib$2f$utils$2f$cn$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-sm transition-all", actionButton.style),
                                                    children: actionButton.text
                                                }, void 0, false, {
                                                    fileName: "[project]/apps/web/app/admin/produits/page.tsx",
                                                    lineNumber: 258,
                                                    columnNumber: 45
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/apps/web/app/admin/produits/page.tsx",
                                                lineNumber: 257,
                                                columnNumber: 41
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/apps/web/app/admin/produits/page.tsx",
                                        lineNumber: 255,
                                        columnNumber: 37
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/apps/web/app/admin/produits/page.tsx",
                                lineNumber: 247,
                                columnNumber: 33
                            }, this)
                        ]
                    }, product.id, true, {
                        fileName: "[project]/apps/web/app/admin/produits/page.tsx",
                        lineNumber: 223,
                        columnNumber: 29
                    }, this);
                })
            }, void 0, false, {
                fileName: "[project]/apps/web/app/admin/produits/page.tsx",
                lineNumber: 217,
                columnNumber: 17
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "grid grid-cols-1 md:grid-cols-2 gap-8 opacity-40",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "border border-dashed border-creme2 rounded-sm p-12 flex flex-col items-center justify-center text-encre3 space-y-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shopping$2d$bag$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ShoppingBag$3e$__["ShoppingBag"], {
                                size: 48,
                                strokeWidth: 1
                            }, void 0, false, {
                                fileName: "[project]/apps/web/app/admin/produits/page.tsx",
                                lineNumber: 273,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "font-serif text-lg",
                                children: "Ajouter une nouvelle variante"
                            }, void 0, false, {
                                fileName: "[project]/apps/web/app/admin/produits/page.tsx",
                                lineNumber: 274,
                                columnNumber: 21
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/apps/web/app/admin/produits/page.tsx",
                        lineNumber: 272,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "border border-dashed border-creme2 rounded-sm p-12 flex flex-col items-center justify-center text-encre3 space-y-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$alert$2d$circle$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertCircle$3e$__["AlertCircle"], {
                                size: 48,
                                strokeWidth: 1
                            }, void 0, false, {
                                fileName: "[project]/apps/web/app/admin/produits/page.tsx",
                                lineNumber: 277,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "font-serif text-lg",
                                children: "Gérer les alertes globales"
                            }, void 0, false, {
                                fileName: "[project]/apps/web/app/admin/produits/page.tsx",
                                lineNumber: 278,
                                columnNumber: 21
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/apps/web/app/admin/produits/page.tsx",
                        lineNumber: 276,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/apps/web/app/admin/produits/page.tsx",
                lineNumber: 271,
                columnNumber: 13
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/apps/web/app/admin/produits/page.tsx",
        lineNumber: 121,
        columnNumber: 9
    }, this);
}
}),
"[project]/node_modules/lucide-react/dist/esm/icons/plus.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Plus
]);
/**
 * lucide-react v0.292.0 - ISC
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/createLucideIcon.js [app-ssr] (ecmascript)");
;
const Plus = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"])("Plus", [
    [
        "path",
        {
            d: "M5 12h14",
            key: "1ays0h"
        }
    ],
    [
        "path",
        {
            d: "M12 5v14",
            key: "s699le"
        }
    ]
]);
;
 //# sourceMappingURL=plus.js.map
}),
"[project]/node_modules/lucide-react/dist/esm/icons/plus.js [app-ssr] (ecmascript) <export default as Plus>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Plus",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/plus.js [app-ssr] (ecmascript)");
}),
"[project]/node_modules/lucide-react/dist/esm/icons/download.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Download
]);
/**
 * lucide-react v0.292.0 - ISC
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/createLucideIcon.js [app-ssr] (ecmascript)");
;
const Download = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"])("Download", [
    [
        "path",
        {
            d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4",
            key: "ih7n3h"
        }
    ],
    [
        "polyline",
        {
            points: "7 10 12 15 17 10",
            key: "2ggqvy"
        }
    ],
    [
        "line",
        {
            x1: "12",
            x2: "12",
            y1: "15",
            y2: "3",
            key: "1vk2je"
        }
    ]
]);
;
 //# sourceMappingURL=download.js.map
}),
"[project]/node_modules/lucide-react/dist/esm/icons/download.js [app-ssr] (ecmascript) <export default as Download>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Download",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$download$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$download$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/download.js [app-ssr] (ecmascript)");
}),
"[project]/node_modules/lucide-react/dist/esm/icons/shopping-bag.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ShoppingBag
]);
/**
 * lucide-react v0.292.0 - ISC
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/createLucideIcon.js [app-ssr] (ecmascript)");
;
const ShoppingBag = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"])("ShoppingBag", [
    [
        "path",
        {
            d: "M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z",
            key: "hou9p0"
        }
    ],
    [
        "path",
        {
            d: "M3 6h18",
            key: "d0wm0j"
        }
    ],
    [
        "path",
        {
            d: "M16 10a4 4 0 0 1-8 0",
            key: "1ltviw"
        }
    ]
]);
;
 //# sourceMappingURL=shopping-bag.js.map
}),
"[project]/node_modules/lucide-react/dist/esm/icons/shopping-bag.js [app-ssr] (ecmascript) <export default as ShoppingBag>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ShoppingBag",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shopping$2d$bag$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shopping$2d$bag$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/shopping-bag.js [app-ssr] (ecmascript)");
}),
"[project]/node_modules/lucide-react/dist/esm/icons/alert-circle.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>AlertCircle
]);
/**
 * lucide-react v0.292.0 - ISC
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/createLucideIcon.js [app-ssr] (ecmascript)");
;
const AlertCircle = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"])("AlertCircle", [
    [
        "circle",
        {
            cx: "12",
            cy: "12",
            r: "10",
            key: "1mglay"
        }
    ],
    [
        "line",
        {
            x1: "12",
            x2: "12",
            y1: "8",
            y2: "12",
            key: "1pkeuh"
        }
    ],
    [
        "line",
        {
            x1: "12",
            x2: "12.01",
            y1: "16",
            y2: "16",
            key: "4dfq90"
        }
    ]
]);
;
 //# sourceMappingURL=alert-circle.js.map
}),
"[project]/node_modules/lucide-react/dist/esm/icons/alert-circle.js [app-ssr] (ecmascript) <export default as AlertCircle>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AlertCircle",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$alert$2d$circle$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$alert$2d$circle$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/alert-circle.js [app-ssr] (ecmascript)");
}),
"[project]/node_modules/lucide-react/dist/esm/icons/loader.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Loader
]);
/**
 * lucide-react v0.292.0 - ISC
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/createLucideIcon.js [app-ssr] (ecmascript)");
;
const Loader = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"])("Loader", [
    [
        "line",
        {
            x1: "12",
            x2: "12",
            y1: "2",
            y2: "6",
            key: "gza1u7"
        }
    ],
    [
        "line",
        {
            x1: "12",
            x2: "12",
            y1: "18",
            y2: "22",
            key: "1qhbu9"
        }
    ],
    [
        "line",
        {
            x1: "4.93",
            x2: "7.76",
            y1: "4.93",
            y2: "7.76",
            key: "xae44r"
        }
    ],
    [
        "line",
        {
            x1: "16.24",
            x2: "19.07",
            y1: "16.24",
            y2: "19.07",
            key: "bxnmvf"
        }
    ],
    [
        "line",
        {
            x1: "2",
            x2: "6",
            y1: "12",
            y2: "12",
            key: "89khin"
        }
    ],
    [
        "line",
        {
            x1: "18",
            x2: "22",
            y1: "12",
            y2: "12",
            key: "pb8tfm"
        }
    ],
    [
        "line",
        {
            x1: "4.93",
            x2: "7.76",
            y1: "19.07",
            y2: "16.24",
            key: "1uxjnu"
        }
    ],
    [
        "line",
        {
            x1: "16.24",
            x2: "19.07",
            y1: "7.76",
            y2: "4.93",
            key: "6duxfx"
        }
    ]
]);
;
 //# sourceMappingURL=loader.js.map
}),
"[project]/node_modules/lucide-react/dist/esm/icons/loader.js [app-ssr] (ecmascript) <export default as Loader>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Loader",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/loader.js [app-ssr] (ecmascript)");
}),
];

//# sourceMappingURL=_813af81d._.js.map