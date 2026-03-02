export interface CartItem {
  productId: string;
  quantity: number;
  name: string;
  price: number;
  image: string;
  stock: number;
}

export interface CartState {
  items: CartItem[];
  couponCode?: string;
  couponDiscount?: number;
  subtotal: number;
  shippingCost: number;
  discount: number;
  total: number;
}
