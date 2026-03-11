/**
 * API Client v1.0
 * Centralized API management with version support
 * Uses real backend API endpoints only
 */

// Normalise BASE_URL pour éviter les doublons de /api
const RAW_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
const BASE_URL = RAW_BASE_URL.endsWith('/api')
  ? RAW_BASE_URL.replace(/\/api\/?$/, '')
  : RAW_BASE_URL;
const API_VERSION = 'v1';

export const API_ENDPOINTS = {
  // Admin (versioned)
  DASHBOARD_METRICS: `/api/${API_VERSION}/admin/dashboard/metrics`,

  // Admin products
  PRODUCTS_ADMIN_LIST: `/api/${API_VERSION}/admin/products`,
  PRODUCTS_LOW_STOCK: `/api/${API_VERSION}/admin/products/low-stock`,
  PRODUCT_ADMIN_DETAIL: (id: string) => `/api/${API_VERSION}/admin/products/${id}`,
  PRODUCT_ADMIN_CREATE: `/api/${API_VERSION}/admin/products`,
  PRODUCT_ADMIN_UPDATE: (id: string) => `/api/${API_VERSION}/admin/products/${id}`,
  PRODUCT_ADMIN_DELETE: (id: string) => `/api/${API_VERSION}/admin/products/${id}`,

  // Admin orders
  ORDERS_ADMIN_LIST: `/api/${API_VERSION}/admin/orders`,
  ORDERS_STATS: `/api/${API_VERSION}/admin/orders/stats`,
  ORDER_ADMIN_DETAIL: (id: string) => `/api/${API_VERSION}/admin/orders/${id}`,
  ORDER_ADMIN_UPDATE_STATUS: (id: string) => `/api/${API_VERSION}/admin/orders/${id}/status`,

  // Public store endpoints (no version prefix)
  STORE_PRODUCTS_LIST: `/api/products`,
  STORE_PRODUCT_DETAIL: (slug: string) => `/api/products/${slug}`,
  STORE_FEATURED: `/api/products/featured`,
  STORE_CATEGORIES: `/api/categories`,

  // Cart / checkout (public)
  CART: `/api/cart`,
  CART_ADD_ITEM: `/api/cart/items`,

  // Auth (public)
  AUTH_LOGIN: `/api/auth/login`,
  AUTH_REGISTER: `/api/auth/register`,
  AUTH_ME: `/api/auth/me`,
};

interface RequestOptions extends RequestInit {
  timeout?: number;
}


export async function apiFetch<T = any>(
  endpoint: string,
  options: RequestOptions = {},
): Promise<{ data: T; success: boolean; error?: string }> {
  const { timeout = 10000, ...fetchOptions } = options;

  const url = `${BASE_URL}${endpoint}`;

  console.log(`🔄 API Request: ${fetchOptions.method || 'GET'} ${url}`);

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...fetchOptions.headers as Record<string, string>,
  };

  const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      console.warn(`⏰ API Request timeout: ${url}`);
      controller.abort();
    }, timeout);

    const response = await fetch(url, {
      ...fetchOptions,
      headers,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    console.log(`📡 API Response: ${response.status} ${response.statusText} for ${url}`);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
      console.error(`❌ API Error: ${response.status} ${response.statusText}`, {
        url,
        status: response.status,
        error: errorData
      });
      return {
        data: null as T,
        success: false,
        error: errorData.message || `HTTP ${response.status}: ${response.statusText}`
      };
    }

    const data = await response.json();
    console.log(`✅ API Success: ${url}`, { dataKeys: Object.keys(data) });

    return { data: data.data || data, success: true };
  } catch (error) {
    console.error(`💥 API Network Error: ${url}`, error);
    return {
      data: null as T,
      success: false,
      error: error instanceof Error ? error.message : 'Network error'
    };
  }
}

export function apiGet<T = any>(endpoint: string, options?: RequestOptions) {
  return apiFetch<T>(endpoint, { ...options, method: 'GET' });
}

export function apiPost<T = any>(endpoint: string, body?: any, options?: RequestOptions) {
  return apiFetch<T>(endpoint, {
    ...options,
    method: 'POST',
    body: body ? JSON.stringify(body) : undefined,
  });
}

export function apiPatch<T = any>(endpoint: string, body?: any, options?: RequestOptions) {
  return apiFetch<T>(endpoint, {
    ...options,
    method: 'PATCH',
    body: body ? JSON.stringify(body) : undefined,
  });
}

export function apiDelete<T = any>(endpoint: string, options?: RequestOptions) {
  return apiFetch<T>(endpoint, { ...options, method: 'DELETE' });
}

// Service classes
export class DashboardAPI {
  static async getMetrics() {
    return apiGet(API_ENDPOINTS.DASHBOARD_METRICS);
  }
}

export class ProductsAPI {
  static async getAll(page = 1, limit = 10) {
    return apiGet(API_ENDPOINTS.PRODUCTS_ADMIN_LIST + `?page=${page}&limit=${limit}`);
  }

  static async getLowStock(threshold = 10) {
    return apiGet(API_ENDPOINTS.PRODUCTS_LOW_STOCK + `?threshold=${threshold}`);
  }

  static async getById(id: string) {
    return apiGet(API_ENDPOINTS.PRODUCT_ADMIN_DETAIL(id));
  }

  static async create(data: any) {
    return apiPost(API_ENDPOINTS.PRODUCT_ADMIN_CREATE, data);
  }

  static async update(id: string, data: any) {
    return apiPatch(API_ENDPOINTS.PRODUCT_ADMIN_UPDATE(id), data);
  }

  static async delete(id: string) {
    return apiDelete(API_ENDPOINTS.PRODUCT_ADMIN_DELETE(id));
  }
}

export class OrdersAPI {
  static async getAll(page = 1, limit = 10, status?: string) {
    const query = new URLSearchParams();
    query.append('page', String(page));
    query.append('limit', String(limit));
    if (status) query.append('status', status);
    return apiGet(API_ENDPOINTS.ORDERS_ADMIN_LIST + `?${query.toString()}`);
  }

  static async getStats() {
    return apiGet(API_ENDPOINTS.ORDERS_STATS);
  }

  static async getById(id: string) {
    return apiGet(API_ENDPOINTS.ORDER_ADMIN_DETAIL(id));
  }

  static async updateStatus(id: string, status: string) {
    return apiPatch(API_ENDPOINTS.ORDER_ADMIN_UPDATE_STATUS(id), { status });
  }
}

// Public store APIs
export class StoreAPI {
  static async getProducts(page = 1, limit = 12, params: Record<string, any> = {}) {
    const query = new URLSearchParams({ page: String(page), limit: String(limit), ...params });
    return apiGet(API_ENDPOINTS.STORE_PRODUCTS_LIST + `?${query.toString()}`);
  }

  static async getProductBySlug(slug: string) {
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

  static async addCartItem(item: any) {
    return apiPost(API_ENDPOINTS.CART_ADD_ITEM, item);
  }
  
  static async getMyOrders(page = 1, limit = 10) {
    return apiGet(`/api/orders/my?page=${page}&limit=${limit}`);
  }
}

export class AuthAPI {
  static async login(email: string, password: string) {
    return apiPost(API_ENDPOINTS.AUTH_LOGIN, { email, password });
  }

  static async register(data: any) {
    return apiPost(API_ENDPOINTS.AUTH_REGISTER, data);
  }

  static async me() {
    return apiGet(API_ENDPOINTS.AUTH_ME);
  }
}

export class ReviewsAPI {
  static async getAll(page = 1, limit = 10, status?: string) {
    const query = new URLSearchParams();
    query.append('page', String(page));
    query.append('limit', String(limit));
    if (status) query.append('status', status);
    return apiGet(`/api/reviews?${query.toString()}`);
  }

  static async moderate(id: string, status: 'approved' | 'rejected') {
    return apiPatch(`/api/reviews/${id}/moderate`, { status });
  }
}

export class ActivityLogAPI {
  static async getAll(limit = 20) {
    // This could be a dedicated endpoint or we derive it from orders/users
    // For now we'll keep the derivation in the frontend as implemented
    return { success: true, data: [] }; 
  }
}

export class ClientsAPI {
  static async getAll(page = 1, limit = 10) {
    const query = new URLSearchParams();
    query.append('page', String(page));
    query.append('limit', String(limit));
    query.append('role', 'client');
    return apiGet(`/api/users?${query.toString()}`);
  }

  static async getById(id: string) {
    return apiGet(`/api/users/${id}`);
  }
}

export class StockAPI {
  static async getAll(page = 1) {
    return apiGet(`/api/${API_VERSION}/admin/stock?page=${page}`);
  }

  static async recordMovement(productId: string, quantity: number, type: 'in' | 'out') {
    return apiPost(`/api/${API_VERSION}/admin/stock/movement`, {
      productId,
      quantity,
      type,
    });
  }
}

export default {
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
  StockAPI,
};
