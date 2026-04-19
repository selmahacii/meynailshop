'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { 
    X, Search, Plus, Minus, User, Phone, MapPin, 
    Truck, Building2, Store, Facebook, Instagram, 
    ChevronRight, Loader, ShoppingBag, CreditCard, 
    FileText, Tag, Trash2, ArrowRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { StoreAPI, OrdersAPI } from '@/lib/api/client';
import { toast } from 'sonner';

interface CreateOrderModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

const SOURCES = [
    { id: 'facebook', name: 'Facebook', icon: Facebook },
    { id: 'instagram', name: 'Instagram', icon: Instagram },
    { id: 'whatsapp', name: 'WhatsApp', icon: Phone },
    { id: 'phone', name: 'Appel Direct', icon: Phone },
    { id: 'store', name: 'Vente Directe', icon: Store },
];

const SHIPPING_RATES = [
    { name: 'Alger', homeRate: 400, deskRate: 200 },
    { name: 'Blida', homeRate: 500, deskRate: 300 },
    { name: 'Oran', homeRate: 700, deskRate: 400 },
    { name: 'Constantine', homeRate: 700, deskRate: 400 },
    { name: 'Sétif', homeRate: 700, deskRate: 400 },
];

export default function CreateOrderModal({ isOpen, onClose, onSuccess }: CreateOrderModalProps) {
    // --- UI STATE ---
    const [loading, setLoading] = useState(false);
    const [fetchingProducts, setFetchingProducts] = useState(false);
    const [query, setQuery] = useState('');
    
    // --- CATALOG DATA ---
    const [categories, setCategories] = useState<any[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<any>(null);
    const [selectedSubCategory, setSelectedSubCategory] = useState<any>(null);
    const [products, setProducts] = useState<any[]>([]);

    // --- ORDER DATA ---
    const [formData, setFormData] = useState({
        source: 'facebook',
        deliveryType: 'home' as 'home' | 'office',
        customer: {
            firstName: '',
            lastName: '',
            phone: '',
            wilaya: 'Alger',
            address: '',
        },
        items: [] as any[],
        shippingCost: 400,
        discount: 0,
        notes: '',
    });

    // --- 1. INITIAL FETCH (Categories) ---
    useEffect(() => {
        const init = async () => {
            const res = await StoreAPI.getCategories();
            if (res.success) setCategories(res.data || []);
        };
        if (isOpen) init();
    }, [isOpen]);

    // --- 2. PRODUCT FILTERING (API-based) ---
    useEffect(() => {
        const fetchFiltered = async () => {
            setFetchingProducts(true);
            try {
                const params: any = {};
                if (query) params.search = query;
                if (selectedSubCategory) params.category = selectedSubCategory.slug;
                else if (selectedCategory) params.category = selectedCategory.slug;

                const res = await StoreAPI.getProducts(1, 100, params);
                if (res.success) {
                    const items = res.data?.items || (Array.isArray(res.data) ? res.data : []);
                    setProducts(items);
                }
            } finally {
                setFetchingProducts(false);
            }
        };

        const timer = setTimeout(fetchFiltered, (query.length > 0 || selectedCategory) ? 300 : 0);
        return () => clearTimeout(timer);
    }, [query, selectedCategory, selectedSubCategory]);

    // --- 3. AUTO-SHIPPING LOGIC ---
    useEffect(() => {
        const rate = SHIPPING_RATES.find(r => r.name === formData.customer.wilaya);
        if (rate) {
            const cost = formData.deliveryType === 'home' ? rate.homeRate : rate.deskRate;
            setFormData(prev => ({ ...prev, shippingCost: cost }));
        }
    }, [formData.customer.wilaya, formData.deliveryType]);

    // --- ACTIONS ---
    const addToCart = (product: any, variant?: any) => {
        const itemKey = `${product.id}-${variant?.sku || 'default'}`;
        setFormData(prev => {
            const existing = prev.items.find(i => i.key === itemKey);
            if (existing) {
                return {
                    ...prev,
                    items: prev.items.map(i => i.key === itemKey ? { ...i, quantity: i.quantity + 1 } : i)
                };
            }
            const newItem = {
                key: itemKey,
                productId: product.id,
                name: product.name,
                variantSku: variant?.sku,
                unitPrice: product.price,
                quantity: 1,
                image: variant?.image || product.images?.[0]
            };
            return { ...prev, items: [...prev.items, newItem] };
        });
        toast.success(`${product.name} ajouté`, { duration: 1000 });
    };

    const updateQty = (key: string, delta: number) => {
        setFormData(prev => ({
            ...prev,
            items: prev.items.map(i => i.key === key ? { ...i, quantity: Math.max(1, i.quantity + delta) } : i)
        }));
    };

    const removeItem = (key: string) => {
        setFormData(prev => ({ ...prev, items: prev.items.filter(i => i.key !== key) }));
    };

    const subtotal = formData.items.reduce((sum, i) => sum + (i.unitPrice * i.quantity), 0);
    const total = subtotal + formData.shippingCost - formData.discount;

    const shipTo = async () => {
        if (!formData.customer.firstName || !formData.customer.phone || formData.items.length === 0) {
            toast.error("Données client ou panier manquants");
            return;
        }
        setLoading(true);
        try {
            const res = await OrdersAPI.createManual({ ...formData, subtotal, total });
            if (res.success) {
                toast.success("Commande validée avec succès");
                onSuccess();
                onClose();
            } else {
                toast.error(res.error || "Erreur de validation");
            }
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[999] bg-encre/80 backdrop-blur-md flex items-center justify-center p-0 lg:p-6 overflow-hidden">
            <div className="bg-[#fcf8f3] w-full h-full max-w-7xl lg:max-h-[90vh] lg:rounded-sm shadow-2xl flex flex-col border border-creme2 overflow-hidden animate-in zoom-in-95 duration-200">
                
                {/* --- HEADER --- */}
                <div className="bg-encre p-4 flex items-center justify-between border-b border-white/10 shrink-0">
                    <div className="flex items-center gap-4">
                        <div>
                            <h2 className="text-white font-serif text-lg tracking-wide">AzzougShop <span className="text-or text-xs italic ml-2">Manual Order Entry</span></h2>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                        {SOURCES.map(s => (
                            <button
                                key={s.id}
                                onClick={() => setFormData(p => ({ ...p, source: s.id }))}
                                className={cn(
                                    "p-2 rounded-sm transition-all border",
                                    formData.source === s.id ? "bg-or border-or text-white" : "bg-white/5 border-white/10 text-white/40 hover:text-white/80"
                                )}
                                title={s.name}
                            >
                                <s.icon size={16} />
                            </button>
                        ))}
                        <div className="w-px h-6 bg-white/10 mx-2" />
                        <button onClick={onClose} className="p-2 text-white/50 hover:text-white transition-colors">
                            <X size={20} />
                        </button>
                    </div>
                </div>

                <div className="flex-grow flex flex-col lg:flex-row overflow-hidden">
                    
                    {/* --- LEFT: CATALOG SIDEBAR (40%) --- */}
                    <div className="w-full lg:w-[45%] flex flex-col border-r border-creme2 bg-white">
                        
                        {/* Search & Categories Box */}
                        <div className="p-4 bg-white space-y-4 shadow-sm border-b border-creme2 sticky top-0 z-10">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-encre/30" size={16} />
                                <input 
                                    type="text" 
                                    className="w-full h-11 bg-creme2/20 border border-creme2 rounded-sm pl-11 pr-10 text-xs font-bold focus:outline-none focus:border-or transition-all"
                                    placeholder="Chercher NOM ou SKU..."
                                    value={query}
                                    onChange={e => setQuery(e.target.value)}
                                />
                                {fetchingProducts && <Loader className="absolute right-3 top-1/2 -translate-y-1/2 animate-spin text-or" size={14} />}
                            </div>

                            {/* Main Categories Row */}
                            <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
                                <button 
                                    onClick={() => { setSelectedCategory(null); setSelectedSubCategory(null); setQuery(''); }}
                                    className={cn("px-4 py-2 whitespace-nowrap text-[9px] font-black uppercase tracking-widest rounded-sm border transition-all shrink-0", !selectedCategory ? "bg-encre text-white border-encre" : "bg-white text-encre3 border-creme2")}
                                >
                                    Catalogue Complet
                                </button>
                                {categories.map(cat => (
                                    <button 
                                        key={cat.id}
                                        onClick={() => { setSelectedCategory(cat); setSelectedSubCategory(null); }}
                                        className={cn("px-4 py-2 whitespace-nowrap text-[9px] font-black uppercase tracking-widest rounded-sm border transition-all shrink-0", selectedCategory?.id === cat.id ? "bg-or text-white border-or" : "bg-white text-encre3 border-creme2")}
                                    >
                                        {cat.name}
                                    </button>
                                ))}
                            </div>

                            {/* Sub-Categories Pills */}
                            {selectedCategory?.subCategories?.length > 0 && (
                                <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar animate-in slide-in-from-left-2 duration-300">
                                    <button 
                                        onClick={() => setSelectedSubCategory(null)}
                                        className={cn("px-3 py-1.5 whitespace-nowrap text-[8px] font-bold uppercase rounded-sm border transition-all", !selectedSubCategory ? "bg-encre/10 text-encre border-encre/20" : "bg-white text-encre3 border-creme2")}
                                    >
                                        Tous dans {selectedCategory.name}
                                    </button>
                                    {selectedCategory.subCategories.map((sub: any) => (
                                        <button 
                                            key={sub.id}
                                            onClick={() => setSelectedSubCategory(sub)}
                                            className={cn("px-3 py-1.5 whitespace-nowrap text-[8px] font-bold uppercase rounded-sm border transition-all", selectedSubCategory?.id === sub.id ? "bg-or/20 text-or border-or" : "bg-white text-encre3 border-creme2")}
                                        >
                                            {sub.name}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Product Feed */}
                        <div className="flex-grow overflow-y-auto custom-scrollbar divide-y divide-creme2 p-2">
                            {products.map(p => (
                                <div key={p.id} className="p-3 bg-white hover:bg-[#fafafa] transition-colors rounded-sm border border-transparent hover:border-creme2 mb-1 group">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-creme2 rounded-sm overflow-hidden shrink-0 border border-creme2 shadow-sm">
                                            <img src={p.images?.[0]} className="w-full h-full object-cover" alt="" />
                                        </div>
                                        <div className="min-w-0 flex-grow">
                                            <div className="flex items-center gap-2">
                                                <h4 className="text-[10px] font-black uppercase text-encre truncate">{p.name}</h4>
                                                {p.stock <= 5 && <span className="text-[7px] font-bold px-1.5 py-0.5 bg-rouge-brand/10 text-rouge-brand uppercase rounded-full">Bas Stock</span>}
                                            </div>
                                            <div className="flex items-center gap-3 mt-1">
                                                <span className="text-[11px] font-black text-or">{p.price} DA</span>
                                                <span className="text-[8px] font-medium text-encre3 uppercase tracking-tighter">REF: {p.sku || 'N/A'}</span>
                                            </div>
                                        </div>
                                        {!p.variants?.length && (
                                            <button 
                                                onClick={() => addToCart(p)}
                                                className="w-8 h-8 rounded-full bg-encre/5 text-encre flex items-center justify-center hover:bg-encre hover:text-white transition-all shadow-sm active:scale-90"
                                            >
                                                <Plus size={14} />
                                            </button>
                                        )}
                                    </div>
                                    
                                    {p.variants?.length > 0 && (
                                        <div className="mt-3 pl-16 flex flex-wrap gap-2">
                                            {p.variants.map((v: any) => (
                                                <button 
                                                    key={v.sku} 
                                                    onClick={() => addToCart(p, v)}
                                                    className="px-2 py-1 bg-[#fdfdfd] border border-creme2 rounded-sm flex items-center gap-2 hover:border-or hover:bg-white transition-all group/v"
                                                >
                                                    <span className="text-[8px] font-black text-encre3 group-hover/v:text-or uppercase tracking-tighter">{v.sku}</span>
                                                    <span className="text-[8px] font-bold text-encre min-w-[12px] text-center">({v.stock || 0})</span>
                                                    <Plus size={8} className="text-or" />
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                            {products.length === 0 && !fetchingProducts && (
                                <div className="py-20 text-center opacity-40">
                                    <ShoppingBag size={48} className="mx-auto mb-4 text-encre/20" />
                                    <p className="text-xs font-serif italic">Aucun produit trouvé pour cette sélection</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* --- RIGHT: CHECKOUT & FORM (55%) --- */}
                    <div className="w-full lg:w-[55%] flex flex-col bg-[#fcf8f3]/50">
                        
                        <div className="flex-grow overflow-y-auto custom-scrollbar p-6 space-y-8">
                            
                            {/* 1. Basket Card */}
                            <div className="bg-white rounded-sm border border-creme2 p-5 shadow-sm">
                                <div className="flex items-center justify-between mb-4 border-b border-creme2 pb-4">
                                    <h3 className="text-xs font-black uppercase tracking-widest text-encre flex items-center gap-2">
                                        <ShoppingBag size={14} /> Récapitulatif Panier
                                    </h3>
                                    <span className="text-[10px] font-black bg-or text-white px-2 py-0.5 rounded-full">{formData.items.length} Articles</span>
                                </div>

                                <div className="divide-y divide-creme2 max-h-[250px] overflow-y-auto pr-2 custom-scrollbar">
                                    {formData.items.map(item => (
                                        <div key={item.key} className="py-3 flex items-center justify-between gap-4 animate-in fade-in slide-in-from-right-2 duration-200">
                                            <div className="flex items-center gap-3 flex-grow min-w-0">
                                                <div className="w-8 h-8 rounded-sm overflow-hidden bg-creme2 shrink-0">
                                                    <img src={item.image} className="w-full h-full object-cover" alt="" />
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="text-[10px] font-black uppercase text-encre truncate">{item.name}</p>
                                                    {item.variantSku && <p className="text-[8px] font-black text-or uppercase tracking-tighter">{item.variantSku}</p>}
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4 shrink-0">
                                                <div className="flex items-center bg-creme2/20 border border-creme2 rounded-sm p-0.5">
                                                    <button onClick={() => updateQty(item.key, -1)} className="p-1 hover:text-or transition-colors"><Minus size={10} /></button>
                                                    <span className="w-8 text-center text-[10px] font-black">{item.quantity}</span>
                                                    <button onClick={() => updateQty(item.key, 1)} className="p-1 hover:text-or transition-colors"><Plus size={10} /></button>
                                                </div>
                                                <div className="w-16 text-right">
                                                    <p className="text-[10px] font-black">{(item.unitPrice * item.quantity).toFixed(0)} DA</p>
                                                </div>
                                                <button onClick={() => removeItem(item.key)} className="text-rouge-brand hover:scale-110 transition-transform"><Trash2 size={12} /></button>
                                            </div>
                                        </div>
                                    ))}
                                    {formData.items.length === 0 && (
                                        <div className="py-10 text-center text-encre3 text-[10px] font-serif italic">Le panier est vide. Sélectionnez des produits à gauche.</div>
                                    )}
                                </div>
                            </div>

                            {/* 2. Customer & Delivery Card */}
                            <div className="bg-white rounded-sm border border-creme2 p-5 shadow-sm">
                                <h3 className="text-xs font-black uppercase tracking-widest text-encre mb-6 flex items-center gap-2 border-b border-creme2 pb-4">
                                    <User size={14} /> Informations Client & Expédition
                                </h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <div className="space-y-1">
                                            <label className="text-[9px] font-black uppercase text-encre3 ml-1">Nom Complet</label>
                                            <div className="relative">
                                                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-encre/20" size={14} />
                                                <input 
                                                    className="w-full h-10 pl-10 pr-4 bg-creme2/10 border border-creme2 rounded-sm focus:outline-none focus:border-encre text-xs font-bold" 
                                                    placeholder="Prénom Nom"
                                                    value={formData.customer.firstName}
                                                    onChange={e => setFormData(p => ({ ...p, customer: { ...p.customer, firstName: e.target.value } }))}
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[9px] font-black uppercase text-encre3 ml-1">Téléphone Principal</label>
                                            <div className="relative">
                                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-encre/20" size={14} />
                                                <input 
                                                    className="w-full h-10 pl-10 pr-4 bg-creme2/10 border border-creme2 rounded-sm focus:outline-none focus:border-encre text-xs font-bold" 
                                                    placeholder="05 / 06 / 07..."
                                                    value={formData.customer.phone}
                                                    onChange={e => setFormData(p => ({ ...p, customer: { ...p.customer, phone: e.target.value } }))}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="space-y-1">
                                            <label className="text-[9px] font-black uppercase text-encre3 ml-1">Lieu de Livraison</label>
                                            <div className="grid grid-cols-2 h-10 bg-creme2/20 border border-creme2 rounded-sm p-1 gap-1">
                                                <button 
                                                    onClick={() => setFormData(p => ({ ...p, deliveryType: 'office' }))}
                                                    className={cn("flex items-center justify-center gap-2 rounded-[2px] text-[8px] font-black uppercase transition-all", formData.deliveryType === 'office' ? "bg-white text-encre shadow-sm" : "text-encre3")}
                                                >
                                                    <Building2 size={12} /> Stopdesk
                                                </button>
                                                <button 
                                                    onClick={() => setFormData(p => ({ ...p, deliveryType: 'home' }))}
                                                    className={cn("flex items-center justify-center gap-2 rounded-[2px] text-[8px] font-black uppercase transition-all", formData.deliveryType === 'home' ? "bg-white text-encre shadow-sm" : "text-encre3")}
                                                >
                                                    <Truck size={12} /> Domicile
                                                </button>
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[9px] font-black uppercase text-encre3 ml-1">Wilaya de Destination</label>
                                            <select 
                                                className="w-full h-10 px-3 bg-creme2/10 border border-creme2 rounded-sm focus:outline-none focus:border-encre text-xs font-bold"
                                                value={formData.customer.wilaya}
                                                onChange={e => setFormData(p => ({ ...p, customer: { ...p.customer, wilaya: e.target.value } }))}
                                            >
                                                {SHIPPING_RATES.map(r => <option key={r.name} value={r.name}>{r.name}</option>)}
                                                <option value="Autre">Autre Wilaya (Tarif standard)</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="md:col-span-2 space-y-1">
                                        <label className="text-[9px] font-black uppercase text-encre3 ml-1">Adresse Complète / Instruction de livraison</label>
                                        <div className="relative">
                                            <MapPin className="absolute left-3 top-3 text-encre/20" size={14} />
                                            <textarea 
                                                className="w-full h-20 pl-10 pr-4 pt-2 bg-creme2/10 border border-creme2 rounded-sm focus:outline-none focus:border-encre text-xs font-bold resize-none" 
                                                placeholder="Quartier, N° Maison, Repères, etc."
                                                value={formData.customer.address}
                                                onChange={e => setFormData(p => ({ ...p, customer: { ...p.customer, address: e.target.value } }))}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>

                        {/* --- FINAL CHECKOUT BAR --- */}
                        <div className="bg-encre p-6 border-t border-white/10 shadow-2xl shrink-0">
                            <div className="flex flex-col lg:flex-row items-center gap-8">
                                
                                <div className="flex grow gap-8 text-[10px] font-black uppercase tracking-widest text-white/40">
                                    <div>
                                        <span>Total Articles</span>
                                        <p className="text-white text-sm">{subtotal.toFixed(0)} DA</p>
                                    </div>
                                    <div>
                                        <span>Livraison</span>
                                        <div className="flex items-center gap-2 mt-1">
                                            <input 
                                                type="number"
                                                className="w-16 bg-white/5 border border-white/10 rounded-sm px-2 py-0.5 text-white/90 text-[10px] font-bold focus:outline-none focus:border-or"
                                                value={formData.shippingCost}
                                                onChange={e => setFormData(p => ({ ...p, shippingCost: parseInt(e.target.value) || 0 }))}
                                            />
                                            <span className="text-[8px]">DA</span>
                                        </div>
                                    </div>
                                    <div>
                                        <span>Remise Spéciale</span>
                                        <div className="flex items-center gap-2 mt-1">
                                            <input 
                                                type="number"
                                                className="w-16 bg-rouge-brand/10 border border-rouge-brand/20 rounded-sm px-2 py-0.5 text-rouge-brand text-[10px] font-bold focus:outline-none focus:border-rouge-brand"
                                                value={formData.discount}
                                                onChange={e => setFormData(p => ({ ...p, discount: parseInt(e.target.value) || 0 }))}
                                            />
                                            <Tag size={10} className="text-rouge-brand" />
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-6">
                                    <div className="text-right">
                                        <span className="text-[8px] font-black uppercase tracking-[0.3em] text-or block mb-1">Total à Encaisser</span>
                                        <p className="text-2xl font-black text-white">{total.toFixed(0)} <span className="text-xs">DA</span></p>
                                    </div>
                                    <button 
                                        onClick={shipTo}
                                        disabled={loading || formData.items.length === 0}
                                        className="h-14 px-10 bg-or text-white rounded-sm font-black uppercase tracking-[0.2em] text-[11px] hover:bg-white hover:text-encre transition-all flex items-center gap-4 shadow-lg active:scale-95 disabled:opacity-50 disabled:pointer-events-none group"
                                    >
                                        {loading ? <Loader className="animate-spin" size={18} /> : (
                                            <>
                                                Valider la Commande <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                            </>
                                        )}
                                    </button>
                                </div>

                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}
