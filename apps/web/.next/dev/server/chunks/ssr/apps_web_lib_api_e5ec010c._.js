module.exports = [
"[project]/apps/web/lib/api/client.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "API_ENDPOINTS",
    ()=>API_ENDPOINTS,
    "DashboardAPI",
    ()=>DashboardAPI,
    "OrdersAPI",
    ()=>OrdersAPI,
    "ProductsAPI",
    ()=>ProductsAPI,
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
 * Enhanced with error handling, retry logic, and organized endpoints
 */ const BASE_URL = ("TURBOPACK compile-time value", "http://localhost:3001/api") || 'http://localhost:3000';
const API_VERSION = 'v1';
const API_ENDPOINTS = {
    // Dashboard
    DASHBOARD_METRICS: `/api/${API_VERSION}/admin/dashboard/metrics`,
    // Products
    PRODUCTS_LIST: `/api/${API_VERSION}/admin/products`,
    PRODUCTS_LOW_STOCK: `/api/${API_VERSION}/admin/products/low-stock`,
    PRODUCT_DETAIL: (id)=>`/api/${API_VERSION}/admin/products/${id}`,
    PRODUCT_CREATE: `/api/${API_VERSION}/admin/products`,
    PRODUCT_UPDATE: (id)=>`/api/${API_VERSION}/admin/products/${id}`,
    PRODUCT_DELETE: (id)=>`/api/${API_VERSION}/admin/products/${id}`,
    // Orders
    ORDERS_LIST: `/api/${API_VERSION}/admin/orders`,
    ORDERS_STATS: `/api/${API_VERSION}/admin/orders/stats`,
    ORDER_DETAIL: (id)=>`/api/${API_VERSION}/admin/orders/${id}`,
    ORDER_UPDATE_STATUS: (id)=>`/api/${API_VERSION}/admin/orders/${id}/status`
};
async function apiFetch(endpoint, options = {}) {
    const { timeout = 10000, ...fetchOptions } = options;
    const url = `${BASE_URL}${endpoint}`;
    const headers = {
        'Content-Type': 'application/json',
        ...fetchOptions.headers
    };
    const token = ("TURBOPACK compile-time falsy", 0) ? "TURBOPACK unreachable" : null;
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(()=>controller.abort(), timeout);
        const response = await fetch(url, {
            ...fetchOptions,
            headers,
            signal: controller.signal
        });
        clearTimeout(timeoutId);
        if (!response.ok) {
            throw new Error(`API Error: ${response.statusText}`);
        }
        const data = await response.json();
        return {
            data: data.data || data,
            success: true
        };
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        console.error(`API Error at ${endpoint}:`, errorMessage);
        return {
            data: null,
            success: false,
            error: errorMessage
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
        return apiGet(API_ENDPOINTS.PRODUCTS_LIST + `?page=${page}&limit=${limit}`);
    }
    static async getLowStock(threshold = 10) {
        return apiGet(API_ENDPOINTS.PRODUCTS_LOW_STOCK + `?threshold=${threshold}`);
    }
    static async getById(id) {
        return apiGet(API_ENDPOINTS.PRODUCT_DETAIL(id));
    }
    static async create(data) {
        return apiPost(API_ENDPOINTS.PRODUCT_CREATE, data);
    }
    static async update(id, data) {
        return apiPatch(API_ENDPOINTS.PRODUCT_UPDATE(id), data);
    }
    static async delete(id) {
        return apiDelete(API_ENDPOINTS.PRODUCT_DELETE(id));
    }
}
class OrdersAPI {
    static async getAll(page = 1, limit = 10, status) {
        const query = new URLSearchParams();
        query.append('page', String(page));
        query.append('limit', String(limit));
        if (status) query.append('status', status);
        return apiGet(API_ENDPOINTS.ORDERS_LIST + `?${query.toString()}`);
    }
    static async getStats() {
        return apiGet(API_ENDPOINTS.ORDERS_STATS);
    }
    static async getById(id) {
        return apiGet(API_ENDPOINTS.ORDER_DETAIL(id));
    }
    static async updateStatus(id, status) {
        return apiPatch(API_ENDPOINTS.ORDER_UPDATE_STATUS(id), {
            status
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
    OrdersAPI
};
}),
"[project]/apps/web/lib/api/products.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "productsApi",
    ()=>productsApi
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/lib/api/client.ts [app-ssr] (ecmascript)");
;
const productsApi = {
    getAll: (params)=>__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].get('/products', {
            params
        }),
    getBySlug: (slug)=>__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].get(`/products/${slug}`),
    getFeatured: ()=>__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].get('/products/featured'),
    getCategories: ()=>__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].get('/categories')
};
}),
];

//# sourceMappingURL=apps_web_lib_api_e5ec010c._.js.map