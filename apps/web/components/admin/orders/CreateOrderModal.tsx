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
    Loader
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
    { id: 'instagram', name: 'Instagram', icon: Instagram, color: 'text-pink-600 bg-pink-50' },
    { id: 'whatsapp', name: 'WhatsApp', icon: MessageCircle, color: 'text-emerald-600 bg-emerald-50' },
    { id: 'facebook', name: 'Facebook', icon: Globe, color: 'text-blue-600 bg-blue-50' },
    { id: 'store', name: 'Boutique / Physique', icon: Store, color: 'text-encre bg-creme2' },
    { id: 'other', name: 'Autre', icon: Plus, color: 'text-encre3 bg-creme' },
];

export default function CreateOrderModal({ isOpen, onClose, onSuccess }: CreateOrderModalProps) {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [searching, setSearching] = useState(false);
    const [query, setQuery] = useState('');
    const [searchResults, setSearchResults] = useState<any[]>([]);

    const [formData, setFormData] = useState({
        source: 'instagram',
        deliveryType: 'home',
        customer: {
            firstName: '',
            lastName: '',
            phone: '',
            wilaya: '',
            address: '',
        },
        items: [] as any[],
        shippingCost: 700,
        returnCost: 200,
        notes: '',
    });

    useEffect(() => {
        if (query.length > 2) {
            const timer = setTimeout(async () => {
                setSearching(true);
                try {
                    const res = await StoreAPI.getProducts(1, 10, { search: query });
                    if (res.success) setSearchResults(res.data.data);
                } finally {
                    setSearching(false);
                }
            }, 500);
            return () => clearTimeout(timer);
        } else {
            setSearchResults([]);
        }
    }, [query]);

    useEffect(() => {
        const rate = SHIPPING_RATES.find(r => r.name === formData.customer.wilaya);
        if (rate) {
            setFormData(prev => ({
                ...prev,
                shippingCost: formData.deliveryType === 'home' ? rate.homeRate : rate.deskRate,
                returnCost: rate.returnRate
            }));
        }
    }, [formData.customer.wilaya, formData.deliveryType]);

    const addItem = (product: any, variant?: any) => {
        const itemKey = variant ? `${product.id}-${variant.sku}` : product.id;
        const existing = formData.items.find(i => (i.variantSku === variant?.sku && i.productId === product.id) || (i.productId === product.id && !variant && !i.variantSku));
        
        if (existing) {
            setFormData(prev => ({
                ...prev,
                items: prev.items.map(i => {
                    const match = variant ? (i.productId === product.id && i.variantSku === variant.sku) : (i.productId === product.id && !i.variantSku);
                    return match ? { ...i, quantity: i.quantity + 1 } : i;
                })
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                items: [...prev.items, {
                    productId: product.id,
                    name: product.name,
                    unitPrice: product.price,
                    quantity: 1,
                    productSku: product.sku,
                    variantSku: variant?.sku,
                    variantImage: variant?.image,
                    image: variant?.image || product.images?.[0] || ''
                }]
            }));
        }
        toast.info(`${product.name} ${variant ? `(${variant.sku})` : ''} ajouté`);
    };

    const removeItem = (productId: string, variantSku?: string) => {
        setFormData(prev => ({ 
            ...prev, 
            items: prev.items.filter(i => !(i.productId === productId && i.variantSku === variantSku)) 
        }));
    };

    const subtotal = formData.items.reduce((sum, i) => sum + (i.unitPrice * i.quantity), 0);
    const total = subtotal + formData.shippingCost;

    const handleSubmit = async () => {
        if (!formData.customer.firstName || !formData.customer.phone || formData.items.length === 0) {
            toast.error("Veuillez remplir les champs obligatoires et ajouter au moins un produit");
            return;
        }

        setLoading(true);
        try {
            const res = await OrdersAPI.createManual({
                ...formData,
                subtotal,
            });
            if (res.success) {
                toast.success("Commande enregistrée avec succès");
                onSuccess();
                onClose();
            } else {
                toast.error(res.error || "Erreur lors de la création");
            }
        } catch (err) {
            toast.error("Une erreur est survenue");
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-encre/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white w-full max-w-4xl max-h-[90vh] rounded-sm shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-300">
                {/* Header */}
                <div className="p-6 border-b border-creme2 flex items-center justify-between bg-white sticky top-0 z-10">
                    <div>
                        <h2 className="text-xl font-serif text-encre">Nouvelle Commande Manuelle</h2>
                        <p className="text-[10px] font-black uppercase tracking-widest text-encre3 mt-1 underline decoration-or underline-offset-4 decoration-2">Enregistrement multi-canal</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-creme rounded-full transition-colors">
                        <X size={20} className="text-encre3" />
                    </button>
                </div>

                <div className="flex-grow overflow-y-auto p-8 custom-scrollbar">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                        {/* Right: Items Selection */}
                        <div className="lg:col-span-12 mb-8">
                            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-encre mb-6 flex items-center gap-2">
                                <span className="p-1 px-2.5 bg-or text-white rounded-full">1</span>
                                Sélection des produits
                            </h3>

                            <div className="relative mb-6">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-encre3" size={18} />
                                <input
                                    type="text"
                                    placeholder="Rechercher un produit (min 3 lettres)..."
                                    className="w-full pl-12 pr-4 h-14 bg-creme/20 border border-creme2 rounded-sm focus:outline-none focus:border-or transition-all text-sm font-medium"
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                />
                                {searching && <Loader className="absolute right-4 top-1/2 -translate-y-1/2 animate-spin text-or" size={18} />}
                            </div>

                            {searchResults.length > 0 && (
                                <div className="mb-8 grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 bg-[#FAF9F6] border border-creme2 rounded-sm animate-in slide-in-from-top-2">
                                    {searchResults.map(p => (
                                        <div key={p.id} className="bg-white border border-creme2 rounded-sm overflow-hidden flex flex-col">
                                            <div className="flex items-center justify-between p-3 border-b border-creme2/50 hover:bg-creme/10 transition-colors group">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-12 h-12 bg-creme2 overflow-hidden flex-shrink-0">
                                                        <img src={p.images?.[0]} alt="" className="w-full h-full object-cover" />
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="text-xs font-bold text-encre truncate">{p.name}</p>
                                                        <p className="text-[10px] font-black text-or">{p.price} DA</p>
                                                    </div>
                                                </div>
                                                {!p.references?.length ? (
                                                    <button
                                                        onClick={() => addItem(p)}
                                                        className="p-2 bg-encre text-white hover:bg-rouge-deep transition-colors"
                                                    >
                                                        <Plus size={14} />
                                                    </button>
                                                ) : (
                                                    <span className="text-[8px] font-black uppercase tracking-widest text-encre3 bg-creme2 px-2 py-1 rounded-sm">Voir Refs</span>
                                                )}
                                            </div>

                                            {p.references?.length > 0 && (
                                                <div className="p-2 bg-creme/5 space-y-2">
                                                    {p.references.map((ref: any, idx: number) => (
                                                        <div key={ref.sku || idx} className="flex items-center justify-between p-2 bg-white/50 border border-dotted border-creme2 rounded-sm">
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-8 h-8 rounded-full overflow-hidden border border-creme2">
                                                                    <img src={ref.image} alt="" className="w-full h-full object-cover" />
                                                                </div>
                                                                <span className="text-[10px] font-bold text-encre3 font-mono">{ref.sku}</span>
                                                            </div>
                                                            <button 
                                                                onClick={() => addItem(p, ref)}
                                                                className="p-1.5 bg-or text-white rounded-sm hover:bg-encre transition-colors shadow-sm"
                                                            >
                                                                <Plus size={12} />
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}

                            {formData.items.length > 0 ? (
                                <div className="border border-creme2 rounded-sm overflow-hidden mb-12">
                                    <table className="w-full text-left">
                                        <thead className="bg-[#FAF9F6] text-[9px] font-black uppercase tracking-widest text-encre3 border-b border-creme2">
                                            <tr>
                                                <th className="px-4 py-3">Produit</th>
                                                <th className="px-4 py-3">Prix</th>
                                                <th className="px-4 py-3">Qté</th>
                                                <th className="px-4 py-3">Total</th>
                                                <th className="px-4 py-3 text-right"></th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-creme2">
                                            {formData.items.map(item => (
                                                <tr key={item.variantSku ? `${item.productId}-${item.variantSku}` : item.productId} className="text-xs hover:bg-creme/5 transition-colors">
                                                    <td className="px-4 py-4">
                                                        <div className="flex items-center gap-3">
                                                            <img src={item.image} className="w-8 h-8 object-cover rounded-sm border border-creme2" />
                                                            <div>
                                                                <p className="font-bold text-encre">{item.name}</p>
                                                                {item.variantSku && (
                                                                    <p className="text-[8px] font-black text-rouge-deep uppercase tracking-widest mt-0.5">Réf: {item.variantSku}</p>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-4">{item.unitPrice} DA</td>
                                                    <td className="px-4 py-4">
                                                        <div className="flex items-center gap-2">
                                                            <button
                                                                onClick={() => {
                                                                    setFormData(prev => ({
                                                                        ...prev,
                                                                        items: prev.items.map(i => (i.productId === item.productId && i.variantSku === item.variantSku) ? { ...i, quantity: Math.max(1, i.quantity - 1) } : i)
                                                                    }));
                                                                }}
                                                                className="p-1 hover:bg-creme rounded transition-colors"
                                                            >
                                                                <Minus size={12} />
                                                            </button>
                                                            <span className="w-6 text-center font-black">{item.quantity}</span>
                                                            <button
                                                                onClick={() => {
                                                                    setFormData(prev => ({
                                                                        ...prev,
                                                                        items: prev.items.map(i => (i.productId === item.productId && i.variantSku === item.variantSku) ? { ...i, quantity: i.quantity + 1 } : i)
                                                                    }));
                                                                }}
                                                                className="p-1 hover:bg-creme rounded transition-colors"
                                                            >
                                                                <Plus size={12} />
                                                            </button>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-4 font-black">{item.unitPrice * item.quantity} DA</td>
                                                    <td className="px-4 py-4 text-right">
                                                        <button onClick={() => removeItem(item.productId, item.variantSku)} className="text-rouge-mid hover:text-black">
                                                            <Trash2 size={14} />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className="py-12 text-center border-2 border-dashed border-creme2 rounded-sm mb-8">
                                    <p className="text-xs font-serif italic text-encre3">Aucun produit sélectionné</p>
                                </div>
                            )}
                        </div>

                        {/* Mid: Customer Info */}
                        <div className="lg:col-span-12 xl:grid xl:grid-cols-2 gap-10">
                            <div>
                                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-encre mb-6 flex items-center gap-2">
                                    <span className="p-1 px-2.5 bg-encre text-white rounded-full">2</span>
                                    Informations Client
                                </h3>
                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-encre3">Prénom *</label>
                                            <input
                                                className="w-full p-3 bg-creme2/20 border border-creme2 rounded-sm focus:border-or outline-none text-sm"
                                                value={formData.customer.firstName}
                                                onChange={e => setFormData(prev => ({ ...prev, customer: { ...prev.customer, firstName: e.target.value } }))}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-encre3">Nom</label>
                                            <input
                                                className="w-full p-3 bg-creme2/20 border border-creme2 rounded-sm focus:border-or outline-none text-sm"
                                                value={formData.customer.lastName}
                                                onChange={e => setFormData(prev => ({ ...prev, customer: { ...prev.customer, lastName: e.target.value } }))}
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-encre3">Téléphone *</label>
                                        <div className="relative">
                                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-encre3" size={14} />
                                            <input
                                                className="w-full pl-10 p-3 bg-creme2/20 border border-creme2 rounded-sm focus:border-or outline-none text-sm"
                                                placeholder="0X XX XX XX XX"
                                                value={formData.customer.phone}
                                                onChange={e => setFormData(prev => ({ ...prev, customer: { ...prev.customer, phone: e.target.value } }))}
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-encre3">Wilaya</label>
                                        <select
                                            className="w-full p-3 bg-creme2/20 border border-creme2 rounded-sm focus:border-or outline-none text-sm font-bold"
                                            value={formData.customer.wilaya}
                                            onChange={e => setFormData(prev => ({ ...prev, customer: { ...prev.customer, wilaya: e.target.value } }))}
                                        >
                                            <option value="">Sélectionner</option>
                                            {SHIPPING_RATES.map(r => <option key={r.id} value={r.name}>{r.name}</option>)}
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-encre3">Adresse complète</label>
                                        <textarea
                                            className="w-full p-3 bg-creme2/20 border border-creme2 rounded-sm focus:border-or outline-none text-sm h-24 resize-none"
                                            value={formData.customer.address}
                                            onChange={e => setFormData(prev => ({ ...prev, customer: { ...prev.customer, address: e.target.value } }))}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-encre mb-6 flex items-center gap-2">
                                    <span className="p-1 px-2.5 bg-encre3 text-white rounded-full">3</span>
                                    Détails Logistiques
                                </h3>
                                <div className="space-y-8">
                                    {/* Source Selection */}
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-encre3">Source de la vente</label>
                                        <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                                            {sources.map(s => {
                                                const Icon = s.icon;
                                                return (
                                                    <button
                                                        key={s.id}
                                                        onClick={() => setFormData(prev => ({ ...prev, source: s.id }))}
                                                        className={cn(
                                                            "flex flex-col items-center gap-2 p-3 rounded-sm border transition-all",
                                                            formData.source === s.id ? "border-or bg-or text-white" : "border-creme2 hover:border-or bg-white text-encre/40"
                                                        )}
                                                    >
                                                        <Icon size={20} />
                                                        <span className="text-[8px] font-black uppercase whitespace-nowrap">{s.name.split(' ')[0]}</span>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    {/* Delivery Method */}
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-encre3">Mode de livraison</label>
                                        <div className="grid grid-cols-2 gap-4">
                                            <button
                                                onClick={() => setFormData(prev => ({ ...prev, deliveryType: 'home' }))}
                                                className={cn(
                                                    "p-4 border text-left rounded-sm transition-all relative overflow-hidden",
                                                    formData.deliveryType === 'home' ? "border-encre bg-encre text-white" : "border-creme2 text-encre3"
                                                )}
                                            >
                                                <p className="text-xs font-black uppercase tracking-widest">À Domicile</p>
                                                <p className="text-[10px] opacity-60 mt-1">Livraison main à main</p>
                                                {formData.deliveryType === 'home' && <Check className="absolute top-2 right-2 text-or" size={14} />}
                                            </button>
                                            <button
                                                onClick={() => setFormData(prev => ({ ...prev, deliveryType: 'office' }))}
                                                className={cn(
                                                    "p-4 border text-left rounded-sm transition-all relative overflow-hidden",
                                                    formData.deliveryType === 'office' ? "border-encre bg-encre text-white" : "border-creme2 text-encre3"
                                                )}
                                            >
                                                <p className="text-xs font-black uppercase tracking-widest">Point Retrait</p>
                                                <p className="text-[10px] opacity-60 mt-1">Yalidine Desk</p>
                                                {formData.deliveryType === 'office' && <Check className="absolute top-2 right-2 text-or" size={14} />}
                                            </button>
                                        </div>
                                    </div>

                                    <div className="p-6 bg-[#FAF9F6] border border-creme2 rounded-sm space-y-4">
                                        <div className="flex justify-between text-xs">
                                            <span className="text-encre3">Sous-total</span>
                                            <span className="font-bold">{subtotal} DA</span>
                                        </div>
                                        <div className="flex justify-between items-center text-xs">
                                            <span className="text-encre3">Livraison</span>
                                            <div className="flex items-center gap-2">
                                                <input
                                                    type="number"
                                                    className="w-20 p-1 text-right bg-white border border-creme2 rounded-sm font-bold"
                                                    value={formData.shippingCost}
                                                    onChange={e => setFormData(prev => ({ ...prev, shippingCost: Number(e.target.value) }))}
                                                />
                                                <span className="font-bold">DA</span>
                                            </div>
                                        </div>
                                        <div className="pt-4 border-t border-creme2 flex justify-between items-end">
                                            <div>
                                                <p className="text-[10px] font-black uppercase tracking-widest text-or">Total Final</p>
                                                <p className="text-2xl font-serif text-encre underline decoration-or decoration-2">{total} DA</p>
                                            </div>
                                            <button
                                                onClick={handleSubmit}
                                                disabled={loading || formData.items.length === 0}
                                                className="px-10 py-4 bg-encre text-creme text-xs font-black uppercase tracking-[0.2em] hover:bg-rouge-deep disabled:opacity-50 transition-all shadow-xl active:scale-95"
                                            >
                                                {loading ? <Loader className="animate-spin mx-auto" size={20} /> : "Enregistrer la vente"}
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
