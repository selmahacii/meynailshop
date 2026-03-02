export class OrderItemResponseDto {
  id: string;
  orderId: string;
  productId: string;
  productName: string;
  productSku: string;
  productImage: string;
  unitPrice: number;
  quantity: number;
  subtotal: number;
}

export class OrderResponseDto {
  id: string;
  orderNumber: string;
  userId: string;
  status: string;
  paymentStatus: string;
  paymentMethod: string;
  subtotal: number;
  shippingCost: number;
  discount: number;
  total: number;
  shippingAddressSnapshot: {
    label: string;
    fullName: string;
    phone: string;
    wilaya: string;
    commune: string;
    address: string;
    postalCode: string;
  };
  notes?: string;
  trackingNumber?: string;
  shippedAt?: Date;
  deliveredAt?: Date;
  cancelledAt?: Date;
  cancellationReason?: string;
  items?: OrderItemResponseDto[];
  createdAt: Date;
  updatedAt: Date;
}
