(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/apps/web/lib/api/client.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
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
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
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
    const token = ("TURBOPACK compile-time truthy", 1) ? localStorage.getItem('accessToken') : "TURBOPACK unreachable";
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
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
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/apps/web/lib/api/products.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "productsApi",
    ()=>productsApi
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/lib/api/client.ts [app-client] (ecmascript)");
;
const productsApi = {
    getAll: (params)=>{
        const query = params ? `?${new URLSearchParams(params).toString()}` : '';
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiGet"])(`/products${query}`);
    },
    getBySlug: (slug)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiGet"])(`/products/${slug}`),
    getFeatured: ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiGet"])('/products/featured'),
    getCategories: ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiGet"])('/categories')
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=apps_web_lib_api_c92d56a5._.js.map