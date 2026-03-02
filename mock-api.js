const express = require('express');
const cors = require('cors');
const app = express();

app.use(express.json());
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));

// Mock database
const mockData = {
  users: [
    {
      id: '1',
      email: 'admin@meey.dz',
      firstName: 'Admin',
      lastName: 'MEEY',
      phone: '+213612345678',
      role: 'admin',
    },
    {
      id: '2',
      email: 'client@meey.dz',
      firstName: 'Selma',
      lastName: 'Ahmed',
      phone: '+213612345679',
      role: 'client',
    },
  ],
  categories: [
    { id: '1', name: 'Vernis Gel', slug: 'vernis-gel', productCount: 12 },
    { id: '2', name: 'Gel UV', slug: 'gel-uv', productCount: 8 },
    { id: '3', name: 'Décoration', slug: 'decoration', productCount: 15 },
    { id: '4', name: 'Matériel', slug: 'materiel', productCount: 10 },
  ],
  products: [
    {
      id: '1',
      name: 'Vernis Gel Burgundy Premium',
      slug: 'vernis-gel-burgundy-premium',
      price: 1500,
      costPrice: 800,
      description: 'Vernis gel haute qualité couleur bordeaux',
      images: ['https://via.placeholder.com/600x600?text=Product1'],
      badge: 'new',
      stock: 25,
      inStock: true,
      categoryId: '1',
    },
    {
      id: '2',
      name: 'Gel UV Clear',
      slug: 'gel-uv-clear',
      price: 2000,
      description: 'Gel UV transparent professionnel',
      images: ['https://via.placeholder.com/600x600?text=Product2'],
      badge: 'bestseller',
      stock: 18,
      inStock: true,
      categoryId: '2',
    },
  ],
  orders: [
    {
      id: '1',
      orderNumber: 'ORD-2026-001',
      userId: '2',
      status: 'pending',
      paymentStatus: 'pending',
      paymentMethod: 'cash_on_delivery',
      subtotal: 3500,
      shipping: 300,
      discount: 0,
      total: 3800,
      createdAt: new Date().toISOString(),
      items: [
        { productId: '1', quantity: 2, productName: 'Vernis Gel Burgundy Premium', unitPrice: 1500 },
      ],
    },
  ],
};

// Auth endpoints
app.post('/api/auth/register', (req, res) => {
  const { email, password, firstName, lastName } = req.body;
  const user = {
    id: '3',
    email,
    firstName,
    lastName,
    phone: '+213600000000',
    role: 'client',
  };
  res.json({
    statusCode: 201,
    message: 'User registered successfully',
    data: {
      user,
      accessToken: 'mock-jwt-token-' + Date.now(),
      refreshToken: 'mock-refresh-token-' + Date.now(),
    },
  });
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  const user = mockData.users.find((u) => u.email === email);
  if (!user) {
    return res.status(401).json({ statusCode: 401, message: 'Invalid credentials' });
  }
  res.json({
    statusCode: 200,
    message: 'Login successful',
    data: {
      user,
      accessToken: 'mock-jwt-token-' + Date.now(),
      refreshToken: 'mock-refresh-token-' + Date.now(),
    },
  });
});

app.get('/api/auth/me', (req, res) => {
  res.json({
    statusCode: 200,
    message: 'Current user',
    data: mockData.users[1],
  });
});

// Products endpoints
app.get('/api/products', (req, res) => {
  res.json({
    statusCode: 200,
    message: 'Products list',
    data: {
      data: mockData.products,
      page: 1,
      limit: 12,
      total: mockData.products.length,
    },
  });
});

app.get('/api/products/featured', (req, res) => {
  res.json({
    statusCode: 200,
    message: 'Featured products',
    data: mockData.products.slice(0, 4),
  });
});

app.get('/api/products/:slug', (req, res) => {
  const product = mockData.products.find((p) => p.slug === req.params.slug);
  if (!product) {
    return res.status(404).json({ statusCode: 404, message: 'Product not found' });
  }
  res.json({
    statusCode: 200,
    message: 'Product detail',
    data: product,
  });
});

// Categories endpoints
app.get('/api/categories', (req, res) => {
  res.json({
    statusCode: 200,
    message: 'Categories list',
    data: mockData.categories,
  });
});

// Cart endpoints
app.get('/api/cart', (req, res) => {
  res.json({
    statusCode: 200,
    message: 'Cart',
    data: {
      items: [],
      subtotal: 0,
      shipping: 300,
      discount: 0,
      total: 300,
    },
  });
});

app.post('/api/cart/items', (req, res) => {
  res.json({
    statusCode: 201,
    message: 'Item added to cart',
    data: { success: true },
  });
});

// Orders endpoints
app.post('/api/orders', (req, res) => {
  const order = {
    id: '2',
    orderNumber: 'ORD-2026-002',
    status: 'pending',
    paymentStatus: 'pending',
    subtotal: 1500,
    shipping: 300,
    total: 1800,
    createdAt: new Date().toISOString(),
    items: [
      { productId: '1', quantity: 1, productName: 'Vernis Gel Burgundy Premium', unitPrice: 1500 },
    ],
  };
  res.status(201).json({
    statusCode: 201,
    message: 'Order created',
    data: order,
  });
});

app.get('/api/orders/my', (req, res) => {
  res.json({
    statusCode: 200,
    message: 'My orders',
    data: {
      data: mockData.orders,
      page: 1,
      limit: 10,
      total: 1,
    },
  });
});

app.get('/api/orders/my/:id', (req, res) => {
  const order = mockData.orders.find((o) => o.id === req.params.id);
  if (!order) {
    return res.status(404).json({ statusCode: 404, message: 'Order not found' });
  }
  res.json({
    statusCode: 200,
    message: 'Order detail',
    data: order,
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    statusCode: 200,
    message: 'API is running',
    timestamp: new Date().toISOString(),
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    statusCode: 404,
    message: `Endpoint ${req.method} ${req.path} not found`,
  });
});

const PORT = 3001;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Mock API server running on http://localhost:${PORT}`);
  console.log(`📚 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🔐 Admin login: admin@meey.dz / password`);
  console.log(`👤 Client login: client@meey.dz / password`);
});
