import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Search, Plus, Minus, Trash2, ShoppingBag, 
  MapPin, Phone, User, FileText, Truck, Receipt, 
  CheckCircle, ChevronRight, PackageSearch, ShoppingCart, Home, Store, RotateCcw
} from 'lucide-react';
import { Product } from '@/types/product';
import { SHIPPING_RATES, WilayaShipping } from '@/lib/constants/shipping';
import { ProductsAPI, OrdersAPI } from '@/lib/api/client';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface CreateOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  initialProducts?: Product[];
}


export default function CreateOrderModal({ isOpen, onClose, onSuccess, initialProducts = [] }: CreateOrderModalProps) {
  // Products state
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [loadingProducts, setLoadingProducts] = useState(false);

  // Customer Details State
  const [customer, setCustomer] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    wilaya: '16',
    commune: '',
    address: '',
    note: '',
    deliveryType: 'home' as 'home' | 'desk'
  });

  // Cart & Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState<{ product: Product; quantity: number }[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  // Fetch products if not provided
  React.useEffect(() => {
    if (isOpen && products.length === 0) {
      loadProducts();
    }
  }, [isOpen]);

  const loadProducts = async () => {
    try {
      setLoadingProducts(true);
      const res = await ProductsAPI.getAll(1, 100);
      if (res.success) {
        setProducts(res.data.data || []);
      } else {
        console.error("[CreateOrderModal] API Error loading products:", res.error);
        toast.error(res.error || "Erreur lors du chargement des produits");
      }
    } catch (err) {
      console.error("[CreateOrderModal] Critical error loading products:", err);
      toast.error("Erreur de connexion lors du chargement du catalogue");
    } finally {
      setLoadingProducts(false);
    }
  };

  // Calculation logic
  const selectedWilaya = useMemo(() => SHIPPING_RATES.find(w => w.id === customer.wilaya), [customer.wilaya]);
  const defaultDeliveryCost = useMemo(() => {
    if (!selectedWilaya) return 0;
    return customer.deliveryType === 'home' ? selectedWilaya.homeRate : (selectedWilaya.deskRate || selectedWilaya.homeRate);
  }, [selectedWilaya, customer.deliveryType]);

  const [customDeliveryCost, setCustomDeliveryCost] = useState<number | null>(null);
  
  const deliveryCost = customDeliveryCost !== null ? customDeliveryCost : defaultDeliveryCost;
  
  const subtotal = useMemo(() => {
    return cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  }, [cart]);

  const total = subtotal + deliveryCost;

  // Search logic
  const filteredProducts = useMemo(() => {
    if (!searchQuery) return products; // Show all or suggest top products by default
    const query = searchQuery.toLowerCase();
    return products.filter(p => 
      p.name.toLowerCase().includes(query) || p.sku.toLowerCase().includes(query)
    );
  }, [searchQuery, products]);

  // Cart actions
  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.product.id === product.id 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.product.id === productId) {
        const newQ = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQ };
      }
      return item;
    }));
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  const handleSave = async () => {
    if (!customer.firstName || !customer.lastName || !customer.phone) {
      toast.error("Veuillez remplir les informations client obligatoires");
      return;
    }

    try {
      setIsSaving(true);
      const orderData = {
        customer: {
          firstName: customer.firstName,
          lastName: customer.lastName,
          phone: customer.phone,
          address: {
            wilaya: customer.wilaya,
            wilayaName: selectedWilaya?.name,
            commune: customer.commune,
            address: customer.address
          }
        },
        items: cart.map(item => ({
          productId: item.product.id,
          quantity: item.quantity,
          price: item.product.price
        })),
        deliveryType: customer.deliveryType,
        shippingCost: deliveryCost,
        note: customer.note,
        source: 'manual'
      };

      const res = await OrdersAPI.createManual(orderData);
      if (res.success) {
        toast.success("Commande créée avec succès");
        if (onSuccess) onSuccess();
        onClose();
        // Reset state
        setCart([]);
        setCustomer({
          firstName: '',
          lastName: '',
          phone: '',
          wilaya: '16',
          commune: '',
          address: '',
          note: '',
          deliveryType: 'home'
        });
      } else {
        console.error("[CreateOrderModal] API Error creating order:", res.error);
        toast.error(res.error || "Erreur lors de la création");
      }
    } catch (err) {
      console.error("[CreateOrderModal] Critical error creating order:", err);
      toast.error("Erreur de connexion au serveur");
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
          onClick={onClose}
        />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
          className="relative bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
            <div className="flex items-center gap-3">
              <div className="bg-blue-600 p-2 rounded-xl text-white shadow-sm shadow-blue-200">
                <ShoppingBag size={20} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-800">Créer une Commande</h2>
                <p className="text-sm text-slate-500 font-medium">Saisie manuelle pour un client</p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Body */}
          <div className="flex flex-col lg:flex-row flex-1 overflow-hidden">
            
            {/* LEFT COLUMN: Customer Info */}
            <div className="w-full lg:w-5/12 border-r border-slate-100 p-6 overflow-y-auto bg-white custom-scrollbar">
              <h3 className="text-lg font-semibold text-slate-800 mb-6 flex items-center gap-2">
                <User size={18} className="text-blue-500" />
                Informations Client
              </h3>

              <div className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700">Nom</label>
                    <input 
                      type="text" 
                      value={customer.lastName}
                      onChange={e => setCustomer({...customer, lastName: e.target.value})}
                      className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
                      placeholder="Ex: Benali"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700">Prénom</label>
                    <input 
                      type="text" 
                      value={customer.firstName}
                      onChange={e => setCustomer({...customer, firstName: e.target.value})}
                      className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
                      placeholder="Ex: Sarah"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                    <Phone size={14} className="text-slate-400" />
                    Téléphone
                  </label>
                  <input 
                    type="tel" 
                    value={customer.phone}
                    onChange={e => setCustomer({...customer, phone: e.target.value})}
                    className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
                    placeholder="05..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                      <MapPin size={14} className="text-slate-400" />
                      Wilaya
                    </label>
                    <select 
                      value={customer.wilaya}
                      onChange={e => {
                        setCustomer({...customer, wilaya: e.target.value});
                        setCustomDeliveryCost(null); // Reset custom cost when wilaya changes
                      }}
                      className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none appearance-none"
                    >
                      {SHIPPING_RATES.map(w => (
                        <option key={w.id} value={w.id}>{w.id} - {w.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700">Commune</label>
                    <input 
                      type="text" 
                      value={customer.commune}
                      onChange={e => setCustomer({...customer, commune: e.target.value})}
                      className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
                      placeholder="Commune..."
                    />
                  </div>
                </div>

                <div className="space-y-1.5 pt-2">
                  <label className="text-sm font-medium text-slate-700">Type de Livraison</label>
                  <div className="grid grid-cols-2 gap-2 bg-slate-50 p-1.5 rounded-xl border border-slate-100 mt-1">
                    <button
                      onClick={() => setCustomer({ ...customer, deliveryType: 'home' })}
                      className={cn(
                        "flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all",
                        customer.deliveryType === 'home' 
                          ? "bg-white text-blue-600 shadow-sm border border-blue-100" 
                          : "text-slate-400 hover:text-slate-600"
                      )}
                    >
                      <Home size={14} /> Domicile
                    </button>
                    <button
                      onClick={() => setCustomer({ ...customer, deliveryType: 'desk' })}
                      className={cn(
                        "flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all",
                        customer.deliveryType === 'desk' 
                          ? "bg-white text-amber-600 shadow-sm border border-amber-100" 
                          : "text-slate-400 hover:text-slate-600"
                      )}
                    >
                      <Store size={14} /> Stopdesk
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700">Adresse Complète</label>
                  <textarea 
                    rows={2}
                    value={customer.address}
                    onChange={e => setCustomer({...customer, address: e.target.value})}
                    className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none resize-none"
                    placeholder="N° rue, bâtiment, étage..."
                  />
                </div>

                <div className="space-y-1.5 pt-4 border-t border-slate-100">
                  <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                    <FileText size={14} className="text-amber-500" />
                    Note du Client (saisie lors de sa dernière commande / demande)
                  </label>
                  <textarea 
                    rows={3}
                    value={customer.note}
                    onChange={e => setCustomer({...customer, note: e.target.value})}
                    className="w-full rounded-xl border border-amber-200 bg-amber-50/30 px-4 py-2.5 text-sm focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all outline-none resize-none"
                    placeholder="Ex: Livrer après 17h, appeler avant de venir..."
                  />
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: Products, Cart & Calc */}
            <div className="w-full lg:w-7/12 flex flex-col bg-slate-50/30">
              
              {/* Product Search & Selection list */}
              <div className="p-6 pb-2 border-b border-slate-100 flex-1 overflow-hidden flex flex-col">
                <div className="relative mb-4">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input 
                    type="text" 
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Rechercher un produit par nom ou SKU..."
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 shadow-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none text-sm bg-white"
                  />
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-2">
                  {loadingProducts ? (
                    <div className="h-48 flex flex-col items-center justify-center text-slate-400">
                      <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mb-3"></div>
                      <p className="text-xs font-medium">Chargement du catalogue...</p>
                    </div>
                  ) : products.length === 0 ? (
                    <div className="h-48 flex flex-col items-center justify-center text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                      <div className="p-3 bg-white rounded-full shadow-sm mb-3">
                        <PackageSearch size={24} className="text-slate-300" />
                      </div>
                      <p className="text-sm">Aucun produit disponible</p>
                      <button 
                        onClick={loadProducts}
                        className="mt-3 text-xs font-bold text-blue-600 hover:text-blue-700 underline flex items-center gap-1"
                      >
                        <RotateCcw size={12} /> Réessayer
                      </button>
                    </div>
                  ) : filteredProducts.length === 0 ? (
                    <div className="h-48 flex flex-col items-center justify-center text-slate-400">
                      <div className="p-3 bg-slate-100 rounded-full mb-3">
                        <Search size={24} className="opacity-40" />
                      </div>
                      <p className="text-sm">Aucun résultat pour "{searchQuery}"</p>
                    </div>
                  ) : (
                    filteredProducts.map(product => (
                      <div 
                        key={product.id} 
                        className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-white hover:border-blue-200 hover:shadow-sm transition-all group cursor-pointer"
                        onClick={() => addToCart(product)}
                      >
                        <div className="flex items-center gap-4">
                          <img 
                            src={product.images[0] || '/placeholder.png'} 
                            alt={product.name} 
                            className="w-12 h-12 rounded-lg object-cover border border-slate-100"
                          />
                          <div>
                            <p className="text-sm font-semibold text-slate-800 line-clamp-1">{product.name}</p>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-xs text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded font-medium">{product.sku}</span>
                              <span className="text-sm font-bold text-blue-600">{product.price.toLocaleString()} DA</span>
                            </div>
                          </div>
                        </div>
                        <button className="h-8 w-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors mr-2">
                          <Plus size={16} />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Cart & Summary Panel */}
              <div className="p-6 bg-white border-t border-slate-100 shrink-0 shadow-[0_-4px_20px_-15px_rgba(0,0,0,0.1)] z-10">
                <h4 className="text-sm font-bold tracking-wide text-slate-800 uppercase mb-3 flex items-center gap-2">
                  <ShoppingCart size={16} className="text-slate-400" />
                  Panier ({cart.reduce((a, b) => a + b.quantity, 0)})
                </h4>

                {cart.length === 0 ? (
                  <div className="py-6 text-center text-sm text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                    Le panier est vide. Sélectionnez des produits.
                  </div>
                ) : (
                  <div className="space-y-3 max-h-48 overflow-y-auto mb-4 custom-scrollbar pr-2">
                    {cart.map(item => (
                      <div key={item.product.id} className="flex items-center justify-between bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                        <div className="flex-1 truncate">
                          <p className="text-sm font-medium text-slate-800 truncate pr-2">{item.product.name}</p>
                          <p className="text-xs text-slate-500">{item.product.price.toLocaleString()} DA / unité</p>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          {/* Quantity control */}
                          <div className="flex items-center bg-white border border-slate-200 rounded-lg h-8">
                            <button 
                              onClick={(e) => { e.stopPropagation(); updateQuantity(item.product.id, -1); }}
                              className="w-8 h-full flex items-center justify-center text-slate-500 hover:text-slate-800 transition-colors"
                            >
                              <Minus size={14} />
                            </button>
                            <span className="w-8 text-center text-sm font-medium text-slate-800">{item.quantity}</span>
                            <button 
                              onClick={(e) => { e.stopPropagation(); updateQuantity(item.product.id, 1); }}
                              className="w-8 h-full flex items-center justify-center text-slate-500 hover:text-slate-800 transition-colors"
                            >
                              <Plus size={14} />
                            </button>
                          </div>
                          
                          <p className="text-sm font-bold text-slate-800 w-20 text-right">
                            {(item.product.price * item.quantity).toLocaleString()} DA
                          </p>

                          <button 
                            onClick={(e) => { e.stopPropagation(); removeFromCart(item.product.id); }}
                            className="p-1.5 text-red-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Calculation */}
                <div className="space-y-2 pt-4 border-t border-slate-100">
                  <div className="flex justify-between items-center text-sm text-slate-600">
                    <span>Sous-total produits</span>
                    <span className="font-semibold">{subtotal.toLocaleString()} DA</span>
                  </div>
                  
                  <div className="flex justify-between items-center text-sm">
                    <span className="flex items-center gap-1.5 text-slate-600">
                      <Truck size={14} className="text-slate-400" />
                      Frais de livraison
                    </span>
                    <div className="flex items-center">
                      <input 
                        type="number" 
                        value={customDeliveryCost !== null ? customDeliveryCost : defaultDeliveryCost}
                        onChange={(e) => setCustomDeliveryCost(e.target.value === '' ? null : Number(e.target.value))}
                        className="w-24 text-right rounded-lg border border-slate-200 px-2 py-1 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none font-semibold text-slate-800"
                        placeholder="0"
                      />
                      <span className="ml-1 text-slate-500 font-medium">DA</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center pt-3 pb-1">
                    <span className="text-base font-bold text-slate-800 flex items-center gap-2">
                      <Receipt size={18} className="text-emerald-500" />
                      Total à payer
                    </span>
                    <span className="text-2xl font-black text-emerald-600">
                      {total.toLocaleString()} DA
                    </span>
                  </div>
                </div>

              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/80 flex items-center justify-end gap-3 rounded-b-2xl">
            <button 
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-200 transition-colors"
            >
              Annuler
            </button>
            <button 
              onClick={handleSave}
              disabled={cart.length === 0 || isSaving}
              className="px-6 py-2.5 rounded-xl text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-sm shadow-blue-200 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed min-w-[160px] justify-center"
            >
              {isSaving ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <CheckCircle size={18} />
              )}
              {isSaving ? 'Création...' : 'Créer la commande'}
            </button>
          </div>

        </motion.div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: #cbd5e1;
          border-radius: 10px;
        }
      `}} />
    </AnimatePresence>
  );
}
