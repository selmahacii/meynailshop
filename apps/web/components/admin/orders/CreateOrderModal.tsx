'use client';

import { useState, useEffect } from 'react';
import {
    X,
    Search,
    Plus,
    Minus,
    Trash2,
    Instagram,
    MessageCircle,
    Store,
    Globe,
    User,
    MapPin,
    Phone,
    Check,
    Loader,
    Building2,
    Truck
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { StoreAPI, OrdersAPI } from '@/lib/api/client';
import { SHIPPING_RATES } from '@/lib/constants/shipping';
import { toast } from 'sonner';

interface CreateOrderModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

const sources = [
    { id: 'facebook', name: 'Facebook', icon: Globe },
    { id: 'instagram', name: 'Instagram', icon: Instagram },
    { id: 'whatsapp', name: 'WhatsApp', icon: MessageCircle },
    { id: 'tiktok', name: 'TikTok', icon: Globe }, // TikTok can use Globe or a custom icon
    { id: 'phone', name: 'Appel Direct', icon: Phone },
];

export default function CreateOrderModal({ isOpen, onClose, onSuccess }: CreateOrderModalProps) {
    const [loading, setLoading] = useState(false);
    const [searching, setSearching] = useState(false);
    const [query, setQuery] = useState('');
    const [searchResults, setSearchResults] = useState<any[]>([]);

    const [formData, setFormData] = useState({
        source: 'facebook',
        deliveryType: 'home' as 'home' | 'office',
        customer: {
            firstName: '',
            lastName: '',
            phone: '',
            wilaya: '',
            address: '',
        },
        items: [] as any[],
        shippingCost: 700,
        discount: 0,
        notes: '',
    });

    useEffect(() => {
        const fetchSearchResults = async () => {
            setSearching(true);
            try {
                const res = await StoreAPI.getProducts(1, 100, { search: query });
                if (res.success) {
                    const items = res.data?.items || (Array.isArray(res.data) ? res.data : []);
                    setSearchResults(items);
                }
            } catch (error) {
                console.error('Search failed:', error);
            } finally {
                setSearching(false);
            }
        };

        const timer = setTimeout(fetchSearchResults, query.length > 0 ? 300 : 0);
        return () => clearTimeout(timer);
    }, [query]);

    // Grouping results by category for "Menu Roulant"
    const groupedResults = searchResults.reduce((acc: Record<string, any[]>, p) => {
        const catName = p.category?.name || 'Sans Catégorie';
        if (!acc[catName]) acc[catName] = [];
        acc[catName].push(p);
        return acc;
    }, {});

    useEffect(() => {
        if (!formData.customer.wilaya) return;
        const rate = SHIPPING_RATES.find(r => r.name === formData.customer.wilaya);
        if (rate) {
            setFormData(prev => ({
                ...prev,
                shippingCost: formData.deliveryType === 'home' ? (rate.homeRate || 700) : (rate.deskRate || 400)
            }));
        }
    }, [formData.customer.wilaya, formData.deliveryType]);

    const addItem = (product: any, variant?: any, quantity: number = 1) => {
        setFormData(prev => {
            const existingIndex = prev.items.findIndex(i => 
                i.productId === product.id && i.variantSku === (variant?.sku || undefined)
            );

            if (existingIndex > -1) {
                const newItems = [...prev.items];
                newItems[existingIndex].quantity += quantity;
                return { ...prev, items: newItems };
            }

            const newItem = {
                productId: product.id,
                name: product.name,
                unitPrice: product.price,
                quantity: quantity,
                variantSku: variant?.sku || undefined,
                image: variant?.image || product.images?.[0] || ''
            };
            return { ...prev, items: [...prev.items, newItem] };
        });
        toast.info(`${product.name} ajouté au panier`);
    };

    const updateQuantity = (index: number, delta: number) => {
        setFormData(prev => {
            const newItems = [...prev.items];
            newItems[index].quantity = Math.max(1, newItems[index].quantity + delta);
            return { ...prev, items: newItems };
        });
    };

    const removeItem = (index: number) => {
        setFormData(prev => ({
            ...prev,
            items: prev.items.filter((_, i) => i !== index)
        }));
    };

    const subtotal = formData.items.reduce((sum, i) => sum + (i.unitPrice * i.quantity), 0);
    const total = subtotal + formData.shippingCost;

    const handleSubmit = async () => {
        if (!formData.customer.firstName || !formData.customer.phone || formData.items.length === 0) {
            toast.error("Veuillez remplir les informations client et ajouter des produits");
            return;
        }

        setLoading(true);
        try {
            const res = await OrdersAPI.createManual({
                ...formData,
                subtotal,
                total
            });
            if (res.success) {
                toast.success("Commande enregistrée !");
                onSuccess();
                onClose();
            } else {
                toast.error(res.error || "Erreur lors de la création");
            }
        } catch (err) {
            toast.error("Une erreur réseau est survenue");
        } finally {
            setLoading(false);
        }
    };

    const renderProductCard = (p: any) => (
        <div key={p.id} className="bg-white border-b border-creme2 hover:bg-creme/10 transition-colors group">
            <div className="flex items-center justify-between p-2.5 gap-4">
                <div className="flex items-center gap-3 min-w-0 flex-grow">
                    <div className="w-8 h-8 bg-creme2 overflow-hidden flex-shrink-0 rounded-sm border border-creme2">
                        <img src={p.images?.[0]} alt="" className="w-full h-full object-cover" />
                    </div>
                    <div className="min-w-0">
                        <div className="flex items-center gap-2">
                            <p className="text-[10px] font-black uppercase text-encre truncate">{p.name}</p>
                            <span className={cn(
                                "text-[7px] px-1.5 py-0.5 rounded-full font-black uppercase tracking-tighter",
                                p.stock > 10 ? "bg-emerald-100 text-emerald-700" : p.stock > 0 ? "bg-or/20 text-or" : "bg-rouge-brand/10 text-rouge-brand"
                            )}>
                                {p.stock > 0 ? `${p.stock} en stock` : 'Rupture'}
                            </span>
                        </div>
                        <p className="text-[9px] font-bold text-or">{p.price} DA <span className="text-encre3 font-normal ml-2">SKU: {p.sku || 'N/A'}</span></p>
                    </div>
                </div>
                {!p.variants?.length && (
                    <button
                        onClick={() => addItem(p)}
                        className="px-3 py-1.5 bg-encre text-white hover:bg-or text-[9px] font-black uppercase tracking-widest rounded-sm transition-all shadow-sm active:scale-95"
                    >
                        AJOUTER
                    </button>
                )}
            </div>

            {p.variants && p.variants.length > 0 && (
                <div className="px-10 pb-2 flex flex-wrap gap-2">
                    {p.variants.map((v: any) => (
                        <button 
                            key={v.sku} 
                            onClick={() => addItem(p, v)}
                            className="flex items-center gap-2 px-2 py-1 bg-white border border-creme2 rounded-sm hover:border-or transition-all group/v"
                        >
                            <span className="text-[8px] font-black text-encre3 uppercase tracking-tighter group-hover/v:text-or">{v.sku}</span>
                            <div className="w-px h-2 bg-creme2" />
                            <span className="text-[8px] font-bold text-encre">{v.stock || 0}</span>
                            <Plus size={8} className="text-or" />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-encre/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white w-full max-w-6xl max-h-[95vh] rounded-sm shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-300">
                {/* Header */}
                <div className="p-6 border-b border-creme2 flex items-center justify-between sticky top-0 bg-white z-20">
                    <div>
                        <h2 className="text-xl font-serif text-encre">Nouvelle Commande</h2>
                        <p className="text-[10px] font-black uppercase tracking-widest text-encre3 mt-1 underline decoration-or decoration-2">Enregistrement Multi-Canal</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-creme rounded-full transition-colors">
                        <X size={20} className="text-encre3" />
                    </button>
                </div>

                <div className="flex-grow overflow-y-auto p-6 lg:p-10 custom-scrollbar bg-[#FAFAFA]">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                        {/* Left Column: Product Picker (Col 7) */}
                        <div className="lg:col-span-7 space-y-8">
                            <div className="bg-white p-6 rounded-sm border border-creme2 shadow-sm">
                                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-encre mb-6 flex items-center gap-2">
                                    <span className="w-6 h-6 bg-or text-white rounded-full flex items-center justify-center text-[10px]">1</span>
                                    Catalogue Produits
                                </h3>

                                <div className="relative mb-6">
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-encre3" size={18} />
                                    <input
                                        type="text"
                                        placeholder="Chercher par nom, SKU..."
                                        className="w-full pl-12 pr-4 h-14 bg-creme2/5 border border-creme2 rounded-sm focus:outline-none focus:border-or transition-all text-sm font-medium"
                                        value={query}
                                        onChange={(e) => setQuery(e.target.value)}
                                    />
                                    {searching && <Loader className="absolute right-4 top-1/2 -translate-y-1/2 animate-spin text-or" size={18} />}
                                </div>

                                <div className="max-h-[600px] overflow-y-auto pr-2 custom-scrollbar border border-creme2 rounded-sm bg-white">
                                    {query.length > 0 ? (
                                        /* SEARCH MODE: Flat list of results ordered by relevance */
                                        <div className="divide-y divide-creme2">
                                            <div className="bg-creme2/10 px-4 py-2 border-b border-creme2/50 sticky top-0 bg-white z-10">
                                                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-or">
                                                    Résultats pour "{query}" — {searchResults.length} items trouvés
                                                </p>
                                            </div>
                                            <div className="divide-y divide-creme2">
                                                {searchResults.map(p => renderProductCard(p))}
                                            </div>
                                            {searchResults.length === 0 && !searching && (
                                                <div className="py-20 text-center">
                                                    <p className="text-xs font-serif italic text-encre3">Aucun produit ne correspond à "{query}"</p>
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        /* BROWSING MODE: Grouped by Categories (Menu Roulant) */
                                        <div className="divide-y divide-creme2">
                                            {Object.keys(groupedResults).length > 0 ? (
                                                Object.entries(groupedResults).map(([catName, products]) => (
                                                    <div key={catName}>
                                                        <h4 className="text-[9px] font-black uppercase tracking-[0.3em] text-encre3 bg-creme2/5 px-4 py-2 sticky top-0 bg-white z-10 border-b border-creme2/50">
                                                            {catName}
                                                        </h4>
                                                        <div className="divide-y divide-creme2/30">
                                                            {products.map(p => renderProductCard(p))}
                                                        </div>
                                                    </div>
                                                ))
                                            ) : (
                                                !searching && (
                                                    <div className="py-20 text-center">
                                                        <Loader className="animate-spin mx-auto text-or mb-2" size={20} />
                                                        <p className="text-xs font-serif italic text-encre3">Chargement du catalogue...</p>
                                                    </div>
                                                )
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Checkout & Info (Col 5) */}
                        <div className="lg:col-span-5 space-y-6">
                            {/* Section 2: Selected Items */}
                            <div className="bg-white p-6 rounded-sm border border-creme2 shadow-sm">
                                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-encre mb-4 flex items-center gap-2">
                                    <span className="w-5 h-5 bg-encre text-white rounded-full flex items-center justify-center text-[9px]">2</span>
                                    Panier en cours
                                </h3>
                                {formData.items.length > 0 ? (
                                    <div className="space-y-4">
                                        <div className="divide-y divide-creme2 max-h-[250px] overflow-y-auto pr-2 custom-scrollbar">
                                            {formData.items.map((item, idx) => (
                                                <div key={idx} className="py-3 flex items-center justify-between gap-4">
                                                    <div className="flex items-center gap-3 flex-grow min-w-0">
                                                        <div className="min-w-0">
                                                            <p className="text-[10px] font-black uppercase text-encre truncate">{item.name}</p>
                                                            {item.variantSku && <p className="text-[8px] font-black text-or uppercase tracking-tighter">{item.variantSku}</p>}
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                        <div className="flex items-center bg-creme2/20 rounded-sm p-0.5 border border-creme2">
                                                            <button onClick={() => updateQuantity(idx, -1)} className="p-1 hover:text-or transition-colors"><Minus size={10} /></button>
                                                            <span className="w-6 text-center text-[10px] font-black">{item.quantity}</span>
                                                            <button onClick={() => updateQuantity(idx, 1)} className="p-1 hover:text-or transition-colors"><Plus size={10} /></button>
                                                        </div>
                                                        <span className="text-[10px] font-black w-16 text-right">{(item.unitPrice * item.quantity).toFixed(0)} DA</span>
                                                        <button onClick={() => removeItem(idx)} className="text-rouge-brand hover:scale-110 transition-transform"><X size={14} /></button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ) : (
                                    <p className="text-[9px] text-center italic text-encre3 py-4 border border-dashed border-creme2">Le panier est vide</p>
                                )}
                            </div>

                            {/* Section 3: Delivery Details */}
                            <div className="bg-white p-6 rounded-sm border border-creme2 shadow-sm">
                                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-encre mb-6 flex items-center gap-2">
                                    <span className="w-5 h-5 bg-or text-white rounded-full flex items-center justify-center text-[9px]">3</span>
                                    Fiche Client & Logistique
                                </h3>

                                <div className="space-y-4">
                                    {/* Multi-Channel Icons */}
                                    <div className="grid grid-cols-5 gap-1.5 p-1 bg-creme2/10 rounded-sm border border-creme2">
                                        {sources.map(s => {
                                            const Icon = s.icon;
                                            return (
                                                <button
                                                    key={s.id}
                                                    onClick={() => setFormData(p => ({ ...p, source: s.id }))}
                                                    className={cn(
                                                        "flex flex-col items-center gap-1.5 py-2 px-1 rounded-sm transition-all",
                                                        formData.source === s.id ? "bg-encre text-white shadow-md" : "text-encre3 hover:bg-white"
                                                    )}
                                                >
                                                    <Icon size={14} />
                                                    <span className="text-[7px] font-black uppercase">{s.name.split(' ')[0]}</span>
                                                </button>
                                            );
                                        })}
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="space-y-1">
                                            <label className="text-[8px] font-black uppercase tracking-widest text-encre3 ml-1">Prénom *</label>
                                            <input 
                                                className="w-full h-9 px-3 bg-white border border-creme2 rounded-sm text-[11px] font-bold focus:border-or outline-none"
                                                value={formData.customer.firstName}
                                                onChange={e => setFormData(p => ({ ...p, customer: { ...p.customer, firstName: e.target.value }}))}
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[8px] font-black uppercase tracking-widest text-encre3 ml-1">Nom</label>
                                            <input 
                                                className="w-full h-9 px-3 bg-white border border-creme2 rounded-sm text-[11px] font-bold focus:border-or outline-none"
                                                value={formData.customer.lastName}
                                                onChange={e => setFormData(p => ({ ...p, customer: { ...p.customer, lastName: e.target.value }}))}
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-12 gap-3">
                                        <div className="col-span-12 space-y-1">
                                            <label className="text-[8px] font-black uppercase tracking-widest text-encre3 ml-1">Téléphone *</label>
                                            <input 
                                                className="w-full h-9 px-3 bg-white border border-creme2 rounded-sm text-[11px] font-black focus:border-or outline-none font-mono"
                                                value={formData.customer.phone}
                                                placeholder="0X XX XX XX XX"
                                                onChange={e => setFormData(p => ({ ...p, customer: { ...p.customer, phone: e.target.value }}))}
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="space-y-1">
                                            <label className="text-[8px] font-black uppercase tracking-widest text-encre3 ml-1">Wilaya</label>
                                            <select 
                                                className="w-full h-10 px-3 bg-white border border-creme2 rounded-sm text-[11px] font-bold focus:border-or outline-none"
                                                value={formData.customer.wilaya}
                                                onChange={e => setFormData(p => ({ ...p, customer: { ...p.customer, wilaya: e.target.value }}))}
                                            >
                                                <option value="">Sélectionner</option>
                                                {SHIPPING_RATES.map(r => <option key={r.name} value={r.name}>{r.name}</option>)}
                                            </select>
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[8px] font-black uppercase tracking-widest text-encre3 ml-1">Type Livraison</label>
                                            <div className="flex h-10 bg-creme2/20 rounded-sm border border-creme2 p-0.5">
                                                <button 
                                                    onClick={() => setFormData(p => ({ ...p, deliveryType: 'office' }))}
                                                    className={cn("flex-1 rounded-[2px] transition-all flex items-center justify-center", formData.deliveryType === 'office' ? "bg-white text-encre shadow-sm" : "text-encre3")}
                                                >
                                                    <Building2 size={12} />
                                                </button>
                                                <button 
                                                    onClick={() => setFormData(p => ({ ...p, deliveryType: 'home' }))}
                                                    className={cn("flex-1 rounded-[2px] transition-all flex items-center justify-center", formData.deliveryType === 'home' ? "bg-white text-encre shadow-sm" : "text-encre3")}
                                                >
                                                    <Truck size={12} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-[8px] font-black uppercase tracking-widest text-encre3 ml-1">Adresse</label>
                                        <input 
                                            className="w-full h-9 px-3 bg-white border border-creme2 rounded-sm text-[11px] focus:border-or outline-none"
                                            value={formData.customer.address}
                                            onChange={e => setFormData(p => ({ ...p, customer: { ...p.customer, address: e.target.value }}))}
                                        />
                                    </div>

                                    {/* Totals & Submit */}
                                    <div className="pt-4 border-t border-creme2 space-y-3">
                                        <div className="flex justify-between items-center text-[10px]">
                                            <span className="font-black uppercase tracking-widest text-encre3">Sous-total</span>
                                            <span className="font-black">{subtotal.toFixed(0)} DA</span>
                                        </div>
                                        <div className="flex justify-between items-center text-[10px]">
                                            <span className="font-black uppercase tracking-widest text-encre3">Livraison</span>
                                            <input 
                                                type="number"
                                                className="w-20 h-7 text-right bg-white border border-creme2 rounded-sm text-[10px] font-black outline-none focus:border-or"
                                                value={formData.shippingCost}
                                                onChange={e => setFormData(p => ({ ...p, shippingCost: Number(e.target.value) }))}
                                            />
                                        </div>
                                        <div className="flex justify-between items-center text-[10px]">
                                            <span className="font-black uppercase tracking-widest text-rouge-brand">Réduction (Remise)</span>
                                            <input 
                                                type="number"
                                                className="w-20 h-7 text-right bg-rouge-brand/5 border border-rouge-brand/20 rounded-sm text-[10px] font-black text-rouge-brand outline-none focus:border-rouge-brand"
                                                value={formData.discount}
                                                onChange={e => setFormData(p => ({ ...p, discount: Number(e.target.value) }))}
                                            />
                                        </div>
                                        
                                        <div className="flex items-center justify-between bg-encre p-4 rounded-sm shadow-lg mt-4">
                                            <div>
                                                <p className="text-[8px] font-black uppercase tracking-widest text-or/60">À Encaisser</p>
                                                <p className="text-2xl font-black text-white">{(subtotal + formData.shippingCost - formData.discount).toFixed(0)} DA</p>
                                            </div>
                                            <button
                                                onClick={handleSubmit}
                                                disabled={loading || formData.items.length === 0}
                                                className="h-12 px-6 bg-or text-white text-[9px] font-black uppercase tracking-[0.2em] rounded-sm hover:bg-white hover:text-encre transition-all active:scale-95 flex items-center gap-2"
                                            >
                                                {loading ? <Loader className="animate-spin" size={12} /> : null}
                                                CRÉER COMMANDE
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
