import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Search, Plus, Minus, Trash2, ShoppingBag, 
  MapPin, Phone, User, FileText, Truck, Receipt, 
  CheckCircle, ChevronRight, PackageSearch, ShoppingCart, Home, Store, RotateCcw, Globe, ChevronDown
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
    deliveryType: 'home' as 'home' | 'desk',
    source: 'instagram' as string
  });

  // Cart & Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState<{ product: Product; quantity: number }[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  // Fetch products if not provided
  React.useEffect(() => {
    console.log("[CreateOrderModal] Opened, products length:", products.length);
    if (isOpen && products.length === 0) {
      loadProducts();
    }
  }, [isOpen]);

  const loadProducts = async () => {
    try {
      setLoadingProducts(true);
      console.log("[CreateOrderModal] Fetching products...");
      const res = await ProductsAPI.getAll(1, 100);
      
      console.log("[CreateOrderModal] API Response:", res);

      if (res.success) {
        // Handle different possible response structures
        const productList = res.data?.items || res.data?.data || (Array.isArray(res.data) ? res.data : []);
        console.log("[CreateOrderModal] Product list extracted:", productList.length, "items");
        setProducts(productList);
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
        source: customer.source
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
          className="relative bg-creme rounded-[32px] shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col border border-gold-brand/20 font-sans"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-gold-brand/10 bg-white/50 backdrop-blur-md">
            <div className="flex items-center gap-4">
              <div className="bg-rouge-brand p-2.5 rounded-2xl text-creme shadow-lg shadow-rouge-brand/20">
                <ShoppingBag size={22} />
              </div>
              <div>
                <h2 className="text-2xl font-serif text-rouge-brand leading-tight">Nouvelle Commande</h2>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gold-brand">Saisie Manuelle • Mey Nail Shop</p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="p-2 rounded-full hover:bg-rouge-brand/5 text-encre3 hover:text-rouge-brand transition-all"
            >
              <X size={24} />
            </button>
          </div>

          {/* Body */}
          <div className="flex flex-col lg:flex-row flex-1 overflow-hidden">
            
            {/* LEFT COLUMN: Customer Info */}
            <div className="w-full lg:w-5/12 border-r border-gold-brand/10 p-6 overflow-y-auto bg-white custom-scrollbar">
              <h3 className="text-xs font-black uppercase tracking-[0.2em] text-rouge-brand mb-6 flex items-center gap-2">
                <User size={14} />
                Profil Client
              </h3>

              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-encre3">Nom</label>
                    <input 
                      type="text" 
                      value={customer.lastName}
                      onChange={e => setCustomer({...customer, lastName: e.target.value})}
                      className="w-full rounded-xl border-2 border-creme2 bg-creme2/20 px-4 py-3 text-sm focus:border-gold-brand transition-all outline-none font-medium text-encre"
                      placeholder="Benali"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-encre3">Prénom</label>
                    <input 
                      type="text" 
                      value={customer.firstName}
                      onChange={e => setCustomer({...customer, firstName: e.target.value})}
                      className="w-full rounded-xl border-2 border-creme2 bg-creme2/20 px-4 py-3 text-sm focus:border-gold-brand transition-all outline-none font-medium text-encre"
                      placeholder="Sarah"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-encre3 flex items-center gap-2">
                    <Phone size={12} />
                    Numéro de Téléphone
                  </label>
                  <input 
                    type="tel" 
                    value={customer.phone}
                    onChange={e => setCustomer({...customer, phone: e.target.value})}
                    className="w-full rounded-xl border-2 border-creme2 bg-creme2/20 px-4 py-3 text-sm focus:border-gold-brand transition-all outline-none font-bold text-encre tracking-widest"
                    placeholder="05 50 00 00 00"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-encre3 flex items-center gap-2">
                      <MapPin size={12} />
                      Wilaya
                    </label>
                    <div className="relative">
                      <select 
                        value={customer.wilaya}
                        onChange={e => {
                          setCustomer({...customer, wilaya: e.target.value});
                          setCustomDeliveryCost(null); 
                        }}
                        className="w-full rounded-xl border-2 border-creme2 bg-creme2/20 px-4 py-3 text-sm focus:border-gold-brand transition-all outline-none appearance-none font-bold text-encre cursor-pointer"
                      >
                        {SHIPPING_RATES.map(w => (
                          <option key={w.id} value={w.id}>{w.id} - {w.name}</option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gold-brand pointer-events-none" size={14} />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-encre3">Commune</label>
                    <input 
                      type="text" 
                      value={customer.commune}
                      onChange={e => setCustomer({...customer, commune: e.target.value})}
                      className="w-full rounded-xl border-2 border-creme2 bg-creme2/20 px-4 py-3 text-sm focus:border-gold-brand transition-all outline-none font-medium text-encre"
                      placeholder="Commune..."
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-encre3">Adresse de Livraison</label>
                  <textarea 
                    rows={2}
                    value={customer.address}
                    onChange={e => setCustomer({...customer, address: e.target.value})}
                    className="w-full rounded-xl border-2 border-creme2 bg-creme2/20 px-4 py-3 text-sm focus:border-gold-brand transition-all outline-none resize-none font-medium text-encre"
                    placeholder="N° rue, quartier, bâtiment..."
                  />
                </div>

                <div className="space-y-1.5 pt-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-encre3 flex items-center gap-2">
                    <Truck size={12} /> Mode de Livraison
                  </label>
                  <div className="grid grid-cols-2 gap-2 bg-creme2/30 p-1.5 rounded-2xl border border-creme2 mt-1">
                    <button
                      onClick={() => setCustomer({ ...customer, deliveryType: 'home' })}
                      className={cn(
                        "flex items-center justify-center gap-2 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                        customer.deliveryType === 'home' 
                          ? "bg-rouge-brand text-creme shadow-md shadow-rouge-brand/20" 
                          : "text-encre3 hover:bg-white/50"
                      )}
                    >
                      <Home size={14} /> Domicile
                    </button>
                    <button
                      onClick={() => setCustomer({ ...customer, deliveryType: 'desk' })}
                      className={cn(
                        "flex items-center justify-center gap-2 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                        customer.deliveryType === 'desk' 
                          ? "bg-gold-brand text-encre shadow-md shadow-gold-brand/20" 
                          : "text-encre3 hover:bg-white/50"
                      )}
                    >
                      <Store size={14} /> Stopdesk
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5 pt-4">
                  <label className="text-[10px] font-black uppercase tracking-widest text-encre3 flex items-center gap-2">
                    <Globe size={12} /> Source de la commande
                  </label>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {['instagram', 'whatsapp', 'facebook', 'tiktok', 'store'].map(source => (
                      <button
                        key={source}
                        onClick={() => setCustomer({ ...customer, source })}
                        className={cn(
                          "px-3 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest border-2 transition-all capitalize",
                          customer.source === source 
                            ? "bg-encre text-creme border-encre" 
                            : "bg-white text-encre3 border-creme2 hover:border-gold-brand"
                        )}
                      >
                        {source}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1.5 pt-4 border-t border-gold-brand/10">
                  <label className="text-[10px] font-black uppercase tracking-widest text-or flex items-center gap-2">
                    <FileText size={12} />
                    Observations & Notes Client
                  </label>
                  <textarea 
                    rows={3}
                    value={customer.note}
                    onChange={e => setCustomer({...customer, note: e.target.value})}
                    className="w-full rounded-xl border-2 border-or/20 bg-or/5 px-4 py-3 text-sm focus:border-or transition-all outline-none resize-none font-medium text-encre italic"
                    placeholder="Précisez ici les demandes particulières (ex: livrer en soirée)..."
                  />
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: Products, Cart & Calc */}
            <div className="w-full lg:w-7/12 flex flex-col bg-creme/50">
              
              {/* Product Search & Selection list */}
              <div className="p-6 pb-2 border-b border-gold-brand/10 flex-1 overflow-hidden flex flex-col">
                <div className="relative mb-6">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gold-brand" size={20} />
                  <input 
                    type="text" 
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Rechercher un produit ou SKU..."
                    className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-white bg-white shadow-xl shadow-gold-brand/5 focus:border-gold-brand transition-all outline-none text-sm font-medium"
                  />
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-3 pb-4">
                  {loadingProducts ? (
                    <div className="h-48 flex flex-col items-center justify-center text-gold-brand/50">
                      <div className="w-10 h-10 border-4 border-rouge-brand border-t-transparent rounded-full animate-spin mb-4"></div>
                      <p className="text-[11px] font-black uppercase tracking-widest">Initialisation du catalogue...</p>
                    </div>
                  ) : products.length === 0 ? (
                    <div className="h-48 flex flex-col items-center justify-center text-encre3 bg-white/40 rounded-3xl border-2 border-dashed border-gold-brand/20">
                      <div className="p-4 bg-white rounded-2xl shadow-sm mb-4">
                        <PackageSearch size={28} className="text-gold-brand/30" />
                      </div>
                      <p className="text-xs font-bold uppercase tracking-widest">Catalogue Vide</p>
                      <button 
                        onClick={loadProducts}
                        className="mt-4 px-4 py-2 bg-rouge-brand text-creme rounded-lg text-[9px] font-black uppercase tracking-[0.2em] shadow-lg hover:scale-105 transition-transform"
                      >
                        <RotateCcw size={10} className="inline mr-1" /> Recharger
                      </button>
                    </div>
                  ) : filteredProducts.length === 0 ? (
                    <div className="h-48 flex flex-col items-center justify-center text-encre3">
                      <div className="p-4 bg-creme rounded-full mb-4 opacity-50">
                        <Search size={32} className="text-gold-brand" />
                      </div>
                      <p className="text-xs font-bold uppercase tracking-widest opacity-60">Aucun résultat pour "{searchQuery}"</p>
                    </div>
                  ) : (
                    filteredProducts.map(product => (
                      <div 
                        key={product.id} 
                        className="flex items-center justify-between p-3.5 rounded-2xl border-2 border-transparent bg-white shadow-sm hover:border-gold-brand/30 hover:shadow-md transition-all group cursor-pointer"
                        onClick={() => addToCart(product)}
                      >
                        <div className="flex items-center gap-4">
                          <div className="relative overflow-hidden rounded-xl border border-gold-brand/10">
                            <img 
                              src={product.images[0] || '/placeholder.png'} 
                              alt={product.name} 
                              className="w-14 h-14 object-cover transform group-hover:scale-110 transition-transform duration-500"
                            />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-encre line-clamp-1 group-hover:text-rouge-brand transition-colors">{product.name}</p>
                            <div className="flex items-center gap-3 mt-1.5">
                              <span className="text-[9px] font-black uppercase tracking-widest text-gold-brand bg-creme px-2 py-0.5 rounded-md">{product.sku}</span>
                              <span className="text-sm font-black text-rouge-mid">{product.price.toLocaleString()} DA</span>
                            </div>
                          </div>
                        </div>
                        <div className="h-10 w-10 rounded-xl bg-creme text-rouge-brand flex items-center justify-center group-hover:bg-rouge-brand group-hover:text-creme transition-all shadow-sm">
                          <Plus size={18} />
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Cart & Summary Panel */}
              <div className="p-6 bg-white border-t border-gold-brand/10 shrink-0 shadow-[0_-10px_40px_-20px_rgba(0,0,0,0.1)] z-10">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-[10px] font-black tracking-[0.2em] text-rouge-brand uppercase flex items-center gap-2">
                    <ShoppingCart size={16} />
                    Panier • {cart.reduce((a, b) => a + b.quantity, 0)} articles
                  </h4>
                  {cart.length > 0 && (
                    <button 
                      onClick={() => setCart([])}
                      className="text-[9px] font-black text-rose-600 uppercase tracking-widest hover:underline"
                    >
                      Vider
                    </button>
                  )}
                </div>

                {cart.length === 0 ? (
                  <div className="py-8 text-center text-[10px] font-black uppercase tracking-widest text-gold-brand bg-creme/50 rounded-2xl border-2 border-dashed border-gold-brand/10 border-spacing-4">
                    Sélectionnez vos articles pour continuer
                  </div>
                ) : (
                  <div className="space-y-2.5 max-h-40 overflow-y-auto mb-5 custom-scrollbar pr-2">
                    {cart.map(item => (
                      <div key={item.product.id} className="flex items-center justify-between bg-creme2/20 p-3 rounded-xl border border-gold-brand/5 backdrop-blur-sm">
                        <div className="flex-1 truncate">
                          <p className="text-xs font-bold text-encre truncate pr-3">{item.product.name}</p>
                          <p className="text-[10px] font-black text-gold-brand uppercase tracking-tighter mt-0.5">{item.product.price.toLocaleString()} DA / unité</p>
                        </div>
                        
                        <div className="flex items-center gap-4">
                          {/* Quantity control */}
                          <div className="flex items-center bg-white border-2 border-creme2 rounded-xl h-9 p-1">
                            <button 
                              onClick={(e) => { e.stopPropagation(); updateQuantity(item.product.id, -1); }}
                              className="w-7 h-full flex items-center justify-center text-gold-brand hover:text-rouge-brand transition-colors"
                            >
                              <Minus size={12} strokeWidth={3} />
                            </button>
                            <span className="w-8 text-center text-xs font-black text-encre font-mono">{item.quantity}</span>
                            <button 
                              onClick={(e) => { e.stopPropagation(); updateQuantity(item.product.id, 1); }}
                              className="w-7 h-full flex items-center justify-center text-gold-brand hover:text-rouge-brand transition-colors"
                            >
                              <Plus size={12} strokeWidth={3} />
                            </button>
                          </div>
                          
                          <p className="text-sm font-black text-encre w-24 text-right tabular-nums">
                            {(item.product.price * item.quantity).toLocaleString()} DA
                          </p>

                          <button 
                            onClick={(e) => { e.stopPropagation(); removeFromCart(item.product.id); }}
                            className="p-2 text-encre3 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Calculation */}
                <div className="space-y-2.5 pt-5 border-t border-gold-brand/10">
                  <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-encre3">
                    <span>Sous-total articles</span>
                    <span className="text-encre font-mono text-sm">{(subtotal).toLocaleString()} DA</span>
                  </div>
                  
                  <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-encre3">
                    <span className="flex items-center gap-1.5 italic">
                      Livraison ({customer.deliveryType === 'home' ? 'Domicile' : 'Stopdesk'})
                    </span>
                    <div className="flex items-center border-b border-gold-brand/20">
                      <input 
                        type="number" 
                        value={customDeliveryCost !== null ? customDeliveryCost : defaultDeliveryCost}
                        onChange={(e) => setCustomDeliveryCost(e.target.value === '' ? null : Number(e.target.value))}
                        className="w-20 text-right bg-transparent py-0.5 text-sm outline-none font-bold text-encre tabular-nums focus:text-rouge-brand"
                        placeholder="0"
                      />
                      <span className="ml-1 text-[9px]">DA</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center pt-4 pb-1">
                    <span className="text-xs font-black text-rouge-brand uppercase tracking-[0.2em] flex items-center gap-2">
                       Net à Payer
                    </span>
                    <span className="text-3xl font-serif text-rouge-mid tracking-tight">
                      {total.toLocaleString()} <span className="text-base font-sans font-bold uppercase ml-1">DA</span>
                    </span>
                  </div>
                </div>

              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="px-6 py-5 border-t border-gold-brand/10 bg-white/50 backdrop-blur-md flex flex-col sm:flex-row items-center justify-between gap-4 rounded-b-[32px]">
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gold-brand italic order-2 sm:order-1 text-center sm:text-left">
              <CheckCircle size={14} className="text-rouge-brand shrink-0" />
              Saisissez les données avec soin pour un suivi tranquille
            </div>
            
            <div className="flex items-center gap-3 w-full sm:w-auto order-1 sm:order-2">
              <button 
                onClick={onClose}
                className="flex-1 sm:flex-none px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest text-encre3 hover:text-rouge-brand hover:bg-white transition-all border border-transparent active:scale-95"
              >
                Retour
              </button>
              <button 
                onClick={handleSave}
                disabled={cart.length === 0 || isSaving}
                className="flex-1 sm:flex-none px-8 py-3 rounded-2xl text-[11px] font-black uppercase tracking-[0.15em] text-creme bg-rouge-brand hover:bg-rouge-deep disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-rouge-brand/20 transition-all flex items-center gap-3 justify-center min-w-[200px] active:scale-95"
              >
                {isSaving ? (
                  <div className="w-4 h-4 border-2 border-creme/30 border-t-creme rounded-full animate-spin"></div>
                ) : (
                  <CheckCircle size={18} />
                )}
                {isSaving ? 'Génération...' : 'Créer la commande'}
              </button>
            </div>
          </div>

        </motion.div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: #BFA893;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background-color: #390102;
        }
      `}} />
    </AnimatePresence>
  );
}
