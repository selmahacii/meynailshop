import { create } from 'zustand';

interface UIState {
  cartDrawerOpen: boolean;
  setCartDrawerOpen: (open: boolean) => void;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  toasts: Array<{ id: string; type: 'success' | 'error'; message: string }>;
  addToast: (message: string, type: 'success' | 'error') => void;
  removeToast: (id: string) => void;
}

export const useUIStore = create<UIState>((set) => ({
  cartDrawerOpen: false,
  setCartDrawerOpen: (open) => set({ cartDrawerOpen: open }),
  mobileMenuOpen: false,
  setMobileMenuOpen: (open) => set({ mobileMenuOpen: open }),
  toasts: [],
  addToast: (message, type) => set((state) => ({
    toasts: [...state.toasts, { id: Date.now().toString(), type, message }],
  })),
  removeToast: (id) => set((state) => ({
    toasts: state.toasts.filter(t => t.id !== id),
  })),
}));
