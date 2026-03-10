export interface AdminProduct {
  id: string;
  name: string;
  category: string;
  sku: string;
  stock: number;
  alertThreshold: number;
  price: number;
  status: 'in_stock' | 'low_stock' | 'out_of_stock';
  createdAt: string;
  updatedAt: string;
}

export interface AdminClient {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  location: string;
  ordersCount: number;
  totalSpent: number;
  lastOrderDate: string;
  status: 'vip' | 'regular' | 'new';
  createdAt: string;
  updatedAt: string;
}

export interface AdminStats {
  totalProducts: number;
  lowStockProducts: number;
  totalClients: number;
  vipClients: number;
  totalRevenue: number;
  averageOrdersPerClient: number;
}