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
        <div key={p.id} className="bg-white border border-creme2 rounded-sm overflow-hidden flex flex-col hover:border-or transition-all shadow-sm">
            <div className="flex items-center justify-between p-3 border-b border-creme2/50 group">
                <div className="flex items-center gap-3 w-full">
                    <div className="w-10 h-10 bg-creme2 overflow-hidden flex-shrink-0 rounded-sm">
                        <img src={p.images?.[0]} alt="" className="w-full h-full object-cover" />
                    </div>
                    <div className="min-w-0 flex-grow">
                        <p className="text-[11px] font-bold text-encre truncate">{p.name}</p>
                        <p className="text-[10px] font-black text-or">{p.price} DA</p>
                    </div>
                </div>
                {!p.variants?.length && (
                    <button
                        onClick={() => addItem(p)}
                        className="p-2 bg-encre text-white hover:bg-or transition-colors rounded-sm ml-2"
                    >
                        <Plus size={14} />
                    </button>
                )}
            </div>

            {p.variants && p.variants.length > 0 && (
                <div className="p-2 bg-creme/10 space-y-1">
                    {p.variants.map((v: any) => (
                        <div key={v.sku} className="flex items-center justify-between p-1.5 bg-white/50 border border-dotted border-creme2 rounded-sm">
                            <span className="text-[9px] font-bold text-encre3 font-mono truncate mr-2">{v.sku}</span>
                            <button 
                                onClick={() => addItem(p, v)}
                                className="p-1 bg-or/80 text-white rounded-sm hover:bg-encre transition-colors"
                            >
                                <Plus size={10} />
                            </button>
                        </div>
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

                                <div className="max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                                    {Object.keys(groupedResults).length > 0 ? (
                                        <div className="space-y-8">
                                            {Object.entries(groupedResults).map(([catName, products]) => (
                                                <div key={catName} className="space-y-4">
                                                    <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-encre3 bg-creme2/20 px-4 py-2 rounded-sm sticky top-0 bg-white z-10 border-b border-creme2/50">
                                                        {catName}
                                                    </h4>
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                        {products.map(p => renderProductCard(p))}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        !searching && (
                                            <div className="py-20 text-center border-2 border-dashed border-creme2 rounded-sm">
                                                <p className="text-xs font-serif italic text-encre3">Aucun produit trouvé</p>
                                            </div>
                                        )
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Checkout & Info (Col 5) */}
                        <div className="lg:col-span-5 space-y-8">
                            {/* Section 2: Selected Items */}
                            <div className="bg-white p-6 rounded-sm border border-creme2 shadow-sm animate-in slide-in-from-right-4">
                                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-encre mb-6 flex items-center gap-2">
                                    <span className="w-6 h-6 bg-encre text-white rounded-full flex items-center justify-center text-[10px]">2</span>
                                    Panier Client
                                </h3>
                                {formData.items.length > 0 ? (
                                    <div className="space-y-4">
                                        <div className="divide-y divide-creme2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                                            {formData.items.map((item, idx) => (
                                                <div key={idx} className="py-3 flex items-center justify-between gap-4">
                                                    <div className="flex items-center gap-3 flex-grow min-w-0">
                                                        <div className="w-10 h-10 rounded border border-creme2 overflow-hidden flex-shrink-0">
                                                            <img src={item.image} className="w-full h-full object-cover" />
                                                        </div>
                                                        <div className="min-w-0">
                                                            <p className="text-[11px] font-bold text-encre truncate">{item.name}</p>
                                                            {item.variantSku && <p className="text-[9px] font-black text-or uppercase">{item.variantSku}</p>}
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                        <div className="flex items-center bg-creme2/20 rounded-sm p-1">
                                                            <button onClick={() => updateQuantity(idx, -1)} className="p-1 hover:text-or"><Minus size={10} /></button>
                                                            <span className="w-6 text-center text-xs font-black">{item.quantity}</span>
                                                            <button onClick={() => updateQuantity(idx, 1)} className="p-1 hover:text-or"><Plus size={10} /></button>
                                                        </div>
                                                        <button onClick={() => removeItem(idx)} className="text-rouge-brand hover:scale-110 transition-transform"><X size={16} /></button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="pt-4 border-t border-creme2 flex justify-between items-center text-encre">
                                            <span className="text-[10px] font-black uppercase tracking-widest text-encre3">Sous-total</span>
                                            <span className="text-lg font-black">{subtotal.toFixed(0)} DA</span>
                                        </div>
                                    </div>
                                ) : (
                                    <p className="text-[10px] text-center italic text-encre3 py-4">Le panier est vide</p>
                                )}
                            </div>

                            {/* Section 3: Delivery Details */}
                            <div className="bg-white p-6 rounded-sm border border-creme2 shadow-sm">
                                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-encre mb-6 flex items-center gap-2">
                                    <span className="w-6 h-6 bg-or text-white rounded-full flex items-center justify-center text-[10px]">3</span>
                                    Logistique & Client
                                </h3>

                                <div className="space-y-6">
                                    {/* Multi-Channel Icons */}
                                    <div className="grid grid-cols-5 gap-2">
                                        {sources.map(s => {
                                            const Icon = s.icon;
                                            return (
                                                <button
                                                    key={s.id}
                                                    onClick={() => setFormData(p => ({ ...p, source: s.id }))}
                                                    className={cn(
                                                        "flex flex-col items-center gap-2 p-3 rounded-sm border transition-all",
                                                        formData.source === s.id ? "border-encre bg-encre text-white" : "border-creme2 bg-white text-encre3 hover:border-or"
                                                    )}
                                                >
                                                    <Icon size={16} />
                                                    <span className="text-[8px] font-black uppercase">{s.name.split(' ')[0]}</span>
                                                </button>
                                            );
                                        })}
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <label className="text-[9px] font-black uppercase tracking-widest text-encre3 ml-1">Prénom</label>
                                            <input 
                                                className="w-full h-10 px-4 bg-creme/5 border border-creme2 rounded-sm text-xs focus:border-or outline-none"
                                                value={formData.customer.firstName}
                                                onChange={e => setFormData(p => ({ ...p, customer: { ...p.customer, firstName: e.target.value }}))}
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[9px] font-black uppercase tracking-widest text-encre3 ml-1">Nom</label>
                                            <input 
                                                className="w-full h-10 px-4 bg-creme/5 border border-creme2 rounded-sm text-xs focus:border-or outline-none"
                                                value={formData.customer.lastName}
                                                onChange={e => setFormData(p => ({ ...p, customer: { ...p.customer, lastName: e.target.value }}))}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-[9px] font-black uppercase tracking-widest text-encre3 ml-1">Téléphone</label>
                                        <input 
                                            className="w-full h-10 px-4 bg-creme/5 border border-creme2 rounded-sm text-xs focus:border-or outline-none font-mono"
                                            value={formData.customer.phone}
                                            placeholder="0X XX XX XX XX"
                                            onChange={e => setFormData(p => ({ ...p, customer: { ...p.customer, phone: e.target.value }}))}
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <label className="text-[9px] font-black uppercase tracking-widest text-encre3 ml-1">Wilaya</label>
                                            <select 
                                                className="w-full h-10 px-4 bg-creme/5 border border-creme2 rounded-sm text-xs focus:border-or outline-none"
                                                value={formData.customer.wilaya}
                                                onChange={e => setFormData(p => ({ ...p, customer: { ...p.customer, wilaya: e.target.value }}))}
                                            >
                                                <option value="">Sélectionner</option>
                                                {SHIPPING_RATES.map(r => <option key={r.name} value={r.name}>{r.name}</option>)}
                                            </select>
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[9px] font-black uppercase tracking-widest text-encre3 ml-1">Livraison</label>
                                            <div className="flex h-10 bg-creme2/20 rounded-sm border border-creme2 p-0.5">
                                                <button 
                                                    onClick={() => setFormData(p => ({ ...p, deliveryType: 'office' }))}
                                                    className={cn("flex-1 rounded-[2px] transition-all", formData.deliveryType === 'office' ? "bg-white text-encre shadow-sm" : "text-encre3")}
                                                >
                                                    <Building2 size={12} className="mx-auto" />
                                                </button>
                                                <button 
                                                    onClick={() => setFormData(p => ({ ...p, deliveryType: 'home' }))}
                                                    className={cn("flex-1 rounded-[2px] transition-all", formData.deliveryType === 'home' ? "bg-white text-encre shadow-sm" : "text-encre3")}
                                                >
                                                    <Truck size={12} className="mx-auto" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-[9px] font-black uppercase tracking-widest text-encre3 ml-1">Adresse</label>
                                        <input 
                                            className="w-full h-10 px-4 bg-creme/5 border border-creme2 rounded-sm text-xs focus:border-or outline-none"
                                            value={formData.customer.address}
                                            onChange={e => setFormData(p => ({ ...p, customer: { ...p.customer, address: e.target.value }}))}
                                        />
                                    </div>

                                    {/* Totals & Submit */}
                                    <div className="pt-6 border-t border-creme2 space-y-4">
                                        <div className="flex justify-between items-center bg-[#FAF9F6] p-4 border border-creme2 rounded-sm">
                                            <div>
                                                <p className="text-[10px] font-black uppercase tracking-widest text-or">Total à encaisser</p>
                                                <p className="text-3xl font-black text-encre">{(subtotal + formData.shippingCost).toFixed(0)} <span className="text-sm">DA</span></p>
                                            </div>
                                            <button
                                                onClick={handleSubmit}
                                                disabled={loading || formData.items.length === 0}
                                                className="h-14 px-8 bg-encre text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-sm hover:bg-or transition-all shadow-xl active:scale-95 flex items-center gap-3"
                                            >
                                                {loading ? <Loader className="animate-spin" size={16} /> : "VALIDER VENTE"}
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
