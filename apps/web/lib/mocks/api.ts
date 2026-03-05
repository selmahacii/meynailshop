// Mock API data for development while backend compiles
export const mockDashboardMetrics = {
  success: true,
  data: {
    kpis: {
      totalRevenue: 45280,
      totalOrders: 324,
      activeClients: 156,
      averageCart: 139.75,
      completedOrders: 298,
    },
    charts: {
      monthlyRevenue: [
        { name: 'Sep', revenue: 6200 },
        { name: 'Oct', revenue: 7450 },
        { name: 'Nov', revenue: 8230 },
        { name: 'Dec', revenue: 9100 },
        { name: 'Jan', revenue: 7800 },
        { name: 'Feb', revenue: 6500 },
      ],
      productSales: [
        { name: 'Pink Nail Polish', sales: 45 },
        { name: 'Gel Extensions', sales: 38 },
        { name: 'Acrylic Nails', sales: 32 },
        { name: 'Nail Art Kit', sales: 28 },
        { name: 'UV Lamp', sales: 22 },
      ],
      orderStatusBreakdown: { pending: 12, delivered: 298, cancelled: 14 },
      customerGrowth: [
        { name: 'Sep', count: 45 },
        { name: 'Oct', count: 67 },
        { name: 'Nov', count: 89 },
        { name: 'Dec', count: 112 },
        { name: 'Jan', count: 134 },
        { name: 'Feb', count: 156 },
      ],
    },
    alerts: {
      lowStockProducts: [
        { id: '1', name: 'Pink Nail Polish', stock: 5, stockAlert: 10 },
        { id: '2', name: 'UV Lamp', stock: 2, stockAlert: 5 },
      ],
    },
  },
};

export const mockOrdersStats = {
  success: true,
  data: {
    pending: 12,
    delivered: 298,
    cancelled: 14,
    totalRevenue: 45280,
  },
};

export const mockProductsLowStock = {
  success: true,
  data: [
    { id: '1', name: 'Pink Nail Polish', stock: 5, stockAlert: 10, price: 12.99 },
    { id: '2', name: 'UV Lamp', stock: 2, stockAlert: 5, price: 49.99 },
    { id: '3', name: 'Gel Base Coat', stock: 3, stockAlert: 8, price: 15.99 },
  ],
};

export const mockProducts = {
  success: true,
  data: {
    items: [
      {
        id: '1',
        name: 'Pink Nail Polish',
        price: 12.99,
        stock: 45,
        category: 'Polish',
        image: '/products/pink-polish.jpg',
      },
      {
        id: '2',
        name: 'Gel Extensions',
        price: 24.99,
        stock: 32,
        category: 'Extensions',
        image: '/products/gel-extensions.jpg',
      },
      {
        id: '3',
        name: 'UV Lamp',
        price: 49.99,
        stock: 2,
        category: 'Equipment',
        image: '/products/uv-lamp.jpg',
      },
    ],
    total: 156,
    page: 1,
    limit: 10,
  },
};

export const mockOrders = {
  success: true,
  data: {
    items: [
      {
        id: 'ORD-001',
        status: 'delivered',
        total: 89.97,
        createdAt: new Date().toISOString(),
        customer: 'Sarah Johnson',
      },
      {
        id: 'ORD-002',
        status: 'pending',
        total: 149.98,
        createdAt: new Date().toISOString(),
        customer: 'Emma Smith',
      },
      {
        id: 'ORD-003',
        status: 'delivered',
        total: 75.98,
        createdAt: new Date().toISOString(),
        customer: 'Olivia Brown',
      },
    ],
    total: 324,
    page: 1,
    limit: 10,
  },
};

export const mockReviews = {
  success: true,
  data: {
    items: [
      {
        id: '1',
        rating: 5,
        text: 'Amazing quality! My nails looked perfect for 3 weeks.',
        customer: 'Jennifer Lee',
        createdAt: new Date().toISOString(),
        status: 'approved',
      },
      {
        id: '2',
        rating: 4,
        text: 'Good product, delivery was quick',
        customer: 'Michelle Davis',
        createdAt: new Date().toISOString(),
        status: 'approved',
      },
      {
        id: '3',
        rating: 3,
        text: 'Okay, but expected better formula',
        customer: 'Ashley Wilson',
        createdAt: new Date().toISOString(),
        status: 'pending',
      },
    ],
    total: 245,
    page: 1,
    limit: 10,
  },
};

export const mockClients = {
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
        joinedAt: '2025-10-15',
      },
      {
        id: '2',
        name: 'Emma Smith',
        email: 'emma@mail.com',
        phone: '+1-555-0102',
        totalOrders: 5,
        totalSpent: 389.75,
        status: 'active',
        joinedAt: '2025-11-20',
      },
      {
        id: '3',
        name: 'Olivia Brown',
        email: 'olivia@mail.com',
        phone: '+1-555-0103',
        totalOrders: 12,
        totalSpent: 856.3,
        status: 'active',
        joinedAt: '2025-09-05',
      },
    ],
    total: 156,
    page: 1,
    limit: 10,
  },
};

export const mockStock = {
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
          { date: '2026-02-28', quantity: 20, type: 'in' },
          { date: '2026-02-25', quantity: -5, type: 'out' },
        ],
      },
      {
        id: '2',
        productName: 'UV Lamp',
        currentStock: 2,
        minimumStock: 5,
        lastRestocked: '2026-02-15',
        movement: [
          { date: '2026-02-15', quantity: 10, type: 'in' },
          { date: '2026-02-20', quantity: -8, type: 'out' },
        ],
      },
    ],
  },
};
