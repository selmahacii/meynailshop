'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
    ArrowLeft,
    Save,
    Image as ImageIcon,
    Loader,
    Package,
    Tag,
    BarChart3,
    Plus,
    X,
    Layers
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { ProductsAPI, UploadAPI, apiFetch, API_ENDPOINTS } from '@/lib/api/client';
import { toast } from 'sonner';

interface Category {
    id: string;
    name: string;
    slug: string;
    subCategories?: {
        id: string;
        name: string;
        slug: string;
    }[];
}

export default function ProductCreatePage() {
    const router = useRouter();
    const [saving, setSaving] = useState(false);
    const [categories, setCategories] = useState<Category[]>([]);
    const [product, setProduct] = useState<any>({
        name: '',
        sku: '',
        price: '',
        stock: '',
        stockAlert: '5',
        description: '',
        shortDescription: '',
        categoryId: '',
        subCategoryId: '',
        isActive: true,
        images: [],
        comparePrice: '',
        badge: null,
        hasVariants: false,
        variants: [],
    });
    const [uploading, setUploading] = useState(false);
    const [loadingCategories, setLoadingCategories] = useState(true);

    useEffect(() => {
        // Fetch real categories with UUIDs from the API
        apiFetch(API_ENDPOINTS.STORE_CATEGORIES)
            .then(res => {
                const cats = res.data || [];
                setCategories(cats);
                // Pre-select first category if none selected
                if (cats.length > 0) {
                    setProduct((prev: any) => ({ ...prev, categoryId: prev.categoryId || cats[0].id }));
                }
            })
            .catch(() => {
                toast.error('Impossible de charger les catégories');
            })
            .finally(() => setLoadingCategories(false));
    }, []);

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            setUploading(true);
            const result = await UploadAPI.uploadProductImage(file);
            if (result.success) {
                const url = result.data.url;
                setProduct((prev: any) => ({
                    ...prev,
                    images: [...prev.images, url]
                }));
                toast.success('Image uploadée avec succès');
            } else {
                toast.error(result.error || 'Erreur lors de l\'upload');
            }
        } catch (err) {
            toast.error('Erreur technique lors de l\'upload');
        } finally {
            setUploading(false);
            // Reset input
            e.target.value = '';
        }
    };

    const handleVariantImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, variantIndex: number) => {
        const file = e.target.files?.[0];
        if (!file) return;
        try {
            setUploading(true);
            const result = await UploadAPI.uploadProductImage(file);
            if (result.success) {
                const url = result.data.url;
                const newVariants = [...product.variants];
                newVariants[variantIndex] = { ...newVariants[variantIndex], image: url };
                setProduct((prev: any) => ({ ...prev, variants: newVariants }));
                toast.success('Image de variante uploadée');
            } else {
                toast.error(result.error || 'Erreur lors de l\'upload');
            }
        } catch (err) {
            toast.error('Erreur technique lors de l\'upload');
        } finally {
            setUploading(false);
            e.target.value = '';
        }
    };

    const addVariant = () => {
        setProduct((prev: any) => ({
            ...prev,
            variants: [...prev.variants, { sku: '', image: '' }]
        }));
    };

    const removeVariant = (index: number) => {
        setProduct((prev: any) => ({
            ...prev,
            variants: prev.variants.filter((_: any, i: number) => i !== index)
        }));
    };

    const updateVariant = (index: number, field: string, value: string) => {
        const newVariants = [...product.variants];
        newVariants[index] = { ...newVariants[index], [field]: value };
        setProduct((prev: any) => ({ ...prev, variants: newVariants }));
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!product.categoryId) {
            toast.error('Veuillez sélectionner une catégorie');
            return;
        }
        try {
            setSaving(true);
            
            // LOGIC: users enters Original Price (Required) and optionally Promo Price.
            // In DB: price = what client pays, comparePrice = original price to cross out.
            const originalPriceVal = Number(product.comparePrice);
            const promoPriceVal = product.price ? Number(product.price) : null;
            
            const sellingPrice = promoPriceVal !== null ? promoPriceVal : originalPriceVal;
            const crossedPrice = promoPriceVal !== null ? originalPriceVal : null;

            const createData = {
                ...product,
                price: sellingPrice,
                comparePrice: crossedPrice,
                costPrice: Number(product.costPrice),
                categoryId: product.categoryId,
                subCategoryId: product.subCategoryId || null,
                badge: product.badge,
                stock: Number(product.stock),
                stockAlert: Number(product.stockAlert),
                slug: product.name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '').replace(/^-+|-+$/g, '') || `product-${Date.now()}`,
                images: product.images.length > 0 ? product.images : ['https://placehold.co/800x800?text=' + encodeURIComponent(product.name)],
                description: product.description || '',
                shortDescription: product.shortDescription || product.name || '',
                hasVariants: product.hasVariants,
                variants: product.hasVariants && product.variants.length > 0 ? product.variants : null,
            };

            const result = await ProductsAPI.create(createData);
            if (result.success) {
                toast.success('Produit créé avec succès');
                router.push('/admin/produits');
            } else {
                toast.error(result.error || 'Erreur lors de la création');
            }
        } catch (err) {
            toast.error('Erreur technique');
        } finally {
            setSaving(false);
        }
    };

    return (
        <form onSubmit={handleSave} className="space-y-6 md:space-y-8 p-4 md:p-8 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center space-x-3 md:space-x-4">
                    <button type="button" onClick={() => router.back()} className="p-2 md:p-3 bg-white border border-creme2 rounded-full hover:border-or transition-all group shrink-0">
                        <ArrowLeft size={18} className="text-encre3 group-hover:text-or" />
                    </button>
                    <div>
                        <h1 className="text-2xl md:text-3xl font-serif text-encre">Nouveau Produit</h1>
                        <p className="text-[9px] md:text-[10px] uppercase font-bold text-encre3 tracking-widest mt-1">Ajouter une référence au catalogue</p>
                    </div>
                </div>

                <div className="flex items-center">
                    <button 
                        type="submit"
                        disabled={saving || loadingCategories}
                        className="w-full md:w-auto px-6 md:px-8 py-3 bg-[#1A0A0A] text-creme rounded-sm text-xs font-bold uppercase tracking-widest hover:bg-black transition-all shadow-xl flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {saving ? <Loader size={16} className="animate-spin mr-2" /> : <Save size={16} className="mr-2 text-or" />}
                        <span>{saving ? 'Création...' : loadingCategories ? 'Chargement...' : 'Créer'}</span>
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    {/* General Info */}
                    <div className="bg-white border border-creme2 rounded-sm shadow-xl overflow-hidden">
                        <div className="p-6 border-b border-creme2 bg-creme/5 flex items-center space-x-3">
                            <Package size={18} className="text-or" />
                            <h2 className="text-xs font-black uppercase tracking-widest text-encre">Informations Générales</h2>
                        </div>
                        <div className="p-8 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase font-black tracking-widest text-encre3">Nom du produit</label>
                                    <input 
                                        type="text" 
                                        required
                                        placeholder="Ex: Vernis OPI Red"
                                        value={product.name}
                                        onChange={(e) => setProduct({...product, name: e.target.value})}
                                        className="w-full p-4 bg-creme2/20 border border-creme2 rounded-sm text-sm focus:border-or outline-none transition-all font-medium"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase font-black tracking-widest text-encre3">SKU (Référence)</label>
                                    <div className="w-full p-4 bg-creme2/10 border border-creme2 border-dashed rounded-sm text-sm text-encre3 font-mono italic">
                                        Généré automatiquement (ex: MEEY-001)
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] uppercase font-black tracking-widest text-encre3">Description courte</label>
                                <textarea 
                                    rows={2}
                                    placeholder="Résumé accrocheur pour la boutique (ex: Vernis rouge passion tenue longue durée...)"
                                    value={product.shortDescription}
                                    onChange={(e) => setProduct({...product, shortDescription: e.target.value})}
                                    className="w-full p-4 bg-creme2/20 border border-creme2 rounded-sm text-sm focus:border-or outline-none transition-all"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] uppercase font-black tracking-widest text-encre3">Description complète (Optionnel)</label>
                                <textarea 
                                    rows={5}
                                    placeholder="Détails techniques, conseils d'application, ingrédients..."
                                    value={product.description}
                                    onChange={(e) => setProduct({...product, description: e.target.value})}
                                    className="w-full p-4 bg-creme2/20 border border-creme2 rounded-sm text-sm focus:border-or outline-none transition-all"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Images Section */}
                    <div className="bg-white border border-creme2 rounded-sm shadow-xl overflow-hidden">
                        <div className="p-6 border-b border-creme2 bg-creme/5 flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <ImageIcon size={18} className="text-or" />
                                <h2 className="text-xs font-black uppercase tracking-widest text-encre">Images du produit</h2>
                            </div>
                            {uploading && (
                                <div className="flex items-center text-[10px] font-bold text-or uppercase animate-pulse">
                                    <Loader size={12} className="animate-spin mr-2" />
                                    Upload en cours...
                                </div>
                            )}
                        </div>
                        <div className="p-8 space-y-8">
                            {/* Upload Buttons */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-creme2 rounded-sm hover:border-or hover:bg-creme/30 transition-all cursor-pointer group">
                                    <div className="w-12 h-12 rounded-full bg-creme flex items-center justify-center mb-3 group-hover:bg-or/10">
                                        <Plus size={24} className="text-encre3 group-hover:text-or" />
                                    </div>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-encre">Appareil Photo / Galerie</span>
                                    <span className="text-[9px] text-encre3 mt-1">Prendre une photo ou choisir un fichier</span>
                                    <input 
                                        type="file" 
                                        accept="image/*"
                                        className="hidden" 
                                        onChange={handleFileUpload}
                                        disabled={uploading}
                                    />
                                </label>

                                <div className="flex flex-col space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-encre3 ml-1">Ajouter par URL</label>
                                    <div className="flex gap-2">
                                        <input 
                                            type="text" 
                                            placeholder="https://..."
                                            className="flex-grow p-4 bg-creme2/20 border border-creme2 rounded-sm text-sm focus:border-or outline-none"
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') {
                                                    e.preventDefault();
                                                    const val = (e.target as HTMLInputElement).value;
                                                    if (val && val.startsWith('http')) {
                                                        setProduct({...product, images: [...product.images, val]});
                                                        (e.target as HTMLInputElement).value = '';
                                                    }
                                                }
                                            }}
                                        />
                                        <button 
                                            type="button"
                                            onClick={() => {
                                                const input = document.querySelector('input[placeholder="https://..."]') as HTMLInputElement;
                                                if (input && input.value && input.value.startsWith('http')) {
                                                    setProduct({...product, images: [...product.images, input.value]});
                                                    input.value = '';
                                                }
                                            }}
                                            className="px-4 bg-encre text-creme text-[10px] font-bold uppercase tracking-widest rounded-sm"
                                        >
                                            OK
                                        </button>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {product.images.map((img: string, i: number) => (
                                    <div key={i} className="aspect-square bg-creme rounded-sm relative group overflow-hidden border border-creme2 shadow-sm">
                                        <Image src={img} fill className="object-cover" alt="" />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <button 
                                                type="button"
                                                onClick={() => {
                                                    const news = [...product.images];
                                                    news.splice(i, 1);
                                                    setProduct({...product, images: news});
                                                }}
                                                className="p-1.5 bg-rouge text-creme rounded-full z-10"
                                            >
                                                <X size={14} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Multi-References / Variants Section */}
                    <div className="bg-white border border-creme2 rounded-sm shadow-xl overflow-hidden">
                        <div className="p-6 border-b border-creme2 bg-creme/5 flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <Layers size={18} className="text-or" />
                                <h2 className="text-xs font-black uppercase tracking-widest text-encre">Multi-Références</h2>
                            </div>
                        </div>
                        <div className="p-8 space-y-6">
                            {/* Checkbox toggle */}
                            <label className="flex items-center space-x-3 cursor-pointer group">
                                <div className="relative">
                                    <input
                                        type="checkbox"
                                        checked={product.hasVariants}
                                        onChange={(e) => {
                                            setProduct({...product, hasVariants: e.target.checked, variants: e.target.checked ? product.variants : []});
                                        }}
                                        className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-creme2 peer-focus:ring-2 peer-focus:ring-or rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-creme2 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-or transition-colors"></div>
                                </div>
                                <div>
                                    <span className="text-sm font-bold text-encre group-hover:text-or transition-colors">Ce produit a plusieurs références</span>
                                    <p className="text-[10px] text-encre3 mt-0.5">Activez pour ajouter des variantes avec SKU et photo distincts</p>
                                </div>
                            </label>

                            {/* Variants list */}
                            {product.hasVariants && (
                                <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                                    {product.variants.map((variant: any, index: number) => (
                                        <div key={index} className="relative p-5 bg-creme/30 border border-creme2 rounded-sm space-y-4 hover:border-or transition-all">
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="text-[10px] font-black uppercase tracking-widest text-or">Variante #{index + 1}</span>
                                                <button
                                                    type="button"
                                                    onClick={() => removeVariant(index)}
                                                    className="p-1 text-encre3 hover:text-rouge hover:bg-rouge/10 rounded-full transition-all"
                                                >
                                                    <X size={14} />
                                                </button>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <label className="text-[9px] uppercase font-black tracking-widest text-encre3">SKU / Référence</label>
                                                    <input
                                                        type="text"
                                                        placeholder="MEY-001-RED"
                                                        value={variant.sku}
                                                        onChange={(e) => updateVariant(index, 'sku', e.target.value)}
                                                        className="w-full p-3 bg-white border border-creme2 rounded-sm text-sm focus:border-or outline-none transition-all font-mono"
                                                    />
                                                </div>
                                            </div>
                                            {/* Variant image */}
                                            <div className="space-y-2">
                                                <label className="text-[9px] uppercase font-black tracking-widest text-encre3">Photo de la variante</label>
                                                <div className="flex items-center gap-3">
                                                    {variant.image ? (
                                                        <div className="relative w-16 h-16 rounded-sm border border-creme2 overflow-hidden shrink-0">
                                                            <Image src={variant.image} fill className="object-cover" alt="Variante" />
                                                            <button
                                                                type="button"
                                                                onClick={() => updateVariant(index, 'image', '')}
                                                                className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center"
                                                            >
                                                                <X size={12} className="text-white" />
                                                            </button>
                                                        </div>
                                                    ) : null}
                                                    <label className="flex-grow flex items-center justify-center p-3 border-2 border-dashed border-creme2 rounded-sm hover:border-or hover:bg-creme/30 transition-all cursor-pointer">
                                                        <Plus size={16} className="text-encre3 mr-2" />
                                                        <span className="text-[10px] font-bold uppercase tracking-widest text-encre3">{variant.image ? 'Changer' : 'Ajouter photo'}</span>
                                                        <input
                                                            type="file"
                                                            accept="image/*"
                                                            className="hidden"
                                                            onChange={(e) => handleVariantImageUpload(e, index)}
                                                            disabled={uploading}
                                                        />
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                    ))}

                                    <button
                                        type="button"
                                        onClick={addVariant}
                                        className="w-full p-4 border-2 border-dashed border-creme2 rounded-sm text-encre3 hover:border-or hover:text-or hover:bg-or/5 transition-all flex items-center justify-center space-x-2"
                                    >
                                        <Plus size={16} />
                                        <span className="text-[10px] font-black uppercase tracking-widest">Ajouter une variante</span>
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="space-y-8">
                    {/* Pricing */}
                    <div className="bg-[#1A0A0A] text-creme rounded-sm shadow-2xl overflow-hidden border border-white/5">
                        <div className="p-6 border-b border-white/10 flex items-center space-x-3 bg-black/20">
                            <BarChart3 size={18} className="text-or" />
                            <h2 className="text-[10px] font-black uppercase tracking-widest text-creme/80">Gestion Financière & Tarifs</h2>
                        </div>
                        <div className="p-8 space-y-8">
                            {/* Cost Price */}
                            <div className="space-y-3">
                                <label className="text-[9px] uppercase font-black tracking-[0.2em] text-creme/40">Prix d'Achat d'Origine (Votre coût) *</label>
                                <div className="relative">
                                    <input 
                                        type="number" 
                                        required
                                        placeholder="0"
                                        value={product.costPrice || ''}
                                        onChange={(e) => setProduct({...product, costPrice: e.target.value})}
                                        className="w-full p-5 bg-white/5 border border-white/10 rounded-sm text-2xl font-bold text-creme/40 outline-none focus:border-white/20 appearance-none"
                                    />
                                    <span className="absolute right-5 top-1/2 -translate-y-1/2 text-creme/10 font-bold mult-sm">DA</span>
                                </div>
                            </div>

                            {/* Base Price (REQUIRED) */}
                            <div className="pt-6 border-t border-white/10 space-y-3">
                                <label className="text-[9px] uppercase font-black tracking-[0.2em] text-creme/40">Prix de Vente d'Origine (Requis) *</label>
                                <div className="relative group">
                                    <input 
                                        type="number" 
                                        required
                                        placeholder="0"
                                        value={product.comparePrice || ''}
                                        onChange={(e) => setProduct({...product, comparePrice: e.target.value})}
                                        className="w-full p-5 bg-white/5 border border-white/10 rounded-sm text-2xl font-bold text-creme/80 outline-none focus:border-creme/40 appearance-none transition-all"
                                    />
                                    <span className="absolute right-5 top-1/2 -translate-y-1/2 text-creme/20 font-black text-sm">DA</span>
                                </div>
                            </div>

                            {/* Promo Price (OPTIONAL) */}
                            <div className="pt-6 border-t border-white/10 space-y-3">
                                <label className="text-[9px] uppercase font-black tracking-[0.2em] text-creme/40">Prix de Vente après promotion (Optionnel)</label>
                                <div className="relative">
                                    <input 
                                        type="number" 
                                        placeholder="Laissez vide si pas de promotion"
                                        value={product.price || ''}
                                        onChange={(e) => setProduct({...product, price: e.target.value})}
                                        className="w-full p-5 bg-white/5 border border-white/10 rounded-sm text-2xl font-bold text-or outline-none focus:border-or appearance-none"
                                    />
                                    <span className="absolute right-5 top-1/2 -translate-y-1/2 text-or/20 font-black text-sm">DA</span>
                                </div>

                                {/* PROFITABILITY INDICATORS */}
                                {(product.price || product.comparePrice) && product.costPrice && (
                                    <div className={cn(
                                        "p-4 rounded-sm border flex items-center justify-between animate-in fade-in zoom-in-95 duration-500",
                                        (product.price ? Number(product.price) : Number(product.comparePrice)) > Number(product.costPrice) 
                                            ? "bg-green-500/10 border-green-500/20" 
                                            : "bg-rouge/10 border-rouge/20"
                                    )}>
                                        <div className="flex flex-col">
                                            <span className="text-[9px] uppercase font-black tracking-widest text-creme/40">Rentabilité</span>
                                            <span className={cn(
                                                "text-[10px] font-bold uppercase tracking-widest",
                                                (product.price ? Number(product.price) : Number(product.comparePrice)) > Number(product.costPrice) ? "text-green-400" : "text-rouge-mid"
                                            )}>
                                                {(product.price ? Number(product.price) : Number(product.comparePrice)) > Number(product.costPrice) ? 'Compatible (Profit)' : '⚠️ Incompatible (Perte)'}
                                            </span>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-[9px] uppercase font-black tracking-widest text-creme/40 block">Marge</span>
                                            <span className={cn(
                                                "text-lg font-mono font-black",
                                                (product.price ? Number(product.price) : Number(product.comparePrice)) > Number(product.costPrice) ? "text-creme" : "text-rouge-mid"
                                            )}>
                                                {(product.price ? Number(product.price) : Number(product.comparePrice)) - Number(product.costPrice)} DA
                                            </span>
                                            <span className="text-[10px] text-or block">
                                                ({Math.round((((product.price ? Number(product.price) : Number(product.comparePrice)) - Number(product.costPrice)) / (product.price ? Number(product.price) : Number(product.comparePrice))) * 100)}%)
                                            </span>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* EMPTY SPACE filler for layout consistency */}
                            <div className="pb-2"></div>
                            
                            <div className="pt-6 border-t border-white/10 space-y-3">
                                <label className="text-[9px] uppercase font-black tracking-[0.2em] text-creme/40">Inventaire Initial</label>
                                <input 
                                    type="number" 
                                    required
                                    placeholder="0"
                                    value={product.stock}
                                    onChange={(e) => setProduct({...product, stock: e.target.value})}
                                    className="w-full p-4 bg-white/5 border border-white/10 rounded-sm text-sm font-bold outline-none focus:border-or appearance-none"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Classification */}
                    <div className="bg-white border border-creme2 rounded-sm shadow-xl overflow-hidden">
                        <div className="p-6 border-b border-creme2 bg-creme/5 flex items-center space-x-3">
                            <Tag size={18} className="text-or" />
                            <h2 className="text-xs font-black uppercase tracking-widest text-encre">Catégorie</h2>
                        </div>
                        <div className="p-8 space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] uppercase font-black tracking-widest text-encre3">Catégorie Principale</label>
                                <select 
                                    required
                                    value={product.categoryId}
                                    onChange={(e) => setProduct({...product, categoryId: e.target.value, subCategoryId: ''})}
                                    disabled={loadingCategories}
                                    className="w-full p-4 bg-creme2/20 border border-creme2 rounded-sm text-sm font-bold outline-none focus:border-or transition-all disabled:opacity-60"
                                >
                                    {loadingCategories ? (
                                        <option value="">Chargement...</option>
                                    ) : categories.length > 0 ? (
                                        categories.map(cat => (
                                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                                        ))
                                    ) : (
                                        <option value="">Aucune catégorie</option>
                                    )}
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] uppercase font-black tracking-widest text-encre3">Sous-catégorie (Optionnel)</label>
                                <select 
                                    value={product.subCategoryId}
                                    onChange={(e) => setProduct({...product, subCategoryId: e.target.value})}
                                    disabled={loadingCategories || !product.categoryId}
                                    className="w-full p-4 bg-creme2/20 border border-creme2 rounded-sm text-sm font-bold outline-none focus:border-or transition-all disabled:opacity-60"
                                >
                                    <option value="">Aucune sous-catégorie</option>
                                    {categories.find(c => c.id === product.categoryId)?.subCategories?.map(sub => (
                                        <option key={sub.id} value={sub.id}>{sub.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Badge Selection */}
                    <div className="bg-white border border-creme2 rounded-sm shadow-xl overflow-hidden">
                        <div className="p-6 border-b border-creme2 bg-creme/5 flex items-center space-x-3">
                            <Tag size={18} className="text-or" />
                            <h2 className="text-xs font-black uppercase tracking-widest text-encre">Badge</h2>
                        </div>
                        <div className="p-8">
                            <div className="grid grid-cols-2 gap-2">
                                {[
                                    { id: 'none', label: 'Aucun', value: null },
                                    { id: 'new', label: 'Nouveau', value: 'new' },
                                    { id: 'top', label: 'Bestseller', value: 'top' },
                                    { id: 'promo', label: 'Promotion', value: 'promo' },
                                ].map((badge) => (
                                    <button
                                        key={badge.id}
                                        type="button"
                                        onClick={() => setProduct({...product, badge: badge.value})}
                                        className={cn(
                                            "py-2 px-3 text-[10px] font-bold uppercase tracking-widest rounded-sm border transition-all",
                                            product.badge === badge.value
                                                ? "bg-encre text-or border-encre"
                                                : "bg-creme/30 text-encre3 border-creme2 hover:border-or"
                                        )}
                                    >
                                        {badge.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Tip */}
                    <div className="p-6 bg-or/5 border border-or/10 rounded-sm">
                        <p className="text-[10px] text-encre3 leading-relaxed">
                            <span className="font-black text-or uppercase">CONSEIL :</span> Utilisez des noms clairs et des SKUs logiques pour faciliter la gestion de votre inventaire et vos futures recherches.
                        </p>
                    </div>
                </div>
            </div>
        </form>
    );
}
