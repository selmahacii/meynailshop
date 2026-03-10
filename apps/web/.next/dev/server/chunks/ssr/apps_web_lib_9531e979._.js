module.exports = [
"[project]/apps/web/lib/mocks/api.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
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
}),
"[project]/apps/web/lib/api/client.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
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
/**
 * API Client v1.0
 * Centralized API management with version support
 * Enhanced with error handling and mock fallbacks
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$lib$2f$mocks$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/lib/mocks/api.ts [app-ssr] (ecmascript)");
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
    if (endpoint.includes('/dashboard/metrics')) return __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$lib$2f$mocks$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["mockDashboardMetrics"];
    if (endpoint.includes('/orders/stats')) return __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$lib$2f$mocks$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["mockOrdersStats"];
    if (endpoint.includes('/products/low-stock')) return __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$lib$2f$mocks$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["mockProductsLowStock"];
    if (endpoint.includes('/products')) return __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$lib$2f$mocks$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["mockProducts"];
    if (endpoint.includes('/orders')) return __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$lib$2f$mocks$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["mockOrders"];
    if (endpoint.includes('/reviews')) return __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$lib$2f$mocks$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["mockReviews"];
    if (endpoint.includes('/clients')) return __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$lib$2f$mocks$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["mockClients"];
    if (endpoint.includes('/stock')) return __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$lib$2f$mocks$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["mockStock"];
    return {
        success: false,
        data: null
    };
}
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
"[project]/apps/web/lib/api/products.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "productsApi",
    ()=>productsApi
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/lib/api/client.ts [app-ssr] (ecmascript)");
;
const productsApi = {
    getAll: (params)=>{
        const query = params ? `?${new URLSearchParams(params).toString()}` : '';
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["apiGet"])(`/products${query}`);
    },
    getBySlug: (slug)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["apiGet"])(`/products/${slug}`),
    getFeatured: ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["apiGet"])('/products/featured'),
    getCategories: ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["apiGet"])('/categories')
};
}),
];

//# sourceMappingURL=apps_web_lib_9531e979._.js.map