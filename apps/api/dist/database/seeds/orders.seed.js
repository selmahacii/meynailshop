"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedOrders = seedOrders;
const order_entity_1 = require("../entities/order.entity");
const order_item_entity_1 = require("../entities/order-item.entity");
const user_entity_1 = require("../entities/user.entity");
const product_entity_1 = require("../entities/product.entity");
const address_entity_1 = require("../entities/address.entity");
async function seedOrders(connection) {
    const orderRepo = connection.getRepository(order_entity_1.Order);
    const orderItemRepo = connection.getRepository(order_item_entity_1.OrderItem);
    const userRepo = connection.getRepository(user_entity_1.User);
    const productRepo = connection.getRepository(product_entity_1.Product);
    const addressRepo = connection.getRepository(address_entity_1.Address);
    const users = await userRepo.find({ where: { role: 'client' } });
    const products = await productRepo.find();
    const addresses = await addressRepo.find();
    console.log(`📊 [SeedOrders] Found ${users.length} clients, ${products.length} products, ${addresses.length} addresses`);
    if (users.length === 0 || products.length === 0) {
        console.log('⚠️ Skipping orders seed - no users or products found');
        return;
    }
    const ordersData = [
        {
            user: users[0],
            address: addresses[0],
            status: 'delivered',
            paymentStatus: 'paid',
            paymentMethod: 'cash_on_delivery',
            items: [
                { product: products[0], quantity: 2 },
                { product: products[1], quantity: 1 },
            ],
            notes: 'Livraison express souhaitée',
        },
        {
            user: users[1],
            address: addresses[1],
            status: 'shipped',
            paymentStatus: 'paid',
            paymentMethod: 'ccp',
            items: [
                { product: products[2], quantity: 1 },
            ],
            trackingNumber: 'TRK123456789',
        },
        {
            user: users[2],
            address: addresses[2],
            status: 'pending',
            paymentStatus: 'pending',
            paymentMethod: 'baridimob',
            items: [
                { product: products[3], quantity: 3 },
                { product: products[4], quantity: 2 },
            ],
        },
        {
            user: users[0],
            address: addresses[0],
            status: 'cancelled',
            paymentStatus: 'refunded',
            paymentMethod: 'cash_on_delivery',
            items: [
                { product: products[1], quantity: 1 },
            ],
            cancellationReason: 'Client a changé d\'avis',
        },
        {
            user: users[1],
            address: addresses[1],
            status: 'processing',
            paymentStatus: 'paid',
            paymentMethod: 'ccp',
            items: [
                { product: products[0], quantity: 1 },
                { product: products[2], quantity: 2 },
                { product: products[4], quantity: 1 },
            ],
        },
        {
            user: users[2],
            address: addresses[2],
            status: 'delivered',
            paymentStatus: 'paid',
            paymentMethod: 'baridimob',
            items: [
                { product: products[3], quantity: 1 },
            ],
            trackingNumber: 'TRK987654321',
        },
    ];
    for (let i = 0; i < ordersData.length; i++) {
        const orderData = ordersData[i];
        let subtotal = 0;
        const orderItems = [];
        for (const item of orderData.items) {
            const itemSubtotal = Number(item.product.price) * item.quantity;
            subtotal += itemSubtotal;
            orderItems.push({
                productId: item.product.id,
                productName: item.product.name,
                productSku: item.product.sku,
                productImage: item.product.images?.[0] || '',
                unitPrice: Number(item.product.price),
                quantity: item.quantity,
                subtotal: itemSubtotal,
            });
        }
        const shippingCost = subtotal > 5000 ? 0 : 500;
        const total = subtotal + shippingCost;
        const order = orderRepo.create({
            orderNumber: `ORD${String(4521 + i).padStart(4, '0')}`,
            userId: orderData.user.id,
            status: orderData.status,
            paymentStatus: orderData.paymentStatus,
            paymentMethod: orderData.paymentMethod,
            subtotal,
            shippingCost,
            discount: 0,
            total,
            shippingAddressSnapshot: {
                fullName: orderData.address.fullName,
                phone: orderData.address.phone,
                wilaya: i === 0 || i === 4 ? '16' : i === 1 ? '31' : i === 2 ? '09' : '25',
                wilayaName: i === 0 || i === 4 ? 'Alger' : i === 1 ? 'Oran' : i === 2 ? 'Blida' : 'Constantine',
                commune: orderData.address.commune,
                address: orderData.address.address,
                postalCode: orderData.address.postalCode,
            },
            notes: orderData.notes,
            trackingNumber: orderData.trackingNumber,
            shippedAt: orderData.status === 'shipped' || orderData.status === 'delivered' ? new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000) : null,
            deliveredAt: orderData.status === 'delivered' ? new Date(Date.now() - Math.random() * 3 * 24 * 60 * 60 * 1000) : null,
            cancelledAt: orderData.status === 'cancelled' ? new Date(Date.now() - Math.random() * 2 * 24 * 60 * 60 * 1000) : null,
            cancellationReason: orderData.cancellationReason,
        });
        const savedOrder = await orderRepo.save(order);
        for (const itemData of orderItems) {
            const orderItem = orderItemRepo.create({
                ...itemData,
                orderId: savedOrder.id,
            });
            await orderItemRepo.save(orderItem);
        }
    }
}
//# sourceMappingURL=orders.seed.js.map