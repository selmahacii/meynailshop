import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem } from '@/types/cart';

interface CartStoreState {
  items: CartItem[];
  couponCode?: string;
  couponDiscount: number;
  addItem: (item: CartItem) => void;
  removeItem: (productId: string, variantSku?: string) => void;
  updateQuantity: (productId: string, variantSku: string | undefined, quantity: number) => void;
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
        if (!newItem.stock || newItem.stock <= 0) return state;
        const quantityToAdd = Math.min(newItem.stock, newItem.quantity || 1);
        
        const existingItem = state.items.find(i => 
          i.productId === newItem.productId && i.variantSku === newItem.variantSku
        );
        if (existingItem) {
          return {
            items: state.items.map(i =>
              i.productId === newItem.productId && i.variantSku === newItem.variantSku
                ? { ...i, quantity: Math.min(i.stock, i.quantity + quantityToAdd) }
                : i
            )
          };
        }
        return { items: [...state.items, { ...newItem, quantity: quantityToAdd }] };
      }),

      removeItem: (productId, variantSku) => set((state) => ({
        items: state.items.filter(i => 
          !(i.productId === productId && i.variantSku === variantSku)
        ),
      })),

      updateQuantity: (productId, variantSku, quantity) => set((state) => ({
        items: state.items.map(i =>
          i.productId === productId && i.variantSku === variantSku 
            ? { ...i, quantity: Math.max(1, Math.min(i.stock, quantity)) } : i
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
