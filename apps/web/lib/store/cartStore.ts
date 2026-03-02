import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem } from '@/types/cart';

interface CartStoreState {
  items: CartItem[];
  couponCode?: string;
  couponDiscount: number;
  addItem: (item: CartItem) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  setCoupon: (code: string, discount: number) => void;
  removeCoupon: () => void;
  clear: () => void;

  // Computed
  getSubtotal: () => number;
  getTotal: () => number;
  getItemCount: () => number;
}

export const useCartStore = create<CartStoreState>()(
  persist(
    (set, get) => ({
      items: [],
      couponCode: undefined,
      couponDiscount: 0,

      addItem: (newItem) => set((state) => {
        const existingItem = state.items.find(i => i.productId === newItem.productId);
        if (existingItem) {
          return {
            items: state.items.map(i =>
              i.productId === newItem.productId
                ? { ...i, quantity: Math.min(i.stock, i.quantity + newItem.quantity) }
                : i
            )
          };
        }
        return { items: [...state.items, newItem] };
      }),

      removeItem: (productId) => set((state) => ({
        items: state.items.filter(i => i.productId !== productId),
      })),

      updateQuantity: (productId, quantity) => set((state) => ({
        items: state.items.map(i =>
          i.productId === productId ? { ...i, quantity: Math.max(1, Math.min(i.stock, quantity)) } : i
        ),
      })),

      setCoupon: (code, discount) => set({ couponCode: code, couponDiscount: discount }),

      removeCoupon: () => set({ couponCode: undefined, couponDiscount: 0 }),

      clear: () => set({ items: [], couponCode: undefined, couponDiscount: 0 }),

      // Computed functions using get()
      getSubtotal: () => {
        return get().items.reduce((acc, item) => acc + item.price * item.quantity, 0);
      },

      getTotal: () => {
        const subtotal = get().getSubtotal();
        return Math.max(0, subtotal - get().couponDiscount);
      },

      getItemCount: () => {
        return get().items.reduce((acc, item) => acc + item.quantity, 0);
      },
    }),
    {
      name: 'meey-cart-storage',
    }
  )
);
