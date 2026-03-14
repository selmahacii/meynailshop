import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface WishlistItem {
    productId: string;
    name: string;
    price: number;
    comparePrice?: number;
    image: string;
    slug: string;
    stock: number;
    category?: string;
}

interface WishlistState {
    items: WishlistItem[];
    addItem: (item: WishlistItem) => void;
    removeItem: (productId: string) => void;
    toggleItem: (item: WishlistItem) => void;
    isInWishlist: (productId: string) => boolean;
    clear: () => void;
    getCount: () => number;
}

export const useWishlistStore = create<WishlistState>()(
    persist(
        (set, get) => ({
            items: [],

            addItem: (newItem) => set((state) => {
                const exists = state.items.find(i => i.productId === newItem.productId);
                if (exists) return state;
                return { items: [...state.items, newItem] };
            }),

            removeItem: (productId) => set((state) => ({
                items: state.items.filter(i => i.productId !== productId),
            })),

            toggleItem: (item) => {
                const exists = get().items.find(i => i.productId === item.productId);
                if (exists) {
                    get().removeItem(item.productId);
                } else {
                    get().addItem(item);
                }
            },

            isInWishlist: (productId) => {
                return !!get().items.find(i => i.productId === productId);
            },

            clear: () => set({ items: [] }),

            getCount: () => get().items.length,
        }),
        {
            name: 'meey-wishlist-storage',
        }
    )
);
