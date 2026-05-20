/**
 * API Client v1.0
 * Centralized API management with version support
 * Uses real backend API endpoints only
 */

// Logic for BASE_URL: Use relative path on client (for Next.js proxy)
// and absolute path on server (SSR needs full URL).
const isServer = typeof window === 'undefined';
const isProduction = process.env.NODE_ENV === 'production' || process.env.VERCEL === '1';
const defaultBackend = isProduction ? 'https://meeynailshop-api.onrender.com' : 'http://127.0.0.1:3001';
const BASE_URL = (isServer ? (process.env.NEXT_PUBLIC_API_URL || defaultBackend) : '')
  .replace(/\/api\/?$/, '') // Remove trailing /api or / if present
  .replace(/\/$/, '');      // Remove trailing slash if present
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
  ORDERS_ADMIN_CREATE_MANUAL: `/api/${API_VERSION}/admin/orders/manual`,

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
  const { timeout = 60000, ...fetchOptions } = options;

  const url = `${BASE_URL}${endpoint}`;



  const isFormData = fetchOptions.body instanceof FormData;
  const headers: Record<string, string> = {
    ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
    ...fetchOptions.headers as Record<string, string>,
  };

  const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {

      controller.abort();
    }, timeout);

    const response = await fetch(url, {
      ...fetchOptions,
      headers,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);



    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
      
      // Auto-clear token and redirect on 401 (Unauthorized)
      if (response.status === 401 && typeof window !== 'undefined') {

        localStorage.removeItem('accessToken');
        document.cookie = "accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        
        // Avoid redirect loop if already on login page
        if (!window.location.pathname.includes('/connexion')) {
          window.location.href = `/connexion?redirect=${encodeURIComponent(window.location.pathname)}`;
        }
      }


      return {
        data: null as T,
        success: false,
        error: errorData.message || `HTTP ${response.status}: ${response.statusText}`
      };
    }

    const data = await response.json();


    return { data: data.data || data, success: true };
  } catch (error) {

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
  static async getMetrics(range?: string) {
    const query = range ? `?range=${range}` : '';
    return apiGet(API_ENDPOINTS.DASHBOARD_METRICS + query);
  }
}

export class ProductsAPI {
  static async getAll(page = 1, limit = 10, search?: string) {
    const query = new URLSearchParams();
    query.append('page', String(page));
    query.append('limit', String(limit));
    if (search) query.append('search', search);
    return apiGet(API_ENDPOINTS.PRODUCTS_ADMIN_LIST + `?${query.toString()}`);
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

  static async createManual(data: any) {
    return apiPost(API_ENDPOINTS.ORDERS_ADMIN_CREATE_MANUAL, data);
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

  static async getCategoryBySlug(slug: string) {
    return apiGet(`/api/categories/${slug}`);
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
    return apiGet(`/api/orders?page=${page}&limit=${limit}`);
  }

  static async getOrder(id: string) {
    return apiGet(`/api/orders/${id}`);
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

  static async updateProfile(data: any) {
    return apiPatch(API_ENDPOINTS.AUTH_ME, data);
  }
}

export class ReviewsAPI {
  static async getAll(page = 1, limit = 10, status?: string) {
    const query = new URLSearchParams({ page: String(page), limit: String(limit) });
    if (status) query.append('status', status);
    return apiGet(`/api/reviews?${query.toString()}`);
  }

  static async getByProduct(productId: string, page = 1, limit = 10) {
    return apiGet(`/api/reviews/product/${productId}?page=${page}&limit=${limit}`);
  }

  static async create(data: { productId: string; rating: number; title: string; content: string; orderId?: string }) {
    return apiPost('/api/reviews', data);
  }

  static async getProductRating(productId: string) {
    return apiGet(`/api/reviews/product/${productId}/rating`);
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

export class SettingsAPI {
  static async get() {
    return apiGet('/api/settings');
  }

  static async update(data: any) {
    return apiPatch('/api/settings', data);
  }

  static async reset() {
    return apiPost('/api/settings/reset');
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

export class UploadAPI {
  static async uploadProductImage(file: File) {
    const formData = new FormData();
    formData.append('image', file);
    return apiFetch('/api/upload/product-image', {
      method: 'POST',
      body: formData,
    });
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
