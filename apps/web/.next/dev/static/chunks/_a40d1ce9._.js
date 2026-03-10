(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/apps/web/lib/mocks/api.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// Mock API data for development while backend compiles
__turbopack_context__.s([
    "mockClients",
    ()=>mockClients,
    "mockDashboardMetrics",
    ()=>mockDashboardMetrics,
    "mockOrders",
    ()=>mockOrders,
    "mockOrdersStats",
    ()=>mockOrdersStats,
    "mockProducts",
    ()=>mockProducts,
    "mockProductsLowStock",
    ()=>mockProductsLowStock,
    "mockReviews",
    ()=>mockReviews,
    "mockStock",
    ()=>mockStock
]);
const mockDashboardMetrics = {
    success: true,
    data: {
        kpis: {
            totalRevenue: 45280,
            totalOrders: 324,
            activeClients: 156,
            averageCart: 139.75,
            completedOrders: 298
        },
        charts: {
            monthlyRevenue: [
                {
                    name: 'Sep',
                    revenue: 6200
                },
                {
                    name: 'Oct',
                    revenue: 7450
                },
                {
                    name: 'Nov',
                    revenue: 8230
                },
                {
                    name: 'Dec',
                    revenue: 9100
                },
                {
                    name: 'Jan',
                    revenue: 7800
                },
                {
                    name: 'Feb',
                    revenue: 6500
                }
            ],
            productSales: [
                {
                    name: 'Pink Nail Polish',
                    sales: 45
                },
                {
                    name: 'Gel Extensions',
                    sales: 38
                },
                {
                    name: 'Acrylic Nails',
                    sales: 32
                },
                {
                    name: 'Nail Art Kit',
                    sales: 28
                },
                {
                    name: 'UV Lamp',
                    sales: 22
                }
            ],
            orderStatusBreakdown: {
                pending: 12,
                delivered: 298,
                cancelled: 14
            },
            customerGrowth: [
                {
                    name: 'Sep',
                    count: 45
                },
                {
                    name: 'Oct',
                    count: 67
                },
                {
                    name: 'Nov',
                    count: 89
                },
                {
                    name: 'Dec',
                    count: 112
                },
                {
                    name: 'Jan',
                    count: 134
                },
                {
                    name: 'Feb',
                    count: 156
                }
            ]
        },
        alerts: {
            lowStockProducts: [
                {
                    id: '1',
                    name: 'Pink Nail Polish',
                    stock: 5,
                    stockAlert: 10
                },
                {
                    id: '2',
                    name: 'UV Lamp',
                    stock: 2,
                    stockAlert: 5
                }
            ]
        }
    }
};
const mockOrdersStats = {
    success: true,
    data: {
        pending: 12,
        delivered: 298,
        cancelled: 14,
        totalRevenue: 45280
    }
};
const mockProductsLowStock = {
    success: true,
    data: [
        {
            id: '1',
            name: 'Pink Nail Polish',
            stock: 5,
            stockAlert: 10,
            price: 12.99
        },
        {
            id: '2',
            name: 'UV Lamp',
            stock: 2,
            stockAlert: 5,
            price: 49.99
        },
        {
            id: '3',
            name: 'Gel Base Coat',
            stock: 3,
            stockAlert: 8,
            price: 15.99
        }
    ]
};
const mockProducts = {
    success: true,
    data: {
        items: [
            {
                id: '1',
                name: 'Pink Nail Polish',
                price: 12.99,
                stock: 45,
                category: 'Polish',
                image: '/products/pink-polish.jpg'
            },
            {
                id: '2',
                name: 'Gel Extensions',
                price: 24.99,
                stock: 32,
                category: 'Extensions',
                image: '/products/gel-extensions.jpg'
            },
            {
                id: '3',
                name: 'UV Lamp',
                price: 49.99,
                stock: 2,
                category: 'Equipment',
                image: '/products/uv-lamp.jpg'
            }
        ],
        total: 156,
        page: 1,
        limit: 10
    }
};
const mockOrders = {
    success: true,
    data: {
        items: [
            {
                id: 'ORD-001',
                status: 'delivered',
                total: 89.97,
                createdAt: new Date().toISOString(),
                customer: 'Sarah Johnson'
            },
            {
                id: 'ORD-002',
                status: 'pending',
                total: 149.98,
                createdAt: new Date().toISOString(),
                customer: 'Emma Smith'
            },
            {
                id: 'ORD-003',
                status: 'delivered',
                total: 75.98,
                createdAt: new Date().toISOString(),
                customer: 'Olivia Brown'
            }
        ],
        total: 324,
        page: 1,
        limit: 10
    }
};
const mockReviews = {
    success: true,
    data: {
        items: [
            {
                id: '1',
                rating: 5,
                text: 'Amazing quality! My nails looked perfect for 3 weeks.',
                customer: 'Jennifer Lee',
                createdAt: new Date().toISOString(),
                status: 'approved'
            },
            {
                id: '2',
                rating: 4,
                text: 'Good product, delivery was quick',
                customer: 'Michelle Davis',
                createdAt: new Date().toISOString(),
                status: 'approved'
            },
            {
                id: '3',
                rating: 3,
                text: 'Okay, but expected better formula',
                customer: 'Ashley Wilson',
                createdAt: new Date().toISOString(),
                status: 'pending'
            }
        ],
        total: 245,
        page: 1,
        limit: 10
    }
};
const mockClients = {
    success: true,
    data: {
        items: [
            {
                id: '1',
                name: 'Sarah Johnson',
                email: 'sarah@mail.com',
                phone: '+1-555-0101',
                totalOrders: 8,
                totalSpent: 520.5,
                status: 'active',
                joinedAt: '2025-10-15'
            },
            {
                id: '2',
                name: 'Emma Smith',
                email: 'emma@mail.com',
                phone: '+1-555-0102',
                totalOrders: 5,
                totalSpent: 389.75,
                status: 'active',
                joinedAt: '2025-11-20'
            },
            {
                id: '3',
                name: 'Olivia Brown',
                email: 'olivia@mail.com',
                phone: '+1-555-0103',
                totalOrders: 12,
                totalSpent: 856.3,
                status: 'active',
                joinedAt: '2025-09-05'
            }
        ],
        total: 156,
        page: 1,
        limit: 10
    }
};
const mockStock = {
    success: true,
    data: {
        items: [
            {
                id: '1',
                productName: 'Pink Nail Polish',
                currentStock: 45,
                minimumStock: 10,
                lastRestocked: '2026-02-28',
                movement: [
                    {
                        date: '2026-02-28',
                        quantity: 20,
                        type: 'in'
                    },
                    {
                        date: '2026-02-25',
                        quantity: -5,
                        type: 'out'
                    }
                ]
            },
            {
                id: '2',
                productName: 'UV Lamp',
                currentStock: 2,
                minimumStock: 5,
                lastRestocked: '2026-02-15',
                movement: [
                    {
                        date: '2026-02-15',
                        quantity: 10,
                        type: 'in'
                    },
                    {
                        date: '2026-02-20',
                        quantity: -8,
                        type: 'out'
                    }
                ]
            }
        ]
    }
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/apps/web/lib/api/client.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "API_ENDPOINTS",
    ()=>API_ENDPOINTS,
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
 * Enhanced with error handling and mock fallbacks
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$lib$2f$mocks$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/lib/mocks/api.ts [app-client] (ecmascript)");
;
const BASE_URL = ("TURBOPACK compile-time value", "http://localhost:3001/api") || 'http://localhost:3001';
const API_VERSION = 'v1';
const API_ENDPOINTS = {
    // Dashboard
    DASHBOARD_METRICS: `/${API_VERSION}/admin/dashboard/metrics`,
    // Products
    PRODUCTS_LIST: `/${API_VERSION}/admin/products`,
    PRODUCTS_LOW_STOCK: `/${API_VERSION}/admin/products/low-stock`,
    PRODUCT_DETAIL: (id)=>`/${API_VERSION}/admin/products/${id}`,
    PRODUCT_CREATE: `/${API_VERSION}/admin/products`,
    PRODUCT_UPDATE: (id)=>`/${API_VERSION}/admin/products/${id}`,
    PRODUCT_DELETE: (id)=>`/${API_VERSION}/admin/products/${id}`,
    // Orders
    ORDERS_LIST: `/${API_VERSION}/admin/orders`,
    ORDERS_STATS: `/${API_VERSION}/admin/orders/stats`,
    ORDER_DETAIL: (id)=>`/api/${API_VERSION}/admin/orders/${id}`,
    ORDER_UPDATE_STATUS: (id)=>`/api/${API_VERSION}/admin/orders/${id}/status`
};
// Get mock data fallback
function getMockData(endpoint) {
    if (endpoint.includes('/dashboard/metrics')) return __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$lib$2f$mocks$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["mockDashboardMetrics"];
    if (endpoint.includes('/orders/stats')) return __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$lib$2f$mocks$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["mockOrdersStats"];
    if (endpoint.includes('/products/low-stock')) return __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$lib$2f$mocks$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["mockProductsLowStock"];
    if (endpoint.includes('/products')) return __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$lib$2f$mocks$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["mockProducts"];
    if (endpoint.includes('/orders')) return __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$lib$2f$mocks$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["mockOrders"];
    if (endpoint.includes('/reviews')) return __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$lib$2f$mocks$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["mockReviews"];
    if (endpoint.includes('/clients')) return __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$lib$2f$mocks$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["mockClients"];
    if (endpoint.includes('/stock')) return __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$lib$2f$mocks$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["mockStock"];
    return {
        success: false,
        data: null
    };
}
async function apiFetch(endpoint, options = {}) {
    const { timeout = 10000, ...fetchOptions } = options;
    const url = `${BASE_URL}${endpoint}`;
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
        const timeoutId = setTimeout(()=>controller.abort(), timeout);
        const response = await fetch(url, {
            ...fetchOptions,
            headers,
            signal: controller.signal
        });
        clearTimeout(timeoutId);
        if (!response.ok) {
            const errorData = await response.json().catch(()=>({
                    message: 'Unknown error'
                }));
            return {
                data: null,
                success: false,
                error: errorData.message || `HTTP ${response.status}: ${response.statusText}`
            };
        }
        const data = await response.json();
        return {
            data: data.data || data,
            success: true
        };
    } catch (error) {
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
    static async getAll(page = 1) {
        return apiGet(`/api/${API_VERSION}/admin/clients?page=${page}`);
    }
    static async getById(id) {
        return apiGet(`/api/${API_VERSION}/admin/clients/${id}`);
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
"[project]/apps/web/app/admin/produits/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>AdminProductsPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/plus.js [app-client] (ecmascript) <export default as Plus>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/search.js [app-client] (ecmascript) <export default as Search>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$bell$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Bell$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/bell.js [app-client] (ecmascript) <export default as Bell>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$download$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Download$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/download.js [app-client] (ecmascript) <export default as Download>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shopping$2d$bag$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ShoppingBag$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/shopping-bag.js [app-client] (ecmascript) <export default as ShoppingBag>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$alert$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertCircle$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/alert-circle.js [app-client] (ecmascript) <export default as AlertCircle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/apps/web/lib/utils.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$lib$2f$utils$2f$cn$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/lib/utils/cn.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/lib/api/client.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
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
    _s();
    const [activeTab, setActiveTab] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('all');
    const [products, setProducts] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [stats, setStats] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AdminProductsPage.useEffect": ()=>{
            fetchProducts();
            fetchStats();
        }
    }["AdminProductsPage.useEffect"], [
        activeTab
    ]);
    const fetchProducts = async ()=>{
        try {
            setLoading(true);
            const result = await __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ProductsAPI"].getAll(1, 50); // Get first page with 50 items
            if (result.success && result.data) {
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
                setError(result.error || 'Erreur lors du chargement des produits');
            }
        } catch (err) {
            setError('Impossible de charger les produits');
            console.error('Products error:', err);
        } finally{
            setLoading(false);
        }
    };
    const fetchStats = async ()=>{
        try {
            // Get low stock products for stats
            const lowStockResult = await __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ProductsAPI"].getLowStock(10);
            const allProductsResult = await __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ProductsAPI"].getAll(1, 1000); // Get all products for total count
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
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "space-y-8 pb-12",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex flex-col md:flex-row md:items-center justify-between gap-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                className: "text-3xl font-serif text-encre",
                                children: "Produits"
                            }, void 0, false, {
                                fileName: "[project]/apps/web/app/admin/produits/page.tsx",
                                lineNumber: 121,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-encre3 text-[10px] uppercase tracking-widest font-bold mt-1",
                                children: "Catalogue & inventaire — 04 Mars 2026"
                            }, void 0, false, {
                                fileName: "[project]/apps/web/app/admin/produits/page.tsx",
                                lineNumber: 122,
                                columnNumber: 21
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/apps/web/app/admin/produits/page.tsx",
                        lineNumber: 120,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center space-x-3",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "relative group",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__["Search"], {
                                        className: "absolute left-3 top-1/2 -translate-y-1/2 text-encre3 group-focus-within:text-or transition-colors",
                                        size: 16
                                    }, void 0, false, {
                                        fileName: "[project]/apps/web/app/admin/produits/page.tsx",
                                        lineNumber: 127,
                                        columnNumber: 25
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        type: "text",
                                        placeholder: "Rechercher...",
                                        className: "pl-10 pr-4 py-2.5 bg-white border border-creme2 rounded-sm text-sm focus:outline-none focus:border-or focus:ring-1 focus:ring-or w-64 shadow-sm transition-all"
                                    }, void 0, false, {
                                        fileName: "[project]/apps/web/app/admin/produits/page.tsx",
                                        lineNumber: 128,
                                        columnNumber: 25
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/apps/web/app/admin/produits/page.tsx",
                                lineNumber: 126,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                className: "p-2.5 bg-white border border-creme2 rounded-sm text-encre3 hover:text-or hover:border-or transition-all shadow-sm",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$bell$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Bell$3e$__["Bell"], {
                                    size: 18
                                }, void 0, false, {
                                    fileName: "[project]/apps/web/app/admin/produits/page.tsx",
                                    lineNumber: 135,
                                    columnNumber: 25
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/apps/web/app/admin/produits/page.tsx",
                                lineNumber: 134,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                className: "p-2.5 bg-white border border-creme2 rounded-sm text-encre3 hover:text-or hover:border-or transition-all shadow-sm",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$download$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Download$3e$__["Download"], {
                                    size: 18
                                }, void 0, false, {
                                    fileName: "[project]/apps/web/app/admin/produits/page.tsx",
                                    lineNumber: 138,
                                    columnNumber: 25
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/apps/web/app/admin/produits/page.tsx",
                                lineNumber: 137,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                className: "flex items-center space-x-2 px-5 py-2.5 bg-rouge-deep text-creme rounded-sm text-sm font-bold uppercase tracking-widest hover:bg-rouge-mid transition-all shadow-md",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__["Plus"], {
                                        size: 16
                                    }, void 0, false, {
                                        fileName: "[project]/apps/web/app/admin/produits/page.tsx",
                                        lineNumber: 141,
                                        columnNumber: 25
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        children: "Nouveau"
                                    }, void 0, false, {
                                        fileName: "[project]/apps/web/app/admin/produits/page.tsx",
                                        lineNumber: 142,
                                        columnNumber: 25
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/apps/web/app/admin/produits/page.tsx",
                                lineNumber: 140,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                href: "/",
                                className: "px-5 py-2.5 border border-encre text-encre rounded-sm text-sm font-bold hover:bg-encre hover:text-creme transition-all",
                                children: "Voir la boutique"
                            }, void 0, false, {
                                fileName: "[project]/apps/web/app/admin/produits/page.tsx",
                                lineNumber: 144,
                                columnNumber: 21
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/apps/web/app/admin/produits/page.tsx",
                        lineNumber: 125,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/apps/web/app/admin/produits/page.tsx",
                lineNumber: 119,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex flex-wrap items-center justify-between gap-6",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center bg-white p-1 rounded-sm border border-creme2",
                        children: tabs.map((tab)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>setActiveTab(tab.key),
                                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$lib$2f$utils$2f$cn$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("px-6 py-2 text-[10px] font-black uppercase tracking-widest rounded-sm transition-all", activeTab === tab.key ? "bg-[#1A0A0A] text-creme shadow-lg scale-105" : "text-encre3 hover:bg-creme/50"),
                                children: tab.name
                            }, tab.key, false, {
                                fileName: "[project]/apps/web/app/admin/produits/page.tsx",
                                lineNumber: 154,
                                columnNumber: 25
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/apps/web/app/admin/produits/page.tsx",
                        lineNumber: 152,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center space-x-3",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                className: "flex items-center space-x-2 px-6 py-2 bg-creme border border-creme2 text-encre text-xs font-bold uppercase tracking-widest rounded-sm hover:border-or transition-all",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    children: "Exporter"
                                }, void 0, false, {
                                    fileName: "[project]/apps/web/app/admin/produits/page.tsx",
                                    lineNumber: 171,
                                    columnNumber: 25
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/apps/web/app/admin/produits/page.tsx",
                                lineNumber: 170,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                className: "flex items-center space-x-2 px-6 py-2 bg-[#1A0A0A] text-creme text-xs font-bold uppercase tracking-widest rounded-sm hover:bg-rouge-deep transition-all shadow-lg group",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__["Plus"], {
                                        size: 14,
                                        className: "text-or"
                                    }, void 0, false, {
                                        fileName: "[project]/apps/web/app/admin/produits/page.tsx",
                                        lineNumber: 174,
                                        columnNumber: 25
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        children: "Nouveau produit"
                                    }, void 0, false, {
                                        fileName: "[project]/apps/web/app/admin/produits/page.tsx",
                                        lineNumber: 175,
                                        columnNumber: 25
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/apps/web/app/admin/produits/page.tsx",
                                lineNumber: 173,
                                columnNumber: 21
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/apps/web/app/admin/produits/page.tsx",
                        lineNumber: 169,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/apps/web/app/admin/produits/page.tsx",
                lineNumber: 151,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8",
                children: mockProducts.map((product)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "bg-white rounded-sm border border-creme2 shadow-lg overflow-hidden group hover:border-or transition-all duration-500",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "relative aspect-[4/3] p-12 bg-creme/20 flex items-center justify-center overflow-hidden",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$lib$2f$utils$2f$cn$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("w-full h-full rounded-md shadow-2xl transition-transform duration-700 group-hover:scale-110", product.color)
                                    }, void 0, false, {
                                        fileName: "[project]/apps/web/app/admin/produits/page.tsx",
                                        lineNumber: 186,
                                        columnNumber: 29
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "absolute top-4 right-4 flex flex-col items-end space-y-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "bg-white/90 backdrop-blur-sm text-encre px-2 py-1 rounded-sm text-[10px] font-black uppercase border border-creme2 shadow-sm",
                                                children: product.stock
                                            }, void 0, false, {
                                                fileName: "[project]/apps/web/app/admin/produits/page.tsx",
                                                lineNumber: 190,
                                                columnNumber: 33
                                            }, this),
                                            product.badge === 'low' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "bg-or text-encre px-2 py-1 rounded-sm text-[8px] font-black uppercase shadow-sm",
                                                children: "Stock faible"
                                            }, void 0, false, {
                                                fileName: "[project]/apps/web/app/admin/produits/page.tsx",
                                                lineNumber: 194,
                                                columnNumber: 37
                                            }, this),
                                            product.badge === 'out' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "bg-rouge text-creme px-2 py-1 rounded-sm text-[8px] font-black uppercase shadow-sm",
                                                children: "Épuisé"
                                            }, void 0, false, {
                                                fileName: "[project]/apps/web/app/admin/produits/page.tsx",
                                                lineNumber: 199,
                                                columnNumber: 37
                                            }, this),
                                            product.badge === 'promo' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "bg-green-600 text-white px-2 py-1 rounded-sm text-[8px] font-black uppercase shadow-sm",
                                                children: "120 u."
                                            }, void 0, false, {
                                                fileName: "[project]/apps/web/app/admin/produits/page.tsx",
                                                lineNumber: 204,
                                                columnNumber: 37
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/apps/web/app/admin/produits/page.tsx",
                                        lineNumber: 189,
                                        columnNumber: 29
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/apps/web/app/admin/produits/page.tsx",
                                lineNumber: 185,
                                columnNumber: 25
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "p-6 border-t border-creme2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex justify-between items-start mb-4",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-[10px] uppercase font-bold text-or tracking-[0.2em] mb-1",
                                                    children: product.category
                                                }, void 0, false, {
                                                    fileName: "[project]/apps/web/app/admin/produits/page.tsx",
                                                    lineNumber: 215,
                                                    columnNumber: 37
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                    className: "font-serif text-lg text-encre group-hover:text-rouge-deep transition-colors",
                                                    children: product.name
                                                }, void 0, false, {
                                                    fileName: "[project]/apps/web/app/admin/produits/page.tsx",
                                                    lineNumber: 216,
                                                    columnNumber: 37
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/apps/web/app/admin/produits/page.tsx",
                                            lineNumber: 214,
                                            columnNumber: 33
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/apps/web/app/admin/produits/page.tsx",
                                        lineNumber: 213,
                                        columnNumber: 29
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center justify-between mt-6",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-lg font-black text-encre",
                                                children: product.price
                                            }, void 0, false, {
                                                fileName: "[project]/apps/web/app/admin/produits/page.tsx",
                                                lineNumber: 221,
                                                columnNumber: 33
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex space-x-2",
                                                children: product.badge === 'low' ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    className: "bg-or text-encre px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-sm hover:bg-encre hover:text-creme transition-all",
                                                    children: "Commander"
                                                }, void 0, false, {
                                                    fileName: "[project]/apps/web/app/admin/produits/page.tsx",
                                                    lineNumber: 224,
                                                    columnNumber: 41
                                                }, this) : product.badge === 'out' ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    className: "bg-rouge text-creme px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-sm hover:bg-rouge-deep transition-all",
                                                    children: "Urgent"
                                                }, void 0, false, {
                                                    fileName: "[project]/apps/web/app/admin/produits/page.tsx",
                                                    lineNumber: 228,
                                                    columnNumber: 41
                                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    className: "bg-[#1A0A0A] text-creme px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-sm hover:bg-rouge-deep transition-all shadow-md",
                                                    children: "Éditer"
                                                }, void 0, false, {
                                                    fileName: "[project]/apps/web/app/admin/produits/page.tsx",
                                                    lineNumber: 232,
                                                    columnNumber: 41
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/apps/web/app/admin/produits/page.tsx",
                                                lineNumber: 222,
                                                columnNumber: 33
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/apps/web/app/admin/produits/page.tsx",
                                        lineNumber: 220,
                                        columnNumber: 29
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/apps/web/app/admin/produits/page.tsx",
                                lineNumber: 212,
                                columnNumber: 25
                            }, this)
                        ]
                    }, product.id, true, {
                        fileName: "[project]/apps/web/app/admin/produits/page.tsx",
                        lineNumber: 183,
                        columnNumber: 21
                    }, this))
            }, void 0, false, {
                fileName: "[project]/apps/web/app/admin/produits/page.tsx",
                lineNumber: 181,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "grid grid-cols-1 md:grid-cols-2 gap-8 opacity-40",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "border border-dashed border-creme2 rounded-sm p-12 flex flex-col items-center justify-center text-encre3 space-y-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shopping$2d$bag$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ShoppingBag$3e$__["ShoppingBag"], {
                                size: 48,
                                strokeWidth: 1
                            }, void 0, false, {
                                fileName: "[project]/apps/web/app/admin/produits/page.tsx",
                                lineNumber: 246,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "font-serif text-lg",
                                children: "Ajouter une nouvelle variante"
                            }, void 0, false, {
                                fileName: "[project]/apps/web/app/admin/produits/page.tsx",
                                lineNumber: 247,
                                columnNumber: 21
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/apps/web/app/admin/produits/page.tsx",
                        lineNumber: 245,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "border border-dashed border-creme2 rounded-sm p-12 flex flex-col items-center justify-center text-encre3 space-y-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$alert$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertCircle$3e$__["AlertCircle"], {
                                size: 48,
                                strokeWidth: 1
                            }, void 0, false, {
                                fileName: "[project]/apps/web/app/admin/produits/page.tsx",
                                lineNumber: 250,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "font-serif text-lg",
                                children: "Gérer les alertes globales"
                            }, void 0, false, {
                                fileName: "[project]/apps/web/app/admin/produits/page.tsx",
                                lineNumber: 251,
                                columnNumber: 21
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/apps/web/app/admin/produits/page.tsx",
                        lineNumber: 249,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/apps/web/app/admin/produits/page.tsx",
                lineNumber: 244,
                columnNumber: 13
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/apps/web/app/admin/produits/page.tsx",
        lineNumber: 117,
        columnNumber: 9
    }, this);
}
_s(AdminProductsPage, "XanZvtF7fuNK/L5xJXjm2DhCOZc=");
_c = AdminProductsPage;
var _c;
__turbopack_context__.k.register(_c, "AdminProductsPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/node_modules/lucide-react/dist/esm/icons/plus.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Plus
]);
/**
 * lucide-react v0.292.0 - ISC
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/createLucideIcon.js [app-client] (ecmascript)");
;
const Plus = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])("Plus", [
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
"[project]/node_modules/lucide-react/dist/esm/icons/plus.js [app-client] (ecmascript) <export default as Plus>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Plus",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/plus.js [app-client] (ecmascript)");
}),
"[project]/node_modules/lucide-react/dist/esm/icons/download.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Download
]);
/**
 * lucide-react v0.292.0 - ISC
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/createLucideIcon.js [app-client] (ecmascript)");
;
const Download = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])("Download", [
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
"[project]/node_modules/lucide-react/dist/esm/icons/download.js [app-client] (ecmascript) <export default as Download>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Download",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$download$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$download$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/download.js [app-client] (ecmascript)");
}),
"[project]/node_modules/lucide-react/dist/esm/icons/shopping-bag.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ShoppingBag
]);
/**
 * lucide-react v0.292.0 - ISC
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/createLucideIcon.js [app-client] (ecmascript)");
;
const ShoppingBag = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])("ShoppingBag", [
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
"[project]/node_modules/lucide-react/dist/esm/icons/shopping-bag.js [app-client] (ecmascript) <export default as ShoppingBag>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ShoppingBag",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shopping$2d$bag$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shopping$2d$bag$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/shopping-bag.js [app-client] (ecmascript)");
}),
"[project]/node_modules/lucide-react/dist/esm/icons/alert-circle.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>AlertCircle
]);
/**
 * lucide-react v0.292.0 - ISC
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/createLucideIcon.js [app-client] (ecmascript)");
;
const AlertCircle = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])("AlertCircle", [
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
"[project]/node_modules/lucide-react/dist/esm/icons/alert-circle.js [app-client] (ecmascript) <export default as AlertCircle>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AlertCircle",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$alert$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$alert$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/alert-circle.js [app-client] (ecmascript)");
}),
]);

//# sourceMappingURL=_a40d1ce9._.js.map