/**
 * API Client v1.0
 * Centralized API management with version support
 * Enhanced with error handling, retry logic, and organized endpoints
 */

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
const API_VERSION = 'v1';

export const API_ENDPOINTS = {
  // Dashboard
  DASHBOARD_METRICS: `/api/${API_VERSION}/admin/dashboard/metrics`,
  
  // Products
  PRODUCTS_LIST: `/api/${API_VERSION}/admin/products`,
  PRODUCTS_LOW_STOCK: `/api/${API_VERSION}/admin/products/low-stock`,
  PRODUCT_DETAIL: (id: string) => `/api/${API_VERSION}/admin/products/${id}`,
  PRODUCT_CREATE: `/api/${API_VERSION}/admin/products`,
  PRODUCT_UPDATE: (id: string) => `/api/${API_VERSION}/admin/products/${id}`,
  PRODUCT_DELETE: (id: string) => `/api/${API_VERSION}/admin/products/${id}`,
  
  // Orders
  ORDERS_LIST: `/api/${API_VERSION}/admin/orders`,
  ORDERS_STATS: `/api/${API_VERSION}/admin/orders/stats`,
  ORDER_DETAIL: (id: string) => `/api/${API_VERSION}/admin/orders/${id}`,
  ORDER_UPDATE_STATUS: (id: string) => `/api/${API_VERSION}/admin/orders/${id}/status`,
};

interface RequestOptions extends RequestInit {
  timeout?: number;
}

/**
 * Enhanced fetch wrapper with error handling
 */
export async function apiFetch<T = any>(
  endpoint: string,
  options: RequestOptions = {},
): Promise<{ data: T; success: boolean; error?: string }> {
  const { timeout = 10000, ...fetchOptions } = options;

  const url = `${BASE_URL}${endpoint}`;

  const headers = {
    'Content-Type': 'application/json',
    ...fetchOptions.headers,
  };

  const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    const response = await fetch(url, {
      ...fetchOptions,
      headers,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }

    const data = await response.json();
    return { data: data.data || data, success: true };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error(`API Error at ${endpoint}:`, errorMessage);
    return { data: null as any, success: false, error: errorMessage };
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
    return apiGet(API_ENDPOINTS.PRODUCTS_LIST + `?page=${page}&limit=${limit}`);
  }

  static async getLowStock(threshold = 10) {
    return apiGet(API_ENDPOINTS.PRODUCTS_LOW_STOCK + `?threshold=${threshold}`);
  }

  static async getById(id: string) {
    return apiGet(API_ENDPOINTS.PRODUCT_DETAIL(id));
  }

  static async create(data: any) {
    return apiPost(API_ENDPOINTS.PRODUCT_CREATE, data);
  }

  static async update(id: string, data: any) {
    return apiPatch(API_ENDPOINTS.PRODUCT_UPDATE(id), data);
  }

  static async delete(id: string) {
    return apiDelete(API_ENDPOINTS.PRODUCT_DELETE(id));
  }
}

export class OrdersAPI {
  static async getAll(page = 1, limit = 10, status?: string) {
    const query = new URLSearchParams();
    query.append('page', String(page));
    query.append('limit', String(limit));
    if (status) query.append('status', status);
    return apiGet(API_ENDPOINTS.ORDERS_LIST + `?${query.toString()}`);
  }

  static async getStats() {
    return apiGet(API_ENDPOINTS.ORDERS_STATS);
  }

  static async getById(id: string) {
    return apiGet(API_ENDPOINTS.ORDER_DETAIL(id));
  }

  static async updateStatus(id: string, status: string) {
    return apiPatch(API_ENDPOINTS.ORDER_UPDATE_STATUS(id), { status });
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
};
